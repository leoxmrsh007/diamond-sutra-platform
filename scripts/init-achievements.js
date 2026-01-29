const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function initializeAchievements() {
  console.log('=== 初始化成就系统 ===\n');

  const achievements = [
    // 学习类成就
    {
      key: 'first_verse',
      title: '初次闻法',
      description: '学习第一个偈颂',
      category: 'STUDY',
      level: 1,
      experience: 10,
      condition: { type: 'study_verses', count: 1 },
    },
    {
      key: 'verse_collector_10',
      title: '积累者',
      description: '学习10个偈颂',
      category: 'STUDY',
      level: 2,
      experience: 50,
      condition: { type: 'study_verses', count: 10 },
    },
    {
      key: 'verse_collector_50',
      title: '博学者',
      description: '学习50个偈颂',
      category: 'STUDY',
      level: 3,
      experience: 200,
      condition: { type: 'study_verses', count: 50 },
    },
    {
      key: 'verse_master_100',
      title: '偈颂大师',
      description: '学习100个偈颂',
      category: 'STUDY',
      level: 4,
      experience: 500,
      condition: { type: 'study_verses', count: 100 },
    },
    {
      key: 'memorized_verse',
      title: '牢记在心',
      description: '记忆第一个偈颂',
      category: 'STUDY',
      level: 2,
      experience: 30,
      condition: { type: 'memorize_verses', count: 1 },
    },
    {
      key: 'diamond_sutra_complete',
      title: '金刚经通',
      description: '完成金刚经全部学习',
      category: 'MILESTONE',
      level: 5,
      experience: 1000,
      condition: { type: 'complete_sutra', slug: 'diamond-sutra' },
    },
    {
      key: 'platform_sutra_complete',
      title: '六祖通',
      description: '完成六祖坛经全部学习',
      category: 'MILESTONE',
      level: 5,
      experience: 1000,
      condition: { type: 'complete_sutra', slug: 'platform-sutra' },
    },

    // 签到类成就
    {
      key: 'first_checkin',
      title: '初入修行',
      description: '首次签到',
      category: 'CHECKIN',
      level: 1,
      experience: 10,
      condition: { type: 'check_in', count: 1 },
    },
    {
      key: 'checkin_7_days',
      title: '七日精进',
      description: '连续签到7天',
      category: 'CHECKIN',
      level: 2,
      experience: 100,
      condition: { type: 'consecutive_checkins', count: 7 },
    },
    {
      key: 'checkin_30_days',
      title: '月度修持',
      description: '连续签到30天',
      category: 'CHECKIN',
      level: 3,
      experience: 500,
      condition: { type: 'consecutive_checkins', count: 30 },
    },
    {
      key: 'checkin_100_days',
      title: '百日筑基',
      description: '累计签到100天',
      category: 'CHECKIN',
      level: 4,
      experience: 1000,
      condition: { type: 'total_checkins', count: 100 },
    },

    // 社交类成就
    {
      key: 'first_post',
      title: '分享心得',
      description: '发布第一篇帖子',
      category: 'SOCIAL',
      level: 1,
      experience: 20,
      condition: { type: 'create_post', count: 1 },
    },
    {
      key: 'social_butterfly',
      title: '社交达人',
      description: '发布10篇帖子',
      category: 'SOCIAL',
      level: 2,
      experience: 100,
      condition: { type: 'create_post', count: 10 },
    },
    {
      key: 'popular_post',
      title: '人气帖子',
      description: '帖子获得50个点赞',
      category: 'SOCIAL',
      level: 3,
      experience: 200,
      condition: { type: 'post_likes', count: 50 },
    },
    {
      key: 'helpful_user',
      title: '乐于助人',
      description: '回复10个评论',
      category: 'SOCIAL',
      level: 2,
      experience: 50,
      condition: { type: 'create_comment', count: 10 },
    },

    // 里程碑成就
    {
      key: 'level_5',
      title: '修学五级',
      description: '达到等级5',
      category: 'MILESTONE',
      level: 5,
      experience: 0,
      condition: { type: 'reach_level', level: 5 },
    },
    {
      key: 'level_10',
      title: '十级修行',
      description: '达到等级10',
      category: 'MILESTONE',
      level: 10,
      experience: 0,
      condition: { type: 'reach_level', level: 10 },
    },
    {
      key: 'level_20',
      title: '二十级修士',
      description: '达到等级20',
      category: 'MILESTONE',
      level: 20,
      experience: 0,
      condition: { type: 'reach_level', level: 20 },
    },
    {
      key: 'level_50',
      title: '五十级大师',
      description: '达到等级50',
      category: 'MILESTONE',
      level: 50,
      experience: 0,
      condition: { type: 'reach_level', level: 50 },
    },
    {
      key: 'experience_1000',
      title: '千点经验',
      description: '累计获得1000经验',
      category: 'MILESTONE',
      level: 1,
      experience: 0,
      condition: { type: 'total_experience', amount: 1000 },
    },
    {
      key: 'experience_10000',
      title: '万点经验',
      description: '累计获得10000经验',
      category: 'MILESTONE',
      level: 1,
      experience: 0,
      condition: { type: 'total_experience', amount: 10000 },
    },

    // 特殊成就
    {
      key: 'early_adopter',
      title: '早期修行者',
      description: '在平台发布首月加入',
      category: 'SPECIAL',
      level: 1,
      experience: 100,
      condition: { type: 'early_user' },
    },
    {
      key: 'note_taker',
      title: '勤做笔记',
      description: '创建10个笔记',
      category: 'STUDY',
      level: 2,
      experience: 50,
      condition: { type: 'create_note', count: 10 },
    },
    {
      key: 'bookmark_collector',
      title: '收藏家',
      description: '收藏20个偈颂',
      category: 'STUDY',
      level: 2,
      experience: 30,
      condition: { type: 'create_bookmark', count: 20 },
    },
  ];

  let created = 0;
  let updated = 0;

  for (const achievement of achievements) {
    const existing = await prisma.achievement.findUnique({
      where: { key: achievement.key },
    });

    if (existing) {
      await prisma.achievement.update({
        where: { key: achievement.key },
        data: achievement,
      });
      updated++;
      console.log(`✓ 更新成就: ${achievement.title}`);
    } else {
      await prisma.achievement.create({
        data: achievement,
      });
      created++;
      console.log(`+ 创建成就: ${achievement.title}`);
    }
  }

  console.log(`\n=== 成就系统初始化完成 ===`);
  console.log(`新创建: ${created}`);
  console.log(`已更新: ${updated}`);
  console.log(`总计: ${achievements.length}`);
}

async function checkAchievements() {
  console.log('\n=== 检查现有成就 ===\n');

  const achievements = await prisma.achievement.findMany({
    orderBy: { category: 'asc' },
  });

  const categoryStats = achievements.reduce((acc, achievement) => {
    acc[achievement.category] = (acc[achievement.category] || 0) + 1;
    return acc;
  }, {});

  console.log(`总成就数: ${achievements.length}`);
  console.log('\n分类统计:');
  Object.entries(categoryStats).forEach(([category, count]) => {
    console.log(`  ${category}: ${count}`);
  });

  console.log('\n成就列表:');
  achievements.forEach((achievement) => {
    console.log(`  [${achievement.category}] ${achievement.title} (Lv.${achievement.level}) - ${achievement.description}`);
  });
}

async function createLeaderboardSnapshot() {
  console.log('\n=== 创建排行榜快照 ===\n');

  // 获取用户排行榜
  const topUsers = await prisma.user.findMany({
    orderBy: [
      { level: 'desc' },
      { experience: 'desc' },
    ],
    take: 10,
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      level: true,
      experience: true,
    },
  });

  console.log('🏆 用户排行榜 TOP 10');
  console.log('');
  topUsers.forEach((user, index) => {
    const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}.`;
    console.log(`${medal} ${user.name || '匿名用户'} - Lv.${user.level} (${user.experience} XP)`);
  });

  // 获取成就排行榜
  const achievementCounts = await prisma.userAchievement.groupBy({
    by: ['userId'],
    _count: {
      achievementId: true,
    },
    orderBy: {
      _count: {
        achievementId: 'desc',
      },
    },
    take: 10,
  });

  const achievementUsers = await prisma.user.findMany({
    where: {
      id: {
        in: achievementCounts.map((ac) => ac.userId),
      },
    },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
    },
  });

  const achievementLeaderboard = achievementCounts.map((ac) => {
    const user = achievementUsers.find((u) => u.id === ac.userId);
    return {
      user,
      count: ac._count.achievementId,
    };
  });

  console.log('\n🏅 成就排行榜 TOP 10');
  console.log('');
  achievementLeaderboard.forEach((item, index) => {
    const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}.`;
    console.log(`${medal} ${item.user?.name || '匿名用户'} - ${item.count} 个成就`);
  });
}

async function main() {
  try {
    await initializeAchievements();
    await checkAchievements();
    await createLeaderboardSnapshot();
  } catch (error) {
    console.error('错误:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
