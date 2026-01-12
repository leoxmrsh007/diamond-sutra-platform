/**
 * 关于我们页面
 */

import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  BookOpen,
  Heart,
  Users,
  Sparkles,
  Target,
  Mail,
  Github,
  Globe,
} from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container max-w-4xl mx-auto px-4 py-12">
        {/* Hero */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 text-white font-bold text-3xl mb-6">
            金
          </div>
          <h1 className="text-4xl font-bold mb-4">关于金刚经研究平台</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            致力于推广《金刚经》的智慧，让般若思想深入人心
          </p>
        </div>

        {/* Mission */}
        <Card className="mb-8 bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">我们的使命</h2>
            <p className="text-lg text-amber-900 leading-relaxed max-w-2xl mx-auto">
              利用现代科技，尤其是人工智能技术，将古老的《金刚经》智慧以更易理解、更易学习的方式呈现给大众，
              帮助修行者深入理解般若思想，将佛法智慧应用于日常生活。
            </p>
          </CardContent>
        </Card>

        {/* Values */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-center">核心理念</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="text-center">
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-6 h-6 text-amber-700" />
                </div>
                <h3 className="font-medium mb-2">正知正见</h3>
                <p className="text-sm text-muted-foreground">
                  依据传统注疏，传承正宗的佛法知见
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-6 h-6 text-blue-700" />
                </div>
                <h3 className="font-medium mb-2">科技赋能</h3>
                <p className="text-sm text-muted-foreground">
                  运用AI技术，让经典学习更高效便捷
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-6 h-6 text-green-700" />
                </div>
                <h3 className="font-medium mb-2">服务大众</h3>
                <p className="text-sm text-muted-foreground">
                  免费开放，让更多人接触般若智慧
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Features */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-center">平台特色</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { icon: BookOpen, title: '完整经文', desc: '鸠摩罗什译本，32分完整呈现' },
              { icon: Sparkles, title: 'AI 讲师', desc: '24/7 在线，解答您的疑问' },
              { icon: Users, title: '共修社区', desc: '与志同道合者交流心得' },
              { icon: Target, title: '系统课程', desc: '从入门到精进的完整课程体系' },
            ].map((feature, i) => (
              <Card key={i}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                      <feature.icon className="w-5 h-5 text-amber-700" />
                    </div>
                    <div>
                      <h3 className="font-medium mb-1">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground">{feature.desc}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Tech Stack */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-center">技术架构</h2>
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-wrap gap-2 justify-center">
                {[
                  'Next.js 16',
                  'React 19',
                  'TypeScript',
                  'Tailwind CSS',
                  'Prisma',
                  'PostgreSQL',
                  'Google Gemini AI',
                  'NextAuth',
                  'shadcn/ui',
                ].map((tech) => (
                  <Badge key={tech} variant="secondary" className="text-sm py-1 px-3">
                    {tech}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Contact */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-center">联系我们</h2>
          <Card>
            <CardContent className="p-6">
              <div className="grid md:grid-cols-3 gap-4">
                <Button variant="outline" className="h-auto py-4">
                  <Mail className="w-5 h-5 mr-2" />
                  <div className="text-left">
                    <div className="text-xs text-muted-foreground">邮箱</div>
                    <div>contact@example.com</div>
                  </div>
                </Button>
                <Button variant="outline" className="h-auto py-4">
                  <Github className="w-5 h-5 mr-2" />
                  <div className="text-left">
                    <div className="text-xs text-muted-foreground">GitHub</div>
                    <div>github.com/diamond-sutra</div>
                  </div>
                </Button>
                <Button variant="outline" className="h-auto py-4">
                  <Globe className="w-5 h-5 mr-2" />
                  <div className="text-left">
                    <div className="text-xs text-muted-foreground">官网</div>
                    <div>www.diamondsutra.org</div>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Disclaimer */}
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="p-6">
            <h3 className="font-medium mb-2 text-amber-900">声明</h3>
            <p className="text-sm text-amber-800">
              本平台旨在推广《金刚经》的学习与理解，所有内容仅供参考。真正的修行需要在善知识的指导下进行。
              本平台不对任何因理解偏差导致的问题负责。如有疑问，请咨询具德善知识。
            </p>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
}
