/**
 * 简化的研究API - 用于诊断404问题
 */

import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const fetchCache = 'no-store';

export async function GET() {
  try {
    console.log('📊 简化研究API被调用');

    // 返回一个最小化的响应
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
          { versionType: 'kumarajiva', versionName: '鸠摩罗什译本', language: 'zh', author: '鸠摩罗什', era: '402' },
          { versionType: 'xuanzang', versionName: '玄奘译本', language: 'zh', author: '玄奘', era: '660' },
          { versionType: 'yijing', versionName: '义净译本', language: 'zh', author: '义净', era: '705' },
          { versionType: 'sanskrit', versionName: '梵文原典', language: 'sa', author: '-', era: '-' },
          { versionType: 'tibetan', versionName: '藏文译本', language: 'bo', author: '-', era: '-' },
          { versionType: 'english', versionName: '英译本', language: 'en', author: '-', era: '-' },
          { versionType: 'damoduojiduo', versionName: '达摩笈多译本', language: 'zh', author: '达摩笈多', era: '603' },
          { versionType: 'yijing_revised', versionName: '义净重译本', language: 'zh', author: '义净', era: '703' },
          { versionType: 'dingfubao', versionName: '丁福保译本', language: 'zh', author: '丁福保', era: '1924' },
          { versionType: 'conze', versionName: 'Edward Conze英译本', language: 'en', author: 'Edward Conze', era: '1957' },
          { versionType: 'redpine', versionName: 'Red Pine英译本', language: 'en', author: 'Bill Porter (Red Pine)', era: '2001' },
          { versionType: 'sangharakshita', versionName: 'Sangharakshita英译本', language: 'en', author: 'Sangharakshita', era: '2001' },
        ],
        byType: [],
        recent: [],
      },
      commentaries: {
        availableAuthors: ['智海', '吉藏', '窥基'],
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

    console.log('✅ 简化研究API返回成功');
    console.log(`   版本数: ${response.summary.versions}`);
    console.log(`   可用版本: ${response.versions.available.length}`);

    return NextResponse.json(response);
  } catch (error) {
    console.error('❌ 简化研究API错误:', error);
    return NextResponse.json(
      { error: '获取研究数据失败', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
