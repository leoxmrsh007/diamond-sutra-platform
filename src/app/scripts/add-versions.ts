/**
 * 添加版本对照数据
 * 鸠摩罗什、玄奘、义净译本的对照
 */

import { prisma } from '@/lib/prisma';

const VERSION_DATA = [
  // 第一章对照
  {
    chapterNum: 1,
    verseNum: 1,
    versions: [
      {
        versionType: 'kumarajiva',
        versionName: '鸠摩罗什译本',
        language: 'zh',
        content: '如是我闻：一时，佛在舍卫国祇树给孤独园，与大比丘众千二百五十人俱。',
        translator: '鸠摩罗什',
        year: '402',
      },
      {
        versionType: 'xuanzang',
        versionName: '玄奘译本',
        language: 'zh',
        content: '如是我闻：一时，薄伽梵在室罗筏住誓多林给孤独园，与苾刍众千二百五十人俱。',
        translator: '玄奘',
        year: '660',
      },
      {
        versionType: 'yijing',
        versionName: '义净译本',
        language: 'zh',
        content: '如是我闻：一时，薄伽梵在室罗筏城誓多林给孤独园，与苾刍众千二百五十人俱。',
        translator: '义净',
        year: '703',
      },
    ],
  },
  {
    chapterNum: 1,
    verseNum: 2,
    versions: [
      {
        versionType: 'kumarajiva',
        versionName: '鸠摩罗什译本',
        language: 'zh',
        content: '尔时，世尊食时，着衣持钵，入舍卫大城乞食。于其城中次第乞已，还至本处。',
        translator: '鸠摩罗什',
        year: '402',
      },
      {
        versionType: 'xuanzang',
        versionName: '玄奘译本',
        language: 'zh',
        content: '尔时，世尊日初分时，着衣持钵，入室罗筏大城乞食。于其城中次第乞已，还至本处。',
        translator: '玄奘',
        year: '660',
      },
      {
        versionType: 'yijing',
        versionName: '义净译本',
        language: 'zh',
        content: '尔时，世尊日初分时，着衣持钵，入室罗筏大城乞食。于其城中次第乞已，还至本处。',
        translator: '义净',
        year: '703',
      },
    ],
  },
  {
    chapterNum: 1,
    verseNum: 3,
    versions: [
      {
        versionType: 'kumarajiva',
        versionName: '鸠摩罗什译本',
        language: 'zh',
        content: '饭食讫，收衣钵，洗足已，敷座而坐。',
        translator: '鸠摩罗什',
        year: '402',
      },
      {
        versionType: 'xuanzang',
        versionName: '玄奘译本',
        language: 'zh',
        content: '饭食讫，收衣钵，洗足已，于所常坐如法床座，加趺端坐，正念而住。',
        translator: '玄奘',
        year: '660',
      },
      {
        versionType: 'yijing',
        versionName: '义净译本',
        language: 'zh',
        content: '饭食讫，收衣钵，洗足已，于所常坐如法床座，加趺端坐，正念而住。',
        translator: '义净',
        year: '703',
      },
    ],
  },
  // 第二章对照
  {
    chapterNum: 2,
    verseNum: 1,
    versions: [
      {
        versionType: 'kumarajiva',
        versionName: '鸠摩罗什译本',
        language: 'zh',
        content: '时，长老须菩提在大众中即从座起，偏袒右肩，右膝着地，合掌恭敬而白佛言："希有！世尊！如来善护念诸菩萨，善付嘱诸菩萨。"',
        translator: '鸠摩罗什',
        year: '402',
      },
      {
        versionType: 'xuanzang',
        versionName: '玄奘译本',
        language: 'zh',
        content: '时，众中有一苾刍，名曰善现，即从座起，偏袒右肩，右膝着地，合掌恭敬，而白佛言："希有！世尊！乃至如来、应、正等觉，能以最胜摄受，以最胜嘱累，诸菩萨众。"',
        translator: '玄奘',
        year: '660',
      },
      {
        versionType: 'yijing',
        versionName: '义净译本',
        language: 'zh',
        content: '时，众中有一苾刍，名曰善现，即从座起，偏袒右肩，右膝着地，合掌恭敬，而白佛言："希有！世尊！乃至如来、应、正等觉，能以最胜摄受，以最胜嘱累，诸菩萨众。"',
        translator: '义净',
        year: '703',
      },
    ],
  },
  {
    chapterNum: 2,
    verseNum: 2,
    versions: [
      {
        versionType: 'kumarajiva',
        versionName: '鸠摩罗什译本',
        language: 'zh',
        content: '"世尊！善男子、善女人，发阿耨多罗三藐三菩提心，应云何住，云何降伏其心？"',
        translator: '鸠摩罗什',
        year: '402',
      },
      {
        versionType: 'xuanzang',
        versionName: '玄奘译本',
        language: 'zh',
        content: '"世尊！诸有发趣菩萨乘者，应云何住？云何修行？云何摄伏其心？"',
        translator: '玄奘',
        year: '660',
      },
      {
        versionType: 'yijing',
        versionName: '义净译本',
        language: 'zh',
        content: '"世尊！诸有发趣菩萨乘者，应云何住？云何修行？云何摄伏其心？"',
        translator: '义净',
        year: '703',
      },
    ],
  },
  {
    chapterNum: 2,
    verseNum: 3,
    versions: [
      {
        versionType: 'kumarajiva',
        versionName: '鸠摩罗什译本',
        language: 'zh',
        content: '佛言："善哉，善哉！善男子，如汝所说，如来善护念诸菩萨，善付嘱诸菩萨。汝今谛听，当为汝说。善男子、善女人，发阿耨多罗三藐三菩提心，应如是住，如是降伏其心。"',
        translator: '鸠摩罗什',
        year: '402',
      },
      {
        versionType: 'xuanzang',
        versionName: '玄奘译本',
        language: 'zh',
        content: '佛告善现："善哉！善哉！善现！如汝所说。乃至如来、应、正等觉，能以最胜摄受，以最胜嘱累，诸菩萨众。汝今谛听，当为汝说。诸有发趣菩萨乘者，应如是住，如是修行，如是摄伏其心。"',
        translator: '玄奘',
        year: '660',
      },
      {
        versionType: 'yijing',
        versionName: '义净译本',
        language: 'zh',
        content: '佛告善现："善哉！善哉！善现！如汝所说。乃至如来、应、正等觉，能以最胜摄受，以最胜嘱累，诸菩萨众。汝今谛听，当为汝说。诸有发趣菩萨乘者，应如是住，如是修行，如是摄伏其心。"',
        translator: '义净',
        year: '703',
      },
    ],
  },
  {
    chapterNum: 2,
    verseNum: 4,
    versions: [
      {
        versionType: 'kumarajiva',
        versionName: '鸠摩罗什译本',
        language: 'zh',
        content: '"唯然，世尊！愿乐欲闻。"',
        translator: '鸠摩罗什',
        year: '402',
      },
      {
        versionType: 'xuanzang',
        versionName: '玄奘译本',
        language: 'zh',
        content: '善现白佛言："如是，世尊！愿乐欲闻。"',
        translator: '玄奘',
        year: '660',
      },
      {
        versionType: 'yijing',
        versionName: '义净译本',
        language: 'zh',
        content: '善现白佛言："如是，世尊！愿乐欲闻。"',
        translator: '义净',
        year: '703',
      },
    ],
  },
  // 第三章对照
  {
    chapterNum: 3,
    verseNum: 1,
    versions: [
      {
        versionType: 'kumarajiva',
        versionName: '鸠摩罗什译本',
        language: 'zh',
        content: '佛告须菩提："诸菩萨摩诃萨，应如是降伏其心：所有一切众生之类，若卵生、若胎生、若湿生、若化生，若有色、若无色，若有想、若无想、若非有想非无想，我皆令入无余涅槃而灭度之。如是灭度无量无数无边众生，实无众生得灭度者。何以故？须菩提！若菩萨有我相、人相、众生相、寿者相，即非菩萨。"',
        translator: '鸠摩罗什',
        year: '402',
      },
      {
        versionType: 'xuanzang',
        versionName: '玄奘译本',
        language: 'zh',
        content: '佛告善现："诸有发趣菩萨乘者，应当发起如是之心：所有诸有情，有情摄所摄，若卵生、若胎生、若湿生、若化生，若有色、若无色，若有想、若无想、若非有想非无想，乃至若有情界，施设所摄，我皆令入无余涅槃界而灭度之。虽令如是无量有情，皆入无余涅槃界而灭度之，而无有一有情被涅槃界所度者。何以故？善现！若菩萨有有情想，即非菩萨。所以者何？善现！若菩萨起我想、有情想、命者想、士夫想、补特伽罗想、意生想、摩纳婆想、作者想、受者想异于生想，即非菩萨。"',
        translator: '玄奘',
        year: '660',
      },
      {
        versionType: 'yijing',
        versionName: '义净译本',
        language: 'zh',
        content: '佛告善现："诸有发趣菩萨乘者，应当发起如是之心：所有诸有情，有情摄所摄，若卵生、若胎生、若湿生、若化生，若有色、若无色，若有想、若无想、若非有想非无想，乃至若有情界，施设所摄，我皆令入无余涅槃界而灭度之。虽令如是无量有情，皆入无余涅槃界而灭度之，而无有一有情被涅槃界所度者。何以故？善现！若菩萨有有情想，即非菩萨。所以者何？善现！若菩萨起我想、有情想、命者想、士夫想、补特伽罗想、意生想、摩纳婆想、作者想、受者想异于生想，即非菩萨。"',
        translator: '义净',
        year: '703',
      },
    ],
  },
  // 第四章对照
  {
    chapterNum: 4,
    verseNum: 1,
    versions: [
      {
        versionType: 'kumarajiva',
        versionName: '鸠摩罗什译本',
        language: 'zh',
        content: '"复次，须菩提！菩萨于法，应无所住，行于布施，所谓不住色布施，不住声、香、味、触、法布施。须菩提！菩萨应如是布施，不住于相。何以故？若菩萨不住相布施，其福德不可思量。须菩提！于意云何？东方虚空可思量不？""不也，世尊。""须菩提！南、西、北方，四维上、下虚空，可思量不？""不也，世尊。""须菩提！菩萨无住相布施，福德亦复如是不可思量。须菩提！菩萨但应如所教住。"',
        translator: '鸠摩罗什',
        year: '402',
      },
      {
        versionType: 'xuanzang',
        versionName: '玄奘译本',
        language: 'zh',
        content: '复次，善现！菩萨摩诃萨，不住于法，应行布施，谓都不住色、声、香、味、触、法布施。善现！如是菩萨摩诃萨，不住于相，应行布施。何以故？善现！若菩萨摩诃萨，不住于相布施，其福德聚不可思量。善现！于意云何？东方虚空可量不？"不也，世尊。""南、西、北方，四维、上、下，十方一切虚空，可量不？""不也，世尊。""善现！如是菩萨摩诃萨，不住于相布施，其福德聚亦复如是，不可思量。善现！菩萨但应如所教住。"',
        translator: '玄奘',
        year: '660',
      },
      {
        versionType: 'yijing',
        versionName: '义净译本',
        language: 'zh',
        content: '复次，善现！菩萨摩诃萨，不住于法，应行布施，谓都不住色、声、香、味、触、法布施。善现！如是菩萨摩诃萨，不住于相，应行布施。何以故？善现！若菩萨摩诃萨，不住于相布施，其福德聚不可思量。善现！于意云何？东方虚空可量不？"不也，世尊。""南、西、北方，四维、上、下，十方一切虚空，可量不？""不也，世尊。""善现！如是菩萨摩诃萨，不住于相布施，其福德聚亦复如是，不可思量。善现！菩萨但应如所教住。"',
        translator: '义净',
        year: '703',
      },
    ],
  },
  // 第五章对照
  {
    chapterNum: 5,
    verseNum: 1,
    versions: [
      {
        versionType: 'kumarajiva',
        versionName: '鸠摩罗什译本',
        language: 'zh',
        content: '"须菩提！于意云何？可以身相见如来不？""不也，世尊！不可以身相得见如来。何以故？如来所说身相，即非身相。"佛告须菩提："凡所有相，皆是虚妄。若见诸相非相，则见如来。"',
        translator: '鸠摩罗什',
        year: '402',
      },
      {
        versionType: 'xuanzang',
        versionName: '玄奘译本',
        language: 'zh',
        content: '善现！于意云何？可以相好观如来不？不也，世尊！不应以相好观于如来。何以故？如来说相好，即非相好，是名相好。佛告善现：于意云何？诸相具足，即是如来不？不也，世尊！诸相具足，非即是如来。何以故？如来说诸相具足，即非具足，是名诸相具足。善现！于意云何？可以三十二大士夫相观如来不？不也，世尊！不应以三十二大士夫相观于如来。何以故？如来说三十二大士夫相，即非相，是名三十二大士夫相。"',
        translator: '玄奘',
        year: '660',
      },
      {
        versionType: 'yijing',
        versionName: '义净译本',
        language: 'zh',
        content: '善现！于意云何？可以相好观如来不？不也，世尊！不应以相好观于如来。何以故？如来说相好，即非相好，是名相好。佛告善现：于意云何？诸相具足，即是如来不？不也，世尊！诸相具足，非即是如来。何以故？如来说诸相具足，即非具足，是名诸相具足。善现！于意云何？可以三十二大士夫相观如来不？不也，世尊！不应以三十二大士夫相观于如来。何以故？如来说三十二大士夫相，即非相，是名三十二大士夫相。"',
        translator: '义净',
        year: '703',
      },
    ],
  },
  // 第六章对照
  {
    chapterNum: 6,
    verseNum: 1,
    versions: [
      {
        versionType: 'kumarajiva',
        versionName: '鸠摩罗什译本',
        language: 'zh',
        content: '须菩提白佛言："世尊！颇有众生，于未来世，闻说是法，生信心不？"佛言："须菩提！彼非众生，非不众生。何以故？须菩提！众生、众生者，如来说非众生，是名众生。"',
        translator: '鸠摩罗什',
        year: '402',
      },
      {
        versionType: 'xuanzang',
        versionName: '玄奘译本',
        language: 'zh',
        content: '善现白佛言："世尊！颇有有情，于当来世，后时、后分、后五百岁，正法、像法、末法时中，于此般若波罗蜜多，听闻受持，生实信不？"佛告善现："勿作是说！颇有有情，于当来世，后时、后分、后五百岁，正法、像法、末法时中，于此般若波罗蜜多，听闻受持，生实信不？"',
        translator: '玄奘',
        year: '660',
      },
      {
        versionType: 'yijing',
        versionName: '义净译本',
        language: 'zh',
        content: '善现白佛言："世尊！颇有有情，于当来世，后时、后分、后五百岁，正法、像法、末法时中，于此般若波罗蜜多，听闻受持，生实信不？"佛告善现："勿作是说！颇有有情，于当来世，后时、后分、后五百岁，正法、像法、末法时中，于此般若波罗蜜多，听闻受持，生实信不？"',
        translator: '义净',
        year: '703',
      },
    ],
  },
];

export async function addVersionData() {
  try {
    let addedCount = 0;
    let updatedCount = 0;

    for (const data of VERSION_DATA) {
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

      // 为每个版本创建或更新记录
      for (const version of data.versions) {
        const existing = await prisma.sutraVersion.findUnique({
          where: {
            verseId_versionType: {
              verseId: verse.id,
              versionType: version.versionType,
            },
          },
        });

        if (existing) {
          await prisma.sutraVersion.update({
            where: {
              id: existing.id,
            },
            data: {
              content: version.content,
              translator: version.translator,
              year: version.year,
              notes: version.notes,
            },
          });
          updatedCount++;
        } else {
          await prisma.sutraVersion.create({
            data: {
              verseId: verse.id,
              versionType: version.versionType,
              versionName: version.versionName,
              language: version.language,
              content: version.content,
              translator: version.translator,
              year: version.year,
              notes: version.notes,
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
    console.error('添加版本数据失败:', error);
    throw error;
  }
}
