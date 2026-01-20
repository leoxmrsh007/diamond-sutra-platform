import { NextResponse } from 'next/server';

export const dynamic = 'force-static';
export const fetchCache = 'force-cache';
import { prisma } from '@/lib/prisma';

export async function POST() {
  try {
    // 检查数据库连接
    await prisma.$connect();

    // 检查 lessonProgress 字段是否存在
    const testEnrollment = await prisma.courseEnrollment.findFirst();
    const hasLessonProgress = testEnrollment && 'lessonProgress' in testEnrollment;

    // 检查 Chapter 是否有 imageUrl 和 imagePrompt 字段
    const testChapter = await prisma.chapter.findFirst();
    const hasImageFields = testChapter && 'imageUrl' in testChapter;

    const result = {
      connected: true,
      hasLessonProgress,
      hasImageFields,
      enrollmentSample: testEnrollment ? {
        hasLessonProgress: (testEnrollment as any).lessonProgress !== undefined,
      } : null,
      chapterSample: testChapter ? {
        hasImageUrl: (testChapter as any).imageUrl !== undefined,
        hasImagePrompt: (testChapter as any).imagePrompt !== undefined,
      } : null,
    };

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({
      connected: false,
      error: error.message,
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
