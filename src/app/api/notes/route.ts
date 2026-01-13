/**
 * 笔记 API 路由
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

// GET - 获取笔记列表
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
    const verseId = searchParams.get('verseId');
    const limit = parseInt(searchParams.get('limit') || '50');

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
      take: limit,
    });

    return NextResponse.json(notes);
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
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        { error: '未登录' },
        { status: 401 }
      );
    }

    const userId = (session.user as any).id;
    const body = await request.json();
    const { verseId, title, content, isPublic } = body;

    if (!verseId || !content) {
      return NextResponse.json(
        { error: '缺少必要参数' },
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

    return NextResponse.json(note, { status: 201 });
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
