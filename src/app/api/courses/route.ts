/**
 * Courses API 路由
 * 课程列表和管理
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

// GET - 获取课程列表
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const level = searchParams.get('level'); // BEGINNER, INTERMEDIATE, ADVANCED
    const isPublished = searchParams.get('published') !== 'false'; // 默认只显示已发布的课程

    const where: any = {};
    if (level) {
      where.level = level;
    }
    if (isPublished) {
      where.isPublished = true;
    }

    const courses = await prisma.course.findMany({
      where,
      include: {
        lessons: {
          orderBy: { order: 'asc' },
          select: {
            id: true,
            title: true,
            order: true,
          },
        },
        enrollments: {
          where: {
            user: {
              email: { not: null },
            },
          },
          select: {
            userId: true,
          },
        },
      },
      orderBy: { order: 'asc' },
    });

    // 如果用户已登录，标记已报名的课程
    const session = await auth();
    let enrolledCourseIds: string[] = [];

    if (session?.user) {
      const userId = (session.user as any).id;
      const enrollments = await prisma.courseEnrollment.findMany({
        where: { userId },
        select: { courseId: true },
      });
      enrolledCourseIds = enrollments.map((e) => e.courseId);
    }

    const coursesWithEnrollment = courses.map((course) => ({
      ...course,
      isEnrolled: enrolledCourseIds.includes(course.id),
      studentCount: course.enrollments.length,
    }));

    return NextResponse.json(coursesWithEnrollment);
  } catch (error) {
    console.error('获取课程列表失败:', error);
    return NextResponse.json(
      { error: '获取课程列表失败' },
      { status: 500 }
    );
  }
}

// POST - 创建课程（仅管理员）
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        { error: '未登录' },
        { status: 401 }
      );
    }

    const user = (session.user as any);
    if (user.role !== 'ADMIN' && user.role !== 'TEACHER') {
      return NextResponse.json(
        { error: '无权限创建课程' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { title, description, coverImage, level, duration } = body;

    if (!title || !description) {
      return NextResponse.json(
        { error: '缺少必要参数' },
        { status: 400 }
      );
    }

    const course = await prisma.course.create({
      data: {
        title,
        description,
        coverImage,
        teacherId: user.id,
        level: level || 'BEGINNER',
        duration,
        isPublished: false, // 默认为未发布
      },
    });

    return NextResponse.json(course, { status: 201 });
  } catch (error) {
    console.error('创建课程失败:', error);
    return NextResponse.json(
      { error: '创建课程失败' },
      { status: 500 }
    );
  }
}
