/**
 * Chapter Detail API 路由
 * 获取特定章节的详情和所有偈颂
 */

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - 获取章节详情
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const chapter = await prisma.chapter.findUnique({
      where: { id },
      include: {
        sutra: true,
        verses: {
          orderBy: { verseNum: 'asc' },
          include: {
            commentaries: {
              orderBy: { order: 'asc' },
            },
          },
        },
      },
    });

    if (!chapter) {
      return NextResponse.json(
        { error: '章节不存在' },
        { status: 404 }
      );
    }

    return NextResponse.json(chapter);
  } catch (error) {
    console.error('Chapter Detail API 错误:', error);
    return NextResponse.json(
      { error: '获取章节详情失败' },
      { status: 500 }
    );
  }
}
