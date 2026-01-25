/**
 * 测试登录API
 */

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    console.log('测试登录:', email);

    // 查找用户
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        password: true,
      },
    });

    if (!user) {
      console.log('用户不存在');
      return NextResponse.json(
        { success: false, error: '用户不存在' },
        { status: 401 }
      );
    }

    if (!user.password) {
      console.log('用户没有设置密码');
      return NextResponse.json(
        { success: false, error: '用户没有设置密码' },
        { status: 400 }
      );
    }

    // 验证密码
    console.log('密码哈希:', user.password);
    console.log('输入密码:', password);

    const isValid = await bcrypt.compare(password, user.password);
    console.log('密码验证结果:', isValid);

    if (!isValid) {
      return NextResponse.json(
        { success: false, error: '密码错误' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('测试登录API错误:', error);
    return NextResponse.json(
      {
        success: false,
        error: '服务器错误',
        details: error instanceof Error ? error.message : '未知错误',
      },
      { status: 500 }
    );
  }
}
