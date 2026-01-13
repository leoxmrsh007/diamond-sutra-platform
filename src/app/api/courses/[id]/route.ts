/**
 * Course Detail API 路由
 * 课程详情
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

// GET - 获取课程详情
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    let userId: string | null = null;

    if (session?.user) {
      userId = (session.user as any).id;
    }

    const course = await prisma.course.findUnique({
      where: { id: params.id },
      include: {
        lessons: {
          orderBy: { order: 'asc' },
        },
        enrollments: {
          where: userId ? { userId } : undefined,
          select: {
            id: true,
            progress: true,
            completedAt: true,
          },
        },
      },
    });

    if (!course) {
      return NextResponse.json(
        { error: '课程不存在' },
        { status: 404 }
      );
    }

    // 检查用户是否已报名
    const enrollment = course.enrollments[0];
    const isEnrolled = !!enrollment;

    return NextResponse.json({
      ...course,
      isEnrolled,
      userProgress: enrollment?.progress || 0,
      completedAt: enrollment?.completedAt || null,
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

    const user = (session.user as any);
    const course = await prisma.course.findUnique({
      where: { id: params.id },
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
      where: { id: params.id },
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

    const user = (session.user as any);
    if (user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: '无权限删除课程' },
        { status: 403 }
      );
    }

    await prisma.course.delete({
      where: { id: params.id },
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
