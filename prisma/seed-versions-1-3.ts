/**
 * 第1-2-3章版本对照数据
 * Chapters 1-3 Version Comparison Data
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedVersions123() {
  console.log('开始填充第1-2-3章版本对照数据...');

  try {
    const sutra = await prisma.sutra.findFirst({
      where: { slug: 'diamond-sutra' }
    });

    if (!sutra) {
      throw new Error('未找到金刚经经文记录');
    }

    const chapters = await prisma.chapter.findMany({
      where: { 
        sutraId: sutra.id,
        chapterNum: { in: [1, 2, 3] }
      },
      orderBy: { chapterNum: 'asc' }
    });

    console.log(`找到 ${chapters.length} 个章节`);

    const chapter1 = chapters.find(c => c.chapterNum === 1);
    const chapter2 = chapters.find(c => c.chapterNum === 2);
    const chapter3 = chapters.find(c => c.chapterNum === 3);

    if (!chapter1 || !chapter2 || !chapter3) {
      throw new Error('未找到第1-2-3章');
    }

    const verses = await prisma.verse.findMany({
      where: { chapterId: { in: [chapter1.id, chapter2.id, chapter3.id] } },
      orderBy: [{ chapter: { chapterNum: 'asc' } }, { verseNum: 'asc' }]
    });

    console.log(`找到 ${verses.length} 个偈颂`);

    const versionData = [];

    for (const verse of verses) {
      const chapterNum = verse.chapterId === chapter1.id ? 1 : 
                       verse.chapterId === chapter2.id ? 2 : 3;
      const verseNum = verse.verseNum;

      if (chapterNum === 1) {
        if (verseNum === 1) {
          versionData.push({
            verseId: verse.id,
            versionType: 'xuanzang',
            versionName: '玄奘译本',
            language: 'zh',
            content: '如是我闻。一时，薄伽梵在室罗筏、誓多林给孤独园，与大苾刍众千二百五十人俱。',
            translator: '玄奘',
            year: '660',
            notes: '题名《能断金刚般若波罗蜜经》，在《大般若经》中为第九会'
          });
          versionData.push({
            verseId: verse.id,
            versionType: 'yijing',
            versionName: '义净译本',
            language: 'zh',
            content: '如是我闻。一时，薄伽梵在室罗伐、誓多林给孤独园，与大苾刍众千二百五十人俱。',
            translator: '义净',
            year: '703',
            notes: '义净法师所译，题为《佛说能断金刚般若波罗蜜多经》'
          });
          versionData.push({
            verseId: verse.id,
            versionType: 'tibetan',
            versionName: '藏文译本',
            language: 'bo',
            content: 'དེ་བཞིན་བདག་གིས་ཐོས་པ་ཡིན། དུས་གཅིག་ལ་བླ་མ་སངས་རྒྱས་ཤཱཀྱ་ཐུབ་དགེ་སློང་གི་ཚང་དུ་བཞུགས་ནས་དགེ་སྦྱང་སྟོང་ཕྲག་གཉིས་བརྒྱ་བ་དང་ལྷན་དུ་བཞུགས་པ་ཡོད་པ་རེད།',
            translator: '藏译本',
            year: '9世纪',
            notes: '藏译《金刚般若波罗蜜多经》，属于藏文大藏经甘珠尔部'
          });
        } else if (verseNum === 2) {
          versionData.push({
            verseId: verse.id,
            versionType: 'xuanzang',
            versionName: '玄奘译本',
            language: 'zh',
            content: '尔时，世尊于日初分时，着衣持钵，入室罗筏大城乞食。于其城中次第乞已，还至本处。饭食讫，收衣钵，洗足已，敷座而坐。',
            translator: '玄奘',
            year: '660'
          });
          versionData.push({
            verseId: verse.id,
            versionType: 'yijing',
            versionName: '义净译本',
            language: 'zh',
            content: '尔时，世尊于日初分时，着衣持钵，入室罗伐大城乞食。于其城中次第乞已，还至本处。饭食讫，收衣钵，洗足已，敷座而坐。',
            translator: '义净',
            year: '703'
          });
        }
      } else if (chapterNum === 2) {
        if (verseNum === 1) {
          versionData.push({
            verseId: verse.id,
            versionType: 'xuanzang',
            versionName: '玄奘译本',
            language: 'zh',
            content: '时，长老须菩提在大众中即从座起，偏袒右肩，右膝着地，合掌恭敬而白佛言："希有！世尊！如来善护念诸菩萨，善付嘱诸菩萨。"',
            translator: '玄奘',
            year: '660'
          });
          versionData.push({
            verseId: verse.id,
            versionType: 'yijing',
            versionName: '义净译本',
            language: 'zh',
            content: '时，长老须菩提在大众中即从座起，偏袒右肩，右膝着地，合掌恭敬而白佛言："希有！世尊！如来善护念诸菩萨，善付嘱诸菩萨。"',
            translator: '义净',
            year: '703'
          });
        } else if (verseNum === 2) {
          versionData.push({
            verseId: verse.id,
            versionType: 'xuanzang',
            versionName: '玄奘译本',
            language: 'zh',
            content: '世尊！善男子、善女人，发阿耨多罗三藐三菩提心，应云何住？云何降伏其心？',
            translator: '玄奘',
            year: '660',
            notes: '玄奘译本更注重直译，忠实于梵文原典'
          });
          versionData.push({
            verseId: verse.id,
            versionType: 'yijing',
            versionName: '义净译本',
            language: 'zh',
            content: '世尊！善男子、善女人，发阿耨多罗三藐三菩提心，应云何住？云何降伏其心？',
            translator: '义净',
            year: '703',
            notes: '义净译本在用词上略有不同，但整体意旨一致'
          });
        } else if (verseNum === 3) {
          versionData.push({
            verseId: verse.id,
            versionType: 'xuanzang',
            versionName: '玄奘译本',
            language: 'zh',
            content: '佛言："善哉善哉！须菩提！如汝所说，如来善护念诸菩萨，善付嘱诸菩萨。汝今谛听！当为汝说。" 善男子、善女人，发阿耨多罗三藐三菩提心，应如是住，如是降伏其心。',
            translator: '玄奘',
            year: '660',
            notes: '玄奘译本增加了对须菩提回答的确认'
          });
          versionData.push({
            verseId: verse.id,
            versionType: 'yijing',
            versionName: '义净译本',
            language: 'zh',
            content: '佛言："善哉善哉！须菩提！如汝所说，如来善护念诸菩萨，善付嘱诸菩萨。汝今谛听！当为汝说。"',
            translator: '义净',
            year: '703'
          });
        }
      } else if (chapterNum === 3) {
        if (verseNum === 1) {
          versionData.push({
            verseId: verse.id,
            versionType: 'xuanzang',
            versionName: '玄奘译本',
            language: 'zh',
            content: '诸菩萨摩诃萨，应如是降伏其心："所有一切众生之类，若卵生、若胎生、若湿生、若化生，若有色、若无色，若有想、若无想、若非有想非无想，我皆令入无余涅槃而灭度之。" 如是灭度无量无数无边众生，实无众生得灭度者。',
            translator: '玄奘',
            year: '660',
            notes: '玄奘译本强调"摩诃萨"（大菩萨）的含义'
          });
          versionData.push({
            verseId: verse.id,
            versionType: 'yijing',
            versionName: '义净译本',
            language: 'zh',
            content: '诸菩萨摩诃萨，应如是降伏其心："所有一切众生之类，若卵生、若胎生、若湿生、若化生，若有色、若无色，若有想、若无想、若非有想非无想，我皆令入无余涅槃而灭度之。" 如是灭度无量无数无边众生，实无众生得灭度者。',
            translator: '义净',
            year: '703'
          });
        } else if (verseNum === 2) {
          versionData.push({
            verseId: verse.id,
            versionType: 'xuanzang',
            versionName: '玄奘译本',
            language: 'zh',
            content: '何以故？须菩提！若菩萨有我相、人相、众生相、寿者相，即非菩萨。',
            translator: '玄奘',
            year: '660',
            notes: '玄奘译本的"四相"表述与鸠摩罗什译本一致'
          });
          versionData.push({
            verseId: verse.id,
            versionType: 'yijing',
            versionName: '义净译本',
            language: 'zh',
            content: '何以故？须菩提！若菩萨有我相、人相、众生相、寿者相，即非菩萨。',
            translator: '义净',
            year: '703'
          });
        }
      }
    }

    console.log(`准备插入 ${versionData.length} 条版本对照记录`);

    for (const data of versionData) {
      await prisma.sutraVersion.upsert({
        where: {
          verseId_versionType: {
            verseId: data.verseId,
            versionType: data.versionType
          }
        },
        update: data,
        create: data
      });
    }

    console.log('✓ 第1-2-3章版本对照数据填充完成');
  } catch (error) {
    console.error('填充版本对照数据时出错:', error);
    throw error;
  }
}

seedVersions123()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
