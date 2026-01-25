/**
 * 测试难点字和成语API端点
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testAPI() {
  console.log('🧪 开始测试API端点...\n');

  try {
    // 测试1: 检查数据库中的难点字数据
    console.log('1️⃣ 测试难点字数据...');
    const characters = await prisma.difficultCharacter.findMany();
    console.log(`✅ 找到 ${characters.length} 个难点字`);
    if (characters.length > 0) {
      console.log(`   示例: ${characters[0].character} (${characters[0].pinyin})`);
    }

    // 测试2: 检查数据库中的成语数据
    console.log('\n2️⃣ 测试成语/术语数据...');
    const idioms = await prisma.idiom.findMany();
    console.log(`✅ 找到 ${idioms.length} 个成语/术语`);
    if (idioms.length > 0) {
      console.log(`   示例: ${idioms[0].word} (${idioms[0].category})`);
    }

    // 测试3: 检查经文数据
    console.log('\n3️⃣ 测试经文数据...');
    const sutras = await prisma.sutra.findMany();
    console.log(`✅ 找到 ${sutras.length} 部经文`);
    sutras.forEach(sutra => {
      console.log(`   - ${sutra.title} (${sutra.slug})`);
    });

    // 测试4: 检查章节和偈颂数据
    console.log('\n4️⃣ 测试章节和偈颂数据...');
    const chapters = await prisma.chapter.findMany({
      where: {
        sutraId: sutras[0]?.id
      },
      include: {
        verses: {
          take: 5
        }
      }
    });
    console.log(`✅ 找到 ${chapters.length} 个章节`);
    if (chapters.length > 0) {
      console.log(`   第一章有 ${chapters[0].verses.length} 个偈颂`);
      if (chapters[0].verses.length > 0) {
        console.log(`   示例偈颂: ${chapters[0].verses[0].chinese.substring(0, 30)}...`);
      }
    }

    console.log('\n✨ 测试完成！');
    console.log('\n📝 建议：');
    console.log('1. 访问 https://www.jinganjing.cn/study 查看学习页面');
    console.log('2. 在学习页面中，难点字应该显示虚线下划线');
    console.log('3. 鼠标悬停在难点字上，应该显示拼音和释义');
    console.log('4. 成语显示功能需要在侧边栏中集成（待完成）');

  } catch (error) {
    console.error('❌ 测试失败:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testAPI();
