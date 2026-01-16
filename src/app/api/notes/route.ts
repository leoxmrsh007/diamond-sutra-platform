import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { auth } from '@/app/api/auth/[...nextauth]/route'

export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { searchParams } = new URL(req.url)
  const verseId = searchParams.get('verseId') || undefined
  const limit = Number(searchParams.get('limit') || 50)

  const items = await prisma.note.findMany({
    where: { userId: (session.user as any).id, ...(verseId ? { verseId } : {}) },
    orderBy: { createdAt: 'desc' },
    take: limit,
  })
  return NextResponse.json(items)
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json()
  const verseId = String(body.verseId || '')
  const content = String(body.content || '')
  const title = typeof body.title === 'string' ? body.title : undefined
  const isPublic = Boolean(body.isPublic)
  if (!verseId || !content) return NextResponse.json({ error: 'verseId and content required' }, { status: 400 })

  const created = await prisma.note.create({
    data: {
      userId: (session.user as any).id,
      verseId,
      content,
      title,
      isPublic,
    },
  })
  return NextResponse.json(created)
}

