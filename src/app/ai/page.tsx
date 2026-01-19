/**
 * AI 讲师问答页面 - 支持流式响应和对话历史
 */

'use client';

import { useState, useRef, useEffect } from 'react';
import { useSession } from 'next-auth/react';
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
  Trash2,
  Plus,
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isStreaming?: boolean;
}

interface ChatSession {
  id: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
  _count?: { messages: number };
}

const suggestedQuestions = [
  '什么是"般若"（智慧）？',
  '如何理解"凡所有相，皆是虚妄"？',
  '什么是"无住生心"？',
  '《金刚经》的核心思想是什么？',
  '如何将经义应用到日常生活中？',
];

export default function AIPage() {
  const { data: session } = useSession();
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

  // 会话历史管理
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [showHistory, setShowHistory] = useState(false);

  // 加载会话历史
  useEffect(() => {
    if (session?.user) {
      loadChatSessions();
    }
  }, [session]);

  const loadChatSessions = async () => {
    try {
      const res = await fetch('/api/chat/history');
      if (res.ok) {
        const sessions = await res.json();
        setChatSessions(sessions);
      }
    } catch (error) {
      console.error('加载会话历史失败:', error);
    }
  };

  const loadSessionMessages = async (sessionId: string) => {
    try {
      const res = await fetch(`/api/chat/history?sessionId=${sessionId}`);
      if (res.ok) {
        const historyMessages = await res.json();
        const formattedMessages: Message[] = historyMessages.map((msg: any) => ({
          role: msg.role,
          content: msg.content,
          timestamp: new Date(msg.createdAt),
        }));
        setMessages(formattedMessages);
        setCurrentSessionId(sessionId);
        setShowHistory(false);
      }
    } catch (error) {
      console.error('加载会话消息失败:', error);
    }
  };

  const startNewChat = () => {
    setMessages([
      {
        role: 'assistant',
        content: '阿弥陀佛！我是您的金刚经 AI 讲师。您可以问我任何关于《金刚经》的问题，包括经义解析、修行实践、哲学思考等。',
        timestamp: new Date(),
      },
    ]);
    setCurrentSessionId(null);
    setShowHistory(false);
  };

  const deleteSession = async (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const res = await fetch(`/api/chat/history?sessionId=${sessionId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setChatSessions((prev) => prev.filter((s) => s.id !== sessionId));
        if (currentSessionId === sessionId) {
          startNewChat();
        }
      }
    } catch (error) {
      console.error('删除会话失败:', error);
    }
  };

  const saveMessage = async (role: 'user' | 'assistant', content: string) => {
    if (!session?.user) return;

    try {
      await fetch('/api/chat/history', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: currentSessionId,
          role,
          content,
        }),
      });
    } catch (error) {
      console.error('保存消息失败:', error);
    }
  };

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
    const userInput = input;
    setInput('');
    setIsLoading(true);

    // 保存用户消息
    await saveMessage('user', userInput);

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

        // 保存助手响应
        await saveMessage('assistant', fullContent);

        // 更新会话列表
        if (session?.user) {
          loadChatSessions();
        }
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
          <div className="flex items-center justify-center gap-2 mb-4">
            <Badge className="mb-4">
              <Sparkles className="w-3 h-3 mr-1" />
              Powered by Gemini 2.0
            </Badge>
            {session?.user && chatSessions.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowHistory(!showHistory)}
                className="mb-4"
              >
                <History className="w-4 h-4 mr-1" />
                对话历史 ({chatSessions.length})
              </Button>
            )}
          </div>
          <h1 className="text-3xl font-bold mb-2">AI 讲师问答</h1>
          <p className="text-muted-foreground">
            关于《金刚经》的任何问题，随时为您解答
          </p>
        </div>

        {/* 会话历史面板 */}
        {showHistory && session?.user && (
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center">
                  <History className="w-5 h-5 mr-2" />
                  对话历史
                </CardTitle>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={startNewChat}
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    新对话
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowHistory(false)}
                  >
                    关闭
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-3">
                {chatSessions.map((chatSession) => (
                  <div
                    key={chatSession.id}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      currentSessionId === chatSession.id
                        ? 'border-amber-500 bg-amber-50'
                        : 'hover:bg-muted'
                    }`}
                    onClick={() => loadSessionMessages(chatSession.id)}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">
                          {chatSession.title}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {chatSession._count?.messages || 0} 条消息
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0 shrink-0"
                        onClick={(e) => deleteSession(chatSession.id, e)}
                      >
                        <Trash2 className="w-3 h-3 text-destructive" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

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
