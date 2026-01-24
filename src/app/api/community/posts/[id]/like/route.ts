/**
 * 帖子点赞 API
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


// POST - 点赞/取消点赞
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: postId } = await params;
    const session = await getSession();

    if (!assertSessionUser(session)) {
      return NextResponse.json(
        { error: '请先登录' },
        { status: 401 }
      );
    }

    // 检查帖子是否存在
    const post = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      return NextResponse.json(
        { error: '帖子不存在' },
        { status: 404 }
      );
    }

    // 简单的点赞实现：增加点赞数
    // 实际应用中应该使用单独的 Like 表来记录用户点赞状态
    const updated = await prisma.post.update({
      where: { id: postId },
      data: {
        likeCount: { increment: 1 },
      },
    });

    return NextResponse.json({
      success: true,
      likeCount: updated.likeCount,
    });
  } catch (error) {
    console.error('点赞失败:', error);
    return NextResponse.json(
      { error: '点赞失败' },
      { status: 500 }
    );
  }
}

// DELETE - 取消点赞
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: postId } = await params;
    const session = await getSession();

    if (!assertSessionUser(session)) {
      return NextResponse.json(
        { error: '请先登录' },
        { status: 401 }
      );
    }

    const post = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      return NextResponse.json(
        { error: '帖子不存在' },
        { status: 404 }
      );
    }

    const updated = await prisma.post.update({
      where: { id: postId },
      data: {
        likeCount: { decrement: 1 },
      },
    });

    return NextResponse.json({
      success: true,
      likeCount: Math.max(0, updated.likeCount),
    });
  } catch (error) {
    console.error('取消点赞失败:', error);
    return NextResponse.json(
      { error: '取消点赞失败' },
      { status: 500 }
    );
  }
}
