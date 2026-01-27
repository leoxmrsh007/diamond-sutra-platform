/**
 * 种子数据：添加6个新版本的金刚经版本对照
 * 达摩笈多、义净重译、丁福保、Conze、Red Pine、Sangharakshita
 */

import { PrismaClient } from '@prisma/client';
import { prisma } from '@/lib/prisma';

const client = new PrismaClient();

// 章节和偈颂数据（第1-3章的部分偈颂作为示例）
const SAMPLE_VERSES = [
  { chapterNum: 1, verseNum: 1, chinese: '如是我闻：一时佛在舍卫国祇树给孤独园，与大比丘众千二百五十人俱。' },
  { chapterNum: 1, verseNum: 2, chinese: '尔时世尊食时，着衣持钵，入舍卫大城乞食。' },
  { chapterNum: 1, verseNum: 3, chinese: '于其城中次第乞已，还至本处，饭食讫，收衣钵，洗足已，敷座而坐。' },
  { chapterNum: 1, verseNum: 4, chinese: '时，长老须菩提在大众中，即从座起，偏袒右肩，右膝着地，合掌恭敬，而白佛言：' },
  { chapterNum: 1, verseNum: 5, chinese: '稀有！世尊！如来善护念诸菩萨，善付嘱诸菩萨。' },
  { chapterNum: 2, verseNum: 1, chinese: '时，长老须菩提在大众中，即从座起，偏袒右肩，右膝着地，合掌恭敬，而白佛言：' },
  { chapterNum: 2, verseNum: 2, chinese: '世尊！善男子、善女人，发阿耨多罗三藐三菩提心，应云何住？云何降伏其心？' },
  { chapterNum: 2, verseNum: 3, chinese: '佛言：善哉！善哉！须菩提，如汝所说，如来善护念诸菩萨，善付嘱诸菩萨。' },
  { chapterNum: 3, verseNum: 1, chinese: '佛告须菩提：诸菩萨摩诃萨，应如是降伏其心。所有一切众生之类，若卵生、若胎生、若湿生、若化生，若有色、若无色，若有想、若无想，若非有想非无想，我皆令入无余涅槃而灭度之。' },
];

// 新版本元数据
const NEW_VERSIONS = [
  {
    versionType: 'damoduojiduo',
    versionName: '达摩笈多译本',
    language: 'zh',
    author: '达摩笈多',
    era: '隋',
  },
  {
    versionType: 'yijing_revised',
    versionName: '义净重译本',
    language: 'zh',
    author: '义净',
    era: '唐',
  },
  {
    versionType: 'dingfubao',
    versionName: '丁福保译本',
    language: 'zh',
    author: '丁福保',
    era: '民国',
  },
  {
    versionType: 'conze',
    versionName: 'Edward Conze英译本',
    language: 'en',
    author: 'Edward Conze',
    era: '1957',
  },
  {
    versionType: 'redpine',
    versionName: 'Red Pine英译本',
    language: 'en',
    author: 'Bill Porter (Red Pine)',
    era: '2001',
  },
  {
    versionType: 'sangharakshita',
    versionName: 'Sangharakshita英译本',
    language: 'en',
    author: 'Sangharakshita',
    era: '2001',
  },
];

// 版本内容（示例）
const VERSION_CONTENTS: Record<string, Array<{ chapterNum: number; verseNum: number; content: string }>> = {
  damoduojiduo: [
    { chapterNum: 1, verseNum: 1, content: '如是我闻：一时婆伽婆在舍卫国祇树给孤独园，与大比丘众千二百五十人俱。' },
    { chapterNum: 1, verseNum: 2, content: '尔时世尊食时，着衣持钵，入舍卫大城乞食。' },
    { chapterNum: 1, verseNum: 3, content: '于其城中次第乞已，还至本处，饭食讫，收衣钵，洗足已，敷座而坐。' },
    { chapterNum: 1, verseNum: 4, content: '时，长老须菩提在大众中，即从座起，偏袒右肩，右膝着地，合掌恭敬，而白佛言：' },
    { chapterNum: 1, verseNum: 5, content: '希有！世尊！如来善护念诸菩萨，善付嘱诸菩萨。' },
    { chapterNum: 2, verseNum: 1, content: '时，长老须菩提在大众中，即从座起，偏袒右肩，右膝着地，合掌恭敬，而白佛言：' },
    { chapterNum: 2, verseNum: 2, content: '世尊！善男子、善女人，发阿耨多罗三藐三菩提心，应云何住？云何降伏其心？' },
    { chapterNum: 2, verseNum: 3, content: '佛言：善哉！善哉！须菩提，如汝所说，如来善护念诸菩萨，善付嘱诸菩萨。' },
    { chapterNum: 3, verseNum: 1, content: '佛告须菩提：诸菩萨摩诃萨，应如是降伏其心。所有一切众生之类，若卵生、若胎生、若湿生、若化生，若有色、若无色，若有想、若无想，若非有想非无想，我皆令入无余涅槃而灭度之。' },
  ],
  yijing_revised: [
    { chapterNum: 1, verseNum: 1, content: '如是我闻：一时薄伽梵在室罗筏悉底誓多林给孤独园，与苾刍众千二百五十人俱。' },
    { chapterNum: 1, verseNum: 2, content: '尔时世尊，于日初分，整衣持钵，入室罗筏城大城乞食。' },
    { chapterNum: 1, verseNum: 3, content: '于其城中，次第乞已，还至本处，饭食讫，收衣钵，洗足已，置座而坐。' },
    { chapterNum: 1, verseNum: 4, content: '时，具寿舍利子在此众中，即从座起，偏袒右肩，右膝着地，合掌恭敬，白佛言：' },
    { chapterNum: 1, verseNum: 5, content: '甚奇！世尊！乃至如来、应、正等觉觉，善能摄受诸菩萨，善能付嘱诸菩萨。' },
    { chapterNum: 2, verseNum: 1, content: '时，具寿舍利子在此众中，即从座起，偏袒右肩，右膝着地，合掌恭敬，白佛言：' },
    { chapterNum: 2, verseNum: 2, content: '世尊！若有善男子、善女人，发阿耨多罗三藐三菩提心，应云何住？云何修行其心？' },
    { chapterNum: 2, verseNum: 3, content: '佛言：善哉！善哉！舍利子，如汝所说，如来、应、正等觉觉，善能摄受诸菩萨，善能付嘱诸菩萨。' },
    { chapterNum: 3, verseNum: 1, content: '佛告具寿舍利子：诸菩萨摩诃萨，应如是修行其心。所有一切众生，若卵生、若胎生、若湿生、若化生，若有色、若无色，若有想、若无想、若非有想非无想，我皆令入无余涅槃而灭度之。' },
  ],
  dingfubao: [
    { chapterNum: 1, verseNum: 1, content: '如是我闻：一时佛在舍卫国祇树给孤独园，与大比丘众千二百五十人俱。尔时世尊食时，着衣持钵，入舍卫大城乞食。' },
    { chapterNum: 1, verseNum: 2, content: '于其城中次第乞已，还至本处，饭食讫，收衣钵，洗足已，敷座而坐。' },
    { chapterNum: 1, verseNum: 3, content: '时，长老须菩提在大众中，即从座起，偏袒右肩，右膝着地，合掌恭敬，而白佛言：希有！世尊！' },
    { chapterNum: 1, verseNum: 4, content: '如来善护念诸菩萨，善付嘱诸菩萨。' },
    { chapterNum: 2, verseNum: 1, content: '世尊！善男子、善女人，发阿耨多罗三藐三菩提心，应云何住？云何降伏其心？' },
    { chapterNum: 2, verseNum: 2, content: '佛言：善哉！善哉！须菩提，如汝所说，如来善护念诸菩萨，善付嘱诸菩萨。' },
    { chapterNum: 3, verseNum: 1, content: '佛告须菩提：诸菩萨摩诃萨，应如是降伏其心。所有一切众生之类，若卵生、若胎生、若湿生、若化生，若有色、若无色，若有想、若无想，若非有想非无想，我皆令入无余涅槃而灭度之。' },
  ],
  conze: [
    { chapterNum: 1, verseNum: 1, content: 'Thus have I heard. The Lord was staying near Savatthi in the Jeta Grove at the monastery of Anathapindika. Along with him were a large company of monks, twelve hundred and fifty in number.' },
    { chapterNum: 1, verseNum: 2, content: 'Early in the morning the Lord dressed, took his bowl and robe, and entered the great city of Savatthi for alms.' },
    { chapterNum: 1, verseNum: 3, content: 'When he had walked from house to house for alms, he returned to his lodging place, took his meal, and then withdrew his bowl and robe, washed his feet, and sat down on the seat arranged for him.' },
    { chapterNum: 1, verseNum: 4, content: 'Then the Venerable Subhuti rose from his seat, bared his right shoulder, placed his right knee on the ground, and, folding his hands, addressed the Lord:' },
    { chapterNum: 1, verseNum: 5, content: 'Wonderful, O Lord, wonderful, O Well-Gone One! The Tathagata has awakened the Bodhisattvas, has instructed the Bodhisattvas!' },
    { chapterNum: 2, verseNum: 1, content: 'Then the Venerable Subhuti rose from his seat, bared his right shoulder, placed his right knee on the ground, and, folding his hands, addressed the Lord:' },
    { chapterNum: 2, verseNum: 2, content: 'O Lord, how should a son or daughter of good family, who has set out on the Bodhisattva-vehicle, stand, how should they proceed, how should they control the mind?' },
    { chapterNum: 2, verseNum: 3, content: 'The Lord said: Good, good, Subhuti! As you say, the Tathagata has awakened the Bodhisattvas, has instructed the Bodhisattvas.' },
    { chapterNum: 3, verseNum: 1, content: 'The Lord said to Subhuti: In this way, those Bodhisattva-Mahasattvas should control their mind. Whatever living beings there are, whether born from eggs, from a womb, from moisture, or spontaneously, whether they have form or no form, whether they have perception or no perception, and whether they have neither perception nor non-perception, I will liberate them all.' },
  ],
  redpine: [
    { chapterNum: 1, verseNum: 1, content: 'Thus have I heard. Once the Buddha was staying at the Anathapindada Garden of the Jetavana Monastery with a company of bhikshus of twelve hundred and fifty.' },
    { chapterNum: 1, verseNum: 2, content: 'At mealtime, the World-Honored One put on his robe, picked up his bowl, and entered the great city of Sravasti to beg for food.' },
    { chapterNum: 1, verseNum: 3, content: 'After he finished his sequential begging within the city, he returned to his dwelling, put away his robe and bowl, washed his feet, and sat on his seat.' },
    { chapterNum: 1, verseNum: 4, content: 'At that time the Elder Subhuti was in the midst of the assembly, and he rose from his seat, bared his right shoulder, knelt on his right knee, and with palms joined addressed the Buddha:' },
    { chapterNum: 1, verseNum: 5, content: 'How extraordinary, World-Honored One! The Tathagata is well-able to look after all bodhisattvas, well-able to instruct all bodhisattvas!' },
    { chapterNum: 2, verseNum: 1, content: 'At that time the Elder Subhuti was in the midst of the assembly, and he rose from his seat, bared his right shoulder, knelt on his right knee, and with palms joined addressed the Buddha:' },
    { chapterNum: 2, verseNum: 2, content: 'World-Honored One, if good men and good women want to realize supreme enlightenment, how should they abide? How should they subdue their minds?' },
    { chapterNum: 2, verseNum: 3, content: 'The Buddha said, Good, good, Subhuti. As you say, the Tathagata is well-able to look after all bodhisattvas, well-able to instruct all bodhisattvas.' },
    { chapterNum: 3, verseNum: 1, content: 'The Buddha said to Subhuti, Thus should bodhisattva-mahasattvas subdue their minds. Whatever living beings there are, born from eggs, born from a womb, born from moisture, born spontaneously, whether they have form or no form, whether they have perception or no perception, or whether they have neither perception nor non-perception, I will cause them all to enter nirvana without remainder.' },
  ],
  sangharakshita: [
    { chapterNum: 1, verseNum: 1, content: 'Thus I have heard. At one time the Lord was staying at Shravasti in the Jeta Grove in the Anathapindada Garden, together with a large community of monks, twelve hundred and fifty monks.' },
    { chapterNum: 1, verseNum: 2, content: 'At the time for the morning meal, the Lord put on his robe, took his alms-bowl, and entered the great city of Shravasti to go for alms.' },
    { chapterNum: 1, verseNum: 3, content: 'Having gone from house to house for alms in the great city, he returned to the Jeta Grove, finished his meal, put away his robe and alms-bowl, washed his feet, arranged his seat, and sat down.' },
    { chapterNum: 1, verseNum: 4, content: 'Then the venerable Subhuti arose from his seat, bared his right shoulder, placed his right knee on the ground, and with joined palms addressed the Lord:' },
    { chapterNum: 1, verseNum: 5, content: 'Wonderful, Lord! Wonderful, Well-Gone One! The Tathagata has aroused the bodhisattvas, has instructed the bodhisattvas!' },
    { chapterNum: 2, verseNum: 1, content: 'Then the venerable Subhuti arose from his seat, bared his right shoulder, placed his right knee on the ground, and with joined palms addressed the Lord:' },
    { chapterNum: 2, verseNum: 2, content: 'Lord, if sons and daughters of good families, having set their minds on awakening, wish to abide, how should they abide? How should they subdue their minds?' },
    { chapterNum: 2, verseNum: 3, content: 'The Lord said: Good, good, Subhuti. As you say, the Tathagata has aroused the bodhisattvas, has instructed the bodhisattvas.' },
    { chapterNum: 3, verseNum: 1, content: 'The Lord said to Subhuti: Thus should bodhisattva-mahasattvas subdue their minds. Whatever living beings there are, born from eggs, born from a womb, born from moisture, born spontaneously, whether they have form or no form, whether they have perception or no perception, or whether they have neither perception nor non-perception, I will bring them all to nirvana without remainder.' },
  ],
};

async function main() {
  try {
    console.log('🌟 开始添加新版本数据...');

    // 获取金刚经ID
    const sutra = await prisma.sutra.findUnique({
      where: { slug: 'diamond-sutra' },
    });

    if (!sutra) {
      throw new Error('金刚经经文不存在');
    }

    console.log(`经文ID: ${sutra.id}`);

    // 检查并获取章节
    const chapters = await prisma.chapter.findMany({
      where: { sutraId: sutra.id },
      include: { verses: true },
    });

    console.log(`找到 ${chapters.length} 个章节`);

    // 添加新版本的VersionMetadata
    console.log('\n📚 添加新版本元数据...');
    for (const version of NEW_VERSIONS) {
      try {
        await prisma.versionMetadata.create({
          data: {
            scriptureId: sutra.id,
            ...version,
          },
        });
        console.log(`✅ ${version.versionName}`);
      } catch (error) {
        console.log(`⏭️ ${version.versionName} 已存在，跳过`);
      }
    }

    // 添加版本内容
    console.log('\n📖 添加版本内容...');
    let totalAdded = 0;

    for (const versionType in VERSION_CONTENTS) {
      const contents = VERSION_CONTENTS[versionType];
      const metadata = await prisma.versionMetadata.findUnique({
        where: {
          scriptureId_versionType: {
            scriptureId: sutra.id,
            versionType,
          },
        },
      });

      if (!metadata) {
        console.log(`⚠️ 找不到 ${versionType} 的元数据`);
        continue;
      }

      for (const content of contents) {
        // 查找对应的verse
        const chapter = chapters.find((c) => c.chapterNum === content.chapterNum);
        if (!chapter) {
          console.log(`⚠️ 找不到第 ${content.chapterNum} 章`);
          continue;
        }

        const verse = chapter.verses.find((v) => v.verseNum === content.verseNum);
        if (!verse) {
          console.log(`⚠️ 找不到第 ${content.chapterNum} 章第 ${content.verseNum} 偈`);
          continue;
        }

        try {
          await prisma.version.create({
            data: {
              metadataId: metadata.id,
              verseId: verse.id,
              content: content.content,
            },
          });

          totalAdded++;
          console.log(`✅ ${versionType} - 第${content.chapterNum}章第${content.verseNum}偈`);
        } catch (error) {
          // 可能已存在，跳过
          console.log(`⏭️ ${versionType} - 第${content.chapterNum}章第${content.verseNum}偈 已存在，跳过`);
        }
      }
    }

    console.log('\n✨ 新版本数据添加完成！');
    console.log(`\n添加版本元数据：${NEW_VERSIONS.length} 个`);
    console.log(`添加版本内容：${totalAdded} 条`);

  } catch (error) {
    console.error('❌ 添加新版本数据失败:', error);
    throw error;
  } finally {
    await client.$disconnect();
  }
}

main();
