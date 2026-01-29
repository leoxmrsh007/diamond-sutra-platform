const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function verifySections() {
  try {
    const sutra = await prisma.sutra.findUnique({
      where: { slug: 'platform-sutra' },
      include: {
        chapters: {
          orderBy: { chapterNum: 'asc' },
          _count: {
            select: { sections: true },
          },
        },
      },
    });

    if (!sutra) {
      console.log('[ERROR] Platform Sutra not found');
      return;
    }

    console.log('[INFO] Platform Sutra Section Counts:\n');
    sutra.chapters.forEach((ch) => {
      console.log(`Chapter ${ch.chapterNum}: ${ch._count.sections} sections`);
    });

    const total = sutra.chapters.reduce((sum, ch) => sum + ch._count.sections, 0);
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
