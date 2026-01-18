import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

export async function GET() {
  const results = {
    tests: [] as any[],
    success: false
  }

  const connectionStrings = [
    process.env.DATABASE_URL,
    `postgresql://postgres:huyong525880@db.xashqtdyrifygxtqbfcl.supabase.co:5432/postgres?sslmode=require`,
    `postgresql://postgres:huyong525880@db.xashqtdyrifygxtqbfcl.supabase.co:5432/postgres`,
    `postgres://postgres:huyong525880@db.xashqtdyrifygxtqbfcl.supabase.co:5432/postgres?sslmode=require`,
  ]

  for (const connectionString of connectionStrings) {
    if (!connectionString) continue

    const prefix = connectionString.substring(0, 60) + '...'
    const test: any = { url: prefix, success: false, error: '' }

    try {
      const prisma = new PrismaClient({
        datasources: {
          db: { url: connectionString },
        },
        log: ['error'],
      })

      await prisma.$queryRaw`SELECT 1 as result`
      await prisma.$disconnect()
      test.success = true
      results.success = true
    } catch (error: any) {
      test.error = error?.message || 'Unknown error'
      test.errorShort = test.error.includes('Can\'t reach') ? 'Network/Connection failed' :
                       test.error.includes('authentication') ? 'Auth failed' :
                       test.error.includes('SSL') ? 'SSL error' : 'Other error'
    }

    results.tests.push(test)
  }

  return NextResponse.json(results)
}
