const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const PLATFORM_SUTRA_DATA = {
  sutra: {
    title: '六祖坛经',
    titleSanskrit: 'Liuzu Tanjing',
    slug: 'platform-sutra',
    description: '《六祖大师法宝坛经》简称《坛经》，是中国禅宗第六代祖师惠能的言行录，是中国人撰写的唯一被称为"经"的佛教典籍。',
    order: 2,
    tradition: 'ZEN',
  },
  chapters: [
    {
      chapterNum: 1,
      title: '行由品',
      summary: '记述惠能的出身、求法经历，以及得法南下的因缘。',
      sections: [
        { sectionNum: 1, heading: '惠能出身', content: '时大师至宝林，韶州韦刺史与官僚入山请师，出于城中大梵寺讲堂，为众开缘说法。师升座次，刺史官僚三十余人，儒宗学士三十余人，僧尼道俗一千余人，同时作礼，愿闻法要。' },
        { sectionNum: 2, heading: '闻经得悟', content: '大师告众曰：善知识！菩提自性，本来清净，但用此心，直了成佛。善知识！且听惠能行由，得法事意。' },
        { sectionNum: 3, heading: '黄梅求法', content: '惠能严父，本贯范阳，左降流于岭南，作新州百姓。此身不幸，父又早亡，老母孤遗，移来南海，艰辛贫乏，于市卖柴。时有一客买柴，使令送至客店。客收去，惠能得钱，却出门外，见一客诵经。惠能一闻经语，心即开悟。遂问客诵何经？客曰：《金刚经》。' },
        { sectionNum: 4, heading: '求法历程', content: '惠能即问：客从何处来？持此经典？客曰：我从蕲州黄梅县东禅寺来，其寺是五祖忍大师在彼主化，门人一千有余。我到彼中礼拜，听受此经。大师常劝僧俗，但持《金刚经》，即自见性，直了成佛。' },
        { sectionNum: 5, heading: '得法偈颂', content: '惠能闻说，宿昔有缘，便即辞亲，往黄梅冯茂山礼拜五祖。祖问曰：汝何方人？欲求何物？惠能对曰：弟子是岭南新州百姓，远来礼师，惟求作佛，不求余物。' },
        { sectionNum: 6, heading: '作偈得法', content: '惠能言下大悟，一切万法，不离自性。遂启祖言：何期自性，本自清净；何期自性，本不生灭；何期自性，本自具足；何期自性，本无动摇；何期自性，能生万法。' },
        { sectionNum: 7, heading: '三更受法', content: '三更受法，人皆不知。便传顿教及衣钵，以为六代祖。以偈曰：有情来下种，因地果还生。无情亦无种，无性亦无生。' },
        { sectionNum: 8, heading: '南下隐遁', content: '祖复曰：昔达摩大师，初来此土，人未之信，故传此衣，以为信体，代代相承。法则以心传心，皆令自悟自解。自古，佛佛惟传本体，师师密付本心。衣为争端，止汝勿传。若传此衣，命如悬丝。汝须速去，恐人害汝。' },
      ],
    },
    {
      chapterNum: 2,
      title: '般若品',
      summary: '阐述般若智慧的本质，教导如何开发自性般若。',
      sections: [
        { sectionNum: 1, heading: '般若大智慧', content: '次日，韦刺史请师升座，为大众开示：佛法是不二之法，心地无非自性戒，心地无痴自性慧，心地无乱自性定，不增不减自金刚，身来去自性三昧。' },
        { sectionNum: 2, heading: '自性般若', content: '善知识！何名般若？般若者，唐言智慧也。一切处所，一切时中，念念不愚，常行智慧，即是般若行。一念愚即般若绝，一念智即般若生。' },
        { sectionNum: 3, heading: '摩诃般若', content: '善知识！摩诃般若波罗蜜，最尊最上最第一，无住无往亦无来，三世诸佛从中出。当用大智慧，打破五蕴烦恼尘劳。如此修行，定成佛道，变三毒为戒定慧。' },
        { sectionNum: 4, heading: '心量广大', content: '善知识！我此法门，从一般若生八万四千智慧。何以故？为世人有八万四千尘劳。若无尘劳，智慧常现，不离自性。悟此法者，即是无念，无忆无著，不起诳妄。用自真如性，以智慧观照，于一切法不取不舍，即是见性成佛道。' },
        { sectionNum: 5, heading: '无相偈颂', content: '心平何劳持戒，行直何用修禅。恩则孝养父母，义则上下相怜。让则尊卑和睦，忍则众恶无喧。若能钻木取火，淤泥定生红莲。苦口的是良药，逆耳必是忠言。改过必生智慧，护短心内非贤。日用常行饶益，成道非由施钱。菩提只向心觅，何劳向外求玄？听说依此修行，西方只在目前。' },
      ],
    },
    {
      chapterNum: 3,
      title: '疑问品',
      summary: '解答韦刺史等人的疑问，阐述在家修行的道理。',
      sections: [
        { sectionNum: 1, heading: '在家修行', content: '一日，韦刺史为师设大会斋。斋讫，刺史请师升座，同官僚士庶，肃容再拜，问曰：弟子闻和尚说法，实不可思议。今有少疑，愿大慈悲，特为解说。' },
        { sectionNum: 2, heading: '西方净土', content: '师曰：有疑即问，吾当为说。韦公曰：和尚所说，达摩祖师宗旨，即净土念佛，求生西方，是否？师曰：使君不善听，我说与公。' },
        { sectionNum: 3, heading: '唯心净土', content: '使君！东方人但心净即无罪，虽西方人，心不净亦有愆。东方人造罪，念佛求生西方；西方人造罪，念佛求生何国？凡愚不了自性，不识身中净土，愿东愿西。悟人在处一般。' },
        { sectionNum: 4, heading: '皈依三宝', content: '师曰：善知识！皈依觉，两足尊；皈依正，离欲尊；皈依净，众中尊。从今去，称觉为师，更不皈依邪魔外道。以自性三宝，常自证明。劝善知识，皈依自性三宝。' },
        { sectionNum: 5, heading: '无相忏悔', content: '今与汝等授无相忏悔，灭三世罪，令得三业清净。善知识！各随我语，一时道：弟子等，从前念、今念及后念，念念不被愚迷染，从前所有恶业愚迷等罪，悉皆忏悔，愿一时消灭，永不复起。' },
        { sectionNum: 6, heading: '发愿四弘', content: '善知识！既忏悔已，与汝等发四弘誓愿，各须用心正听：自心众生无边誓愿度，自心烦恼无边誓愿断，自性法门无尽誓愿学，自性无上佛道誓愿成。' },
      ],
    },
    {
      chapterNum: 4,
      title: '定慧品',
      summary: '阐述定慧一体不二的道理，禅修的核心思想。',
      sections: [
        { sectionNum: 1, heading: '定慧一体', content: '师示众云：善知识！我此法门，以定慧为本。大众勿迷，言定慧别。定慧体一不二，即是定慧即慧之时，定在慧；慧即定之时，慧在定。' },
        { sectionNum: 2, heading: '一行三昧', content: '善知识！一行三昧者，于一切处，行住坐卧，常行一直心是也。《净名经》云：直心是道场，直心是净土。莫心行谄曲，口但说直，口说一行三昧，不行直心，非佛弟子。' },
        { sectionNum: 3, heading: '无相无著', content: '善知识！一行三昧者，于一切时中，行住坐卧，常行一直心是也。莫行心谄曲，口说法直。口说一行三昧，不行直心者，非佛弟子。但行直心，于一切法上无有执著，名一行三昧。' },
        { sectionNum: 4, heading: '无念为宗', content: '善知识！我此法门，从上已来，顿渐皆立无念为宗，无相为体，无住为本。何名为相无相？于相而离相。无念者，于念而无念。无住者，为人本性，念念不住。' },
        { sectionNum: 5, heading: '坐禅之理', content: '此法门中，无障无碍，外于一切善恶境界，心念不起，名为坐；内见自性不动，名为禅。善知识！何名禅定？外离相为禅，内不乱为定。' },
      ],
    },
    {
      chapterNum: 5,
      title: '妙行品',
      summary: '传授无相忏悔和发愿，教导修行的具体方法。',
      sections: [
        { sectionNum: 1, heading: '无相忏悔', content: '师曰：今与汝等授无相忏悔，灭三世罪，令得三业清净。各随我语，一时道：弟子等，从前念、今念及后念，念念不被愚迷染，从前所有恶业愚迷等罪，悉皆忏悔，愿一时消灭，永不复起。' },
        { sectionNum: 2, heading: '四弘誓愿', content: '善知识！既忏悔已，与汝等发四弘誓愿，各须用心正听：自心众生无边誓愿度，自心烦恼无边誓愿断，自性法门无尽誓愿学，自性无上佛道誓愿成。' },
        { sectionNum: 3, heading: '无相三归', content: '善知识！既发四弘誓愿讫，各与汝授无相三归依戒。今与汝等授无相三归依戒：皈依觉，两足尊；皈依正，离欲尊；皈依净，众中尊。' },
        { sectionNum: 4, heading: '自性三宝', content: '佛者，觉也；法者，正也；僧者，净也。自心皈依觉，邪迷不生，少欲知足，能离财色，名两足尊。自心皈依正，念念无邪见，以无邪见故，即无人我贡高贪爱执着，名离欲尊。自心皈依净，于一切尘劳爱欲境界，自性不染，名众中尊。' },
        { sectionNum: 5, heading: '戒定慧学', content: '善知识！既皈依三宝，各当用心，各与汝说无相戒，令汝等得解脱：自心无非，名戒；自心无痴，名慧；自心无乱，名定。不生不灭，性自如如，常住不迁，名戒定慧学。' },
      ],
    },
    {
      chapterNum: 6,
      title: '忏悔品',
      summary: '详细讲解忏悔的道理和方法。',
      sections: [
        { sectionNum: 1, heading: '五祖忏悔', content: '尔时，世尊告弥勒菩萨言：汝等诸菩萨，当知忏悔，即是清净。我今为汝，说忏悔法。欲行忏悔者，当观身中，四大五蕴，皆从因缘而生。' },
        { sectionNum: 2, heading: '六根忏悔', content: '善知识！既皈依自性三宝，当各各于自心，深信自性本来清净，于一切法，不生执著。六根供养，忏悔已，普愿法界众生，同生净土。' },
        { sectionNum: 3, heading: '七佛偈颂', content: '毗婆尸佛偈：身从无相中受生，犹如幻出诸形相。幻人心识本来无，罪福皆空无所住。尸弃佛偈：起诸善法本是幻，造诸恶业亦是幻。身如聚沫心如风，幻出无根无实性。' },
        { sectionNum: 4, heading: '无相忏法', content: '今与汝等授无相忏悔，灭三世罪，令得三业清净。弟子等，从前念、今念及后念，念念不被愚迷染。从前所有恶业愚迷等罪，悉皆忏悔，愿一时消灭，永不复起。' },
      ],
    },
    {
      chapterNum: 7,
      title: '机缘品',
      summary: '记述惠能与弟子们的问答机锋，展示禅宗教学风格。',
      sections: [
        { sectionNum: 1, heading: '法海问法', content: '师曰：汝等各各自净心，听吾说法。若欲成就种智，须达一相三昧，一行三昧。若于一切处而不住相，于彼相中不生憎爱，亦无取舍，不念利益成坏等事，安闲恬静，虚融澹泊，此名一相三昧。' },
        { sectionNum: 2, heading: '法达诵经', content: '僧法达，洪州人，七岁出家，常诵《法华经》。师曰：汝名法达，何曾达法？法达再拜曰：弟子诵《法华经》未解经义，心常有疑，和尚智慧广大，愿为决疑。' },
        { sectionNum: 3, heading: '智通问经', content: '僧智通，寿州安丰人，初看《楞伽经》，约千余遍，而不会三身四智。礼师求解其义，师曰：三身者，清净法身，汝之性也；圆满报身，汝之智也；千百亿化身，汝之行也。' },
        { sectionNum: 4, heading: '志道悟法', content: '僧志道，广州南海人也，请益曰：弟子自出家，览《涅槃经》十载有余，未明大意，愿和尚垂诲。师曰：汝何处未了？对曰：诸行无常，是生灭法；生灭灭已，寂灭为乐。于此疑惑。' },
        { sectionNum: 5, heading: '无尽藏尼', content: '有尼无尽藏者，常诵《涅槃经》。师暂听，即为其解说其义。尼遂执卷问字，师曰：字即不识，义即请问。尼曰：字尚不识，焉能会义？师曰：诸佛妙理，非关文字。' },
      ],
    },
    {
      chapterNum: 8,
      title: '顿渐品',
      summary: '阐述南宗顿悟与北宗渐修的区别。',
      sections: [
        { sectionNum: 1, heading: '南顿北渐', content: '时师在曹溪宝林，神秀大师在荆南玉泉寺。于是两宗盛化，人皆称南能北秀。故有南北二宗顿渐之分，而学者莫知宗趣。' },
        { sectionNum: 2, heading: '法本一宗', content: '师曰：法本一宗，人有南北，因此便有南北。法即一种，见有迟疾，见迟即渐，见疾即顿。法无顿渐，人有利钝，故名渐顿。' },
        { sectionNum: 3, heading: '坐禅之别', content: '师曰：何名坐禅？此法门中，无障无碍，外于一切善恶境界，心念不起，名为坐；内见自性不动，名为禅。善知识！何名禅定？外离相为禅，内不乱为定。' },
        { sectionNum: 4, heading: '无念为宗', content: '善知识！我此法门，从上已来，顿渐皆立无念为宗，无相为体，无住为本。何名为相无相？于相而离相。无念者，于念而无念。' },
        { sectionNum: 5, heading: '志诚来参', content: '时有一僧名志诚，受秀大师戒，及命来参。师问曰：汝从何来？志诚曰：从玉泉寺来。师曰：汝彼中作什么？志诚曰：我说本来无物，何得更有我？' },
      ],
    },
    {
      chapterNum: 9,
      title: '宣诏品',
      summary: '记述皇帝诏请惠能进京，惠能辞谢的经过。',
      sections: [
        { sectionNum: 1, heading: '神龙诏请', content: '神龙元年上元日，则天中宗诏云：朕请安秀二师，宫中供养。万机之暇，每究一乘。二师推让云：南方有能禅师，密受忍大师衣法，可就彼问。' },
        { sectionNum: 2, heading: '薛简问法', content: '薛简曰：京城禅德皆云：欲得会道，必须坐禅习定。若不因禅定而得解脱者，未之有也。未审师意如何？师曰：道由心悟，岂在坐也？经云：若言如来若坐若卧，是行邪道。何故？无所从来，亦无所去。无生无灭，是如来清净禅。诸法空寂，是如来清净坐。' },
        { sectionNum: 3, heading: '道在心悟', content: '师曰：道由心悟，岂在坐也？经云：若言如来若坐若卧，是行邪道。何故？无所从来，亦无所去。无生无灭，是如来清净禅。诸法空寂，是如来清净坐。' },
        { sectionNum: 4, heading: '二道不二', content: '师曰：明与无明，凡夫见二。智者了达，其性无二。无二之性，即是实性。实性者，处凡愚而不减，在贤圣而不增，住烦恼而不乱，居禅定而不寂。' },
      ],
    },
    {
      chapterNum: 10,
      title: '付嘱品',
      summary: '惠能临终前对弟子的最后教导和付托。',
      sections: [
        { sectionNum: 1, heading: '临终付嘱', content: '师太极元年壬子延和七月，命门人往新州国恩寺建塔，仍令促工。次年夏末落成。七月一日，集徒众曰：吾至八月，欲离世间。汝等有疑，须早问，为汝破疑。' },
        { sectionNum: 2, heading: '真假动静偈', content: '师曰：一切无有真，不以见于真。若见于真者，是见尽非真。若修于此行，是知无尽意。莫若观真如，虚怀绝对待。心境两俱泯，动静一时休。' },
        { sectionNum: 3, heading: '自性真佛', content: '师曰：汝等谛听，后代迷人，若识众生，即是佛性。若不识众生，万劫觅佛难逢。吾今教汝，识自心众生，见自心佛性。欲求见佛，但识众生。只为众生迷佛，非是佛迷众生。' },
        { sectionNum: 4, heading: '三科三十六对', content: '师曰：三科法门者，阴、入、界。五阴：色受想行识。十二入：外六入：色声香味触法；内六入：眼耳鼻舌身意。十八界：六根、六尘、六识是也。' },
        { sectionNum: 5, heading: '最后教导', content: '师曰：汝等好住，吾灭度后，莫作世情哭泣往来，受着缞麻，非吾弟子，亦非正法。但识自本心，见自本性，无动无静，无生无灭，无去无来，无是无非，无住无往。' },
        { sectionNum: 6, heading: '示寂往生', content: '师曰：吾灭度后，依此修行，如吾在日。若违吾教，纵吾在世，亦无有益。师说偈已，端坐至三更，忽谓门人曰：吾行矣。奄然迁化。于时异香满室，白虹属地，林木变白，禽兽哀鸣。' },
      ],
    },
  ],
};

async function forceImportPlatformSutra() {
  console.log('[INFO] Starting force import of Platform Sutra...\n');

  // 1. Find and delete existing platform sutra
  const existingSutra = await prisma.sutra.findUnique({
    where: { slug: 'platform-sutra' },
    include: {
      chapters: true,
    },
  });

  if (existingSutra) {
    console.log(`[INFO] Found existing Platform Sutra: ${existingSutra.id}`);

    // Delete all chapters and their sections
    for (const chapter of existingSutra.chapters) {
      await prisma.section.deleteMany({
        where: { chapterId: chapter.id },
      });
      await prisma.chapter.delete({
        where: { id: chapter.id },
      });
      console.log(`  Deleted chapter ${chapter.chapterNum} and its sections`);
    }

    await prisma.sutra.delete({
      where: { id: existingSutra.id },
    });

    console.log('[INFO] Deleted all existing Platform Sutra data\n');
  }

  // 2. Create new Platform Sutra
  const sutra = await prisma.sutra.create({
    data: PLATFORM_SUTRA_DATA.sutra,
  });

  console.log(`[INFO] Created sutra: ${sutra.title}\n`);

  // 3. Create chapters and sections
  let totalSections = 0;
  for (const chapterData of PLATFORM_SUTRA_DATA.chapters) {
    const chapter = await prisma.chapter.create({
      data: {
        sutraId: sutra.id,
        chapterNum: chapterData.chapterNum,
        title: chapterData.title,
        summary: chapterData.summary,
        order: chapterData.chapterNum,
      },
    });

    console.log(`[INFO] Created chapter: 第${chapterData.chapterNum}品 ${chapterData.title}`);

    for (const sectionData of chapterData.sections) {
      await prisma.section.create({
        data: {
          chapterId: chapter.id,
          sectionNum: sectionData.sectionNum,
          heading: sectionData.heading,
          content: sectionData.content,
          order: sectionData.sectionNum,
        },
      });
      totalSections++;
    }

    console.log(`[INFO]   Created ${chapterData.sections.length} sections`);
  }

  console.log(`\n[SUCCESS] Force import completed!`);
  console.log(`[STATS] Total sections created: ${totalSections}`);
  console.log(`[STATS] Average sections per chapter: ${(totalSections / 10).toFixed(1)}`);

  await prisma.$disconnect();
}

forceImportPlatformSutra().catch((error) => {
  console.error('[ERROR] Force import failed:', error);
  process.exit(1);
});
