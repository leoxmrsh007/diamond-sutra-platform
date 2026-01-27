import { NextResponse } from 'next/server';
import type { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sutraSlug = searchParams.get('sutra');
  const limit = searchParams.get('limit');

  try {
    const where: Prisma.VerseWhereInput = {};

    // 按经文筛选
    if (sutraSlug) {
      where.chapter = {
        sutra: {
          slug: sutraSlug
        }
      };
    }

    const take = limit ? parseInt(limit) : undefined;

    // 只选择需要的字段，不返回 embedding, aiAnalysis 等大字段
    const verses = await prisma.verse.findMany({
      where,
      select: {
        id: true,
        chapterId: true,
        verseNum: true,
        chinese: true,
        english: true,
        sanskrit: true,
        tibetan: true,
        aiKeyword: true,
      },
      orderBy: [
        { chapter: { chapterNum: 'asc' } },
        { verseNum: 'asc' }
      ],
      take,
    });

    return NextResponse.json(verses);
  } catch (error) {
    console.error('Error fetching verses:', error);
    return NextResponse.json(
      { error: 'Failed to fetch verses', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
