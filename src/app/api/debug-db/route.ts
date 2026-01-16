import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const results: {
    connected: boolean
    error?: string
    sutraCount?: number
    chapterCount?: number
    verseCount?: number
    courseCount?: number
    conceptCount?: number
    databaseUrl?: string
  } = {
    connected: false,
  }

  try {
    // Test database connection
    await prisma.$connect()
    results.connected = true

    // Count records
    results.sutraCount = await prisma.sutra.count()
    results.chapterCount = await prisma.chapter.count()
    results.verseCount = await prisma.verse.count()
    results.courseCount = await prisma.course.count()
    results.conceptCount = await prisma.concept.count()

    // Check database URL (partial)
    results.databaseUrl = process.env.DATABASE_URL?.substring(0, 50) + '...'

    await prisma.$disconnect()

    return NextResponse.json(results)
  } catch (error) {
    results.error = (error as Error).message
    if (prisma) {
      await prisma.$disconnect()
    }
    return NextResponse.json(results, { status: 500 })
  }
}
