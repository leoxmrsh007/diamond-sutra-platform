const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function verifySections() {
  try {
    const sutra = await prisma.sutra.findUnique({
      where: { slug: 'platform-sutra' },
      include: {
        chapters: {
          orderBy: { chapterNum: 'asc' },
        },
      },
    });

    if (!sutra) {
      console.log('[ERROR] Platform Sutra not found');
      return;
    }

    console.log('[INFO] Platform Sutra Section Counts:');
    let total = 0;
    
    for (const ch of sutra.chapters) {
      const sections = await prisma.section.findMany({
        where: { chapterId: ch.id },
      });
      console.log(`Chapter ${ch.chapterNum}: ${sections.length} sections`);
      total += sections.length;
    }

    console.log(`\n[SUCCESS] Total sections: ${total}`);
    console.log(`[SUCCESS] Average per chapter: ${(total / 10).toFixed(1)}`);

    await prisma.$disconnect();
  } catch (error) {
    console.error('[ERROR]', error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

verifySections();
