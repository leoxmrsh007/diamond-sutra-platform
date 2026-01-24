import { NextRequest, NextResponse } from 'next/server';
import type { Session } from 'next-auth';
import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth';

const getSession = async (): Promise<Session | null> => (await auth()) as Session | null;

const assertSessionUser = (session: Session | null): session is Session & { user: Session['user'] } =>
  Boolean(session?.user);

interface CreateNotePayload {
  verseId?: string;
  content?: string;
  title?: string;
  isPublic?: boolean;
}

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!assertSessionUser(session)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const verseId = searchParams.get('verseId') ?? undefined;
  const limit = Number(searchParams.get('limit') ?? 50);

  const items = await prisma.note.findMany({
    where: {
      userId: session.user.id,
      ...(verseId ? { verseId } : {}),
    },
    orderBy: { createdAt: 'desc' },
    take: Number.isNaN(limit) ? 50 : limit,
  });

  return NextResponse.json(items);
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!assertSessionUser(session)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = (await req.json()) as CreateNotePayload;
  const { verseId, content, title, isPublic } = body;

  if (typeof verseId !== 'string' || verseId.trim() === '' || typeof content !== 'string' || content.trim() === '') {
    return NextResponse.json({ error: 'verseId and content required' }, { status: 400 });
  }

  const created = await prisma.note.create({
    data: {
      userId: session.user.id,
      verseId: verseId.trim(),
      content: content.trim(),
      title: typeof title === 'string' ? title : undefined,
      isPublic: Boolean(isPublic),
    },
  });

  return NextResponse.json(created);
}
