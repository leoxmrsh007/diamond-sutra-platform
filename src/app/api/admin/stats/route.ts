import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const [
      totalUsers,
      totalPosts,
      newUsers,
      newPosts,
      activeUsers,
      studyProgress,
      totalStudyTime,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.post.count(),
      prisma.user.count({
        where: {
          createdAt: { gte: thirtyDaysAgo },
        },
      }),
      prisma.post.count({
        where: {
          createdAt: { gte: thirtyDaysAgo },
        },
      }),
      prisma.user.count({
        where: {
          updatedAt: { gte: sevenDaysAgo },
        },
      }),
      prisma.studyProgress.count(),
      prisma.studyProgress.aggregate({
        _sum: {
          recitationCount: true,
        },
      }),
    ]);

    // Calculate growth percentages
    const userGrowth = totalUsers > 0 ? `+${Math.round((newUsers / totalUsers) * 100)}%` : '+0%';
    const postGrowth = totalPosts > 0 ? `+${Math.round((newPosts / totalPosts) * 100)}%` : '+0%';

    return NextResponse.json({
      success: true,
      stats: {
        totalUsers,
        totalPosts,
        studyProgress,
        activeSessions: activeUsers,
        newUsers,
        newPosts,
        activeUsers,
        totalStudyTime: totalStudyTime._sum.recitationCount || 0,
        userGrowth,
        postGrowth,
      },
    });
  } catch (error) {
    console.error('Stats API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}
