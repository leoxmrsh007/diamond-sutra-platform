/**
 * 本地运行脚本：添加版本对照数据
 */

import { PrismaClient } from '@prisma/client';
import { addVersionData } from '../src/app/scripts/add-versions';

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('开始添加版本对照数据...');
    const result = await addVersionData();
    console.log('✅ 版本对照数据添加成功！');
    console.log(`新增: ${result.addedCount} 条`);
    console.log(`更新: ${result.updatedCount} 条`);
  } catch (error) {
    console.error('❌ 添加版本数据失败:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main();
