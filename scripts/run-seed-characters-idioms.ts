/**
 * 运行种子数据脚本：添加难点字和成语
 */

import { PrismaClient } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import DIFFICULT_CHARACTERS from '../prisma/seed-data/diamond-sutra-difficult-chars';
import IDIOMS from '../prisma/seed-data/diamond-sutra-idioms';

const client = new PrismaClient();

async function main() {
  try {
    console.log('🌟 开始添加难点字和成语数据...');

    // 获取金刚经ID
    const sutra = await prisma.sutra.findUnique({
      where: { slug: 'diamond-sutra' },
    });

    if (!sutra) {
      throw new Error('金刚经经文不存在');
    }

    console.log(`经文ID: ${sutra.id}`);

    // 添加难点字
    console.log('\n📝 添加难点字...');
    for (const charData of DIFFICULT_CHARACTERS) {
      try {
        await prisma.difficultCharacter.create({
          data: {
            scriptureId: sutra.id,
            character: charData.character,
            pinyin: charData.pinyin,
            meaning: charData.meaning,
            context: charData.context,
            frequency: charData.frequency,
          },
        });
        console.log(`✅ ${charData.character} (${charData.pinyin})`);
      } catch (error) {
        // 可能已存在，跳过
        console.log(`⏭️ ${charData.character} 已存在，跳过`);
      }
    }

    // 添加成语
    console.log('\n📖 添加成语和术语...');
    for (const idiomData of IDIOMS) {
      try {
        await prisma.idiom.create({
          data: {
            scriptureId: sutra.id,
            word: idiomData.word,
            pinyin: null, // 成语拼音可以后续添加
            meaning: idiomData.meaning,
            chapterNum: idiomData.chapter,
            source: idiomData.source,
            category: idiomData.category,
          },
        });
        console.log(`✅ ${idiomData.word}`);
      } catch (error) {
        // 可能已存在，跳过
        console.log(`⏭️ ${idiomData.word} 已存在，跳过`);
      }
    }

    console.log('\n✨ 种子数据添加完成！');
    console.log(`\n添加难点字：${DIFFICULT_CHARACTERS.length} 个`);
    console.log(`添加成语/术语：${IDIOMS.length} 个`);

  } catch (error) {
    console.error('❌ 添加种子数据失败:', error);
    throw error;
  } finally {
    await client.$disconnect();
  }
}

main();
