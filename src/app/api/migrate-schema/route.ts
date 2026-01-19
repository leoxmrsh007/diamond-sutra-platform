import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST() {
  const results = {
    success: false,
    message: '',
    changes: [] as string[],
  };

  try {
    // 检查并添加缺失的列
    // 检查 CourseEnrollment 表是否有 lessonProgress 列
    try {
      const testEnrollment = await prisma.$queryRaw`
        SELECT column_name
        FROM information_schema.columns
        WHERE table_name = 'course_enrollments'
        AND column_name = 'lessonProgress'
        LIMIT 1;
      `;

      if (!testEnrollment || (Array.isArray(testEnrollment) && testEnrollment.length === 0)) {
        // 添加 lessonProgress 列
        await prisma.$queryRaw`
          ALTER TABLE "course_enrollments"
          ADD COLUMN "lessonProgress" JSONB DEFAULT '{}';
        `;
        results.changes.push('Added lessonProgress column to course_enrollments');
      }
    } catch (e: any) {
      // 可能列已存在，继续
      if (!e.message.includes('already exists')) {
        results.changes.push(`lessonProgress check: ${e.message}`);
      }
    }

    // 检查 Chapter 表是否有 imageUrl 列
    try {
      const testChapter = await prisma.$queryRaw`
        SELECT column_name
        FROM information_schema.columns
        WHERE table_name = 'chapters'
        AND column_name = 'imageUrl'
        LIMIT 1;
      `;

      if (!testChapter || (Array.isArray(testChapter) && testChapter.length === 0)) {
        await prisma.$queryRaw`
          ALTER TABLE "chapters"
          ADD COLUMN "imageUrl" TEXT;
        `;
        results.changes.push('Added imageUrl column to chapters');
      }
    } catch (e: any) {
      if (!e.message.includes('already exists')) {
        results.changes.push(`imageUrl check: ${e.message}`);
      }
    }

    // 检查 Chapter 表是否有 imagePrompt 列
    try {
      const testChapter = await prisma.$queryRaw`
        SELECT column_name
        FROM information_schema.columns
        WHERE table_name = 'chapters'
        AND column_name = 'imagePrompt'
        LIMIT 1;
      `;

      if (!testChapter || (Array.isArray(testChapter) && testChapter.length === 0)) {
        await prisma.$queryRaw`
          ALTER TABLE "chapters"
          ADD COLUMN "imagePrompt" TEXT;
        `;
        results.changes.push('Added imagePrompt column to chapters');
      }
    } catch (e: any) {
      if (!e.message.includes('already exists')) {
        results.changes.push(`imagePrompt check: ${e.message}`);
      }
    }

    results.success = true;
    results.message = `Database schema synced. Changes: ${results.changes.length}`;

    return NextResponse.json(results);
  } catch (error: any) {
    results.success = false;
    results.message = error.message;
    return NextResponse.json(results, { status: 500 });
  }
}
