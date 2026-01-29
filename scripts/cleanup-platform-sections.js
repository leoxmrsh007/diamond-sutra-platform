const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function fixPlatformSutra() {
  try {
    console.log('[INFO] Starting Platform Sutra fix...\n');

    // 1. Find the platform sutra
    const sutra = await prisma.sutra.findUnique({
      where: { slug: 'platform-sutra' },
      include: {
        chapters: {
          select: {
            id: true,
            chapterNum: true,
            title: true,
            _count: {
              select: { sections: true },
            },
          },
        },
      },
    });

    if (!sutra) {
      console.log('[ERROR] Platform Sutra not found');
      return;
    }

    console.log(`[INFO] Found ${sutra.chapters.length} chapters\n`);
    console.log('[INFO] Current section counts:');
    sutra.chapters.forEach((ch) => {
      console.log(`  Chapter ${ch.chapterNum}: ${ch._count.sections} sections`);
    });

    const totalCurrent = sutra.chapters.reduce((sum, ch) => sum + ch._count.sections, 0);
    console.log(`\n[INFO] Total current sections: ${totalCurrent}`);

    // 2. Delete all sections
    console.log('\n[INFO] Deleting all sections...');
    await prisma.section.deleteMany({
      where: {
        chapter: {
          sutraId: sutra.id,
        },
      },
    });

    console.log('[INFO] All sections deleted\n');

    // 3. Now the user needs to run: npx tsx prisma/seed-platform-sutra.ts
    console.log('[NEXT STEP] Run the following command to re-import:');
    console.log('  npx tsx prisma/seed-platform-sutra.ts');
    console.log('\nOr run the full seed:');
    console.log('  npx prisma db seed');

    await prisma.$disconnect();

  } catch (error) {
    console.error('[ERROR] Fix failed:', error);
    process.exit(1);
  }
}

fixPlatformSutra();
