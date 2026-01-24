import { NextRequest, NextResponse } from 'next/server';
import type { Session } from 'next-auth';
import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth';

const getSession = async (): Promise<Session | null> => (await auth()) as Session | null;

const assertSessionUser = (session: Session | null): session is Session & { user: Session['user'] } =>
  Boolean(session?.user);

interface CreateBookmarkPayload {
  verseId?: string;
  note?: string;
}

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!assertSessionUser(session)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { searchParams } = new URL(req.url);
  const verseId = searchParams.get('verseId') ?? undefined;
  const limit = Number(searchParams.get('limit') ?? 50);

  const items = await prisma.bookmark.findMany({
    where: { userId: session.user.id, ...(verseId ? { verseId } : {}) },
    orderBy: { createdAt: 'desc' },
    take: Number.isNaN(limit) ? 50 : limit,
  });
  return NextResponse.json(items);
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!assertSessionUser(session)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const body = (await req.json()) as CreateBookmarkPayload;
  const { verseId, note } = body;
  if (typeof verseId !== 'string' || verseId.trim() === '') {
    return NextResponse.json({ error: 'verseId required' }, { status: 400 });
  }

  const created = await prisma.bookmark.upsert({
    where: {
      userId_verseId: { userId: session.user.id, verseId: verseId.trim() },
    },
    update: { note: typeof note === 'string' ? note : undefined },
    create: {
      userId: session.user.id,
      verseId: verseId.trim(),
      note: typeof note === 'string' ? note : undefined,
    },
  });
  return NextResponse.json(created);
}

export async function DELETE(req: NextRequest) {
  const session = await getSession();
  if (!assertSessionUser(session)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { searchParams } = new URL(req.url);
  const verseId = searchParams.get('verseId');
  const id = searchParams.get('id');
  if (!verseId && !id) return NextResponse.json({ error: 'id or verseId required' }, { status: 400 });

  if (id) {
    await prisma.bookmark.delete({ where: { id } });
  } else if (verseId) {
    await prisma.bookmark.delete({ where: { userId_verseId: { userId: session.user.id, verseId } } });
  }
  return NextResponse.json({ success: true });
}


