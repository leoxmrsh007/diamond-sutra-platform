/**
 * 金刚经数据种子脚本 - 简化版用于快速测试
 * 用于初始化《金刚经》经文数据
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// 金刚经章节数据
const chapters = [
  { num: 1, title: '法会因由分第一', summary: '描述法会的缘起，佛陀在舍卫国祇树给孤独园说法。' },
  { num: 2, title: '善现启请分第二', summary: '须菩提请法，问如何发菩提心、如何降伏其心。' },
  { num: 3, title: '大乘正宗分第三', summary: '佛陀阐述菩萨于法应无所住而行布施。' },
  { num: 4, title: '妙行无住分第四', summary: '说明无论身在何处，应无所住而行布施。' },
  { num: 5, title: '如理实见分第五', summary: '阐述不可以身相得见如来。' },
];

// 金刚经偈颂数据（精选）
const verses = [
  {
    chapter: 1,
    num: 1,
    chinese: '如是我闻：一时，佛在舍卫国祇树给孤独园，与大比丘众千二百五十人俱。',
    sanskrit: 'Evam maya srutam',
    english:
      'Thus have I heard. At one time the Buddha dwelt in Śrāvastī, in the Jeta Grove of Anāthapiṇḍada, together with a great assembly of twelve hundred and fifty bhikṣus.',
    keywords: ['如是我闻', '舍卫国', '祇树给孤独园'],
  },
  {
    chapter: 1,
    num: 2,
    chinese: '尔时，世尊食时，着衣持钵，入舍卫大城乞食。于其城中，次第乞已，还至本处。饭食讫，收衣钵，洗足已，敷座而坐。',
    sanskrit: 'atha bhagavan',
    english:
      'At that time, when it was mealtime, the World-Honored One donned his robe, took up his bowl, entered Śrāvastī to beg in order, returned to his abode, finished his meal, put away robe and bowl, washed his feet, and sat properly.',
    keywords: ['乞食', '次第乞', '敷座而坐'],
  },
  {
    chapter: 2,
    num: 1,
    chinese: '时，长老须菩提在大众中即从座起，偏袒右肩，右膝着地，合掌恭敬而白佛言："希有！世尊！如来善护念诸菩萨，善付嘱诸菩萨。"',
    sanskrit: 'atha ayusman subutir',
    english:
      'Then Elder Subhūti arose from the assembly, bared his right shoulder, knelt on his right knee, joined his palms with respect, and said: “Rare indeed, World-Honored One! The Tathāgata well protects and entrusts the bodhisattvas.”',
    keywords: ['须菩提', '善护念', '善付嘱'],
  },
  {
    chapter: 2,
    num: 2,
    chinese: '世尊！善男子、善女人，发阿耨多罗三藐三菩提心，应云何住？云何降伏其心？',
    sanskrit: 'astu bhagavan',
    english:
      'World-Honored One, how should good men and good women who give rise to the unsurpassed bodhi mind dwell, and how should they subdue their minds?',
    keywords: ['阿耨多罗三藐三菩提', '云何住', '降伏其心'],
  },
  {
    chapter: 2,
    num: 3,
    chinese: '佛言："善哉！善哉！善男子！如汝所说，如来善护念诸菩萨，善付嘱诸菩萨。汝今谛听，当为汝说。善男子、善女人，发阿耨多罗三藐三菩提心，应如是住，如是降伏其心。',
    sanskrit: 'bhagavan aha',
    english:
      'The Buddha said: “Excellent, excellent! Just as you have spoken, the Tathāgata compassionately protects and entrusts the bodhisattvas. Now listen attentively; I shall tell you. Good men and good women who raise the unsurpassed bodhi mind should dwell thus and subdue their minds thus.”',
    keywords: ['谛听', '如是住', '如是降伏其心'],
  },
  {
    chapter: 3,
    num: 1,
    chinese: '佛告须菩提："诸菩萨摩诃萨，应如是降伏其心：所有一切众生之类，若卵生、若胎生、若湿生、若化生，若有色、若无色，若有想、若无想、若非有想非无想，我皆令入无余涅槃而灭度之。',
    sanskrit: 'sri bhagavan uvaca',
    english:
      'The Buddha told Subhūti: “All great bodhisattvas should subdue their minds in this way: of all beings born from eggs, wombs, moisture, or transformation—with form or without form, with perception, without perception, or neither with nor without perception—I will lead them all to final nirvāṇa without remainder.”',
    keywords: ['众生', '卵生胎生', '无余涅槃'],
  },
];

async function main() {
  console.log('开始初始化金刚经数据...');

  // 创建经文记录
  const sutra = await prisma.sutra.upsert({
    where: { slug: 'diamond-sutra' },
    update: {},
    create: {
      title: '金刚般若波罗蜜经',
      titleSanskrit: 'Vajracchedikā Prajñāpāramitā Sūtra',
      titleTibetan: 'Vajracchedikā Prajñāpāramitā Sūtra',
      slug: 'diamond-sutra',
      description: '《金刚般若波罗蜜经》，简称《金刚经》，是大乘佛教般若部的重要经典，流传最广、影响最深。经文围绕"般若"（智慧）展开，阐述"缘起性空"的中观思想。',
      order: 1,
    },
  });

  console.log(`创建经文: ${sutra.title}`);

  // 创建章节
  for (const chapter of chapters) {
    await prisma.chapter.upsert({
      where: {
        sutraId_chapterNum: {
          sutraId: sutra.id,
          chapterNum: chapter.num,
        },
      },
      update: {},
      create: {
        sutraId: sutra.id,
        chapterNum: chapter.num,
        title: chapter.title,
        summary: chapter.summary,
        order: chapter.num,
      },
    });
  }

  console.log(`创建 ${chapters.length} 个章节`);

  // 获取所有章节映射
  const allChapters = await prisma.chapter.findMany({
    where: { sutraId: sutra.id },
    orderBy: { chapterNum: 'asc' },
  });

  const chapterMap = new Map(allChapters.map((c) => [c.chapterNum, c.id]));

  // 创建偈颂
  for (const verse of verses) {
    const chapterId = chapterMap.get(verse.chapter);
    if (!chapterId) continue;

    await prisma.verse.upsert({
      where: {
        chapterId_verseNum: {
          chapterId,
          verseNum: verse.num,
        },
      },
      update: {},
      create: {
        chapterId,
        verseNum: verse.num,
        chinese: verse.chinese,
        sanskrit: verse.sanskrit,
        english: verse.english,
        aiKeyword: verse.keywords,
        order: verse.num,
      },
    });
  }

  console.log(`创建 ${verses.length} 个偈颂`);

  // 创建示例课程
  await prisma.course.upsert({
    where: { id: 'course-1' },
    update: {},
    create: {
      id: 'course-1',
      title: '《金刚经》入门导读',
      description: '了解《金刚经》的缘起、核心思想和基本概念，适合初学者建立正确的知见。',
      level: 'BEGINNER',
      duration: 120,
      isPublished: true,
      order: 1,
    },
  });

  console.log(`创建示例课程`);

  // 创建佛学概念
  const concepts = [
    { name: '般若', nameSanskrit: 'Prajñā', description: '智慧，超越世俗智慧的终极智慧，能如实认知一切事物和真理。' },
    { name: '波罗蜜', nameSanskrit: 'Pāramitā', description: '到彼岸，圆满的修行方法，共分六度。' },
    { name: '空性', nameSanskrit: 'Śūnyatā', description: '诸法无自性，缘起性空，是中观思想的核心。' },
  ];

  for (const concept of concepts) {
    await prisma.concept.upsert({
      where: { name: concept.name },
      update: {},
      create: concept,
    });
  }

  console.log(`创建 ${concepts.length} 个佛学概念`);

  console.log('\n数据初始化完成！');
}

main()
  .catch((e) => {
    console.error('数据初始化失败:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
