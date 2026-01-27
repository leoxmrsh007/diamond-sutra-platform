/**
 * 六祖坛经 API
 * 获取章节和段落数据
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

// GET - 获取六祖坛经所有章节
export async function GET() {
  try {
    // 获取六祖坛经
    const sutra = await prisma.sutra.findUnique({
      where: { slug: 'platform-sutra' },
    })

    if (!sutra) {
      return NextResponse.json({ error: '六祖坛经未找到' }, { status: 404 })
    }

    // 获取所有章节
    const chapters = await prisma.chapter.findMany({
      where: { sutraId: sutra.id },
      orderBy: { chapterNum: 'asc' },
      include: {
        sections: {
          orderBy: { sectionNum: 'asc' },
        },
      },
    })

    return NextResponse.json({
      sutra,
      chapters: chapters.map((chapter) => ({
        id: chapter.id,
        chapterNum: chapter.chapterNum,
        title: chapter.title,
        summary: chapter.summary,
        sections: chapter.sections.map((section) => ({
          id: section.id,
          sectionNum: section.sectionNum,
          title: section.title,
          heading: section.heading,
          content: section.content,
          modern: section.modern,
          notes: section.notes,
        })),
      })),
    })
  } catch (error) {
    console.error('获取六祖坛经数据失败:', error)
    return NextResponse.json({ error: '获取数据失败' }, { status: 500 })
  }
}
