/**
 * 系统课程页面 - 从数据库读取数据
 */

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LoadingSpinner } from '@/components/ui/loading';
import {
  BookOpen,
  Clock,
  Users,
  PlayCircle,
  CheckCircle2,
  Lock,
  Video,
  Star,
} from 'lucide-react';

interface Course {
  id: string;
  title: string;
  description: string;
  level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  duration: number | null;
  isPublished: boolean;
  lessons: any[];
  studentCount: number;
  isEnrolled: boolean;
}

const levelLabels = {
  BEGINNER: { label: '初级', color: 'bg-green-100 text-green-800' },
  INTERMEDIATE: { label: '中级', color: 'bg-blue-100 text-blue-800' },
  ADVANCED: { label: '高级', color: 'bg-purple-100 text-purple-800' },
};

const levelEmojis = {
  BEGINNER: '📿',
  INTERMEDIATE: '🪷',
  ADVANCED: '🏔️',
};

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner');

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await fetch('/api/courses');
      if (response.ok) {
        const data = await response.json();
        setCourses(data);
      }
    } catch (error) {
      console.error('Failed to fetch courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const coursesByLevel = (level: string) => {
    return courses.filter((c) => c.level === level);
  };

  const enrolledCourses = courses.filter((c) => c.isEnrolled);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container max-w-6xl mx-auto px-4 py-8 flex items-center justify-center min-h-[500px]">
          <LoadingSpinner />
        </div>
        <Footer />
      </div>
    );
  }

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
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-amber-700">{enrolledCourses.length}</div>
                <div className="text-sm text-muted-foreground">已报名课程</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-amber-700">
                  {enrolledCourses.reduce((sum, c) => sum + c.lessons.length, 0)}
                </div>
                <div className="text-sm text-muted-foreground">已完成课时</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-amber-700">{enrolledCourses.length > 0 ? '学习中' : '-'}</div>
                <div className="text-sm text-muted-foreground">当前状态</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Course Tabs */}
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 max-w-md mx-auto">
            <TabsTrigger value="beginner">初级课程</TabsTrigger>
            <TabsTrigger value="intermediate">中级课程</TabsTrigger>
            <TabsTrigger value="advanced">高级课程</TabsTrigger>
          </TabsList>

          <TabsContent value="beginner" className="space-y-6">
            {coursesByLevel('BEGINNER').map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
            {coursesByLevel('BEGINNER').length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                暂无初级课程
              </div>
            )}
          </TabsContent>

          <TabsContent value="intermediate" className="space-y-6">
            {coursesByLevel('INTERMEDIATE').map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
            {coursesByLevel('INTERMEDIATE').length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                暂无中级课程
              </div>
            )}
          </TabsContent>

          <TabsContent value="advanced" className="space-y-6">
            {coursesByLevel('ADVANCED').map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
            {coursesByLevel('ADVANCED').length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                暂无高级课程
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </div>
  );
}

function CourseCard({ course }: { course: Course }) {
  const levelInfo = levelLabels[course.level];
  const emoji = levelEmojis[course.level];

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="md:flex">
        <div className="md:w-48 bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center text-6xl">
          {emoji}
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
            {course.isEnrolled && (
              <Badge className="bg-amber-100 text-amber-700">已报名</Badge>
            )}
          </div>

          <CardDescription className="mb-4">
            {course.description}
          </CardDescription>

          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
            <div className="flex items-center gap-1">
              <Video className="w-4 h-4" />
              {course.lessons.length} 课时
            </div>
            {course.duration && (
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {course.duration} 分钟
              </div>
            )}
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              {course.studentCount} 人学习
            </div>
          </div>

          <CardFooter className="p-0">
            {course.isEnrolled ? (
              <Button asChild className="w-full md:w-auto">
                <Link href={`/courses/${course.id}`}>
                  <PlayCircle className="w-4 h-4 mr-2" />
                  继续学习
                </Link>
              </Button>
            ) : (
              <Button asChild className="w-full md:w-auto" disabled={!course.isPublished}>
                <Link href={`/courses/${course.id}`}>
                  <PlayCircle className="w-4 h-4 mr-2" />
                  {course.isPublished ? '立即报名' : '敬请期待'}
                </Link>
              </Button>
            )}
          </CardFooter>
        </div>
      </div>
    </Card>
  );
}
