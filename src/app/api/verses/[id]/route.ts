/**
 * Verse API 路由
 * 获取偈颂详情
 */

import { NextRequest, NextResponse } from 'next/server';
import type { Session } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

export const dynamic = 'force-static';
export const fetchCache = 'force-cache';

const getSession = async (): Promise<Session | null> => (await auth()) as Session | null;

const assertSessionUser = (session: Session | null): session is Session & { user: Session['user'] } =>
  Boolean(session?.user);


// GET - 获取偈颂详情
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const verse = await prisma.verse.findUnique({
      where: { id },
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
    const session = await getSession();
    let userNote = null;
    let isBookmarked = false;

    if (assertSessionUser(session)) {
      userNote = await prisma.note.findFirst({
        where: {
          userId: session.user.id,
          verseId: id,
        },
      });

      const bookmark = await prisma.bookmark.findUnique({
        where: {
          userId_verseId: {
            userId: session.user.id,
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
