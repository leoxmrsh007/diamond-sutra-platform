/**
 * Research Commentaries API 路由
 * 获取经文注释数据
 */

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-static';
export const fetchCache = 'force-cache';

// GET - 获取注释数据
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const chapterNum = searchParams.get('chapter');
    const verseNum = searchParams.get('verse');
    const author = searchParams.get('author');
    const language = searchParams.get('language') || 'zh';

    // 构建查询条件
    const where: any = {
      language,
    };

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

    if (author) {
      where.author = {
        contains: author,
        mode: 'insensitive',
      };
    }

    // 获取注释数据
    const commentaries = await prisma.commentary.findMany({
      where,
      orderBy: [
        { verse: { chapter: { chapterNum: 'asc' } } },
        { verse: { verseNum: 'asc' } },
        { order: 'asc' },
        { createdAt: 'desc' },
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
    const groupedByVerse = commentaries.reduce((acc, commentary) => {
      const verseId = commentary.verseId;
      if (!acc[verseId]) {
        acc[verseId] = {
          chapterNum: commentary.verse.chapter.chapterNum,
          chapterTitle: commentary.verse.chapter.title,
          verseNum: commentary.verse.verseNum,
          commentaries: [],
        };
      }
      acc[verseId].commentaries.push({
        id: commentary.id,
        author: commentary.author,
        source: commentary.source,
        language: commentary.language,
        content: commentary.content,
        order: commentary.order,
      });
      return acc;
    }, {} as Record<string, any>);

    // 转换为数组
    const result = Object.values(groupedByVerse);

    // 获取所有可用的注释作者
    const availableAuthors = await prisma.commentary.findMany({
      select: {
        author: true,
        source: true,
      },
      distinct: ['author'],
      orderBy: { author: 'asc' },
    });

    return NextResponse.json({
      data: result,
      metadata: {
        total: commentaries.length,
        groupedCount: result.length,
        availableAuthors,
      },
    });
  } catch (error) {
    console.error('Research Commentaries API 错误:', error);
    return NextResponse.json(
      { error: '获取注释数据失败' },
      { status: 500 }
    );
  }
}

// POST - 创建或更新注释数据（需要管理员权限）
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { verseId, author, source, content, language = 'zh' } = body;

    if (!verseId || !author || !content) {
      return NextResponse.json(
        { error: '缺少必要参数' },
        { status: 400 }
      );
    }

    // 获取当前最大order值
    const maxOrder = await prisma.commentary.aggregate({
      where: { verseId },
      _max: { order: true },
    });

    const commentary = await prisma.commentary.create({
      data: {
        verseId,
        author,
        source,
        content,
        language,
        order: (maxOrder._max.order || 0) + 1,
      },
    });

    return NextResponse.json({
      message: '注释数据保存成功',
      commentary,
    });
  } catch (error) {
    console.error('Research Commentaries API 错误:', error);
    return NextResponse.json(
      { error: '保存注释数据失败' },
      { status: 500 }
    );
  }
}