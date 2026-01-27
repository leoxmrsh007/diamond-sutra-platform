/**
 * 六祖坛经章节 API
 * 获取指定章节的详细内容
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

// GET - 获取指定章节
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const chapter = await prisma.chapter.findUnique({
      where: { id },
      include: {
        sutra: true,
        sections: {
          orderBy: { sectionNum: 'asc' },
        },
      },
    })

    if (!chapter) {
      return NextResponse.json({ error: '章节不存在' }, { status: 404 })
    }

    return NextResponse.json({
      id: chapter.id,
      chapterNum: chapter.chapterNum,
      title: chapter.title,
      summary: chapter.summary,
      imageUrl: chapter.imageUrl,
      sutra: {
        id: chapter.sutra.id,
        title: chapter.sutra.title,
        slug: chapter.sutra.slug,
      },
      sections: chapter.sections.map((section) => ({
        id: section.id,
        sectionNum: section.sectionNum,
        title: section.title,
        heading: section.heading,
        content: section.content,
        modern: section.modern,
        notes: section.notes,
      })),
    })
  } catch (error) {
    console.error('获取章节失败:', error)
    return NextResponse.json({ error: '获取章节失败' }, { status: 500 })
  }
}
