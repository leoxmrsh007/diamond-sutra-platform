import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
// import { auth } from '@/app/api/auth/[...nextauth]/route'

// 临时禁用auth检查
const auth = () => Promise.resolve({ user: { id: 'demo-user' } as any })

export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { searchParams } = new URL(req.url)
  const verseId = searchParams.get('verseId') || undefined
  const limit = Number(searchParams.get('limit') || 50)

  const items = await prisma.bookmark.findMany({
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
  const note = typeof body.note === 'string' ? body.note : undefined
  if (!verseId) return NextResponse.json({ error: 'verseId required' }, { status: 400 })

  const created = await prisma.bookmark.upsert({
    where: {
      userId_verseId: { userId: (session.user as any).id, verseId },
    },
    update: { note },
    create: {
      userId: (session.user as any).id,
      verseId,
      note,
    },
  })
  return NextResponse.json(created)
}

export async function DELETE(req: NextRequest) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { searchParams } = new URL(req.url)
  const verseId = searchParams.get('verseId')
  const id = searchParams.get('id')
  if (!verseId && !id) return NextResponse.json({ error: 'id or verseId required' }, { status: 400 })

  if (id) {
    await prisma.bookmark.delete({ where: { id } })
  } else if (verseId) {
    await prisma.bookmark.delete({ where: { userId_verseId: { userId: (session.user as any).id, verseId } } })
  }
  return NextResponse.json({ success: true })
}


