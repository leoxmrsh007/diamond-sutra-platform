import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function POST() {
  try {
    const updated = await prisma.verse.updateMany({
      data: { aiKeyword: [] },
    })
    return NextResponse.json({ success: true, updated: updated.count })
  } catch (e) {
    return NextResponse.json({ success: false, error: (e as Error).message }, { status: 500 })
  }
}

