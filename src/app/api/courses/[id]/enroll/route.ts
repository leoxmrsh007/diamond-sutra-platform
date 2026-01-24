/**
 * Course Enrollment API 路由
 * 课程报名
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


// POST - 报名课程
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: courseId } = await params;
    const session = await getSession();

    if (!assertSessionUser(session)) {
      return NextResponse.json(
        { error: '未登录' },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    // 验证课程存在且已发布
    const course = await prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      return NextResponse.json(
        { error: '课程不存在' },
        { status: 404 }
      );
    }

    if (!course.isPublished) {
      return NextResponse.json(
        { error: '课程尚未发布' },
        { status: 400 }
      );
    }

    // 检查是否已报名
    const existingEnrollment = await prisma.courseEnrollment.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
    });

    if (existingEnrollment) {
      return NextResponse.json(
        { error: '您已报名此课程' },
        { status: 400 }
      );
    }

    // 创建报名记录
    const enrollment = await prisma.courseEnrollment.create({
      data: {
        userId,
        courseId,
        progress: 0,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: '报名成功！',
        enrollment,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('课程报名失败:', error);
    return NextResponse.json(
      { error: '课程报名失败' },
      { status: 500 }
    );
  }
}

// DELETE - 取消报名
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

    const userId = session.user.id;

    await prisma.courseEnrollment.delete({
      where: {
        userId_courseId: {
          userId,
          courseId: id,
        },
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('取消报名失败:', error);
    return NextResponse.json(
      { error: '取消报名失败' },
      { status: 500 }
    );
  }
}
