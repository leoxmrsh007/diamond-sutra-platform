/**
 * 每日签到 API 路由
 */

import { NextRequest, NextResponse } from 'next/server';
import type { Session } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

const getSession = async (): Promise<Session | null> => (await auth()) as Session | null;

const assertSessionUser = (session: Session | null): session is Session & { user: Session['user'] } =>
  Boolean(session?.user);

// GET - 获取签到记录
export async function GET(request: NextRequest) {
  try {
    const session = await getSession();

    if (!assertSessionUser(session)) {
      return NextResponse.json(
        { error: '未登录' },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    const { searchParams } = new URL(request.url);
    const year = parseInt(searchParams.get('year') || String(new Date().getFullYear()));
    const month = parseInt(searchParams.get('month') || String(new Date().getMonth() + 1));

    // 获取指定月份的签到记录
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const checkIns = await prisma.checkIn.findMany({
      where: {
        userId,
        checkInDate: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: { checkInDate: 'asc' },
    });

    const checkedDays = checkIns.map((checkIn) => checkIn.checkInDate.getDate());

    // 计算连续签到天数
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const todayCheckIn = checkIns.find(
      (c) => c.checkInDate.toDateString() === today.toDateString()
    );

    const latestCheckIn = await prisma.checkIn.findFirst({
      where: { userId },
      orderBy: { checkInDate: 'desc' },
    });

    const consecutiveDays = latestCheckIn?.consecutiveDays || 0;

    // 计算总签到天数
    const totalCheckIns = await prisma.checkIn.count({
      where: { userId },
    });

    return NextResponse.json({
      checkedDays,
      consecutiveDays,
      totalDays: totalCheckIns,
      lastCheckIn: latestCheckIn?.checkInDate,
      hasCheckedToday: !!todayCheckIn,
    });
  } catch (error) {
    console.error('获取签到记录失败:', error);
    return NextResponse.json(
      { error: '获取签到记录失败' },
      { status: 500 }
    );
  }
}

// POST - 执行签到
export async function POST() {
  try {
    const session = await getSession();

    if (!assertSessionUser(session)) {
      return NextResponse.json(
        { error: '未登录' },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // 检查今天是否已经签到
    const existingCheckIn = await prisma.checkIn.findUnique({
      where: {
        userId_checkInDate: {
          userId,
          checkInDate: today,
        },
      },
    });

    if (existingCheckIn) {
      return NextResponse.json(
        { error: '今天已经签到过了' },
        { status: 400 }
      );
    }

    // 计算连续签到天数
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const yesterdayCheckIn = await prisma.checkIn.findUnique({
      where: {
        userId_checkInDate: {
          userId,
          checkInDate: yesterday,
        },
      },
    });

    const consecutiveDays = yesterdayCheckIn
      ? yesterdayCheckIn.consecutiveDays + 1
      : 1;

    // 计算奖励（连续签到奖励）
    let rewardPoints = 10;
    let rewardMessage = '+10 经验值';

    if (consecutiveDays === 7) {
      rewardPoints = 20;
      rewardMessage = '+20 经验值（连续签到7天奖励）';
    } else if (consecutiveDays === 30) {
      rewardPoints = 50;
      rewardMessage = '+50 经验值（连续签到30天奖励）';
    } else if (consecutiveDays === 100) {
      rewardPoints = 100;
      rewardMessage = '+100 经验值（连续签到100天奖励）';
    }

    // 创建签到记录
    await prisma.checkIn.create({
      data: {
        userId,
        checkInDate: today,
        consecutiveDays,
        rewardPoints,
      },
    });

    return NextResponse.json({
      success: true,
      message: '签到成功！',
      consecutiveDays,
      reward: {
        type: 'exp',
        amount: rewardPoints,
        message: rewardMessage,
      },
    });
  } catch (error) {
    console.error('签到失败:', error);
    return NextResponse.json(
      { error: '签到失败' },
      { status: 500 }
    );
  }
}

// 配置
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
