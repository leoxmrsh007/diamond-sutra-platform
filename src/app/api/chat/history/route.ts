/**
 * AI Chat History API
 * 对话历史管理
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

// GET - 获取用户的对话历史列表
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
    const limit = parseInt(searchParams.get('limit') || '20');
    const sessionId = searchParams.get('sessionId');

    if (sessionId) {
      // 获取特定会话的所有消息
      const messages = await prisma.chatMessage.findMany({
        where: {
          session: {
            id: sessionId,
            userId,
          },
        },
        orderBy: { createdAt: 'asc' },
      });

      return NextResponse.json(messages);
    }

    // 获取会话列表
    const sessions = await prisma.chatSession.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
      take: limit,
      include: {
        _count: {
          select: { messages: true },
        },
      },
    });

    return NextResponse.json(sessions);
  } catch (error) {
    console.error('获取对话历史失败:', error);
    return NextResponse.json(
      { error: '获取对话历史失败' },
      { status: 500 }
    );
  }
}

// POST - 创建新会话或保存消息
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
    const { sessionId, role, content, title } = body;

    if (!role || !content) {
      return NextResponse.json(
        { error: '缺少必要参数' },
        { status: 400 }
      );
    }

    // 获取或创建会话
    let chatSession;
    if (sessionId) {
      chatSession = await prisma.chatSession.findFirst({
        where: {
          id: sessionId,
          userId,
        },
      });
    }

    if (!chatSession) {
      // 创建新会话
      const firstUserMessage = role === 'user' ? content.slice(0, 50) : '新对话';
      chatSession = await prisma.chatSession.create({
        data: {
          userId,
          title: title || firstUserMessage,
        },
      });
    }

    // 保存消息
    const message = await prisma.chatMessage.create({
      data: {
        sessionId: chatSession.id,
        role,
        content,
      },
    });

    // 更新会话时间
    await prisma.chatSession.update({
      where: { id: chatSession.id },
      data: { updatedAt: new Date() },
    });

    return NextResponse.json({
      message,
      sessionId: chatSession.id,
    });
  } catch (error) {
    console.error('保存对话失败:', error);
    return NextResponse.json(
      { error: '保存对话失败' },
      { status: 500 }
    );
  }
}

// DELETE - 删除会话
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
    const sessionId = searchParams.get('sessionId');

    if (!sessionId) {
      return NextResponse.json(
        { error: '缺少会话ID' },
        { status: 400 }
      );
    }

    // 验证会话属于当前用户
    const chatSession = await prisma.chatSession.findFirst({
      where: {
        id: sessionId,
        userId,
      },
    });

    if (!chatSession) {
      return NextResponse.json(
        { error: '会话不存在' },
        { status: 404 }
      );
    }

    // 删除会话及其消息
    await prisma.chatMessage.deleteMany({
      where: { sessionId },
    });

    await prisma.chatSession.delete({
      where: { id: sessionId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('删除对话失败:', error);
    return NextResponse.json(
      { error: '删除对话失败' },
      { status: 500 }
    );
  }
}
