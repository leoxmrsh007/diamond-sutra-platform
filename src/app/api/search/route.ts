import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

type ResultType = 'verse' | 'chapter' | 'note' | 'post' | 'course' | 'concept'

interface SearchResult {
  id: string
  type: ResultType
  title: string
  content: string
  category: string
  href: string
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const q = (searchParams.get('q') || '').trim()
  const limit = Math.min(Number(searchParams.get('limit') || 20), 50)

  if (!q) {
    return NextResponse.json({ results: [] })
  }

  if (q.length < 2) {
    return NextResponse.json({
      results: [],
      message: '请至少输入两个字符后再搜索',
    })
  }

  const like = q

  const [verses, chapters, notes, posts, courses, concepts] = await Promise.all([
    prisma.verse.findMany({
      where: {
        OR: [
          { chinese: { contains: like, mode: 'insensitive' } },
          { sanskrit: { contains: like, mode: 'insensitive' } },
          { tibetan: { contains: like, mode: 'insensitive' } },
          { english: { contains: like, mode: 'insensitive' } },
        ],
      },
      include: { chapter: true },
      take: limit,
    }),
    prisma.chapter.findMany({
      where: {
        OR: [
          { title: { contains: like, mode: 'insensitive' } },
          { summary: { contains: like, mode: 'insensitive' } },
        ],
      },
      include: { sutra: true },
      take: Math.ceil(limit / 2),
    }),
    prisma.note.findMany({
      where: {
        OR: [
          { title: { contains: like, mode: 'insensitive' } },
          { content: { contains: like, mode: 'insensitive' } },
        ],
      },
      include: {
        verse: {
          include: {
            chapter: true,
          },
        },
      },
      take: Math.ceil(limit / 2),
    }),
    prisma.post.findMany({
      where: {
        OR: [
          { title: { contains: like, mode: 'insensitive' } },
          { content: { contains: like, mode: 'insensitive' } },
          { tags: { path: '$[*]', string_contains: like, array_contains: [like] } },
        ],
      },
      take: Math.ceil(limit / 2),
      orderBy: { updatedAt: 'desc' },
    }),
    prisma.course.findMany({
      where: {
        OR: [
          { title: { contains: like, mode: 'insensitive' } },
          { description: { contains: like, mode: 'insensitive' } },
        ],
        isPublished: true,
      },
      take: Math.ceil(limit / 2),
      include: { lessons: true },
    }),
    prisma.concept.findMany({
      where: {
        OR: [
          { name: { contains: like, mode: 'insensitive' } },
          { nameSanskrit: { contains: like, mode: 'insensitive' } },
          { description: { contains: like, mode: 'insensitive' } },
        ],
      },
      take: Math.ceil(limit / 2),
    }),
  ])

  const results: SearchResult[] = [
    ...verses.map((v) => ({
      id: v.id,
      type: 'verse' as const,
      title: `第${v.chapter.chapterNum}章 第${v.verseNum}偈`,
      content: v.chinese,
      category: v.chapter.title,
      href: `/study?chapter=${v.chapter.chapterNum}&verse=${v.verseNum}`,
    })),
    ...chapters.map((c) => ({
      id: c.id,
      type: 'chapter' as const,
      title: c.title,
      content: c.summary ?? '',
      category: c.sutra.title,
      href: `/study?chapter=${c.chapterNum}`,
    })),
    ...notes.map((n) => ({
      id: n.id,
      type: 'note' as const,
      title: n.title ?? '笔记',
      content: n.content,
      category: n.verse?.chapter?.title ?? '笔记',
      href: `/study?verse=${n.verseId}`,
    })),
    ...posts.map((p) => ({
      id: p.id,
      type: 'post' as const,
      title: p.title,
      content: p.content,
      category: '社区',
      href: `/community?post=${p.id}`,
    })),
    ...courses.map((c) => ({
      id: c.id,
      type: 'course' as const,
      title: c.title,
      content: c.description,
      category: `${c.level === 'BEGINNER' ? '初级' : c.level === 'INTERMEDIATE' ? '中级' : '高级'}课程 · ${c.lessons.length} 课时`,
      href: `/courses/${c.id}`,
    })),
    ...concepts.map((concept) => ({
      id: concept.id,
      type: 'concept' as const,
      title: concept.name,
      content: concept.description ?? '',
      category: '佛学概念',
      href: `/research?concept=${concept.id}`,
    })),
  ]

  return NextResponse.json({ results })
}

