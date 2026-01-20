/**
 * 社区帖子 API
 * 支持创建、获取、更新帖子
 */

import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-static';
export const fetchCache = 'force-cache';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

// GET - 获取帖子列表
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');
    const tab = searchParams.get('tab') || 'latest'; // latest, hot, following

    let orderBy: any = { createdAt: 'desc' };
    if (tab === 'hot') {
      orderBy = { likeCount: 'desc' };
    }

    const posts = await prisma.post.findMany({
      take: limit,
      skip: offset,
      orderBy,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        _count: {
          select: {
            comments: true,
          },
        },
      },
    });

    // 格式化返回数据
    const formattedPosts = posts.map((post) => ({
      id: post.id,
      title: post.title,
      content: post.content,
      tags: (post.tags as any[]) || [],
      likeCount: post.likeCount,
      commentCount: post._count.comments,
      createdAt: post.createdAt,
      author: {
        id: post.user.id,
        name: post.user.name || '匿名',
        avatar: post.user.image,
      },
    }));

    return NextResponse.json(formattedPosts);
  } catch (error) {
    console.error('获取帖子列表失败:', error);
    return NextResponse.json(
      { error: '获取帖子列表失败' },
      { status: 500 }
    );
  }
}

// POST - 创建新帖子
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        { error: '请先登录' },
        { status: 401 }
      );
    }

    const userId = (session.user as any).id;
    const body = await request.json();
    const { title, content, tags = [] } = body;

    if (!title || !content) {
      return NextResponse.json(
        { error: '标题和内容不能为空' },
        { status: 400 }
      );
    }

    // 验证内容长度
    if (title.length > 100) {
      return NextResponse.json(
        { error: '标题不能超过100字' },
        { status: 400 }
      );
    }

    if (content.length > 5000) {
      return NextResponse.json(
        { error: '内容不能超过5000字' },
        { status: 400 }
      );
    }

    const post = await prisma.post.create({
      data: {
        userId,
        title,
        content,
        tags,
        likeCount: 0,
        commentCount: 0,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });

    return NextResponse.json({
      id: post.id,
      title: post.title,
      content: post.content,
      tags: post.tags,
      createdAt: post.createdAt,
      author: {
        id: post.user.id,
        name: post.user.name || '匿名',
        avatar: post.user.image,
      },
    });
  } catch (error) {
    console.error('创建帖子失败:', error);
    return NextResponse.json(
      { error: '创建帖子失败' },
      { status: 500 }
    );
  }
}
