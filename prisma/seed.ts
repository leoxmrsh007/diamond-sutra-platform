/// <reference types="node" />
import { PrismaClient, UserRole, CourseLevel } from '@prisma/client'

const prisma = new PrismaClient()

const chapters: Array<{ num: number; title: string; summary: string }> = [
  { num: 1, title: '法会因由分第一', summary: '佛陀在舍卫国祇树给孤独园示现般若法会。' },
  { num: 2, title: '善现启请分第二', summary: '须菩提请问菩萨应如何发心与降伏其心。' },
  { num: 3, title: '大乘正宗分第三', summary: '宣说菩萨度众生而不住于相的精神。' },
  { num: 4, title: '妙行无住分第四', summary: '提醒修行者行布施时不执著于相。' },
  { num: 5, title: '如理实见分第五', summary: '指出不可以身相得见如来，破除执著。' },
  { num: 6, title: '正信希有分第六', summary: '赞叹未来众生闻经能生正信的功德。' },
  { num: 14, title: '离相寂灭分第十四', summary: '以忍辱波罗蜜显现离相寂灭的功夫。' },
  { num: 32, title: '应化非真分第三十二', summary: '总结一切有为法如梦幻泡影，应如是观照。' },
]

const verses: Array<{
  chapter: number
  verseNum: number
  chinese: string
  sanskrit?: string
  english?: string
  keywords: string[]
}> = [
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
  {
    chapter: 2,
    verseNum: 1,
    chinese: '时，长老须菩提在大众中起，与佛陀论及护念诸菩萨。',
    english: 'Then Elder Subhūti arose from the assembly and addressed the Buddha concerning how bodhisattvas should be supported and protected.',
    keywords: ['须菩提', '护念菩萨'],
  },
  {
    chapter: 3,
    verseNum: 1,
    chinese: '诸菩萨摩诃萨应度无量众生，而无众生可度。',
    english: 'All great bodhisattvas should liberate innumerable beings, yet ultimately perceive no being as actually liberated.',
    keywords: ['降伏其心', '无余涅槃'],
  },
  {
    chapter: 4,
    verseNum: 1,
    chinese: '菩萨应无所住所行布施，不住色声香味触法。',
    english: 'A bodhisattva should practice giving without attachment, not dwelling in forms, sounds, smells, tastes, tactile objects, or dharmas.',
    keywords: ['无所住', '布施'],
  },
  {
    chapter: 5,
    verseNum: 1,
    chinese: '不可以身相见如来，如来说身相即非身相。',
    english: 'One cannot behold the Tathāgata by bodily marks; the marks the Tathāgata speaks of are not truly marks.',
    keywords: ['身相', '如理实见'],
  },
  {
    chapter: 6,
    verseNum: 1,
    chinese: '众生众生者，如来说非众生，是名众生。',
    english: 'As to beings, the Tathāgata says they are not beings; that is why they are called beings.',
    keywords: ['众生即非众生'],
  },
  {
    chapter: 14,
    verseNum: 1,
    chinese: '忍辱波罗蜜，如来说非忍辱波罗蜜，是名忍辱波罗蜜。',
    english: 'The perfection of patience—the Tathāgata says it is not the perfection of patience; therefore it is called the perfection of patience.',
    keywords: ['忍辱波罗蜜', '离相'],
  },
  {
    chapter: 32,
    verseNum: 1,
    chinese: '一切有为法，如梦幻泡影，如露亦如电，应作如是观。',
    english: 'All conditioned dharmas are like dreams, illusions, bubbles, or shadows; like dew or lightning—thus should you contemplate them.',
    keywords: ['梦幻泡影', '如露如电'],
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
    isPublished: false,
    order: 2,
    lessons: [
      { title: '缘起性空', content: '以中观逻辑解析诸法不二。', order: 1 },
      { title: '四相与四句偈', content: '深入讨论我相、人相、众生相、寿者相。', order: 2 },
      { title: '空性与慈悲同行', content: '说明空与不空在菩萨行中的互融。', order: 3 },
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
        aiKeyword: {
          set: verse.keywords,
        },
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

  await seedConcepts()
  console.log(' 概念知识库就绪')

  await seedCourses(admin.id)
  console.log(' 课程数据就绪')

  await seedCommunity(admin.id)
  console.log(' 社区示例内容就绪')

  console.log('\n 数据初始化完成，执行 `npm run db:seed` 即可导入样例数据。')
}

main()
  .catch((error) => {
    console.error(' 数据初始化失败:', error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
