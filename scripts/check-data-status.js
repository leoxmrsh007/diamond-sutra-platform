const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkDataStatus() {
  try {
    console.log('=== 检查数据库数据状态 ===\n');

    // 检查金刚经
    const diamondSutra = await prisma.sutra.findUnique({
      where: { slug: 'diamond-sutra' }
    });

    if (!diamondSutra) {
      console.log('❌ 金刚经数据未初始化');
    } else {
      const diamondChapters = await prisma.chapter.findMany({
        where: { sutraId: diamondSutra.id },
        include: { _count: { select: { verses: true } } }
      });

      const diamondVerses = await prisma.verse.count({
        where: {
          chapter: { sutraId: diamondSutra.id }
        }
      });

      console.log('✅ 金刚经数据已初始化');
      console.log(`经文: ${diamondSutra.title}`);
      console.log(`章节数: ${diamondChapters.length}`);
      console.log(`偈颂数: ${diamondVerses}`);
    }

    console.log('');

    // 检查六祖坛经
    const platformSutra = await prisma.sutra.findUnique({
      where: { slug: 'platform-sutra' }
    });

    if (!platformSutra) {
      console.log('❌ 六祖坛经数据未初始化');
      console.log('\n提示: 请运行以下命令初始化数据');
      console.log('  npm run db:seed');
    } else {
      const platformChapters = await prisma.chapter.findMany({
        where: { sutraId: platformSutra.id },
        include: { _count: { select: { sections: true } } }
      });

      const platformSections = await prisma.section.count({
        where: {
          chapter: { sutraId: platformSutra.id }
        }
      });

      console.log('✅ 六祖坛经数据已初始化');
      console.log(`经文: ${platformSutra.title}`);
      console.log(`章节数: ${platformChapters.length}`);
      console.log(`段落数: ${platformSections}`);
      console.log('');

      console.log('各章节数据:');
      platformChapters.forEach((c, i) => {
        console.log(`  第${c.chapterNum}分: ${c.title}`);
        console.log(`    段落数: ${c._count.sections || 0}`);
      });
    }

    console.log('\n=== 数据检查完成 ===\n');
  } catch (error) {
    console.error('错误:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkDataStatus();
