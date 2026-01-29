import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const sutra = await prisma.sutra.findUnique({
      where: { slug: 'platform-sutra' },
      select: {
        id: true,
        title: true,
        titleSanskrit: true,
        description: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: sutra,
    });
  } catch (error) {
    console.error('获取经书信息失败:', error);
    return NextResponse.json(
      { success: false, error: '获取经书信息失败' },
      { status: 500 }
    );
  }
}
