/**
 * 金刚般若波罗蜜经完整数据
 * Diamond Sutra Complete Seed Data
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// 金刚经32章完整数据
const diamondSutraChapters = [
  { num: 1, title: '法会因由分第一', summary: '佛陀在舍卫国祇树给孤独园示现般若法会，与大比丘众千二百五十人俱。说明本法会之缘起与时间地点。' },
  { num: 2, title: '善现启请分第二', summary: '须菩提请问佛陀：菩萨应如何发心？如何降伏其心？此为全经之核心问题。' },
  { num: 3, title: '大乘正宗分第三', summary: '佛陀宣示：菩萨应度一切众生，而无众生可度。说明无相布施与无住生心之理。' },
  { num: 4, title: '妙行无住分第四', summary: '菩萨于法应无所住，行于布施。不住色布施，不住声香味触法布施。' },
  { num: 5, title: '如理实见分第五', summary: '不可以身相见如来。凡所有相，皆是虚妄。若见诸相非相，则见如来。' },
  { num: 6, title: '正信希有分第六', summary: '如来灭后，后五百岁，有持戒修福者，于此章句能生信心，以此为实。当知是人不于一佛二佛三四五佛而种善根。' },
  { num: 7, title: '无得无说分第七', summary: '如来所得法，此法无实无虚。若菩萨心住于法而行布施，如人入暗，则无所见。' },
  { num: 8, title: '依法出生分第八', summary: '诸菩萨摩诃萨应如是生清净心：不应住色生心，不应住声香味触法生心，应无所住而生其心。' },
  { num: 9, title: '一相无相分第九', summary: '须陀洹名为入流，而无所入；斯陀含名一往来，而实无往来；阿那含名为不来，而实无不来；阿罗汉能作是念：我得阿罗汉道。' },
  { num: 10, title: '庄严净土分第十', summary: '庄严佛土者，即非庄严，是名庄严。菩萨于法，应无所住行于布施。' },
  { num: 11, title: '无为福胜分第十一', summary: '满三千大千世界七宝以用布施，不如有人于此经中受持乃至四句偈等，为他人说，其福胜彼。' },
  { num: 12, title: '尊重正教分第十二', summary: '随说是经乃至四句偈等，当知此处，一切世间天人阿修罗，皆应供养，如佛塔庙。' },
  { num: 13, title: '如法受持分第十三', summary: '此经名为金刚般若波罗蜜。以是名字，汝当奉持。所以者何？须菩提！佛说般若波罗蜜，即非般若波罗蜜。' },
  { num: 14, title: '离相寂灭分第十四', summary: '忍辱波罗蜜，如来说非忍辱波罗蜜。若菩萨有我相、人相、众生相、寿者相，即非菩萨。' },
  { num: 15, title: '持经功德分第十五', summary: '若有善男子善女人，初日分以恒河沙等身布施，中日分、后日分亦以恒河沙等身布施，如是无量百千万亿劫以身布施。' },
  { num: 16, title: '能净业障分第十六', summary: '若复有人能受持读诵此经，即为能荷担如来阿耨多罗三藐三菩提。' },
  { num: 17, title: '究竟无我分第十七', summary: '如来昔在燃灯佛所，于法实无所得。若有法如来得阿耨多罗三藐三菩提者，燃灯佛则不与我授记。' },
  { num: 18, title: '一体同观分第十八', summary: '五眼者，如来说非五眼，是名五眼。三千大千世界所有微尘，如来说非微尘，是名微尘。' },
  { num: 19, title: '法界通化分第十九', summary: '若三千大千世界中所有诸须弥山王，如是等七宝聚，有人持用布施。' },
  { num: 20, title: '离色离相分第二十', summary: '佛说具足色身，即非具足色身，是名具足色身。诸相具足，即非具足，是名诸相具足。' },
  { num: 21, title: '非说所说分第二十一', summary: '汝勿谓如来作是念：我当有所说法。莫作是念！何以故？若人言如来有所说法，即为谤佛，不能解我所说故。' },
  { num: 22, title: '无法可得分第二十二', summary: '须菩提意谓：如来如来得阿耨多罗三藐三菩提，如来于无所著、无所得。' },
  { num: 23, title: '净心行善分第二十三', summary: '是法平等，无有高下，是名阿耨多罗三藐三菩提。以无我、无人、无众生、无寿者，修一切善法，则得阿耨多罗三藐三菩提。' },
  { num: 24, title: '福智无比分第二十四', summary: '若人以此七宝满尔所恒河沙数三千大千世界以用布施，得福多不？甚多，世尊！' },
  { num: 25, title: '化无所化分第二十五', summary: '汝等勿谓如来作是念：我当度众生。须菩提！莫作是念！何以故？实无有众生如来度者。' },
  { num: 26, title: '法身非相分第二十六', summary: '若以三十二相观如来者，转轮圣王则是如来。须菩提白佛言：世尊！如我解佛所说义，不应以三十二相观如来。' },
  { num: 27, title: '无断无灭分第二十七', summary: '汝若作是念：如来不以具足相故，得阿耨多罗三藐三菩提。须菩提！莫作是念：如来不以具足相故，得阿耨多罗三藐三菩提。' },
  { num: 28, title: '不受不贪分第二十八', summary: '菩萨与法，不应贪著。何以故？若菩萨贪著法相，即著我相、人相、众生相、寿者相。' },
  { num: 29, title: '威仪寂净分第二十九', summary: '若有人言：如来若来若去、若坐若卧。是人不解我所说义。何以故？如来者，无所从来，亦无所去，故名如来。' },
  { num: 30, title: '一合相理分第三十', summary: '若世界实有者，即是一合相。如来说一合相，即非一合相，是名一合相。' },
  { num: 31, title: '知见不生分第三十一', summary: '若菩萨通达无我法者，如来说名真是菩萨。若菩萨有我相、人相、众生相、寿者相，则非菩萨。' },
  { num: 32, title: '应化非真分第三十二', summary: '一切有为法，如梦幻泡影，如露亦如电，应作如是观。此为全经之总结。' },
];

// 金刚经核心偈颂
const diamondSutraVerses = [
  // 第一章
  { chapter: 1, num: 1, chinese: '如是我闻：一时，佛在舍卫国祇树给孤独园，与大比丘众千二百五十人俱。', english: 'Thus have I heard. At one time the Buddha dwelled in Śrāvastī, in the Jeta Grove, with a great assembly of twelve hundred fifty bhikṣus.', sanskrit: 'Evam mayā śrutam - ekasmin samaye bhagavān śrāvastīyām viharati jetavane anāthapindikasya ārāme mahatā bhikṣusaṃghena sārdham ardhatrayodasaśatibhi bhikṣuśataih.' },
  { chapter: 1, num: 2, chinese: '尔时，世尊食时，着衣持钵，入舍卫大城乞食。于其城中次第乞已，还至本处。饭食讫，收衣钵，洗足已，敷座而坐。', english: 'At mealtime, the World-Honored One put on his robe, took his bowl, and entered the great city of Śrāvastī to beg for food. After finishing his meal and returning, he put away his robe and bowl, washed his feet, and sat down properly.', sanskrit: 'Atha khalu bhagavān bhiksāpātraṃ pragrahītvā śrāvastīṃ prāviśat, tatra piṇḍapātapatteś chānvuśayo bhutvā kālaṃ kālaṃ pindapātaṃ pariyesamāno, gṛham pratyākṛamāṇo bhojito paścād chīvaram ādāya pādim prakkhālvā āsane nisīdati.' },

  // 第二章
  { chapter: 2, num: 1, chinese: '时，长老须菩提在大众中即从座起，偏袒右肩，右膝着地，合掌恭敬而白佛言："希有！世尊！如来善护念诸菩萨，善付嘱诸菩萨。"', english: 'Then Elder Subhūti arose from his seat in the assembly, bared his right shoulder, knelt on his right knee, joined his palms respectfully and addressed the Buddha: "How rare, World-Honored One! The Tathāgata well supports and instructs bodhisattvas."' },
  { chapter: 2, num: 2, chinese: '世尊！善男子、善女人，发阿耨多罗三藐三菩提心，应云何住？云何降伏其心？', english: '"World-Honored One! When good men and women give rise to the mind for unexcelled perfect enlightenment, how should they dwell? How should they subdue their minds?"' },
  { chapter: 2, num: 3, chinese: '佛言："善哉善哉！须菩提！如汝所说，如来善护念诸菩萨，善付嘱诸菩萨。汝今谛听！当为汝说。"', english: 'The Buddha said: "Excellent, excellent! Subhūti! As you say, the Tathāgata well supports and instructs bodhisattvas. Now listen attentively and I will explain to you."' },

  // 第三章
  { chapter: 3, num: 1, chinese: '诸菩萨摩诃萨，应如是降伏其心："所有一切众生之类，若卵生、若胎生、若湿生、若化生，若有色、若无色，若有想、若无想、若非有想非无想，我皆令入无余涅槃而灭度之。"', english: '"All bodhisattvas should subdue their minds thus: "I must liberate all sentient beings—whether born from eggs, from wombs, from moisture, or by transformation; whether having form or formless; whether having thought or without thought, or neither having thought nor without thought—I must cause them all to enter nirvāṇa without remainder and be liberated."' },
  { chapter: 3, num: 2, chinese: '如是灭度无量无数无边众生，实无众生得灭度者。何以故？须菩提！若菩萨有我相、人相、众生相、寿者相，即非菩萨。', english: '"Thus liberating innumerable, limitless sentient beings, yet in reality no sentient beings are liberated. Why? Subhūti! If a bodhisattva has the notion of self, person, sentient being, or life span, they are not a bodhisattva."' },

  // 第四章
  { chapter: 4, num: 1, chinese: '菩萨于法，应无所住，行于布施，所谓不住色布施，不住声、香、味、触、法布施。', english: '"A bodhisattva should dwell nowhere when practicing giving, meaning they should not give while dwelling in forms, sounds, smells, tastes, touches, or dharmas."' },
  { chapter: 4, num: 2, chinese: '须菩提！菩萨应如是布施，不住于相。何以故？若菩萨不住相布施，其福德不可思量。', english: '"Subhūti! A bodhisattva should give thus, without dwelling in appearances. Why? If a bodhisattva gives without dwelling in appearances, their merit is inconceivable."' },
  { chapter: 4, num: 3, chinese: '须菩提！于意云何？东方虚空可思量不？""不也，世尊！""须菩提！南西北方四维上下虚空可思量不？""不也，世尊！"', english: '"Subhūti! What do you think? Is the space in the east measurable?""No, World-Honored One!""Subhūti! Is the space in the south, west, north, and the four intermediate directions, above and below measurable?""No, World-Honored One!"' },
  { chapter: 4, num: 4, chinese: '须菩提！菩萨不住相布施，福德亦复如是不可思量。须菩提！菩萨但应如所教住。', english: '"Subhūti! The merit of a bodhisattva who gives without dwelling in appearances is likewise immeasurable. Subhūti! Bodhisattvas should dwell as taught."' },

  // 第五章
  { chapter: 5, num: 1, chinese: '须菩提！于意云何？可以身相见如来不？""不也，世尊！不可以身相得见如来。何以故？如来说身相，即非身相。"', english: '"Subhūti! What do you think? Can the Tathāgata be seen by bodily marks?""No, World-Honored One! The Tathāgata cannot be seen by bodily marks. Why? What the Tathāgata calls bodily marks are not truly marks."' },
  { chapter: 5, num: 2, chinese: '佛告须菩提："凡所有相，皆是虚妄。若见诸相非相，则见如来。"', english: 'The Buddha told Subhūti: "All appearances are illusory. If you see all appearances as non-appearances, you see the Tathāgata."' },

  // 第六章
  { chapter: 6, num: 1, chinese: '须菩提白佛言："世尊！颇有众生，于未来世，闻说是法，生信心不？"', english: 'Subhūti said to the Buddha: "World-Honored One! Will there be sentient beings who, in future generations, upon hearing this teaching, will give rise to faith?"' },
  { chapter: 6, num: 2, chinese: '佛言："须菩提！彼非众生，非不众生。何以故？须菩提！众生众生者，如来说非众生，是名众生。"', english: 'The Buddha said: "Subhūti! They are neither sentient beings nor non-sentient beings. Why? Subhūti! What the Tathāgata calls sentient beings are not sentient beings; therefore they are called sentient beings."' },

  // 第七章
  { chapter: 7, num: 1, chinese: '须菩提！于意云何？如来得阿耨多罗三藐三菩提耶？如来有所说法耶？"', english: '"Subhūti! What do you think? Did the Tathāgata attain unexcelled perfect enlightenment? Did the Tathāgata expound any teaching?"' },
  { chapter: 7, num: 2, chinese: '须菩提言："如我解佛所说义，无有定法名阿耨多罗三藐三菩提，亦无有定法如来可说。"', english: 'Subhūti said: "As I understand the Buddha\'s meaning, there is no fixed dharma called unexcelled perfect enlightenment, nor is there any fixed dharma the Tathāgata can expound."' },
  { chapter: 7, num: 3, chinese: '佛言："如是如是！须菩提！乃至无有法可得，是名阿耨多罗三藐三菩提。"', english: 'The Buddha said: "So it is, so it is! Subhūti! Even to the point where there is no dharma that can be attained—this is called unexcelled perfect enlightenment."' },

  // 第八章
  { chapter: 8, num: 1, chinese: '须菩提！若菩萨作是念："我当庄严佛土。"是不名菩萨。', english: '"Subhūti! If a bodhisattva thinks: "I should adorn Buddha lands," they are not called a bodhisattva."' },
  { chapter: 8, num: 2, chinese: '何以故？如来说庄严佛土者，即非庄严，是名庄严。', english: '"Why? What the Tathāgata calls adorning Buddha lands is not truly adorning; therefore it is called adorning.' },
  { chapter: 8, num: 3, chinese: '须菩提！若菩萨通达无我法者，如来说名真是菩萨。', english: '"Subhūti! If a bodhisattva understands the dharma of no-self, the Tathāgata calls them truly a bodhisattva."' },

  // 第九章
  { chapter: 9, num: 1, chinese: '须菩提！于意云何？须陀洹能作是念："我得须陀洹道"不？"', english: '"Subhūti! What do you think? Can a stream-enterer think: "I have attained the stage of stream-enterer?"' },
  { chapter: 9, num: 2, chinese: '须菩提言："不也，世尊！何以故？须陀洹名为入流，而无所入，不入色声香味触法，是名须陀洹。"', english: 'Subhūti said: "No, World-Honored One! Why? Stream-enterer means entering the stream, but actually there is nothing to enter—not entering forms, sounds, smells, tastes, touches, or dharmas—therefore called stream-enterer."' },

  // 第十章
  { chapter: 10, num: 1, chinese: '须菩提！于意云何？斯陀含能作是念："我得斯陀含道"不？"', english: '"Subhūti! What do you think? Can a once-returner think: "I have attained the stage of once-returner?"' },
  { chapter: 10, num: 2, chinese: '须菩提言："不也，世尊！何以故？斯陀含名一往来，而实无往来，是名斯陀含。"', english: 'Subhūti said: "No, World-Honored One! Why? Once-returner means returning once, but actually there is no coming and going—therefore called once-returner."' },

  // 第十四章
  { chapter: 14, num: 1, chinese: '尔时，须菩提闻说是经，深解义趣，涕泪悲泣，而白佛言："希有！世尊！佛说如是甚深经典，我从昔来所得慧眼，未曾得闻如是之说。"', english: 'Then Subhūti, hearing this teaching, deeply understood its meaning and wept tears, saying to the Buddha: "How rare! World-Honored One! The Buddha expounds such a profound teaching. Since ancient times, I have never heard such an explanation with my wisdom eye."' },
  { chapter: 14, num: 2, chinese: '须菩提！"佛言："若有善男子、善女人，于此法中，乃至受持四句偈等，为他人说，其福胜彼。"', english: '"Subhūti!" The Buddha said: "If there are good men and women who, in this dharma, receive and uphold even four lines of verse and explain them to others, their merit surpasses that."' },

  // 第三十二章
  { chapter: 32, num: 1, chinese: '一切有为法，如梦幻泡影，如露亦如电，应作如是观。', english: 'All conditioned dharmas are like dreams, illusions, bubbles, and shadows; like dew and lightning—thus should you contemplate them.', sanskrit: 'Sarve saṃskārā gṛdhraprasavāḥ svapnadrśyopamāḥ | Śmaśānagṛhā gṛdhraprasavāḥ viddhi mamṛptikāḥ tathā ||' },
  { chapter: 32, num: 2, chinese: '说是经已，长老须菩提，及诸比丘、比丘尼、优婆塞、优婆夷，一切世间天人阿修罗，闻佛所说，皆大欢喜，信受奉行。', english: 'After the Buddha expounded this sūtra, Elder Subhūti, along with bhikṣus, bhikṣuṇīs, upāsakas, upāsikās, and all the world\'s gods, humans, and asuras, having heard the Buddha\'s teaching, were greatly filled with joy, faithfully accepted, and upheld it.' },
];

// 关键概念
const diamondSutraConcepts = [
  { name: '般若', nameSanskrit: 'Prajñā', nameTibetan: 'ཤེས་རབ་', description: '圆满智慧，能照见诸法实相，为六度之首，成佛之母。' },
  { name: '波罗蜜', nameSanskrit: 'Pāramitā', nameTibetan: 'ཕ་རོལ་ཏ་', description: '度彼岸之行法，六度万行之总称。' },
  { name: '阿耨多罗三藐三菩提', nameSanskrit: 'Anuttarā-samyak-saṃbodhi', nameTibetan: 'བླ་མེད་ཡང་དགའ་བརྒྱ་པའི་བྱང་ཆུབ་', description: '无上正等正觉，佛果之异名。' },
  { name: '四相', nameSanskrit: 'Catvāri nimittāni', nameTibetan: 'རྟེན་བཞི་', description: '我相、人相、众生相、寿者相，为执着之根本。' },
  { name: '无住', nameSanskrit: 'Apratiṣṭhita', nameTibetan: 'མི་གནས་པ་', description: '不执着于任何境相，心无所住而生其心。' },
  { name: '空性', nameSanskrit: 'Śūnyatā', nameTibetan: 'སྟོང་པ་', description: '诸法缘起无自性，体性究竟清净。' },
  { name: '布施', nameSanskrit: 'Dāna', nameTibetan: 'སྦྱིན་པ་', description: '财施、法施、无畏施，为六度之首。' },
  { name: '忍辱', nameSanskrit: 'Kṣānti', nameTibetan: 'བཟོད་པ་', description: '忍受恼辱而不生嗔恨，为六度之一。' },
  { name: '涅槃', nameSanskrit: 'Nirvāṇa', nameTibetan: 'མྱ་ངེས་', description: '远离烦恼与生死轮回的寂静安稳境界。' },
  { name: '有为法', nameSanskrit: 'Saṃskṛta-dharma', nameTibetan: 'འདུས་བྱུང་', description: '因缘和合而生之一切法，无常无我。' },
];

// 课程数据
const diamondSutraCourses = [
  {
    id: 'course-intro',
    title: '《金刚经》入门导读',
    description: '适合初学者的入门课程，系统讲解《金刚经》的基本概念、核心思想和修学方法。',
    coverImage: null,
    teacherId: null,
    level: 'BEGINNER' as const,
    duration: 120,
    isPublished: true,
    lessons: [
      { order: 1, title: '《金刚经》的缘起与传承', content: '介绍《金刚经》的翻译历史、在中国佛教的地位，以及历代祖师的注疏传统。' },
      { order: 2, title: '般若思想概说', content: '讲解般若（智慧）的含义，空性思想的基础，以及为何般若是六度之母。' },
      { order: 3, title: '经文结构分析', content: '分析《金刚经》三分结构：序分、正宗分、流通分，以及三十二分的组织方式。' },
      { order: 4, title: '核心教义（一）：无住生心', content: '深入讲解"应无所住而生其心"这一核心思想，如何在日常生活中实践。' },
      { order: 5, title: '核心教义（二）：凡所有相皆是虚妄', content: '分析"四相"的执着，如何破除对现象的执著。' },
      { order: 6, title: '修行指导：六度万行', content: '六度（布施、持戒、忍辱、精进、禅定、般若）的修学方法与实践要点。' },
    ],
  },
  {
    id: 'course-intermediate',
    title: '《金刚经》精读',
    description: '对《金刚经》三十二分进行逐章讲解，深入理解经文的含义。',
    coverImage: null,
    teacherId: null,
    level: 'INTERMEDIATE' as const,
    duration: 240,
    isPublished: true,
    lessons: [
      { order: 1, title: '第一分：法会因由', content: '详解法会的缘起、地点、参与者，以及佛陀日常行持所示现的法义。' },
      { order: 2, title: '第二分：善现启请', content: '分析须菩提所问的核心问题：发心与降心。' },
      { order: 3, title: '第三分：大乘正宗', content: '讲解"无相布施"和"度无量众生而无众生可度"的深义。' },
      { order: 4, title: '第四至六分：无住与正信', content: '综合讲解无住行施、破除身相执著、生起正信的内容。' },
      { order: 5, title: '第七至十分：法身与净土', content: '讲解"无得无说"、"无我相"、"庄严净土"等重要内容。' },
      { order: 6, title: '第十一至十五分：福德与业障', content: '讲解持经功德、净除业障、离相寂灭等修行方法。' },
      { order: 7, title: '第十六至二十分：福智与法身', content: '讲解能净业障分、究竟无我分、一体同观分等深义。' },
      { order: 8, title: '第二十一至二十五分：无为与化度', content: '讲解非说所说、无法可得、净心行善、福智无比、化无所化等内容。' },
      { order: 9, title: '第二十六至三十分：无断无灭', content: '讲解法身非相、无断无灭、不受不贪、威仪寂净、一合相理。' },
      { order: 10, title: '第三十一至三十二分：知见与总结', content: '讲解知见不生分，以及全经总结的著名偈颂。' },
    ],
  },
];

// 社区帖子示例
/*
const diamondSutraPosts = [
  {
    title: '如何理解"应无所住而生其心"？',
    content: '最近在读《金刚经》，对"应无所住而生其心"这句话很感兴趣。但是在实际生活中，我们应该如何做到"心无所住"呢？比如工作时要专注，这算不算"住"呢？请大家指教。',
    tags: ['无住生心', '修行实践', '疑问'],
  },
  {
    title: '分享我的每日诵读心得',
    content: '每天早晨诵读《金刚经》已经成为我的习惯。经过三个月的坚持，感觉内心平静了许多，对生活的看法也慢慢在变化。推荐大家也试试！',
    tags: ['修行心得', '每日功课', '诵读'],
  },
  {
    title: '《金刚经》中的中观思想',
    content: '最近在学习龙树菩萨的中观思想，发现《金刚经》中有很多中观思想的体现。特别是"凡所有相，皆是虚妄"这句话，完美诠释了中观的缘起性空理论。',
    tags: ['中观', '空性', '佛学理论'],
  },
];
*/

async function seedDiamondSutraData() {
  console.log('开始填充金刚经数据...');

  // 1. 创建经文
  const sutra = await prisma.sutra.upsert({
    where: { slug: 'diamond-sutra' },
    update: {},
    create: {
      title: '金刚般若波罗蜜经',
      titleSanskrit: 'Vajracchedikā Prajñāpāramitā Sūtra',
      titleTibetan: 'རྡོ་རྗེ་ཤེས་རབ་ཀྱི་ཕ་རོལ་ཏ་པའི་མདོ།',
      slug: 'diamond-sutra',
      description: '简称《金刚经》，是大乘佛教般若部的重要经典，由姚秦鸠摩罗什译，共一卷，三十二分。经名取自"般若如金刚，能破坏一切法"之意。',
      order: 1,
    },
  });
  console.log('✓ 经文已创建:', sutra.title);

  // 2. 创建章节
  for (const chapter of diamondSutraChapters) {
    await prisma.chapter.upsert({
      where: {
        sutraId_chapterNum: {
          sutraId: sutra.id,
          chapterNum: chapter.num,
        },
      },
      update: {
        title: chapter.title,
        summary: chapter.summary,
        order: chapter.num,
      },
      create: {
        sutraId: sutra.id,
        chapterNum: chapter.num,
        title: chapter.title,
        summary: chapter.summary,
        order: chapter.num,
      },
    });
  }
  console.log(`✓ 已创建 ${diamondSutraChapters.length} 个章节`);

  // 3. 创建偈颂
  let verseCount = 0;
  for (const verse of diamondSutraVerses) {
    const chapter = await prisma.chapter.findFirst({
      where: {
        sutraId: sutra.id,
        chapterNum: verse.chapter,
      },
    });

    if (chapter) {
      await prisma.verse.upsert({
        where: {
          chapterId_verseNum: {
            chapterId: chapter.id,
            verseNum: verse.num,
          },
        },
        update: {
          chinese: verse.chinese,
          english: verse.english,
          sanskrit: verse.sanskrit,
          aiKeyword: ['经典名句', '核心偈颂'],
        },
        create: {
          chapterId: chapter.id,
          verseNum: verse.num,
          chinese: verse.chinese,
          english: verse.english,
          sanskrit: verse.sanskrit,
          tibetan: null,
          aiKeyword: ['经典名句', '核心偈颂'],
          aiAnalysis: undefined,
          embedding: undefined,
          order: verse.num,
        },
      });
      verseCount++;
    }
  }
  console.log(`✓ 已创建 ${verseCount} 个偈颂`);

  // 4. 创建概念
  for (const concept of diamondSutraConcepts) {
    await prisma.concept.upsert({
      where: { name: concept.name },
      update: {
        nameSanskrit: concept.nameSanskrit,
        nameTibetan: concept.nameTibetan,
        description: concept.description,
      },
      create: {
        name: concept.name,
        nameSanskrit: concept.nameSanskrit,
        nameTibetan: concept.nameTibetan,
        description: concept.description,
        embedding: undefined,
      },
    });
  }
  console.log(`✓ 已创建 ${diamondSutraConcepts.length} 个概念`);

  // 5. 创建课程
  for (const courseData of diamondSutraCourses) {
    const course = await prisma.course.upsert({
      where: { id: courseData.id },
      update: {
        title: courseData.title,
        description: courseData.description,
        coverImage: courseData.coverImage,
        teacherId: courseData.teacherId,
        level: courseData.level,
        duration: courseData.duration,
        isPublished: courseData.isPublished,
        order: 1,
      },
      create: {
        id: courseData.id,
        title: courseData.title,
        description: courseData.description,
        coverImage: courseData.coverImage,
        teacherId: courseData.teacherId,
        level: courseData.level,
        duration: courseData.duration,
        isPublished: courseData.isPublished,
        order: 1,
      },
    });

    // 创建课时
    for (const lessonData of courseData.lessons) {
      await prisma.lesson.upsert({
        where: { id: `${course.id}_${lessonData.order}` },
        update: {
          title: lessonData.title,
          content: lessonData.content,
        },
        create: {
          courseId: course.id,
          order: lessonData.order,
          title: lessonData.title,
          content: lessonData.content,
        },
      });
    }
  }
  console.log(`✓ 已创建 ${diamondSutraCourses.length} 个课程`);

  console.log('数据填充完成！');
}

seedDiamondSutraData()
  .catch((e) => {
    console.error('填充数据时出错:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

export { seedDiamondSutraData };
