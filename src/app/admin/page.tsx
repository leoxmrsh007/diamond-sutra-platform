/**
 * 管理员后台页面
 */

import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

async function AdminPage() {
  const session = await auth()

  // 检查管理员权限
  if (!session?.user || session.user.role !== 'ADMIN') {
    redirect('/')
  }

  // 获取统计数据
  const [
    userCount,
    postCount,
    courseCount,
    todayCheckIns,
    recentUsers,
    activeCourses,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.post.count(),
    prisma.course.count(),
    prisma.checkIn.count({
      where: {
        checkInDate: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
        },
      },
    }),
    prisma.user.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        level: true,
        experience: true,
        createdAt: true,
      },
    }),
    prisma.course.findMany({
      where: { isPublished: true },
      include: {
        _count: {
          select: { enrollments: true },
        },
      },
      take: 5,
    }),
  ])

  // 获取学习进度统计
  const progressStats = await prisma.studyProgress.groupBy({
    by: ['status'],
    _count: true,
  })

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">管理后台</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          欢迎回来，{session.user.name}
        </p>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">概览</TabsTrigger>
          <TabsTrigger value="users">用户</TabsTrigger>
          <TabsTrigger value="content">内容</TabsTrigger>
          <TabsTrigger value="achievements">成就</TabsTrigger>
        </TabsList>

        {/* 概览标签 */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">
                  用户总数
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{userCount}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">
                  帖子数量
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{postCount}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">
                  课程数量
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{courseCount}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">
                  今日签到
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{todayCheckIns}</div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>学习进度分布</CardTitle>
                <CardDescription>用户学习状态统计</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {progressStats.map((stat) => (
                    <div key={stat.status} className="flex items-center justify-between">
                      <span className="text-sm">{stat.status}</span>
                      <span className="font-medium">{stat._count}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>热门课程</CardTitle>
                <CardDescription>按报名人数排序</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {activeCourses.map((course) => (
                    <div key={course.id} className="flex items-center justify-between">
                      <span className="text-sm truncate">{course.title}</span>
                      <span className="font-medium">{course._count.enrollments} 人</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* 用户标签 */}
        <TabsContent value="users" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>最近注册用户</CardTitle>
              <CardDescription>最新加入平台的用户</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">用户名</th>
                      <th className="text-left py-3 px-4">邮箱</th>
                      <th className="text-left py-3 px-4">角色</th>
                      <th className="text-left py-3 px-4">等级</th>
                      <th className="text-left py-3 px-4">经验</th>
                      <th className="text-left py-3 px-4">注册时间</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentUsers.map((user) => (
                      <tr key={user.id} className="border-b">
                        <td className="py-3 px-4">{user.name || '未设置'}</td>
                        <td className="py-3 px-4">{user.email || '-'}</td>
                        <td className="py-3 px-4">{user.role}</td>
                        <td className="py-3 px-4">{user.level}</td>
                        <td className="py-3 px-4">{user.experience}</td>
                        <td className="py-3 px-4">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 内容标签 */}
        <TabsContent value="content" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>内容管理</CardTitle>
              <CardDescription>管理平台各类内容</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <a href="/api/seed/all" className="block">
                  <div className="p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <h3 className="font-medium">重置数据</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      重新填充种子数据
                    </p>
                  </div>
                </a>
                <a href="/debug" className="block">
                  <div className="p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <h3 className="font-medium">调试工具</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      查看系统状态
                    </p>
                  </div>
                </a>
                <a href="/api/init-database" className="block">
                  <div className="p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <h3 className="font-medium">初始化数据库</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      创建数据库表
                    </p>
                  </div>
                </a>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 成就标签 */}
        <TabsContent value="achievements" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>成就系统</CardTitle>
              <CardDescription>查看和管理用户成就</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                成就系统已启用。用户可以通过学习、签到、社交等方式解锁成就并获得经验值。
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default AdminPage
