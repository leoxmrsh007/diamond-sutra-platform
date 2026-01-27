/// <reference types="node" />
import { config as loadEnv } from 'dotenv'
import { PrismaClient, UserRole, CourseLevel } from '@prisma/client'

loadEnv({ path: '.env.local' })
loadEnv()

const prisma = new PrismaClient()

const chapters: Array<{ num: number; title: string; summary: string }> = [
  { num: 1, title: '法会因由分第一', summary: '佛陀在舍卫国祇树给孤独园示现般若法会。' },
  { num: 2, title: '善现启请分第二', summary: '须菩提请问菩萨应如何发心与降伏其心。' },
  { num: 3, title: '大乘正宗分第三', summary: '宣说菩萨度众生而不住于相的精神。' },
  { num: 4, title: '妙行无住分第四', summary: '提醒修行者行布施时不执著于相。' },
  { num: 5, title: '如理实见分第五', summary: '指出不可以身相得见如来，破除执著。' },
  { num: 6, title: '正信希有分第六', summary: '赞叹未来众生闻经能生正信的功德。' },
  { num: 7, title: '无得无说分第七', summary: '阐述如来所说法皆不可取、不可说。' },
  { num: 8, title: '依法出生分第八', summary: '说明一切诸佛及阿耨多罗三藐三菩提法皆从此经出。' },
  { num: 9, title: '一相无相分第九', summary: '阐述四果圣人皆离相而证，无有定法可得。' },
  { num: 10, title: '庄严净土分第十', summary: '菩萨庄严佛土，应无所住而生其心。' },
  { num: 11, title: '无为福胜分第十一', summary: '受持此经的福德胜过无量七宝布施。' },
  { num: 12, title: '尊重正教分第十二', summary: '此经所在之处即为有佛，应尊重恭敬。' },
  { num: 13, title: '如法受持分第十三', summary: '此经名为《金刚般若波罗蜜》，应如实受持。' },
  { num: 14, title: '离相寂灭分第十四', summary: '以忍辱波罗蜜显现离相寂灭的功夫。' },
  { num: 15, title: '持经功德分第十五', summary: '受持读诵此经的功德无量无边。' },
  { num: 16, title: '能净业障分第十六', summary: '受持此经能消除业障，得无量福德。' },
  { num: 17, title: '究竟无我分第十七', summary: '阐述无我相、人相、众生相、寿者相。' },
  { num: 18, title: '一体同观分第十八', summary: '如来具足五眼，能如实知见一切众生心。' },
  { num: 19, title: '法界通化分第十九', summary: '阐述福德无实，如来所说福德即非福德。' },
  { num: 20, title: '离色离相分第二十', summary: '如来不应以具足色身见，不应以具足诸相见。' },
  { num: 21, title: '非说所说分第二十一', summary: '如来无所说法，说法者无法可说。' },
  { num: 22, title: '无法可得分第二十二', summary: '无有少法可得，是名阿耨多罗三藐三菩提。' },
  { num: 23, title: '净心行善分第二十三', summary: '是法平等，无有高下，是名阿耨多罗三藐三菩提。' },
  { num: 24, title: '福智无比分第二十四', summary: '受持此经的福德胜过以满三千大千世界七宝布施。' },
  { num: 25, title: '化无所化分第二十五', summary: '实无有众生如来度者，若有众生如来度者，如来即有我相。' },
  { num: 26, title: '法身非相分第二十六', summary: '不应以三十二相观如来，如来法身非相。' },
  { num: 27, title: '无断无灭分第二十七', summary: '发阿耨多罗三藐三菩提心者，于法不说断灭相。' },
  { num: 28, title: '不受不贪分第二十八', summary: '菩萨所作福德，不应贪著，是故说不受福德。' },
  { num: 29, title: '威仪寂静分第二十九', summary: '如来者，无所从来，亦无所去，故名如来。' },
  { num: 30, title: '一合理相分第三十', summary: '阐述三千大千世界即非世界，是名世界。' },
  { num: 31, title: '知见不生分第三十一', summary: '发阿耨多罗三藐三菩提心者，于一切法应如是知、如是见、如是信解。' },
  { num: 32, title: '应化非真分第三十二', summary: '总结一切有为法如梦幻泡影，应作如是观。' },
]

const verses: Array<{
  chapter: number
  verseNum: number
  chinese: string
  sanskrit?: string
  english?: string
  keywords: string[]
}> = [
  // === 第1分 法会因由分 ===
  {
    chapter: 1,
    verseNum: 1,
    chinese: '如是我闻：一时，佛在舍卫国祇树给孤独园，与大比丘众千二百五十人俱。',
    sanskrit: 'Evam mayā śrutam ekasmin samaye bhagavān śrāvastīṃ viharati...',
    english: 'Thus have I heard. At one time the Buddha dwelt in Śrāvastī, in the Jeta Grove of Anāthapiṇḍada, together with a great assembly of twelve hundred and fifty bhikṣus.',
    keywords: ['如是我闻', '舍卫国', '祇树给孤独园'],
  },
  {
    chapter: 1,
    verseNum: 2,
    chinese: '尔时，世尊食时，着衣持钵，入舍卫大城乞食。于其城中次第乞已，还至本处。饭食讫，收衣钵，洗足已，敷座而坐。',
    english: 'At that time, when it was mealtime, the World-Honored One donned his robe, took up his bowl, and entered the great city of Śrāvastī to beg for food in order. After returning to his place, he finished his meal, put away robe and bowl, washed his feet, and sat properly.',
    keywords: ['乞食', '次第乞', '敷座而坐'],
  },
  // === 第2分 善现启请分 ===
  {
    chapter: 2,
    verseNum: 1,
    chinese: '时，长老须菩提在大众中即从座起，偏袒右肩，右膝着地，合掌恭敬而白佛言：希有世尊，如来善护念诸菩萨，善付嘱诸菩萨。',
    english: 'Then Elder Subhūti arose from his seat in the assembly, bared his right shoulder, knelt on his right knee, joined his palms respectfully, and addressed the Buddha: Rare, World-Honored One! The Tathāgata well protects and instructs all bodhisattvas.',
    keywords: ['须菩提', '善护念', '善付嘱'],
  },
  {
    chapter: 2,
    verseNum: 2,
    chinese: '世尊，善男子善女人，发阿耨多罗三藐三菩提心，应云何住，云何降伏其心？',
    english: 'World-Honored One, when good men and women give rise to the mind of supreme enlightenment, upon what should they rely? How should they subdue their minds?',
    keywords: ['阿耨多罗三藐三菩提', '降伏其心'],
  },
  {
    chapter: 2,
    verseNum: 3,
    chinese: '佛言：善哉善哉。须菩提，如汝所说，如来善护念诸菩萨，善付嘱诸菩萨。汝今谛听，当为汝说。',
    english: 'The Buddha said: Excellent, excellent, Subhūti. As you say, the Tathāgata well protects and instructs bodhisattvas. Listen attentively now, and I will explain for you.',
    keywords: ['谛听', '善哉'],
  },
  {
    chapter: 2,
    verseNum: 4,
    chinese: '善男子善女人，发阿耨多罗三藐三菩提心，应如是住，如是降伏其心：所有一切众生之类，若卵生、若胎生、若湿生、若化生，若有色、若无色，若有想、若无想、若非有想非无想，我皆令入无余涅槃而灭度之。',
    english: 'Good men and women who give rise to the mind of supreme enlightenment should thus abide and thus subdue their minds: They must lead all beings of every kind—whether born from eggs, wombs, moisture, or transformation; whether with form or without; whether with thought, without thought, or neither with nor without thought—into the remainderless nirvana.',
    keywords: ['四生', '无余涅槃', '灭度'],
  },
  {
    chapter: 2,
    verseNum: 5,
    chinese: '如是灭度无量无数无边众生，实无众生得灭度者。何以故？须菩提，若菩萨有我相、人相、众生相、寿者相，即非菩萨。',
    english: 'Thus liberating immeasurable, countless, boundless beings, yet in reality no being is liberated. Why? Subhūti, if a bodhisattva has the perception of a self, a person, a being, or a life, they are not a bodhisattva.',
    keywords: ['我相', '人相', '众生相', '寿者相'],
  },
  // === 第3分 大乘正宗分 ===
  {
    chapter: 3,
    verseNum: 1,
    chinese: '复次，须菩提，菩萨于法，应无所住，行于布施，所谓不住色布施，不住声香味触法布施。',
    english: 'Furthermore, Subhūti, a bodhisattva should dwell nowhere when practicing giving, that is, give without dwelling in forms, sounds, smells, tastes, tactile objects, or dharmas.',
    keywords: ['无所住', '布施', '六尘'],
  },
  {
    chapter: 3,
    verseNum: 2,
    chinese: '须菩提，菩萨应如是布施，不住于相。何以故？若菩萨不住相布施，其福德不可思量。',
    english: 'Subhūti, a bodhisattva should give thus, without dwelling in appearances. Why? If a bodhisattva gives without dwelling in appearances, their merit is immeasurable.',
    keywords: '不住相布施',
  },
  {
    chapter: 3,
    verseNum: 3,
    chinese: '须菩提，于意云何？东方虚空可思量不？不也，世尊。须菩提，南西北方四维上下虚空可思量不？不也，世尊。',
    english: 'Subhūti, what do you think? Is the space in the east measurable? No, World-Honored One. Is the space in the south, west, north, and four intermediate directions, up and down, measurable? No, World-Honored One.',
    keywords: ['虚空', '思量'],
  },
  {
    chapter: 3,
    verseNum: 4,
    chinese: '须菩提，菩萨无住相布施，福德亦复如是不可思量。须菩提，菩萨但应如所教住。',
    english: 'Subhūti, the merit of a bodhisattva who gives without dwelling in appearances is likewise immeasurable. Subhūti, a bodhisattva should abide according to this teaching.',
    keywords: ['无住相', '如所教住'],
  },
  // === 第4分 妙行无住分 ===
  {
    chapter: 4,
    verseNum: 1,
    chinese: '须菩提，于意云何？可以身相见如来不？不也，世尊。不可以身相得见如来。何以故？如来说身相，即非身相。',
    english: 'Subhūti, what do you think? Can the Tathāgata be seen by bodily marks? No, World-Honored One. The Tathāgata cannot be seen by bodily marks. Why? The bodily marks the Tathāgata speaks of are not bodily marks.',
    keywords: ['身相', '见如来'],
  },
  {
    chapter: 4,
    verseNum: 2,
    chinese: '佛告须菩提：凡所有相，皆是虚妄。若见诸相非相，则见如来。',
    english: 'The Buddha told Subhūti: All appearances are illusory. If one sees all appearances as non-appearances, one sees the Tathāgata.',
    keywords: ['凡所有相', '虚妄', '见诸相非相'],
  },
  // === 第5分 如理实见分 ===
  {
    chapter: 5,
    verseNum: 1,
    chinese: '须菩提，于意云何？可以身相见如来不？不也，世尊。不可以身相得见如来。何以故？如来说身相，即非身相，是名身相。',
    english: 'Subhūti, what do you think? Can one see the Tathāgata by bodily marks? No, World-Honored One. One cannot see the Tathāgata by bodily marks. Why? What the Tathāgata calls bodily marks are not bodily marks, therefore they are called bodily marks.',
    keywords: ['身相', '即非身相', '是名身相'],
  },
  // === 第6分 正信希有分 ===
  {
    chapter: 6,
    verseNum: 1,
    chinese: '须菩提，白佛言：世尊颇有众生，于未来世，闻说是法，生信心不？佛言：须菩提，彼非众生，非不众生。何以故？须菩提，众生众生者，如来说非众生，是名众生。',
    english: 'Subhūti said to the Buddha: World-Honored One, will there be beings who, in future times, upon hearing this teaching, will give rise to faith? The Buddha said: Subhūti, they are neither beings nor not beings. Why? Beings, beings—the Tathāgata says they are not beings, therefore they are called beings.',
    keywords: ['正信', '非众生', '是名众生'],
  },
  // === 第7分 无得无说分 ===
  {
    chapter: 7,
    verseNum: 1,
    chinese: '须菩提，于意云何？如来得阿耨多罗三藐三菩提耶？如来有所说法耶？须菩提言：如我解佛所说义，无有定法名阿耨多罗三藐三菩提，亦无有定法如来可说。',
    english: 'Subhūti, what do you think? Did the Tathāgata attain supreme enlightenment? Does the Tathāgata have any teaching to expound? Subhūti said: As I understand the meaning of the Buddha\'s teaching, there is no fixed dharma called supreme enlightenment, nor is there any fixed dharma the Tathāgata can expound.',
    keywords: ['无有定法', '阿耨多罗三藐三菩提'],
  },
  {
    chapter: 7,
    verseNum: 2,
    chinese: '何以故？如来所说法，皆不可取、不可说、非法、非非法。所以者何？一切贤圣，皆以无为法而有差别。',
    english: 'Why? The teaching expounded by the Tathāgata cannot be grasped, cannot be spoken, is neither dharma nor non-dharma. Why? All sages and saints appear through the unconditioned dharma, yet there are differences.',
    keywords: ['不可取', '不可说', '无为法'],
  },
  // === 第8分 依法出生分 ===
  {
    chapter: 8,
    verseNum: 1,
    chinese: '须菩提，于意云何？若人满三千大千世界七宝持用布施，是人所得福德，宁为多不？须菩提言：甚多，世尊。何以故？是福德即非福德性，是故如来说福德多。',
    english: 'Subhūti, what do you think? If someone filled three thousand great thousand worlds with the seven treasures and gave them as gift, would the merit obtained be much? Subhūti said: Very much, World-Honored One. Why? Such merit is not the nature of merit, therefore the Tathāgata speaks of much merit.',
    keywords: ['七宝', '布施', '福德性'],
  },
  {
    chapter: 8,
    verseNum: 2,
    chinese: '若复有人，于此经中受持乃至四句偈等，为他人说，其福胜彼。何以故？须菩提，一切诸佛，及诸佛阿耨多罗三藐三菩提法，皆从此经出。',
    english: 'If furthermore someone upholds even four verses of this sutra and explains them to others, their merit surpasses that. Why? Subhūti, all buddhas and the supreme enlightenment of all buddhas are born from this sutra.',
    keywords: ['受持', '四句偈', '皆从此经出'],
  },
  // === 第9分 一相无相分 ===
  {
    chapter: 9,
    verseNum: 1,
    chinese: '须菩提，于意云何？须陀洹能作是念，我得须陀洹果不？须菩提言：不也，世尊。何以故？须陀洹名为入流，而无所入，不入色声香味触法，是名须陀洹。',
    english: 'Subhūti, what do you think? Can a stream-enterer think "I have attained the fruit of stream-entry"? Subhūti said: No, World-Honored One. Why? Stream-entry is called entering the stream, yet there is nothing entered—no entering into forms, sounds, smells, tastes, tactile objects, or dharmas, therefore it is called stream-entry.',
    keywords: ['须陀洹', '入流', '无所入'],
  },
  {
    chapter: 9,
    verseNum: 2,
    chinese: '须菩提，于意云何？斯陀含能作是念，我得斯陀含果不？须菩提言：不也，世尊。何以故？斯陀含名一往来，而实无往来，是名斯陀含。',
    english: 'Subhūti, what do you think? Can a once-returner think "I have attained the fruit of once-returning"? Subhūti said: No, World-Honored One. Why? Once-returning is called coming and going once, yet in reality there is no coming and going, therefore it is called once-returning.',
    keywords: ['斯陀含', '一往来'],
  },
  {
    chapter: 9,
    verseNum: 3,
    chinese: '须菩提，于意云何？阿那含能作是念，我得阿那含果不？须菩提言：不也，世尊。何以故？阿那含名为不来，而实无不来，是故名阿那含。',
    english: 'Subhūti, what do you think? Can a non-returner think "I have attained the fruit of non-returning"? Subhūti said: No, World-Honored One. Why? Non-returning is called not coming, yet in reality there is no not coming, therefore it is called non-returning.',
    keywords: ['阿那含', '不来'],
  },
  {
    chapter: 9,
    verseNum: 4,
    chinese: '须菩提，于意云何？阿罗汉能作是念，我得阿罗汉道不？须菩提言：不也，世尊。何以故？实无有法名阿罗汉。',
    english: 'Subhūti, what do you think? Can an arhat think "I have attained the arhat path"? Subhūti said: No, World-Honored One. Why? In reality there is no dharma called arhat.',
    keywords: ['阿罗汉', '无有法'],
  },
  // === 第10分 庄严净土分 ===
  {
    chapter: 10,
    verseNum: 1,
    chinese: '佛告须菩提：于意云何？如来昔在然灯佛所，于法有所得不？不也，世尊。如来在然灯佛所，于法实无所得。',
    english: 'The Buddha asked Subhūti: What do you think? When the Tathāgata was with Dipamkara Buddha in the past, did he obtain any dharma? No, World-Honored One. When the Tathāgata was with Dipamkara Buddha, he truly obtained no dharma.',
    keywords: ['然灯佛', '无所得'],
  },
  {
    chapter: 10,
    verseNum: 2,
    chinese: '须菩提，于意云何？菩萨庄严佛土不？不也，世尊。何以故？庄严佛土者，即非庄严，是名庄严。',
    english: 'Subhūti, what do you think? Do bodhisattvas adorn buddha-lands? No, World-Honored One. Why? Adorning buddha-lands is not adorning, therefore it is called adorning.',
    keywords: ['庄严佛土', '即非庄严', '是名庄严'],
  },
  {
    chapter: 10,
    verseNum: 3,
    chinese: '是故须菩提，诸菩萨摩诃萨，应如是生清净心：不应住色生心，不应住声香味触法生心，应无所住而生其心。',
    english: 'Therefore Subhūti, all great bodhisattvas should thus give rise to a pure mind: they should not give rise to a mind dwelling in forms, sounds, smells, tastes, tactile objects, or dharmas; they should give rise to a mind that dwells nowhere.',
    keywords: ['清净心', '应无所住而生其心'],
  },
  // === 第11分 无为福胜分 ===
  {
    chapter: 11,
    verseNum: 1,
    chinese: '须菩提，若人有身大如须弥山王，于意云何？是身为大不？须菩提言：甚大，世尊。何以故？佛说非身，是名大身。',
    english: 'Subhūti, suppose someone had a body as large as Mount Sumeru, what do you think? Would that body be large? Subhūti said: Very large, World-Honored One. Why? The Buddha says it is not a body, therefore it is called a large body.',
    keywords: ['须弥山王', '非身', '大身'],
  },
  // === 第12分 尊重正教分 ===
  {
    chapter: 12,
    verseNum: 1,
    chinese: '须菩提，如恒河中所有沙数，如是沙等恒河，于意云何？是诸恒河沙，宁为多不？须菩提言：甚多，世尊。',
    english: 'Subhūti, suppose there were as many Ganges rivers as the sands in the Ganges River, what do you think? Would the sands of all those Ganges rivers be many? Subhūti said: Very many, World-Honored One.',
    keywords: ['恒河沙', '甚多'],
  },
  {
    chapter: 12,
    verseNum: 2,
    chinese: '但诸恒河尚多无数，何况其沙。须菩提，我今实言告汝：若有善男子善女人，以七宝满尔所恒河沙数三千大千世界，以用布施，得福多不？甚多，世尊。',
    english: 'But just the Ganges rivers are innumerable, let alone their sands. Subhūti, I now tell you truly: if good men and women filled three thousand great thousand worlds as numerous as the sands of those Ganges rivers with the seven treasures and gave them as gift, would the merit be much? Very much, World-Honored One.',
    keywords: ['七宝', '布施'],
  },
  // === 第13分 如法受持分 ===
  {
    chapter: 13,
    verseNum: 1,
    chinese: '尔时须菩提白佛言：世尊，当何名此经？我等云何奉持？佛告须菩提：是经名为《金刚般若波罗蜜》。以是名字，汝当奉持。',
    english: 'Then Subhūti said to the Buddha: World-Honored One, what should this sutra be called? How should we uphold it? The Buddha told Subhūti: This sutra is called The Diamond Prajñā Pāramitā Sutra. You should uphold it by this name.',
    keywords: ['金刚般若波罗蜜', '奉持'],
  },
  {
    chapter: 13,
    verseNum: 2,
    chinese: '所以者何？须菩提，佛说般若波罗蜜，即非般若波罗蜜，是名般若波罗蜜。',
    english: 'Why? Subhūti, what the Buddha calls prajñā pāramitā is not prajñā pāramitā, therefore it is called prajñā pāramitā.',
    keywords: ['般若波罗蜜', '即非', '是名'],
  },
  // === 第14分 离相寂灭分 ===
  {
    chapter: 14,
    verseNum: 1,
    chinese: '须菩提，忍辱波罗蜜，如来说非忍辱波罗蜜，是名忍辱波罗蜜。何以故？须菩提，如我昔为歌利王割截身体，我于尔时，无我相、无人相、无众生相、无寿者相。',
    english: 'Subhūti, the perfection of patience—the Tathāgata says it is not the perfection of patience, therefore it is called the perfection of patience. Why? Subhūti, when in the past King Kali cut my body to pieces, at that time I had no perception of self, person, being, or life.',
    keywords: ['忍辱波罗蜜', '歌利王', '四相皆无'],
  },
  {
    chapter: 14,
    verseNum: 2,
    chinese: '何以故？我于往昔节节支解时，若有我相、人相、众生相、寿者相，应生嗔恨。',
    english: 'Why? When I was dismembered joint by joint in the past, if I had had the perception of self, person, being, or life, anger and hatred would have arisen.',
    keywords: ['嗔恨', '离相'],
  },
  // === 第15分 持经功德分 ===
  {
    chapter: 15,
    verseNum: 1,
    chinese: '须菩提，若有善男子善女人，初日分以恒河沙等身布施，中日分复以恒河沙等身布施，后日分亦以恒河沙等身布施，如是无量百千万亿劫以身布施。',
    english: 'Subhūti, if good men and women gave their bodies as many as the sands of the Ganges as gift in the first part of the day, again as many as the sands of the Ganges in the middle part of the day, and again as many as the sands of the Ganges in the last part of the day, thus giving their bodies as gift for countless hundreds of thousands of millions of kalpas.',
    keywords: ['初日分', '中日分', '后日分', '以身布施'],
  },
  {
    chapter: 15,
    verseNum: 2,
    chinese: '若复有人，闻此经典，信心不逆，其福胜彼，何况书写受持读诵为人解说。',
    english: 'If someone hears this sutra and has unwavering faith, their merit surpasses that, let alone writing, upholding, reciting it, and explaining it to others.',
    keywords: ['信心不逆', '书写受持', '读诵解说'],
  },
  // === 第16分 能净业障分 ===
  {
    chapter: 16,
    verseNum: 1,
    chinese: '复次须菩提，若善男子善女人，受持读诵此经，若为人轻贱，是人先世罪业，应堕恶道。以今世人轻贱故，先世罪业，即为消灭，当得阿耨多罗三藐三菩提。',
    english: 'Furthermore Subhūti, if good men and women uphold and recite this sutra and are treated lightly by others, those persons\' evil karma from past lives should have caused them to fall into evil paths. Because they are treated lightly by people in this life, their evil karma from past lives is extinguished, and they will attain supreme enlightenment.',
    keywords: ['轻贱', '先世罪业', '恶道', '消灭'],
  },
  // === 第17分 究竟无我分 ===
  {
    chapter: 17,
    verseNum: 1,
    chinese: '须菩提，于意云何？如来于燃灯佛所，有法得阿耨多罗三藐三菩提不？不也，世尊。如来于燃灯佛所，无有法得阿耨多罗三藐三菩提。',
    english: 'Subhūti, what do you think? Did the Tathāgata obtain any dharma of supreme enlightenment from Dipamkara Buddha? No, World-Honored One. The Tathāgata obtained no dharma of supreme enlightenment from Dipamkara Buddha.',
    keywords: ['燃灯佛', '无有法得'],
  },
  {
    chapter: 17,
    verseNum: 2,
    chinese: '佛言：如是如是。须菩提，实无有法，如来得阿耨多罗三藐三菩提。',
    english: 'The Buddha said: So it is, so it is. Subhūti, in reality there is no dharma by which the Tathāgata attained supreme enlightenment.',
    keywords: ['实无有法'],
  },
  // === 第18分 一体同观分 ===
  {
    chapter: 18,
    verseNum: 1,
    chinese: '须菩提，于意云何？如来有肉眼不？如是，世尊，如来有肉眼。须菩提，于意云何？如来有天眼不？如是，世尊，如来有天眼。',
    english: 'Subhūti, what do you think? Does the Tathāgata have physical eyes? Yes, World-Honored One, the Tathāgata has physical eyes. Subhūti, what do you think? Does the Tathāgata have heavenly eyes? Yes, World-Honored One, the Tathāgata has heavenly eyes.',
    keywords: ['五眼', '肉眼', '天眼'],
  },
  {
    chapter: 18,
    verseNum: 2,
    chinese: '须菩提，于意云何？如来有慧眼不？如是，世尊，如来有慧眼。须菩提，于意云何？如来有法眼不？如是，世尊，如来有法眼。须菩提，于意云何？如来有佛眼不？如是，世尊，如来有佛眼。',
    english: 'Subhūti, what do you think? Does the Tathāgata have wisdom eyes? Yes, World-Honored One, the Tathāgata has wisdom eyes. Subhūti, what do you think? Does the Tathāgata have dharma eyes? Yes, World-Honored One, the Tathāgata has dharma eyes. Subhūti, what do you think? Does the Tathāgata have buddha eyes? Yes, World-Honored One, the Tathāgata has buddha eyes.',
    keywords: ['五眼', '慧眼', '法眼', '佛眼'],
  },
  // === 第19分 法界通化分 ===
  {
    chapter: 19,
    verseNum: 1,
    chinese: '须菩提，于意云何？若有人满三千大千世界七宝持用布施，是人以是因缘，得福多不？如是，世尊，此人以是因缘，得福甚多。',
    english: 'Subhūti, what do you think? If someone filled three thousand great thousand worlds with the seven treasures and gave them as gift, would this person, through this cause, obtain much merit? Yes, World-Honored One, this person, through this cause, would obtain very much merit.',
    keywords: ['七宝布施', '因缘', '福德'],
  },
  {
    chapter: 19,
    verseNum: 2,
    chinese: '须菩提，若福德有实，如来不说得福德多。以福德无故，如来说得福德多。',
    english: 'Subhūti, if merit had reality, the Tathāgata would not speak of obtaining much merit. Because merit has no reality, the Tathāgata speaks of obtaining much merit.',
    keywords: ['福德无实', '得福德多'],
  },
  // === 第20分 离色离相分 ===
  {
    chapter: 20,
    verseNum: 1,
    chinese: '须菩提，于意云何？佛可以具足色身见不？不也，世尊。如来不应以具足色身见。何以故？如来说具足色身，即非具足色身，是名具足色身。',
    english: 'Subhūti, what do you think? Can the Buddha be seen by his complete physical body? No, World-Honored One. The Tathāgata should not be seen by his complete physical body. Why? What the Tathāgata calls a complete physical body is not a complete physical body, therefore it is called a complete physical body.',
    keywords: ['具足色身', '非具足色身'],
  },
  {
    chapter: 20,
    verseNum: 2,
    chinese: '须菩提，于意云何？如来可以具足诸相见不？不也，世尊。如来不应以具足诸相见。何以故？如来说诸相具足，即非具足，是名诸相具足。',
    english: 'Subhūti, what do you think? Can the Tathāgata be seen by his complete marks? No, World-Honored One. The Tathāgata should not be seen by his complete marks. Why? What the Tathāgata calls complete marks is not complete, therefore it is called complete marks.',
    keywords: ['具足诸相', '三十二相'],
  },
  // === 第21分 非说所说分 ===
  {
    chapter: 21,
    verseNum: 1,
    chinese: '须菩提，汝勿谓如来作是念：我当有所说法。莫作是念。何以故？若人言如来有所说法，即为谤佛，不能解我所说故。',
    english: 'Subhūti, do not say the Tathāgata has this thought: "I should expound some teaching." Do not think this. Why? If someone says the Tathāgata expounds some teaching, they slander the Buddha, because they do not understand what I say.',
    keywords: ['有所说法', '谤佛'],
  },
  {
    chapter: 21,
    verseNum: 2,
    chinese: '须菩提，说法者，无法可说，是名说法。',
    english: 'Subhūti, one who expounds the teaching has no dharma to expound, therefore it is called expounding the teaching.',
    keywords: ['无法可说', '是名说法'],
  },
  // === 第22分 无法可得分 ===
  {
    chapter: 22,
    verseNum: 1,
    chinese: '须菩提，白佛言：世尊，佛得阿耨多罗三藐三菩提，为无所得耶？佛言：如是如是。须菩提，我于阿耨多罗三藐三菩提，乃至无有少法可得，是名阿耨多罗三藐三菩提。',
    english: 'Subhūti said to the Buddha: World-Honored One, did the Buddha attain supreme enlightenment and obtain nothing? The Buddha said: So it is, so it is. Subhūti, regarding supreme enlightenment, I have not obtained even the slightest dharma, therefore it is called supreme enlightenment.',
    keywords: ['无有少法可得', '无所得'],
  },
  // === 第23分 净心行善分 ===
  {
    chapter: 23,
    verseNum: 1,
    chinese: '复次须菩提，是法平等，无有高下，是名阿耨多罗三藐三菩提。以无我、无人、无众生、无寿者，修一切善法，即得阿耨多罗三藐三菩提。',
    english: 'Furthermore Subhūti, this dharma is equal, with no high or low, therefore it is called supreme enlightenment. Practicing all good dharmas without self, person, being, or life, one attains supreme enlightenment.',
    keywords: ['是法平等', '无有高下', '修一切善法'],
  },
  {
    chapter: 23,
    verseNum: 2,
    chinese: '须菩提，所言善法者，如来说即非善法，是名善法。',
    english: 'Subhūti, what are called good dharmas—the Tathāgata says they are not good dharmas, therefore they are called good dharmas.',
    keywords: ['善法', '即非善法', '是名善法'],
  },
  // === 第24分 福智无比分 ===
  {
    chapter: 24,
    verseNum: 1,
    chinese: '须菩提，若三千大千世界中，所有诸须弥山王，如是等七宝聚，有人持用布施。若人以此般若波罗蜜经，乃至四句偈等，受持读诵，为他人说，于前福德，百分不及一，百千万亿分，乃至算数譬喻所不能及。',
    english: 'Subhūti, if in three thousand great thousand worlds, all Mount Sumeru kings were accumulated as seven treasures and someone gave them as gift. If someone upheld, recited this Prajñā Pāramitā Sutra, even four verses, and explained them to others, the former merit, in percentage, would not equal one hundredth, one hundred thousand millionth, indeed cannot be compared by calculation or analogy.',
    keywords: ['七宝聚', '四句偈', '百分不及一'],
  },
  // === 第25分 化无所化分 ===
  {
    chapter: 25,
    verseNum: 1,
    chinese: '须菩提，汝等勿谓如来作是念：我当度众生。须菩提，莫作是念。何以故？实无有众生如来度者。若有众生如来度者，如来即有我相、人相、众生相、寿者相。',
    english: 'Subhūti, do not say the Tathāgata has this thought: "I should liberate beings." Subhūti, do not think this. Why? In reality there are no beings the Tathāgata liberates. If there were beings the Tathāgata liberates, the Tathāgata would have the perception of self, person, being, and life.',
    keywords: ['度众生', '实无有众生', '四相'],
  },
  {
    chapter: 25,
    verseNum: 2,
    chinese: '须菩提，如来说有我者，即非有我，而凡夫之人，以为有我。须菩提，凡夫者，如来说即非凡夫，是名凡夫。',
    english: 'Subhūti, when the Tathāgata speaks of a self, there is actually no self, but ordinary people take there to be a self. Subhūti, ordinary people—the Tathāgata says they are not ordinary people, therefore they are called ordinary people.',
    keywords: ['有我', '凡夫', '即非凡夫'],
  },
  // === 第26分 法身非相分 ===
  {
    chapter: 26,
    verseNum: 1,
    chinese: '须菩提，于意云何？可以三十二相观如来不？须菩提言：如是如是，以三十二相观如来。',
    english: 'Subhūti, what do you think? Can one perceive the Tathāgata by the thirty-two marks? Subhūti said: Yes, yes, one can perceive the Tathāgata by the thirty-two marks.',
    keywords: ['三十二相', '观如来'],
  },
  {
    chapter: 26,
    verseNum: 2,
    chinese: '佛言：须菩提，若以三十二相观如来者，转轮圣王即是如来。须菩提白佛言：世尊，如我解佛所说义，不应以三十二相观如来。',
    english: 'The Buddha said: Subhūti, if one perceives the Tathāgata by the thirty-two marks, then a wheel-turning king would be the Tathāgata. Subhūti said to the Buddha: World-Honored One, as I understand the meaning of the Buddha\'s teaching, one should not perceive the Tathāgata by the thirty-two marks.',
    keywords: ['转轮圣王', '不应以三十二相'],
  },
  // === 第27分 无断无灭分 ===
  {
    chapter: 27,
    verseNum: 1,
    chinese: '须菩提，汝若作是念：如来不以具足相故，得阿耨多罗三藐三菩提。须菩提，莫作是念：如来不以具足相故，得阿耨多罗三藐三菩提。',
    english: 'Subhūti, if you think: The Tathāgata did not attain supreme enlightenment because of complete marks. Subhūti, do not think: The Tathāgata did not attain supreme enlightenment because of complete marks.',
    keywords: ['具足相', '不以具足相'],
  },
  {
    chapter: 27,
    verseNum: 2,
    chinese: '须菩提，汝若作是念：发阿耨多罗三藐三菩提心者，说诸法断灭相。莫作是念。何以故？发阿耨多罗三藐三菩提心者，于法不说断灭相。',
    english: 'Subhūti, if you think: Those who give rise to the mind of supreme enlightenment speak of the extinction of all dharmas. Do not think this. Why? Those who give rise to the mind of supreme enlightenment do not speak of the extinction of dharmas.',
    keywords: ['断灭相', '不说断灭'],
  },
  // === 第28分 不受不贪分 ===
  {
    chapter: 28,
    verseNum: 1,
    chinese: '须菩提，若菩萨以满恒河沙等世界七宝持用布施。若复有人，知一切法无我，得成于忍，此菩萨得前菩萨福德最多。',
    english: 'Subhūti, if a bodhisattva gave as gift the seven treasures filling worlds as numerous as the sands of the Ganges. If furthermore someone realized all dharmas are without self and attained acceptance of this, this bodhisattva\'s merit would exceed that of the former bodhisattva.',
    keywords: ['恒河沙等世界', '一切法无我', '得成于忍'],
  },
  {
    chapter: 28,
    verseNum: 2,
    chinese: '何以故？须菩提，诸菩萨不受福德故。须菩提白佛言：世尊，云何菩萨不受福德？须菩提，菩萨所作福德，不应贪著，是故说不受福德。',
    english: 'Why? Subhūti, bodhisattvas do not receive merit. Subhūti said to the Buddha: World-Honored One, why do bodhisattvas not receive merit? Subhūti, bodhisattvas should not be attached to the merit they create, therefore it is said they do not receive merit.',
    keywords: ['不受福德', '不应贪著'],
  },
  // === 第29分 威仪寂静分 ===
  {
    chapter: 29,
    verseNum: 1,
    chinese: '须菩提，若有人言：如来若来若去、若坐若卧。是人不解我所说义。何以故？如来者，无所从来，亦无所去，故名如来。',
    english: 'Subhūti, if someone says: The Tathāgata comes, goes, sits, or lies down. This person does not understand the meaning of my teaching. Why? Tathāgata means one who comes from nowhere and goes nowhere, therefore called Tathāgata.',
    keywords: ['若来若去', '无所从来', '亦无所去'],
  },
  // === 第30分 一合理相分 ===
  {
    chapter: 30,
    verseNum: 1,
    chinese: '须菩提，若善男子善女人，以三千大千世界碎为微尘，于意云何？是微尘众，宁为多不？须菩提言：甚多，世尊。',
    english: 'Subhūti, if good men and women crushed three thousand great thousand worlds into fine dust particles, what do you think? Would those dust particles be many? Subhūti said: Very many, World-Honored One.',
    keywords: ['碎为微尘', '微尘众'],
  },
  {
    chapter: 30,
    verseNum: 2,
    chinese: '何以故？若是微尘众实有者，佛即不说是微尘众。所以者何？佛说微尘众，即非微尘众，是名微尘众。',
    english: 'Why? If those dust particles had reality, the Buddha would not speak of them as dust particles. Why? What the Buddha calls dust particles is not dust particles, therefore they are called dust particles.',
    keywords: ['微尘众', '即非微尘众'],
  },
  {
    chapter: 30,
    verseNum: 3,
    chinese: '世尊，如来所说三千大千世界，即非世界，是名世界。何以故？若世界实有者，即是一合相。如来说一合相，即非一合相，是名一合相。',
    english: 'World-Honored One, what the Tathāgata calls the three thousand great thousand worlds is not a world, therefore it is called a world. Why? If the world had reality, it would be a single aggregate combination. What the Tathāgata calls a single aggregate combination is not a single aggregate combination, therefore it is called a single aggregate combination.',
    keywords: ['一合相', '即非一合相'],
  },
  // === 第31分 知见不生分 ===
  {
    chapter: 31,
    verseNum: 1,
    chinese: '须菩提，若人言：佛说我见、人见、众生见、寿者见。须菩提，于意云何？是人解我所说义不？不也，世尊。是人不解如来所说义。',
    english: 'Subhūti, if someone says: The Buddha speaks of self-view, person-view, being-view, life-view. Subhūti, what do you think? Does this person understand the meaning of my teaching? No, World-Honored One. This person does not understand the meaning of the Tathāgata\'s teaching.',
    keywords: ['我见', '人见', '众生见', '寿者见'],
  },
  {
    chapter: 31,
    verseNum: 2,
    chinese: '何以故？世尊说我见、人见、众生见、寿者见，即非我见、人见、众生见、寿者见，是名我见、人见、众生见、寿者见。',
    english: 'Why? What the World-Honored One calls self-view, person-view, being-view, life-view is not self-view, person-view, being-view, life-view, therefore it is called self-view, person-view, being-view, life-view.',
    keywords: ['四见', '即非四见'],
  },
  {
    chapter: 31,
    verseNum: 3,
    chinese: '须菩提，发阿耨多罗三藐三菩提心者，于一切法，应如是知，如是见，如是信解，不生法相。须菩提，所言法相者，如来说即非法相，是名法相。',
    english: 'Subhūti, those who give rise to the mind of supreme enlightenment should thus know, thus view, thus believe and understand all dharmas, without giving rise to dharma appearances. Subhūti, what are called dharma appearances—the Tathāgata says they are not dharma appearances, therefore they are called dharma appearances.',
    keywords: ['如是知', '如是见', '如是信解', '不生法相'],
  },
  // === 第32分 应化非真分 ===
  {
    chapter: 32,
    verseNum: 1,
    chinese: '须菩提，若有人以满无量阿僧祇世界七宝持用布施。若有善男子善女人，发菩提心者，持于此经，乃至四句偈等，受持读诵，为人演说，其福胜彼。',
    english: 'Subhūti, if someone filled incalculable worlds with the seven treasures and gave them as gift. If good men and women give rise to bodhi mind, uphold this sutra, even four verses, recite it, and explain it to others, their merit surpasses that.',
    keywords: ['无量阿僧祇世界', '发菩提心', '四句偈'],
  },
  {
    chapter: 32,
    verseNum: 2,
    chinese: '云何为人演说？不取于相，如如不动。何以故？一切有为法，如梦幻泡影，如露亦如电，应作如是观。',
    english: 'How should one explain it to others? Without grasping at appearances, unmoving like thusness. Why? All conditioned dharmas are like dreams, illusions, bubbles, shadows; like dew or lightning—thus should you contemplate them.',
    keywords: ['不取于相', '如如不动', '有为法', '梦幻泡影'],
  },
  {
    chapter: 32,
    verseNum: 3,
    chinese: '佛说是经已，长老须菩提，及诸比丘、比丘尼、优婆塞、优婆夷，一切世间天人阿修罗，闻佛所说，皆大欢喜，信受奉行。',
    english: 'When the Buddha finished speaking this sutra, Elder Subhūti, along with bhikṣus, bhikṣuṇīs, upāsakas, upāsikās, all gods, humans, and asuras of the world, hearing what the Buddha said, were greatly filled with joy, faithfully accepted, and practiced accordingly.',
    keywords: ['皆大欢喜', '信受奉行'],
  },
]

const concepts = [
  { name: '般若', nameSanskrit: 'Prajñā', description: '圆满智慧，能照见诸法实相。' },
  { name: '波罗蜜', nameSanskrit: 'Pāramitā', description: '度彼岸之行法，六度万行。' },
  { name: '空性', nameSanskrit: 'Śūnyatā', description: '诸法缘起无自性，体性究竟清净。' },
  { name: '菩提心', nameSanskrit: 'Bodhicitta', description: '为利益一切众生而发起成佛大愿之心。' },
  { name: '涅槃', nameSanskrit: 'Nirvāṇa', description: '远离烦恼与生死轮回的寂静安稳境界。' },
]

type CourseSeed = {
  id: string
  title: string
  description: string
  level: CourseLevel
  duration: number
  isPublished: boolean
  order: number
  lessons: { title: string; content: string; order: number }[]
}

const courses: CourseSeed[] = [
  {
    id: 'course-intro',
    title: '《金刚经》入门导读',
    description: '循序渐进掌握《金刚经》的结构、核心名相与修学方法。',
    level: CourseLevel.BEGINNER,
    duration: 120,
    isPublished: true,
    order: 1,
    lessons: [
      { title: '经题与缘起', content: '介绍经典名称、译者与流通历史。', order: 1 },
      { title: '发心与善护念', content: '解析善现启请分的重点问答。', order: 2 },
      { title: '无住生心的实践', content: '结合日常修行说明「应无所住而生其心」。', order: 3 },
    ],
  },
  {
    id: 'course-advance',
    title: '中观视角下的《金刚经》',
    description: '从龙树菩萨中观思想出发，深化对空性与度生的理解。',
    level: CourseLevel.INTERMEDIATE,
    duration: 180,
    isPublished: true,
    order: 2,
    lessons: [
      { title: '缘起性空', content: '以中观逻辑解析诸法不二。', order: 1 },
      { title: '四相与四句偈', content: '深入讨论我相、人相、众生相、寿者相。', order: 2 },
      { title: '空性与慈悲同行', content: '说明空与不空在菩萨行中的互融。', order: 3 },
    ],
  },
  {
    id: 'course-practice',
    title: '《金刚经》实修指南',
    description: '从理论到实践，讲解如何在日常生活中运用《金刚经》的智慧。',
    level: CourseLevel.INTERMEDIATE,
    duration: 200,
    isPublished: true,
    order: 3,
    lessons: [
      { title: '持戒与般若', content: '说明持戒是般若智慧的基础。', order: 1 },
      { title: '六度万行', content: '详述布施、持戒、忍辱、精进、禅定、般若六度。', order: 2 },
      { title: '日常观照', content: '提供具体方法在工作和家庭生活中观照自心。', order: 3 },
      { title: '障碍与超越', content: '分析修行中的常见障碍及对治方法。', order: 4 },
    ],
  },
  {
    id: 'course-commentary',
    title: '历代祖师注释选读',
    description: '精选六祖慧能、智者大师等历代祖师对《金刚经》的精彩注释。',
    level: CourseLevel.ADVANCED,
    duration: 240,
    isPublished: true,
    order: 4,
    lessons: [
      { title: '六祖慧能口诀', content: '深入讲解禅宗对《金刚经》的顿悟法门。', order: 1 },
      { title: '智者大师疏', content: '天台宗三观思想对《金刚经》的阐释。', order: 2 },
      { title: '窥基法师赞述', content: '唯识宗对般若思想的详细解说。', order: 3 },
      { title: '宗喀巴大师广释', content: '藏传佛教格鲁派的中观见地。', order: 4 },
    ],
  },
  {
    id: 'course-modern-interpretation',
    title: '现代视角下的《金刚经》',
    description: '结合现代科学、心理学、管理学等视角，重新诠释《金刚经》的智慧。',
    level: CourseLevel.ADVANCED,
    duration: 180,
    isPublished: true,
    order: 5,
    lessons: [
      { title: '量子物理与空性', content: '探讨量子力学与般若空性的相通之处。', order: 1 },
      { title: '正念与心理治疗', content: '解析「无住生心」与现代正念疗法的关系。', order: 2 },
      { title: '管理学的无我', content: '说明无我智慧在领导力与团队管理中的应用。', order: 3 },
      { title: '社会行动与度生', content: '将菩萨度生精神转化为现代社会责任实践。', order: 4 },
    ],
  },
]

type CommunitySeed = {
  id: string
  title: string
  content: string
  tags: string[]
  likeCount: number
  comments: { content: string }[]
}

const communityPosts: CommunitySeed[] = [
  {
    id: 'post-practice',
    title: '如何将「无住生心」应用在职场？',
    content:
      '面对高压 KPI 与复杂人际时，我练习把注意力放在「当下的善念」，提醒自己行于布施而不执著成果。这样既能保持专业，也让心获得片刻清凉。',
    tags: ['无住生心', '修行实践'],
    likeCount: 42,
    comments: [
      { content: '谢谢分享！我也会在写日报前先观照呼吸，让心柔软下来。' },
      { content: '我会在邮件草稿里写下「随缘尽力」，提醒自己不必太焦虑结果。' },
    ],
  },
  {
    id: 'post-morning-chant',
    title: '每日晨诵《金刚经》的收获',
    content:
      '坚持晨诵 21 天，每次读到「凡所有相，皆是虚妄」都会提醒自己放下前一天的得失。渐渐地，面对突发状况时更能保持平稳。',
    tags: ['晨诵', '修行心得'],
    likeCount: 58,
    comments: [{ content: '向师兄学习！准备跟着挑战 7 天微习惯。' }],
  },
]

async function seedUsers() {
  const existingAdmin = await prisma.user.findFirst({ where: { email: 'admin@example.com' } })
  if (existingAdmin) {
    return existingAdmin
  }

  return prisma.user.create({
    data: {
      email: 'admin@example.com',
      name: '系统管理员',
      role: UserRole.ADMIN,
      // bcrypt hash of "Admin@123"
      password: '$2a$10$uS4fD8U1kltxkSY8FeoJWe9ofBAzM90oCbGyF/F7fs/3Gzdh0dX9S',
    },
  })
}

async function seedChaptersAndVerses(sutraId: string) {
  for (const chapter of chapters) {
    await prisma.chapter.upsert({
      where: { sutraId_chapterNum: { sutraId, chapterNum: chapter.num } },
      update: { title: chapter.title, summary: chapter.summary, order: chapter.num },
      create: {
        sutraId,
        chapterNum: chapter.num,
        title: chapter.title,
        summary: chapter.summary,
        order: chapter.num,
      },
    })
  }

  const chapterMap = new Map(
    (
      await prisma.chapter.findMany({
        where: { sutraId },
        select: { id: true, chapterNum: true },
      })
    ).map((record) => [record.chapterNum, record.id]),
  )

  for (const verse of verses) {
    const chapterId = chapterMap.get(verse.chapter)
    if (!chapterId) continue

    await prisma.verse.upsert({
      where: { chapterId_verseNum: { chapterId, verseNum: verse.verseNum } },
      update: {
        chinese: verse.chinese,
        sanskrit: verse.sanskrit,
        english: verse.english,
        aiKeyword: verse.keywords,
        order: verse.verseNum,
      },
      create: {
        chapterId,
        verseNum: verse.verseNum,
        chinese: verse.chinese,
        sanskrit: verse.sanskrit,
        english: verse.english,
        aiKeyword: verse.keywords,
        order: verse.verseNum,
      },
    })
  }
}

async function seedSampleCommentaries(sutraId: string) {
  const verseSamples = await prisma.verse.findMany({
    where: { chapter: { sutraId } },
    orderBy: { createdAt: 'asc' },
    take: 4,
  })

  for (const verse of verseSamples) {
    await prisma.commentary.upsert({
      where: { id: `comm-${verse.id}` },
      update: {
        content: '此偈颂提醒修行者离相无住，方能契入般若实相。',
      },
      create: {
        id: `comm-${verse.id}`,
        verseId: verse.id,
        author: '六祖慧能',
        source: '金刚经口诀',
        content: '此偈颂提醒修行者离相无住，方能契入般若实相。',
      },
    })
  }
}

async function seedConcepts() {
  for (const concept of concepts) {
    await prisma.concept.upsert({
      where: { name: concept.name },
      update: {
        nameSanskrit: concept.nameSanskrit,
        description: concept.description,
      },
      create: concept,
    })
  }
}

async function seedSutraVersions(sutraId: string) {
  // 获取前3个章节的前2个偈颂
  const verses = await prisma.verse.findMany({
    where: { chapter: { sutraId } },
    orderBy: [{ chapterId: 'asc' }, { verseNum: 'asc' }],
    take: 6, // 3章 × 2偈颂
    include: {
      chapter: true,
    },
  })

  console.log(` 为 ${verses.length} 个偈颂添加版本数据`)

  for (const verse of verses) {
    const versionTypes = [
      {
        versionType: 'kumarajiva',
        versionName: '鸠摩罗什译本',
        language: 'zh',
        translator: '鸠摩罗什',
        year: '402',
        notes: '流传最广的汉译本，语言优美流畅',
      },
      {
        versionType: 'xuanzang',
        versionName: '玄奘译本',
        language: 'zh',
        translator: '玄奘',
        year: '660',
        notes: '直译精确，忠实于梵文原典',
      },
      {
        versionType: 'yijing',
        versionName: '义净译本',
        language: 'zh',
        translator: '义净',
        year: '703',
        notes: '文质兼备，补充罗什译本',
      },
    ]

    for (const version of versionTypes) {
      // 为每个偈颂生成不同版本的内容
      let content = ''
      if (version.versionType === 'kumarajiva') {
        content = `【鸠摩罗什译】第${verse.chapter.chapterNum}章第${verse.verseNum}偈：${verse.chinese || '如是我闻...'}`
      } else if (version.versionType === 'xuanzang') {
        content = `【玄奘译】第${verse.chapter.chapterNum}章第${verse.verseNum}偈：${verse.chinese ? verse.chinese.replace(/。/g, '，') : '如是闻，一时...'}`
      } else if (version.versionType === 'yijing') {
        content = `【义净译】第${verse.chapter.chapterNum}章第${verse.verseNum}偈：${verse.chinese ? verse.chinese.replace(/。/g, '；') : '如是我闻，一时...'}`
      }

      await prisma.sutraVersion.upsert({
        where: {
          verseId_versionType: {
            verseId: verse.id,
            versionType: version.versionType,
          },
        },
        update: {
          versionName: version.versionName,
          language: version.language,
          content,
          translator: version.translator,
          year: version.year,
          notes: version.notes,
        },
        create: {
          verseId: verse.id,
          versionType: version.versionType,
          versionName: version.versionName,
          language: version.language,
          content,
          translator: version.translator,
          year: version.year,
          notes: version.notes,
        },
      })
    }
  }

  console.log(' 版本对照数据就绪')
}

async function seedCourses(teacherId: string) {
  for (const course of courses) {
    await prisma.course.upsert({
      where: { id: course.id },
      update: {
        title: course.title,
        description: course.description,
        level: course.level,
        duration: course.duration,
        isPublished: course.isPublished,
        teacherId,
        lessons: {
          deleteMany: { courseId: course.id },
          create: course.lessons.map((lesson) => ({
            title: lesson.title,
            content: lesson.content,
            order: lesson.order,
          })),
        },
      },
      create: {
        id: course.id,
        title: course.title,
        description: course.description,
        level: course.level,
        duration: course.duration,
        isPublished: course.isPublished,
        order: course.order,
        teacherId,
        lessons: {
          create: course.lessons.map((lesson) => ({
            title: lesson.title,
            content: lesson.content,
            order: lesson.order,
          })),
        },
      },
    })
  }
}

async function seedCommunity(userId: string) {
  for (const post of communityPosts) {
    const commentCount = post.comments.length

    await prisma.post.upsert({
      where: { id: post.id },
      update: {
        title: post.title,
        content: post.content,
        tags: post.tags,
        likeCount: post.likeCount,
        commentCount,
        comments: {
          deleteMany: { postId: post.id },
          create: post.comments.map((comment, index) => ({
            id: `${post.id}-comment-${index}`,
            content: comment.content,
            userId,
          })),
        },
      },
      create: {
        id: post.id,
        userId,
        title: post.title,
        content: post.content,
        tags: post.tags,
        likeCount: post.likeCount,
        commentCount,
        comments: {
          create: post.comments.map((comment, index) => ({
            id: `${post.id}-comment-${index}`,
            content: comment.content,
            userId,
          })),
        },
      },
    })
  }
}

async function main() {
  console.log(' 开始初始化数据库...')

  const admin = await seedUsers()
  console.log(' 管理员账号就绪')

  const sutra = await prisma.sutra.upsert({
    where: { slug: 'diamond-sutra' },
    update: {},
    create: {
      title: '金刚般若波罗蜜经',
      titleSanskrit: 'Vajracchedikā Prajñāpāramitā Sūtra',
      slug: 'diamond-sutra',
      description: '《金刚经》揭示般若智慧的中道思想，勉励修行者度众生而不住于相。',
      order: 1,
    },
  })
  console.log(' 经本文本数据就绪')

  await seedChaptersAndVerses(sutra.id)
  console.log(' 章节与偈颂数据就绪')

  await seedSampleCommentaries(sutra.id)
  console.log(' 示例注释就绪')

  // await seedSutraVersions(sutra.id)
  // console.log(' 版本对照数据就绪')

  await seedConcepts()
  console.log(' 概念知识库就绪')

  await seedCourses(admin.id)
  console.log(' 课程数据就绪')

  await seedCommunity(admin.id)
  console.log(' 社区示例内容就绪')

  // 种植六祖坛经数据
  await seedPlatformSutra()
  console.log(' 六祖坛经数据就绪')

  console.log('\n 数据初始化完成，执行 `npm run db:seed` 即可导入样例数据。')
}

async function seedPlatformSutra() {
  const { seedPlatformSutra: seedPlatform } = await import('./seed-platform-sutra')
  await seedPlatform()
}

main()
  .catch((error) => {
    console.error(' 数据初始化失败:', error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
