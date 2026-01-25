/**
 * 检查NextAuth配置
 */

import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json({
    nextauth: {
      url: process.env.NEXTAUTH_URL,
      secret: process.env.NEXTAUTH_SECRET ? 'SET' : 'NOT SET',
      secretLength: process.env.NEXTAUTH_SECRET?.length || 0,
    },
    database: {
      url: process.env.DATABASE_URL?.substring(0, 50) + '...',
      urlPrefix: process.env.DATABASE_URL?.split('@')[1]?.split('.')[1] || 'unknown',
    },
    app: {
      nodeEnv: process.env.NODE_ENV,
      baseUrl: process.env.NEXT_PUBLIC_BASE_URL || 'NOT SET',
    },
  });
}
