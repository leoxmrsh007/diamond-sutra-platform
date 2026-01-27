/**
 * 生成金刚经学习数据JSON文件
 * 运行: npx tsx src/app/study/generate-data.ts
 */

import { prisma } from '@/lib/prisma';
import fs from 'fs';
import path from 'path';

async function generateStudyData() {
  console.log('开始生成金刚经学习数据...');

  // 并行获取章和偈颂
  const [chapters, verses] = await Promise.all([
    prisma.chapter.findMany({
      where: {
        sutra: {
          slug: 'diamond-sutra',
        },
      },
      select: {
        id: true,
        chapterNum: true,
        title: true,
        summary: true,
        imageUrl: true,
      },
      orderBy: { chapterNum: 'asc' },
    }),
    prisma.verse.findMany({
      where: {
        chapter: {
          sutra: {
            slug: 'diamond-sutra',
          },
        },
      },
      select: {
        id: true,
        chapterId: true,
        verseNum: true,
        chinese: true,
        english: true,
        sanskrit: true,
        aiKeyword: true,
      },
      orderBy: [{ chapter: { chapterNum: 'asc' } }, { verseNum: 'asc' }],
    }),
  ]);

  // 按章节分组偈颂
  const versesByChapter: Record<string, unknown[]> = {};
  verses.forEach((verse) => {
    if (!versesByChapter[verse.chapterId]) {
      versesByChapter[verse.chapterId] = [];
    }
    versesByChapter[verse.chapterId].push(verse);
  });

  // 合并数据
  const chaptersWithVerses = chapters.map((ch) => ({
    ...ch,
    verses: versesByChapter[ch.id] || [],
  }));

  const data = {
    chapters: chaptersWithVerses,
    generatedAt: new Date().toISOString(),
  };

  // 写入文件
  const outputPath = path.join(process.cwd(), 'src/app/study/study-data.json');
  fs.writeFileSync(outputPath, JSON.stringify(data, null, 2), 'utf-8');

  console.log(`✅ 数据已生成: ${outputPath}`);
  console.log(`   章节数: ${chapters.length}`);
  console.log(`   偈颂数: ${verses.length}`);
}

generateStudyData()
  .then(() => {
    console.log('完成！');
    process.exit(0);
  })
  .catch((error) => {
    console.error('错误:', error);
    process.exit(1);
  });
