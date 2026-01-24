/**
 * Course Detail API 路由
 * 课程详情
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


// GET - 获取课程详情
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const userId: string | null = null;

    const course = await prisma.course.findUnique({
      where: { id },
      include: {
        lessons: { orderBy: { order: 'asc' } },
        ...(userId
          ? {
              enrollments: {
                where: { userId },
                select: { id: true, progress: true, completedAt: true },
              },
            }
          : {}),
      },
    });

    if (!course) {
      return NextResponse.json(
        { error: '课程不存在' },
        { status: 404 }
      );
    }

    // 检查用户是否已报名
    const isEnrolled = false;

    return NextResponse.json({
      ...course,
      isEnrolled,
      userProgress: 0,
      completedAt: null,
    });
  } catch (error) {
    console.error('获取课程详情失败:', error);
    return NextResponse.json(
      { error: '获取课程详情失败' },
      { status: 500 }
    );
  }
}

// PATCH - 更新课程（仅管理员/教师）
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getSession();

    if (!assertSessionUser(session)) {
      return NextResponse.json(
        { error: '未登录' },
        { status: 401 }
      );
    }

    const user = session.user;
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
        { error: '无权限修改此课程' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { title, description, coverImage, level, duration, isPublished } = body;

    const updatedCourse = await prisma.course.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(description && { description }),
        ...(coverImage !== undefined && { coverImage }),
        ...(level && { level }),
        ...(duration !== undefined && { duration }),
        ...(isPublished !== undefined && { isPublished }),
      },
    });

    return NextResponse.json(updatedCourse);
  } catch (error) {
    console.error('更新课程失败:', error);
    return NextResponse.json(
      { error: '更新课程失败' },
      { status: 500 }
    );
  }
}

// DELETE - 删除课程（仅管理员）
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getSession();

    if (!assertSessionUser(session)) {
      return NextResponse.json(
        { error: '未登录' },
        { status: 401 }
      );
    }

    const user = session.user;
    if (user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: '无权限删除课程' },
        { status: 403 }
      );
    }

    await prisma.course.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('删除课程失败:', error);
    return NextResponse.json(
      { error: '删除课程失败' },
      { status: 500 }
    );
  }
}
