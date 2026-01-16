/**
 * 全局快捷键支持
 */

'use client';

import { useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';

interface Shortcut {
  key: string;
  description: string;
  action: () => void;
  enabled?: boolean;
}

export function useShortcuts() {
  const router = useRouter();

  const shortcuts = useMemo<Shortcut[]>(
    () => [
    // 搜索
      {
        key: '/',
        description: '打开搜索',
        action: () => {
          // 触发搜索对话框
          document.dispatchEvent(new CustomEvent('open-search'));
        },
        enabled: true,
      },
    // 导航
      {
        key: 'g h',
        description: '返回首页',
        action: () => router.push('/'),
        enabled: true,
      },
      {
        key: 'g s',
        description: '前往学习',
        action: () => router.push('/study'),
        enabled: true,
      },
      {
        key: 'g a',
        description: '前往AI问答',
        action: () => router.push('/ai'),
        enabled: true,
      },
      {
        key: 'g c',
        description: '前往课程',
        action: () => router.push('/courses'),
        enabled: true,
      },
      {
        key: 'g p',
        description: '前往个人中心',
        action: () => router.push('/profile'),
        enabled: true,
      },
    // 主题
      {
        key: 't',
        description: '切换主题',
        action: () => {
          document.dispatchEvent(new CustomEvent('toggle-theme'));
        },
        enabled: true,
      },
    // 其他
      {
        key: '?',
        description: '显示快捷键帮助',
        action: () => {
          document.dispatchEvent(new CustomEvent('toggle-shortcuts'));
        },
        enabled: true,
      },
      {
        key: 'Escape',
        description: '关闭对话框',
        action: () => {
          document.dispatchEvent(new CustomEvent('close-dialog'));
        },
        enabled: true,
      },
    ],
    [router],
  );

  // 处理按键
  useEffect(() => {
    let keySequence = '';
    let keySequenceTimeout: ReturnType<typeof setTimeout>;

    const handleKeyDown = (e: KeyboardEvent) => {
      // 忽略在输入框中的按键
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.contentEditable === 'true'
      ) {
        // 只允许 Escape 键
        if (e.key === 'Escape') {
          shortcuts
            .filter((s) => s.key === 'Escape')
            .forEach((s) => s.action());
        }
        return;
      }

      // 单键快捷键
      const singleKeyShortcut = shortcuts.find(
        (s) => s.key.length === 1 && s.key.toLowerCase() === e.key.toLowerCase() && s.enabled
      );

      if (singleKeyShortcut) {
        e.preventDefault();
        singleKeyShortcut.action();
        return;
      }

      // 多键快捷键（如 g h）
      keySequence += e.key.toLowerCase();

      clearTimeout(keySequenceTimeout);
      keySequenceTimeout = setTimeout(() => {
        keySequence = '';
      }, 500);

      const multiKeyShortcut = shortcuts.find(
        (s) => s.key === keySequence && s.enabled
      );

      if (multiKeyShortcut) {
        e.preventDefault();
        multiKeyShortcut.action();
        keySequence = '';
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [router, shortcuts]);

  return shortcuts;
}

/**
 * 快捷键帮助面板
 */

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Keyboard, X } from 'lucide-react';

export function ShortcutsHelp({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const shortcuts = [
    { key: '/', desc: '打开搜索', category: '通用' },
    { key: '?', desc: '显示此帮助', category: '通用' },
    { key: 'Esc', desc: '关闭对话框', category: '通用' },
    { key: 'T', desc: '切换主题', category: '外观' },
    { key: 'G then H', desc: '返回首页', category: '导航' },
    { key: 'G then S', desc: '前往学习', category: '导航' },
    { key: 'G then A', desc: '前往AI问答', category: '导航' },
    { key: 'G then C', desc: '前往课程', category: '导航' },
    { key: 'G then P', desc: '前往个人中心', category: '导航' },
  ];

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <Card
        className="w-full max-w-lg mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Keyboard className="w-5 h-5" />
              键盘快捷键
            </CardTitle>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {['通用', '导航', '外观'].map((category) => (
              <div key={category}>
                <Badge variant="outline" className="mb-2">
                  {category}
                </Badge>
                <div className="space-y-2">
                  {shortcuts
                    .filter((s) => s.category === category)
                    .map((shortcut) => (
                      <div
                        key={shortcut.key}
                        className="flex items-center justify-between p-2 rounded-lg hover:bg-muted"
                      >
                        <kbd className="px-2 py-1 text-xs bg-muted border rounded">
                          {shortcut.key}
                        </kbd>
                        <span className="text-sm text-muted-foreground">
                          {shortcut.desc}
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t text-center text-sm text-muted-foreground">
            按 <kbd className="px-2 py-0.5 text-xs bg-muted border rounded">?</kbd> 或{' '}
            <kbd className="px-2 py-0.5 text-xs bg-muted border rounded">Esc</kbd> 关闭此面板
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

/**
 * 快捷键提示按钮（显示在页面右下角）
 */
export function ShortcutHint() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleToggle = () => setOpen((prev) => !prev);
    document.addEventListener('toggle-shortcuts', handleToggle);
    return () => document.removeEventListener('toggle-shortcuts', handleToggle);
  }, []);

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-20 right-4 w-10 h-10 rounded-full bg-amber-500 text-white shadow-lg flex items-center justify-center hover:bg-amber-600 transition-colors"
        title="快捷键帮助 (?)"
      >
        <Keyboard className="w-5 h-5" />
      </button>
    );
  }

  return (
    <>
      <ShortcutsHelp open={open} onClose={() => setOpen(false)} />
    </>
  );
}
