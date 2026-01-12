/**
 * 个人中心页面
 */

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  User,
  BookOpen,
  Bookmark,
  FileText,
  Settings,
  Award,
  Calendar,
  Flame,
  Target,
  Clock,
  TrendingUp,
  Edit,
  CheckCircle2,
} from 'lucide-react';

// 模拟用户数据
const mockUserData = {
  name: '慧明',
  email: 'huiming@example.com',
  avatar: '慧',
  level: '修行中',
  joinDate: '2024-01-15',
  stats: {
    studyDays: 45,
    consecutiveDays: 7,
    studiedVerses: 128,
    totalVerses: 500,
    notes: 23,
    bookmarks: 15,
    courses: 3,
  },
  achievements: [
    { id: 1, name: '初入佛门', description: '完成第1章学习', icon: '🌱', earned: true },
    { id: 2, name: '般若初现', description: '学习满7天', icon: '🌟', earned: true },
    { id: 3, name: '精进修行', description: '连续学习7天', icon: '🔥', earned: true },
    { id: 4, name: '经文通晓', description: '完成32章学习', icon: '📖', earned: false },
    { id: 5, name: '笔记达人', description: '创建50条笔记', icon: '📝', earned: false },
    { id: 6, name: '百日共修', description: '连续学习100天', icon: '💫', earned: false },
  ],
};

// 模拟笔记数据
const mockNotes = [
  {
    id: 1,
    verse: '一切有为法，如梦幻泡影',
    chapter: '第三十二分',
    content: '这句偈颂让我深刻体会到世间万法的无常性。最近在生活中遇到困难时，想起这句话，心态平和了很多。',
    tags: ['无常', '日常应用'],
    createdAt: '2024-01-18',
  },
  {
    id: 2,
    verse: '应无所住而生其心',
    chapter: '第十分',
    content: '无住生心是修行的关键。工作时不执着于结果，只是专注于当下的行动，这样反而效率更高，压力更小。',
    tags: ['无住', '工作修行'],
    createdAt: '2024-01-16',
  },
  {
    id: 3,
    verse: '凡所有相，皆是虚妄',
    chapter: '第五分',
    content: '理解空性不是否定一切，而是认识到事物的因缘和合本质。这帮助我减少了对物质和名利的执着。',
    tags: ['空性', '四相'],
    createdAt: '2024-01-14',
  },
];

// 模拟书签数据
const mockBookmarks = [
  {
    id: 1,
    verse: '所有一切众生之类，我皆令入无余涅槃而灭度之',
    chapter: '第三分',
    note: '菩萨的大愿心',
  },
  {
    id: 2,
    verse: '如来者，无所从来，亦无所去',
    chapter: '第二十九分',
    note: '法身的真实含义',
  },
  {
    id: 3,
    verse: '菩萨于法，应无所住行于布施',
    chapter: '第四分',
    note: '三轮体空的布施',
  },
];

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState(mockUserData);
  const [todaySigned, setTodaySigned] = useState(false);

  const handleSignIn = () => {
    if (!todaySigned) {
      setTodaySigned(true);
      // 这里添加签到逻辑
    }
  };

  const progress = (userData.stats.studiedVerses / userData.stats.totalVerses) * 100;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container max-w-6xl mx-auto px-4 py-8">
        {/* Profile Header */}
        <Card className="mb-6 bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <Avatar className="w-24 h-24 border-4 border-white shadow-lg">
                <AvatarFallback className="bg-amber-500 text-white text-3xl">
                  {userData.avatar}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-2xl font-bold">{userData.name}</h1>
                  <Badge variant="secondary">{userData.level}</Badge>
                </div>
                <p className="text-muted-foreground mb-3">{userData.email}</p>
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    入学时间：{userData.joinDate}
                  </span>
                  <span className="flex items-center gap-1">
                    <BookOpen className="w-4 h-4" />
                    已学习：{userData.stats.studiedVerses} 偈
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" asChild>
                  <Link href="/settings">
                    <Settings className="w-4 h-4 mr-2" />
                    设置
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <StatCard
            icon={<Flame className="w-5 h-5 text-orange-500" />}
            label="连续签到"
            value={userData.stats.consecutiveDays}
            unit="天"
            color="orange"
          />
          <StatCard
            icon={<Calendar className="w-5 h-5 text-blue-500" />}
            label="累计学习"
            value={userData.stats.studyDays}
            unit="天"
            color="blue"
          />
          <StatCard
            icon={<BookOpen className="w-5 h-5 text-green-500" />}
            label="已学偈颂"
            value={userData.stats.studiedVerses}
            unit="偈"
            color="green"
          />
          <StatCard
            icon={<FileText className="w-5 h-5 text-purple-500" />}
            label="学习笔记"
            value={userData.stats.notes}
            unit="条"
            color="purple"
          />
        </div>

        {/* Daily Sign In */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-orange-500" />
              每日签到
            </CardTitle>
            <CardDescription>坚持每日签到，培养精进修行的习惯</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex gap-1">
                {Array.from({ length: 7 }).map((_, i) => {
                  const day = new Date();
                  day.setDate(day.getDate() - (6 - i));
                  const isToday = i === 6;
                  const isPast = i < 6;
                  const isSigned = isPast || (isToday && todaySigned);

                  return (
                    <div
                      key={i}
                      className={`flex flex-col items-center p-3 rounded-lg min-w-[60px] ${
                        isSigned
                          ? 'bg-orange-100 text-orange-700'
                          : isToday
                          ? 'bg-amber-50 text-amber-600 border-2 border-amber-300'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      <span className="text-xs mb-1">
                        {day.toLocaleDateString('zh-CN', { weekday: 'short' })}
                      </span>
                      <span className="text-lg font-bold">
                        {isSigned ? <CheckCircle2 className="w-5 h-5" /> : day.getDate()}
                      </span>
                    </div>
                  );
                })}
              </div>
              <Button
                onClick={handleSignIn}
                disabled={todaySigned}
                className={todaySigned ? 'bg-green-500 hover:bg-green-600' : 'bg-amber-500 hover:bg-amber-600'}
              >
                {todaySigned ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    已签到
                  </>
                ) : (
                  <>
                    <Flame className="w-4 h-4 mr-2" />
                    立即签到
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="progress" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 max-w-2xl mx-auto">
            <TabsTrigger value="progress">学习进度</TabsTrigger>
            <TabsTrigger value="notes">我的笔记</TabsTrigger>
            <TabsTrigger value="bookmarks">书签收藏</TabsTrigger>
            <TabsTrigger value="achievements">成就徽章</TabsTrigger>
          </TabsList>

          {/* 学习进度 */}
          <TabsContent value="progress" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-amber-600" />
                  总体进度
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>金刚经32分</span>
                      <span className="font-medium">{progress.toFixed(1)}%</span>
                    </div>
                    <div className="h-3 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-4 mt-6">
                    {[
                      { label: '未开始', value: 8, color: 'bg-gray-200' },
                      { label: '学习中', value: 16, color: 'bg-blue-500' },
                      { label: '已背诵', value: 5, color: 'bg-green-500' },
                      { label: '已精通', value: 3, color: 'bg-amber-500' },
                    ].map((stat) => (
                      <div key={stat.label} className="text-center">
                        <div className={`w-16 h-16 rounded-full ${stat.color} mx-auto mb-2 flex items-center justify-center text-white text-xl font-bold`}>
                          {stat.value}
                        </div>
                        <p className="text-sm text-muted-foreground">{stat.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-blue-600" />
                  学习记录
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { date: '今天', verses: 5, duration: '30分钟' },
                    { date: '昨天', verses: 8, duration: '45分钟' },
                    { date: '1月17日', verses: 6, duration: '35分钟' },
                    { date: '1月16日', verses: 10, duration: '60分钟' },
                    { date: '1月15日', verses: 4, duration: '25分钟' },
                  ].map((record, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                          <BookOpen className="w-5 h-5 text-amber-600" />
                        </div>
                        <div>
                          <p className="font-medium">{record.date}</p>
                          <p className="text-sm text-muted-foreground">学习 {record.verses} 偈</p>
                        </div>
                      </div>
                      <span className="text-sm text-muted-foreground">{record.duration}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 我的笔记 */}
          <TabsContent value="notes" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">我的笔记 ({mockNotes.length})</h2>
              <Button asChild className="bg-amber-500 hover:bg-amber-600">
                <Link href="/study">
                  <FileText className="w-4 h-4 mr-2" />
                  新建笔记
                </Link>
              </Button>
            </div>

            {mockNotes.map((note) => (
              <Card key={note.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <Badge variant="outline" className="mb-2">
                        {note.chapter}
                      </Badge>
                      <CardTitle className="text-lg">{note.verse}</CardTitle>
                    </div>
                    <span className="text-sm text-muted-foreground">{note.createdAt}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-3">{note.content}</p>
                  <div className="flex gap-2">
                    {note.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* 书签收藏 */}
          <TabsContent value="bookmarks" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">书签收藏 ({mockBookmarks.length})</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {mockBookmarks.map((bookmark) => (
                <Card key={bookmark.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <Badge variant="outline" className="w-fit mb-2">
                      {bookmark.chapter}
                    </Badge>
                    <CardTitle className="text-lg leading-relaxed">{bookmark.verse}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {bookmark.note && (
                      <div className="flex items-start gap-2 text-sm text-muted-foreground">
                        <Bookmark className="w-4 h-4 mt-0.5 text-amber-500" />
                        <span>{bookmark.note}</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* 成就徽章 */}
          <TabsContent value="achievements" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-600" />
                  成就徽章
                </CardTitle>
                <CardDescription>完成修行任务，解锁成就徽章</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {userData.achievements.map((achievement) => (
                    <div
                      key={achievement.id}
                      className={`p-4 rounded-lg border-2 text-center ${
                        achievement.earned
                          ? 'bg-amber-50 border-amber-200'
                          : 'bg-muted border-muted opacity-60'
                      }`}
                    >
                      <div className={`text-4xl mb-2 ${achievement.earned ? '' : 'grayscale'}`}>
                        {achievement.icon}
                      </div>
                      <h3 className="font-medium mb-1">{achievement.name}</h3>
                      <p className="text-xs text-muted-foreground">{achievement.description}</p>
                      {achievement.earned && (
                        <Badge className="mt-2 bg-amber-500">已获得</Badge>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-purple-600" />
                  修行等级
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { level: '初入佛门', exp: 0, max: 100, current: true },
                    { level: '精进修行', exp: 0, max: 300, current: false },
                    { level: '般若初现', exp: 0, max: 600, current: false },
                    { level: '智慧如海', exp: 0, max: 1000, current: false },
                    { level: '究竟解脱', exp: 0, max: 2000, current: false },
                  ].map((rank) => (
                    <div
                      key={rank.level}
                      className={`flex items-center gap-3 ${
                        rank.current ? 'text-amber-700' : 'text-muted-foreground'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-full ${rank.current ? 'bg-amber-500' : 'bg-muted'} flex items-center justify-center text-white text-xs`}>
                        {rank.current ? '📍' : '🔒'}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="font-medium">{rank.level}</span>
                          <span>需要 {rank.max} 经验值</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className={`h-full ${rank.current ? 'bg-amber-500' : 'bg-gray-400'} rounded-full`}
                            style={{ width: '25%' }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  unit,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  unit: string;
  color: string;
}) {
  const colorClasses = {
    orange: 'bg-orange-50 border-orange-200',
    blue: 'bg-blue-50 border-blue-200',
    green: 'bg-green-50 border-green-200',
    purple: 'bg-purple-50 border-purple-200',
  };

  return (
    <Card className={colorClasses[color as keyof typeof colorClasses]}>
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-white">{icon}</div>
          <div>
            <p className="text-2xl font-bold">
              {value}
              <span className="text-sm font-normal text-muted-foreground ml-1">{unit}</span>
            </p>
            <p className="text-sm text-muted-foreground">{label}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
