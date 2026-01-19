/**
 * 移动端底部导航栏
 * 支持安全区域和更好的触摸体验
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
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t z-50">
      <div className="flex items-center justify-around h-[calc(16px+env(safe-area-inset-bottom,0px)+48px)] pb-[env(safe-area-inset-bottom,0px)]">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center flex-1 h-full transition-all duration-200 active:scale-95',
                isActive ? 'text-amber-600' : 'text-muted-foreground'
              )}
            >
              <div className="relative transition-transform duration-200 active:scale-90">
                <Icon className={cn('w-5 h-5 transition-all', isActive && 'fill-amber-600')} />
                {item.href === '/profile' && (
                  <Badge className="absolute -top-1 -right-2 w-4 h-4 p-0 flex items-center justify-center bg-red-500 text-white text-xs animate-pulse">
                    3
                  </Badge>
                )}
              </div>
              <span className={cn(
                'text-xs mt-1 transition-all',
                isActive ? 'font-medium' : 'font-normal'
              )}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

/**
 * 添加底部安全区域的内容填充
 */
export function MobileNavPadding() {
  return (
    <div className="lg:hidden h-[calc(16px+env(safe-area-inset-bottom,0px)+48px)]" />
  );
}
