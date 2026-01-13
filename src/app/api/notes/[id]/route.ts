/**
 * 单个笔记 API 路由
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

// PUT - 更新笔记
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        { error: '未登录' },
        { status: 401 }
      );
    }

    const userId = (session.user as any).id;

    // 验证笔记属于当前用户
    const existingNote = await prisma.note.findUnique({
      where: { id: params.id },
    });

    if (!existingNote) {
      return NextResponse.json(
        { error: '笔记不存在' },
        { status: 404 }
      );
    }

    if (existingNote.userId !== userId) {
      return NextResponse.json(
        { error: '无权修改此笔记' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { title, content, isPublic } = body;

    const note = await prisma.note.update({
      where: { id: params.id },
      data: {
        ...(title !== undefined && { title }),
        ...(content !== undefined && { content }),
        ...(isPublic !== undefined && { isPublic }),
      },
    });

    return NextResponse.json(note);
  } catch (error) {
    console.error('更新笔记失败:', error);
    return NextResponse.json(
      { error: '更新笔记失败' },
      { status: 500 }
    );
  }
}

// DELETE - 删除笔记
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        { error: '未登录' },
        { status: 401 }
      );
    }

    const userId = (session.user as any).id;

    // 验证笔记属于当前用户
    const existingNote = await prisma.note.findUnique({
      where: { id: params.id },
    });

    if (!existingNote) {
      return NextResponse.json(
        { error: '笔记不存在' },
        { status: 404 }
      );
    }

    if (existingNote.userId !== userId) {
      return NextResponse.json(
        { error: '无权删除此笔记' },
        { status: 403 }
      );
    }

    await prisma.note.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('删除笔记失败:', error);
    return NextResponse.json(
      { error: '删除笔记失败' },
      { status: 500 }
    );
  }
}

// 配置
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
