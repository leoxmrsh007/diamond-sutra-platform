/**
 * 系统课程页面 - 完整版
 */

import Link from 'next/link';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  BookOpen,
  Clock,
  Users,
  PlayCircle,
  CheckCircle2,
  Lock,
  Video,
  FileText,
  Star,
} from 'lucide-react';

const courses = {
  beginner: [
    {
      id: 1,
      title: '《金刚经》入门导读',
      description: '了解《金刚经》的缘起、核心思想和基本概念，适合初学者建立正确的知见。',
      level: 'BEGINNER',
      duration: 120,
      lessons: 8,
      students: 1234,
      image: '📿',
      isPublished: true,
      isFree: true,
      instructor: '慧明法师',
    },
    {
      id: 2,
      title: '般若波罗蜜多概说',
      description: '深入讲解"般若"（智慧）的概念，理解空性思想的基础。',
      level: 'BEGINNER',
      duration: 90,
      lessons: 6,
      students: 856,
      image: '🌙',
      isPublished: true,
      isFree: true,
      instructor: '妙音法师',
    },
    {
      id: 3,
      title: '佛法基本常识',
      description: '佛教的历史、基本教义、术语解释等基础知识。',
      level: 'BEGINNER',
      duration: 150,
      lessons: 10,
      students: 2341,
      image: '📖',
      isPublished: true,
      isFree: true,
      instructor: '觉悟法师',
    },
    {
      id: 4,
      title: '如何正确理解空性',
      description: '空性不是什么，什么是缘起性空，如何避免落入常见误区。',
      level: 'BEGINNER',
      duration: 100,
      lessons: 7,
      students: 1567,
      image: '☯️',
      isPublished: true,
      isFree: true,
      instructor: '清净法师',
    },
  ],
  intermediate: [
    {
      id: 5,
      title: '《金刚经》逐句精讲（上）',
      description: '详细讲解前十六分，深入理解经文的深层含义。',
      level: 'INTERMEDIATE',
      duration: 300,
      lessons: 16,
      students: 523,
      image: '🪷',
      isPublished: true,
      isFree: false,
      instructor: '慧明法师',
    },
    {
      id: 6,
      title: '中观思想入门',
      description: '学习龙树菩萨的中观思想，理解缘起性空的哲学体系。',
      level: 'INTERMEDIATE',
      duration: 240,
      lessons: 12,
      students: 342,
      image: '☸️',
      isPublished: true,
      isFree: false,
      instructor: '宗性法师',
    },
    {
      id: 7,
      title: '《金刚经》与中国文化',
      description: '探讨《金刚经》对中国传统文化、文学、艺术的影响。',
      level: 'INTERMEDIATE',
      duration: 180,
      lessons: 10,
      students: 467,
      image: '🎨',
      isPublished: true,
      isFree: false,
      instructor: '文化学者',
    },
    {
      id: 8,
      title: '禅宗与金刚经',
      description: '六祖惠能以《金刚经》开悟，深入探讨禅宗与金刚经的关系。',
      level: 'INTERMEDIATE',
      duration: 200,
      lessons: 11,
      students: 589,
      image: '🧘',
      isPublished: true,
      isFree: false,
      instructor: '禅心法师',
    },
  ],
  advanced: [
    {
      id: 9,
      title: '《金刚经》逐句精讲（下）',
      description: '完成后十六分的深入讲解，完整掌握整部经文。',
      level: 'ADVANCED',
      duration: 300,
      lessons: 16,
      students: 189,
      image: '🏔️',
      isPublished: true,
      isFree: false,
      instructor: '慧明法师',
    },
    {
      id: 10,
      title: '《金刚经》与大乘佛法',
      description: '探讨《金刚经》在整个大乘佛法体系中的地位和意义。',
      level: 'ADVANCED',
      duration: 180,
      lessons: 10,
      students: 156,
      image: '📜',
      isPublished: false,
      isFree: false,
      instructor: '大愿法师',
    },
    {
      id: 11,
      title: '梵汉《金刚经》版本比较研究',
      description: '通过对梵文原典与汉译本的对照，分析各译本的特点与差异。',
      level: 'ADVANCED',
      duration: 240,
      lessons: 12,
      students: 98,
      image: '🔍',
      isPublished: true,
      isFree: false,
      instructor: '梵文学者',
    },
    {
      id: 12,
      title: '金刚经思想与现代生活',
      description: '将《金刚经》的智慧应用到现代生活、工作中的实践课程。',
      level: 'ADVANCED',
      duration: 160,
      lessons: 9,
      students: 234,
      image: '💼',
      isPublished: true,
      isFree: false,
      instructor: '妙音法师',
    },
  ],
};

const levelLabels = {
  BEGINNER: { label: '初级', color: 'bg-green-100 text-green-800' },
  INTERMEDIATE: { label: '中级', color: 'bg-blue-100 text-blue-800' },
  ADVANCED: { label: '高级', color: 'bg-purple-100 text-purple-800' },
};

export default function CoursesPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge className="mb-4">系统课程</Badge>
          <h1 className="text-4xl font-bold mb-4">循序渐进，深入经藏</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            结构化学习路径，从入门到精进，系统掌握《金刚经》的智慧
          </p>
        </div>

        {/* My Learning */}
        <Card className="mb-8 bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-amber-600" />
              我的学习
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              登录后查看您的学习进度和已报名课程
            </p>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-amber-700">0</div>
                <div className="text-sm text-muted-foreground">已报名课程</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-amber-700">0</div>
                <div className="text-sm text-muted-foreground">已完成课时</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-amber-700">0</div>
                <div className="text-sm text-muted-foreground">学习天数</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Course Tabs */}
        <Tabs defaultValue="beginner" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 max-w-md mx-auto">
            <TabsTrigger value="beginner">初级课程</TabsTrigger>
            <TabsTrigger value="intermediate">中级课程</TabsTrigger>
            <TabsTrigger value="advanced">高级课程</TabsTrigger>
          </TabsList>

          <TabsContent value="beginner" className="space-y-6">
            {courses.beginner.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </TabsContent>

          <TabsContent value="intermediate" className="space-y-6">
            {courses.intermediate.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </TabsContent>

          <TabsContent value="advanced" className="space-y-6">
            {courses.advanced.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </div>
  );
}

function CourseCard({ course }: { course: any }) {
  const levelInfo = levelLabels[course.level as keyof typeof levelLabels];

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="md:flex">
        <div className="md:w-48 bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center text-6xl">
          {course.image}
        </div>
        <div className="flex-1 p-6">
          <div className="flex items-start justify-between mb-2">
            <div>
              <Badge className={levelInfo.color} variant="secondary">
                {levelInfo.label}
              </Badge>
              <CardTitle className="text-xl mt-2">{course.title}</CardTitle>
            </div>
            {!course.isPublished && (
              <Badge variant="outline" className="flex items-center gap-1">
                <Lock className="w-3 h-3" />
                即将上线
              </Badge>
            )}
            {course.isFree && (
              <Badge className="bg-green-100 text-green-700">免费</Badge>
            )}
          </div>

          <CardDescription className="mb-4">
            {course.description}
          </CardDescription>

          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4" />
              {course.instructor}
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {course.duration} 分钟
            </div>
            <div className="flex items-center gap-1">
              <Video className="w-4 h-4" />
              {course.lessons} 课时
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              {course.students.toLocaleString()} 人学习
            </div>
          </div>

          <CardFooter className="p-0">
            <Button asChild className="w-full md:w-auto">
              <Link href={`/courses/${course.id}`}>
                <PlayCircle className="w-4 h-4 mr-2" />
                {course.isFree ? '免费开始学习' : '立即报名'}
              </Link>
            </Button>
          </CardFooter>
        </div>
      </div>
    </Card>
  );
}
