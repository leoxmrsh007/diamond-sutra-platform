/**
 * 难点字注API
 * Difficult Characters Annotation API
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const scripture = searchParams.get('scripture') || 'diamond-sutra';
    const chapterId = searchParams.get('chapterId');
    const verseId = searchParams.get('verseId');

    let where: any = { scriptureId: scripture };

    if (chapterId) {
      // 查找指定章节的难点字
      const chapter = await prisma.chapter.findUnique({
        where: { id: chapterId },
        include: {
          verses: {
            select: { id: true, original: true },
            take: 10, // 只取前10个偈颂
          },
        },
      });

      if (!chapter) {
        return NextResponse.json(
          { error: '章节不存在' },
          { status: 404 }
        );
      }

      // 获取该章节所有偈颂的ID
      const verseIds = chapter.verses.map(v => v.id);

      // 查找与这些偈颂相关的难点字
      const chars = await prisma.difficultCharacter.findMany({
        where: {
          scriptureId: scripture,
        },
        orderBy: {
          frequency: 'desc', // 按频率排序
        },
        take: 50, // 限制数量
      });

      return NextResponse.json({
        scripture,
        chapterId,
        chapterNum: chapter.chapterNum,
        characters: chars,
        total: chars.length,
      });
    }

    if (verseId) {
      // 查找指定偈颂的难点字
      const verse = await prisma.verse.findUnique({
        where: { id: verseId },
        include: {
          chapter: {
            select: { chapterNum: true },
          },
        },
      });

      if (!verse) {
        return NextResponse.json(
          { error: '偈颂不存在' },
          { status: 404 }
        );
      }

      const chars = await prisma.difficultCharacter.findMany({
        where: {
          scriptureId: scripture,
        },
        orderBy: {
          frequency: 'desc',
        },
        take: 20,
      });

      return NextResponse.json({
        scripture,
        verseId,
        chapterNum: verse.chapter.chapterNum,
        verseNum: verse.verseNum,
        characters: chars,
        total: chars.length,
      });
    }

    // 查找所有难点字（分页）
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const skip = (page - 1) * limit;

    const [chars, total] = await Promise.all([
      prisma.difficultCharacter.findMany({
        where: { scriptureId: scripture },
        orderBy: {
          frequency: 'desc',
        },
        skip,
        take: limit,
      }),
      prisma.difficultCharacter.count({
        where: { scriptureId: scripture },
      }),
    ]);

    return NextResponse.json({
      scripture,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      characters: chars,
    });
  } catch (error) {
    console.error('获取难点字失败:', error);
    return NextResponse.json(
      { error: '获取难点字失败' },
      { status: 500 }
    );
  }
}
