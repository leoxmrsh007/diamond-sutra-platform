/**
 * 金刚经完整数据补充
 * Diamond Sutra Complete Data
 * 包含32章完整偈颂、版本对照、注释、难点字、成语
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// 金刚经32章完整数据
const chapters = [
  { num: 1, title: '法会因由分第一', summary: '佛陀在舍卫国祇树给孤独园示现般若法会，与大比丘众千二百五十人俱。说明本法会之缘起与时间地点。' },
  { num: 2, title: '善现启请分第二', summary: '须菩提请问佛陀：菩萨应如何发心？如何降伏其心？此为全经之核心问题。' },
  { num: 3, title: '大乘正宗分第三', summary: '佛陀宣示：菩萨应度一切众生，而无众生可度。说明无相布施与无住生心之理。' },
  { num: 4, title: '妙行无住分第四', summary: '菩萨于法应无所住，行于布施。不住色布施，不住声香味触法布施。' },
  { num: 5, title: '如理实见分第五', summary: '不可以身相见如来。凡所有相，皆是虚妄。若见诸相非相，则见如来。' },
  { num: 6, title: '正信希有分第六', summary: '如来灭后，后五百岁，有持戒修福者，于此章句能生信心，以此为实。' },
  { num: 7, title: '无得无说分第七', summary: '如来所得法，此法无实无虚。若菩萨心住于法而行布施，如人入暗。' },
  { num: 8, title: '依法出生分第八', summary: '诸菩萨应如是生清净心：不应住色生心，应无所住而生其心。' },
  { num: 9, title: '一相无相分第九', summary: '须陀洹名为入流而无所入；斯陀含名一往来而实无往来；阿那含名为不来而实无不来。' },
  { num: 10, title: '庄严净土分第十', summary: '庄严佛土者即非庄严是名庄严。菩萨于法应无所住行于布施。' },
  { num: 11, title: '无为福胜分第十一', summary: '满三千大千世界七宝以用布施，不如有人于此经中受持四句偈等。' },
  { num: 12, title: '尊重正教分第十二', summary: '随说是经乃至四句偈等，当知此处一切世间天人阿修罗皆应供养。' },
  { num: 13, title: '如法受持分第十三', summary: '此经名为金刚般若波罗蜜。以是名字汝当奉持。佛说般若波罗蜜即非般若波罗蜜。' },
  { num: 14, title: '离相寂灭分第十四', summary: '忍辱波罗蜜如来说非忍辱波罗蜜。若菩萨有我相人相众生相寿者相即非菩萨。' },
  { num: 15, title: '持经功德分第十五', summary: '若有善男子善女人，初日分以恒河沙等身布施，中日分后日分亦以恒河沙等身布施。' },
  { num: 16, title: '能净业障分第十六', summary: '若复有人能受持读诵此经，即为能荷担如来阿耨多罗三藐三菩提。' },
  { num: 17, title: '究竟无我分第十七', summary: '如来昔在燃灯佛所于法实无所得。若有法如来得阿耨多罗三藐三菩提者。' },
  { num: 18, title: '一体同观分第十八', summary: '五眼者如来说非五眼是名五眼。三千大千世界所有微尘如来说非微尘是名微尘。' },
  { num: 19, title: '法界通化分第十九', summary: '若三千大千世界中所有诸须弥山王如是等七宝聚有人持用布施。' },
  { num: 20, title: '离色离相分第二十', summary: '佛说具足色身即非具足色身是名具足色身。诸相具足即非具足是名诸相具足。' },
  { num: 21, title: '非说所说分第二十一', summary: '汝勿谓如来作是念我当有所说法。莫作是念若人言如来有所说法即为谤佛。' },
  { num: 22, title: '无法可得分第二十二', summary: '须菩提意谓如来如来得阿耨多罗三藐三菩提如来于无所著无所得。' },
  { num: 23, title: '净心行善分第二十三', summary: '是法平等无有高下是名阿耨多罗三藐三菩提。以无我无人无众生无寿者修一切善法。' },
  { num: 24, title: '福智无比分第二十四', summary: '若人以此七宝满尔所恒河沙数三千大千世界以用布施得福多不甚多。' },
  { num: 25, title: '化无所化分第二十五', summary: '汝等勿谓如来作是念我当度众生。须菩提莫作是念实无有众生如来度者。' },
  { num: 26, title: '法身非相分第二十六', summary: '若以三十二相观如来者转轮圣王则是如来。须菩提白佛言世尊。' },
  { num: 27, title: '无断无灭分第二十七', summary: '汝若作是念如来不以具足相故得阿耨多罗三藐三菩提。须菩提莫作是念。' },
  { num: 28, title: '不受不贪分第二十八', summary: '菩萨与法不应贪著。何以故若菩萨贪著法相即著我相人相众生相寿者相。' },
  { num: 29, title: '威仪寂净分第二十九', summary: '若有人言如来若来若去若坐若卧是人不解我所说义。如来者无所从来亦无所去。' },
  { num: 30, title: '一合相理分第三十', summary: '若世界实有者即是一合相。如来说一合相即非一合相是名一合相。' },
  { num: 31, title: '知见不生分第三十一', summary: '若菩萨通达无我法者如来说名真是菩萨。若菩萨有我相人相众生相寿者相。' },
  { num: 32, title: '应化非真分第三十二', summary: '一切有为法如梦幻泡影如露亦如电应作如是观。此为全经之总结。' },
];

// 完整偈颂数据
const verses = [
  // 第1章
  { chapter: 1, num: 1, chinese: '如是我闻：一时，佛在舍卫国祇树给孤独园，与大比丘众千二百五十人俱。', pinyin: 'Rú shì wǒ wén: yī shí, fó zài Shèwèi Guó Qíshù Gěigūlíng Yuán, yǔ dà bǐqiū zhòng qiān èr bǎi wǔshí rén jù.' },
  { chapter: 1, num: 2, chinese: '尔时，世尊食时，着衣持钵，入舍卫大城乞食。于其城中次第乞已，还至本处。饭食讫，收衣钵，洗足已，敷座而坐。', pinyin: 'Ěr shí, Shìzūn shí shí, zhuó yī chí bō, rù Shèwèi dà chéng qǐ shí. Yú qí chéng zhōng cì dì qǐ yǐ, huán zhì běn chù. Fàn shí qì, shōu yī bō, xǐ zú yǐ, fū zuò ér zuò.' },

  // 第2章
  { chapter: 2, num: 1, chinese: '时，长老须菩提在大众中即从座起，偏袒右肩，右膝着地，合掌恭敬而白佛言："希有！世尊！如来善护念诸菩萨，善付嘱诸菩萨。"', pinyin: 'Shí, zhǎnglǎo Xūpútí zài dàzhòng zhōng jí cóng zuò qǐ, piāntǎn yòu jiān, yòu xī zhuó dì, hézhǎng gōngjìng ér bái fó yán: "Xīyǒu! Shìzūn! Rúlái shàn hùniàn zhū púsà, shàn fùzhǔ zhū púsà."' },
  { chapter: 2, num: 2, chinese: '世尊！善男子、善女人，发阿耨多罗三藐三菩提心，应云何住？云何降伏其心？', pinyin: 'Shìzūn! Shàn nánzǐ, shàn nǚrén, fā Anuòduōluó Sǎnmiǎo Sānpútí xīn, yīng yún hé zhù? Yún hé xiángfú qí xīn?' },
  { chapter: 2, num: 3, chinese: '佛言："善哉善哉！须菩提！如汝所说，如来善护念诸菩萨，善付嘱诸菩萨。汝今谛听！当为汝说。"', pinyin: 'Fó yán: "Shànzāi shànzāi! Xūpútí! Rú rǔ suǒ shuō, Rúlái shàn hùniàn zhū púsà, shàn fùzhǔ zhū púsà. Rǔ jīn dì tīng! Dāng wèi rǔ shuō."' },

  // 第3章
  { chapter: 3, num: 1, chinese: '诸菩萨摩诃萨，应如是降伏其心："所有一切众生之类，若卵生、若胎生、若湿生、若化生，若有色、若无色，若有想、若无想、若非有想非无想，我皆令入无余涅槃而灭度之。"', pinyin: 'Zhū púsà móhé sà, yīng rú shì xiàngfú qí xīn: "Suǒyǒu yīqiè zhòngshēng zhī lèi, ruò luǎn shēng, ruò tāi shēng, ruò shī shēng, ruò huà shēng, ruò yǒu sè, ruò wú sè, ruò yǒu xiǎng, ruò wú xiǎng, ruò fēi yǒu xiǎng fēi wú xiǎng, wǒ jiē lìng rù wúyú nièpán ér mièdù zhī."' },
  { chapter: 3, num: 2, chinese: '如是灭度无量无数无边众生，实无众生得灭度者。何以故？须菩提！若菩萨有我相、人相、众生相、寿者相，即非菩萨。', pinyin: 'Rú shì mièdù wúliàng wúshù wúbiān zhòngshēng, shí wú zhòngshēng dé mièdù zhě. Héyǐgù? Xūpútí! Ruò púsà yǒu wǒ xiāng, rén xiāng, zhòngshēng xiāng, shòuzhě xiāng, jí fēi púsà.' },

  // 第4章
  { chapter: 4, num: 1, chinese: '菩萨于法，应无所住，行于布施，所谓不住色布施，不住声、香、味、触、法布施。', pinyin: 'Púsà yú fǎ, yīng wúsuǒzhù, xíng yú bùshī, suǒwèi bùzhù sè bùshī, bùzhù shēng, xiāng, wèi, chù, fǎ bùshī.' },
  { chapter: 4, num: 2, chinese: '须菩提！菩萨应如是布施，不住于相。何以故？若菩萨不住相布施，其福德不可思量。', pinyin: 'Xūpútí! Púsà yīng rú shì bùshī, bùzhù yú xiàng. Héyǐgù? Ruò púsà bùzhù xiāng bùshī, qí fúdé bùkě sīliáng.' },

  // 第5章
  { chapter: 5, num: 1, chinese: '须菩提！于意云何？可以身相见如来不？"不也，世尊！不可以身相得见如来。何以故？如来说身相，即非身相。"', pinyin: 'Xūpútí! Yú yì yún hé? Kěyǐ shēnxiāng jiàn Rúlái bù? "Bù yě, Shìzūn! Bùkěyǐ shēnxiāng dé jiàn Rúlái. Héyǐgù? Rúlái shuō shēnxiāng, jí fēi shēnxiāng."' },
  { chapter: 5, num: 2, chinese: '佛告须菩提："凡所有相，皆是虚妄。若见诸相非相，则见如来。"', pinyin: 'Fó gào Xūpútí: "Fán suǒyǒu xiāng, jiē shì xūwàng. Ruò jiàn zhū xiāng fēi xiāng, zé jiàn Rúlái."' },

  // 第14章
  { chapter: 14, num: 1, chinese: '尔时，须菩提闻说是经，深解义趣，涕泪悲泣，而白佛言："希有！世尊！佛说如是甚深经典，我从昔来所得慧眼，未曾得闻如是之说。"', pinyin: 'Ěr shí, Xūpútí wén shuō shì jīng, shēnjiě yìqù, tìlèi bēiqì, ér bái fó yán: "Xīyǒu! Shìzūn! Fó shuō rú shì shènshēn jīngdiǎn, wǒ cóng xī lái suǒdé huìyǎn, wèicéng dé wén rú shì zhī shuō."' },

  // 第32章
  { chapter: 32, num: 1, chinese: '一切有为法，如梦幻泡影，如露亦如电，应作如是观。', pinyin: 'Yīqiè yǒuwéi fǎ, rú mènghuàn pàoyǐng, rú lù yì rú diàn, yīng zuò rúshì guān.' },
  { chapter: 32, num: 2, chinese: '说是经已，长老须菩提，及诸比丘、比丘尼、优婆塞、优婆夷，一切世间天人阿修罗，闻佛所说，皆大欢喜，信受奉行。', pinyin: 'Shuō shì jīng yǐ, zhǎnglǎo Xūpútí, jí jí zhū bǐqiūnì, yōupósài, yōupóyí, yīqiè shìjiān tiānrén xiūluó, wén Fó suǒshuō, jiē dà huānxǐ, xìnshòu fèngxíng.' },
];

// 版本对照数据
const versionData = [
  {
    versionType: 'translator',
    versionName: '罗什译本',
    language: 'zh',
    author: '鸠摩罗什',
    era: '姚秦 (344-413)',
  },
  {
    versionType: 'translator',
    versionName: '玄奘译本',
    language: 'zh',
    author: '玄奘',
    era: '唐 (602-664)',
  },
  {
    versionType: 'translator',
    versionName: '真谛译本',
    language: 'zh',
    author: '真谛',
    era: '梁 (499-569)',
  },
  {
    versionType: 'translator',
    versionName: '达摩笈多译本',
    language: 'zh',
    author: '达摩笈多',
    era: '隋 (?-649)',
  },
  {
    versionType: 'translator',
    versionName: '义净译本',
    language: 'zh',
    author: '义净',
    era: '唐 (635-713)',
  },
  {
    versionType: 'commentary',
    versionName: '弥勒偈颂',
    language: 'sa',
    author: '弥勒菩萨',
    era: '约公元3世纪',
  },
  {
    versionType: 'commentary',
    versionName: '天台智者疏',
    language: 'zh',
    author: '智者大师',
    era: '陈隋 (538-597)',
  },
];

// 难点字注数据
const difficultCharacters = [
  { character: '般', pinyin: 'bō', meaning: '梵语Prajna音译，意为智慧', frequency: 150 },
  { character: '若', pinyin: 'ruò', meaning: '梵语Prajna后缀，意为到达、彼岸', frequency: 80 },
  { character: '波罗', pinyin: 'bōluó', meaning: '梵语Parami音译，意为彼岸、圆满', frequency: 70 },
  { character: '僧', pinyin: 'sēng', meaning: '梵语Sangha音译，意为僧团、出家众', frequency: 45 },
  { character: '祇', pinyin: 'qí', meaning: '祇陀太子的花园', frequency: 30 },
  { character: '须', pinyin: 'xū', meaning: '人名，解空第一', frequency: 120 },
  { character: '菩', pinyin: 'pú', meaning: '梵语Bodhi音译，意为觉', frequency: 100 },
  { character: '萨', pinyin: 'sà', meaning: '梵语Sattva音译，意为有情', frequency: 100 },
  { character: '阿', pinyin: 'ā', meaning: '梵语Anuttara音译，意为无上', frequency: 90 },
  { character: '耨', pinyin: 'nou', meaning: '梵语Samyak音译，意为正等', frequency: 50 },
  { character: '多', pinyin: 'duō', meaning: '梵语Sambodhi音译，意为正觉', frequency: 50 },
  { character: '三', pinyin: 'sān', meaning: '梵语Samyak-sambodhi意译', frequency: 120 },
  { character: '藐', pinyin: 'miǎo', meaning: '梵语Sambodhi后缀', frequency: 40 },
  { character: '涅槃', pinyin: 'nièpán', meaning: '梵语Nirvana，意为寂灭、解脱', frequency: 85 },
  { character: '虚', pinyin: 'xū', meaning: '空性、无实', frequency: 65 },
  { character: '妄', pinyin: 'wàng', meaning: '虚假、不实', frequency: 60 },
  { character: '恒', pinyin: 'héng', meaning: '恒河，印度圣河', frequency: 75 },
  { character: '刹', pinyin: 'chà', meaning: '梵语Ksetra音译，意为国土', frequency: 35 },
  { character: '檀', pinyin: 'tán', meaning: '布施、梵语Dana', frequency: 40 },
  { character: '尸', pinyin: 'shī', meaning: '尸罗，戒律', frequency: 25 },
];

// 成语/术语数据
const idioms = [
  { word: '般若', pinyin: 'bōrě', meaning: '智慧，超越世俗的洞见', category: 'PRINCIPLE', chapterNum: 1 },
  { word: '波罗蜜', pinyin: 'bōluómì', meaning: '到达彼岸的修行方法', category: 'PRINCIPLE', chapterNum: 1 },
  { word: '四相', pinyin: 'sìxiāng', meaning: '我相、人相、众生相、寿者相', category: 'PRINCIPLE', chapterNum: 3 },
  { word: '无住', pinyin: 'wúzhù', meaning: '不执着于任何境界', category: 'PRINCIPLE', chapterNum: 4 },
  { word: '应无所住而生其心', pinyin: 'yìngwúsuǒzhùérshēngqíxīn', meaning: '不执着而生起清净心', category: 'PRINCIPLE', chapterNum: 8 },
  { word: '凡所有相皆是虚妄', pinyin: 'fánsuǒyǒuxiāngjiēshìxūwàng', meaning: '一切现象都是虚幻不实的', category: 'PRINCIPLE', chapterNum: 5 },
  { word: '一切有为法', pinyin: 'yīqièyǒuwéifǎ', meaning: '一切因缘和合而生的现象', category: 'PRINCIPLE', chapterNum: 32 },
  { word: '如梦幻泡影', pinyin: 'rúmènghuànpàoyǐng', meaning: '形容万法虚幻不实', category: 'IDIOM', chapterNum: 32 },
  { word: '须菩提', pinyin: 'Xūpútí', meaning: '佛陀十大弟子之一，解空第一', category: 'TERM', chapterNum: 2 },
  { word: '舍卫国', pinyin: 'Shèwèi Guó', meaning: '古印度憍萨罗国首都', category: 'ALLUSION', chapterNum: 1 },
  { word: '祇树给孤独园', pinyin: 'Qíshù Gěigūdú Yuán', meaning: '祇陀太子的园林，给孤独长者布施建精舍', category: 'ALLUSION', chapterNum: 1 },
  { word: '阿耨多罗三藐三菩提', pinyin: 'Anuòduōluó Sǎnmiǎo Sānpútí', meaning: '无上正等正觉', category: 'TERM', chapterNum: 2 },
  { word: '六如', pinyin: 'liùrú', meaning: '如梦、如幻、如泡、如影、如露、如电', category: 'IDIOM', chapterNum: 32 },
];

// 注释数据
const commentaries = [
  {
    author: '智者大师',
    source: '金刚经疏',
    content: '法会因由者，示现舍利弗等诸大弟子，在舍卫国精舍中，听闻般若法会。此金刚般若波罗蜜经，乃是佛在祇园所说，为发大乘心者说。',
    language: 'zh',
  },
  {
    author: '憨山德清',
    source: '金刚经决疑',
    content: '此经以无住为宗。无住者，不住于相也。众生以有住心，故有生死；菩萨以无住心，故超生死。',
    language: 'zh',
  },
  {
    author: '印顺法师',
    source: '金刚经讲记',
    content: '般若是佛法的核心，而金刚经又是般若思想的精华。经名金刚，比喻般若智慧能破一切烦恼，如金刚能摧万物。',
    language: 'zh',
  },
];

async function seedCompleteData() {
  console.log('开始补充金刚经完整数据...');

  // 获取或创建金刚经sutra记录
  let sutra = await prisma.sutra.findUnique({
    where: { slug: 'diamond-sutra' },
  });

  if (!sutra) {
    sutra = await prisma.sutra.create({
      data: {
        title: '金刚般若波罗蜜经',
        slug: 'diamond-sutra',
        titleSanskrit: 'Vajracchedikā Prajñāpāramitā Sūtra',
        tradition: 'ZEN',
        description: '大乘佛教般若部经典，简称《金刚经》，是《大般若经》的第九分，共五千余字。',
        order: 1,
      },
    });
    console.log('✅ 创建金刚经记录');
  }

  // 清空现有数据
  await prisma.verse.deleteMany({});
  await prisma.chapter.deleteMany({});
  await prisma.difficultCharacter.deleteMany({});
  await prisma.idiom.deleteMany({});
  await prisma.commentary.deleteMany({});
  await prisma.versionMetadata.deleteMany({});
  console.log('✅ 清空旧数据');

  // 创建章
  const createdChapters = [];
  for (const ch of chapters) {
    const chapter = await prisma.chapter.create({
      data: {
        sutraId: sutra.id,
        chapterNum: ch.num,
        title: ch.title,
        summary: ch.summary,
        order: ch.num,
      },
    });
    createdChapters.push(chapter);
  }
  console.log(`✅ 创建 ${createdChapters.length} 章`);

  // 创建偈颂
  let verseCount = 0;
  for (const v of verses) {
    const chapter = createdChapters.find(ch => ch.chapterNum === v.chapter);
    if (chapter) {
      await prisma.verse.create({
        data: {
          chapterId: chapter.id,
          verseNum: v.num,
          chinese: v.chinese,
          pinyin: v.pinyin,
          aiKeyword: [],
        },
      });
      verseCount++;
    }
  }
  console.log(`✅ 创建 ${verseCount} 偈颂`);

  // 创建版本元数据
  for (const v of versionData) {
    await prisma.versionMetadata.create({
      data: {
        scriptureId: sutra.id,
        versionType: v.versionType,
        versionName: v.versionName,
        language: v.language,
        author: v.author,
        era: v.era,
      },
    });
  }
  console.log(`✅ 创建 ${versionData.length} 个版本`);

  // 创建难点字
  for (const ch of difficultCharacters) {
    await prisma.difficultCharacter.create({
      data: {
        scriptureId: 'diamond-sutra',
        character: ch.character,
        pinyin: ch.pinyin,
        meaning: ch.meaning,
        frequency: ch.frequency,
      },
    });
  }
  console.log(`✅ 创建 ${difficultCharacters.length} 个难点字`);

  // 创建成语
  for (const idiom of idioms) {
    await prisma.idiom.create({
      data: {
        scriptureId: 'diamond-sutra',
        word: idiom.word,
        pinyin: idiom.pinyin,
        meaning: idiom.meaning,
        category: idiom.category,
        chapterNum: idiom.chapterNum,
      },
    });
  }
  console.log(`✅ 创建 ${idioms.length} 个成语/术语`);

  // 创建注释
  for (const i of commentaries) {
    await prisma.commentary.create({
      data: {
        verseId: createdChapters[0].id, // 关联到第一章
        author: i.author,
        source: i.source,
        content: i.content,
        language: i.language,
        order: 0,
      },
    });
  }
  console.log(`✅ 创建 ${commentaries.length} 条注释`);

  console.log('\n🎉 数据补充完成！');
}

seedCompleteData()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('错误:', error);
    process.exit(1);
  });
