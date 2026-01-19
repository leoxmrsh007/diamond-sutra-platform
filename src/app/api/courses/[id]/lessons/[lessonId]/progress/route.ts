/**
 * Lesson Progress API 路由
 * 课时进度管理（使用 CourseEnrollment 的 lessonProgress JSON 字段）
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

// GET - 获取课时进度
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; lessonId: string }> }
) {
  try {
    const { lessonId, id: courseId } = await params;
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        { error: '未登录' },
        { status: 401 }
      );
    }

    const userId = (session.user as any).id;

    const enrollment = await prisma.courseEnrollment.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
    });

    const lessonProgress = (enrollment?.lessonProgress as any)?.[lessonId] || {
      completed: false,
      progressPercent: 0,
    };

    return NextResponse.json(lessonProgress);
  } catch (error) {
    console.error('获取课时进度失败:', error);
    return NextResponse.json(
      { error: '获取课时进度失败' },
      { status: 500 }
    );
  }
}

// POST - 更新课时进度
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; lessonId: string }> }
) {
  try {
    const { lessonId, id: courseId } = await params;
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        { error: '未登录' },
        { status: 401 }
      );
    }

    const userId = (session.user as any).id;
    const body = await request.json();
    const { completed, progressPercent = 0 } = body;

    // 验证课程和课时存在
    const lesson = await prisma.lesson.findFirst({
      where: {
        id: lessonId,
        courseId,
      },
    });

    if (!lesson) {
      return NextResponse.json(
        { error: '课时不存在' },
        { status: 404 }
      );
    }

    // 获取或创建课程报名
    const enrollment = await prisma.courseEnrollment.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
    });

    const currentProgress = (enrollment?.lessonProgress as any) || {};
    const updatedLessonProgress = {
      completed: completed ?? false,
      progressPercent,
      completedAt: completed ? new Date().toISOString() : null,
    };

    // 计算整体课程进度
    const allLessons = await prisma.lesson.findMany({
      where: { courseId },
    });

    const updatedProgress = {
      ...currentProgress,
      [lessonId]: updatedLessonProgress,
    };

    const completedCount = Object.values(updatedProgress).filter(
      (v: any) => v.completed
    ).length;
    const courseProgress = (completedCount / allLessons.length) * 100;

    // 更新或创建报名记录
    await prisma.courseEnrollment.upsert({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
      update: {
        progress: courseProgress,
        lessonProgress: updatedProgress as any,
        completedAt: courseProgress >= 100 ? new Date() : null,
      },
      create: {
        userId,
        courseId,
        progress: courseProgress,
        lessonProgress: updatedProgress as any,
      },
    });

    return NextResponse.json(updatedLessonProgress);
  } catch (error) {
    console.error('更新课时进度失败:', error);
    return NextResponse.json(
      { error: '更新课时进度失败' },
      { status: 500 }
    );
  }
}
