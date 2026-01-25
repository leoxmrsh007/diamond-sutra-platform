/**
 * Research Versions API 路由
 * 获取经文版本对照数据
 */

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-static';
export const fetchCache = 'force-cache';

// GET - 获取版本对照数据
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const chapterNum = searchParams.get('chapter');
    const verseNum = searchParams.get('verse');
    const versionType = searchParams.get('versionType');

    // 构建查询条件
    const where: any = {};

    if (chapterNum) {
      where.verse = {
        chapter: {
          chapterNum: parseInt(chapterNum),
        },
      };
    }

    if (verseNum && chapterNum) {
      where.verse = {
        ...where.verse,
        verseNum: parseInt(verseNum),
      };
    }

    if (versionType) {
      where.versionType = versionType;
    }

    // 获取版本数据
    const versions = await prisma.sutraVersion.findMany({
      where,
      orderBy: [
        { verse: { chapter: { chapterNum: 'asc' } } },
        { verse: { verseNum: 'asc' } },
        { versionType: 'asc' },
      ],
      include: {
        verse: {
          include: {
            chapter: {
              select: {
                chapterNum: true,
                title: true,
              },
            },
          },
        },
      },
      take: 100, // 限制返回数量
    });

    // 按偈颂分组
    const groupedByVerse = versions.reduce((acc, version) => {
      const verseId = version.verseId;
      if (!acc[verseId]) {
        acc[verseId] = {
          chapterNum: version.verse.chapter.chapterNum,
          chapterTitle: version.verse.chapter.title,
          verseNum: version.verse.verseNum,
          versions: [],
        };
      }
      acc[verseId].versions.push({
        id: version.id,
        versionType: version.versionType,
        versionName: version.versionName,
        language: version.language,
        content: version.content,
        translator: version.translator,
        year: version.year,
        notes: version.notes,
      });
      return acc;
    }, {} as Record<string, any>);

    // 转换为数组
    const result = Object.values(groupedByVerse);

    // 如果没有指定具体偈颂，返回所有可用的版本类型信息
    const availableVersions = await prisma.sutraVersion.findMany({
      select: {
        versionType: true,
        versionName: true,
        language: true,
        translator: true,
        year: true,
      },
      distinct: ['versionType'],
    });

    return NextResponse.json({
      data: result,
      metadata: {
        total: versions.length,
        groupedCount: result.length,
        availableVersions,
      },
    });
  } catch (error) {
    console.error('Research Versions API 错误:', error);
    return NextResponse.json(
      { error: '获取版本对照数据失败' },
      { status: 500 }
    );
  }
}

// POST - 创建或更新版本数据（需要管理员权限）
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { verseId, versionType, content, translator, year, notes } = body;

    if (!verseId || !versionType || !content) {
      return NextResponse.json(
        { error: '缺少必要参数' },
        { status: 400 }
      );
    }

    // 根据versionType确定versionName
    const versionNames: Record<string, string> = {
      kumarajiva: '鸠摩罗什译本',
      xuanzang: '玄奘译本',
      yijing: '义净译本',
      sanskrit: '梵文原典',
      tibetan: '藏文译本',
      english: '英译本',
      damoduojiduo: '达摩笈多译本',
      yijing_revised: '义净重译本',
      dingfubao: '丁福保译本',
      conze: 'Edward Conze英译本',
      redpine: 'Red Pine英译本',
      sangharakshita: 'Sangharakshita英译本',
    };

    const versionName = versionNames[versionType] || `${versionType}译本`;

    const version = await prisma.sutraVersion.upsert({
      where: {
        verseId_versionType: {
          verseId,
          versionType,
        },
      },
      update: {
        content,
        translator,
        year,
        notes,
      },
      create: {
        verseId,
        versionType,
        versionName,
        language: versionType === 'sanskrit' ? 'sa' : 
                 versionType === 'tibetan' ? 'bo' : 
                 versionType === 'english' ? 'en' : 'zh',
        content,
        translator,
        year,
        notes,
      },
    });

    return NextResponse.json({
      message: '版本数据保存成功',
      version,
    });
  } catch (error) {
    console.error('Research Versions API 错误:', error);
    return NextResponse.json(
      { error: '保存版本数据失败' },
      { status: 500 }
    );
  }
}