/**
 * Study Progress API 路由
 * 管理用户学习进度
 */

import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-static';
export const fetchCache = 'force-cache';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

// GET - 获取用户学习进度
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

    if (verseId) {
      // 获取特定偈颂的学习进度
      const progress = await prisma.studyProgress.findUnique({
        where: {
          userId_verseId: {
            userId,
            verseId,
          },
        },
      });

      return NextResponse.json(progress);
    }

    // 获取所有学习进度
    const progress = await prisma.studyProgress.findMany({
      where: { userId },
      include: {
        verse: {
          include: {
            chapter: {
              include: {
                sutra: true,
              },
            },
          },
        },
      },
      orderBy: { lastStudiedAt: 'desc' },
    });

    return NextResponse.json(progress);
  } catch (error) {
    console.error('Study Progress GET 错误:', error);
    return NextResponse.json(
      { error: '获取学习进度失败' },
      { status: 500 }
    );
  }
}

// POST - 更新或创建学习进度
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
    const { verseId, status, recitationCount } = body;

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

    // 更新或创建学习进度
    const progress = await prisma.studyProgress.upsert({
      where: {
        userId_verseId: {
          userId,
          verseId,
        },
      },
      update: {
        status: status,
        recitationCount: recitationCount ?? undefined,
        lastStudiedAt: new Date(),
      },
      create: {
        userId,
        verseId,
        status: status || 'LEARNING',
        recitationCount: recitationCount || 0,
        lastStudiedAt: new Date(),
      },
    });

    return NextResponse.json(progress);
  } catch (error) {
    console.error('Study Progress POST 错误:', error);
    return NextResponse.json(
      { error: '更新学习进度失败' },
      { status: 500 }
    );
  }
}

// PATCH - 部分更新学习进度
export async function PATCH(request: NextRequest) {
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
    const { verseId, status, recitationCount } = body;

    if (!verseId) {
      return NextResponse.json(
        { error: '缺少偈颂ID' },
        { status: 400 }
      );
    }

    const progress = await prisma.studyProgress.update({
      where: {
        userId_verseId: {
          userId,
          verseId,
        },
      },
      data: {
        ...(status && { status }),
        ...(recitationCount !== undefined && { recitationCount }),
        lastStudiedAt: new Date(),
      },
    });

    return NextResponse.json(progress);
  } catch (error) {
    console.error('Study Progress PATCH 错误:', error);
    return NextResponse.json(
      { error: '更新学习进度失败' },
      { status: 500 }
    );
  }
}

// DELETE - 删除学习进度
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

    if (!verseId) {
      return NextResponse.json(
        { error: '缺少偈颂ID' },
        { status: 400 }
      );
    }

    await prisma.studyProgress.delete({
      where: {
        userId_verseId: {
          userId,
          verseId,
        },
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Study Progress DELETE 错误:', error);
    return NextResponse.json(
      { error: '删除学习进度失败' },
      { status: 500 }
    );
  }
}
