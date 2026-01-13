/**
 * Sutra API 路由
 * 获取经文信息
 */

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - 获取经文信息
export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const sutra = await prisma.sutra.findUnique({
      where: { slug: params.slug },
      include: {
        chapters: {
          orderBy: { chapterNum: 'asc' },
          include: {
            verses: {
              orderBy: { verseNum: 'asc' },
            },
          },
        },
      },
    });

    if (!sutra) {
      return NextResponse.json(
        { error: '经文不存在' },
        { status: 404 }
      );
    }

    return NextResponse.json(sutra);
  } catch (error) {
    console.error('Sutra API 错误:', error);
    return NextResponse.json(
      { error: '获取经文失败' },
      { status: 500 }
    );
  }
}
