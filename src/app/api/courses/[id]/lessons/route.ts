/**
 * Lessons API 路由
 * 课时管理
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

// GET - 获取课程的所有课时
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth();
    let userId: string | null = null;

    if (session?.user) {
      userId = (session.user as any).id;
    }

    // 验证课程存在
    const course = await prisma.course.findUnique({
      where: { id },
      select: {
        id: true,
        isPublished: true,
        teacherId: true,
      },
    });

    if (!course) {
      return NextResponse.json(
        { error: '课程不存在' },
        { status: 404 }
      );
    }

    // 如果课程未发布,只允许教师查看
    if (!course.isPublished && course.teacherId !== userId) {
      return NextResponse.json(
        { error: '课程尚未发布' },
        { status: 403 }
      );
    }

    const lessons = await prisma.lesson.findMany({
      where: { courseId: id },
      orderBy: { order: 'asc' },
    });

    return NextResponse.json(lessons);
  } catch (error) {
    console.error('获取课时列表失败:', error);
    return NextResponse.json(
      { error: '获取课时列表失败' },
      { status: 500 }
    );
  }
}

// POST - 创建课时（仅教师/管理员）
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        { error: '未登录' },
        { status: 401 }
      );
    }

    const user = (session.user as any);
    const course = await prisma.course.findUnique({
      where: { id },
    });

    if (!course) {
      return NextResponse.json(
        { error: '课程不存在' },
        { status: 404 }
      );
    }

    if (
      user.role !== 'ADMIN' &&
      course.teacherId !== user.id
    ) {
      return NextResponse.json(
        { error: '无权限添加课时' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { title, content, videoUrl, audioUrl } = body;

    if (!title) {
      return NextResponse.json(
        { error: '缺少课时标题' },
        { status: 400 }
      );
    }

    // 获取当前最大order
    const maxOrderLesson = await prisma.lesson.findFirst({
      where: { courseId: id },
      orderBy: { order: 'desc' },
    });

    const order = (maxOrderLesson?.order ?? 0) + 1;

    const lesson = await prisma.lesson.create({
      data: {
        courseId: id,
        title,
        content,
        videoUrl,
        audioUrl,
        order,
      },
    });

    return NextResponse.json(lesson, { status: 201 });
  } catch (error) {
    console.error('创建课时失败:', error);
    return NextResponse.json(
      { error: '创建课时失败' },
      { status: 500 }
    );
  }
}
