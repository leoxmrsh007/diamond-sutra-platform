/**
 * AI 聊天 API 路由
 * 支持流式响应和对话历史
 * 支持 Gemini 和 DeepSeek
 */

import { NextRequest, NextResponse } from 'next/server';
import { askQuestion, chatStream, getAIProvider } from '@/lib/ai';

// 金刚经系统提示词
const DIAMOND_SUTRA_SYSTEM = `你是一位深入研究中观的佛学学者，专精于《金刚般若波罗蜜经》（简称《金刚经》）。

你的回答应该：
1. 准确引用经文内容
2. 结合龙树菩萨中观思想进行解释
3. 语言清晰易懂，适合不同层次的修行者
4. 保持客观、尊重的态度
5. 引用相关注释（如：弥勒菩萨《金刚经论》、天台智者大师《金刚经疏》、六祖惠能《金刚经口诀》等）

回答风格：
- 庄重而不失亲和
- 深入浅出
- 既有理论深度，又能联系实际修行
- 适当引用经文原文

注意事项：
- 如果问题与《金刚经》无关，请礼貌地引导回到主题
- 避免过度玄虚，保持理性清晰的思辨
- 对于修行建议，要中道平和，不偏激`;

// POST 请求 - 发送消息
export async function POST(request: NextRequest) {
  try {
    const { message, history, stream, provider } = await request.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: '请提供有效的问题' },
        { status: 400 }
      );
    }

    // 流式响应
    if (stream) {
      const encoder = new TextEncoder();
      const streamResponse = new ReadableStream({
        async start(controller) {
          try {
            // 使用 DeepSeek 的流式响应需要特殊处理
            const aiProvider = provider || getAIProvider();

            if (aiProvider === 'deepseek') {
              // DeepSeek SSE 格式
              const { chatStreamDeepSeek } = await import('@/lib/ai');
              for await (const chunk of chatStreamDeepSeek(message, history || [])) {
                controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content: chunk })}\n\n`));
              }
            } else {
              // Gemini 流式响应
              const { chatStreamGemini } = await import('@/lib/ai');
              for await (const chunk of chatStreamGemini(message, history || [], DIAMOND_SUTRA_SYSTEM)) {
                controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content: chunk })}\n\n`));
              }
            }

            controller.enqueue(encoder.encode('data: [DONE]\n\n'));
            controller.close();
          } catch (error) {
            controller.error(error);
          }
        },
      });

      return new NextResponse(streamResponse, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
        },
      });
    }

    // 普通响应
    const answer = await askQuestion(message, undefined, provider);

    return NextResponse.json({
      message: answer,
      provider: getAIProvider(),
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Chat API 错误:', error);
    return NextResponse.json(
      { error: '服务暂时不可用，请稍后再试' },
      { status: 500 }
    );
  }
}

// GET 请求 - 获取推荐问题和配置
export async function GET() {
  const suggestedQuestions = [
    '什么是"般若"（智慧）？',
    '如何理解"凡所有相，皆是虚妄"？',
    '什么是"无住生心"？',
    '《金刚经》的核心思想是什么？',
    '如何将经义应用到日常生活中？',
    '什么是"四相"？',
    '如何理解"应无所住而生其心"？',
    '布施波罗蜜的含义是什么？',
  ];

  return NextResponse.json({
    suggestedQuestions,
    provider: getAIProvider(),
  });
}

// 配置
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
