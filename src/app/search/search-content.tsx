'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Search,
  BookOpen,
  MessageSquare,
  FileText,
  Filter,
} from 'lucide-react';

interface SearchResult {
  id: string;
  type: 'verse' | 'chapter' | 'course' | 'post' | 'note';
  title: string;
  content: string;
  category: string;
  href: string;
  chapter?: string;
}

const allResults: SearchResult[] = [
  // 偈颂
  {
    id: 'v1',
    type: 'verse',
    title: '一切有为法，如梦幻泡影',
    content: '如露亦如电，应作如是观。这是《金刚经》中最著名的偈颂之一，揭示世间万法的无常本质。',
    category: '第三十二分',
    href: '/study?chapter=32&verse=1',
  },
  {
    id: 'v2',
    type: 'verse',
    title: '应无所住而生其心',
    content: '菩萨于法，应无所住行于布施。所谓不住色布施，不住声香味触法布施。',
    category: '第十分',
    href: '/study?chapter=10&verse=1',
  },
  {
    id: 'v3',
    type: 'verse',
    title: '凡所有相，皆是虚妄',
    content: '若见诸相非相，则见如来。说明一切现象都是因缘和合而成，没有永恒不变的自性。',
    category: '第五分',
    href: '/study?chapter=5&verse=1',
  },
  {
    id: 'v4',
    type: 'verse',
    title: '所有一切众生之类，我皆令入无余涅槃而灭度之',
    content: '如是灭度无量无数无边众生，实无众生得灭度者。菩萨要发大愿心度众生，但不执着有众生可度。',
    category: '第三分',
    href: '/study?chapter=3&verse=1',
  },
  // 章节
  {
    id: 'c1',
    type: 'chapter',
    title: '大乘正宗分第三',
    content: '佛陀回答须菩提的问题，阐述菩萨应如何发心、如何降伏其心。核心是"无住生心"的菩萨精神。',
    category: '章节',
    href: '/study?chapter=3',
  },
  {
    id: 'c2',
    type: 'chapter',
    title: '如理实见分第五',
    content: '阐述不可以身相见如来，因为如来所说身相，即非身相，是名身相。',
    category: '章节',
    href: '/study?chapter=5',
  },
  // 课程
  {
    id: 'co1',
    type: 'course',
    title: '《金刚经》入门导读',
    content: '适合初学者的入门课程，系统讲解《金刚经》的基本概念、核心思想和修学方法。',
    category: '初级课程',
    href: '/courses/1',
  },
  {
    id: 'co2',
    type: 'course',
    title: '般若波罗蜜概说',
    content: '深入讲解"般若"（智慧）的概念，理解空性思想的基础。',
    category: '初级课程',
    href: '/courses/2',
  },
  // 社区帖子
  {
    id: 'p1',
    type: 'post',
    title: '如何理解"无住生心"在日常生活中的应用？',
    content: '最近在研读《金刚经》，对"无住生心"这个概念很感兴趣。但是在实际生活中，我们应该如何做到"心无所住"呢？',
    category: '修行实践',
    href: '/community',
  },
  {
    id: 'p2',
    type: 'post',
    title: '分享我的每日诵读心得',
    content: '每天早晨诵读《金刚经》已经成为我的习惯。经过三个月的坚持，感觉内心平静了许多...',
    category: '心得分享',
    href: '/community',
  },
];

const typeIcons = {
  verse: BookOpen,
  chapter: BookOpen,
  course: FileText,
  post: MessageSquare,
  note: FileText,
} as const;

type ApiSearchResult = {
  id: string;
  type: SearchResult['type'];
  title: string;
  content: string;
  category?: string;
  href: string;
  chapter?: string;
};

const isApiSearchResult = (value: unknown): value is ApiSearchResult => {
  if (!value || typeof value !== 'object') return false;
  const candidate = value as Record<string, unknown>;
  return (
    typeof candidate.id === 'string' &&
    typeof candidate.type === 'string' &&
    typeof candidate.title === 'string' &&
    typeof candidate.content === 'string' &&
    typeof candidate.href === 'string'
  );
};

export function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [searchQuery, setSearchQuery] = useState(query);
  const [activeTab, setActiveTab] = useState('all');
  const [results, setResults] = useState<SearchResult[]>(allResults);

  const performSearch = useCallback(async (q: string): Promise<SearchResult[]> => {
    if (!q.trim()) {
      return allResults;
    }
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
      const data: unknown = await res.json();
      const rawResults = Array.isArray((data as { results?: unknown })?.results)
        ? (data as { results: unknown[] }).results
        : [];
      const apiResults = rawResults.filter(isApiSearchResult).map((r) => ({
        id: r.id,
        type: r.type,
        title: r.title,
        content: r.content,
        category: r.category ?? '未分类',
        href: r.href,
        chapter: r.chapter,
      }));
      return apiResults.length > 0 ? apiResults : allResults;
    } catch {
      return [];
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      const next = await performSearch(query);
      if (!cancelled) {
        setResults(next);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [performSearch, query]);

  const handleSearch = () => {
    void (async () => {
      const next = await performSearch(searchQuery);
      setResults(next);
    })();
  };

  const filteredResults = activeTab === 'all'
    ? results
    : results.filter((r) => r.type === activeTab);

  const typeCounts = {
    all: results.length,
    verse: results.filter((r) => r.type === 'verse').length,
    chapter: results.filter((r) => r.type === 'chapter').length,
    course: results.filter((r) => r.type === 'course').length,
    post: results.filter((r) => r.type === 'post').length,
    note: results.filter((r) => r.type === 'note').length,
  };

  return (
    <>
      {/* Search Bar */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="搜索关键词..."
                className="pl-9"
              />
            </div>
            <Button onClick={handleSearch} className="bg-amber-500 hover:bg-amber-600">
              搜索
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {query && (
        <div className="mb-4 text-sm text-muted-foreground">
          找到 <span className="font-medium text-foreground">{results.length}</span> 条
          与 &ldquo;<span className="font-medium text-foreground">{query}</span>&rdquo; 相关的结果
        </div>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">
            全部 ({typeCounts.all})
          </TabsTrigger>
          <TabsTrigger value="verse">
            偈颂 ({typeCounts.verse})
          </TabsTrigger>
          <TabsTrigger value="chapter">
            章节 ({typeCounts.chapter})
          </TabsTrigger>
          <TabsTrigger value="course">
            课程 ({typeCounts.course})
          </TabsTrigger>
          <TabsTrigger value="post">
            社区 ({typeCounts.post})
          </TabsTrigger>
          <TabsTrigger value="note">
            笔记 ({typeCounts.note})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          {filteredResults.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>没有找到相关结果</p>
                <p className="text-sm mt-2">试试其他关键词吧</p>
              </CardContent>
            </Card>
          ) : (
            filteredResults.map((result) => {
              const Icon = typeIcons[result.type];
              return (
                <Card key={result.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                        <Icon className="w-5 h-5 text-amber-700" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline" className="text-xs">
                            {result.category}
                          </Badge>
                        </div>
                        <h3 className="font-medium mb-2 hover:text-amber-600 transition-colors">
                          <a href={result.href}>{result.title}</a>
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {result.content}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </TabsContent>
      </Tabs>

      {/* Hot Searches */}
      {!query && (
        <Card>
          <CardContent className="p-6">
            <h3 className="font-medium mb-4 flex items-center">
              <Filter className="w-4 h-4 mr-2" />
              热门搜索
            </h3>
            <div className="flex flex-wrap gap-2">
              {[
                '般若',
                '空性',
                '布施',
                '无住生心',
                '四相',
                '忍辱',
                '波罗蜜',
                '菩提心',
                '涅槃',
                '缘起',
              ].map((term) => (
                <Badge
                  key={term}
                  variant="outline"
                  className="cursor-pointer hover:bg-amber-50 hover:text-amber-700"
                  onClick={() => {
                    setSearchQuery(term);
                    performSearch(term);
                  }}
                >
                  {term}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
}
