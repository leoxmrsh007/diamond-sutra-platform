/**
 * 成就系统 API
 * 获取用户成就列表和解锁状态
 */

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { checkAllAchievements, getAvailableAchievements, initializeAchievements } from '@/lib/achievements'

export const dynamic = 'force-dynamic'

// GET - 获取用户成就列表
export async function GET(request: NextRequest) {
  const session = await auth()

  if (!session?.user) {
    return NextResponse.json({ error: '未登录' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const check = searchParams.get('check') === 'true'

  // 检查并解锁新成就
  if (check) {
    await checkAllAchievements(session.user.id)
  }

  // 获取成就列表
  const achievements = await getAvailableAchievements(session.user.id)

  // 获取用户统计
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { level: true, experience: true },
  })

  return NextResponse.json({
    achievements,
    user: {
      level: user?.level || 1,
      experience: user?.experience || 0,
    },
  })
}

// POST - 手动触发成就检查
export async function POST(request: NextRequest) {
  const session = await auth()

  if (!session?.user) {
    return NextResponse.json({ error: '未登录' }, { status: 401 })
  }

  const body = await request.json()
  const { action } = body

  if (action === 'initialize') {
    // 初始化成就数据（仅管理员）
    if (session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: '无权限' }, { status: 403 })
    }

    await initializeAchievements()
    return NextResponse.json({ success: true, message: '成就数据已初始化' })
  }

  if (action === 'check') {
    // 检查并解锁成就
    const newAchievements = await checkAllAchievements(session.user.id)

    return NextResponse.json({
      success: true,
      newAchievements,
      count: newAchievements.length,
    })
  }

  return NextResponse.json({ error: '无效的操作' }, { status: 400 })
}
