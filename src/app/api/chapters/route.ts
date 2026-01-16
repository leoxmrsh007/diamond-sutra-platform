/**
 * Chapters API 路由
 * 获取经文的所有章节
 */

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - 获取所有章节
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const sutraSlug = searchParams.get('sutra') || 'diamond-sutra';

    const chapters = await prisma.chapter.findMany({
      where: {
        sutra: {
          slug: sutraSlug,
        },
      },
      orderBy: { chapterNum: 'asc' },
      include: {
        verses: {
          orderBy: { verseNum: 'asc' },
        },
      },
    });

    return NextResponse.json(chapters);
  } catch (error) {
    console.error('Chapters API 错误:', error);
    return NextResponse.json(
      { error: '获取章节失败' },
      { status: 500 }
    );
  }
}
