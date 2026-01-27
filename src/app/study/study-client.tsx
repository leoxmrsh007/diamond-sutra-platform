/**
 * 经文学习页面 - 客户端组件
 * 数据由服务端组件传入
 */

'use client';

import Image from 'next/image';
import { useEffect, useRef, useState, useMemo, useCallback, memo } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Slider } from '@/components/ui/slider';
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
  Loader2,
} from 'lucide-react';

import { NoteDialog } from '@/components/study/note-dialog';
import {
  BookmarkDialog,
  BookmarkList,
  BookmarkItem,
} from '@/components/study/bookmark-dialog';
import { DailyCheckIn } from '@/components/study/daily-check-in';

type DisplayMode = 'verse' | 'chapter';

interface AiAnalysis {
  summary?: string;
  [key: string]: unknown;
}

export interface Verse {
  id: string;
  chapterId: string;
  verseNum: number;
  chinese: string;
  sanskrit?: string | null;
  english?: string | null;
  aiKeyword: unknown;
  aiAnalysis?: AiAnalysis | null;
}

export interface Chapter {
  id: string;
  chapterNum: number;
  title: string;
  summary: string | null;
  imageUrl?: string | null;
  verses: Verse[];
}

interface StudyProgress {
  id: string;
  verseId: string;
  status: 'NOT_STARTED' | 'LEARNING' | 'MEMORIZED' | 'MASTERED';
  recitationCount: number;
  lastStudiedAt: Date | null;
}

interface StudyPageClientProps {
  initialData: {
    chapters: Chapter[];
  };
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
        ? 'bg-amber-100 text-amber-900 font-medium'
        : 'hover:bg-muted'
    }`}
  >
    <div className="flex items-start justify-between gap-2">
      <div className="text-sm flex-1">{chapter.title}</div>
      {hasProgress && (
        <Badge variant="secondary" className="text-xs bg-amber-200 text-amber-800">
          ✓
        </Badge>
      )}
    </div>
  </button>
));
ChapterItem.displayName = 'ChapterItem';

// 优化的偈颂项组件
const VerseItem = memo(({
  verse,
  index,
  isAuthenticated,
  studyProgress,
}: {
  verse: Verse;
  index: number;
  isAuthenticated: boolean;
  studyProgress: Record<string, StudyProgress>;
}) => {
  const progress = studyProgress[verse.id];
  return (
    <div key={verse.id} className="border-b pb-6 last:border-0">
      <div className="flex items-center gap-2 mb-3">
        <Badge variant="outline" className="text-amber-700 border-amber-300">
          偈 {verse.verseNum}
        </Badge>
        {isAuthenticated && progress && (
          <Badge
            variant={
              progress.status === 'MASTERED'
                ? 'default'
                : 'secondary'
            }
            className={
              progress.status === 'MASTERED'
                ? 'bg-green-100 text-green-800'
                : ''
            }
          >
            {progress.status === 'LEARNING' && '学习中'}
            {progress.status === 'MEMORIZED' &&
              `已背诵${progress.recitationCount}次`}
            {progress.status === 'MASTERED' && '已掌握'}
          </Badge>
        )}
      </div>

      <div className="text-xl leading-loose font-serif text-foreground mb-4">
        {verse.chinese}
      </div>
    </div>
  );
});
VerseItem.displayName = 'VerseItem';

export function StudyPageClient({ initialData }: StudyPageClientProps) {
  const [chapters, setChapters] = useState<Chapter[]>(initialData.chapters);
  const [currentChapter, setCurrentChapter] = useState<Chapter | null>(initialData.chapters[0] || null);
  const [selectedChapterId, setSelectedChapterId] = useState<string>(initialData.chapters[0]?.id || '');
  const [selectedVerse, setSelectedVerse] = useState<Verse | null>(
    initialData.chapters[0]?.verses[0] || null
  );
  const [selectedVerseIndex, setSelectedVerseIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('chinese');
  const [studyProgress, setStudyProgress] = useState<Record<string, StudyProgress>>({});
  const bookmarks: BookmarkItem[] = [];
  const [displayMode, setDisplayMode] = useState<DisplayMode>('chapter');

  const isAuthenticated = false;

  // 朗读状态
  const [isReading, setIsReading] = useState(false);
  const [readingSpeed, setReadingSpeed] = useState(1);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // 背景音乐状态
  const [isBGMPlaying, setIsBGMPlaying] = useState(false);
  const [bgmVolume, setBgmVolume] = useState([50]);
  const bgmAudioRef = useRef<HTMLAudioElement | null>(null);

  // 使用 useMemo 优化偈颂数组
  const verses = useMemo(() => currentChapter?.verses || [], [currentChapter]);

  // 切换章节 - 数据已在本地，瞬间完成
  const handleChapterChange = useCallback((chapterId: string) => {
    const chapter = chapters.find((c) => c.id === chapterId);
    if (!chapter) return;

    setCurrentChapter(chapter);
    setSelectedChapterId(chapterId);

    if (chapter.verses && chapter.verses.length > 0) {
      setSelectedVerse(chapter.verses[0]);
      setSelectedVerseIndex(0);
    }
  }, [chapters]);

  // 导航到下一章/上一章
  const goToNextChapter = useCallback(() => {
    const currentIndex = chapters.findIndex((c) => c.id === selectedChapterId);
    if (currentIndex < chapters.length - 1) {
      handleChapterChange(chapters[currentIndex + 1].id);
    }
  }, [chapters, selectedChapterId, handleChapterChange]);

  const goToPrevChapter = useCallback(() => {
    const currentIndex = chapters.findIndex((c) => c.id === selectedChapterId);
    if (currentIndex > 0) {
      handleChapterChange(chapters[currentIndex - 1].id);
    }
  }, [chapters, selectedChapterId, handleChapterChange]);

  // 导航到下一偈/上一偈
  const goToNextVerse = useCallback(() => {
    if (!currentChapter?.verses || !currentChapter.verses.length || selectedVerseIndex >= currentChapter.verses.length - 1) {
      goToNextChapter();
      return;
    }
    const nextIndex = selectedVerseIndex + 1;
    setSelectedVerse(currentChapter.verses[nextIndex]);
    setSelectedVerseIndex(nextIndex);
  }, [currentChapter, selectedVerseIndex, goToNextChapter]);

  const goToPrevVerse = useCallback(() => {
    if (selectedVerseIndex <= 0) {
      goToPrevChapter();
      return;
    }
    const prevIndex = selectedVerseIndex - 1;
    if (currentChapter?.verses && currentChapter.verses[prevIndex]) {
      setSelectedVerse(currentChapter.verses[prevIndex]);
      setSelectedVerseIndex(prevIndex);
    }
  }, [currentChapter, selectedVerseIndex, goToPrevChapter]);

  // 保存学习进度
  const saveStudyProgress = async (status: StudyProgress['status']) => {
    if (!isAuthenticated || !selectedVerse) return;
    // TODO: 实现保存进度
  };

  // 朗读功能
  const startReading = () => {
    if (!selectedVerse) return;

    window.speechSynthesis.cancel();

    const text = selectedVerse.chinese;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'zh-CN';
    utterance.rate = readingSpeed;
    utterance.pitch = 1;
    utterance.volume = 1;

    utterance.onend = () => {
      setIsReading(false);
      goToNextVerse();
      setTimeout(() => {
        if (!isReading) startReading();
      }, 500);
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
    setIsReading(true);
    saveStudyProgress('LEARNING');
  };

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
    const currentIndex = chapters.findIndex((c) => c.id === selectedChapterId);
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
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-amber-600" />
            经文学习
          </h1>
          <p className="text-muted-foreground">
            金刚般若波罗蜜经 · 32分 · 罗什译本
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Chapter List */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="text-lg">三十二分</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[500px] overflow-y-auto">
                <div className="space-y-1">
                  {chapters.map((chapter) => {
                    const firstVerseId = chapter.verses && chapter.verses.length > 0 ? chapter.verses[0].id : null;
                    const progress = firstVerseId ? studyProgress[firstVerseId] : null;
                    const hasProgress = Boolean(progress && progress.status !== 'NOT_STARTED');
                    const isSelected = selectedChapterId === chapter.id;

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

          {/* Verse Content */}
          <Card className="lg:col-span-2">
            <CardHeader className="border-b">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <CardTitle className="text-xl mb-1">
                    {currentChapter?.title}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {displayMode === 'chapter'
                      ? `共 ${verses.length} 偈`
                      : `偈颂 ${selectedVerseIndex + 1} / ${verses.length}`
                    }
                  </p>
                </div>
                <div className="flex gap-2 ml-4">
                  <div className="flex border rounded-md p-0.5 mr-2">
                    <Button
                      size="sm"
                      variant={displayMode === 'chapter' ? 'default' : 'ghost'}
                      className="h-7 px-2 text-xs"
                      onClick={() => setDisplayMode('chapter')}
                    >
                      <List className="w-3 h-3 mr-1" />
                      整章
                    </Button>
                    <Button
                      size="sm"
                      variant={displayMode === 'verse' ? 'default' : 'ghost'}
                      className="h-7 px-2 text-xs"
                      onClick={() => setDisplayMode('verse')}
                    >
                      <FileText className="w-3 h-3 mr-1" />
                      逐偈
                    </Button>
                  </div>
                  {displayMode === 'verse' && (
                    <>
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={goToPrevVerse}
                        disabled={!currentChapter || selectedVerseIndex === 0}
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={goToNextVerse}
                        disabled={
                          !currentChapter ||
                          (currentChapter.chapterNum === 32 && selectedVerseIndex === verses.length - 1)
                        }
                      >
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </>
                  )}
                </div>
              </div>

              {currentChapter?.imageUrl && (
                <div className="mt-4 rounded-lg overflow-hidden border relative h-48">
                  <Image
                    src={currentChapter.imageUrl}
                    alt={currentChapter.title}
                    fill
                    className="object-cover"
                    sizes="(min-width: 1024px) 768px, 100vw"
                    priority
                  />
                </div>
              )}

              <div className="flex flex-wrap gap-3 mt-4">
                <Button
                  size="sm"
                  variant={isReading ? "destructive" : "outline"}
                  onClick={isReading ? pauseReading : startReading}
                  disabled={!selectedVerse || (displayMode === 'chapter' && verses.length === 0)}
                >
                  {isReading ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
                  {isReading ? '暂停朗读' : (displayMode === 'chapter' ? '朗读本章' : '朗读经文')}
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
            </CardHeader>

            <CardContent className="p-6">
              {displayMode === 'chapter' ? (
                verses.length > 0 ? (
                  <div className="space-y-6">
                    <div className="h-[500px] overflow-y-auto pr-4">
                      <div className="space-y-6">
                        {verses.map((verse, index) => (
                          <div key={verse.id} className="border-b pb-6 last:border-0">
                            <div className="flex items-center gap-2 mb-3">
                              <Badge variant="outline" className="text-amber-700 border-amber-300">
                                偈 {verse.verseNum}
                              </Badge>
                            </div>

                            <div className="text-xl leading-loose font-serif text-foreground mb-4">
                              {verse.chinese}
                            </div>

                            {verse.english && (
                              <div className="text-base leading-relaxed text-muted-foreground mb-3 pl-4 border-l-2 border-amber-200">
                                {verse.english}
                              </div>
                            )}

                            {verse.sanskrit && (
                              <div className="text-sm text-muted-foreground italic mb-3">
                                {verse.sanskrit}
                              </div>
                            )}

                            <div className="flex gap-2 mt-3">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 text-xs"
                                onClick={() => {
                                  setSelectedVerse(verse);
                                  setSelectedVerseIndex(index);
                                  startReading();
                                }}
                              >
                                <Volume2 className="w-3 h-3 mr-1" />
                                朗读
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="h-[400px] flex items-center justify-center text-muted-foreground">
                    该章节内容正在整理中...
                  </div>
                )
              ) : (
                selectedVerse ? (
                  <div className="space-y-6">
                    <ScrollArea className="h-[350px]">
                      <Tabs value={activeTab} onValueChange={setActiveTab}>
                        <TabsList className="grid w-full grid-cols-4 mb-4">
                          <TabsTrigger value="chinese">汉译</TabsTrigger>
                          <TabsTrigger value="english">英译</TabsTrigger>
                          <TabsTrigger value="sanskrit">梵文</TabsTrigger>
                          <TabsTrigger value="analysis">AI解析</TabsTrigger>
                        </TabsList>

                        <TabsContent value="chinese" className="space-y-4">
                          <div className="text-2xl leading-relaxed font-serif text-foreground">
                            {selectedVerse.chinese}
                          </div>
                        </TabsContent>

                        <TabsContent value="english" className="space-y-4">
                          <div className="text-lg leading-relaxed text-muted-foreground font-serif">
                            {selectedVerse.english || '英译文本正在整理中...'}
                          </div>
                        </TabsContent>

                        <TabsContent value="sanskrit" className="space-y-4">
                          <div className="text-lg leading-relaxed text-muted-foreground font-serif">
                            {selectedVerse.sanskrit || '梵文正在整理中...'}
                          </div>
                        </TabsContent>

                        <TabsContent value="analysis" className="space-y-4">
                          <div className="bg-amber-50 rounded-lg p-4 space-y-3">
                            <div className="flex items-center gap-2 text-amber-700">
                              <Sparkles className="w-4 h-4" />
                              <span className="font-medium">AI 解析</span>
                            </div>
                            <p className="text-amber-900">
                              {selectedVerse.aiAnalysis?.summary || '正在生成解析...'}
                            </p>
                          </div>
                        </TabsContent>
                      </Tabs>
                    </ScrollArea>

                    <div className="flex justify-between pt-4 border-t">
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={isReading ? pauseReading : startReading}
                        >
                          <Volume2 className="w-4 h-4 mr-2" />
                          朗读此偈
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="h-[400px] flex items-center justify-center text-muted-foreground">
                    该章节内容正在整理中...
                  </div>
                )
              )}
            </CardContent>
          </Card>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            <DailyCheckIn />

            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  学习进度
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>已学习</span>
                    <span className="font-medium">
                      {chapters.findIndex((c) => c.id === selectedChapterId) + 1}/32
                    </span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber-500 rounded-full transition-all"
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
                  上一分
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start" onClick={goToNextChapter}>
                  <SkipForward className="w-4 h-4 mr-2" />
                  下一分
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
                    {currentChapter.summary}
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
