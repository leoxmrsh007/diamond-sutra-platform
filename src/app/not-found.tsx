/**
 * 404 Not Found 页面
 */

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Home, Search, BookOpen } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-amber-50/50 to-background p-4">
      <Card className="w-full max-w-lg text-center">
        <CardContent className="p-12">
          {/* 404 图标 */}
          <div className="relative w-40 h-40 mx-auto mb-8">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-100 to-orange-100 rounded-full" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-8xl font-bold text-amber-600">404</span>
            </div>
            {/* 莲花装饰 */}
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 text-4xl">🪷</div>
          </div>

          <h1 className="text-2xl font-bold mb-2">页面未找到</h1>
          <p className="text-muted-foreground mb-8">
            抱歉，您访问的页面不存在。可能已被移动或删除。
          </p>

          {/* 快捷链接 */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
            <Button asChild className="bg-amber-500 hover:bg-amber-600">
              <Link href="/">
                <Home className="w-4 h-4 mr-2" />
                返回首页
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/study">
                <BookOpen className="w-4 h-4 mr-2" />
                开始学习
              </Link>
            </Button>
          </div>

          {/* 搜索建议 */}
          <div className="border-t pt-6">
            <p className="text-sm text-muted-foreground mb-4">您可能在寻找：</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {[
                { href: '/study', label: '经文学习' },
                { href: '/courses', label: '系统课程' },
                { href: '/ai', label: 'AI 讲师' },
                { href: '/community', label: '共修社区' },
                { href: '/research', label: '深度研究' },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm px-3 py-1 rounded-full border hover:bg-amber-50 hover:border-amber-300 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
