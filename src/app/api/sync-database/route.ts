import { NextResponse } from 'next/server';
import type { CourseEnrollment, Chapter } from '@prisma/client';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-static';
export const fetchCache = 'force-cache';

type SyncDatabaseResult = {
  connected: boolean;
  hasLessonProgress: boolean;
  hasImageFields: boolean;
  enrollmentSample: { hasLessonProgress: boolean } | null;
  chapterSample: { hasImageUrl: boolean; hasImagePrompt: boolean } | null;
  error?: string;
};

export async function POST() {
  try {
    // 检查数据库连接
    await prisma.$connect();

    // 检查 lessonProgress 字段是否存在
    const testEnrollment: CourseEnrollment | null = await prisma.courseEnrollment.findFirst();
    const hasLessonProgress = Boolean(testEnrollment?.lessonProgress !== undefined);

    // 检查 Chapter 是否有 imageUrl 和 imagePrompt 字段
    const testChapter: Chapter | null = await prisma.chapter.findFirst();
    const hasImageFields = Boolean(testChapter && (testChapter.imageUrl !== null || testChapter.imagePrompt !== null));

    const result: SyncDatabaseResult = {
      connected: true,
      hasLessonProgress,
      hasImageFields,
      enrollmentSample: testEnrollment
        ? {
            hasLessonProgress: testEnrollment.lessonProgress !== undefined && testEnrollment.lessonProgress !== null,
          }
        : null,
      chapterSample: testChapter
        ? {
            hasImageUrl: testChapter.imageUrl !== null,
            hasImagePrompt: testChapter.imagePrompt !== null,
          }
        : null,
    };

    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    const result: SyncDatabaseResult = {
      connected: false,
      hasLessonProgress: false,
      hasImageFields: false,
      enrollmentSample: null,
      chapterSample: null,
      error: message,
    };
    return NextResponse.json(result, { status: 500 });
  }
}
