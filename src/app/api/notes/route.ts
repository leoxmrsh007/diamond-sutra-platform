/**
 * 笔记 API 路由
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - 获取笔记列表
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const verseId = searchParams.get('verseId');

    if (!userId) {
      return NextResponse.json(
        { error: '用户ID不能为空' },
        { status: 400 }
      );
    }

    const where: any = { userId };
    if (verseId) {
      where.verseId = verseId;
    }

    const notes = await prisma.note.findMany({
      where,
      include: {
        verse: {
          select: {
            chinese: true,
            chapter: {
              select: {
                title: true,
                chapterNum: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ notes });
  } catch (error) {
    console.error('获取笔记失败:', error);
    return NextResponse.json(
      { error: '获取笔记失败' },
      { status: 500 }
    );
  }
}

// POST - 创建笔记
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, verseId, title, content, isPublic } = body;

    if (!userId || !verseId || !content) {
      return NextResponse.json(
        { error: '缺少必要参数' },
        { status: 400 }
      );
    }

    const note = await prisma.note.create({
      data: {
        userId,
        verseId,
        title,
        content,
        isPublic: isPublic || false,
      },
      include: {
        verse: {
          select: {
            chinese: true,
            chapter: {
              select: {
                title: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json({ note }, { status: 201 });
  } catch (error) {
    console.error('创建笔记失败:', error);
    return NextResponse.json(
      { error: '创建笔记失败' },
      { status: 500 }
    );
  }
}

// 配置
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
