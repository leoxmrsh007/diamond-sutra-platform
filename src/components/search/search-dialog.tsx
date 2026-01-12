/**
 * 全局搜索组件
 */

'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Search,
  X,
  BookOpen,
  MessageSquare,
  Users,
  FileText,
  ArrowRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SearchResult {
  id: string;
  type: 'verse' | 'chapter' | 'course' | 'post' | 'note';
  title: string;
  content: string;
  href: string;
  category?: string;
}

interface SearchDialogProps {
  open: boolean;
  onClose: () => void;
}

const mockSearchResults: SearchResult[] = [
  {
    id: '1',
    type: 'verse',
    title: '一切有为法，如梦幻泡影',
    content: '《金刚经》第三十二分 - 如梦、幻、泡、影，如露亦如电',
    href: '/study?chapter=32',
    category: '偈颂',
  },
  {
    id: '2',
    type: 'verse',
    title: '应无所住而生其心',
    content: '《金刚经》第十分 - 菩萨于法，应无所住行于布施',
    href: '/study?chapter=10',
    category: '偈颂',
  },
  {
    id: '3',
    type: 'chapter',
    title: '大乘正宗分第三',
    content: '佛陀阐述菩萨于法应无所住而行布施',
    href: '/study?chapter=3',
    category: '章节',
  },
  {
    id: '4',
    type: 'course',
    title: '《金刚经》入门导读',
    content: '了解《金刚经》的缘起、核心思想和基本概念',
    href: '/courses/1',
    category: '课程',
  },
  {
    id: '5',
    type: 'post',
    title: '如何理解"无住生心"在日常生活中的应用？',
    content: '最近在研读《金刚经》，对"无住生心"这个概念很感兴趣...',
    href: '/community',
    category: '社区',
  },
];

const typeIcons = {
  verse: BookOpen,
  chapter: BookOpen,
  course: FileText,
  post: MessageSquare,
  note: FileText,
};

const typeLabels = {
  verse: '偈颂',
  chapter: '章节',
  course: '课程',
  post: '帖子',
  note: '笔记',
};

export function SearchDialog({ open, onClose }: SearchDialogProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setSelectedIndex(-1);
      return;
    }

    // 模拟搜索
    const filtered = mockSearchResults.filter(
      (item) =>
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.content.toLowerCase().includes(query.toLowerCase())
    );
    setResults(filtered);
    setSelectedIndex(-1);
  }, [query]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((i) => (i < results.length - 1 ? i + 1 : i));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((i) => (i > 0 ? i - 1 : -1));
    } else if (e.key === 'Enter' && selectedIndex >= 0) {
      e.preventDefault();
      router.push(results[selectedIndex].href);
      onClose();
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  const handleResultClick = (result: SearchResult) => {
    router.push(result.href);
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh] bg-black/50" onClick={onClose}>
      <Card
        className="w-full max-w-2xl mx-4 overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <CardContent className="p-0">
          {/* Search Input */}
          <div className="flex items-center border-b p-4">
            <Search className="w-5 h-5 text-muted-foreground mr-3" />
            <Input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="搜索经文、课程、社区讨论..."
              className="border-0 focus-visible:ring-0 text-base"
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="ml-2"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Search Results */}
          <ScrollArea className="h-[400px]">
            {query.trim() && results.length === 0 ? (
              <div className="py-12 text-center text-muted-foreground">
                <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>没有找到与 "{query}" 相关的内容</p>
              </div>
            ) : query.trim() && results.length > 0 ? (
              <div className="p-2">
                <div className="text-xs text-muted-foreground px-3 py-2">
                  找到 {results.length} 条结果
                </div>
                {results.map((result, index) => {
                  const Icon = typeIcons[result.type];
                  return (
                    <button
                      key={result.id}
                      onClick={() => handleResultClick(result)}
                      className={cn(
                        'w-full text-left p-3 rounded-lg transition-colors',
                        selectedIndex === index
                          ? 'bg-amber-50'
                          : 'hover:bg-muted'
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center shrink-0 mt-0.5">
                          <Icon className="w-4 h-4 text-amber-700" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium truncate">{result.title}</span>
                            <Badge variant="outline" className="text-xs shrink-0">
                              {result.category}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-1">
                            {result.content}
                          </p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-muted-foreground shrink-0 mt-1" />
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="p-6">
                <div className="text-center mb-6">
                  <h3 className="font-medium mb-2">搜索提示</h3>
                  <p className="text-sm text-muted-foreground">
                    支持搜索经文、章节、课程、社区讨论等内容
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {[
                    { query: '般若', label: '般若智慧' },
                    { query: '布施', label: '布施波罗蜜' },
                    { query: '无住', label: '无住生心' },
                    { query: '四相', label: '四相非相' },
                    { query: '空性', label: '缘起性空' },
                    { query: '忍辱', label: '忍辱波罗蜜' },
                  ].map((item) => (
                    <button
                      key={item.query}
                      onClick={() => setQuery(item.query)}
                      className="text-left p-3 rounded-lg border hover:bg-muted transition-colors"
                    >
                      <span className="text-sm font-medium">{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </ScrollArea>

          {/* Footer */}
          <div className="border-t p-3 flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-4">
              <span>↑↓ 导航</span>
              <span>Enter 选择</span>
              <span>Esc 关闭</span>
            </div>
            <Badge variant="outline" className="text-xs">
              / 快捷键
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

/**
 * 搜索触发按钮（用于导航栏）
 */
export function SearchButton({ onClick }: { onClick: () => void }) {
  return (
    <Button
      variant="outline"
      className="w-full justify-start text-muted-foreground"
      onClick={onClick}
    >
      <Search className="w-4 h-4 mr-2" />
      搜索...
      <kbd className="ml-auto text-xs bg-muted px-1.5 py-0.5 rounded">/</kbd>
    </Button>
  );
}
