/**
 * Lesson Progress API 路由
 * 课时进度管理
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
    const { lessonId } = await params;
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        { error: '未登录' },
        { status: 401 }
      );
    }

    const userId = (session.user as any).id;

    const progress = await prisma.lessonProgress.findUnique({
      where: {
        userId_lessonId: {
          userId,
          lessonId,
        },
      },
    });

    return NextResponse.json(progress || { completed: false, progressPercent: 0 });
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

    // 更新或创建课时进度
    const progress = await prisma.lessonProgress.upsert({
      where: {
        userId_lessonId: {
          userId,
          lessonId,
        },
      },
      update: {
        completed: completed ?? false,
        progressPercent,
        completedAt: completed ? new Date() : null,
      },
      create: {
        userId,
        lessonId,
        completed: completed ?? false,
        progressPercent,
        completedAt: completed ? new Date() : null,
      },
    });

    // 如果课时完成，更新课程整体进度
    if (completed) {
      const allLessons = await prisma.lesson.findMany({
        where: { courseId },
      });

      const completedLessons = await prisma.lessonProgress.count({
        where: {
          userId,
          lessonId: {
            in: allLessons.map((l) => l.id),
          },
          completed: true,
        },
      });

      const courseProgress = (completedLessons / allLessons.length) * 100;

      // 更新课程报名进度
      const enrollment = await prisma.enrollment.findUnique({
        where: {
          userId_courseId: {
            userId,
            courseId,
          },
        },
      });

      if (enrollment) {
        await prisma.enrollment.update({
          where: {
            userId_courseId: {
              userId,
              courseId,
            },
          },
          data: {
            progress: courseProgress,
            completedAt: courseProgress >= 100 ? new Date() : null,
          },
        });
      }
    }

    return NextResponse.json(progress);
  } catch (error) {
    console.error('更新课时进度失败:', error);
    return NextResponse.json(
      { error: '更新课时进度失败' },
      { status: 500 }
    );
  }
}
