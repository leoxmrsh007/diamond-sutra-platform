/**
 * Chapters API 路由
 * 获取经文的所有章节
 */

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

// GET - 获取所有章节（只返回元数据，不包含偈颂）
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const sutraSlug = searchParams.get('sutra') || 'diamond-sutra';

    // 只选择需要的字段，不返回 summary, imagePrompt 等大字段
    const chapters = await prisma.chapter.findMany({
      where: {
        sutra: {
          slug: sutraSlug,
        },
      },
      select: {
        id: true,
        chapterNum: true,
        title: true,
        summary: true,
        imageUrl: true,
      },
      orderBy: { chapterNum: 'asc' },
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
