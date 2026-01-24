import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

type VerseInput = {
  verseNum: number
  chinese: string
  sanskrit?: string
  english?: string
}

type ChapterInput = {
  chapterNum: number
  title?: string
  summary?: string
  verses: VerseInput[]
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const sutraSlug = String(body.sutraSlug || 'diamond-sutra')
    const chapters: ChapterInput[] = Array.isArray(body.chapters) ? body.chapters : []
    if (chapters.length === 0) return NextResponse.json({ error: 'chapters required' }, { status: 400 })

    const sutra = await prisma.sutra.upsert({
      where: { slug: sutraSlug },
      update: {},
      create: { slug: sutraSlug, title: 'Diamond Sutra', order: 1 },
    })

    let chapterCount = 0
    let verseCount = 0

    for (const ch of chapters) {
      const updateData: { title?: string; summary?: string } = {};
      if (ch.title !== undefined) updateData.title = ch.title;
      if (ch.summary !== undefined) updateData.summary = ch.summary;

      const chapter = await prisma.chapter.upsert({
        where: { sutraId_chapterNum: { sutraId: sutra.id, chapterNum: ch.chapterNum } },
        update: updateData,
        create: { sutraId: sutra.id, chapterNum: ch.chapterNum, title: ch.title || `第${ch.chapterNum}章`, summary: ch.summary || null, order: ch.chapterNum },
      })
      chapterCount++

      for (const v of ch.verses) {
        await prisma.verse.upsert({
          where: { chapterId_verseNum: { chapterId: chapter.id, verseNum: v.verseNum } },
          update: { chinese: v.chinese, sanskrit: v.sanskrit, english: v.english },
          create: { chapterId: chapter.id, verseNum: v.verseNum, chinese: v.chinese, sanskrit: v.sanskrit, english: v.english, aiKeyword: [] },
        })
        verseCount++
      }
    }

    return NextResponse.json({ success: true, sutraId: sutra.id, chapters: chapterCount, verses: verseCount })
  } catch (e) {
    return NextResponse.json({ success: false, error: (e as Error).message }, { status: 500 })
  }
}

