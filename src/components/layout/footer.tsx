/**
 * 网站页脚
 */

import Link from 'next/link';
import { Separator } from '@/components/ui/separator';

export function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="container max-w-6xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white font-bold">
                金
              </div>
              <span className="font-semibold">金刚经研究平台</span>
            </div>
            <p className="text-sm text-muted-foreground">
              融合古老智慧与现代科技，探索《金刚经》的深层奥义。
            </p>
          </div>

          {/* Learning */}
          <div>
            <h3 className="font-medium mb-4">学习</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/study" className="hover:text-foreground transition-colors">
                  经文学习
                </Link>
              </li>
              <li>
                <Link href="/courses" className="hover:text-foreground transition-colors">
                  系统课程
                </Link>
              </li>
              <li>
                <Link href="/ai" className="hover:text-foreground transition-colors">
                  AI 讲师
                </Link>
              </li>
              <li>
                <Link href="/research" className="hover:text-foreground transition-colors">
                  深度研究
                </Link>
              </li>
            </ul>
          </div>

          {/* Community */}
          <div>
            <h3 className="font-medium mb-4">社区</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/community" className="hover:text-foreground transition-colors">
                  共修社区
                </Link>
              </li>
              <li>
                <Link href="/questions" className="hover:text-foreground transition-colors">
                  问答广场
                </Link>
              </li>
              <li>
                <Link href="/events" className="hover:text-foreground transition-colors">
                  在线共修
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-foreground transition-colors">
                  关于我们
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-medium mb-4">资源</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/versions" className="hover:text-foreground transition-colors">
                  版本对照
                </Link>
              </li>
              <li>
                <Link href="/commentaries" className="hover:text-foreground transition-colors">
                  历代注释
                </Link>
              </li>
              <li>
                <Link href="/papers" className="hover:text-foreground transition-colors">
                  学术论文
                </Link>
              </li>
              <li>
                <Link href="/knowledge" className="hover:text-foreground transition-colors">
                  佛学词典
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © 2025 金刚经研究平台. 谨以此平台弘扬佛法，利益众生.
          </p>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <Link href="/privacy" className="hover:text-foreground transition-colors">
              隐私政策
            </Link>
            <Link href="/terms" className="hover:text-foreground transition-colors">
              使用条款
            </Link>
            <Link href="/contact" className="hover:text-foreground transition-colors">
              联系我们
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
