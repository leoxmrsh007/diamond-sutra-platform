/**
 * 共修社区页面
 */

'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  MessageSquare,
  Heart,
  Share2,
  Send,
  Bookmark,
  TrendingUp,
  Clock,
  X,
  Plus,
} from 'lucide-react';

interface Post {
  id: string;
  title: string;
  content: string;
  tags: string[];
  likeCount: number;
  commentCount: number;
  createdAt: Date | string;
  author: {
    id: string;
    name: string;
    avatar?: string | null;
  };
}

// 示例帖子数据（用作备用）
const samplePosts = [
  {
    id: '1',
    author: { name: '慧明', avatar: '慧', id: '1' },
    title: '如何理解"无住生心"在日常生活中的应用？',
    content: '最近在研读《金刚经》，对"无住生心"这个概念很感兴趣。但是在实际生活中，我们应该如何做到"心无所住"呢？希望大家分享自己的修行体验。我理解的"无住"是：做事时专注当下，做完后不执着结果。但实际操作起来还是有难度，尤其是遇到挫折的时候...',
    tags: ['无住生心', '修行实践', '生活应用'],
    likeCount: 142,
    commentCount: 58,
    hoursAgo: 2,
    isHot: true,
  },
  {
    id: '2',
    author: { name: '妙音', avatar: '妙', id: '2' },
    title: '分享我的每日诵读心得',
    content: '每天早晨诵读《金刚经》已经成为我的习惯。经过三个月的坚持，感觉内心平静了许多，对很多事情的看法也改变了。以前很容易被外界影响情绪，现在能够更冷静地面对顺境和逆境。建议大家尝试每天固定时间诵读，即使只是几分钟也会有收获。',
    tags: ['每日诵读', '心得分享', '修行体验'],
    likeCount: 189,
    commentCount: 84,
    hoursAgo: 5,
    isHot: true,
  },
];

// 示例帖子数据 - 使用固定的时间差避免 hydration 错误
const samplePosts = [
  {
    id: 1,
    author: { name: '慧明', avatar: '慧' },
    title: '如何理解"无住生心"在日常生活中的应用？',
    content: '最近在研读《金刚经》，对"无住生心"这个概念很感兴趣。但是在实际生活中，我们应该如何做到"心无所住"呢？希望大家分享自己的修行体验。我理解的"无住"是：做事时专注当下，做完后不执着结果。但实际操作起来还是有难度，尤其是遇到挫折的时候...',
    tags: ['无住生心', '修行实践', '生活应用'],
    likes: 142,
    comments: 58,
    hoursAgo: 2,
    isHot: true,
  },
  {
    id: 2,
    author: { name: '妙音', avatar: '妙' },
    title: '分享我的每日诵读心得',
    content: '每天早晨诵读《金刚经》已经成为我的习惯。经过三个月的坚持，感觉内心平静了许多，对很多事情的看法也改变了。以前很容易被外界影响情绪，现在能够更冷静地面对顺境和逆境。建议大家尝试每天固定时间诵读，即使只是几分钟也会有收获。',
    tags: ['每日诵读', '心得分享', '修行体验'],
    likes: 189,
    comments: 84,
    hoursAgo: 5,
    isHot: true,
  },
  {
    id: 3,
    author: { name: '觉悟', avatar: '觉' },
    title: '关于"凡所有相，皆是虚妄"的理解',
    content: '这句经文是《金刚经》中最著名的句子之一。我想分享一些自己的理解：这里的"相"不仅指外在的物质世界，也包括我们内心的念头和概念。"虚妄"不是说事物不存在，而是说它们都是因缘和合而生，没有永恒不变的自性。理解这一点，可以减少我们的执着和烦恼。',
    tags: ['经文理解', '空性', '虚妄'],
    likes: 156,
    comments: 51,
    hoursAgo: 12,
    isHot: true,
  },
  {
    id: 4,
    author: { name: '清净', avatar: '清' },
    title: '初学者提问：应该如何开始学习《金刚经》？',
    content: '我对佛法很感兴趣，想开始学习《金刚经》，但不知道从哪里入手。希望大家能给一些建议，比如应该先看哪些注释或讲解？是否需要先了解一些佛教基础知识？从哪个译本开始比较好？万分感谢各位师兄指路！',
    tags: ['初学者', '学习建议', '入门指导'],
    likes: 131,
    comments: 95,
    hoursAgo: 18,
    isHot: true,
  },
  {
    id: 5,
    author: { name: '禅心', avatar: '禅' },
    title: '《金刚经》与心理学：从"应无所住"谈正念',
    content: '作为一名心理咨询师，我发现《金刚经》中的许多理念与现代正念疗法有相通之处。"应无所住而生其心"与正念强调的"不评判觉察"非常相似。经文教导我们不要执着于念头的来去，这与ACT疗法中的"认知解离"也有共鸣。希望和大家交流这方面的见解。',
    tags: ['心理学', '正念', '现代应用'],
    likes: 98,
    comments: 42,
    hoursAgo: 24,
    isHot: false,
  },
  {
    id: 6,
    author: { name: '文殊', avatar: '文' },
    title: '分享：鸠摩罗什译本与其他译本的比较',
    content: '最近在对比研读几个不同的《金刚经》译本，发现鸠摩罗什译本确实文采斐然，读起来朗朗上口。玄奘译本则更加严谨直译。对于修行而言，鸠摩罗什译本的意境更能触动人心；对于学术研究，玄奘译本可能更有参考价值。大家更喜欢哪个译本呢？',
    tags: ['译本比较', '鸠摩罗什', '玄奘'],
    likes: 76,
    comments: 38,
    hoursAgo: 36,
    isHot: false,
  },
  {
    id: 7,
    author: { name: '普贤', avatar: '普' },
    title: '如何在工作中践行"布施波罗蜜"？',
    content: '《金刚经》开头讲"尔时世尊食时，着衣持钵，入舍卫大城乞食"，这是佛陀以身作则示现乞食。对于我们这些在家人来说，如何在工作中践行布施精神呢？我认为：做好本职工作就是布施，帮助同事也是布施，真诚服务客户更是布施。大家怎么看？',
    tags: ['布施', '工作修行', '菩萨行'],
    likes: 112,
    comments: 47,
    hoursAgo: 48,
    isHot: false,
  },
  {
    id: 8,
    author: { name: '地藏', avatar: '地' },
    title: '记一次与AI讨论《金刚经》的经历',
    content: '今天用AI助手讨论《金刚经》，发现它对经文的解释还挺有深度的。我问了关于"我相人相众生相寿者相"的问题，AI给出了一个比较系统的回答。虽然不能完全替代真正的善知识，但作为辅助学习的工具还是挺有帮助的。有师兄也试过吗？',
    tags: ['AI', '科技', '学习工具'],
    likes: 64,
    comments: 29,
    hoursAgo: 72,
    isHot: false,
  },
  {
    id: 9,
    author: { name: '虚空', avatar: '虚' },
    title: '读《金刚经》第三十二品：一切有为法如梦幻泡影',
    content: '这四句偈可能是《金刚经》中最广为传诵的。但真正理解并体证"如梦幻泡影"的境界，需要长期的修行。我最近在观想人生如梦，虽然还在初步阶段，但已经感觉到对物质的执着有所减少。想请教各位师兄，有什么好的观想方法吗？',
    tags: ['偈颂', '观想', '无常'],
    likes: 88,
    comments: 35,
    hoursAgo: 96,
    isHot: false,
  },
  {
    id: 10,
    author: { name: '莲花', avatar: '莲' },
    title: '组织线上共修《金刚经》，欢迎报名',
    content: '计划组织一个线上《金刚经》共修小组，每周六晚上8点，通过视频会议一起诵读并分享心得。期待与志同道合的师兄一起学习，互相勉励。共修内容包括：齐读经文、分享心得、提问讨论。有兴趣的师兄可以留言报名，人数不限！',
    tags: ['共修', '线上活动', '招募'],
    likes: 143,
    comments: 67,
    hoursAgo: 120,
    isHot: false,
  },
];

export default function CommunityPage() {
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">共修社区</h1>
          <p className="text-xl text-muted-foreground">
            与志同道合的修行者交流心得，互相勉励
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* New Post */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">发布新帖</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="分享您的修行心得、提问或讨论..."
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  rows={3}
                />
                <div className="flex justify-between items-center">
                  <div className="flex gap-2">
                    <Badge variant="outline" className="cursor-pointer hover:bg-muted">
                      + 添加标签
                    </Badge>
                  </div>
                  <Button size="sm" className="bg-amber-500 hover:bg-amber-600">
                    <Send className="w-4 h-4 mr-2" />
                    发布
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Posts */}
            <Tabs defaultValue="latest" className="space-y-4">
              <TabsList>
                <TabsTrigger value="latest">最新</TabsTrigger>
                <TabsTrigger value="hot">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  热门
                </TabsTrigger>
                <TabsTrigger value="following">关注</TabsTrigger>
              </TabsList>

              <TabsContent value="latest" className="space-y-4">
                {samplePosts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </TabsContent>

              <TabsContent value="hot" className="space-y-4">
                {samplePosts.filter(p => p.isHot).map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </TabsContent>

              <TabsContent value="following" className="space-y-4">
                <Card>
                  <CardContent className="p-8 text-center text-muted-foreground">
                    <p>登录后查看您关注的内容</p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">社区统计</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">注册用户</span>
                  <span className="font-medium">12,458</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">今日发帖</span>
                  <span className="font-medium">124</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">在线共修</span>
                  <span className="font-medium text-green-600">342</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">累计讨论</span>
                  <span className="font-medium">45,678</span>
                </div>
              </CardContent>
            </Card>

            {/* Hot Topics */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">热门话题</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {['无住生心', '空性', '布施波罗蜜', '般若智慧', '日常修行', '禅修', '正念', '四相', '六度', '忍辱', '布施', '精进', '禅定', '般若', '缘起'].map(
                    (topic) => (
                      <Badge key={topic} variant="outline" className="cursor-pointer hover:bg-amber-50">
                        {topic}
                      </Badge>
                    )
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Active Practitioners */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">活跃修行者</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { name: '妙音', avatar: '妙', level: '精进三年', posts: 156 },
                  { name: '慧明', avatar: '慧', level: '修行五年', posts: 234 },
                  { name: '觉悟', avatar: '觉', level: '入道十年', posts: 412 },
                  { name: '清净', avatar: '清', level: '修行两年', posts: 89 },
                ].map((user) => (
                  <div key={user.name} className="flex items-center gap-2">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="bg-amber-100 text-amber-700 text-xs">
                        {user.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{user.name}</p>
                      <p className="text-xs text-muted-foreground">{user.level}</p>
                    </div>
                    <span className="text-xs text-muted-foreground">{user.posts}帖</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Daily Quote */}
            <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200">
              <CardHeader>
                <CardTitle className="text-sm text-amber-900">每日法语</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-amber-800 font-serif italic">
                  "一切有为法，如梦幻泡影，如露亦如电，应作如是观。"
                </p>
                <p className="text-xs text-amber-700 mt-2">— 《金刚经》第三十二品</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

function PostCard({ post }: { post: any }) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="w-10 h-10">
              <AvatarFallback className="bg-amber-100 text-amber-700">
                {post.author.avatar}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{post.author.name}</p>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {formatTime(post.hoursAgo)}
              </p>
            </div>
          </div>
          {post.isHot && (
            <Badge className="bg-red-100 text-red-700">
              <TrendingUp className="w-3 h-3 mr-1" />
              热门
            </Badge>
          )}
        </div>
        <CardTitle className="text-lg mt-2">{post.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground line-clamp-3">{post.content}</p>
        <div className="flex flex-wrap gap-2 mt-3">
          {(Array.isArray(post.tags) ? post.tags : []).map((tag: string) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              #{tag}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="border-t">
        <div className="flex gap-4 text-sm text-muted-foreground">
          <button className="flex items-center gap-1 hover:text-amber-600 transition-colors">
            <Heart className="w-4 h-4" />
            {post.likes}
          </button>
          <button className="flex items-center gap-1 hover:text-amber-600 transition-colors">
            <MessageSquare className="w-4 h-4" />
            {post.comments}
          </button>
          <button className="flex items-center gap-1 hover:text-amber-600 transition-colors">
            <Share2 className="w-4 h-4" />
            分享
          </button>
          <button className="flex items-center gap-1 hover:text-amber-600 transition-colors ml-auto">
            <Bookmark className="w-4 h-4" />
            收藏
          </button>
        </div>
      </CardFooter>
    </Card>
  );
}

function formatTime(hoursAgo: number): string {
  if (hoursAgo < 1) return '刚刚';
  if (hoursAgo < 24) return `${hoursAgo}小时前`;
  const days = Math.floor(hoursAgo / 24);
  if (days < 7) return `${days}天前`;
  return `${days}天前`;
}
