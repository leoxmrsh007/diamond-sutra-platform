/**
 * Simplified Seed Script - Uses only ASCII characters
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Chapters data
const chapters = [
  { num: 1, title: 'Fa Hui You Fen Di Yi', summary: 'Describes the origin of the Dharma assembly.' },
  { num: 2, title: 'Shan Xian Qi Qing Fen Di Er', summary: 'Subhuti asks about bodhicitta.' },
  { num: 3, title: 'Da Cheng Zheng Zong Fen Di San', summary: 'Buddha explains giving without attachment.' },
  { num: 4, title: 'Miao Xing Wu Zhu Fen Di Si', summary: 'Giving without dwelling on forms.' },
  { num: 5, title: 'Ru Li Shi Jian Fen Di Wu', summary: 'Cannot see Tathagata by physical form.' },
  { num: 6, title: 'Zheng Xin Xi You Fen Di Liu', summary: 'Virtue of upholding this sutra.' },
  { num: 7, title: 'Wu De Wu Shuo Fen Di Qi', summary: 'Dharma cannot be grasped or spoken.' },
  { num: 8, title: 'Yi Fa Chu Sheng Fen Di Ba', summary: 'All Buddhas arise from this sutra.' },
  { num: 9, title: 'Yi Xiang Wu Xiang Fen Di Jiu', summary: 'Four fruits have no fixed form.' },
  { num: 10, title: 'Zhuang Yan Jing Tu Fen Di Shi', summary: 'Adorning the Buddha-land is not adorning.' },
  { num: 11, title: 'Wei Wei Fu Sheng Fen Di Shi Yi', summary: 'Virtue of upholding surpasses material giving.' },
  { num: 12, title: 'Zun Zhong Zheng Jiao Fen Di Shi Er', summary: 'Even four verses should be revered.' },
  { num: 13, title: 'Ru Fa Shou Chi Fen Di Shi San', summary: 'How to uphold and name this sutra.' },
  { num: 14, title: 'Li Xiang Ji Mie Fen Di Shi Si', summary: 'Patience paramita and all marks are empty.' },
  { num: 15, title: 'Chi Jing Gong De Fen Di Shi Wu', summary: 'Inconceivable virtue of upholding this sutra.' },
  { num: 16, title: 'Neng Jing Ye Zhang Fen Di Shi Liu', summary: 'Can cleanse karma by upholding this sutra.' },
  { num: 17, title: 'Jiu Jing Wu Wo Fen Di Shi Qi', summary: 'All dharmas are without self.' },
  { num: 18, title: 'Yi Ti Tong Guan Fen Di Shi Ba', summary: 'Five eyes and sands of Ganges River.' },
  { num: 19, title: 'Fa Jie Tong Hua Fen Di Shi Jiu', summary: 'Virtue is not virtue, is called virtue.' },
  { num: 20, title: 'Li Se Li Xiang Fen Di Er Shi', summary: 'Cannot see Tathagata with complete marks.' },
  { num: 21, title: 'Fe Shuo Suo Shuo Fen Di Er Shi Yi', summary: 'Tathagata speaks no dharma, is called speaking.' },
  { num: 22, title: 'Wu Fa Ke De Fen Di Er Shi Er', summary: 'No dharma can be attained, is called anuttara-samyak-sambodhi.' },
  { num: 23, title: 'Jing Xin Xing Shan Fen Di Er Shi San', summary: 'Dharma is equal, is called anuttara-samyak-sambodhi.' },
  { num: 24, title: 'Fu Zhi Wu Bi Fen Di Er Shi Si', summary: 'Four verses surpass giving seven jewels.' },
  { num: 25, title: 'Hua Wu Suo Hua Fen Di Er Shi Wu', summary: 'No being can be liberated by Tathagata.' },
  { num: 26, title: 'Fa Shen Fei Xiang Fen Di Er Shi Liu', summary: 'Should not view Tathagata by thirty-two marks.' },
  { num: 27, title: 'Wu Duan Wu Mie Fen Di Er Shi Qi', summary: 'Dharma is neither cut off nor extinguished.' },
  { num: 28, title: 'Bu Shou Bu Tan Fen Di Er Shi Ba', summary: 'Bodhisattvas do not receive merit.' },
  { num: 29, title: 'Wei Yi Ji Jing Fen Di Er Shi Jiu', summary: 'Tathagata comes from nowhere, goes to nowhere.' },
  { num: 30, title: 'Yi He Xiang Li Fen Di San Shi', summary: 'One aggregate is not one aggregate, is called one aggregate.' },
  { num: 31, title: 'Zhi Jian Bu Sheng Fen Di San Shi Yi', summary: 'Do not speak of cutting off when generating bodhicitta.' },
  { num: 32, title: 'Ying Hua Fe Zhen Fen Di Er Shi Er', summary: 'All conditioned phenomena are like dreams, illusions.' },
];

// Verses data
const verses = [
  {
    chapter: 1,
    num: 1,
    chinese: 'Thus I have heard. At one time of Buddha was in the Jeta Grove...',
    sanskrit: 'Evam maya srutam',
    english: 'Thus have I heard. At one time the Buddha resided in the Jeta Grove at Sravasti.',
    keywords: ['Evam maya', 'Jeta Grove'],
  },
  {
    chapter: 1,
    num: 2,
    chinese: 'At that time of World-Honored One had put on his robes...',
    sanskrit: 'atha bhagavan',
    english: 'At that time the World-Honored One donned his robe, carried his bowl, went to Sravasti for alms, returned, ate, and sat properly.',
    keywords: ['put on robes', 'alms round'],
  },
  {
    chapter: 2,
    num: 1,
    chinese: 'Then the venerable Subhuti rose from his seat...',
    sanskrit: 'atha ayusman subutir',
    english: 'Then the venerable Subhuti rose, bared his right shoulder, knelt, joined his palms, and asked the Buddha about caring for bodhisattvas.',
    keywords: ['Subhuti', 'rose from seat'],
  },
  {
    chapter: 2,
    num: 2,
    chinese: 'World-Honoured One! How should one who has set forth in...',
    sanskrit: 'astu bhagavan',
    english: 'World-Honored One, how should those who aspire to unsurpassed enlightenment abide and subdue their minds?',
    keywords: ['set forth', 'bodhicitta'],
  },
  {
    chapter: 2,
    num: 3,
    chinese: 'The Buddha said: Excellent! Excellent!...',
    sanskrit: 'bhagavan aha',
    english: 'The Buddha replied: Excellent, excellent! Listen well, for I will explain how bodhisattvas should abide and tame their minds.',
    keywords: ['Excellent', 'listen carefully'],
  },
  {
    chapter: 3,
    num: 1,
    chinese: 'Buddha said to Subhuti: All bodhisattva-mahasattvas...',
    sanskrit: 'sri bhagavan uvaca',
    english: 'The Buddha said: Bodhisattvas should liberate immeasurable beings while understanding that no being is truly liberated.',
    keywords: ['bodhisattva', 'liberate beings'],
  },
  {
    chapter: 32,
    num: 1,
    chinese: 'All conditioned phenomena are like a dream, illusion...',
    sanskrit: 'sarve dharma',
    english: 'All conditioned dharmas are like dreams and illusions—like bubbles, shadows, dew, or lightning—thus should one contemplate them.',
    keywords: ['dream', 'illusion', 'bubble', 'shadow'],
  },
]
;

async function main() {
  console.log('=== Starting database seeding ===');

  // Create sutra record
  const sutra = await prisma.sutra.upsert({
    where: { slug: 'diamond-sutra' },
    update: {},
    create: {
      title: 'Diamond Sutra (Vajracchedika Prajnaparamita)',
      titleSanskrit: 'Vajracchedika Prajnaparamita Sutra',
      titleTibetan: 'Vajracchedika Prajnaparamita Sutra',
      slug: 'diamond-sutra',
      description: 'The Diamond Sutra is one of the most influential Mahayana sutras.',
      order: 1,
    },
  });

  console.log(`Created sutra: ${sutra.title}`);

  // Create chapters
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

  console.log(`Created ${chapters.length} chapters`);

  // Get all chapters
  const allChapters = await prisma.chapter.findMany({
    where: { sutraId: sutra.id },
    orderBy: { chapterNum: 'asc' },
  });

  const chapterMap = new Map(allChapters.map((c) => [c.chapterNum, c.id]));

  // Create verses
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

  console.log(`Created ${verses.length} verses`);

  // Create course
  await prisma.course.upsert({
    where: { id: 'course-1' },
    update: {},
    create: {
      id: 'course-1',
      title: 'Introduction to Diamond Sutra',
      description: 'Learn about the origin and core teachings.',
      level: 'BEGINNER',
      duration: 120,
      isPublished: true,
      order: 1,
    },
  });

  console.log(`Created course`);

  // Create concepts
  const concepts = [
    { name: 'Prajna', nameSanskrit: 'Prajna', description: 'Wisdom, ultimate understanding of reality.' },
    { name: 'Paramita', nameSanskrit: 'Paramita', description: 'Perfection, fulfilled practice methods.' },
    { name: 'Sunyata', nameSanskrit: 'Sunyata', description: 'Emptiness, lack of inherent existence.' },
    { name: 'Bodhicitta', nameSanskrit: 'Bodhicitta', description: 'Awakening mind for benefit of all beings.' },
    { name: 'Nirvana', nameSanskrit: 'Nirvana', description: 'Cessation of suffering, liberation from samsara.' },
    { name: 'Dana', nameSanskrit: 'Dana', description: 'Giving without expectation of return.' },
  ];

  for (const concept of concepts) {
    await prisma.concept.upsert({
      where: { name: concept.name },
      update: {},
      create: concept,
    });
  }

  console.log(`Created ${concepts.length} concepts`);

  console.log('\n=== Database seeding completed successfully! ===');
}

main()
  .catch((e) => {
    console.error('Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
