import { NextRequest, NextResponse } from 'next/server';
import type { Session } from 'next-auth';
import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth';

const getSession = async (): Promise<Session | null> => (await auth()) as Session | null;

const assertSessionUser = (session: Session | null): session is Session & { user: Session['user'] } =>
  Boolean(session?.user);

interface UpdateNotePayload {
  title?: unknown;
  content?: unknown;
  isPublic?: unknown;
}


export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!assertSessionUser(session)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const body = (await req.json()) as UpdateNotePayload;
  const updateData: { title?: string; content?: string; isPublic?: boolean } = {};

  if (typeof body.title === 'string') updateData.title = body.title;
  if (typeof body.content === 'string' && body.content.trim() !== '') updateData.content = body.content;
  if (typeof body.isPublic === 'boolean') updateData.isPublic = body.isPublic;

  if (Object.keys(updateData).length === 0) {
    return NextResponse.json({ error: 'No fields to update' }, { status: 400 });
  }

  const updated = await prisma.note.update({
    where: { id },
    data: updateData,
  });
  return NextResponse.json(updated);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!assertSessionUser(session)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  await prisma.note.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
