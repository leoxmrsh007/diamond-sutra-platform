/**
 * 成语/术语提取API
 * Idioms and Terms Extraction API
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const scripture = searchParams.get('scripture') || 'diamond-sutra';
    const chapterNum = searchParams.get('chapterNum');
    const verseId = searchParams.get('verseId');
    const category = searchParams.get('category'); // IDIOM | TERM | ALLUSION | PRINCIPLE
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    let where: any = { scriptureId: scripture };

    if (chapterNum) {
      where.chapterNum = parseInt(chapterNum);
    }

    if (verseId) {
      where.verseId = verseId;
    }

    if (category) {
      where.category = category;
    }

    const [idioms, total] = await Promise.all([
      prisma.idiom.findMany({
        where,
        orderBy: {
          chapterNum: 'asc',
        },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.idiom.count({
        where,
      }),
    ]);

    return NextResponse.json({
      scripture,
      chapterNum,
      verseId,
      category,
      idioms: idioms.map(idiom => ({
        id: idiom.id,
        word: idiom.word,
        meaning: idiom.meaning,
        category: idiom.category,
        chapterNum: idiom.chapterNum,
        verseNum: idiom.verseNum,
        source: idiom.source,
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('获取成语失败:', error);
    return NextResponse.json(
      { error: '获取成语失败' },
      { status: 500 }
    );
  }
}
