/**
 * 成就系统服务
 * 管理成就的检查、解锁和奖励发放
 */

import { prisma } from '@/lib/prisma'

// 成就类型定义
export interface AchievementCondition {
  type: 'study_chapters' | 'consecutive_days' | 'recite_verses' | 'create_notes' | 'create_posts' | 'complete_courses' | 'total_study_time'
  target: number
}

export interface AchievementDefinition {
  key: string
  title: string
  description: string
  icon?: string
  category: 'STUDY' | 'SOCIAL' | 'CHECKIN' | 'MILESTONE' | 'SPECIAL'
  level: number
  experience: number
  condition: AchievementCondition
}

// 成就定义列表
export const ACHIEVEMENTS: AchievementDefinition[] = [
  // 学习类成就
  {
    key: 'first_chapter',
    title: '初入法门',
    description: '完成第一章的学习',
    icon: '📖',
    category: 'STUDY',
    level: 1,
    experience: 10,
    condition: { type: 'study_chapters', target: 1 },
  },
  {
    key: 'study_10_chapters',
    title: '渐入佳境',
    description: '完成10章的学习',
    icon: '📚',
    category: 'STUDY',
    level: 2,
    experience: 50,
    condition: { type: 'study_chapters', target: 10 },
  },
  {
    key: 'study_32_chapters',
    title: '圆满读经',
    description: '完成全部32章的学习',
    icon: '🏆',
    category: 'STUDY',
    level: 3,
    experience: 200,
    condition: { type: 'study_chapters', target: 32 },
  },
  {
    key: 'recite_10_verses',
    title: '背诵初阶',
    description: '背诵10首偈颂',
    icon: '🎯',
    category: 'STUDY',
    level: 1,
    experience: 30,
    condition: { type: 'recite_verses', target: 10 },
  },
  {
    key: 'recite_100_verses',
    title: '背诵高阶',
    description: '背诵100首偈颂',
    icon: '🌟',
    category: 'STUDY',
    level: 3,
    experience: 150,
    condition: { type: 'recite_verses', target: 100 },
  },

  // 签到类成就
  {
    key: 'first_checkin',
    title: '初次签到',
    description: '首次完成每日签到',
    icon: '📅',
    category: 'CHECKIN',
    level: 1,
    experience: 5,
    condition: { type: 'consecutive_days', target: 1 },
  },
  {
    key: 'checkin_7_days',
    title: '七日精进',
    description: '连续签到7天',
    icon: '🔥',
    category: 'CHECKIN',
    level: 2,
    experience: 50,
    condition: { type: 'consecutive_days', target: 7 },
  },
  {
    key: 'checkin_30_days',
    title: '月月坚持',
    description: '连续签到30天',
    icon: '💪',
    category: 'CHECKIN',
    level: 3,
    experience: 200,
    condition: { type: 'consecutive_days', target: 30 },
  },
  {
    key: 'checkin_100_days',
    title: '百日筑基',
    description: '连续签到100天',
    icon: '👑',
    category: 'CHECKIN',
    level: 5,
    experience: 500,
    condition: { type: 'consecutive_days', target: 100 },
  },

  // 社交类成就
  {
    key: 'first_note',
    title: '心得笔记',
    description: '创建第一篇学习笔记',
    icon: '✍️',
    category: 'SOCIAL',
    level: 1,
    experience: 10,
    condition: { type: 'create_notes', target: 1 },
  },
  {
    key: 'create_10_notes',
    title: '勤于记录',
    description: '创建10篇学习笔记',
    icon: '📝',
    category: 'SOCIAL',
    level: 2,
    experience: 50,
    condition: { type: 'create_notes', target: 10 },
  },
  {
    key: 'first_post',
    title: '融入社区',
    description: '发布第一篇社区帖子',
    icon: '💬',
    category: 'SOCIAL',
    level: 1,
    experience: 15,
    condition: { type: 'create_posts', target: 1 },
  },
  {
    key: 'create_10_posts',
    title: '社区活跃',
    description: '发布10篇社区帖子',
    icon: '🌐',
    category: 'SOCIAL',
    level: 2,
    experience: 75,
    condition: { type: 'create_posts', target: 10 },
  },

  // 课程类成就
  {
    key: 'complete_first_course',
    title: '课程结业',
    description: '完成第一门课程',
    icon: '🎓',
    category: 'MILESTONE',
    level: 2,
    experience: 100,
    condition: { type: 'complete_courses', target: 1 },
  },
  {
    key: 'complete_5_courses',
    title: '学富五车',
    description: '完成5门课程',
    icon: '📜',
    category: 'MILESTONE',
    level: 4,
    experience: 300,
    condition: { type: 'complete_courses', target: 5 },
  },

  // 特殊成就
  {
    key: 'early_adopter',
    title: '早期行者',
    description: '平台首批用户（前100名）',
    icon: '🌱',
    category: 'SPECIAL',
    level: 1,
    experience: 100,
    condition: { type: 'study_chapters', target: 0 }, // 特殊处理
  },
  {
    key: 'perfectionist',
    title: '精益求精',
    description: '将任一章节学习到精通状态',
    icon: '💎',
    category: 'STUDY',
    level: 3,
    experience: 80,
    condition: { type: 'study_chapters', target: 0 }, // 特殊处理
  },
]

/**
 * 获取用户当前成就状态
 */
export async function getUserAchievements(userId: string) {
  const userAchievements = await prisma.userAchievement.findMany({
    where: { userId },
    include: {
      achievement: true,
    },
    orderBy: {
      unlockedAt: 'desc',
    },
  })

  return userAchievements.map((ua) => ({
    ...ua.achievement,
    unlockedAt: ua.unlockedAt,
  }))
}

/**
 * 获取用户可解锁的成就列表
 */
export async function getAvailableAchievements(userId: string) {
  const unlockedIds = await prisma.userAchievement
    .findMany({
      where: { userId },
      select: { achievementId: true },
    })
    .then((items) => new Set(items.map((item) => item.achievementId)))

  const allAchievements = await prisma.achievement.findMany({
    orderBy: [{ category: 'asc' }, { level: 'asc' }],
  })

  return allAchievements.map((achievement) => ({
    ...achievement,
    isUnlocked: unlockedIds.has(achievement.id),
  }))
}

/**
 * 检查并解锁成就
 */
export async function checkAndUnlockAchievements(
  userId: string,
  type: AchievementCondition['type'],
  currentValue: number
) {
  // 获取用户已解锁的成就
  const unlockedAchievements = await prisma.userAchievement.findMany({
    where: { userId },
    select: { achievementId: true },
  })
  const unlockedIds = new Set(unlockedAchievements.map((ua) => ua.achievementId))

  // 查找符合条件的成就
  const matchingAchievements = ACHIEVEMENTS.filter(
    (a) => a.condition.type === type && currentValue >= a.condition.target
  )

  const newUnlocks = []

  for (const achievementDef of matchingAchievements) {
    // 查找或创建数据库中的成就记录
    let achievement = await prisma.achievement.findUnique({
      where: { key: achievementDef.key },
    })

    if (!achievement) {
      achievement = await prisma.achievement.create({
        data: {
          key: achievementDef.key,
          title: achievementDef.title,
          description: achievementDef.description,
          icon: achievementDef.icon,
          category: achievementDef.category,
          level: achievementDef.level,
          experience: achievementDef.experience,
          condition: achievementDef.condition as any,
        },
      })
    }

    // 检查是否已解锁
    if (!unlockedIds.has(achievement.id)) {
      // 解锁成就
      await prisma.userAchievement.create({
        data: {
          userId,
          achievementId: achievement.id,
        },
      })

      // 增加用户经验
      await prisma.user.update({
        where: { id: userId },
        data: {
          experience: { increment: achievement.experience },
        },
      })

      newUnlocks.push(achievement)
    }
  }

  // 检查并升级用户等级
  if (newUnlocks.length > 0) {
    await updateUserLevel(userId)
  }

  return newUnlocks
}

/**
 * 检查用户的所有成就
 */
export async function checkAllAchievements(userId: string) {
  // 获取用户统计数据
  const [
    studiedChapters,
    recitedVerses,
    consecutiveDays,
    noteCount,
    postCount,
    completedCourses,
  ] = await Promise.all([
    // 已学习的章节数（状态不为 NOT_STARTED）
    (async () => {
      const progress = await prisma.studyProgress.findMany({
        where: {
          userId,
          status: { in: ['LEARNING', 'MEMORIZED', 'MASTERED'] },
        },
        select: { verseId: true },
        distinct: ['verseId'],
      })
      if (progress.length === 0) return 0
      const verses = await prisma.verse.findMany({
        where: { id: { in: progress.map(p => p.verseId) } },
        select: { chapterId: true },
      })
      return new Set(verses.map(v => v.chapterId)).size
    })(),
    // 背诵次数
    prisma.studyProgress.aggregate({
      where: { userId },
      _sum: { recitationCount: true },
    }).then((result) => result._sum.recitationCount || 0),
    // 连续签到天数
    prisma.checkIn.findFirst({
      where: { userId },
      orderBy: { checkInDate: 'desc' },
    }).then((checkIn) => checkIn?.consecutiveDays || 0),
    // 笔记数量
    prisma.note.count({ where: { userId } }),
    // 帖子数量
    prisma.post.count({ where: { userId } }),
    // 完成的课程数量
    prisma.courseEnrollment.count({
      where: {
        userId,
        progress: 1,
        completedAt: { not: null },
      },
    }),
  ])

  // 检查各类成就
  const results = await Promise.all([
    checkAndUnlockAchievements(userId, 'study_chapters', studiedChapters),
    checkAndUnlockAchievements(userId, 'recite_verses', recitedVerses),
    checkAndUnlockAchievements(userId, 'consecutive_days', consecutiveDays),
    checkAndUnlockAchievements(userId, 'create_notes', noteCount),
    checkAndUnlockAchievements(userId, 'create_posts', postCount),
    checkAndUnlockAchievements(userId, 'complete_courses', completedCourses),
  ])

  // 检查精通成就
  const masteredCount = await prisma.studyProgress.count({
    where: { userId, status: 'MASTERED' },
  })
  if (masteredCount > 0) {
    await checkAndUnlockAchievements(userId, 'study_chapters', 0) // 特殊处理
  }

  return results.flat()
}

/**
 * 更新用户等级
 */
async function updateUserLevel(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { experience: true },
  })

  if (!user) return

  // 等级计算公式：每1000经验升1级
  const newLevel = Math.floor(user.experience / 1000) + 1

  await prisma.user.update({
    where: { id: userId },
    data: { level: newLevel },
  })
}

/**
 * 初始化成就数据
 */
export async function initializeAchievements() {
  for (const achievementDef of ACHIEVEMENTS) {
    const existing = await prisma.achievement.findUnique({
      where: { key: achievementDef.key },
    })

    if (!existing) {
      await prisma.achievement.create({
        data: {
          key: achievementDef.key,
          title: achievementDef.title,
          description: achievementDef.description,
          icon: achievementDef.icon,
          category: achievementDef.category,
          level: achievementDef.level,
          experience: achievementDef.experience,
          condition: achievementDef.condition as any,
        },
      })
    }
  }
}
