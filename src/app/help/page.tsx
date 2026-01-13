/**
 * 帮助文档页面
 */

'use client';

import { useState } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Search,
  BookOpen,
  MessageSquare,
  Users,
  Settings,
  HelpCircle,
  ChevronRight,
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface HelpArticle {
  id: string;
  category: string;
  title: string;
  content: string;
}

const helpArticles: HelpArticle[] = [
  {
    id: 'getting-started',
    category: '入门指南',
    title: '如何开始学习《金刚经》？',
    content: `# 如何开始学习《金刚经》？

## 选择适合的学习方式

### 1. 系统课程学习
推荐从**入门课程**开始，系统学习《金刚经》的基础概念和核心思想。

### 2. 经文研读
在"经文学习"板块，您可以逐章阅读《金刚经》原文，配合注释和AI讲解深入理解。

### 3. AI 问答
遇到问题时，可以随时使用AI讲师功能，获得即时解答。

## 学习建议

- **每日坚持**：每天固定时间学习，哪怕只有15分钟
- **循序渐进**：不要急于求成，按章节逐步深入
- **结合实践**：将所学智慧应用到日常生活中
- **做笔记**：使用笔记功能记录心得体会
- **参与社区**：与其他修行者交流讨论`,
  },
  {
    id: 'ai-features',
    category: 'AI功能',
    title: '如何使用AI讲师？',
    content: `# AI讲师使用指南

## 主要功能

### 智能问答
- 支持自然语言提问
- 可以询问经义、概念、修行方法等
- AI会引用经文内容进行解答

### 流式响应
- 实时显示AI的回答过程
- 更好的交互体验

### 推荐问题
- 首次使用可点击推荐问题快速开始
- 涵盖常见主题和核心概念

## 使用技巧

1. **明确问题**：尽量具体地描述您的问题
2. **追问深入**：可以针对AI的回答继续提问
3. **结合经文**：在经文学习页面可直接请求AI讲解当前偈颂`,
  },
  {
    id: 'study-progress',
    category: '学习进度',
    title: '如何追踪学习进度？',
    content: `# 学习进度追踪

## 进度统计

在个人中心可以查看：
- 已学习章节数
- 学习时长统计
- 连续签到天数
- 笔记和书签数量

## 学习记录

系统会自动记录：
- 最后学习时间
- 学习的章节内容
- 完成的课程进度

## 成就系统

通过持续学习可以获得：
- 学习徽章
- 等级提升
- 特殊称号`,
  },
  {
    id: 'community',
    category: '社区功能',
    title: '如何参与社区讨论？',
    content: `# 社区参与指南

## 发帖规则

1. **标题清晰**：准确概括您的主题
2. **内容充实**：详细描述问题或心得
3. **添加标签**：便于他人查找
4. **友善交流**：保持互相尊重的态度

## 互动方式

- **点赞**：对有价值的帖子表示认可
- **评论**：积极参与讨论
- **分享**：将有价值的内容分享给他人
- **收藏**：收藏感兴趣的帖子`,
  },
  {
    id: 'notes-bookmarks',
    category: '学习工具',
    title: '如何使用笔记和书签？',
    content: `# 笔记和书签使用指南

## 笔记功能

- **添加笔记**：在学习页面点击"添加笔记"
- **编辑笔记**：随时修改或补充内容
- **添加标签**：便于分类和查找
- **公开分享**：可选择公开或私密

## 书签功能

- **收藏偈颂**：标记重要的经文内容
- **添加备注**：为书签添加个人理解
- **快速跳转**：一键跳转到收藏的偈颂

## 管理建议

1. 定期整理笔记，形成知识体系
2. 使用有意义的标签分类
3. 复习时重点查看笔记和书签内容`,
  },
  {
    id: 'account',
    category: '账户设置',
    title: '如何管理账户？',
    content: `# 账户管理

## 个人资料

在设置页面可以：
- 修改昵称和头像
- 更新邮箱和联系方式
- 设置修行信息

## 安全设置

- 修改密码：定期更换密码保护账户安全
- 绑定第三方账号：支持Google快捷登录

## 偏好设置

- 界面主题：选择喜欢的颜色主题
- 字体大小：调整文字大小
- 语言设置：支持多语言界面
- 通知设置：自定义接收的通知类型`,
  },
];

const categories = [...new Set(helpArticles.map((a) => a.category))];

export default function HelpPage() {
  const [selectedArticle, setSelectedArticle] = useState(helpArticles[0]);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredArticles = searchQuery
    ? helpArticles.filter(
        (a) =>
          a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          a.content.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : helpArticles;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">帮助中心</h1>
          <p className="text-muted-foreground">
            查找使用指南、常见问题解答和功能说明
          </p>
        </div>

        {/* Search */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="搜索帮助文档..."
                className="pl-9"
              />
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">帮助分类</CardTitle>
              </CardHeader>
              <CardContent className="p-2">
                <div className="space-y-1">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSearchQuery('')}
                      className="w-full text-left px-3 py-2 rounded-lg text-sm hover:bg-muted transition-colors"
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Links */}
            <Card className="mt-4">
              <CardHeader>
                <CardTitle className="text-sm">快速链接</CardTitle>
              </CardHeader>
              <CardContent className="p-2 space-y-1">
                <a href="/about" className="block px-3 py-2 rounded-lg text-sm hover:bg-muted transition-colors">
                  关于平台
                </a>
                <a href="/contact" className="block px-3 py-2 rounded-lg text-sm hover:bg-muted transition-colors">
                  联系我们
                </a>
                <a href="/community" className="block px-3 py-2 rounded-lg text-sm hover:bg-muted transition-colors">
                  社区反馈
                </a>
              </CardContent>
            </Card>
          </div>

          {/* Content */}
          <div className="md:col-span-3">
            {!searchQuery ? (
              <div className="grid md:grid-cols-2 gap-4">
                {helpArticles.map((article) => (
                  <Card
                    key={article.id}
                    className="hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => setSelectedArticle(article)}
                  >
                    <CardHeader>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline">{article.category}</Badge>
                      </div>
                      <CardTitle className="text-lg">{article.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {article.content.slice(0, 100)}...
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="text-sm text-muted-foreground">
                  找到 {filteredArticles.length} 条结果
                </div>
                {filteredArticles.map((article) => (
                  <Card
                    key={article.id}
                    className="hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => {
                      setSelectedArticle(article);
                      setSearchQuery('');
                    }}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <HelpCircle className="w-5 h-5 text-amber-600 mt-0.5" />
                        <div className="flex-1">
                          <Badge variant="outline" className="mb-2">
                            {article.category}
                          </Badge>
                          <h3 className="font-medium mb-1">{article.title}</h3>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {article.content.slice(0, 150)}
                          </p>
                        </div>
                        <ChevronRight className="w-5 h-5 text-muted-foreground" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Article Modal (when selected) */}
        {selectedArticle && !searchQuery && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <Card className="max-w-3xl w-full max-h-[80vh] overflow-hidden">
              <CardHeader className="border-b">
                <div className="flex items-center justify-between">
                  <div>
                    <Badge variant="outline" className="mb-2">
                      {selectedArticle.category}
                    </Badge>
                    <CardTitle>{selectedArticle.title}</CardTitle>
                  </div>
                  <button
                    onClick={() => setSelectedArticle(undefined)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    ✕
                  </button>
                </div>
              </CardHeader>
              <ScrollArea className="h-[60vh]">
                <CardContent className="p-6">
                  <div className="prose prose-sm max-w-none">
                    <ReactMarkdown>{selectedArticle.content}</ReactMarkdown>
                  </div>
                </CardContent>
              </ScrollArea>
            </Card>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
