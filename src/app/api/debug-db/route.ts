import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const results: {
    envSet: boolean
    envPrefix: string
    connected: boolean
    error?: string
    errorMessage?: string
    errorStack?: string
    sutraCount?: number
    chapterCount?: number
    verseCount?: number
    courseCount?: number
    conceptCount?: number
  } = {
    envSet: !!process.env.DATABASE_URL,
    envPrefix: process.env.DATABASE_URL?.substring(0, 50) + '...' || 'not set',
    connected: false,
  }

  try {
    // Test database connection with a simple query
    await prisma.$queryRaw`SELECT 1 as result`
    results.connected = true

    // Count records
    results.sutraCount = await prisma.sutra.count()
    results.chapterCount = await prisma.chapter.count()
    results.verseCount = await prisma.verse.count()
    results.courseCount = await prisma.course.count()
    results.conceptCount = await prisma.concept.count()

    await prisma.$disconnect()

    return NextResponse.json(results)
  } catch (error: any) {
    results.connected = false
    results.error = error?.message || 'Unknown error'
    results.errorMessage = error?.message || 'Unknown error'
    if (error?.stack) {
      results.errorStack = error.stack.split('\n').slice(0, 3).join('\n')
    }
    if (prisma) {
      await prisma.$disconnect()
    }
    return NextResponse.json(results, { status: 500 })
  }
}
