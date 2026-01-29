/**
 * 六祖坛经主页面（简化修复版）
 */

'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Search, ChevronRight } from 'lucide-react';

export default function PlatformSutraPage() {
  const params = useParams();
  const sutraSlug = 'platform-sutra';

  const [sutra, setSutra] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedChapter, setSelectedChapter] = useState<any>(null);
  const [activeSection, setActiveSection] = useState<any>(null);
  const [chapterCache, setChapterCache] = useState<Map<number, any>>(new Map());
  const [loadingChapter, setLoadingChapter] = useState<number | null>(null);

  // 加载经书
  useEffect(() => {
    async function loadSutra() {
      try {
        const response = await fetch(`/api/sutras/${sutraSlug}`);
        const data = await response.json();
        setSutra(data);
        if (data.chapters?.length > 0) {
          setSelectedChapter(data.chapters[0]);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadSutra();
  }, [sutraSlug]);

  // 加载章节内容
  useEffect(() => {
    if (!selectedChapter) return;

    const chapterNum = selectedChapter.chapterNum;
    if (chapterCache.has(chapterNum)) {
      setSelectedChapter(chapterCache.get(chapterNum));
      return;
    }

    async function loadChapter() {
      setLoadingChapter(chapterNum);
      try {
        const response = await fetch(`/api/sutras/${sutraSlug}/chapters/${selectedChapter.id}`);
        const chapter = await response.json();
        setChapterCache(new Map(chapterCache).set(chapterNum, chapter));
        setSelectedChapter(chapter);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingChapter(null);
      }
    }
    loadChapter();
  }, [selectedChapter?.id, chapterCache, sutraSlug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
          <p className="mt-4 text-gray-600">加载中...</p>
        </div>
      </div>
    );
  }

  if (!sutra) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
      {/* 头部 */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-sm border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center text-white font-bold">
                坛
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">{sutra.title}</h1>
                <p className="text-sm text-gray-600">{sutra.name}</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* 主内容 */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* 左侧：章节目录 */}
          <aside className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>章节目录</CardTitle>
                <CardDescription>{sutra.chapters?.length} 个章节</CardDescription>
              </CardHeader>
              <CardContent className="p-2 space-y-1 max-h-[calc(100vh-8rem)] overflow-y-auto">
                {sutra.chapters?.map((chapter: any) => (
                  <button
                    key={chapter.id}
                    onClick={() => setSelectedChapter(chapter)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      selectedChapter?.id === chapter.id
                        ? 'bg-orange-100 text-orange-900 border-orange-400'
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <Badge className="bg-orange-500 text-white">
                          {chapter.chapterNum}
                        </Badge>
                        <span className="font-medium">{chapter.title}</span>
                      </div>
                      <ChevronRight className="h-4 w-4 text-gray-400" />
                    </div>
                  </button>
                ))}
              </CardContent>
            </Card>
          </aside>

          {/* 右侧：章节内容 */}
          <section className="lg:col-span-3">
            <Card>
              <CardHeader>
                <div>
                  <CardTitle>第 {selectedChapter?.chapterNum} 章 {selectedChapter?.title}</CardTitle>
                  {loadingChapter && (
                    <div className="flex items-center gap-2 text-orange-600 text-sm mt-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-500"></div>
                      加载中...
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="p-6">
                {selectedChapter?.sections?.map((section: any) => (
                  <div
                    key={section.id}
                    id={`section-${section.sectionNum}`}
                    className={`mb-6 p-4 rounded-lg border transition-colors ${
                      activeSection?.id === section.id
                        ? 'border-orange-400 bg-orange-50'
                        : 'border-gray-200 hover:border-orange-200'
                    }`}
                  >
                    <button
                      onClick={() => setActiveSection(section)}
                      className="w-full text-left"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <Badge className="bg-orange-500 text-white">
                          第 {section.sectionNum} 段
                        </Badge>
                        {section.heading && (
                          <span className="font-bold text-lg">{section.heading}</span>
                        )}
                      </div>
                      {activeSection?.id === section.id && (
                        <div className="text-justify leading-loose text-lg font-serif text-gray-900 p-4 bg-white rounded">
                          {section.content}
                        </div>
                      )}
                    </button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </section>
        </div>
      </main>

      {/* 底部 */}
      <footer className="mt-12 py-8 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-sm text-gray-600">
            <p>{sutra.description}</p>
            <p className="mt-2">基于《门人法海编集》版本</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
