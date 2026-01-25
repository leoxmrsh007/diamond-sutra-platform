/**
 * 创建admin用户
 */

import { PrismaClient, UserRole } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function createAdminUser() {
  try {
    // 检查admin用户是否已存在
    const existingAdmin = await prisma.user.findUnique({
      where: { email: 'admin@example.com' },
    });

    if (existingAdmin) {
      console.log('✅ Admin用户已存在');
      console.log('邮箱:', existingAdmin.email);
      console.log('角色:', existingAdmin.role);
      return existingAdmin;
    }

    // 使用bcryptjs生成密码哈希
    const passwordHash = await bcrypt.hash('Admin@123', 10);
    console.log('密码哈希:', passwordHash);

    // 创建admin用户
    const admin = await prisma.user.create({
      data: {
        email: 'admin@example.com',
        name: '系统管理员',
        password: passwordHash,
        role: UserRole.ADMIN,
      },
    });

    console.log('✅ Admin用户创建成功！');
    console.log('邮箱:', admin.email);
    console.log('角色:', admin.role);
    console.log('密码: Admin@123');

    return admin;
  } catch (error) {
    console.error('❌ 创建Admin用户失败:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

createAdminUser();
