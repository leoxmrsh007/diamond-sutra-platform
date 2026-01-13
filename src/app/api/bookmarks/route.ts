/**
 * Bookmarks API 路由
 * 管理用户书签
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

// GET - 获取用户书签列表
export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        { error: '未登录' },
        { status: 401 }
      );
    }

    const userId = (session.user as any).id;
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');

     const bookmarks = await prisma.bookmark.findMany({
      where: { userId },
      include: {
        verse: true,
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    return NextResponse.json(bookmarks);
  } catch (error) {
    console.error('Bookmarks GET 错误:', error);
    return NextResponse.json(
      { error: '获取书签失败' },
      { status: 500 }
    );
  }
}

// POST - 添加书签
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        { error: '未登录' },
        { status: 401 }
      );
    }

    const userId = (session.user as any).id;
    const body = await request.json();
    const { verseId, note } = body;

    if (!verseId) {
      return NextResponse.json(
        { error: '缺少偈颂ID' },
        { status: 400 }
      );
    }

    // 验证偈颂存在
    const verse = await prisma.verse.findUnique({
      where: { id: verseId },
    });

    if (!verse) {
      return NextResponse.json(
        { error: '偈颂不存在' },
        { status: 404 }
      );
    }

    // 创建或更新书签
    const bookmark = await prisma.bookmark.upsert({
      where: {
        userId_verseId: {
          userId,
          verseId,
        },
      },
      update: {
        note,
      },
      create: {
        userId,
        verseId,
        note,
      },
    });

    return NextResponse.json(bookmark);
  } catch (error) {
    console.error('Bookmarks POST 错误:', error);
    return NextResponse.json(
      { error: '添加书签失败' },
      { status: 500 }
    );
  }
}

// DELETE - 删除书签
export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        { error: '未登录' },
        { status: 401 }
      );
    }

    const userId = (session.user as any).id;
    const { searchParams } = new URL(request.url);
    const verseId = searchParams.get('verseId');
    const bookmarkId = searchParams.get('id');

    if (bookmarkId) {
      // 通过书签ID删除
      const bookmark = await prisma.bookmark.findUnique({
        where: { id: bookmarkId },
      });

      if (!bookmark) {
        return NextResponse.json(
          { error: '书签不存在' },
          { status: 404 }
        );
      }

      if (bookmark.userId !== userId) {
        return NextResponse.json(
          { error: '无权删除此书签' },
          { status: 403 }
        );
      }

      await prisma.bookmark.delete({
        where: { id: bookmarkId },
      });
    } else if (verseId) {
      // 通过偈颂ID删除
      await prisma.bookmark.delete({
        where: {
          userId_verseId: {
            userId,
            verseId,
          },
        },
      });
    } else {
      return NextResponse.json(
        { error: '缺少书签ID或偈颂ID' },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Bookmarks DELETE 错误:', error);
    return NextResponse.json(
      { error: '删除书签失败' },
      { status: 500 }
    );
  }
}
