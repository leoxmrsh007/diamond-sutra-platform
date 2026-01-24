/**
 * 添加版本对照数据API
 */

import { NextResponse } from 'next/server';
import { addVersionData } from '@/app/scripts/add-versions';

export const dynamic = 'force-dynamic';

export async function POST() {
  try {
    const result = await addVersionData();

    return NextResponse.json({
      success: true,
      message: `版本对照数据添加成功！新增 ${result.addedCount} 条，更新 ${result.updatedCount} 条`,
      data: result,
    });
  } catch (error) {
    console.error('添加版本数据API错误:', error);
    return NextResponse.json(
      {
        success: false,
        error: '添加版本数据失败',
        details: error instanceof Error ? error.message : '未知错误',
      },
      { status: 500 }
    );
  }
}
