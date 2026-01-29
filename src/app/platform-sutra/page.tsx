/**
 * 六祖坛经学习页面 - 服务器组件包装器
 * 负责数据获取，客户端组件处理交互
 */

import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import PlatformSutraClient from './client'

// 性能优化配置
export const revalidate = 60; // 1分钟缓存
export const dynamic = 'force-dynamic';

// 使用 unstable_cache 缓存基本数据
async function getSutraData() {
  'use server';
  return prisma.sutra.findUnique({
    where: { slug: 'platform-sutra' },
    select: {
      id: true,
      title: true,
      description: true,
    },
  });
}

async function getChaptersList() {
  'use server';
  return prisma.chapter.findMany({
    where: { sutra: { slug: 'platform-sutra' } },
    select: {
      id: true,
      chapterNum: true,
      title: true,
      summary: true,
      _count: {
        select: { sections: true },
      },
    },
    orderBy: { chapterNum: 'asc' },
  });
}

async function getChapterWithSections(chapterNum: number) {
  'use server';
  return prisma.chapter.findFirst({
    where: {
      sutra: { slug: 'platform-sutra' },
      chapterNum: chapterNum,
    },
    include: {
      sections: {
        orderBy: { sectionNum: 'asc' },
      },
    },
  });
}

async function getAllChaptersWithSections() {
  'use server';
  return prisma.chapter.findMany({
    where: { sutra: { slug: 'platform-sutra' } },
    include: {
      sections: {
        orderBy: { sectionNum: 'asc' },
      },
    },
    orderBy: { chapterNum: 'asc' },
  });
}

export default async function PlatformSutraPage({
  searchParams,
}: {
  searchParams: Promise<{ chapter?: string }>
}) {
  const awaitedParams = await searchParams;

  // 使用 Promise.all 并行查询所有章节数据
  const [sutra, chaptersWithSections] = await Promise.all([
    getSutraData(),
    getAllChaptersWithSections(),
  ]);

  if (!sutra) {
    return (
      <div className="container mx-auto py-8 px-4 text-center">
        <h1 className="text-2xl font-bold mb-4">数据未初始化</h1>
        <p className="text-gray-600 dark:text-gray-400">
          请先运行 <code>npm run db:seed</code> 初始化六祖坛经数据
        </p>
      </div>
    )
  }

  // 根据URL参数选择章节
  const selectedChapterNum = awaitedParams.chapter ? Number(awaitedParams.chapter) : chaptersWithSections[0]?.chapterNum;
  const selectedChapter = selectedChapterNum 
    ? chaptersWithSections.find((c) => c.chapterNum === selectedChapterNum) || chaptersWithSections[0]
    : chaptersWithSections[0];

  // 将完整章节数据传递给客户端组件
  return (
    <PlatformSutraClient
      sutra={sutra}
      chapters={chaptersWithSections}
      initialChapterNum={selectedChapterNum}
    />
  );
}
