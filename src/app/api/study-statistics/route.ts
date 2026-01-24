/**
 * Study Statistics API 路由
 * 获取用户学习统计信息
 */

import { NextResponse } from 'next/server';
import type { Session } from 'next-auth';
import { ProgressStatus } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

export const dynamic = 'force-static';
export const fetchCache = 'force-cache';

const getSession = async (): Promise<Session | null> => (await auth()) as Session | null;

const assertSessionUser = (session: Session | null): session is Session & { user: Session['user'] } =>
  Boolean(session?.user);

// GET - 获取学习统计
export async function GET() {
  try {
    const session = await getSession();

    if (!assertSessionUser(session)) {
      return NextResponse.json(
        { error: '未登录' },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    // 获取总学习进度
    const [totalProgress, totalVerses, chaptersProgress, recentActivity] =
      await Promise.all([
        // 总学习进度
        prisma.studyProgress.count({
          where: { userId },
        }),
        // 总偈颂数（需要从数据库查询，这里简化处理）
        prisma.verse.count(),
        // 按章节统计进度
        prisma.studyProgress.groupBy({
          by: ['status'],
          where: { userId },
          _count: {
            verseId: true,
          },
        }),
        // 最近7天学习记录
        prisma.studyProgress.findMany({
          where: {
            userId,
            lastStudiedAt: {
              gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
            },
          },
          orderBy: { lastStudiedAt: 'desc' },
          include: {
            verse: {
              include: {
                chapter: true,
              },
            },
          },
        }),
      ]);

    // 计算统计信息
    const statusCounts: Record<ProgressStatus, number> = {
      NOT_STARTED: 0,
      LEARNING: 0,
      MEMORIZED: 0,
      MASTERED: 0,
    };

    for (const item of chaptersProgress) {
      statusCounts[item.status] = item._count.verseId;
    }

    const statistics = {
      totalVersesStudied: totalProgress,
      totalVerses: totalVerses,
      progressPercentage: totalVerses > 0
        ? Math.round((totalProgress / totalVerses) * 100)
        : 0,
      statusBreakdown: statusCounts,
      memorizedVerses: statusCounts.MEMORIZED || 0,
      masteredVerses: statusCounts.MASTERED || 0,
      recentlyStudied: recentActivity,
    };

    return NextResponse.json(statistics);
  } catch (error) {
    console.error('Study Statistics 错误:', error);
    return NextResponse.json(
      { error: '获取统计信息失败' },
      { status: 500 }
    );
  }
}
