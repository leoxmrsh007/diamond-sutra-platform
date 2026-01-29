import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  
  try {
    const chapterNum = Number(id);
    
    if (isNaN(chapterNum) || chapterNum < 1 || chapterNum > 10) {
      return NextResponse.json(
        { success: false, error: '无效的章节号' },
        { status: 400 }
      );
    }

    const selectedChapter = await prisma.chapter.findFirst({
      where: {
        sutra: { slug: 'platform-sutra' },
        chapterNum: chapterNum,
      },
      include: {
        sections: {
          orderBy: { sectionNum: 'asc' },
        },
      },
    });

    if (!selectedChapter) {
      return NextResponse.json(
        { success: false, error: '章节未找到' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: selectedChapter,
    });
  } catch (error) {
    console.error('获取章节失败:', error);
    return NextResponse.json(
      { success: false, error: '获取章节失败' },
      { status: 500 }
    );
  }
}
