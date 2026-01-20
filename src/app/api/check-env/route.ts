import { NextResponse } from 'next/server'

export const dynamic = 'force-static'
export const fetchCache = 'force-cache'

export async function GET() {
  const result = {
    databaseUrlSet: !!process.env.DATABASE_URL,
    databaseUrlPrefix: process.env.DATABASE_URL?.substring(0, 30) + '...',
    nodeEnv: process.env.NODE_ENV,
    hasGeminiKey: !!process.env.GEMINI_API_KEY,
    hasDeepSeekKey: !!process.env.DEEPSEEK_API_KEY,
    hasAuthSecret: !!process.env.NEXTAUTH_SECRET,
  }

  return NextResponse.json(result)
}
