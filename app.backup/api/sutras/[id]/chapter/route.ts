/**
 * 六祖坛经 API 路由
 * 修复类型错误
 */

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// 获取单个章节的完整信息（包含段落）
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // 查询章节及其所有段落
    const chapter = await prisma.chapter.findUnique({
      where: { id },
      include: {
        sutra: true,
        sections: {
          orderBy: { sectionNum: 'asc' },
          select: {
            id: true,
            sectionNum: true,
            content: true,
            heading: true,
            modern: true,
            notes: true,
          },
        },
      },
    });

    if (!chapter) {
      return NextResponse.json(
        { error: 'Chapter not found' },
        { status: 404 }
      );
    }

    // 添加缓存控制头
    const response = NextResponse.json(chapter);
    response.headers.set('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate');
    
    return response;
  } catch (error) {
    console.error('Error fetching chapter:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// 获取单个章节的段落列表
export async function GETSECTIONS(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // 只查询段落数据
    const sections = await prisma.section.findMany({
      where: { chapterId: id },
      orderBy: { sectionNum: 'asc' },
      select: {
        id: true,
        sectionNum: true,
        content: true,
        heading: true,
        modern: true,
        notes: true,
      },
    });

    // 添加缓存控制头
    const response = NextResponse.json({ sections });
    response.headers.set('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate');
    
    return response;
  } catch (error) {
    console.error('Error fetching chapter sections:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
