/**
 * 本地运行脚本：添加更多课程
 */

import { PrismaClient } from '@prisma/client';
import { addMoreCourses } from '../src/app/scripts/add-courses';

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('开始添加课程...');
    const result = await addMoreCourses();
    console.log('✅ 课程添加成功！');
    console.log(`新增: ${result.addedCount} 个`);
    console.log(`更新: ${result.updatedCount} 个`);
  } catch (error) {
    console.error('❌ 添加课程失败:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main();
