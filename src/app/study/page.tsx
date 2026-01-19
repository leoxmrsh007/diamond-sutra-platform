/**
 * 经文学习页面 - 从数据库读取数据
 * 支持：多版本对照、朗读功能、背景音乐
 */

'use client';

import { useState, useRef, useEffect } from 'react';
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
} from 'lucide-react';
import { NoteDialog } from '@/components/study/note-dialog';
import { BookmarkDialog, BookmarkList } from '@/components/study/bookmark-dialog';
import type { BookmarkItem } from '@/components/study/bookmark-dialog';
import { DailyCheckIn } from '@/components/study/daily-check-in';
import { useSession } from 'next-auth/react';

type DisplayMode = 'verse' | 'chapter';

interface AiAnalysis {
  summary?: string;
  [key: string]: unknown;
}

interface Chapter {
  id: string;
  chapterNum: number;
  title: string;
  summary: string;
  verses: Verse[];
}

interface Verse {
  id: string;
  verseNum: number;
  chinese: string;
  sanskrit?: string;
  english?: string;
  aiKeyword: string[];
  aiAnalysis?: AiAnalysis | null;
}

interface StudyProgress {
  id: string;
  verseId: string;
  status: 'NOT_STARTED' | 'LEARNING' | 'MEMORIZED' | 'MASTERED';
  recitationCount: number;
  lastStudiedAt: Date | null;
}

type BookmarkResponse = {
  id: string;
  verseId: string;
  note?: string | null;
  createdAt: string | Date;
  verse?: {
    chinese?: string | null;
    chapter?: {
      title?: string | null;
    } | null;
  } | null;
};

const isBookmarkResponse = (value: unknown): value is BookmarkResponse => {
  if (!value || typeof value !== 'object') return false;
  const candidate = value as Record<string, unknown>;
  return typeof candidate.id === 'string' && typeof candidate.verseId === 'string';
};

const normalizeBookmark = (bookmark: BookmarkResponse): BookmarkItem => ({
  id: bookmark.id,
  verseId: bookmark.verseId,
  verse: bookmark.verse?.chinese ?? '经文不可用',
  chapter: bookmark.verse?.chapter?.title ?? '未知章节',
  note: bookmark.note ?? undefined,
  createdAt: new Date(bookmark.createdAt).toISOString().split('T')[0],
});

export default function StudyPage() {
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [currentChapter, setCurrentChapter] = useState<Chapter | null>(null);
  const [selectedChapterId, setSelectedChapterId] = useState<string>('');
  const [selectedVerse, setSelectedVerse] = useState<Verse | null>(null);
  const [selectedVerseIndex, setSelectedVerseIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('chinese');
  const [studyProgress, setStudyProgress] = useState<Record<string, StudyProgress>>({});
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);
  const [displayMode, setDisplayMode] = useState<DisplayMode>('chapter'); // 默认整章显示
  
  const { data: session } = useSession();

  // 朗读状态
  const [isReading, setIsReading] = useState(false);
  const [readingSpeed, setReadingSpeed] = useState(1);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // 背景音乐状态
  const [isBGMPlaying, setIsBGMPlaying] = useState(false);
  const [bgmVolume, setBgmVolume] = useState([50]);
  const bgmAudioRef = useRef<HTMLAudioElement | null>(null);

  // 加载章节数据
  useEffect(() => {
    fetchChapters();
  }, []);

  const fetchChapters = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/chapters?sutra=diamond-sutra');
      if (response.ok) {
        const data: Chapter[] = await response.json();
        setChapters(data);
        if (data.length > 0) {
          const firstChapter = data[0];
          setSelectedChapterId(firstChapter.id);
          setCurrentChapter(firstChapter);
          if (firstChapter.verses.length > 0) {
            setSelectedVerse(firstChapter.verses[0]);
            setSelectedVerseIndex(0);
          }
        }
      }
    } catch (error) {
      console.error('Failed to fetch chapters:', error);
    } finally {
      setLoading(false);
    }
  };

  // 加载用户学习进度
  useEffect(() => {
    if (session?.user) {
      fetchStudyProgress();
      fetchBookmarks();
    }
  }, [session]);

  const fetchStudyProgress = async () => {
    try {
      const response = await fetch('/api/study-progress');
      if (response.ok) {
        const data: StudyProgress[] = await response.json();
        const progressMap = data.reduce((acc, p) => {
          acc[p.verseId] = p;
          return acc;
        }, {} as Record<string, StudyProgress>);
        setStudyProgress(progressMap);
      }
    } catch (error) {
      console.error('Failed to fetch study progress:', error);
    }
  };

  const fetchBookmarks = async () => {
    try {
      const res = await fetch('/api/bookmarks');
      if (res.ok) {
        const data: unknown = await res.json();
        if (Array.isArray(data)) {
          const normalized = data.filter(isBookmarkResponse).map(normalizeBookmark);
          setBookmarks(normalized);
        }
      }
    } catch {
      setBookmarks([]);
    }
  };

  // 切换章节
  const handleChapterChange = async (chapterId: string) => {
    const chapter = chapters.find((c) => c.id === chapterId);
    if (!chapter) return;

    // 获取完整章节数据（包含所有偈颂）
    try {
      const response = await fetch(`/api/chapters/${chapterId}`);
      if (response.ok) {
        const data: Chapter = await response.json();
        setCurrentChapter(data);
        setSelectedChapterId(chapterId);
        if (data.verses.length > 0) {
          setSelectedVerse(data.verses[0]);
          setSelectedVerseIndex(0);
        }
      }
    } catch (error) {
      console.error('Failed to fetch chapter details:', error);
    }
  };

  // 导航到下一章/上一章
  const goToNextChapter = () => {
    const currentIndex = chapters.findIndex((c) => c.id === selectedChapterId);
    if (currentIndex < chapters.length - 1) {
      handleChapterChange(chapters[currentIndex + 1].id);
    }
  };

  const goToPrevChapter = () => {
    const currentIndex = chapters.findIndex((c) => c.id === selectedChapterId);
    if (currentIndex > 0) {
      handleChapterChange(chapters[currentIndex - 1].id);
    }
  };

  // 导航到下一偈/上一偈
  const goToNextVerse = () => {
    if (!currentChapter || selectedVerseIndex >= currentChapter.verses.length - 1) {
      goToNextChapter();
      return;
    }
    const nextIndex = selectedVerseIndex + 1;
    setSelectedVerse(currentChapter.verses[nextIndex]);
    setSelectedVerseIndex(nextIndex);
  };

  const goToPrevVerse = () => {
    if (selectedVerseIndex <= 0) {
      goToPrevChapter();
      return;
    }
    const prevIndex = selectedVerseIndex - 1;
    setSelectedVerse(currentChapter!.verses[prevIndex]);
    setSelectedVerseIndex(prevIndex);
  };

  // 保存学习进度
  const saveStudyProgress = async (status: StudyProgress['status']) => {
    if (!session?.user || !selectedVerse) return;

    try {
      await fetch('/api/study-progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          verseId: selectedVerse.id,
          status,
          recitationCount: (studyProgress[selectedVerse.id]?.recitationCount || 0) + 1,
        }),
      });

      // 刷新学习进度
      fetchStudyProgress();
    } catch (error) {
      console.error('Failed to save study progress:', error);
    }
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
    
    // 标记为学习中
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
        console.log('背景音乐文件不存在，请添加 /public/bgm/zen-music.mp3');
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

  const verses = currentChapter?.verses || [];

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
              <ScrollArea className="h-[500px]">
                <div className="space-y-1">
                  {chapters.map((chapter) => {
                    const progress = studyProgress[chapter.verses[0]?.id];
                    const hasProgress = progress && progress.status !== 'NOT_STARTED';
                    
                    return (
                      <button
                        key={chapter.id}
                        onClick={() => handleChapterChange(chapter.id)}
                        className={`w-full text-left p-3 rounded-lg transition-colors relative ${
                          selectedChapterId === chapter.id
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
                    );
                  })}
                </div>
              </ScrollArea>
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
                  {/* 显示模式切换 */}
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

              {/* 朗读控制 & 背景音乐 */}
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

              {/* 朗读速度 */}
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
                // 整章显示模式
                verses.length > 0 ? (
                  <div className="space-y-6">
                    <ScrollArea className="h-[500px]">
                      <div className="space-y-6 pr-4">
                        {verses.map((verse, index) => (
                          <div key={verse.id} className="border-b pb-6 last:border-0">
                            <div className="flex items-center gap-2 mb-3">
                              <Badge variant="outline" className="text-amber-700 border-amber-300">
                                偈 {verse.verseNum}
                              </Badge>
                              {session?.user && studyProgress[verse.id] && (
                                <Badge
                                  variant={
                                    studyProgress[verse.id].status === 'MASTERED'
                                      ? 'default'
                                      : 'secondary'
                                  }
                                  className={
                                    studyProgress[verse.id].status === 'MASTERED'
                                      ? 'bg-green-100 text-green-800'
                                      : ''
                                  }
                                >
                                  {studyProgress[verse.id].status === 'LEARNING' && '学习中'}
                                  {studyProgress[verse.id].status === 'MEMORIZED' &&
                                    `已背诵${studyProgress[verse.id].recitationCount}次`}
                                  {studyProgress[verse.id].status === 'MASTERED' && '已掌握'}
                                </Badge>
                              )}
                            </div>

                            {/* 中文 */}
                            <div className="text-xl leading-loose font-serif text-foreground mb-4">
                              {verse.chinese}
                            </div>

                            {/* 英文 */}
                            {verse.english && (
                              <div className="text-base leading-relaxed text-muted-foreground mb-3 pl-4 border-l-2 border-amber-200">
                                {verse.english}
                              </div>
                            )}

                            {/* 梵文 */}
                            {verse.sanskrit && (
                              <div className="text-sm text-muted-foreground italic mb-3">
                                {verse.sanskrit}
                              </div>
                            )}

                            {/* AI解析 */}
                            {verse.aiAnalysis?.summary && (
                              <div className="bg-amber-50 rounded-lg p-3 mt-3">
                                <div className="flex items-center gap-2 text-amber-700 mb-1">
                                  <Sparkles className="w-3 h-3" />
                                  <span className="text-sm font-medium">AI 解析</span>
                                </div>
                                <p className="text-sm text-amber-900">
                                  {verse.aiAnalysis.summary}
                                </p>
                                {Array.isArray(verse.aiKeyword) && verse.aiKeyword.length > 0 && (
                                  <div className="flex flex-wrap gap-1 mt-2">
                                    {verse.aiKeyword.map((kw) => (
                                      <Badge
                                        key={kw}
                                        variant="secondary"
                                        className="text-xs bg-amber-100 text-amber-800"
                                      >
                                        {kw}
                                      </Badge>
                                    ))}
                                  </div>
                                )}
                              </div>
                            )}

                            {/* 操作按钮 */}
                            <div className="flex gap-2 mt-3">
                              {session?.user && (
                                <>
                                  <BookmarkDialog
                                    verseId={verse.id}
                                    verse={verse.chinese}
                                    chapter={currentChapter?.title || ''}
                                  />
                                  <NoteDialog
                                    verseId={verse.id}
                                    verse={verse.chinese}
                                    chapter={currentChapter?.title || ''}
                                  />
                                </>
                              )}
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
                    </ScrollArea>
                  </div>
                ) : (
                  <div className="h-[400px] flex items-center justify-center text-muted-foreground">
                    该章节内容正在整理中...
                  </div>
                )
              ) : (
                // 逐偈显示模式
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
                            <div className="flex flex-wrap gap-2">
                              {(Array.isArray(selectedVerse.aiKeyword) ? selectedVerse.aiKeyword : []).map((kw) => (
                                <Badge key={kw} variant="secondary" className="bg-amber-100 text-amber-800">
                                  {kw}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </TabsContent>
                      </Tabs>
                    </ScrollArea>

                    {/* 学习状态 */}
                    {session?.user && studyProgress[selectedVerse.id] && (
                      <div className="flex gap-2 pt-2">
                        {studyProgress[selectedVerse.id].status === 'LEARNING' && (
                          <Badge variant="outline" className="text-blue-600 border-blue-600">
                            学习中
                          </Badge>
                        )}
                        {studyProgress[selectedVerse.id].status === 'MEMORIZED' && (
                          <Badge className="bg-green-100 text-green-800">
                            已背诵 {studyProgress[selectedVerse.id].recitationCount} 次
                          </Badge>
                        )}
                        {studyProgress[selectedVerse.id].status === 'MASTERED' && (
                          <Badge className="bg-amber-100 text-amber-800">
                            已掌握
                          </Badge>
                        )}
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex justify-between pt-4 border-t">
                      <div className="flex gap-2">
                        {session?.user && (
                          <>
                            <BookmarkDialog
                              verseId={selectedVerse.id}
                              verse={selectedVerse?.chinese || ''}
                              chapter={currentChapter?.title || ''}
                            />
                            <NoteDialog
                              verseId={selectedVerse.id}
                              verse={selectedVerse?.chinese || ''}
                              chapter={currentChapter?.title || ''}
                            />
                          </>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={isReading ? pauseReading : startReading}
                        >
                          <Volume2 className="w-4 h-4 mr-2" />
                          朗读此偈
                        </Button>
                        {session?.user && studyProgress[selectedVerse.id]?.status !== 'MASTERED' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => saveStudyProgress('MEMORIZED')}
                          >
                            <FileText className="w-4 h-4 mr-2" />
                            标记已背诵
                          </Button>
                        )}
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
            {/* Daily Check In */}
            <DailyCheckIn />

            {/* Progress */}
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

            {/* Keywords */}
            {selectedVerse && Array.isArray(selectedVerse.aiKeyword) && selectedVerse.aiKeyword.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">关键词</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {(Array.isArray(selectedVerse.aiKeyword) ? selectedVerse.aiKeyword : []).map((kw) => (
                      <Badge key={kw} variant="outline" className="cursor-pointer hover:bg-amber-50 hover:text-amber-700 hover:border-amber-300">
                        {kw}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Bookmarks */}
            {session?.user && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Bookmark className="w-4 h-4 text-amber-600" />
                    我的收藏
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <BookmarkList bookmarks={bookmarks} currentId={selectedVerse?.id || ''} />
                </CardContent>
              </Card>
            )}

            {/* Quick Actions */}
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

            {/* Chapter Summary */}
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
