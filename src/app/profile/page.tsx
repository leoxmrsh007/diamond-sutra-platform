/**
 * 个人中心页面
 */

'use client';

import { useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { LoadingSpinner } from '@/components/ui/loading';
import {
  BookOpen,
  Bookmark,
  FileText,
  Settings,
  Award,
  Calendar,
  Flame,
  Target,
  Clock,
  TrendingUp,
  CheckCircle2,
} from 'lucide-react';
import { useSession } from 'next-auth/react';
import type { StudyProgress } from '@/types/api';

type StudyStatistics = {
  totalVersesStudied: number;
  totalVerses: number;
  progressPercentage: number;
  statusBreakdown: Record<'NOT_STARTED' | 'LEARNING' | 'MEMORIZED' | 'MASTERED', number>;
  memorizedVerses: number;
  masteredVerses: number;
  recentlyStudied: Array<{
    verse: {
      chapter: {
        chapterNum: number;
        title: string;
      };
      verseNum: number;
      chinese: string;
    };
    status: StudyProgress['status'];
    lastStudiedAt: string;
  }>;
};

type ProfileNote = {
  id: string;
  verseId: string;
  title?: string;
  content: string;
  createdAt: string;
};

type ProfileBookmark = {
  id: string;
  verseId: string;
  note?: string;
  createdAt: string;
  verse?: {
    verseNum: number;
    chinese: string;
    chapter: {
      title: string;
      chapterNum: number;
    };
  };
};

type CheckInData = {
  checkedDays: number[];
  consecutiveDays: number;
  totalDays: number;
  hasCheckedToday: boolean;
};

const isStudyStatistics = (value: unknown): value is StudyStatistics => {
  if (!value || typeof value !== 'object') return false;
  const candidate = value as Record<string, unknown>;
  return (
    typeof candidate.totalVersesStudied === 'number' &&
    typeof candidate.progressPercentage === 'number' &&
    Array.isArray(candidate.recentlyStudied)
  );
};

const isProfileNote = (value: unknown): value is ProfileNote => {
  if (!value || typeof value !== 'object') return false;
  const candidate = value as Record<string, unknown>;
  return typeof candidate.id === 'string' && typeof candidate.verseId === 'string' && typeof candidate.content === 'string';
};

const normalizeNote = (note: ProfileNote): ProfileNote => ({
  ...note,
  title: note.title ?? undefined,
  createdAt: new Date(note.createdAt).toISOString(),
});

const isProfileBookmark = (value: unknown): value is ProfileBookmark => {
  if (!value || typeof value !== 'object') return false;
  const candidate = value as Record<string, unknown>;
  return typeof candidate.id === 'string' && typeof candidate.verseId === 'string';
};

const normalizeProfileBookmark = (bookmark: ProfileBookmark): ProfileBookmark => ({
  ...bookmark,
  note: bookmark.note ?? undefined,
  createdAt: new Date(bookmark.createdAt).toISOString(),
});

const isCheckInData = (value: unknown): value is CheckInData => {
  if (!value || typeof value !== 'object') return false;
  const candidate = value as Record<string, unknown>;
  return (
    Array.isArray(candidate.checkedDays) &&
    typeof candidate.consecutiveDays === 'number' &&
    typeof candidate.totalDays === 'number' &&
    typeof candidate.hasCheckedToday === 'boolean'
  );
};

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const [profile, setProfile] = useState<{
    name: string;
    email: string;
    image?: string | null;
    level?: string;
    createdAt?: string;
  } | null>(null);
  const [stats, setStats] = useState<StudyStatistics | null>(null);
  const [notes, setNotes] = useState<ProfileNote[]>([]);
  const [bookmarks, setBookmarks] = useState<ProfileBookmark[]>([]);
  const [checkIn, setCheckIn] = useState<{
    checkedDays: number[];
    consecutiveDays: number;
    totalDays: number;
    hasCheckedToday: boolean;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [signingIn, setSigningIn] = useState(false);

  useEffect(() => {
    if (status === 'loading') return;

    if (!session?.user) {
      setProfile(null);
      setStats(null);
      setNotes([]);
      setBookmarks([]);
      setCheckIn(null);
      setLoading(false);
      return;
    }

    const fetchProfileData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [statsRes, notesRes, bookmarksRes, checkInRes] = await Promise.all([
          fetch('/api/study-statistics'),
          fetch('/api/notes?limit=50'),
          fetch('/api/bookmarks?limit=50'),
          fetch('/api/check-in'),
        ]);

        if (statsRes.ok) {
          const statsData: unknown = await statsRes.json();
          if (isStudyStatistics(statsData)) {
            setStats(statsData);
          }
        }

        if (notesRes.ok) {
          const notesData: unknown = await notesRes.json();
          if (Array.isArray(notesData)) {
            const mappedNotes = notesData.filter(isProfileNote).map(normalizeNote);
            setNotes(mappedNotes);
          }
        }

        if (bookmarksRes.ok) {
          const bookmarkData: unknown = await bookmarksRes.json();
          if (Array.isArray(bookmarkData)) {
            const mappedBookmarks = bookmarkData.filter(isProfileBookmark).map(normalizeProfileBookmark);
            setBookmarks(mappedBookmarks);
          }
        }

        if (checkInRes.ok) {
          const checkInData: unknown = await checkInRes.json();
          if (isCheckInData(checkInData)) {
            setCheckIn(checkInData);
          }
        }

        const user = session?.user ?? null;
        setProfile({
          name: user?.name ?? '匿名行者',
          email: user?.email ?? '',
          image: user?.image,
        });
      } catch (err) {
        setError('获取个人数据失败，请稍后再试。');
        console.error('Profile data fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [session, status]);

  const progress = useMemo(() => {
    if (!stats) return 0;
    return stats.progressPercentage;
  }, [stats]);

  const statusCards = useMemo(() => {
    const breakdown: StudyStatistics['statusBreakdown'] = stats?.statusBreakdown ?? {
      NOT_STARTED: 0,
      LEARNING: 0,
      MEMORIZED: 0,
      MASTERED: 0,
    };
    return [
      { label: '未开始', value: breakdown.NOT_STARTED || 0, color: 'bg-gray-200' },
      { label: '学习中', value: breakdown.LEARNING || 0, color: 'bg-blue-500' },
      { label: '已背诵', value: breakdown.MEMORIZED || 0, color: 'bg-green-500' },
      { label: '已精通', value: breakdown.MASTERED || 0, color: 'bg-amber-500' },
    ];
  }, [stats]);

  const handleSignIn = async () => {
    if (signingIn || !checkIn || checkIn.hasCheckedToday) return;

    try {
      setSigningIn(true);
      const response = await fetch('/api/check-in', { method: 'POST' });
      if (!response.ok) {
        throw new Error('签到失败');
      }
      const data = await response.json();
      setCheckIn((prev) =>
        prev
          ? {
              ...prev,
              consecutiveDays: data.consecutiveDays,
              totalDays: prev.totalDays + 1,
              hasCheckedToday: true,
              checkedDays: Array.from(
                new Set([...prev.checkedDays, new Date().getDate()])
              ),
            }
          : {
              checkedDays: [new Date().getDate()],
              consecutiveDays: data.consecutiveDays,
              totalDays: 1,
              hasCheckedToday: true,
            }
      );
    } catch {
      setError('签到失败，请稍后重试。');
    } finally {
      setSigningIn(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <LoadingSpinner />
        </div>
        <Footer />
      </div>
    );
  }

  if (!session?.user) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center text-center px-4">
          <Card className="max-w-md">
            <CardHeader>
              <CardTitle>尚未登录</CardTitle>
              <CardDescription>登录后即可查看个人中心数据。</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <Button asChild className="bg-amber-500 hover:bg-amber-600">
                <Link href="/login">去登录</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/register">立即注册</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container max-w-6xl mx-auto px-4 py-8">
        {error && (
          <Card className="mb-6 border-red-200 bg-red-50 text-red-600">
            <CardContent className="py-3 text-sm">{error}</CardContent>
          </Card>
        )}

        {/* Profile Header */}
        <Card className="mb-6 bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <Avatar className="w-24 h-24 border-4 border-white shadow-lg">
                {profile?.image ? (
                  <div className="relative h-24 w-24">
                    <Image
                      src={profile.image}
                      alt={profile.name || '用户头像'}
                      fill
                      sizes="96px"
                      className="object-cover rounded-full"
                    />
                  </div>
                ) : (
                  <AvatarFallback className="bg-amber-500 text-white text-3xl">
                    {profile?.name?.[0] || '行'}
                  </AvatarFallback>
                )}
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-2xl font-bold">{profile?.name || '匿名行者'}</h1>
                  <Badge variant="secondary">修行中</Badge>
                </div>
                <p className="text-muted-foreground mb-3">{profile?.email}</p>
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    入学时间：{profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString() : '—'}
                  </span>
                  <span className="flex items-center gap-1">
                    <BookOpen className="w-4 h-4" />
                    已学习：{stats?.totalVersesStudied ?? 0} 偈
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" asChild>
                  <Link href="/settings">
                    <Settings className="w-4 h-4 mr-2" />
                    设置
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <StatCard
            icon={<Flame className="w-5 h-5 text-orange-500" />}
            label="连续签到"
            value={checkIn?.consecutiveDays ?? 0}
            unit="天"
            color="orange"
          />
          <StatCard
            icon={<Calendar className="w-5 h-5 text-blue-500" />}
            label="累计学习"
            value={stats?.recentlyStudied?.length ?? 0}
            unit="条记录（近7日）"
            color="blue"
          />
          <StatCard
            icon={<BookOpen className="w-5 h-5 text-green-500" />}
            label="已学偈颂"
            value={stats?.totalVersesStudied ?? 0}
            unit="偈"
            color="green"
          />
          <StatCard
            icon={<FileText className="w-5 h-5 text-purple-500" />}
            label="学习笔记"
            value={notes.length}
            unit="条"
            color="purple"
          />
        </div>

        {/* Daily Sign In */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-orange-500" />
              每日签到
            </CardTitle>
            <CardDescription>坚持每日签到，培养精进修行的习惯</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex gap-1">
                {Array.from({ length: 7 }).map((_, i) => {
                  const day = new Date();
                  day.setDate(day.getDate() - (6 - i));
                  const isToday = i === 6;
                  const dayOfMonth = day.getDate();
                  const isSigned = checkIn?.checkedDays.includes(dayOfMonth) || (isToday && checkIn?.hasCheckedToday);

                  return (
                    <div
                      key={i}
                      className={`flex flex-col items-center p-3 rounded-lg min-w-[60px] ${
                        isSigned
                          ? 'bg-orange-100 text-orange-700'
                          : isToday
                          ? 'bg-amber-50 text-amber-600 border-2 border-amber-300'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      <span className="text-xs mb-1">
                        {day.toLocaleDateString('zh-CN', { weekday: 'short' })}
                      </span>
                      <span className="text-lg font-bold">
                        {isSigned ? <CheckCircle2 className="w-5 h-5" /> : dayOfMonth}
                      </span>
                    </div>
                  );
                })}
              </div>
              <Button
                onClick={handleSignIn}
                disabled={!!checkIn?.hasCheckedToday || signingIn}
                className={checkIn?.hasCheckedToday ? 'bg-green-500 hover:bg-green-600' : 'bg-amber-500 hover:bg-amber-600'}
              >
                {checkIn?.hasCheckedToday ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    今日已签到
                  </>
                ) : (
                  <>
                    <Flame className="w-4 h-4 mr-2" />
                    立即签到
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="progress" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 max-w-2xl mx-auto">
            <TabsTrigger value="progress">学习进度</TabsTrigger>
            <TabsTrigger value="notes">我的笔记</TabsTrigger>
            <TabsTrigger value="bookmarks">书签收藏</TabsTrigger>
            <TabsTrigger value="achievements">成就徽章</TabsTrigger>
          </TabsList>

          {/* 学习进度 */}
          <TabsContent value="progress" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-amber-600" />
                  总体进度
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>金刚经32分</span>
                      <span className="font-medium">{progress.toFixed(1)}%</span>
                    </div>
                    <div className="h-3 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-4 mt-6">
                    {statusCards.map((stat) => (
                      <div key={stat.label} className="text-center">
                        <div className={`w-16 h-16 rounded-full ${stat.color} mx-auto mb-2 flex items-center justify-center text-white text-xl font-bold`}>
                          {stat.value}
                        </div>
                        <p className="text-sm text-muted-foreground">{stat.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-blue-600" />
                  学习记录
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {(stats?.recentlyStudied?.length ?? 0) === 0 && (
                    <p className="text-sm text-muted-foreground text-center">暂未找到近期学习记录</p>
                  )}
                  {(stats?.recentlyStudied ?? []).map((record, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                          <BookOpen className="w-5 h-5 text-amber-600" />
                        </div>
                        <div>
                          <p className="font-medium">
                            第 {record.verse.chapter.chapterNum} 分 · 偈 {record.verse.verseNum}
                          </p>
                          <p className="text-sm text-muted-foreground line-clamp-1">
                            {record.verse.chinese}
                          </p>
                        </div>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {new Date(record.lastStudiedAt).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 我的笔记 */}
          <TabsContent value="notes" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">我的笔记 ({notes.length})</h2>
              <Button asChild className="bg-amber-500 hover:bg-amber-600">
                <Link href="/study">
                  <FileText className="w-4 h-4 mr-2" />
                  新建笔记
                </Link>
              </Button>
            </div>

            {notes.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center text-muted-foreground text-sm">
                  暂无笔记，前往学习页面记录你的体悟吧。
                </CardContent>
              </Card>
            ) : (
              notes.map((note) => (
                <Card key={note.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <Badge variant="outline" className="mb-2">
                          偈 {note.verseId.slice(0, 6)}
                        </Badge>
                        <CardTitle className="text-lg">
                          {note.title || '未命名笔记'}
                        </CardTitle>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {new Date(note.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground whitespace-pre-wrap">{note.content}</p>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          {/* 书签收藏 */}
          <TabsContent value="bookmarks" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">书签收藏 ({bookmarks.length})</h2>
            </div>

            {bookmarks.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center text-muted-foreground text-sm">
                  暂无书签，前往学习页面收藏重要偈颂。
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {bookmarks.map((bookmark) => {
                  const verse = bookmark.verse;
                  return (
                    <Card key={bookmark.id} className="hover:shadow-md transition-shadow">
                      <CardHeader>
                        {verse && (
                          <Badge variant="outline" className="w-fit mb-2">
                            第 {verse.chapter.chapterNum} 分 · 偈 {verse.verseNum}
                          </Badge>
                        )}
                        <CardTitle className="text-lg leading-relaxed">
                          {verse ? verse.chinese : '已收藏的偈颂'}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        {bookmark.note && (
                          <div className="flex items-start gap-2 text-sm text-muted-foreground">
                            <Bookmark className="w-4 h-4 mt-0.5 text-amber-500" />
                            <span>{bookmark.note}</span>
                          </div>
                        )}
                        <p className="text-xs text-muted-foreground mt-3">
                          收藏于 {new Date(bookmark.createdAt).toLocaleDateString()}
                        </p>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>

          {/* 成就徽章 */}
          <TabsContent value="achievements" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-600" />
                  成就徽章
                </CardTitle>
                <CardDescription>完成修行任务，解锁成就徽章</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {[
                    { id: 'study-week', name: '精进修行', description: '连续学习 7 天', icon: '🔥', earned: (checkIn?.consecutiveDays ?? 0) >= 7 },
                    { id: 'notes-ten', name: '笔记达人', description: '撰写 10 篇学习笔记', icon: '📝', earned: notes.length >= 10 },
                    { id: 'bookmark-five', name: '慧眼识珠', description: '收藏 5 条偈颂', icon: '📑', earned: bookmarks.length >= 5 },
                    { id: 'memorized-ten', name: '般若初现', description: '背诵 10 条偈颂', icon: '🌟', earned: (stats?.statusBreakdown?.MEMORIZED ?? 0) >= 10 },
                    { id: 'mastered-five', name: '智慧如海', description: '精通 5 条偈颂', icon: '📖', earned: (stats?.statusBreakdown?.MASTERED ?? 0) >= 5 },
                    { id: 'daily-check-30', name: '百日共修', description: '累计签到 30 次', icon: '💫', earned: (checkIn?.totalDays ?? 0) >= 30 },
                  ].map((achievement) => (
                    <div
                      key={achievement.id}
                      className={`p-4 rounded-lg border-2 text-center ${
                        achievement.earned
                          ? 'bg-amber-50 border-amber-200'
                          : 'bg-muted border-muted opacity-60'
                      }`}
                    >
                      <div className={`text-4xl mb-2 ${achievement.earned ? '' : 'grayscale'}`}>
                        {achievement.icon}
                      </div>
                      <h3 className="font-medium mb-1">{achievement.name}</h3>
                      <p className="text-xs text-muted-foreground">{achievement.description}</p>
                      {achievement.earned && (
                        <Badge className="mt-2 bg-amber-500">已获得</Badge>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-purple-600" />
                  修行等级
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { level: '初入佛门', requirement: '完成首次签到', unlocked: (checkIn?.totalDays ?? 0) >= 1 },
                    { level: '精进修行', requirement: '连续学习 7 天', unlocked: (checkIn?.consecutiveDays ?? 0) >= 7 },
                    { level: '般若初现', requirement: '背诵 10 条偈颂', unlocked: (stats?.statusBreakdown?.MEMORIZED ?? 0) >= 10 },
                    { level: '智慧如海', requirement: '精通 5 条偈颂', unlocked: (stats?.statusBreakdown?.MASTERED ?? 0) >= 5 },
                    { level: '究竟解脱', requirement: '累计签到 100 天', unlocked: (checkIn?.totalDays ?? 0) >= 100 },
                  ].map((rank) => (
                    <div
                      key={rank.level}
                      className={`flex items-center gap-3 ${rank.unlocked ? 'text-amber-700' : 'text-muted-foreground'}`}
                    >
                      <div className={`w-8 h-8 rounded-full ${rank.unlocked ? 'bg-amber-500' : 'bg-muted'} flex items-center justify-center text-white text-xs`}>
                        {rank.unlocked ? '📍' : '🔒'}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="font-medium">{rank.level}</span>
                          <span>{rank.requirement}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  unit,
  color,
}: {
  icon: ReactNode;
  label: string;
  value: number;
  unit: string;
  color: string;
}) {
  const colorClasses = {
    orange: 'bg-orange-50 border-orange-200',
    blue: 'bg-blue-50 border-blue-200',
    green: 'bg-green-50 border-green-200',
    purple: 'bg-purple-50 border-purple-200',
  };

  return (
    <Card className={colorClasses[color as keyof typeof colorClasses]}>
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-white">{icon}</div>
          <div>
            <p className="text-2xl font-bold">
              {value}
              <span className="text-sm font-normal text-muted-foreground ml-1">{unit}</span>
            </p>
            <p className="text-sm text-muted-foreground">{label}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
