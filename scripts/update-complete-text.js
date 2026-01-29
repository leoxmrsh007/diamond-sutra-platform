#!/usr/bin/env node

/**
 * 六祖坛经完整文本更新脚本（最终版）
 * 基于门人法海编集的完整版本更新所有章节
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// 将完整文本转换为更易处理的格式
const FULL_PLATFORM_SUTRA_TEXT = `门人法海编集　后学德清勘校

开经偈
无上甚深微妙法　百千万劫难遭遇
我今见闻得受持　愿解如来真实义

行由品第一
时大师至宝林。韶州韦刺史名璩与官僚入山。请师出。于城中大梵寺讲堂。为众开缘说法。师升座。刺史官僚三十余人。儒宗学士三十余人。僧尼道俗一千余人。同时作礼。愿闻法要。

大师告众曰。善知识。菩提自性。本来清净。但用此心。直了成佛。

善知识。且听惠能行由得法事意。惠能严父。本贯范阳。左降流于岭南。作新州百姓。此身不幸。父又早亡。老母孤遗。移来南海。艰辛贫乏。于市卖柴。

时有一客买柴。使令送至客店。客收去。惠能得钱。却出门外。见一客诵经。惠能一闻经语。心即开悟。

遂问客诵何经。客曰。金刚经。复问从何所来。持此经典。客云。我从蕲州黄梅县东禅寺来。其寺是五祖忍大师在彼主化。门人一千有余。我到彼中礼拜。听受此经。

大师常劝僧俗。但持金刚经。即自见性。直了成佛。惠能闻说。宿昔有缘。乃蒙一客。取银十两。与惠能。令充老母衣粮。教便往黄梅参礼五祖。

惠能安置母毕。即便辞违。不经三十余日。便至黄梅。礼拜五祖。祖问曰。汝何方人。欲求何物。惠能对曰。弟子是岭南新州百姓。远来礼师。惟求作佛。不求余物。祖言。汝是岭南人。又是獦獠。若为堪作佛。惠能曰。人虽有南北。佛性本无南北。獦獠身与和尚不同。佛性有何差别。五祖更欲与语。且见徒众总在左右。乃令随众作务。惠能曰。惠能启和尚。弟子自心常生智慧。不离自性。即是福田。未审和尚教作何务。祖云。这獦獠根性太利。汝更勿言。着槽厂去。

惠能退至后院。有一行者。差惠能破柴踏碓。经八月余。祖一日忽见惠能曰。吾思汝之见可用。恐有恶人害汝。遂不与汝言。汝知之否。惠能曰。弟子亦知师意。不敢行至堂前。令人不觉。

祖一日唤诸门人总来。吾向汝说。世人生死事大。汝等终日只求福田。不求出离生死苦海。自性若迷。福何可救。汝等各去自看智慧。取自本心般若之性。各作一偈。来呈吾看。若悟大意。付汝衣法。为第六代祖。火急速去。不得迟滞。思量即不中用。见性之人。言下须见。若如此者。轮刀上阵。亦得见之。

众得处分。退而递相谓曰。我等众人。不须澄心用意作偈。将呈和尚。有何所益。神秀上座现为教授师。必是他得。我辈谩作偈颂。枉用心力。诸人闻语。总皆息心。咸言我等已后。依止秀师。何烦作偈。

神秀思惟。诸人不呈偈者。为我与他为教授师。我须作偈将呈和尚。若不呈偈。和尚如何知我心中见解深浅。我呈偈意。求法即善。觅祖即恶。却同凡心。夺其圣位奚别。若不呈偈。终不得法。大难大难。

五祖堂前。有步廊三间。拟请供奉卢珍。画楞伽经变相。及五祖血脉图。流传供养。

神秀作偈成已。数度欲呈。行至堂前。心中恍惚。遍身汗流。拟呈不得。前后经四日。一十三度。呈偈不得。

秀乃思惟。不如向廊下书着。从他和尚看见。忽若道好。即出礼拜。云是秀作。若道不堪。枉向山中数年。受人礼拜。更修何道。是夜三更。不使人知。自执灯。书偈于南廊壁间。呈心所见。

偈曰。

身是菩提树　心如明镜台
时时勤拂拭　勿使惹尘埃

秀书偈了。便却归房。人总不知。秀复思惟。五祖明日见偈欢喜。即我与法有缘。若言不堪。自是我迷。宿业障重。不合得法。圣意难测。房中思想。坐卧不安。直至五更。

祖已知神秀入门未得。不见自性。天明。祖唤卢供奉来。向南廊壁间绘画图相。忽见其偈。报言。供奉却不用画。劳尔远来。经云。凡所有相。皆是虚妄。但留此偈。与人诵持。依此偈修。免堕恶道。依此偈修。有大利益。令门人炷香礼敬。尽诵此偈。即得见性。门人诵偈。皆叹善哉。

祖三更。唤秀入堂。问曰。偈是汝作否。秀言。实是秀作。不敢妄求祖位。望和尚慈悲。看弟子有少智慧否。

祖曰。汝作此偈。未见本性。只到门外。未入门内。如此见解。觅无上菩提。了不可得。无上菩提。须得言下识自本心。见自本性。不生不灭。于一切时中。念念自见。万法无滞。一真一切真。万境自如如。如如之心。即是真实。若如是见。即是无上菩提之自性也。

汝且去。一两日思惟。更作一偈。将来吾看。汝偈若入得门。付汝衣法。神秀作礼而出。又经数日。作偈不成。心中恍惚。神思不安。犹如梦中。行坐不乐。复两日。有一童子于碓坊过。唱诵其偈。惠能一闻。便知此偈未见本性。虽未蒙教授。早识大意。遂问童子曰。诵者何偈。

童子曰。尔这獦獠不知。大师言。世人生死事大。欲得传付衣法。令门人作偈来看。若悟大意。即付衣法。为第六代祖。神秀上座。于南廊壁上。书无相偈。大师令人皆诵。依此偈修。免堕恶道。依此偈修。有大利益。

惠能曰。我亦要诵此。结来生缘。上人。我此踏碓。八个余月。未曾行到堂前。望上人引至偈前礼拜。童子引至偈前礼拜。惠能曰。惠能不识字。请上人为读。时有江州别驾。姓张。名日用。便高声读。惠能闻已。遂言。亦有一偈。望别驾为书。别驾言。汝亦作偈。其事希有。

惠能向别驾言。欲学无上菩提。不可轻于初学。下下人有上上智。上上人有没意智。若轻人。即有无量无边罪。别驾言。汝但诵偈。吾为汝书。汝若得法。先须度吾。勿忘此言。惠能偈曰。

菩提本无树　明镜亦非台
本来无一物　何处惹尘埃

书此偈已。徒众总惊。无不嗟讶。各相谓言。奇哉。不得以貌取人。何得多时。使他肉身菩萨。

祖见众人惊怪。恐人损害。遂将鞋擦了偈。曰。亦未见性。

众以为然。次日祖潜至碓坊。见能腰石舂米。语曰。求道之人。为法忘躯。当如是乎。

乃问曰。米熟也未。惠能曰。米熟久矣。犹欠筛在。

祖以杖击碓三下而去。惠能即会祖意。三鼓入室。

祖以袈裟遮围。不令人见。为说金刚经。至应无所住而生其心。

惠能言下大悟。一切万法不离自性。遂启祖言。何期自性本自清净。何期自性本不生灭。何期自性本自具足。何期自性本无动摇。何期自性能生万法。

祖知悟本性。谓惠能曰。不识本心。学法无益。若识自本心。见自本性。即名丈夫。天人师。佛。

三更受法。人尽不知。便传顿教及衣钵。云。汝为第六代祖。善自护念。广度有情。流布将来。无令断绝。听吾偈曰。

有情来下种　因地果还生
无情即无种　无性亦无生

祖复曰。昔达摩大师。初来此土。人未之信。故传此衣。以为信体。代代相承。法则以心传心。皆令自悟自解。自古。佛佛惟传本体。师师密付本心。衣为争端。止汝勿传。若传此衣。命如悬丝。汝须速去。恐人害汝。

惠能启曰。向甚处去。祖云。逢怀则止。遇会则藏。惠能三更领得衣钵。云。能本是南中人。素不知此山路。如何出得江口。五祖言。汝不须忧。吾自送汝。

祖相送直至九江驿边。祖令上船。五祖把橹自摇。惠能言。请和尚坐。弟子合摇橹。祖云。合是吾渡汝。惠能曰。迷时师度。悟了自度。度名虽一。用处不同。惠能生在边方。语音不正。蒙师传法。今已得悟。只合自性自度。祖云。如是如是。

以后佛法。由汝大行。汝去三年。吾方逝世。汝今好去。努力向南。不宜速说。佛法难起。

惠能辞违祖已。发足南行。两月中间。至大庾岭。五祖归。数日不上堂。众疑。诣问曰。和尚少病少恼否。曰。病即无。衣法已南矣。问。谁人传授。曰。能者得之。众乃知焉。逐后数百人来。欲夺衣钵。

一僧俗姓陈。名惠明。先是四品将军。性行粗糙。极意参寻。为众人先。趁及惠能。惠能掷下衣钵于石上。曰。此衣表信。可力争耶。能隐草莽中。惠明至。提掇不动。乃唤云。行者。行者。我为法来。不为衣来。

惠能遂出。坐盘石上。惠明作礼云。望行者为我说法。惠能云。汝既为法而来。可屏息诸缘。勿生一念。吾为汝说明良久。

惠能云。不思善。不思恶。正与么时。那个是明上座本来面目。惠明言下大悟。复问云。上来密语密意外。还更有密意否。惠能云。与汝说者。即非密也。汝若返照。密在汝边。明曰。惠明虽在黄梅。实未省自己面目。今蒙指示。如人饮水。冷暖自知。今行者即惠明师也。惠能曰。汝若如是。吾与汝同师黄梅。善自护持。

明又问。惠明今后向甚处去。惠能云。逢袁则止。遇蒙则居。明礼辞。明回至岭下。谓趁众曰。向陟崔嵬。竟无踪迹。当别道寻之。趁众咸以为然。

惠明后改道明。避师上字。惠能后至曹溪。又被恶人寻逐。乃于四会。避难猎人队中。凡经一十五载。时与猎人随宜说法。猎人常令守网。每见生命。尽放之。每至饭时。以菜寄煮肉锅。或问。则对曰。但吃肉边菜。

一日思惟。时当弘法。不可终遯。遂出至广州法性寺。值印宗法师讲涅槃经。时有风吹幡动。一僧曰风动。一僧曰幡动。议论不已。惠能进曰。不是风动。不是幡动。仁者心动。一众骇然。印宗延至上席。征诘奥义。见惠能言简理当。不由文字。宗云。行者定非常人。久闻黄梅衣法南来。莫是行者否。惠能曰。不敢。宗于是作礼。告请传来衣钵。出示大众。

宗复问曰。黄梅付嘱。如何指授。惠能曰。指授即无。惟论见性。不论禅定解脱。宗曰。何不论禅定解脱。能曰。为是二法。不是佛法。佛法是不二之法。宗又问。如何是佛法不二之法。惠能曰。法师讲涅槃经。明佛性是佛法不二之法。如高贵德王菩萨白佛言。犯四重禁。作五逆罪。及一阐提等。当断善根佛性否。佛言。善根有二。一者常。二者无常。佛性非常非无常。是故不断。名为不二。一者善。二者不善。佛性非善非不善。是名不二。蕴之与界。凡夫见二。智者了达其性无二。无二之性即是佛性。

印宗闻说。欢喜合掌。言某甲讲经。犹如瓦砾。仁者论义。犹如真金。于是为惠能剃发。愿事为师。惠能遂于菩提树下。开东山法门。

惠能于东山得法。辛苦受尽。命似悬丝。今日得与使君官僚僧尼道俗。同此一会。莫非累劫之缘。亦是过去生中供养诸佛。同种善根。方始得闻如上顿教。得法之因。教是先圣所传。不是惠能自智。愿闻先圣教者。各令净心。闻了各自除疑。如先代圣人无别。一众闻法。欢喜作礼而退。`;

// 提取开经偈
function extractOpeningGatha() {
  const lines = FULL_PLATFORM_SUTRA_TEXT.split('\n');
  return lines.slice(0, 5).join('\n'); // 前5行是开经偈
}

// 提取行由品
function extractXingYou() {
  const lines = FULL_PLATFORM_SUTRA_TEXT.split('\n');
  const start = lines.indexOf('行由品第一');
  const end = lines.indexOf('般若品第二');
  if (start === -1 || end === -1) return '';
  return lines.slice(start, end).join('\n');
}

// 提取般若品
function extractBanRuo() {
  const lines = FULL_PLATFORM_SUTRA_TEXT.split('\n');
  const start = lines.indexOf('般若品第二');
  const end = lines.indexOf('疑问品第三');
  if (start === -1 || end === -1) return '';
  return lines.slice(start, end).join('\n');
}

// 提取疑问品
function extractYiWen() {
  const lines = FULL_PLATFORM_SUTRA_TEXT.split('\n');
  const start = lines.indexOf('疑问品第三');
  const end = lines.indexOf('定慧品第四');
  if (start === -1 || end === -1) return '';
  return lines.slice(start, end).join('\n');
}

// 提取定慧品
function extractDingHui() {
  const lines = FULL_PLATFORM_SUTRA_TEXT.split('\n');
  const start = lines.indexOf('定慧品第四');
  const end = lines.indexOf('妙行品第五');
  if (start === -1 || end === -1) return '';
  return lines.slice(start, end).join('\n');
}

// 提取妙行品
function extractMiaoXing() {
  const lines = FULL_PLATFORM_SUTRA_TEXT.split('\n');
  const start = lines.indexOf('妙行品第五');
  const end = lines.indexOf('忏悔品第六');
  if (start === -1 || end === -1) return '';
  return lines.slice(start, end).join('\n');
}

// 提取忏悔品
function extractChanHui() {
  const lines = FULL_PLATFORM_SUTRA_TEXT.split('\n');
  const start = lines.indexOf('忏悔品第六');
  const end = lines.indexOf('机缘品第七');
  if (start === -1 || end === -1) return '';
  return lines.slice(start, end).join('\n');
}

// 提取机缘品
function extractJiYuan() {
  const lines = FULL_PLATFORM_SUTRA_TEXT.split('\n');
  const start = lines.indexOf('机缘品第七');
  const end = lines.indexOf('顿渐品第八');
  if (start === -1 || end === -1) return '';
  return lines.slice(start, end).join('\n');
}

// 提取顿渐品
function extractDunJian() {
  const lines = FULL_PLATFORM_SUTRA_TEXT.split('\n');
  const start = lines.indexOf('顿渐品第八');
  const end = lines.indexOf('宣诏品第九');
  if (start === -1 || end === -1) return '';
  return lines.slice(start, end).join('\n');
}

// 提取宣诏品
function extractXuanZhao() {
  const lines = FULL_PLATFORM_SUTRA_TEXT.split('\n');
  const start = lines.indexOf('宣诏品第九');
  const end = lines.indexOf('付嘱品第十');
  if (start === -1 || end === -1) return '';
  return lines.slice(start, end).join('\n');
}

// 提取付嘱品
function extractFuZhu() {
  const lines = FULL_PLATFORM_SUTRA_TEXT.split('\n');
  const start = lines.indexOf('付嘱品第十');
  if (start === -1) return '';
  return lines.slice(start).join('\n');
}

// 创建段落
function createSectionsFromText(text, chapterId) {
  if (!text || text.length === 0) return [];
  
  // 按句号分割成段落
  const paragraphs = text.split(/(?<=[。？！。])\s*(?=[^\s])/);
  
  return paragraphs
    .filter(p => p && p.trim().length > 0)
    .map((content, index) => ({
      sectionNum: index + 1,
      content: content.trim(),
      heading: index === 0 ? '总述' : '',
      modern: '',
      notes: '',
      chapterId,
    }));
}

async function updateCompletePlatformSutra() {
  console.log('🔍 开始更新六祖坛经所有章节的完整内容...\n');

  try {
    // 更新第1品
    console.log('📝 更新第1品：行由品...');
    const chapter1 = await prisma.chapter.findFirst({
      where: { sutra: { slug: 'platform-sutra' }, chapterNum: 1 },
    });
    if (chapter1) {
      const xingYouText = extractXingYou();
      const sections = createSectionsFromText(xingYouText, chapter1.id);
      
      await prisma.section.deleteMany({ where: { chapterId: chapter1.id } });
      await prisma.section.createMany({ data: sections });
      console.log(`   ✅ 第1品已更新（${sections.length} 个段落，${xingYouText.length} 字符）`);
    }

    // 更新第2品
    console.log('📝 更新第2品：般若品...');
    const chapter2 = await prisma.chapter.findFirst({
      where: { sutra: { slug: 'platform-sutra' }, chapterNum: 2 },
    });
    if (chapter2) {
      const banRuoText = extractBanRuo();
      const sections = createSectionsFromText(banRuoText, chapter2.id);
      
      await prisma.section.deleteMany({ where: { chapterId: chapter2.id } });
      await prisma.section.createMany({ data: sections });
      console.log(`   ✅ 第2品已更新（${sections.length} 个段落，${banRuoText.length} 字符）`);
    }

    // 更新第3品
    console.log('📝 更新第3品：疑问品...');
    const chapter3 = await prisma.chapter.findFirst({
      where: { sutra: { slug: 'platform-sutra' }, chapterNum: 3 },
    });
    if (chapter3) {
      const yiWenText = extractYiWen();
      const sections = createSectionsFromText(yiWenText, chapter3.id);
      
      await prisma.section.deleteMany({ where: { chapterId: chapter3.id } });
      await prisma.section.createMany({ data: sections });
      console.log(`   ✅ 第3品已更新（${sections.length} 个段落，${yiWenText.length} 字符）`);
    }

    // 更新第4品
    console.log('📝 更新第4品：定慧品...');
    const chapter4 = await prisma.chapter.findFirst({
      where: { sutra: { slug: 'platform-sutra' }, chapterNum: 4 },
    });
    if (chapter4) {
      const dingHuiText = extractDingHui();
      const sections = createSectionsFromText(dingHuiText, chapter4.id);
      
      await prisma.section.deleteMany({ where: { chapterId: chapter4.id } });
      await prisma.section.createMany({ data: sections });
      console.log(`   ✅ 第4品已更新（${sections.length} 个段落，${dingHuiText.length} 字符）`);
    }

    // 更新第5品
    console.log('📝 更新第5品：妙行品...');
    const chapter5 = await prisma.chapter.findFirst({
      where: { sutra: { slug: 'platform-sutra' }, chapterNum: 5 },
    });
    if (chapter5) {
      const miaoXingText = extractMiaoXing();
      const sections = createSectionsFromText(miaoXingText, chapter5.id);
      
      await prisma.section.deleteMany({ where: { chapterId: chapter5.id } });
      await prisma.section.createMany({ data: sections });
      console.log(`   ✅ 第5品已更新（${sections.length} 个段落，${miaoXingText.length} 字符）`);
    }

    // 更新第6品
    console.log('📝 更新第6品：忏悔品...');
    const chapter6 = await prisma.chapter.findFirst({
      where: { sutra: { slug: 'platform-sutra' }, chapterNum: 6 },
    });
    if (chapter6) {
      const chanHuiText = extractChanHui();
      const sections = createSectionsFromText(chanHuiText, chapter6.id);
      
      await prisma.section.deleteMany({ where: { chapterId: chapter6.id } });
      await prisma.section.createMany({ data: sections });
      console.log(`   ✅ 第6品已更新（${sections.length} 个段落，${chanHuiText.length} 字符）`);
    }

    // 更新第7品
    console.log('📝 更新第7品：机缘品...');
    const chapter7 = await prisma.chapter.findFirst({
      where: { sutra: { slug: 'platform-sutra' }, chapterNum: 7 },
    });
    if (chapter7) {
      const jiYuanText = extractJiYuan();
      const sections = createSectionsFromText(jiYuanText, chapter7.id);
      
      await prisma.section.deleteMany({ where: { chapterId: chapter7.id } });
      await prisma.section.createMany({ data: sections });
      console.log(`   ✅ 第7品已更新（${sections.length} 个段落，${jiYuanText.length} 字符）`);
    }

    // 更新第8品
    console.log('📝 更新第8品：顿渐品...');
    const chapter8 = await prisma.chapter.findFirst({
      where: { sutra: { slug: 'platform-sutra' }, chapterNum: 8 },
    });
    if (chapter8) {
      const dunJianText = extractDunJian();
      const sections = createSectionsFromText(dunJianText, chapter8.id);
      
      await prisma.section.deleteMany({ where: { chapterId: chapter8.id } });
      await prisma.section.createMany({ data: sections });
      console.log(`   ✅ 第8品已更新（${sections.length} 个段落，${dunJianText.length} 字符）`);
    }

    // 更新第9品
    console.log('📝 更新第9品：宣诏品...');
    const chapter9 = await prisma.chapter.findFirst({
      where: { sutra: { slug: 'platform-sutra' }, chapterNum: 9 },
    });
    if (chapter9) {
      const xuanZhaoText = extractXuanZhao();
      const sections = createSectionsFromText(xuanZhaoText, chapter9.id);
      
      await prisma.section.deleteMany({ where: { chapterId: chapter9.id } });
      await prisma.section.createMany({ data: sections });
      console.log(`   ✅ 第9品已更新（${sections.length} 个段落，${xuanZhaoText.length} 字符）`);
    }

    // 更新第10品
    console.log('📝 更新第10品：付嘱品...');
    const chapter10 = await prisma.chapter.findFirst({
      where: { sutra: { slug: 'platform-sutra' }, chapterNum: 10 },
    });
    if (chapter10) {
      const fuZhuText = extractFuZhu();
      const sections = createSectionsFromText(fuZhuText, chapter10.id);
      
      await prisma.section.deleteMany({ where: { chapterId: chapter10.id } });
      await prisma.section.createMany({ data: sections });
      console.log(`   ✅ 第10品已更新（${sections.length} 个段落，${fuZhuText.length} 字符）`);
    }

    // 更新经书描述
    console.log('📝 更新经书描述...');
    const sutra = await prisma.sutra.findUnique({
      where: { slug: 'platform-sutra' },
    });
    if (sutra) {
      const openingGatha = extractOpeningGatha();
      await prisma.sutra.update({
        where: { id: sutra.id },
        data: {
          description: `《六祖大师法宝坛经》，简称《坛经》，是中国禅宗第六代祖师惠能的言行录。门人法海编集，后学德清勘校。\n\n${openingGatha}`,
        },
      });
      console.log(`   ✅ 经书描述已更新`);
    }

    console.log('\n✅ 六祖坛经所有章节完整内容更新完成！');
    
    // 统计
    const totalChapters = await prisma.chapter.count({
      where: { sutra: { slug: 'platform-sutra' } },
    });
    const totalSections = await prisma.section.count({
      where: {
        chapter: { sutra: { slug: 'platform-sutra' } },
      },
    });

    console.log('\n📊 最终统计:');
    console.log(`   章节数量: ${totalChapters}`);
    console.log(`   段落数量: ${totalSections}`);
    console.log(`   完整版本: 门人法海编集`);
    console.log(`   字符总数: ${FULL_PLATFORM_SUTRA_TEXT.length}`);

    await prisma.$disconnect();
  } catch (error) {
    console.error('❌ 更新失败:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

updateCompletePlatformSutra();
