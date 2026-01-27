/**
 * 首页 - 佛学经典研究与教学平台
 * 支持多经书切换
 */

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import {
  BookOpen,
  MessageSquare,
  GraduationCap,
  Users,
  Sparkles,
  Languages,
  Brain,
  Target,
} from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50/50 to-background">
      <Header />

      {/* Hero Section */}
      <section className="container px-4 py-20 mx-auto text-center">
        <Badge className="mb-4" variant="secondary">
          <Sparkles className="w-3 h-3 mr-1" />
          由 Google Gemini AI 驱动
        </Badge>
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
          佛学经典研究平台
          <span className="block text-amber-600 mt-2">智慧传承 · AI 辅助</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
          融合古老智慧与现代科技，深入探索佛教经典。
          支持 AI 智能问答、多版本对照、系统学习等功能。
        </p>
      </section>

      {/* 经书选择 */}
      <section className="container px-4 py-8 mx-auto">
        <Tabs defaultValue="diamond" className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
            <TabsTrigger value="diamond" asChild>
              <Link href="/">金刚经</Link>
            </TabsTrigger>
            <TabsTrigger value="platform" asChild>
              <Link href="/platform-sutra">六祖坛经</Link>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="diamond" className="mt-8">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <Badge className="mb-3">般若中观</Badge>
                <h2 className="text-3xl font-bold mb-3">金刚般若波罗蜜经</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  《金刚经》揭示般若智慧的中道思想，勉励修行者度众生而不住于相。
                  全经共三十二分，阐述"凡所有相，皆是虚妄"的核心奥义。
                </p>
                <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <p>• 32 分完整内容</p>
                  <p>• 梵汉藏多版本对照</p>
                  <p>• 中观般若智慧</p>
                </div>
                <div className="mt-6 flex gap-3">
                  <Button asChild>
                    <Link href="/study">
                      <BookOpen className="w-4 h-4 mr-2" />
                      开始学习
                    </Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href="/ai">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      AI 问答
                    </Link>
                  </Button>
                </div>
              </div>
              <div className="bg-gradient-to-br from-amber-100 to-yellow-100 rounded-2xl p-8 border-2 border-amber-200">
                <h3 className="font-bold text-lg mb-4 text-amber-900">核心偈颂</h3>
                <div className="bg-white rounded-lg p-4 mb-4 border border-amber-200">
                  <p className="text-amber-900">
                    "一切有为法，如梦幻泡影，<br />
                    如露亦如电，应作如是观。"
                  </p>
                </div>
                <h3 className="font-bold text-lg mb-4 text-amber-900">核心思想</h3>
                <ul className="space-y-2 text-sm">
                  <li>• 应无所住而生其心</li>
                  <li>• 凡所有相皆是虚妄</li>
                  <li>• 度无量众生而无我</li>
                </ul>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="platform" className="mt-8">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <Badge className="mb-3">禅宗经典</Badge>
                <h2 className="text-3xl font-bold mb-3">六祖大师法宝坛经</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  《坛经》是中国禅宗六祖惠能的言行录，是中国人撰写的唯一被称为"经"的佛教典籍。
                  全经共十品，阐述"直指人心，见性成佛"的顿悟法门。
                </p>
                <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <p>• 10 品完整内容</p>
                  <p>• 禅宗公案机锋</p>
                  <p>• 顿悟法门要义</p>
                </div>
                <div className="mt-6 flex gap-3">
                  <Button asChild>
                    <Link href="/platform-sutra">
                      <BookOpen className="w-4 h-4 mr-2" />
                      开始学习
                    </Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href="/ai?scripture=platform">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      AI 问答
                    </Link>
                  </Button>
                </div>
              </div>
              <div className="bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl p-8 border-2 border-green-200">
                <h3 className="font-bold text-lg mb-4 text-green-900">核心偈颂</h3>
                <div className="bg-white rounded-lg p-4 mb-4 border border-green-200">
                  <p className="text-green-900">
                    "菩提本无树，明镜亦非台。<br />
                    本来无一物，何处惹尘埃。"
                  </p>
                </div>
                <h3 className="font-bold text-lg mb-4 text-green-900">核心思想</h3>
                <ul className="space-y-2 text-sm">
                  <li>• 菩提自性本来清净</li>
                  <li>• 无念为宗无相为体</li>
                  <li>• 定慧一体不二</li>
                  <li>• 直指人心顿悟成佛</li>
                </ul>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </section>

      {/* Features */}
      <section className="container px-4 py-16 mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">核心功能</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-amber-100 hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-amber-100 flex items-center justify-center mb-4">
                <BookOpen className="w-6 h-6 text-amber-600" />
              </div>
              <CardTitle>多版本对照</CardTitle>
              <CardDescription>
                梵文、藏文、汉译多版本对照阅读，精准理解经文原意
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-blue-100 hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center mb-4">
                <Brain className="w-6 h-6 text-blue-600" />
              </div>
              <CardTitle>AI 智能解析</CardTitle>
              <CardDescription>
                Gemini AI 驱动的经文解析，深入浅出讲解经义
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-green-100 hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center mb-4">
                <GraduationCap className="w-6 h-6 text-green-600" />
              </div>
              <CardTitle>系统课程</CardTitle>
              <CardDescription>
                结构化学习路径，从入门到精进的完整课程体系
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-purple-100 hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <CardTitle>共修社区</CardTitle>
              <CardDescription>
                与志同道合的修行者交流心得，互相勉励
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* AI Features */}
      <section className="container px-4 py-16 mx-auto">
        <div className="bg-gradient-to-r from-amber-100 to-orange-100 rounded-3xl p-8 md:p-12">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <Badge className="mb-4">AI Powered</Badge>
              <h2 className="text-3xl font-bold mb-4">Gemini 2.0 驱动</h2>
              <p className="text-muted-foreground mb-6">
                采用 Google 最新 Gemini 2.0 AI 模型，提供：
              </p>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <Languages className="w-5 h-5 text-amber-600 mr-3 mt-0.5" />
                  <span>多语言经文语义理解</span>
                </li>
                <li className="flex items-start">
                  <Target className="w-5 h-5 text-amber-600 mr-3 mt-0.5" />
                  <span>个性化学习建议</span>
                </li>
                <li className="flex items-start">
                  <Sparkles className="w-5 h-5 text-amber-600 mr-3 mt-0.5" />
                  <span>经文深度解析与关键词提取</span>
                </li>
                <li className="flex items-start">
                  <MessageSquare className="w-5 h-5 text-amber-600 mr-3 mt-0.5" />
                  <span>24/7 AI 讲师答疑</span>
                </li>
              </ul>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-white text-sm font-bold">
                    你
                  </div>
                  <div className="bg-gray-100 rounded-lg p-3 text-sm">
                    什么是"无住生心"？
                  </div>
                </div>
                <div className="flex items-start space-x-3 justify-end">
                  <div className="bg-amber-50 rounded-lg p-3 text-sm max-w-xs">
                    <p className="text-amber-900">
                      "无住生心"是《金刚经》的核心思想之一。意指心不执着于任何事物而生起清净心...
                    </p>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white text-xs">
                    AI
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container px-4 py-20 mx-auto text-center">
        <h2 className="text-3xl font-bold mb-4">开启您的智慧之旅</h2>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          无论您是佛学初学者还是资深研究者，这里都有适合您的学习方式
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" asChild>
            <Link href="/register">免费注册</Link>
          </Button>
          <Button size="lg" variant="ghost" asChild>
            <Link href="/about">了解更多</Link>
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  )
}
