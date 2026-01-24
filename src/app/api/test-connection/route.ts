import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

type ConnectionTestResult = {
  url: string;
  success: boolean;
  error?: string;
  errorShort?: string;
};

type ConnectionTestSummary = {
  tests: ConnectionTestResult[];
  success: boolean;
};

const classifyError = (message: string): string => {
  if (message.includes("Can't reach")) return 'Network/Connection failed';
  if (message.toLowerCase().includes('authentication')) return 'Auth failed';
  if (message.toLowerCase().includes('ssl')) return 'SSL error';
  return 'Other error';
};

export async function GET() {
  const results: ConnectionTestSummary = {
    tests: [],
    success: false,
  };

  const connectionStrings = [
    process.env.DATABASE_URL,
    'postgresql://postgres:huyong525880@db.xashqtdyrifygxtqbfcl.supabase.co:5432/postgres?sslmode=require',
    'postgresql://postgres:huyong525880@db.xashqtdyrifygxtqbfcl.supabase.co:5432/postgres',
    'postgres://postgres:huyong525880@db.xashqtdyrifygxtqbfcl.supabase.co:5432/postgres?sslmode=require',
  ];

  for (const connectionString of connectionStrings) {
    if (!connectionString) continue;

    let client: PrismaClient | null = null;
    const prefix = `${connectionString.substring(0, 60)}...`;
    const test: ConnectionTestResult = { url: prefix, success: false };

    try {
      client = new PrismaClient({
        datasources: {
          db: { url: connectionString },
        },
        log: ['error'],
      });

      await client.$queryRaw`SELECT 1 as result`;
      test.success = true;
      results.success = true;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      test.error = message;
      test.errorShort = classifyError(message);
    } finally {
      if (client) {
        try {
          await client.$disconnect();
        } catch {
          // 忽略断开连接错误
        }
      }
    }

    results.tests.push(test);
  }

  return NextResponse.json(results);
}
