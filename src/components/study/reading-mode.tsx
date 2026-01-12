/**
 * 阅读模式组件
 * 提供专注的阅读体验
 */

'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import {
  BookOpen,
  Settings,
  X,
  Minus,
  Plus,
  Sun,
  Moon,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ReadingModeProps {
  content: string;
  title: string;
  onClose: () => void;
}

type FontSize = 'sm' | 'md' | 'lg' | 'xl';
type Theme = 'light' | 'warm' | 'dark' | 'sepia';

const fontSizeClasses = {
  sm: 'text-base',
  md: 'text-lg',
  lg: 'text-xl',
  xl: 'text-2xl',
};

const themeClasses = {
  light: 'bg-white text-gray-900',
  warm: 'bg-amber-50 text-amber-950',
  dark: 'bg-gray-900 text-gray-100',
  sepia: 'bg-[#f4ecd8] text-[#5c4b37]',
};

export function ReadingMode({ content, title, onClose }: ReadingModeProps) {
  const [fontSize, setFontSize] = useState<FontSize>('lg');
  const [theme, setTheme] = useState<Theme>('warm');
  const [showSettings, setShowSettings] = useState(false);
  const [autoScroll, setAutoScroll] = useState(false);
  const [scrollSpeed, setScrollSpeed] = useState([1]);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  // 自动滚动
  useEffect(() => {
    if (!autoScroll) return;

    const interval = setInterval(() => {
      const scrollAmount = scrollSpeed[0] * 0.5;
      window.scrollBy({ top: scrollAmount, behavior: 'smooth' });
    }, 50);

    return () => clearInterval(interval);
  }, [autoScroll, scrollSpeed]);

  return (
    <div className={cn(
      'fixed inset-0 z-50 transition-colors',
      themeClasses[theme]
    )}>
      {/* Header */}
      <div className="sticky top-0 z-10 bg-inherit border-b opacity-90 backdrop-blur-sm">
        <div className="container max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h2 className="font-medium">{title}</h2>
            <p className="text-sm opacity-70">专注阅读模式</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowSettings(!showSettings)}
            >
              <Settings className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container max-w-3xl mx-auto px-4 py-8">
        <article className={cn('prose prose-lg max-w-none leading-loose', fontSizeClasses[fontSize])}>
          {content}
        </article>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <Card className={cn(
          'fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-80 p-4 shadow-xl',
          themeClasses[theme]
        )}>
          <div className="space-y-4">
            <h3 className="font-medium flex items-center">
              <Settings className="w-4 h-4 mr-2" />
              阅读设置
            </h3>

            {/* Font Size */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm">字体大小</span>
                <div className="flex items-center gap-1">
                  <Button
                    size="icon"
                    variant="outline"
                    className="h-7 w-7"
                    onClick={() => {
                      const sizes: FontSize[] = ['sm', 'md', 'lg', 'xl'];
                      const currentIndex = sizes.indexOf(fontSize);
                      if (currentIndex > 0) setFontSize(sizes[currentIndex - 1]);
                    }}
                  >
                    <Minus className="w-3 h-3" />
                  </Button>
                  <Button
                    size="icon"
                    variant="outline"
                    className="h-7 w-7"
                    onClick={() => {
                      const sizes: FontSize[] = ['sm', 'md', 'lg', 'xl'];
                      const currentIndex = sizes.indexOf(fontSize);
                      if (currentIndex < sizes.length - 1) setFontSize(sizes[currentIndex + 1]);
                    }}
                  >
                    <Plus className="w-3 h-3" />
                  </Button>
                </div>
              </div>
              <div className="flex gap-1">
                {(['sm', 'md', 'lg', 'xl'] as FontSize[]).map((size) => (
                  <button
                    key={size}
                    onClick={() => setFontSize(size)}
                    className={cn(
                      'flex-1 py-1 text-xs rounded border transition-colors',
                      fontSize === size
                        ? 'bg-foreground text-background'
                        : 'border-current opacity-60'
                    )}
                  >
                    {size === 'sm' ? '小' : size === 'md' ? '中' : size === 'lg' ? '大' : '特大'}
                  </button>
                ))}
              </div>
            </div>

            {/* Theme */}
            <div>
              <span className="text-sm">背景主题</span>
              <div className="grid grid-cols-4 gap-2 mt-2">
                {([
                  { key: 'light' as Theme, icon: Sun, label: '明亮' },
                  { key: 'warm' as Theme, icon: Moon, label: '温暖' },
                  { key: 'dark' as Theme, icon: Moon, label: '深色' },
                  { key: 'sepia' as Theme, icon: Sun, label: '复古' },
                ].map((t) => (
                  <button
                    key={t.key}
                    onClick={() => setTheme(t.key)}
                    className={cn(
                      'flex flex-col items-center gap-1 p-2 rounded-lg border transition-colors',
                      theme === t.key ? 'bg-foreground text-background' : 'border-current opacity-60'
                    )}
                  >
                    <t.icon className="w-4 h-4" />
                    <span className="text-xs">{t.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Auto Scroll */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm">自动滚动</span>
                <Button
                  size="sm"
                  variant={autoScroll ? 'default' : 'outline'}
                  onClick={() => setAutoScroll(!autoScroll)}
                >
                  {autoScroll ? '开启' : '关闭'}
                </Button>
              </div>
              {autoScroll && (
                <div className="flex items-center gap-2">
                  <span className="text-xs opacity-70">速度</span>
                  <Slider
                    value={scrollSpeed}
                    onValueChange={setScrollSpeed}
                    min={0.5}
                    max={5}
                    step={0.5}
                    className="flex-1"
                  />
                  <span className="text-xs w-8">{scrollSpeed[0]}x</span>
                </div>
              )}
            </div>

            {/* TTS Toggle */}
            <div className="flex items-center justify-between">
              <span className="text-sm">语音朗读</span>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setIsMuted(!isMuted)}
              >
                {isMuted ? (
                  <VolumeX className="w-4 h-4" />
                ) : (
                  <Volume2 className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-current opacity-20">
        <div
          className="h-full bg-current opacity-100 transition-all duration-300"
          style={{
            width: `${(window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100}%`
          }}
        />
      </div>
    </div>
  );
}

/**
 * 阅读模式触发按钮
 */
export function ReadingModeButton({ onClick }: { onClick: () => void }) {
  return (
    <Button variant="outline" size="sm" onClick={onClick}>
      <BookOpen className="w-4 h-4 mr-2" />
      阅读模式
    </Button>
  );
}
