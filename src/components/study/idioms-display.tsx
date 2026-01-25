/**
 * 成语/术语显示组件
 * Idioms and Terms Display Component
 */

'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Idiom {
  id: string;
  word: string;
  meaning: string;
  chapterNum: number;
  verseNum?: number;
  source?: string;
  category: string;
}

interface IdiomsDisplayProps {
  chapterId?: string;
  verseId?: string;
  limit?: number;
}

export function IdiomsDisplay({ chapterId, verseId, limit = 10 }: IdiomsDisplayProps) {
  const [idioms, setIdioms] = useState<Idiom[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const categoryLabels: Record<string, string> = {
    IDIOM: '成语',
    TERM: '术语',
    ALLUSION: '典故',
    PRINCIPLE: '法数',
  };

  useEffect(() => {
    async function loadIdioms() {
      try {
        const params = new URLSearchParams();
        if (chapterId) params.append('chapterNum', chapterId);
        if (verseId) params.append('verseId', verseId);
        params.append('limit', limit.toString());

        const response = await fetch(`/api/idioms?${params.toString()}`);
        const data = await response.json();
        setIdioms(data.idioms || []);
      } catch (error) {
        console.error('加载成语失败:', error);
      } finally {
        setIsLoading(false);
      }
    }

    if (chapterId || verseId) {
      loadIdioms();
    }
  }, [chapterId, verseId, limit]);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>📖 相关成语/术语</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (idioms.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>📖 相关成语/术语</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground py-4">
            暂无成语数据
          </p>
        </CardContent>
      </Card>
    );
  }

  // 按类别分组
  const groupedIdioms = idioms.reduce((acc, idiom) => {
    const category = idiom.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(idiom);
    return acc;
  }, {} as Record<string, Idiom[]>);

  return (
    <Card>
      <CardHeader>
        <CardTitle>📖 相关成语/术语</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {Object.entries(groupedIdioms).map(([category, items]) => (
            <div key={category} className="idiom-category">
              <h4 className="text-sm font-medium text-muted-foreground mb-2">
                {categoryLabels[category]}
              </h4>
              <div className="space-y-2">
                {items.map((idiom) => (
                  <div
                    key={idiom.id}
                    className="idiom-item p-3 border rounded-lg hover:bg-amber-50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="text-lg font-medium text-amber-900 mb-1">
                          {idiom.word}
                        </div>
                        <div className="text-sm">
                          {idiom.meaning}
                        </div>
                        {idiom.source && (
                          <p className="text-xs text-muted-foreground mt-1 italic">
                            「{idiom.source}」
                          </p>
                        )}
                      </div>
                      <Badge variant="outline" className="ml-2">
                        第{idiom.chapterNum}章
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>

      <style jsx>{`
        .idiom-item {
          border-color: rgba(184, 134, 11, 0.2);
        }

        .idiom-category h4 {
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
      `}</style>
    </Card>
  );
}
