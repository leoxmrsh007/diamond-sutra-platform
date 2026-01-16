/**
 * 数据库状态检查脚本
 * 用于查看当前数据库中的数据
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('=== 数据库状态检查 ===\n');

  // 检查各个表的记录数
  const tables = [
    { name: 'sutras', model: prisma.sutra },
    { name: 'chapters', model: prisma.chapter },
    { name: 'verses', model: prisma.verse },
    { name: 'courses', model: prisma.course },
    { name: 'concepts', model: prisma.concept },
    { name: 'users', model: prisma.user },
    { name: 'posts', model: prisma.post },
    { name: 'comments', model: prisma.comment },
  ];

  for (const table of tables) {
    try {
      const count = await table.model.count();
      console.log(`✓ ${table.name.padEnd(20)}: ${count} 条记录`);
    } catch (error: {
      console.log(`✗ ${table.name.padEnd(20)}: 错误 - ${(error as Error).message}`);
    }
  }

  // 检查是否有经文记录
  const sutra = await prisma.sutra.findFirst();
  if (sutra) {
    console.log(`\n经文记录：`);
    console.log(`  ID: ${sutra.id}`);
    console.log(`  标题: ${sutra.title}`);
    console.log(`  Slug: ${sutra.slug}`);
  } else {
    console.log(`\n⚠️  未找到经文记录`);
  }

  // 检查是否有章节数据
  const chapters = await prisma.chapter.findMany();
  console.log(`\n章节记录：${chapters.length} 条`);
  if (chapters.length > 0) {
    console.log(`  示例：${chapters[0].chapterNum}. ${chapters[0].title}`);
  }

  // 检查是否有偈颂数据
  const verses = await prisma.verse.findMany();
  console.log(`\n偈颂记录：${verses.length} 条`);
  if (verses.length > 0) {
    console.log(`  示例：第${verses[0].chapterId}章 第${verses[0].verseNum}偈`);
  }

  console.log('\n=== 检查完成 ===');
}

main()
  .catch((e) => {
    console.error('错误:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
