/**
 * 每日签到 API 路由
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// 签到记录类型
interface CheckInRecord {
  userId: string;
  checkInDate: string;
  consecutiveDays: number;
}

// GET - 获取签到记录
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const year = searchParams.get('year');
    const month = searchParams.get('month');

    if (!userId) {
      return NextResponse.json(
        { error: '用户ID不能为空' },
        { status: 400 }
      );
    }

    // 获取用户签到统计
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        studyProgress: {
          select: {
            lastStudiedAt: true,
          },
          orderBy: {
            lastStudiedAt: 'desc',
          },
          take: 1,
        },
      },
    });

    // 模拟签到记录（实际应该从数据库查询）
    const today = new Date();
    const checkInYear = parseInt(year || String(today.getFullYear()));
    const checkInMonth = parseInt(month || String(today.getMonth() + 1));

    const daysInMonth = new Date(checkInYear, checkInMonth, 0).getDate();

    // 模拟签到日期
    const checkedDays = Array.from({ length: today.getDate() }, (_, i) => i + 1)
      .filter(() => Math.random() > 0.3);

    // 计算连续签到天数
    let consecutiveDays = 7;
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    // 检查昨天是否签到
    const yesterdayChecked = checkedDays.includes(yesterday.getDate());
    if (!yesterdayChecked && checkedDays.includes(today.getDate())) {
      consecutiveDays = 1;
    }

    return NextResponse.json({
      checkedDays,
      consecutiveDays,
      totalDays: 45,
      lastCheckIn: user?.studyProgress[0]?.lastStudiedAt,
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
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId } = body;

    if (!userId) {
      return NextResponse.json(
        { error: '用户ID不能为空' },
        { status: 400 }
      );
    }

    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];

    // 检查今天是否已经签到
    // 实际实现中应该查询数据库
    const alreadyChecked = Math.random() > 0.8;

    if (alreadyChecked) {
      return NextResponse.json(
        { error: '今天已经签到过了' },
        { status: 400 }
      );
    }

    // 执行签到
    // 实际实现中应该创建签到记录或更新学习进度
    const consecutiveDays = Math.floor(Math.random() * 30) + 1;

    return NextResponse.json({
      success: true,
      message: '签到成功！',
      consecutiveDays,
      reward: {
        type: 'exp',
        amount: 10,
        message: '+10 经验值',
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
