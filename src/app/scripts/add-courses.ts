/**
 * 更新课程数据
 * 添加更多课程内容到数据库
 */

import { PrismaClient, CourseLevel } from '@prisma/client';
import { prisma } from '@/lib/prisma';

const COURSES = [
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
];

export async function addMoreCourses() {
  try {
    let addedCount = 0;
    let updatedCount = 0;

    // 查找管理员用户
    const admin = await prisma.user.findFirst({
      where: { role: 'ADMIN' },
    });

    if (!admin) {
      throw new Error('未找到管理员用户');
    }

    for (const courseData of COURSES) {
      // 检查课程是否存在
      const existing = await prisma.course.findUnique({
        where: { id: courseData.id },
      });

      if (existing) {
        // 更新课程
        await prisma.course.update({
          where: { id: courseData.id },
          data: {
            title: courseData.title,
            description: courseData.description,
            level: courseData.level,
            duration: courseData.duration,
            isPublished: courseData.isPublished,
            order: courseData.order,
          },
        });

        // 删除旧课时
        await prisma.lesson.deleteMany({
          where: { courseId: courseData.id },
        });

        // 创建新课时
        await prisma.lesson.createMany({
          data: courseData.lessons.map((lesson) => ({
            courseId: courseData.id,
            title: lesson.title,
            content: lesson.content,
            order: lesson.order,
          })),
        });

        updatedCount++;
      } else {
        // 创建课程
        await prisma.course.create({
          data: {
            id: courseData.id,
            title: courseData.title,
            description: courseData.description,
            level: courseData.level,
            duration: courseData.duration,
            isPublished: courseData.isPublished,
            order: courseData.order,
            teacherId: admin.id,
            lessons: {
              create: courseData.lessons.map((lesson) => ({
                title: lesson.title,
                content: lesson.content,
                order: lesson.order,
              })),
            },
          },
        });

        addedCount++;
      }
    }

    return {
      success: true,
      addedCount,
      updatedCount,
    };
  } catch (error) {
    console.error('添加课程失败:', error);
    throw error;
  }
}
