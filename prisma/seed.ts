/**
 * 金刚经数据种子脚本
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
  { num: 6, title: '正信希有分第六', summary: '说明持经修行的福德不可思议。' },
  { num: 7, title: '无得无说分第七', summary: '阐述如来所说法，皆不可取、不可说。' },
  { num: 8, title: '依法出生分第八', summary: '说明诸佛菩提皆从此经出。' },
  { num: 9, title: '一相无相分第九', summary: '阐述须陀洹等圣果亦无有定相可得。' },
  { num: 10, title: '庄严净土分第十', summary: '说明庄严佛土者，即非庄严，是名庄严。' },
  { num: 11, title: '无为福胜分第十一', summary: '比较持经福德与七宝布施福德。' },
  { num: 12, title: '尊重正教分第十二', summary: '说明随处说此经，乃至四句偈等，皆应供养。' },
  { num: 13, title: '如法受持分第十三', summary: '佛陀回答经名为何，如何受持。' },
  { num: 14, title: '离相寂灭分第十四', summary: '阐述忍辱波罗蜜，以及离一切诸相即名诸佛。' },
  { num: 15, title: '持经功德分第十五', summary: '说明持经功德的不可思议。' },
  { num: 16, title: '能净业障分第十六', summary: '说明持经能净业障，并举例说明。' },
  { num: 17, title: '究竟无我分第十七', summary: '阐述一切法无我，得果亦无得。' },
  { num: 18, title: '一体同观分第十八', summary: '阐述五眼、恒河沙等法，说明一如之义。' },
  { num: 19, title: '法界通化分第十九', summary: '说明福德即非福德，是名福德。' },
  { num: 20, title: '离色离相分第二十', summary: '阐述不可以具足色身见佛，不可以具足诸相见佛。' },
  { num: 21, title: '非说所说分第二十一', summary: '阐述如来无所说法，是名说法。' },
  { num: 22, title: '无法可得分第二十二', summary: '说明无法可得，是名阿耨多罗三藐三菩提。' },
  { num: 23, title: '净心行善分第二十三', summary: '阐述是法平等，无有高下，是名阿耨多罗三藐三菩提。' },
  { num: 24, title: '福智无比分第二十四', summary: '比较七宝布施与受持四句偈的福德。' },
  { num: 25, title: '化无所化分第二十五', summary: '阐述凡所有相皆是虚妄，无有一法是实。' },
  { num: 26, title: '法身非相分第二十六', summary: '阐述不应以三十二相观如来，即色即空之义。' },
  { num: 27, title: '无断无灭分第二十七', summary: '阐述法不属断，不属灭，是名圆满。' },
  { num: 28, title: '不受不贪分第二十八', summary: '说明菩萨不受福德，以无所受故。' },
  { num: 29, title: '威仪寂净分第二十九', summary: '阐述如来者，无所从来，亦无所去。' },
  { num: 30, title: '一合相理分第三十', summary: '阐述一合相即非一合相，是名一合相。' },
  { num: 31, title: '知见不生分第三十一', summary: '阐述发心者，于法不说断灭相。' },
  { num: 32, title: '应化非真分第三十二', summary: '总结全经，一切有为法如梦幻泡影。' },
];

// 金刚经偈颂数据（精选）
const verses = [
  // 第一分
  { chapter: 1, num: 1, chinese: '如是我闻：一时，佛在舍卫国祇树给孤独园，与大比丘众千二百五十人俱。', sanskrit: 'Evam maya srutam | ekasmin samaye bhagavan sravastyam viharati...', pinyin: 'Rú shì wǒ wén: yī shí, fó zài Shèwèi guó Qíshù Gěigūdú yuán...', keywords: ['如是我闻', '舍卫国', '祇树给孤独园'] },
  { chapter: 1, num: 2, chinese: '尔时，世尊食时，着衣持钵，入舍卫大城乞食。于其城中，次第乞已，还至本处。饭食讫，收衣钵，洗足已，敷座而坐。', sanskrit: 'atha bhagavan...', pinyin: 'Ěr shí, Shìzūn shí shí, zhuó yī chí bō...', keywords: ['乞食', '次第乞', '敷座而坐'] },

  // 第二分
  { chapter: 2, num: 1, chinese: '时，长老须菩提在大众中即从座起，偏袒右肩，右膝着地，合掌恭敬而白佛言："希有！世尊！如来善护念诸菩萨，善付嘱诸菩萨。"', sanskrit: 'atha ayusman subutir...', pinyin: 'Shí, zhǎnglǎo Xūpútí zài dàzhòng zhōng...', keywords: ['须菩提', '善护念', '善付嘱'] },
  { chapter: 2, num: 2, chinese: '"世尊！善男子、善女人，发阿耨多罗三藐三菩提心，应云何住？云何降伏其心？"', sanskrit: 'astu bhagavan...', pinyin: '"Shìzūn! Shàn nánzǐ, shàn nǚrén, fĀnòuduōluó sānmiǎo sān pútíxīn..."', keywords: ['阿耨多罗三藐三菩提', '云何住', '降伏其心'] },
  { chapter: 2, num: 3, chinese: '佛言："善哉！善哉！善男子！如汝所说，如来善护念诸菩萨，善付嘱诸菩萨。汝今谛听，当为汝说。善男子、善女人，发阿耨多罗三藐三菩提心，应如是住，如是降伏其心。"', sanskrit: 'bhagavan aha...', pinyin: 'Fó yán: "Shànzāi! Shànzāi!..."', keywords: ['谛听', '如是住', '如是降伏其心'] },
  { chapter: 2, num: 4, chinese: '"唯然！世尊！愿乐欲闻。"', sanskrit: 'evam bhagavan...', pinyin: '"Wéirán! Shìzūn! Yuàn lè yù wén."', keywords: ['愿乐欲闻'] },

  // 第三分
  { chapter: 3, num: 1, chinese: '佛告须菩提："诸菩萨摩诃萨，应如是降伏其心：所有一切众生之类，若卵生、若胎生、若湿生、若化生，若有色、若无色，若有想、若无想、若非有想非无想，我皆令入无余涅槃而灭度之。"', sanskrit: 'sri bhagavan uvaca...', pinyin: 'Fó gào Xūpútí: "Zhū púsà móhēsuà, yīng rúshì jiāngfú qí xīn..."', keywords: ['众生', '卵生胎生', '无余涅槃'] },
  { chapter: 3, num: 2, chinese: '"如是灭度无量无数无边众生，实无众生得灭度者。何以故？须菩提！若菩萨有我相、人相、众生相、寿者相，即非菩萨。"', sanskrit: 'tasya kasya ci...', pinyin: '"Rúshì mièdù wúliàng wúshǔ wúbiān zhòngshēng..."', keywords: ['我相', '人相', '众生相', '寿者相'] },

  // 第六分
  { chapter: 6, num: 1, chinese: '须菩提白佛言："世尊！颇有众生，于未来世，闻说是法，生信心否？"佛言："须菩提！彼非众生，非不众生。何以故？须菩提！众生、众生者，如来说非众生，是名众生。"', sanskrit: 'bhagavan aha...', pinyin: 'Xūpútí bái fó yán: "Shìzūn! Pōyǒu zhòngshēng..."', keywords: ['信心', '非众生', '是名众生'] },

  // 第十四分
  { chapter: 14, num: 1, chinese: '须菩提！忍辱波罗蜜，如来说非忍辱波罗蜜，是名忍辱波罗蜜。何以故？须菩提！如我昔为歌利王割截身体，我于尔时，无我相、无人相、无众生相、无寿者相。', sanskrit: 'ksanti paramita...', pinyin: 'Xūpútí! Rěnrǔ bōluómì...', keywords: ['忍辱波罗蜜', '歌利王', '无相'] },

  // 第三十二分
  { chapter: 32, num: 1, chinese: '一切有为法，如梦幻泡影，如露亦如电，应作如是观。', sanskrit: 'sarve dharma...', pinyin: 'Yīqiè yǒuwéi fǎ, rú mèng huàn pào yǐng...', keywords: ['有为法', '梦幻泡影', '如露如电'] },
  { chapter: 32, num: 2, chinese: '"说是经已，长老须菩提，及诸比丘、比丘尼、优婆塞、优婆夷，一切世间天人阿修罗，闻佛所说，皆大欢喜，信受奉行。"', sanskrit: 'bhagavan etad avyavadat...', pinyin: '"Shuō shì jīng yǐ, zhǎnglǎo Xūpútí..."', keywords: ['皆大欢喜', '信受奉行'] },
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
      titleTibetan: 'རྡོ་རྗེ་གཅོད་པ་ཤེས་རབ་ཀྱི་ཕ་རོལ་ཏུ་ཕྱིན་པའི་མདོ',
      slug: 'diamond-sutra',
      description: '《金刚般若波罗蜜经》，简称《金刚经》，是大乘佛教般若部的重要经典，流传最广、影响最深。经文围绕"般若"（智慧）展开，阐述"缘起性空"的中观思想。',
      order: 1,
    },
  });

  console.log(`✓ 创建经文: ${sutra.title}`);

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

  console.log(`✓ 创建 ${chapters.length} 个章节`);

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
        pinyin: verse.pinyin,
        aiKeyword: verse.keywords,
        order: verse.num,
      },
    });
  }

  console.log(`✓ 创建 ${verses.length} 个偈颂`);

  // 创建示例注释
  const versesList = await prisma.verse.findMany({
    where: { chapter: { sutraId: sutra.id } },
    take: 5,
  });

  for (const verse of versesList) {
    await prisma.commentary.upsert({
      where: { id: `comm-${verse.id}` },
      update: {},
      create: {
        id: `comm-${verse.id}`,
        verseId: verse.id,
        author: '六祖慧能',
        source: '金刚经口诀',
        content: `此偈颂揭示般若深意，修行者应离相无住，方能证得实相。`,
      },
    });
  }

  console.log(`✓ 创建示例注释`);

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

  console.log(`✓ 创建示例课程`);

  // 创建佛学概念
  const concepts = [
    { name: '般若', nameSanskrit: 'Prajñā', description: '智慧，超越世俗智慧的终极智慧，能如实认知一切事物和真理。' },
    { name: '波罗蜜', nameSanskrit: 'Pāramitā', description: '到彼岸，圆满的修行方法，共分六度。' },
    { name: '空性', nameSanskrit: 'Śūnyatā', description: '诸法无自性，缘起性空，是中观思想的核心。' },
    { name: '菩提心', nameSanskrit: 'Bodhicitta', description: '为利益众生而追求成佛的发心。' },
    { name: '涅槃', nameSanskrit: 'Nirvāna', description: '烦恼止息、脱离轮回的寂静境界。' },
    { name: '布施', nameSanskrit: 'Dāna', description: '给予而不求回报，是六度波罗蜜之首。' },
    { name: '忍辱', nameSanskrit: 'Kṣānti', description: '忍受侮辱而不起嗔恨心，是菩萨重要修行。' },
  ];

  for (const concept of concepts) {
    await prisma.concept.upsert({
      where: { name: concept.name },
      update: {},
      create: concept,
    });
  }

  console.log(`✓ 创建 ${concepts.length} 个佛学概念`);

  console.log('\n✅ 数据初始化完成！');
}

main()
  .catch((e) => {
    console.error('数据初始化失败:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
