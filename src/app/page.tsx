/**
 * 首页 - 金刚经研究与教学平台
 */

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import {
  BookOpen,
  MessageSquare,
  GraduationCap,
  Users,
  Sparkles,
  Languages,
  Brain,
  Target,
} from 'lucide-react';

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
          金刚般若波罗蜜经
          <span className="block text-amber-600 mt-2">AI 研究与教学平台</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
          融合古老智慧与现代科技，探索《金刚经》的深层奥义。
          支持 AI 智能问答、多版本对照、语音朗读等功能。
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" asChild>
            <Link href="/study">
              <BookOpen className="w-4 h-4 mr-2" />
              开始学习
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/ai">
              <MessageSquare className="w-4 h-4 mr-2" />
              AI 讲师问答
            </Link>
          </Button>
        </div>
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
                Gemini AI 驱动的偈颂解析，深入浅出讲解经义
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

       {/* Version Comparison Preview */}
       <section className="container px-4 py-16 mx-auto">
         <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-3xl p-8 md:p-12 border-2 border-amber-200">
           <div className="flex items-center gap-3 mb-6">
             <div className="w-12 h-12 rounded-full bg-amber-500 flex items-center justify-center text-white">
               <Languages className="w-6 h-6" />
             </div>
             <div>
               <h2 className="text-3xl font-bold text-amber-900">第1-3章版本对照</h2>
               <p className="text-amber-700 mt-1">📖 鸠摩罗什 · 玄奘 · 义净 · 梵文 · 藏文</p>
             </div>
           </div>

           <div className="grid md:grid-cols-3 gap-4 mb-8">
             <Link href="/study" className="p-6 rounded-lg border-2 border-amber-300 bg-white hover:border-amber-400 hover:shadow-lg transition-all text-left">
               <div className="font-bold text-xl mb-2 text-amber-900">第1分</div>
               <div className="text-sm font-medium text-gray-700 mb-2">法会因由分</div>
               <div className="text-xs text-gray-500">2个偈颂 · 5种版本</div>
             </Link>
             <Link href="/study" className="p-6 rounded-lg border-2 border-amber-300 bg-white hover:border-amber-400 hover:shadow-lg transition-all text-left">
               <div className="font-bold text-xl mb-2 text-amber-900">第2分</div>
               <div className="text-sm font-medium text-gray-700 mb-2">善现启请分</div>
               <div className="text-xs text-gray-500">3个偈颂 · 5种版本</div>
             </Link>
             <Link href="/study" className="p-6 rounded-lg border-2 border-amber-300 bg-white hover:border-amber-400 hover:shadow-lg transition-all text-left">
               <div className="font-bold text-xl mb-2 text-amber-900">第3分</div>
               <div className="text-sm font-medium text-gray-700 mb-2">大乘正宗分</div>
               <div className="text-xs text-gray-500">2个偈颂 · 5种版本</div>
             </Link>
           </div>

           <div className="bg-white rounded-lg p-6 border border-amber-300">
             <h3 className="text-xl font-bold mb-4 text-amber-900">版本对照特色</h3>
             <div className="grid md:grid-cols-2 gap-4">
               <div className="space-y-2">
                 <h4 className="font-semibold text-red-900">📖 鸠摩罗什 (402)</h4>
                 <p className="text-sm text-gray-600">流传最广，语言优美，意境深远</p>
               </div>
               <div className="space-y-2">
                 <h4 className="font-semibold text-blue-900">📘 玄奘 (660)</h4>
                 <p className="text-sm text-gray-600">直译精确，忠实原文，适合学术研究</p>
               </div>
               <div className="space-y-2">
                 <h4 className="font-semibold text-green-900">📗 义净 (703)</h4>
                 <p className="text-sm text-gray-600">文质兼备，补充罗什文献价值</p>
               </div>
               <div className="space-y-2">
                 <h4 className="font-semibold text-purple-900">📜 梵文原典</h4>
                 <p className="text-sm text-gray-600">Vajracchedikā Prajñāpāramitā Sūtra</p>
               </div>
               <div className="space-y-2">
                 <h4 className="font-semibold text-orange-900">🕉 藏文译本</h4>
                 <p className="text-sm text-gray-600">藏文大藏经甘珠尔部，注疏丰富</p>
               </div>
               <div className="md:col-span-2 text-center">
                 <Link href="/study" className="inline-flex items-center px-6 py-3 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors font-semibold">
                   点击进入学习页面 →
                 </Link>
               </div>
             </div>
           </div>
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
                  <span>偈颂深度解析与关键词提取</span>
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
                    什么是“无住生心”？
                  </div>
                </div>
                <div className="flex items-start space-x-3 justify-end">
                  <div className="bg-amber-50 rounded-lg p-3 text-sm max-w-xs">
                    <p className="text-amber-900">
                      “无住生心”是《金刚经》的核心思想之一。意指心不执着于任何事物而生起清净心...
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
  );
}
