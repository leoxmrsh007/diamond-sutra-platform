/**
 * 数据库初始化 API
 * 用于在生产环境中设置数据库
 */

import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-static';
export const fetchCache = 'force-cache';
import { prisma } from '@/lib/prisma';

// 仅在首次设置时使用，之后应该删除此文件
const SETUP_KEY = process.env.SETUP_KEY || 'diamond-sutra-setup-2024';

export async function POST(request: NextRequest) {
  // 验证设置密钥
  const authHeader = request.headers.get('authorization');
  const providedKey = authHeader?.replace('Bearer ', '');

  if (providedKey !== SETUP_KEY) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    // 检查数据库连接
    await prisma.$connect();

    // 检查是否已经初始化
    const userCount = await prisma.user.count();
    const sutraCount = await prisma.sutra.count();

    return NextResponse.json({
      status: 'connected',
      initialized: userCount > 0 || sutraCount > 0,
      userCount,
      sutraCount,
      message: userCount > 0 || sutraCount > 0
        ? '数据库已初始化'
        : '数据库连接正常，但需要填充数据'
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: '数据库连接失败',
        details: (error as Error).message
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function GET(request: NextRequest) {
  return POST(request);
}
