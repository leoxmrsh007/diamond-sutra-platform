/**
 * 移动端底部导航栏
 */

'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import {
  BookOpen,
  GraduationCap,
  MessageSquare,
  Users,
  User,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/study', icon: BookOpen, label: '学习' },
  { href: '/courses', icon: GraduationCap, label: '课程' },
  { href: '/ai', icon: MessageSquare, label: 'AI' },
  { href: '/community', icon: Users, label: '社区' },
  { href: '/profile', icon: User, label: '我的' },
];

export function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-background border-t z-50 safe-area-inset-bottom">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center flex-1 h-full transition-colors',
                isActive ? 'text-amber-600' : 'text-muted-foreground'
              )}
            >
              <div className="relative">
                <Icon className={cn('w-5 h-5', isActive && 'fill-amber-600')} />
                {item.href === '/profile' && (
                  <Badge className="absolute -top-1 -right-2 w-4 h-4 p-0 flex items-center justify-center bg-red-500 text-white text-xs">
                    3
                  </Badge>
                )}
              </div>
              <span className="text-xs mt-1">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

/**
 * 底部导航栏安全区域处理
 * 在全局样式中添加 safe-area-inset-bottom 支持
 */
export function MobileNavStyles() {
  return (
    <style jsx global>{`
      .safe-area-inset-bottom {
        padding-bottom: env(safe-area-inset-bottom, 0);
      }
      @supports (padding-bottom: env(safe-area-inset-bottom)) {
        .safe-area-inset-bottom {
          padding-bottom: env(safe-area-inset-bottom);
        }
      }
    `}</style>
  );
}
