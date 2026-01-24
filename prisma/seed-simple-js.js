/**
 * Simple JS Seed Script - Reads from JSON file
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('=== Starting database seeding ===');

  // Load data from JSON
  const data = await import('./seed-data.json', { assert: { type: 'json' } });

  // Create sutra
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

  console.log('Created sutra: ' + sutra.title);

  // Create chapters
  let chapterCount = 0;
  for (const chapter of data.chapters) {
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
    chapterCount++;
  }

  console.log('Created ' + chapterCount + ' chapters');

  // Get all chapters
  const allChapters = await prisma.chapter.findMany({
    where: { sutraId: sutra.id },
    orderBy: { chapterNum: 'asc' },
  });

  const chapterMap = new Map(allChapters.map((c) => [c.chapterNum, c.id]));

  // Create verses
  let verseCount = 0;
  for (const verse of data.verses) {
    const chapterId = chapterMap.get(verse.chapter);
    if (!chapterId) continue;

    await prisma.verse.upsert({
      where: {
        chapterId_verseNum: {
          chapterId,
          verseNum: verse.num,
        },
      },
      update: {
        chinese: verse.chinese,
        sanskrit: verse.sanskrit,
        english: verse.english,
      },
      create: {
        chapterId,
        verseNum: verse.num,
        chinese: verse.chinese,
        sanskrit: verse.sanskrit,
        tibetan: null,
        english: verse.english,
        aiKeyword: verse.keywords,
        order: verse.num,
      },
    });
    verseCount++;
  }

  console.log('Created ' + verseCount + ' verses');

  // Create course
  await prisma.course.upsert({
    where: { id: 'course-1' },
    update: {},
    create: {
      id: 'course-1',
      title: 'Introduction to Diamond Sutra',
      description: 'Learn about the origin, core teachings and concepts.',
      level: 'BEGINNER',
      duration: 120,
      isPublished: true,
      order: 1,
    },
  });

  console.log('Created course');

  // Create concepts
  for (const concept of data.concepts) {
    await prisma.concept.upsert({
      where: { name: concept.name },
      update: {},
      create: concept,
    });
  }

  console.log('Created ' + data.concepts.length + ' concepts');

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
