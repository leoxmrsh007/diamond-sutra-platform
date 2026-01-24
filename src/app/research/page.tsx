/**
 * 深度研究页面
 * 提供《金刚经》的学术研究工具和资源
 */

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  BookOpen,
  FileText,
  Languages,
  Search,
  BookMarked,
  Users,
  Library,
  Globe,
  History,
  BarChart,
  Download,
  Share2,
} from 'lucide-react';

export default function ResearchPage() {
  const [activeTab, setActiveTab] = useState('versions');

  const researchTools = [
    {
      title: '版本对照',
      description: '梵文、藏文、汉译多版本逐句对照',
      icon: Languages,
      color: 'bg-blue-100 text-blue-600',
      href: '/study?tab=comparison',
    },
    {
      title: '注释研究',
      description: '历代高僧大德注释汇集',
      icon: BookMarked,
      color: 'bg-green-100 text-green-600',
      href: '#',
    },
    {
      title: '学术论文',
      description: '现代佛学研究文献',
      icon: FileText,
      color: 'bg-purple-100 text-purple-600',
      href: '#',
    },
    {
      title: '词汇索引',
      description: '关键词检索与统计',
      icon: Search,
      color: 'bg-amber-100 text-amber-600',
      href: '#',
    },
    {
      title: '历史流变',
      description: '经文翻译与传播历史',
      icon: History,
      color: 'bg-red-100 text-red-600',
      href: '#',
    },
    {
      title: '统计分析',
      description: '经文用字频率与结构分析',
      icon: BarChart,
      color: 'bg-indigo-100 text-indigo-600',
      href: '#',
    },
  ];

  const versions = [
    {
      name: '鸠摩罗什译本 (402)',
      language: '古汉语',
      features: ['流传最广', '语言优美', '意境深远'],
      color: 'border-red-300 bg-red-50',
    },
    {
      name: '玄奘译本 (660)',
      language: '古汉语',
      features: ['直译精确', '忠实原文', '学术研究'],
      color: 'border-blue-300 bg-blue-50',
    },
    {
      name: '义净译本 (703)',
      language: '古汉语',
      features: ['文质兼备', '补充罗什', '文献价值'],
      color: 'border-green-300 bg-green-50',
    },
    {
      name: '梵文原典',
      language: '梵语',
      features: ['原始文本', '学术研究', '语言分析'],
      color: 'border-purple-300 bg-purple-50',
    },
    {
      name: '藏文译本',
      language: '藏语',
      features: ['藏文大藏经', '注疏丰富', '藏传佛教'],
      color: 'border-orange-300 bg-orange-50',
    },
    {
      name: '英译本',
      language: '英语',
      features: ['Edward Conze', '现代翻译', '国际研究'],
      color: 'border-indigo-300 bg-indigo-50',
    },
  ];

  const commentaries = [
    {
      author: '六祖慧能',
      work: '《金刚经口诀》',
      dynasty: '唐',
      summary: '禅宗视角的《金刚经》解读，强调顿悟',
    },
    {
      author: '智者大师',
      work: '《金刚经疏》',
      dynasty: '隋',
      summary: '天台宗教理体系下的经文阐释',
    },
    {
      author: '窥基大师',
      work: '《金刚般若经赞述》',
      dynasty: '唐',
      summary: '唯识宗对《金刚经》的注解',
    },
    {
      author: '宗喀巴大师',
      work: '《金刚经广释》',
      dynasty: '明',
      summary: '格鲁派中观见地的详细开示',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white">
              <Library className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">深度研究</h1>
              <p className="text-muted-foreground">学术研究工具与资源库</p>
            </div>
          </div>
          <p className="text-lg text-muted-foreground mt-4 max-w-3xl">
            提供《金刚般若波罗蜜经》的多版本对照、历代注释、学术论文等研究资源，
            支持学者、修行者进行深入学习和研究。
          </p>
        </div>

        {/* Research Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="versions" className="flex items-center gap-2">
              <Languages className="w-4 h-4" />
              版本研究
            </TabsTrigger>
            <TabsTrigger value="commentaries" className="flex items-center gap-2">
              <BookMarked className="w-4 h-4" />
              注释汇集
            </TabsTrigger>
            <TabsTrigger value="tools" className="flex items-center gap-2">
              <Search className="w-4 h-4" />
              研究工具
            </TabsTrigger>
            <TabsTrigger value="resources" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              学术资源
            </TabsTrigger>
          </TabsList>

          {/* 版本研究 */}
          <TabsContent value="versions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">版本对照研究</CardTitle>
                <CardDescription>
                  《金刚经》六种主要版本的详细对照
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {versions.map((version, index) => (
                    <Card key={index} className={version.color}>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg">{version.name}</CardTitle>
                        <CardDescription>{version.language}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-1 text-sm">
                          {version.features.map((feature, i) => (
                            <li key={i} className="flex items-start">
                              <span className="mr-2">•</span>
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                      <CardFooter>
                        <Button variant="outline" size="sm" className="w-full" asChild>
                          <Link href={`/study?version=${version.name.split(' ')[0]}`}>
                            查看对照
                          </Link>
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">版本比较工具</CardTitle>
                  <CardDescription>并行查看多个版本</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">选择版本:</span>
                      <div className="flex gap-2">
                        <Badge variant="outline">鸠摩罗什</Badge>
                        <Badge variant="outline">玄奘</Badge>
                        <Badge variant="outline">梵文</Badge>
                      </div>
                    </div>
                    <Button className="w-full" asChild>
                      <Link href="/study?comparison=true">启动版本比较</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">翻译历史</CardTitle>
                  <CardDescription>从梵文到汉译的流传过程</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span>梵文原典 (1世纪)</span>
                      <span className="text-muted-foreground">→</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>鸠摩罗什译 (402年)</span>
                      <span className="text-muted-foreground">→</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>玄奘译 (660年)</span>
                      <span className="text-muted-foreground">→</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>义净译 (703年)</span>
                      <span className="text-muted-foreground">→</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>现代研究</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* 注释汇集 */}
          <TabsContent value="commentaries" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">历代注释</CardTitle>
                <CardDescription>
                  从南北朝到现代的《金刚经》注释文献
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {commentaries.map((commentary, index) => (
                    <Card key={index} className="border-l-4 border-l-blue-500">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle className="text-lg">
                              {commentary.author} · {commentary.work}
                            </CardTitle>
                            <CardDescription>{commentary.dynasty}代</CardDescription>
                          </div>
                          <Badge variant="secondary">{commentary.author.split(' ')[0]}宗</Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">
                          {commentary.summary}
                        </p>
                      </CardContent>
                      <CardFooter>
                        <div className="flex gap-2 w-full">
                          <Button variant="outline" size="sm">
                            <BookOpen className="w-4 h-4 mr-2" />
                            在线阅读
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Download className="w-4 h-4 mr-2" />
                            下载PDF
                          </Button>
                        </div>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 研究工具 */}
          <TabsContent value="tools" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">研究工具</CardTitle>
                <CardDescription>
                  专为《金刚经》研究设计的数字化工具
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {researchTools.map((tool, index) => (
                    <Card key={index} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className={`w-12 h-12 rounded-lg ${tool.color} flex items-center justify-center mb-4`}>
                          <tool.icon className="w-6 h-6" />
                        </div>
                        <CardTitle>{tool.title}</CardTitle>
                        <CardDescription>{tool.description}</CardDescription>
                      </CardHeader>
                      <CardFooter>
                        <Button variant="outline" size="sm" className="w-full" asChild>
                          <Link href={tool.href}>使用工具</Link>
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 学术资源 */}
          <TabsContent value="resources" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">学术资源库</CardTitle>
                <CardDescription>
                  现代佛学研究论文与数字资源
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                    <div>
                      <h3 className="font-medium">《金刚经》研究论文合集</h3>
                      <p className="text-sm text-muted-foreground">收录1980-2023年核心期刊论文</p>
                    </div>
                    <Badge>PDF · 2.3GB</Badge>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                    <div>
                      <h3 className="font-medium">梵文《金刚经》数字化校勘本</h3>
                      <p className="text-sm text-muted-foreground">基于多个写本的校勘成果</p>
                    </div>
                    <Badge variant="outline">XML/TEI格式</Badge>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                    <div>
                      <h3 className="font-medium">《金刚经》注疏数据库</h3>
                      <p className="text-sm text-muted-foreground">历代注释全文检索</p>
                    </div>
                    <Badge variant="secondary">在线访问</Badge>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex gap-2">
                <Button variant="outline">
                  <Globe className="w-4 h-4 mr-2" />
                  访问外部资源
                </Button>
                <Button>
                  <Users className="w-4 h-4 mr-2" />
                  加入研究社群
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Quick Links */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">快速开始</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="border-2 border-blue-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Languages className="w-5 h-5 text-blue-600" />
                  版本对照
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  比较不同译本的差异，理解翻译选择
                </p>
                <Button className="w-full" asChild>
                  <Link href="/study?tab=comparison">开始对照</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="border-2 border-green-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="w-5 h-5 text-green-600" />
                  关键词检索
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  搜索经文中的关键词，查看出现位置
                </p>
                <Button className="w-full" asChild>
                  <Link href="/search">搜索关键词</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="border-2 border-purple-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-purple-600" />
                  学习课程
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  系统学习《金刚经》的课程体系
                </p>
                <Button className="w-full" asChild>
                  <Link href="/courses">查看课程</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}