/**
 * 帖子点赞 API - 支持用户点赞状态跟踪
 */

import { NextRequest, NextResponse } from 'next/server';
import type { Session } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

export const dynamic = 'force-dynamic';

const getSession = async (): Promise<Session | null> => (await auth()) as Session | null;

const assertSessionUser = (session: Session | null): session is Session & { user: Session['user'] } =>
  Boolean(session?.user);


// GET - 获取用户点赞状态
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: postId } = await params;
    const session = await getSession();

    if (!assertSessionUser(session)) {
      return NextResponse.json({
        liked: false,
        likeCount: 0,
      });
    }

    const userId = session.user.id;

    // 获取帖子和点赞状态
    const [post, existingLike] = await Promise.all([
      prisma.post.findUnique({
        where: { id: postId },
        select: { likeCount: true },
      }),
      prisma.postLike.findUnique({
        where: {
          userId_postId: {
            userId,
            postId,
          },
        },
      }),
    ]);

    if (!post) {
      return NextResponse.json(
        { error: '帖子不存在' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      liked: !!existingLike,
      likeCount: post.likeCount,
    });
  } catch (error) {
    console.error('获取点赞状态失败:', error);
    return NextResponse.json(
      { error: '获取点赞状态失败' },
      { status: 500 }
    );
  }
}


// POST - 点赞/取消点赞（切换状态）
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

    const userId = session.user.id;

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

    // 检查是否已点赞
    const existingLike = await prisma.postLike.findUnique({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
    });

    if (existingLike) {
      // 已点赞，取消点赞
      await prisma.$transaction([
        prisma.postLike.delete({
          where: {
            userId_postId: {
              userId,
              postId,
            },
          },
        }),
        prisma.post.update({
          where: { id: postId },
          data: {
            likeCount: { decrement: 1 },
          },
        }),
      ]);

      return NextResponse.json({
        success: true,
        liked: false,
        likeCount: Math.max(0, post.likeCount - 1),
      });
    } else {
      // 未点赞，添加点赞
      const [newLike] = await prisma.$transaction([
        prisma.postLike.create({
          data: {
            userId,
            postId,
          },
        }),
        prisma.post.update({
          where: { id: postId },
          data: {
            likeCount: { increment: 1 },
          },
        }),
      ]);

      return NextResponse.json({
        success: true,
        liked: true,
        likeCount: post.likeCount + 1,
      });
    }
  } catch (error) {
    console.error('点赞操作失败:', error);
    return NextResponse.json(
      { error: '点赞操作失败' },
      { status: 500 }
    );
  }
}


// DELETE - 取消点赞（明确取消）
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

    const userId = session.user.id;

    const post = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      return NextResponse.json(
        { error: '帖子不存在' },
        { status: 404 }
      );
    }

    // 检查是否已点赞
    const existingLike = await prisma.postLike.findUnique({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
    });

    if (!existingLike) {
      return NextResponse.json({
        success: true,
        liked: false,
        likeCount: post.likeCount,
      });
    }

    // 取消点赞
    await prisma.$transaction([
      prisma.postLike.delete({
        where: {
          userId_postId: {
            userId,
            postId,
          },
        },
      }),
      prisma.post.update({
        where: { id: postId },
        data: {
          likeCount: { decrement: 1 },
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
      liked: false,
      likeCount: Math.max(0, post.likeCount - 1),
    });
  } catch (error) {
    console.error('取消点赞失败:', error);
    return NextResponse.json(
      { error: '取消点赞失败' },
      { status: 500 }
    );
  }
}
