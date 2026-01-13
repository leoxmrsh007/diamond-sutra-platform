/**
 * Study Statistics API 路由
 * 获取用户学习统计信息
 */

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

// GET - 获取学习统计
export async function GET(request: Request) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        { error: '未登录' },
        { status: 401 }
      );
    }

    const userId = (session.user as any).id;

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
    const statusCounts = chaptersProgress.reduce((acc, item) => {
      acc[item.status] = item._count.verseId;
      return acc;
    }, {} as Record<string, number>);

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
