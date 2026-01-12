/**
 * AI 讲师问答页面 - 支持流式响应
 */

'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { LoadingSpinner } from '@/components/ui/loading';
import {
  Send,
  Sparkles,
  Loader2,
  BookOpen,
  Lightbulb,
  History,
  Copy,
  ThumbsUp,
  ThumbsDown,
  RefreshCw,
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isStreaming?: boolean;
}

const suggestedQuestions = [
  '什么是"般若"（智慧）？',
  '如何理解"凡所有相，皆是虚妄"？',
  '什么是"无住生心"？',
  '《金刚经》的核心思想是什么？',
  '如何将经义应用到日常生活中？',
];

export default function AIPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: '阿弥陀佛！我是您的金刚经 AI 讲师。您可以问我任何关于《金刚经》的问题，包括经义解析、修行实践、哲学思考等。',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // 创建流式响应的消息占位符
    const assistantMessage: Message = {
      role: 'assistant',
      content: '',
      timestamp: new Date(),
      isStreaming: true,
    };
    setMessages((prev) => [...prev, assistantMessage]);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: input,
          history: messages.slice(0, -1).map((m) => ({ role: m.role, content: m.content })),
          stream: true,
        }),
      });

      if (!response.ok) throw new Error('API 请求失败');

      // 处理流式响应
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (reader) {
        let fullContent = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6);
              if (data === '[DONE]') {
                break;
              }

              try {
                const parsed = JSON.parse(data);
                if (parsed.content) {
                  fullContent += parsed.content;
                  setMessages((prev) =>
                    prev.map((msg, i) =>
                      i === prev.length - 1 && msg.role === 'assistant'
                        ? { ...msg, content: fullContent }
                        : msg
                    )
                  );
                }
              } catch {
                // 忽略解析错误
              }
            }
          }
        }

        // 流式响应完成
        setMessages((prev) =>
          prev.map((msg, i) =>
            i === prev.length - 1 && msg.role === 'assistant'
              ? { ...msg, isStreaming: false }
              : msg
          )
        );
      }
    } catch (error) {
      // 回退到非流式响应
      try {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: input,
            history: messages.slice(0, -1).map((m) => ({ role: m.role, content: m.content })),
          }),
        });

        if (!response.ok) throw new Error('API 请求失败');

        const data = await response.json();

        setMessages((prev) =>
          prev.map((msg, i) =>
            i === prev.length - 1 && msg.role === 'assistant'
              ? { ...msg, content: data.message, isStreaming: false }
              : msg
          )
        );
      } catch {
        setMessages((prev) => prev.slice(0, -1));
        const errorMessage: Message = {
          role: 'assistant',
          content: '抱歉，AI 服务暂时不可用。请稍后再试。',
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, errorMessage]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleRegenerate = async () => {
    if (messages.length < 2) return;

    // 获取最后一条用户消息
    const lastUserMessage = [...messages].reverse().find((m) => m.role === 'user');
    if (!lastUserMessage) return;

    // 移除最后的助手消息
    setMessages((prev) => prev.slice(0, -1));
    setInput(lastUserMessage.content);
    handleSend();
  };

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <Badge className="mb-4">
            <Sparkles className="w-3 h-3 mr-1" />
            Powered by Gemini 2.0
          </Badge>
          <h1 className="text-3xl font-bold mb-2">AI 讲师问答</h1>
          <p className="text-muted-foreground">
            关于《金刚经》的任何问题，随时为您解答
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="md:col-span-1 space-y-4">
            {/* Suggested Questions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center">
                  <Lightbulb className="w-4 h-4 mr-2" />
                  推荐问题
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {suggestedQuestions.map((q, i) => (
                  <button
                    key={i}
                    onClick={() => setInput(q)}
                    className="w-full text-left text-sm p-2 rounded-lg hover:bg-muted transition-colors"
                  >
                    {q}
                  </button>
                ))}
              </CardContent>
            </Card>

            {/* Quick Topics */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center">
                  <BookOpen className="w-4 h-4 mr-2" />
                  学习主题
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                {['空性', '布施', '忍辱', '般若', '菩提心', '四相', '无住', '涅槃'].map((topic) => (
                  <Badge
                    key={topic}
                    variant="outline"
                    className="cursor-pointer hover:bg-amber-50 hover:text-amber-700"
                    onClick={() => setInput(`请讲解一下"${topic}"的含义`)}
                  >
                    {topic}
                  </Badge>
                ))}
              </CardContent>
            </Card>

            {/* Chat History */}
            {messages.length > 1 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm flex items-center">
                    <History className="w-4 h-4 mr-2" />
                    对话记录
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  已进行 {Math.floor((messages.length - 1) / 2)} 轮对话
                </CardContent>
              </Card>
            )}
          </div>

          {/* Chat Area */}
          <div className="md:col-span-3">
            <Card className="h-[600px] flex flex-col">
              <ScrollArea className="flex-1 p-4" ref={scrollRef}>
                <div className="space-y-4">
                  {messages.map((msg, i) => (
                    <div
                      key={i}
                      className={`flex ${
                        msg.role === 'user' ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      <div
                        className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                          msg.role === 'user'
                            ? 'bg-amber-500 text-white'
                            : 'bg-muted'
                        }`}
                      >
                        {msg.role === 'assistant' ? (
                          <div className="prose prose-sm max-w-none">
                            <ReactMarkdown>{msg.content}</ReactMarkdown>
                          </div>
                        ) : (
                          <p className="whitespace-pre-wrap">{msg.content}</p>
                        )}
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs opacity-70">
                            {msg.timestamp.toLocaleTimeString('zh-CN', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                          {msg.role === 'assistant' && !msg.isStreaming && msg.content && (
                            <div className="flex gap-1">
                              <button
                                className="opacity-50 hover:opacity-100 transition-opacity"
                                onClick={() => handleCopy(msg.content)}
                                title="复制"
                              >
                                <Copy className="w-3 h-3" />
                              </button>
                              <button
                                className="opacity-50 hover:opacity-100 transition-opacity"
                                title="重新生成"
                                onClick={handleRegenerate}
                              >
                                <RefreshCw className="w-3 h-3" />
                              </button>
                            </div>
                          )}
                        </div>
                        {msg.isStreaming && (
                          <span className="inline-block ml-1">
                            <span className="animate-bounce">●</span>
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                  {isLoading && !messages.find((m) => m.isStreaming) && (
                    <div className="flex justify-start">
                      <div className="bg-muted rounded-2xl px-4 py-3 flex items-center">
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        思考中...
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>

              {/* Input */}
              <div className="border-t p-4">
                <div className="flex gap-2">
                  <Textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="请输入您的问题...（Shift + Enter 换行）"
                    className="min-h-[60px] resize-none"
                    disabled={isLoading}
                  />
                  <Button
                    onClick={handleSend}
                    disabled={!input.trim() || isLoading}
                    size="icon"
                    className="h-[60px] w-[60px]"
                  >
                    {isLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Send className="w-5 h-5" />
                    )}
                  </Button>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <p className="text-xs text-muted-foreground">
                    按 Enter 发送，Shift + Enter 换行
                  </p>
                  {messages.length > 1 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setMessages([messages[0]])}
                      className="text-xs"
                    >
                      清空对话
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
