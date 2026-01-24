import { NextResponse } from 'next/server';
import type { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const chapterNum = searchParams.get('chapter');
  const versionType = searchParams.get('version');

  try {
    const where: Prisma.VerseWhereInput = {};

    if (chapterNum) {
      const parsedChapter = Number(chapterNum);
      if (!Number.isNaN(parsedChapter)) {
        where.chapter = { is: { chapterNum: parsedChapter } };
      }
    }

    if (versionType) {
      where.versions = {
        some: {
          versionType: versionType
        }
      };
    }

    const verses = await prisma.verse.findMany({
      where,
      include: {
        chapter: true,
        versions: {
          orderBy: { versionType: 'asc' }
        }
      },
      orderBy: [
        { chapter: { chapterNum: 'asc' } },
        { verseNum: 'asc' }
      ],
    });

    return NextResponse.json({ verses });
  } catch (error) {
    console.error('Error fetching verses:', error);
    return NextResponse.json(
      { error: 'Failed to fetch verses' },
      { status: 500 }
    );
  }
}
