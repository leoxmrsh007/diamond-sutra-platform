import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function POST() {
  try {
    const chapters = await prisma.chapter.findMany({
      where: { sutra: { slug: 'diamond-sutra' } },
      orderBy: { chapterNum: 'asc' },
      include: { verses: { select: { id: true } } },
    })

    let created = 0
    for (const ch of chapters) {
      if (!ch.verses || ch.verses.length === 0) {
        await prisma.verse.create({
          data: {
            chapterId: ch.id,
            verseNum: 1,
            chinese: '本章节内容正在整理中……',
            sanskrit: '',
            english: 'English translation is being prepared...',
            aiKeyword: [],
          },
        })
        created++
      }
    }

    return NextResponse.json({ success: true, created })
  } catch (e) {
    return NextResponse.json({ success: false, error: (e as Error).message }, { status: 500 })
  }
}

