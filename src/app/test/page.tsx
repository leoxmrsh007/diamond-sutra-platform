/**
 * 测试页面 - 验证API和组件功能
 */

'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';

interface TestResult {
  name: string;
  status: 'pending' | 'loading' | 'success' | 'error';
  message: string;
  duration?: number;
}

export default function TestPage() {
  const [testResults, setTestResults] = useState<TestResult[]>([
    { name: 'API: /api/research-simple', status: 'pending', message: '等待测试' },
    { name: 'API: /api/research/versions', status: 'pending', message: '等待测试' },
    { name: 'API: /api/research/commentaries', status: 'pending', message: '等待测试' },
    { name: 'API: /api/chapters', status: 'pending', message: '等待测试' },
    { name: 'API: /api/verses', status: 'pending', message: '等待测试' },
  ]);

  const [isRunning, setIsRunning] = useState(false);

  const runTest = async (index: number, url: string) => {
    setTestResults(prev => {
      const newResults = [...prev];
      newResults[index] = { ...newResults[index], status: 'loading', message: '测试中...' };
      return newResults;
    });

    const startTime = performance.now();

    try {
      const response = await fetch(url);
      const duration = Math.round(performance.now() - startTime);
      const data = await response.json();

      if (response.ok) {
        setTestResults(prev => {
          const newResults = [...prev];
          newResults[index] = {
            name: prev[index].name,
            status: 'success',
            message: `成功 (${duration}ms) - ${JSON.stringify(data).slice(0, 50)}...`,
            duration
          };
          return newResults;
        });
      } else {
        setTestResults(prev => {
          const newResults = [...prev];
          newResults[index] = {
            name: prev[index].name,
            status: 'error',
            message: `失败 (${response.status}): ${data.error || response.statusText}`,
            duration
          };
          return newResults;
        });
      }
    } catch (error) {
      const duration = Math.round(performance.now() - startTime);
      setTestResults(prev => {
        const newResults = [...prev];
        newResults[index] = {
          name: prev[index].name,
          status: 'error',
          message: `网络错误: ${error instanceof Error ? error.message : String(error)}`,
          duration
        };
        return newResults;
      });
    }
  };

  const runAllTests = async () => {
    setIsRunning(true);
    await Promise.all([
      runTest(0, '/api/research-simple'),
      runTest(1, '/api/research/versions?limit=3'),
      runTest(2, '/api/research/commentaries?limit=3'),
      runTest(3, '/api/chapters?sutra=diamond-sutra'),
      runTest(4, '/api/verses?sutra=diamond-sutra&limit=5'),
    ]);
    setIsRunning(false);
  };

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'loading':
        return <Loader2 className="w-5 h-5 animate-spin text-blue-600" />;
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return <div className="w-5 h-5 rounded-full bg-gray-300" />;
    }
  };

  const getStatusBadge = (status: TestResult['status']) => {
    switch (status) {
      case 'loading':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700">测试中</Badge>;
      case 'success':
        return <Badge variant="outline" className="bg-green-50 text-green-700">通过</Badge>;
      case 'error':
        return <Badge variant="outline" className="bg-red-50 text-red-700">失败</Badge>;
      default:
        return <Badge variant="outline">等待</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">功能测试页面</h1>
          <p className="text-muted-foreground">测试API接口和页面功能</p>
        </div>

        {/* Test Controls */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>测试控制</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Button
                onClick={runAllTests}
                disabled={isRunning}
                className="min-w-[120px]"
              >
                {isRunning ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    测试中...
                  </>
                ) : (
                  '运行所有测试'
                )}
              </Button>
              <Button
                variant="outline"
                onClick={() => setTestResults(prev => prev.map(t => ({ ...t, status: 'pending' as const, message: '等待测试' })))}
              >
                清除结果
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Test Results */}
        <Card>
          <CardHeader>
            <CardTitle>测试结果</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {testResults.map((result, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border ${
                    result.status === 'success' ? 'border-green-200 bg-green-50' :
                    result.status === 'error' ? 'border-red-200 bg-red-50' :
                    result.status === 'loading' ? 'border-blue-200 bg-blue-50' :
                    'border-gray-200'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-0.5">
                      {getStatusIcon(result.status)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium">{result.name}</span>
                        {getStatusBadge(result.status)}
                        {result.duration && (
                          <span className="text-sm text-muted-foreground">{result.duration}ms</span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground break-all">{result.message}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Links */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>快速导航</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button variant="outline" asChild>
                <a href="/study">经文学习</a>
              </Button>
              <Button variant="outline" asChild>
                <a href="/research">深度研究</a>
              </Button>
              <Button variant="outline" asChild>
                <a href="/ai">AI问答</a>
              </Button>
              <Button variant="outline" asChild>
                <a href="/courses">课程</a>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Info */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="font-medium text-blue-900 mb-2">测试说明</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• 点击"运行所有测试"按钮开始测试</li>
            <li>• 测试会检查各API接口的响应状态和响应时间</li>
            <li>• 绿色表示测试通过，红色表示测试失败</li>
            <li>• 响应时间小于500ms为良好性能</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
