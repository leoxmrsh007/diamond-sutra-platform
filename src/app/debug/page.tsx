/**
 * 临时前端检测页面
 * 用于快速检查系统各模块运行状态
 */

'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  CheckCircle2,
  XCircle,
  Loader2,
  Database,
  Server,
  Cpu,
  Globe,
  Link as LinkIcon,
  BookOpen,
  MessageSquare,
  GraduationCap,
  Users,
  Sparkles,
  FileText,
  Activity,
} from 'lucide-react';

interface TestResult {
  name: string;
  status: 'pending' | 'loading' | 'success' | 'error';
  message?: string | undefined;
  duration?: number | undefined;
}

interface SystemInfo {
  environment: string;
  nodeVersion: string;
  nextVersion: string;
  reactVersion: string;
  buildTime: string;
}

export default function DebugPage() {
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const systemInfo = useMemo<SystemInfo>(
    () => ({
      environment: process.env.NODE_ENV || 'unknown',
      nodeVersion: process.version,
      nextVersion: '16.1.1',
      reactVersion: '19.2.3',
      buildTime: new Date().toLocaleString('zh-CN'),
    }),
    [],
  );

  // 测试套件定义
  type TestDefinition = {
  name: string;
  url: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: unknown;
  checkData?: boolean;
};

const testSuites: Array<{
  category: string;
  icon: typeof Server;
  tests: TestDefinition[];
}> = [
    {
      category: 'API服务',
      icon: Server,
      tests: [
        { name: '章节数据API', url: '/api/chapters?sutra=diamond-sutra' },
        { name: '课程列表API', url: '/api/courses' },
        { name: 'AI对话API(流式)', url: '/api/chat', method: 'POST', body: { message: '测试', stream: false } },
        { name: '学习进度API', url: '/api/study-progress' },
      ],
    },
    {
      category: '核心功能页面',
      icon: Globe,
      tests: [
        { name: '首页', url: '/' },
        { name: '经文学习页', url: '/study' },
        { name: 'AI问答页', url: '/ai' },
        { name: '系统课程页', url: '/courses' },
        { name: '社区页面', url: '/community' },
      ],
    },
    {
      category: '数据功能',
      icon: Database,
      tests: [
        { name: '数据库连接', url: '/api/chapters?sutra=diamond-sutra', checkData: true },
        { name: '用户认证系统', url: '/api/auth/providers' },
      ],
    },
  ];

  // 运行测试
  const runTest = async (test: TestDefinition): Promise<TestResult> => {
    const startTime = Date.now();

    try {
      const options: RequestInit = {
        method: test.method ?? 'GET',
      };

      if (test.body) {
        options.headers = { 'Content-Type': 'application/json' };
        options.body = JSON.stringify(test.body);
      }

      const response = await fetch(test.url, options);
      const duration = Date.now() - startTime;

      if (!response.ok) {
        return {
          name: test.name,
          status: 'error',
          message: `HTTP ${response.status}`,
          duration,
        };
      }

      if (test.checkData) {
        const data = await response.json();
        if (!data || (Array.isArray(data) && data.length === 0)) {
          return {
            name: test.name,
            status: 'error',
            message: '无数据返回',
            duration,
          };
        }
      }

      return {
        name: test.name,
        status: 'success',
        message: test.method === 'POST' ? '请求成功' : `${duration}ms`,
        duration,
      };
    } catch (error) {
      return {
        name: test.name,
        status: 'error',
        message: error instanceof Error ? error.message : '连接失败',
        duration: Date.now() - startTime,
      };
    }
  };

  const runAllTests = async () => {
    setTestResults([]);

    const allTests = testSuites.flatMap((suite) =>
      suite.tests.map((test) => test.name)
    );

    // 初始化测试结果为pending
    const initialResults = allTests.map((name) => ({
      name,
      status: 'pending' as const,
    }));
    setTestResults(initialResults);

    // 运行所有测试
    for (const suite of testSuites) {

      for (const test of suite.tests) {
        // 更新为loading状态
        setTestResults((prev) =>
          prev.map((r, idx) =>
            idx === prev.findIndex((p) => p.name === test.name)
              ? { ...r, status: 'loading' as const }
              : r
          )
        );

        // 运行测试
        const result = await runTest(test);
        await new Promise((resolve) => setTimeout(resolve, 300)); // 短暂延迟

        // 更新结果
        setTestResults((prev) =>
          prev.map((r) => (r.name === result.name ? result : r))
        );
      }
    }
  };

  const getTestStatus = (testName: string) => {
    return testResults.find((r) => r.name === testName) || { status: 'pending' };
  };

  const getOverallStatus = () => {
    if (testResults.length === 0) return 'pending';
    if (testResults.some((r) => r.status === 'loading')) return 'loading';
    if (testResults.some((r) => r.status === 'error')) return 'error';
    if (testResults.some((r) => r.status === 'pending')) return 'pending';
    return 'success';
  };

  const getSuccessCount = () => {
    return testResults.filter((r) => r.status === 'success').length;
  };

  const getTotalCount = () => {
    return testResults.length;
  };

  const StatusIcon = ({ status }: { status: TestResult['status'] }) => {
    switch (status) {
      case 'loading':
        return <Loader2 className="w-4 h-4 animate-spin text-blue-500" />;
      case 'success':
        return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <div className="w-4 h-4 rounded-full border-2 border-gray-300" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-amber-50">
      <Header />

      <div className="container max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Badge className="mb-4" variant="outline">
            <Activity className="w-3 h-3 mr-1" />
            系统检测
          </Badge>
          <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
            <Cpu className="w-10 h-10 text-blue-600" />
            金刚经平台 - 前端检测页面
          </h1>
          <p className="text-muted-foreground text-lg">
            快速检查系统各模块运行状态
          </p>
        </div>

        {/* Overall Status */}
        <Card className="mb-8 border-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl">系统总览</CardTitle>
                <CardDescription>平台运行状态概览</CardDescription>
              </div>
              <div className="flex items-center gap-4">
                {getOverallStatus() === 'loading' && (
                  <Badge className="bg-blue-100 text-blue-800">
                    <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                    检测中...
                  </Badge>
                )}
                {getOverallStatus() === 'success' && (
                  <Badge className="bg-green-100 text-green-800">
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    运行正常
                  </Badge>
                )}
                {getOverallStatus() === 'error' && (
                  <Badge className="bg-red-100 text-red-800">
                    <XCircle className="w-3 h-3 mr-1" />
                    存在异常
                  </Badge>
                )}
                <Button onClick={runAllTests} size="lg">
                  <Activity className="w-4 h-4 mr-2" />
                  开始检测
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-3xl font-bold text-blue-700">{getSuccessCount()}</div>
                <div className="text-sm text-muted-foreground">通过测试</div>
              </div>
              <div className="text-center p-4 bg-amber-50 rounded-lg">
                <div className="text-3xl font-bold text-amber-700">{getTotalCount()}</div>
                <div className="text-sm text-muted-foreground">总测试数</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-3xl font-bold text-green-700">
                  {getTotalCount() > 0 ? Math.round((getSuccessCount() / getTotalCount()) * 100) : 0}%
                </div>
                <div className="text-sm text-muted-foreground">通过率</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-3xl font-bold text-purple-700">13</div>
                <div className="text-sm text-muted-foreground">页面数量</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* System Info */}
        {systemInfo && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Database className="w-5 h-5 text-blue-600" />
                系统信息
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <div className="text-muted-foreground">运行环境</div>
                  <div className="font-medium">{systemInfo.environment}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Next.js</div>
                  <div className="font-medium">{systemInfo.nextVersion}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">React</div>
                  <div className="font-medium">{systemInfo.reactVersion}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">构建时间</div>
                  <div className="font-medium">{systemInfo.buildTime}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Test Suites */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {testSuites.map((suite, idx) => (
            <Card key={idx} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <suite.icon className="w-5 h-5 text-blue-600" />
                  {suite.category}
                </CardTitle>
                <CardDescription>{suite.tests.length} 项测试</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[300px]">
                  <div className="space-y-3">
                    {suite.tests.map((test) => {
                      const result = getTestStatus(test.name);
                      return (
                        <div
                          key={test.name}
                          className={`p-3 rounded-lg border ${
                            result.status === 'success'
                              ? 'bg-green-50 border-green-200'
                              : result.status === 'error'
                              ? 'bg-red-50 border-red-200'
                              : result.status === 'loading'
                              ? 'bg-blue-50 border-blue-200'
                              : 'bg-gray-50 border-gray-200'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <StatusIcon status={result.status} />
                              <div>
                                <div className="font-medium text-sm">{test.name}</div>
                                {'message' in result && result.message && (
                                  <div className="text-xs text-muted-foreground mt-1">
                                    {result.message}
                                  </div>
                                )}
                              </div>
                              </div>
                            {'duration' in result && result.duration && (
                              <Badge variant="outline" className="text-xs">
                                {result.duration}ms
                              </Badge>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Feature Overview */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-amber-600" />
              功能模块概览
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="space-y-3">
                <h3 className="font-semibold flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-blue-600" />
                  核心功能
                </h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    32分经文学习
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    多版本对照(汉/梵/藏)
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    AI智能解析
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    语音朗读功能
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    背景音乐播放
                  </li>
                </ul>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-green-600" />
                  学习工具
                </h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    系统课程体系
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    学习进度追踪
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    每日签到系统
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    笔记和书签
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    个人学习统计
                  </li>
                </ul>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold flex items-center gap-2">
                  <Users className="w-5 h-5 text-purple-600" />
                  社区互动
                </h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    AI流式问答
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    共修社区
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    深度研究板块
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    全局搜索
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    用户认证系统
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Links */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LinkIcon className="w-5 h-5 text-blue-600" />
              快速导航
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button variant="outline" className="h-auto flex-col py-4" asChild>
                <Link href="/">
                  <BookOpen className="w-6 h-6 mb-2" />
                  <span className="text-sm">首页</span>
                </Link>
              </Button>
              <Button variant="outline" className="h-auto flex-col py-4" asChild>
                <Link href="/study">
                  <FileText className="w-6 h-6 mb-2" />
                  <span className="text-sm">经文学习</span>
                </Link>
              </Button>
              <Button variant="outline" className="h-auto flex-col py-4" asChild>
                <Link href="/ai">
                  <MessageSquare className="w-6 h-6 mb-2" />
                  <span className="text-sm">AI问答</span>
                </Link>
              </Button>
              <Button variant="outline" className="h-auto flex-col py-4" asChild>
                <Link href="/courses">
                  <GraduationCap className="w-6 h-6 mb-2" />
                  <span className="text-sm">系统课程</span>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
}
