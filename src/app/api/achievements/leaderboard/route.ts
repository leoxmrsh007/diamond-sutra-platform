import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const leaderboard = await prisma.user.findMany({
      take: 50,
      orderBy: [
        { level: 'desc' },
        { experience: 'desc' },
      ],
      include: {
        _count: {
          select: { achievements: true },
        },
      },
    });

    return NextResponse.json({
      success: true,
      leaderboard,
    });
  } catch (error) {
    console.error('Leaderboard API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch leaderboard' },
      { status: 500 }
    );
  }
}
