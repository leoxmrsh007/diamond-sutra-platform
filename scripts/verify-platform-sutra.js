#!/usr/bin/env node

/**
 * 六祖坛经内容验证脚本
 * 检查数据库中的内容是否完整
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function verifyPlatformSutra() {
  try {
    console.log('🔍 验证六祖坛经内容...\n');

    // 1. 检查经书基本信息
    const sutra = await prisma.sutra.findUnique({
      where: { slug: 'platform-sutra' },
      select: {
        id: true,
        title: true,
        description: true,
      },
    });

    if (!sutra) {
      console.log('❌ 未找到六祖坛经数据');
      return;
    }

    console.log('✅ 经书信息:');
    console.log(`   标题: ${sutra.title}`);
    console.log(`   描述长度: ${sutra.description?.length || 0} 字符\n`);

    // 2. 检查所有章节
    const chapters = await prisma.chapter.findMany({
      where: { sutraId: sutra.id },
      include: {
        sections: {
          orderBy: { sectionNum: 'asc' },
        },
      },
      orderBy: { chapterNum: 'asc' },
    });

    console.log('📖 章节统计:');
    console.log(`   总章节数: ${chapters.length}`);
    console.log(`   预期章节数: 10\n`);

    if (chapters.length !== 10) {
      console.log(`⚠️ 章节数量不符！预期 10 章，实际 ${chapters.length} 章`);
    } else {
      console.log('✅ 章节数量正确');
    }

    // 3. 检查每章的段落数量和内容
    console.log('📝 章节详情:');
    let totalSections = 0;
    let totalChars = 0;
    let emptySections = 0;
    let shortSections = 0;

    chapters.forEach((chapter, index) => {
      const sectionCount = chapter.sections.length;
      totalSections += sectionCount;

      let chapterChars = 0;
      let chapterEmpty = 0;
      let chapterShort = 0;

      chapter.sections.forEach(section => {
        if (!section.content || section.content.length < 10) {
          emptySections++;
          chapterEmpty++;
        } else if (section.content.length < 20) {
          shortSections++;
          chapterShort++;
        }

        if (section.content) {
          chapterChars += section.content.length;
          totalChars += section.content.length;
        }
      });

      const isEmpty = chapterEmpty === sectionCount;
      let status;
      if (isEmpty) {
        status = '❌ 空白';
      } else if (chapterShort > 0) {
        status = '⚠️ 短少';
      } else {
        status = '✅ 完整';
      }
      const avgLength = sectionCount > 0 ? Math.round(chapterChars / sectionCount) : 0;

      console.log(`\n   ${status} 第${chapter.chapterNum}品: ${chapter.title}`);
      console.log(`      段落数: ${sectionCount} (预期: 5)`);
      console.log(`      空白段落: ${chapterEmpty}`);
      console.log(`      短少段落: ${chapterShort}`);
      console.log(`      平均段落长度: ${avgLength} 字符`);
      console.log(`      总字符数: ${chapterChars}`);

      if (sectionCount !== 5) {
        console.log(`      ⚠️ 段落数量不足！`);
      }
    });

    // 4. 总体统计
    console.log('\n📊 总体统计:');
    console.log(`   总段落数: ${totalSections} (预期: 53)`);
    console.log(`   总字符数: ${totalChars}`);
    console.log(`   空白段落数: ${emptySections}`);
    console.log(`   短少段落数: ${shortSections}`);
    console.log(`   平均每章段落: ${(totalSections / chapters.length).toFixed(1)}`);
    console.log(`   平均每段落字符: ${(totalChars / totalSections).toFixed(1)}`);

    // 5. 问题检查
    console.log('\n🔍 问题检查:');

    const issues = [];

    if (chapters.length !== 10) {
      issues.push(`章节数量不正确：预期 10 章，实际 ${chapters.length} 章`);
    }

    if (totalSections !== 53) {
      issues.push(`段落数量不正确：预期 53 段，实际 ${totalSections} 段`);
    }

    if (emptySections > 0) {
      issues.push(`发现 ${emptySections} 个空段落`);
    }

    if (shortSections > 0) {
      issues.push(`发现 ${shortSections} 个短段落（<20字符）`);
    }

    const chaptersWithMissingSections = chapters.filter(ch => ch.sections.length < 5);
    if (chaptersWithMissingSections.length > 0) {
      issues.push(`以下章节段落数不足（<5个）:`);
      chaptersWithMissingSections.forEach(ch => {
        issues.push(`  - 第${ch.chapterNum}品: ${ch.sections.length} 个段落`);
      });
    }

    if (issues.length === 0) {
      console.log('✅ 未发现问题！内容完整。');
    } else {
      console.log(`\n⚠️ 发现 ${issues.length} 个问题:`);
      issues.forEach(issue => {
        console.log(`   - ${issue}`);
      });
    }

    // 6. 标题和摘要检查
    console.log('\n📄 标题和摘要检查:');
    const missingSummaries = chapters.filter(ch => !ch.summary || ch.summary.length < 5);
    if (missingSummaries.length > 0) {
      console.log(`⚠️ 以下章节缺少摘要:`);
      missingSummaries.forEach(ch => {
        console.log(`   - 第${ch.chapterNum}品`);
      });
    } else {
      console.log('✅ 所有章节都有摘要');
    }

    // 7. 内容完整性检查
    console.log('\n📖 内容完整性检查:');
    const expectedFirstChapter = {
      title: '行由品',
      summary: '记述惠能的出身、求法经历，以及得法南下的因缘。',
      sectionCount: 8,
    };

    const firstChapter = chapters[0];
    if (firstChapter) {
      console.log(`   第一章: ${firstChapter.title}`);
      console.log(`   预期标题: ${expectedFirstChapter.title}`);
      console.log(`   标题匹配: ${firstChapter.title === expectedFirstChapter.title ? '✅' : '⚠️'}`);
      console.log(`   摘要长度: ${firstChapter.summary?.length || 0} 字符`);
      console.log(`   段落数: ${firstChapter.sections.length} (预期: ${expectedFirstChapter.sectionCount})`);
    }

    await prisma.$disconnect();

  } catch (error) {
    console.error('❌ 验证失败:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

verifyPlatformSutra();
