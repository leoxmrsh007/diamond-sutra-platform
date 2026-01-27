/**
 * 简化的研究API - 用于诊断404问题
 */

import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
export const revalidate = 0;

export async function GET() {
  try {
    // 返回静态数据（快速响应）
    const response = {
      summary: {
        versions: 11,
        commentaries: 5,
        concepts: 0,
        chapters: 32,
        verses: 106,
      },
      versions: {
        available: [
          { versionType: 'kumarajiva', versionName: '鸠摩罗什译本', language: 'zh', translator: '鸠摩罗什', year: '402' },
          { versionType: 'xuanzang', versionName: '玄奘译本', language: 'zh', translator: '玄奘', year: '660' },
          { versionType: 'yijing', versionName: '义净译本', language: 'zh', translator: '义净', year: '705' },
          { versionType: 'sanskrit', versionName: '梵文原典', language: 'sa', translator: '-', year: '-' },
          { versionType: 'tibetan', versionName: '藏文译本', language: 'bo', translator: '-', year: '-' },
          { versionType: 'english', versionName: '英译本', language: 'en', translator: '-', year: '-' },
          { versionType: 'damoduojiduo', versionName: '达摩笈多译本', language: 'zh', translator: '达摩笈多', year: '603' },
          { versionType: 'yijing_revised', versionName: '义净重译本', language: 'zh', translator: '义净', year: '703' },
          { versionType: 'dingfubao', versionName: '丁福保译本', language: 'zh', translator: '丁福保', year: '1924' },
          { versionType: 'conze', versionName: 'Edward Conze英译本', language: 'en', translator: 'Edward Conze', year: '1957' },
          { versionType: 'redpine', versionName: 'Red Pine英译本', language: 'en', translator: 'Bill Porter (Red Pine)', year: '2001' },
          { versionType: 'sangharakshita', versionName: 'Sangharakshita英译本', language: 'en', translator: 'Sangharakshita', year: '2001' },
        ],
        byType: [],
        recent: [],
      },
      commentaries: {
        availableAuthors: [
          { author: '智海', source: '《金刚经注疏》' },
          { author: '吉藏', source: '《金刚经义疏》' },
          { author: '窥基', source: '《金刚般若经赞述》' },
        ],
        byAuthor: [],
        recent: [],
      },
      tools: {
        versionComparison: true,
        commentaryBrowser: true,
        conceptExplorer: false,
        searchAvailable: false,
        exportAvailable: false,
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json(
      { error: '获取研究数据失败', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
