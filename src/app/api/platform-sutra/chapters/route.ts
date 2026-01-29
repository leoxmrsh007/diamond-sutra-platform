import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const chapters = await prisma.chapter.findMany({
      where: { sutra: { slug: 'platform-sutra' } },
      select: {
        id: true,
        chapterNum: true,
        title: true,
        summary: true,
        _count: {
          select: { sections: true },
        },
      },
      orderBy: { chapterNum: 'asc' },
    });

    return NextResponse.json({
      success: true,
      data: chapters,
    });
  } catch (error) {
    console.error('获取章节数据失败:', error);
    return NextResponse.json(
      { success: false, error: '获取章节数据失败' },
      { status: 500 }
    );
  }
}
