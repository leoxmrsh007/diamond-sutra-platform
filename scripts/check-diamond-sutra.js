const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkDiamondSutraData() {
  try {
    console.log('=== 金刚经数据检查 ===\n');

    // 获取金刚经信息
    const diamondSutra = await prisma.sutra.findUnique({
      where: { slug: 'diamond-sutra' },
      include: {
        chapters: {
          include: {
            _count: {
              select: { verses: true }
            }
          },
          orderBy: { chapterNum: 'asc' }
        }
      }
    });

    if (!diamondSutra) {
      console.log('未找到金刚经数据！');
      return;
    }

    console.log(`经文标题：${diamondSutra.title}`);
    console.log(`总章节数：${diamondSutra.chapters.length}\n`);

    let totalVerses = 0;
    diamondSutra.chapters.forEach((chapter, index) => {
      console.log(`第 ${chapter.chapterNum} 分: ${chapter.title}`);
      console.log(`  当前偈颂数：${chapter._count.verses}`);
      totalVerses += chapter._count.verses;
    });

    console.log(`\n总计偈颂数：${totalVerses}`);
    console.log(`目标偈颂数：32分 × ~5-10偈颂/分 ≈ 160-320个偈颂`);
    console.log(`还需补充：${160 - totalVerses} ~ ${320 - totalVerses} 个偈颂\n`);

    // 检查现有偈颂的完整性
    const sampleVerses = await prisma.verse.findMany({
      where: {
        chapter: {
          sutra: { slug: 'diamond-sutra' }
        }
      },
      take: 5,
      include: { chapter: true }
    });

    if (sampleVerses.length > 0) {
      console.log('=== 样本偈颂检查 ===\n');
      sampleVerses.forEach((verse) => {
        console.log(`第${verse.chapter.chapterNum}分 - 第${verse.verseNum}偈：`);
        console.log(`  中文：${verse.chinese}`);
        console.log(`  梵文：${verse.sanskrit || '无'}`);
        console.log(`  英文：${verse.english || '无'}`);
        console.log(`  拼音：${verse.pinyin || '无'}`);
        console.log(`  白话：${verse.modern || '无'}`);
        console.log(`  原文：${verse.original || '无'}`);
        console.log('');
      });
    }

  } catch (error) {
    console.error('错误：', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkDiamondSutraData();
