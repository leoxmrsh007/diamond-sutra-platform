/**
 * Research API 路由
 * 获取研究页面的汇总数据
 */

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-static';
export const fetchCache = 'force-cache';

// GET - 获取研究页面汇总数据
export async function GET() {
  try {
    // 并行获取各种统计数据
    const [
      versionsCount,
      commentariesCount,
      conceptsCount,
      availableVersions,
      availableAuthors,
      recentVersions,
      recentCommentaries,
    ] = await Promise.all([
      // 版本总数
      prisma.sutraVersion.count(),
      // 注释总数
      prisma.commentary.count(),
      // 概念总数
      prisma.concept.count(),
      // 可用的版本类型
      prisma.sutraVersion.findMany({
        select: {
          versionType: true,
          versionName: true,
          language: true,
          translator: true,
          year: true,
        },
        distinct: ['versionType'],
        orderBy: { versionType: 'asc' },
      }),
      // 可用的注释作者
      prisma.commentary.findMany({
        select: {
          author: true,
          source: true,
        },
        distinct: ['author'],
        orderBy: { author: 'asc' },
        take: 20,
      }),
      // 最近添加的版本数据
      prisma.sutraVersion.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5,
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
      }),
      // 最近添加的注释
      prisma.commentary.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5,
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
      }),
    ]);

    // 获取章节和偈颂统计
    const [chaptersCount, versesCount] = await Promise.all([
      prisma.chapter.count(),
      prisma.verse.count(),
    ]);

    // 按版本类型统计
    const versionsByType = await prisma.sutraVersion.groupBy({
      by: ['versionType', 'versionName'],
      _count: {
        id: true,
      },
      orderBy: {
        versionType: 'asc',
      },
    });

    // 按作者统计注释
    const commentariesByAuthor = await prisma.commentary.groupBy({
      by: ['author'],
      _count: {
        id: true,
      },
      orderBy: {
        _count: {
          id: 'desc',
        },
      },
      take: 10,
    });

    const researchStats = {
      // 基础统计
      summary: {
        versions: versionsCount,
        commentaries: commentariesCount,
        concepts: conceptsCount,
        chapters: chaptersCount,
        verses: versesCount,
      },
      // 版本数据
      versions: {
        available: availableVersions,
        byType: versionsByType,
        recent: recentVersions.map(v => ({
          id: v.id,
          versionType: v.versionType,
          versionName: v.versionName,
          chapterNum: v.verse.chapter.chapterNum,
          verseNum: v.verse.verseNum,
          contentPreview: v.content.length > 50 
            ? v.content.substring(0, 50) + '...' 
            : v.content,
        })),
      },
      // 注释数据
      commentaries: {
        availableAuthors: availableAuthors,
        byAuthor: commentariesByAuthor,
        recent: recentCommentaries.map(c => ({
          id: c.id,
          author: c.author,
          source: c.source,
          chapterNum: c.verse.chapter.chapterNum,
          verseNum: c.verse.verseNum,
          contentPreview: c.content.length > 50 
            ? c.content.substring(0, 50) + '...' 
            : c.content,
        })),
      },
      // 研究工具状态
      tools: {
        versionComparison: versionsCount > 0,
        commentaryBrowser: commentariesCount > 0,
        conceptExplorer: conceptsCount > 0,
        searchAvailable: true,
        exportAvailable: false, // 暂时不支持导出
      },
    };

    return NextResponse.json(researchStats);
  } catch (error) {
    console.error('Research API 错误:', error);
    return NextResponse.json(
      { error: '获取研究数据失败' },
      { status: 500 }
    );
  }
}