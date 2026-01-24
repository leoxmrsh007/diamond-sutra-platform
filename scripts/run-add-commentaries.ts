/**
 * 本地运行脚本：添加注释数据
 */

import { PrismaClient } from '@prisma/client';
import { addCommentaryData } from '../src/app/scripts/add-commentaries';

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('开始添加注释数据...');
    const result = await addCommentaryData();
    console.log('✅ 注释数据添加成功！');
    console.log(`新增: ${result.addedCount} 条`);
    console.log(`更新: ${result.updatedCount} 条`);
  } catch (error) {
    console.error('❌ 添加注释数据失败:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main();
