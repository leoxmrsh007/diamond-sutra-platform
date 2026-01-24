/**
 * Courses API 路由
 * 课程列表和管理
 */

import { NextRequest, NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import type { Session } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

export const dynamic = 'force-static';
export const fetchCache = 'force-cache';

// GET - 获取课程列表
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const level = searchParams.get('level'); // BEGINNER, INTERMEDIATE, ADVANCED
    const isPublished = searchParams.get('published') !== 'false'; // 默认只显示已发布的课程

    const session = (await auth()) as Session | null;
    const userId = session?.user?.id ?? null;

    const where: Prisma.CourseWhereInput = {};
    if (level) {
      where.level = level as Prisma.CourseWhereInput['level'];
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
    const coursesWithEnrollment = courses.map(({ enrollments, ...courseData }) => ({
      ...courseData,
      studentCount: enrollments.length,
      isEnrolled: userId ? enrollments.some((enrollment) => enrollment.userId === userId) : false,
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
    const session = (await auth()) as Session | null;

    if (!session?.user) {
      return NextResponse.json(
        { error: '未登录' },
        { status: 401 }
      );
    }

    const user = session.user;
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
