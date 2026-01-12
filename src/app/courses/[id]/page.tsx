/**
 * 课程详情页面
 */

'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  PlayCircle,
  Clock,
  Users,
  CheckCircle2,
  Lock,
  Star,
  FileText,
  MessageSquare,
  Bookmark,
  Share2,
  Volume2,
  BookOpen,
} from 'lucide-react';

// 课程详情数据（模拟）
const courseDetails: Record<string, any> = {
  '1': {
    id: 1,
    title: '《金刚经》入门导读',
    description: '了解《金刚经》的缘起、核心思想和基本概念，适合初学者建立正确的知见。本课程将带领您从零开始，逐步了解这部般若部经典的智慧内涵。',
    level: 'BEGINNER',
    levelLabel: '初级',
    duration: 120,
    lessons: 8,
    students: 1234,
    rating: 4.8,
    reviews: 256,
    isFree: true,
    isPublished: true,
    image: '📿',
    instructor: {
      name: '慧明法师',
      title: '金刚经研究学者',
      bio: '毕业于中国佛学院，专精般若经典研究，有二十年弘法经验。',
      avatar: '慧',
    },
    topics: [
      '《金刚经》的缘起与传承',
      '般若思想的核心概念',
      '空性思想入门',
      '四相与无我',
      '布施波罗蜜',
      '忍辱波罗蜜',
      '如何在生活中应用经义',
      '常见问题解答',
    ],
    lessonsList: [
      { id: 1, title: '课程介绍与学习指南', duration: '10:00', isFree: true, completed: false },
      { id: 2, title: '《金刚经》的缘起', duration: '15:30', isFree: true, completed: false },
      { id: 3, title: '佛陀与须菩提的对话', duration: '12:45', isFree: false, completed: false },
      { id: 4, title: '什么是"般若"？', duration: '18:20', isFree: false, completed: false },
      { id: 5, title: '理解"空性"', duration: '16:00', isFree: false, completed: false },
      { id: 6, title: '四相的含义', duration: '14:30', isFree: false, completed: false },
      { id: 7, title: '六度波罗蜜概述', duration: '20:00', isFree: false, completed: false },
      { id: 8, title: '经义在生活中的应用', duration: '13:15', isFree: false, completed: false },
    ],
    relatedCourses: [2, 5],
  },
  '2': {
    id: 2,
    title: '般若波罗蜜多概说',
    description: '深入讲解"般若"（智慧）的概念，理解空性思想的基础。',
    level: 'BEGINNER',
    levelLabel: '初级',
    duration: 90,
    lessons: 6,
    students: 856,
    rating: 4.7,
    reviews: 128,
    isFree: true,
    isPublished: true,
    image: '🌙',
    instructor: {
      name: '妙音法师',
      title: '佛学讲师',
      bio: '专精般若思想教学，讲解通俗易懂。',
      avatar: '妙',
    },
    lessonsList: [],
  },
};

const allCourses = [
  { id: 2, title: '般若波罗蜜多概说', level: '初级', duration: 90, lessons: 6, isFree: true },
  { id: 5, title: '《金刚经》逐句精讲（上）', level: '中级', duration: 300, lessons: 16, isFree: false },
  { id: 6, title: '中观思想入门', level: '中级', duration: 240, lessons: 12, isFree: false },
];

export default function CourseDetailPage() {
  const params = useParams();
  const courseId = params.id as string;
  const course = courseDetails[courseId] || courseDetails['1'];

  const [currentLesson, setCurrentLesson] = useState(1);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [activeTab, setActiveTab] = useState('lessons');

  const handleEnroll = () => {
    setIsEnrolled(true);
    // 这里添加报名逻辑
  };

  const currentLessonData = course.lessonsList.find((l: any) => l.id === currentLesson) || course.lessonsList[0];

  const progress = course.lessonsList.filter((l: any) => l.completed).length / course.lessonsList.length * 100;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container max-w-6xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
          <Link href="/courses" className="hover:text-foreground">课程</Link>
          <span>/</span>
          <span className="text-foreground">{course.title}</span>
        </div>

        {/* Header */}
        <div className="mb-8">
          <Badge className="mb-4">{course.levelLabel}</Badge>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{course.title}</h1>
          <p className="text-xl text-muted-foreground mb-6">{course.description}</p>

          <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground mb-6">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span className="font-medium text-foreground">{course.rating}</span>
              <span>({course.reviews} 条评价)</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {course.duration} 分钟
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              {course.students.toLocaleString()} 人学习
            </div>
            <div className="flex items-center gap-1">
              <BookOpen className="w-4 h-4" />
              {course.lessons} 课时
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button
              size="lg"
              className={isEnrolled ? 'bg-green-500 hover:bg-green-600' : 'bg-amber-500 hover:bg-amber-600'}
              onClick={isEnrolled ? undefined : handleEnroll}
              asChild={isEnrolled}
            >
              {isEnrolled ? (
                <Link href={`/courses/${courseId}/learn`}>
                  <PlayCircle className="w-5 h-5 mr-2" />
                  继续学习
                </Link>
              ) : (
                <>
                  {course.isFree ? (
                    <>
                      <PlayCircle className="w-5 h-5 mr-2" />
                      免费开始学习
                    </>
                  ) : (
                    <>
                      <Lock className="w-5 h-5 mr-2" />
                      立即报名
                    </>
                  )}
                </>
              )}
            </Button>
            <Button size="lg" variant="outline">
              <Bookmark className="w-4 h-4 mr-2" />
              收藏
            </Button>
            <Button size="lg" variant="outline">
              <Share2 className="w-4 h-4 mr-2" />
              分享
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Video Player */}
            <Card>
              <CardContent className="p-0">
                <div className="aspect-video bg-gradient-to-br from-amber-100 to-orange-100 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-6xl mb-4">{course.image}</div>
                    <Button size="lg" className="bg-amber-500 hover:bg-amber-600">
                      <PlayCircle className="w-6 h-6 mr-2" />
                      开始学习
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="lessons">课时列表</TabsTrigger>
                <TabsTrigger value="description">课程介绍</TabsTrigger>
                <TabsTrigger value="reviews">学员评价</TabsTrigger>
                <TabsTrigger value="discussion">讨论区</TabsTrigger>
              </TabsList>

              <TabsContent value="lessons" className="space-y-4">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>课程课时</CardTitle>
                      <span className="text-sm text-muted-foreground">
                        {course.lessonsList.filter((l: any) => l.completed).length} / {course.lessonsList.length} 已完成
                      </span>
                    </div>
                    {isEnrolled && (
                      <div className="h-2 bg-muted rounded-full overflow-hidden mt-2">
                        <div
                          className="h-full bg-amber-500 rounded-full transition-all"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    )}
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[400px]">
                      <div className="space-y-2 pr-4">
                        {course.lessonsList.map((lesson: any, index: number) => (
                          <div
                            key={lesson.id}
                            className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                              currentLesson === lesson.id
                                ? 'border-amber-500 bg-amber-50'
                                : 'border-border hover:bg-muted'
                            } ${!isEnrolled && !lesson.isFree ? 'opacity-60' : ''}`}
                          >
                            <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium shrink-0">
                              {lesson.completed ? (
                                <CheckCircle2 className="w-5 h-5 text-green-500" />
                              ) : (
                                <span className={currentLesson === lesson.id ? 'bg-amber-500 text-white w-full h-full rounded-full flex items-center justify-center' : ''}>
                                  {index + 1}
                                </span>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium truncate">{lesson.title}</p>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {lesson.duration}
                                </span>
                                {lesson.isFree && <Badge variant="secondary" className="text-xs">免费</Badge>}
                                {!isEnrolled && !lesson.isFree && (
                                  <Badge variant="outline" className="text-xs">
                                    <Lock className="w-3 h-3 mr-1" />
                                    需报名
                                  </Badge>
                                )}
                              </div>
                            </div>
                            <Button
                              size="sm"
                              variant={currentLesson === lesson.id ? 'default' : 'outline'}
                              disabled={!isEnrolled && !lesson.isFree}
                              onClick={() => setCurrentLesson(lesson.id)}
                            >
                              {lesson.completed ? '复习' : currentLesson === lesson.id ? '播放中' : '播放'}
                            </Button>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="description" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>课程简介</CardTitle>
                  </CardHeader>
                  <CardContent className="prose prose-sm max-w-none">
                    <p>{course.description}</p>
                    <h3>您将学到</h3>
                    <ul className="space-y-2">
                      {course.topics.map((topic: string, i: number) => (
                        <li key={i} className="flex items-start gap-2">
                          <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                          {topic}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>讲师介绍</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center text-2xl text-amber-700">
                        {course.instructor.avatar}
                      </div>
                      <div>
                        <h3 className="font-medium text-lg">{course.instructor.name}</h3>
                        <p className="text-sm text-muted-foreground mb-2">{course.instructor.title}</p>
                        <p className="text-sm">{course.instructor.bio}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="reviews" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>学员评价</CardTitle>
                    <CardDescription>来自 {course.reviews} 位学员的真实反馈</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {[
                        { user: '妙音', avatar: '妙', rating: 5, content: '非常棒的课程！慧明法师讲解深入浅出，让我这个初学者也能理解《金刚经》的核心思想。', date: '2024-01-15' },
                        { user: '觉悟', avatar: '觉', rating: 5, content: '课程结构清晰，内容丰富。通过这门课程，我对般若思想有了更深的认识。', date: '2024-01-10' },
                        { user: '清净', avatar: '清', rating: 4, content: '很好的入门课程，建议增加一些实际案例的讲解。', date: '2024-01-05' },
                      ].map((review, i) => (
                        <div key={i} className="border-b pb-4 last:border-0">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-700">
                              {review.avatar}
                            </div>
                            <div>
                              <p className="font-medium">{review.user}</p>
                              <div className="flex items-center gap-1">
                                {Array.from({ length: 5 }).map((_, j) => (
                                  <Star
                                    key={j}
                                    className={`w-3 h-3 ${j < review.rating ? 'text-amber-500 fill-amber-500' : 'text-gray-300'}`}
                                  />
                                ))}
                              </div>
                            </div>
                            <span className="ml-auto text-sm text-muted-foreground">{review.date}</span>
                          </div>
                          <p className="text-sm text-muted-foreground">{review.content}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="discussion" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>课程讨论</CardTitle>
                    <CardDescription>与同学交流学习心得</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8 text-muted-foreground">
                      <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>登录后参与讨论</p>
                      <Button variant="outline" className="mt-4" asChild>
                        <Link href="/login">立即登录</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Current Lesson Info */}
            {currentLessonData && (
              <Card className="bg-amber-50 border-amber-200">
                <CardHeader>
                  <CardTitle className="text-lg">当前课时</CardTitle>
                </CardHeader>
                <CardContent>
                  <h3 className="font-medium mb-2">{currentLessonData.title}</h3>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                    <Clock className="w-4 h-4" />
                    {currentLessonData.duration}
                  </div>
                  <Separator className="my-3" />
                  <div className="space-y-2">
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      <FileText className="w-4 h-4 mr-2" />
                      课时笔记
                    </Button>
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      <Volume2 className="w-4 h-4 mr-2" />
                      音频下载
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Related Courses */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">相关课程</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {allCourses.map((related) => (
                  <Link key={related.id} href={`/courses/${related.id}`} className="block">
                    <div className="p-3 rounded-lg border hover:bg-muted transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center text-xl">
                          📚
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{related.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {related.level} · {related.lessons} 课时
                          </p>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
