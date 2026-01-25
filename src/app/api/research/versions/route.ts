/**
 * Research Versions API 路由
 * 获取经文版本对照数据
 */

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const fetchCache = 'no-store';

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
    const versions = await prisma.version.findMany({
      where,
      orderBy: [
        { verse: { chapter: { chapterNum: 'asc' } } },
        { verse: { verseNum: 'asc' } },
        { metadata: { versionType: 'asc' } },
      ],
      include: {
        metadata: {
          select: {
            versionType: true,
            versionName: true,
            language: true,
            author: true,
            era: true,
          },
        },
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
        versionType: version.metadata?.versionType || '',
        versionName: version.metadata?.versionName || '',
        language: version.metadata?.language || '',
        content: version.content,
        translator: version.metadata?.author || null,
        year: version.metadata?.era || null,
        notes: version.notes,
      });
      return acc;
    }, {} as Record<string, any>);

    // 转换为数组
    const result = Object.values(groupedByVerse);

    // 如果没有指定具体偈颂，返回所有可用的版本类型信息
    const availableVersions = await prisma.versionMetadata.findMany({
      select: {
        versionType: true,
        versionName: true,
        language: true,
        author: true,
        era: true,
      },
      distinct: ['versionType'],
      orderBy: { versionType: 'asc' },
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

    // 获取或创建版本元数据
    let metadata;
    try {
      metadata = await prisma.versionMetadata.upsert({
        where: {
          scriptureId_versionType: {
            scriptureId: verseId.substring(0, 20), // 简化：假设前20个字符包含经文ID，或需要修改此逻辑
            versionType,
          },
        },
        update: {},
        create: {
          versionType,
          versionName,
          language: versionType === 'sanskrit' ? 'sa' :
                   versionType === 'tibetan' ? 'bo' :
                   versionType === 'english' ? 'en' : 'zh',
          author: translator,
          era: year,
        },
      });
    } catch (error) {
      // 如果upsert失败，尝试获取已存在的metadata
      metadata = await prisma.versionMetadata.findFirst({
        where: { versionType },
      });
    }

    if (!metadata) {
      return NextResponse.json(
        { error: '无法创建版本元数据' },
        { status: 500 }
      );
    }

    const version = await prisma.version.upsert({
      where: {
        metadataId_verseId: {
          metadataId: metadata.id,
          verseId,
        },
      },
      update: {
        content,
        notes,
      },
      create: {
        metadataId: metadata.id,
        verseId,
        content,
        notes,
      },
    });

    return NextResponse.json({
      message: '版本数据保存成功',
      version: {
        id: version.id,
        versionType: metadata.versionType,
        versionName: metadata.versionName,
        language: metadata.language,
        author: metadata.author,
        year: metadata.era,
        content: version.content,
        notes: version.notes,
      },
    });
  } catch (error) {
    console.error('Research Versions API 错误:', error);
    return NextResponse.json(
      { error: '保存版本数据失败' },
      { status: 500 }
    );
  }
}