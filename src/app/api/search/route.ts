/**
 * 全局搜索 API
 * 支持搜索经文、章节、笔记、帖子、课程、概念
 * 使用 Redis 缓存提升性能
 */

import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { cacheGetOrSet, cacheSearch } from '@/lib/redis'

type ResultType = 'verse' | 'chapter' | 'note' | 'post' | 'course' | 'concept'

interface SearchResult {
  id: string
  type: ResultType
  title: string
  content: string
  category: string
  href: string
}

export const dynamic = 'force-dynamic';

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

  // 尝试从缓存获取搜索结果
  const cacheKey = `search:${q}:${limit}`
  const cached = await cacheGetOrSet<SearchResult[]>(
    cacheKey,
    async () => performSearch(q, limit),
    300 // 5分钟缓存
  )

  // 同时异步更新缓存
  cacheSearch(q, cached).catch(() => {})

  return NextResponse.json({ results: cached })
}

/**
 * 执行搜索操作
 */
async function performSearch(q: string, limit: number): Promise<SearchResult[]> {
  const like = q

  // 并行执行所有搜索
  const [verses, chapters, notes, posts, courses, concepts] = await Promise.all([
    searchVerses(like, limit),
    searchChapters(like, Math.ceil(limit / 2)),
    searchNotes(like, Math.ceil(limit / 2)),
    searchPosts(like, Math.ceil(limit / 2)),
    searchCourses(like, Math.ceil(limit / 2)),
    searchConcepts(like, Math.ceil(limit / 2)),
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

  return results
}

/**
 * 搜索偈颂
 */
async function searchVerses(q: string, limit: number) {
  return prisma.verse.findMany({
    where: {
      OR: [
        { chinese: { contains: q, mode: 'insensitive' } },
        { sanskrit: { contains: q, mode: 'insensitive' } },
        { tibetan: { contains: q, mode: 'insensitive' } },
        { english: { contains: q, mode: 'insensitive' } },
        { pinyin: { contains: q, mode: 'insensitive' } },
        { modern: { contains: q, mode: 'insensitive' } },
      ],
    },
    include: { chapter: true },
    take: limit,
  })
}

/**
 * 搜索章节
 */
async function searchChapters(q: string, limit: number) {
  return prisma.chapter.findMany({
    where: {
      OR: [
        { title: { contains: q, mode: 'insensitive' } },
        { summary: { contains: q, mode: 'insensitive' } },
        { titleSanskrit: { contains: q, mode: 'insensitive' } },
      ],
    },
    include: { sutra: true },
    take: limit,
  })
}

/**
 * 搜索笔记
 */
async function searchNotes(q: string, limit: number) {
  return prisma.note.findMany({
    where: {
      OR: [
        { title: { contains: q, mode: 'insensitive' } },
        { content: { contains: q, mode: 'insensitive' } },
      ],
      isPublic: true, // 只搜索公开笔记
    },
    include: {
      verse: {
        include: {
          chapter: true,
        },
      },
    },
    take: limit,
  })
}

/**
 * 搜索帖子
 */
async function searchPosts(q: string, limit: number) {
  return prisma.post.findMany({
    where: {
      OR: [
        { title: { contains: q, mode: 'insensitive' } },
        { content: { contains: q, mode: 'insensitive' } },
      ],
    },
    take: limit,
    orderBy: { updatedAt: 'desc' },
  })
}

/**
 * 搜索课程
 */
async function searchCourses(q: string, limit: number) {
  return prisma.course.findMany({
    where: {
      OR: [
        { title: { contains: q, mode: 'insensitive' } },
        { description: { contains: q, mode: 'insensitive' } },
      ],
      isPublished: true,
    },
    take: limit,
    include: { lessons: true },
  })
}

/**
 * 搜索概念
 */
async function searchConcepts(q: string, limit: number) {
  return prisma.concept.findMany({
    where: {
      OR: [
        { name: { contains: q, mode: 'insensitive' } },
        { nameSanskrit: { contains: q, mode: 'insensitive' } },
        { nameTibetan: { contains: q, mode: 'insensitive' } },
        { description: { contains: q, mode: 'insensitive' } },
      ],
    },
    take: limit,
  })
}
