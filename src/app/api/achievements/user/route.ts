import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userAchievements = await prisma.userAchievement.findMany({
      where: { userId: session.user.id },
      include: {
        achievement: {
          select: {
            id: true,
            key: true,
            title: true,
            description: true,
            category: true,
            level: true,
            experience: true,
          },
        },
      },
      orderBy: { unlockedAt: 'desc' },
    });

    return NextResponse.json({
      success: true,
      userAchievements,
    });
  } catch (error) {
    console.error('User achievements API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user achievements' },
      { status: 500 }
    );
  }
}
