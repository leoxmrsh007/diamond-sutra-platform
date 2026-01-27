/**
 * 网站导航栏
 */

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Menu,
  X,
  User,
  BookOpen,
  GraduationCap,
  MessageSquare,
  Users,
  FileText,
  Settings,
  LogOut,
  Flame,
  Bell,
  ChevronDown,
} from 'lucide-react';

const navItems = [
  {
    href: '/study',
    label: '经文学习',
    icon: BookOpen,
    children: [
      { href: '/study', label: '金刚经' },
      { href: '/platform-sutra', label: '六祖坛经' },
    ],
  },
  { href: '/courses', label: '系统课程', icon: GraduationCap },
  { href: '/ai', label: 'AI 讲师', icon: MessageSquare },
  { href: '/community', label: '共修社区', icon: Users },
  { href: '/research', label: '深度研究', icon: FileText },
];

export function Header() {
  const pathname = usePathname();
  const [isLoggedIn] = useState(false);
  const [consecutiveDays] = useState(7);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <div className="h-9 w-9 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white font-bold text-lg shadow-md">
            金
          </div>
          <span className="font-semibold text-lg hidden sm:inline-block">
            佛学经典研究平台
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname?.startsWith(item.href);

            if (item.children) {
              return (
                <DropdownMenu key={item.href}>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                        isActive
                          ? 'bg-amber-100 text-amber-900'
                          : 'text-foreground/60 hover:text-foreground hover:bg-muted'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {item.label}
                      <ChevronDown className="w-3 h-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {item.children.map((child) => (
                      <DropdownMenuItem key={child.href} asChild>
                        <Link href={child.href} className="cursor-pointer">
                          {child.label}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              );
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                  isActive
                    ? 'bg-amber-100 text-amber-900'
                    : 'text-foreground/60 hover:text-foreground hover:bg-muted'
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* User Menu */}
        <div className="flex items-center space-x-2">
          {/* 每日签到指示器 */}
          {isLoggedIn && consecutiveDays > 0 && (
            <Link href="/profile" className="hidden sm:flex">
              <Badge variant="outline" className="gap-1 cursor-pointer hover:bg-amber-50 border-orange-200 text-orange-700">
                <Flame className="w-3 h-3" />
                {consecutiveDays}天
              </Badge>
            </Link>
          )}

          {/* 通知 */}
          {isLoggedIn && (
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </Button>
          )}

          {isLoggedIn ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                  <Avatar className="h-9 w-9 border-2 border-amber-200">
                    <AvatarFallback className="bg-amber-100 text-amber-700">
                      慧
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-amber-100 text-amber-700 text-xs">
                      慧
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">慧明</p>
                    <p className="text-xs text-muted-foreground">修行中</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="cursor-pointer">
                      <User className="w-4 h-4 mr-2" />
                      个人中心
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/profile?tab=progress" className="cursor-pointer">
                      <BookOpen className="w-4 h-4 mr-2" />
                      学习进度
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/profile?tab=notes" className="cursor-pointer">
                      <FileText className="w-4 h-4 mr-2" />
                      我的笔记
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/profile?tab=bookmarks" className="cursor-pointer">
                      <BookOpen className="w-4 h-4 mr-2" />
                      书签收藏
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/settings" className="cursor-pointer">
                    <Settings className="w-4 h-4 mr-2" />
                    设置
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-600 cursor-pointer">
                  <LogOut className="w-4 h-4 mr-2" />
                  退出登录
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild className="hidden sm:inline-flex">
                <Link href="/login">登录</Link>
              </Button>
              <Button size="sm" className="bg-amber-500 hover:bg-amber-600" asChild>
                <Link href="/register">注册</Link>
              </Button>
            </>
          )}

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t bg-background">
          <nav className="container py-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname?.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-amber-100 text-amber-900'
                      : 'text-foreground/60 hover:text-foreground hover:bg-muted'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                </Link>
              );
            })}
            {isLoggedIn && (
              <>
                <div className="border-t my-2" />
                <Link
                  href="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-foreground/60 hover:text-foreground hover:bg-muted"
                >
                  <User className="w-5 h-5" />
                  个人中心
                </Link>
                <Link
                  href="/settings"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-foreground/60 hover:text-foreground hover:bg-muted"
                >
                  <Settings className="w-5 h-5" />
                  设置
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}

export function MobileNav() {
  return (
    <nav className="md:hidden flex flex-col space-y-3 p-4">
      <Link href="/study" className="text-sm font-medium">
        经文学习
      </Link>
      <Link href="/courses" className="text-sm font-medium">
        系统课程
      </Link>
      <Link href="/ai" className="text-sm font-medium">
        AI 讲师
      </Link>
      <Link href="/community" className="text-sm font-medium">
        共修社区
      </Link>
      <Link href="/research" className="text-sm font-medium">
        深度研究
      </Link>
    </nav>
  );
}
