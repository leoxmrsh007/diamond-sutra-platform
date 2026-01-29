/**
 * 六祖坛经学习页面 - 与金刚经一致的交互方式
 * 支持朗读、背景音乐、学习进度、笔记等功能
 */

'use client';

import { useEffect, useState, useRef, useMemo, useCallback, memo } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import { LoadingSpinner } from '@/components/ui/loading';
import {
  BookOpen,
  Volume2,
  Bookmark,
  FileText,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Music,
  List,
  ChevronDown,
  ChevronUp,
  ArrowLeft as ArrowBack,
} from 'lucide-react';

import { NoteDialog } from '@/components/study/note-dialog';
import {
  BookmarkDialog,
  BookmarkList,
  BookmarkItem,
} from '@/components/study/bookmark-dialog';
import { DailyCheckIn } from '@/components/study/daily-check-in';
import Link from 'next/link';

type DisplayMode = 'section' | 'full';

interface AiAnalysis {
  summary?: string;
  [key: string]: unknown;
}

export interface Section {
  id: string;
  sectionNum: number;
  heading?: string | null;
  content: string;
  modern?: string | null;
  notes?: string | null;
  aiKeyword?: unknown;
  aiAnalysis?: AiAnalysis | null;
}

export interface Chapter {
  id: string;
  chapterNum: number;
  title: string;
  summary: string | null;
  imageUrl?: string | null;
  sections: Section[];
}

// Chapter类型用于目录列表
type ChapterListItem = {
  id: string;
  chapterNum: number;
  title: string;
  summary: string | null;
  _count?: { sections: number };
}

interface StudyProgress {
  id: string;
  sectionId: string;
  status: 'NOT_STARTED' | 'LEARNING' | 'MEMORIZED' | 'MASTERED';
  recitationCount: number;
  lastStudiedAt: Date | null;
}

interface PlatformSutraClientProps {
  sutra: {
    id: string;
    title: string;
    description: string;
  };
  chapters: Chapter[];
  initialChapterNum?: number;
}

// 优化的章节项组件
const ChapterItem = memo(({
  chapter,
  isSelected,
  hasProgress,
  onClick,
}: {
  chapter: Chapter;
  isSelected: boolean;
  hasProgress: boolean;
  onClick: () => void;
}) => (
    <button
      onClick={onClick}
      className={`w-full text-left p-3 rounded-lg transition-colors relative ${
        isSelected
          ? 'bg-green-100 dark:bg-green-900/20 text-green-900 dark:text-green-100 font-medium'
          : 'hover:bg-muted'
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="text-sm flex-1 flex items-center gap-2">
          <Badge variant="secondary" className="text-xs bg-green-200 text-green-800 shrink-0">
            {chapter.chapterNum}
          </Badge>
          <span className="truncate">{chapter.title}</span>
        </div>
        {hasProgress && (
          <Badge variant="secondary" className="text-xs bg-green-300 text-green-900">
            ✓
          </Badge>
        )}
      </div>
    </button>
));
ChapterItem.displayName = 'ChapterItem';

// 优化的段落项组件
const SectionItem = memo(({
  section,
  index,
  expanded,
  isAuthenticated,
  studyProgress,
  onToggle,
  onRead,
}: {
  section: Section;
  index: number;
  expanded: boolean;
  isAuthenticated: boolean;
  studyProgress: Record<string, StudyProgress>;
  onToggle: () => void;
  onRead: () => void;
}) => {
  const progress = studyProgress[section.id];
  
  return (
    <div className={`border rounded-lg overflow-hidden ${expanded ? 'bg-background' : 'bg-muted/30'}`}>
      {/* 段落头部 - 始终显示 */}
      <div className="p-4 border-b bg-muted/50">
        <div
          onClick={onToggle}
          className="w-full flex items-center justify-between gap-3 text-left group cursor-pointer hover:bg-muted/50 transition-colors rounded-lg p-2 -m-2"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onToggle();
            }
          }}
        >
          <div className="flex items-center gap-3 flex-1">
            <Badge variant="outline" className="text-green-700 border-green-300">
              段 {section.sectionNum}
            </Badge>
            {section.heading && (
              <span className="font-medium text-sm group-hover:text-green-700 dark:group-hover:text-green-300 transition-colors">
                {section.heading}
              </span>
            )}
            {isAuthenticated && progress && (
              <Badge
                variant={progress.status === 'MASTERED' ? 'default' : 'secondary'}
                className={progress.status === 'MASTERED' ? 'bg-green-100 text-green-800' : ''}
              >
                {progress.status === 'LEARNING' && '学习中'}
                {progress.status === 'MEMORIZED' && `已背诵${progress.recitationCount}次`}
                {progress.status === 'MASTERED' && '已掌握'}
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            <div
              onClick={(e) => {
                e.stopPropagation();
                onRead();
              }}
              className="flex items-center gap-1 cursor-pointer hover:bg-muted/50 transition-colors rounded px-2 py-1"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onRead();
                }
              }}
            >
              <Volume2 className="w-4 h-4 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">朗读</span>
            </div>
            {expanded ? (
              <ChevronUp className="w-5 h-5 text-muted-foreground" />
            ) : (
              <ChevronDown className="w-5 h-5 text-muted-foreground" />
            )}
          </div>
        </div>
      </div>

      {/* 段落内容 - 展开显示 */}
      {expanded && (
        <div className="p-6 space-y-4">
          {/* 原文 */}
          <div className="text-lg leading-loose font-serif text-foreground whitespace-pre-wrap break-words">
            {section.content}
          </div>

          {/* 白话翻译 */}
          {section.modern && (
            <>
              <Separator />
              <div className="bg-muted/50 p-4 rounded-lg">
                <p className="text-sm text-muted-foreground mb-2 font-medium flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  白话解说
                </p>
                <p className="text-base text-foreground whitespace-pre-wrap break-words">
                  {section.modern}
                </p>
              </div>
            </>
          )}

          {/* 注释 */}
          {section.notes && (
            <div className="text-sm text-muted-foreground bg-amber-50 dark:bg-amber-900/20 p-3 rounded-lg">
              <span className="font-medium">注：</span>
              {section.notes}
            </div>
          )}

          {/* AI解析 */}
          {section.aiAnalysis?.summary && (
            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
              <p className="text-sm text-green-900 dark:text-green-100 mb-2 font-medium flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                AI 解析
              </p>
              <p className="text-sm text-green-900 dark:text-green-100">
                {section.aiAnalysis.summary}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
});
SectionItem.displayName = 'SectionItem';

export default function PlatformSutraClient({
  sutra,
  chapters,
  initialChapterNum,
}: PlatformSutraClientProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('chinese');
  const [studyProgress, setStudyProgress] = useState<Record<string, StudyProgress>>({});
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);
  const [displayMode, setDisplayMode] = useState<DisplayMode>('section');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // 朗读状态
  const [isReading, setIsReading] = useState(false);
  const [readingSpeed, setReadingSpeed] = useState(1);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // 背景音乐状态
  const [isBGMPlaying, setIsBGMPlaying] = useState(false);
  const [bgmVolume, setBgmVolume] = useState([50]);
  const bgmAudioRef = useRef<HTMLAudioElement | null>(null);

  // 使用 useMemo 优化数据
  const currentChapter = useMemo(() => {
    if (!chapters || chapters.length === 0) return null;
    if (initialChapterNum) {
      return chapters.find((c) => c.chapterNum === initialChapterNum) || chapters[0];
    }
    return chapters[0];
  }, [chapters, initialChapterNum]);

  const sections = useMemo(() => currentChapter?.sections || [], [currentChapter]);

  // 默认展开前3个段落
  useEffect(() => {
    if (currentChapter && sections.length > 0) {
      const defaultExpanded = new Set<string>(
        sections.slice(0, 3).map((s) => s.id)
      );
      setExpandedSections(defaultExpanded);
    }
  }, [currentChapter?.id, sections]);

  // 切换章节 - 使用本地状态而不是URL导航
  const handleChapterChange = useCallback((chapterId: string) => {
    const chapter = chapters.find((c) => c.id === chapterId);
    if (!chapter) {
      console.error('未找到章节:', chapterId);
      return;
    }

    // 更新URL但不刷新页面
    const url = new URL(window.location.href);
    url.searchParams.set('chapter', chapter.chapterNum.toString());
    window.history.pushState({}, '', url.toString());
  }, [chapters]);

  // 切换段落展开/收起
  const toggleSection = useCallback((sectionId: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(sectionId)) {
        next.delete(sectionId);
      } else {
        next.add(sectionId);
      }
      return next;
    });
  }, []);

  // 展开/收起全部
  const expandAll = useCallback(() => {
    const allIds = sections.map((s) => s.id);
    setExpandedSections(new Set(allIds));
  }, [sections]);

  const collapseAll = useCallback(() => {
    setExpandedSections(new Set());
  }, []);

  // 导航到下一品/上一品
  const goToNextChapter = useCallback(() => {
    if (!currentChapter) return;
    const currentIndex = chapters.findIndex((c) => c.id === currentChapter.id);
    if (currentIndex < chapters.length - 1) {
      handleChapterChange(chapters[currentIndex + 1].id);
    }
  }, [chapters, currentChapter, handleChapterChange]);

  const goToPrevChapter = useCallback(() => {
    if (!currentChapter) return;
    const currentIndex = chapters.findIndex((c) => c.id === currentChapter.id);
    if (currentIndex > 0) {
      handleChapterChange(chapters[currentIndex - 1].id);
    }
  }, [chapters, currentChapter, handleChapterChange]);

  // 保存学习进度
  const saveStudyProgress = async (sectionId: string, status: StudyProgress['status']) => {
    if (!isAuthenticated) return;
    // TODO: 实现保存进度
  };

  // 朗读功能
  const startReading = useCallback((section?: Section) => {
    const textToRead = section ? section.content : sections[0]?.content;
    if (!textToRead) return;

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.lang = 'zh-CN';
    utterance.rate = readingSpeed;
    utterance.pitch = 1;
    utterance.volume = 1;

    utterance.onend = () => {
      setIsReading(false);
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
    setIsReading(true);
    
    if (section) {
      saveStudyProgress(section.id, 'LEARNING');
    }
  }, [sections, readingSpeed, isAuthenticated]);

  const pauseReading = () => {
    window.speechSynthesis.cancel();
    setIsReading(false);
  };

  // 背景音乐功能
  useEffect(() => {
    bgmAudioRef.current = new Audio('/bgm/zen-music.mp3');
    bgmAudioRef.current.loop = true;
    bgmAudioRef.current.volume = 0.5;

    return () => {
      if (bgmAudioRef.current) {
        bgmAudioRef.current.pause();
        bgmAudioRef.current = null;
      }
    };
  }, []);

  const toggleBGM = () => {
    if (!bgmAudioRef.current) return;

    if (isBGMPlaying) {
      bgmAudioRef.current.pause();
    } else {
      bgmAudioRef.current.play().catch(() => {
        console.log('背景音乐文件不存在');
      });
    }
    setIsBGMPlaying(!isBGMPlaying);
  };

  const handleVolumeChange = (value: number[]) => {
    setBgmVolume(value);
    if (bgmAudioRef.current) {
      bgmAudioRef.current.volume = value[0] / 100;
    }
  };

  // 计算学习进度
  const getProgressPercentage = () => {
    if (!currentChapter) return 0;
    const currentIndex = chapters.findIndex((c) => c.id === currentChapter.id);
    return currentIndex >= 0 ? Math.round(((currentIndex + 1) / chapters.length) * 100) : 0;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container max-w-7xl mx-auto px-4 py-8 flex items-center justify-center min-h-[500px]">
          <LoadingSpinner />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <Link href="/" className="inline-flex">
              <ArrowBack className="w-5 h-5 text-muted-foreground hover:text-foreground" />
            </Link>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <BookOpen className="w-8 h-8 text-green-600" />
              六祖坛经
            </h1>
          </div>
          <p className="text-muted-foreground">
            {sutra.title} · 十品 · 惠能大师
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Chapter List */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="text-lg">目录</CardTitle>
              <CardDescription>共 {chapters.length} 品</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[500px] overflow-y-auto">
                <div className="space-y-1">
                  {chapters.map((chapter) => {
                    const firstSectionId = chapter.sections.length > 0 ? chapter.sections[0].id : null;
                    const progress = firstSectionId ? studyProgress[firstSectionId] : null;
                    const hasProgress = Boolean(progress && progress.status !== 'NOT_STARTED');
                    const isSelected = currentChapter?.id === chapter.id;

                    return (
                      <ChapterItem
                        key={chapter.id}
                        chapter={chapter}
                        isSelected={isSelected}
                        hasProgress={hasProgress}
                        onClick={() => handleChapterChange(chapter.id)}
                      />
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Content */}
          <Card className="lg:col-span-2">
            {!currentChapter ? (
              <CardContent className="p-12 text-center">
                <BookOpen className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <h2 className="text-2xl font-bold mb-2">选择要学习的品</h2>
                <p className="text-muted-foreground">
                  从左侧目录选择一个品开始学习
                </p>
              </CardContent>
            ) : (
              <>
                <CardHeader className="border-b">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-1">
                        {currentChapter.title}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">
                        共 {sections.length} 段
                      </p>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <div className="flex border rounded-md p-0.5 mr-2">
                        <Button
                          size="sm"
                          variant={displayMode === 'section' ? 'default' : 'ghost'}
                          className="h-7 px-2 text-xs"
                          onClick={() => setDisplayMode('section')}
                        >
                          <ChevronDown className="w-3 h-3 mr-1" />
                          分段
                        </Button>
                        <Button
                          size="sm"
                          variant={displayMode === 'full' ? 'default' : 'ghost'}
                          className="h-7 px-2 text-xs"
                          onClick={() => setDisplayMode('full')}
                        >
                          <FileText className="w-3 h-3 mr-1" />
                          全文
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3 mt-4">
                    <Button
                      size="sm"
                      variant={isReading ? "destructive" : "outline"}
                      onClick={isReading ? pauseReading : () => startReading()}
                      disabled={sections.length === 0}
                    >
                      {isReading ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
                      {isReading ? '暂停朗读' : '朗读本章'}
                    </Button>

                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant={isBGMPlaying ? "default" : "outline"}
                        onClick={toggleBGM}
                      >
                        {isBGMPlaying ? <Pause className="w-4 h-4 mr-2" /> : <Music className="w-4 h-4 mr-2" />}
                        {isBGMPlaying ? '禅音' : '背景音'}
                      </Button>
                      {isBGMPlaying && (
                        <div className="flex items-center gap-2 w-24">
                          <Volume2 className="w-4 h-4 text-muted-foreground" />
                          <Slider
                            value={bgmVolume}
                            onValueChange={handleVolumeChange}
                            max={100}
                            step={1}
                            className="flex-1"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {isReading && (
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs text-muted-foreground">朗读速度:</span>
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant={readingSpeed === 0.5 ? "default" : "outline"}
                          onClick={() => setReadingSpeed(0.5)}
                        >0.5x</Button>
                        <Button
                          size="sm"
                          variant={readingSpeed === 1 ? "default" : "outline"}
                          onClick={() => setReadingSpeed(1)}
                        >1x</Button>
                        <Button
                          size="sm"
                          variant={readingSpeed === 1.5 ? "default" : "outline"}
                          onClick={() => setReadingSpeed(1.5)}
                        >1.5x</Button>
                      </div>
                    </div>
                  )}

                  {displayMode === 'section' && (
                    <div className="flex gap-2 mt-4">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={expandAll}
                      >
                        展开全部
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={collapseAll}
                      >
                        收起全部
                      </Button>
                    </div>
                  )}
                </CardHeader>

                <CardContent className="p-6">
                  {currentChapter.summary && (
                    <div className="mb-6 p-4 bg-muted/50 rounded-lg">
                      <p className="text-sm text-muted-foreground">
                        {currentChapter.summary}
                      </p>
                    </div>
                  )}

                  {displayMode === 'section' ? (
                    <div className="space-y-4">
                      <div className="h-[500px] overflow-y-auto pr-4">
                        <div className="space-y-4">
                          {sections.map((section, index) => (
                            <SectionItem
                              key={section.id}
                              section={section}
                              index={index}
                              expanded={expandedSections.has(section.id)}
                              isAuthenticated={isAuthenticated}
                              studyProgress={studyProgress}
                              onToggle={() => toggleSection(section.id)}
                              onRead={() => startReading(section)}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="h-[500px] overflow-y-auto pr-4">
                        <div className="space-y-4">
                          {sections.map((section) => (
                            <div key={section.id} className="pb-4 border-b last:border-0">
                              <div className="text-lg leading-loose font-serif text-foreground mb-3 whitespace-pre-wrap break-words">
                                {section.content}
                              </div>
                              {section.modern && (
                                <div className="bg-muted/50 p-4 rounded-lg">
                                  <p className="text-sm text-muted-foreground mb-2 font-medium">
                                    白话解说
                                  </p>
                                  <p className="text-base text-foreground whitespace-pre-wrap break-words">
                                    {section.modern}
                                  </p>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </>
            )}
          </Card>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            <DailyCheckIn />

            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-green-600" />
                  学习进度
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>已学习</span>
                    <span className="font-medium">
                      {currentChapter ? chapters.findIndex((c) => c.id === currentChapter.id) + 1 : 0}/{chapters.length}
                    </span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-500 rounded-full transition-all"
                      style={{ width: `${getProgressPercentage()}%` }}
                    />
                  </div>
                  <div className="text-xs text-muted-foreground">
                    约 {getProgressPercentage()}% 完成
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">快捷操作</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" size="sm" className="w-full justify-start" onClick={goToPrevChapter}>
                  <SkipBack className="w-4 h-4 mr-2" />
                  上一品
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start" onClick={goToNextChapter}>
                  <SkipForward className="w-4 h-4 mr-2" />
                  下一品
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start" asChild>
                  <a href="/ai">
                    <Sparkles className="w-4 h-4 mr-2" />
                    请求AI讲解
                  </a>
                </Button>
              </CardContent>
            </Card>

            {currentChapter && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">本章概要</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {currentChapter.summary || '暂无概要'}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
