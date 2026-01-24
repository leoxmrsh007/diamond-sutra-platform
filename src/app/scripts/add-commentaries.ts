/**
 * 添加注释数据
 * 历代高僧大德对《金刚经》的注释
 */

import { prisma } from '@/lib/prisma';

const COMMENTARY_DATA = [
  {
    chapterNum: 1,
    verseNum: 1,
    commentaries: [
      {
        author: '六祖慧能',
        source: '《金刚经口诀》',
        language: 'zh',
        content: '如是我闻者，佛说经时，众生在座，闻佛所说，如佛所说而信解，是为如是我闻。一时者，机感相投，师资道合，故曰一时。佛在舍卫国者，佛示现神力，在舍卫国也。祇树给孤独园者，给长者名，孤独者，施园名也。',
        order: 1,
      },
      {
        author: '智者大师',
        source: '《金刚经疏》',
        language: 'zh',
        content: '如是我闻者，信顺也。如是，指法之词；我闻，师资之目。一时，师资会遇之期。舍卫国者，中印度国名也。祇树给孤独园者，祇陀太子之树，给孤独长者之园，二施共立，故以名焉。',
        order: 2,
      },
      {
        author: '窥基大师',
        source: '《金刚般若经赞述》',
        language: 'zh',
        content: '如是我闻，阿难结集，如是之法，我从佛闻。一时，无定之教，感应之时。舍卫国，中印度境。祇树，祇陀太子之树。给孤独园，给孤独长者之园。祇陀施树，给孤独施园，二处合名。',
        order: 3,
      },
    ],
  },
  {
    chapterNum: 2,
    verseNum: 1,
    commentaries: [
      {
        author: '六祖慧能',
        source: '《金刚经口诀》',
        language: 'zh',
        content: '须菩提，解空第一，故从座起，偏袒右肩，右膝着地，合掌恭敬，而白佛言。希有世尊者，赞佛也。如来善护念诸菩萨者，佛以般若护念菩萨心。善付嘱诸菩萨者，佛以般若付嘱菩萨也。',
        order: 1,
      },
      {
        author: '宗喀巴大师',
        source: '《金刚经广释》',
        language: 'zh',
        content: '须菩提尊者，为众生请问发菩提心之方便。希有世尊者，赞佛之功德不可思议。如来善护念者，谓如来以般若慧力护念菩萨令离魔障。善付嘱者，谓如来以般若慧力付嘱菩萨令度众生。',
        order: 2,
      },
    ],
  },
  {
    chapterNum: 3,
    verseNum: 1,
    commentaries: [
      {
        author: '六祖慧能',
        source: '《金刚经口诀》',
        language: 'zh',
        content: '菩萨应降伏其心，不住于相。所有一切众生之类，我皆令入无余涅槃而灭度之。实无众生得灭度者，何以故？菩萨若见有众生得度，即非菩萨。为菩萨者，不住于相，度尽众生，而无一众生可度，方是真菩萨。',
        order: 1,
      },
      {
        author: '智者大师',
        source: '《金刚经疏》',
        language: 'zh',
        content: '降伏其心者，令不起妄念。不住色布施，不住声、香、味、触、法布施。度尽众生，不见有众生得度。何以故？众生本空，涅槃本寂，度与不度，其性一故。',
        order: 2,
      },
    ],
  },
  {
    chapterNum: 4,
    verseNum: 1,
    commentaries: [
      {
        author: '六祖慧能',
        source: '《金刚经口诀》',
        language: 'zh',
        content: '不住于相布施，其福德不可思量。若住于相布施，则有所得，有所得则有限。不住于相布施，则无所得，无所得则无边。无边之福，不可思量，犹如虚空，无量无边。',
        order: 1,
      },
      {
        author: '窥基大师',
        source: '《金刚般若经赞述》',
        language: 'zh',
        content: '不住色布施，不住声、香、味、触、法布施，是名不住于相布施。不住于相布施者，不住六尘，三轮体空。施者、受者、施物，皆不可得。如此布施，其福德聚不可思量。',
        order: 2,
      },
    ],
  },
  {
    chapterNum: 5,
    verseNum: 1,
    commentaries: [
      {
        author: '六祖慧能',
        source: '《金刚经口诀》',
        language: 'zh',
        content: '凡所有相，皆是虚妄。若见诸相非相，则见如来。相者，有为之法也。虚妄者，生灭无常也。见诸相非相者，见一切有为法，皆是生灭无常，其性本空，不生不灭，是名非相。见非相者，即见法身如来也。',
        order: 1,
      },
      {
        author: '智者大师',
        source: '《金刚经疏》',
        language: 'zh',
        content: '凡所有相，皆是虚妄者，一切有为法，皆如梦幻泡影。若见诸相非相，则见如来者，若能见一切法，皆不可得，即是见如来。如来者，法身也，非色相见，非声香触法相见，离一切相，即见法身如来。',
        order: 2,
      },
    ],
  },
  {
    chapterNum: 6,
    verseNum: 1,
    commentaries: [
      {
        author: '六祖慧能',
        source: '《金刚经口诀》',
        language: 'zh',
        content: '颇众生闻说是法生信心不？未来世，后五百岁，正法像法之时，众生根机渐劣，于此般若波罗蜜经，能闻能信者，甚为难得。佛言：彼非众生，非不众生，众生者，假名也，实性本空，故云非众生。假名有众生，故云非不众生。',
        order: 1,
      },
      {
        author: '宗喀巴大师',
        source: '《金刚经广释》',
        language: 'zh',
        content: '未来世，后五百岁，正法像法时中，于此般若波罗蜜多，听闻受持，生实信者，当知是人，已于无量千万佛所，种诸善根，故能信此甚深法门。彼非众生者，谓此人已证菩提，非凡夫众生也。非不众生者，示现菩萨度生，非不入众生界也。',
        order: 2,
      },
    ],
  },
];

export async function addCommentaryData() {
  try {
    let addedCount = 0;
    let updatedCount = 0;

    for (const data of COMMENTARY_DATA) {
      // 查找对应的偈颂
      const chapter = await prisma.chapter.findFirst({
        where: { chapterNum: data.chapterNum },
      });

      if (!chapter) {
        console.log(`Chapter ${data.chapterNum} not found`);
        continue;
      }

      const verse = await prisma.verse.findFirst({
        where: {
          chapterId: chapter.id,
          verseNum: data.verseNum,
        },
      });

      if (!verse) {
        console.log(`Verse ${data.chapterNum}:${data.verseNum} not found`);
        continue;
      }

      // 为每条注释创建或更新记录
      for (const commentary of data.commentaries) {
        const existing = await prisma.commentary.findFirst({
          where: {
            verseId: verse.id,
            author: commentary.author,
          },
        });

        if (existing) {
          await prisma.commentary.update({
            where: { id: existing.id },
            data: {
              content: commentary.content,
              source: commentary.source,
              language: commentary.language,
              order: commentary.order,
            },
          });
          updatedCount++;
        } else {
          await prisma.commentary.create({
            data: {
              verseId: verse.id,
              author: commentary.author,
              source: commentary.source,
              language: commentary.language,
              content: commentary.content,
              order: commentary.order,
            },
          });
          addedCount++;
        }
      }
    }

    return {
      success: true,
      addedCount,
      updatedCount,
    };
  } catch (error) {
    console.error('添加注释数据失败:', error);
    throw error;
  }
}
