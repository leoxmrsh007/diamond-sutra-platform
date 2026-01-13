/**
 * Verse API 路由
 * 获取偈颂详情
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

// GET - 获取偈颂详情
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const verse = await prisma.verse.findUnique({
      where: { id: params.id },
      include: {
        chapter: {
          include: {
            sutra: true,
          },
        },
        commentaries: {
          orderBy: { order: 'asc' },
        },
      },
    });

    if (!verse) {
      return NextResponse.json(
        { error: '偈颂不存在' },
        { status: 404 }
      );
    }

    // 如果用户已登录，获取用户的笔记和书签
    const session = await auth();
    let userNote = null;
    let isBookmarked = false;

    if (session?.user) {
      userNote = await prisma.note.findFirst({
        where: {
          userId: (session.user as any).id,
          verseId: id,
        },
      });

      const bookmark = await prisma.bookmark.findUnique({
        where: {
          userId_verseId: {
            userId: (session.user as any).id,
            verseId: id,
          },
        },
      });

      isBookmarked = !!bookmark;
    }

    return NextResponse.json({
      ...verse,
      userNote,
      isBookmarked,
    });
  } catch (error) {
    console.error('Verse API 错误:', error);
    return NextResponse.json(
      { error: '获取偈颂失败' },
      { status: 500 }
    );
  }
}
