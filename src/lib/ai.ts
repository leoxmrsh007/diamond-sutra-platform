/**
 * AI 服务 - 支持 Gemini 和 DeepSeek
 * 金刚经平台 AI 功能核心模块
 */

// AI 提供商类型
export type AIProvider = 'gemini' | 'deepseek';

// Gemini 模型配置
export const GEMINI_MODELS = {
  FLASH: 'gemini-2.0-flash-exp',
  PRO: 'gemini-2.5-pro-exp-08-27',
  THINKING: 'gemini-2.5-flash-thinking-exp',
} as const;

// DeepSeek 模型配置
export const DEEPSEEK_MODELS = {
  CHAT: 'deepseek-chat',
  CODER: 'deepseek-coder',
  REASONER: 'deepseek-reasoner',
} as const;

// 系统提示词
const SYSTEM_PROMPTS = {
  sutraScholar: `你是一位深入研究中观的佛学学者，专精于《金刚般若波罗蜜经》（简称《金刚经》）。
你的回答应该：
1. 准确引用经文内容
2. 结合龙树菩萨中观思想进行解释
3. 语言清晰易懂，适合不同层次的修行者
4. 保持客观、尊重的态度
5. 引用相关注释（如：弥勒菩萨《金刚经论》、天台智者大师《金刚经疏》等）`,

  studyGuide: `你是一位慈悲耐心的佛法导师，负责指导学员学习《金刚经》。
你的任务是：
1. 根据学员的水平调整讲解深度
2. 鼓励学员思考，而不是直接给出答案
3. 提供实用的修行建议
4. 培养学员的正知正见`,

  verseAnalyzer: `你是一位精通梵、汉、藏三语的佛经翻译专家。
你需要：
1. 分析偈颂的语法结构
2. 解释关键词的含义
3. 比较不同版本的差异
4. 提供准确的梵文还原本源`,
} as const;

// 获取默认的 AI 提供商
export function getAIProvider(): AIProvider {
  return (process.env.AI_PROVIDER as AIProvider) || 'gemini';
}

// ==================== DeepSeek API ====================

interface DeepSeekMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface DeepSeekResponse {
  choices: Array<{
    message: {
      content: string;
      role: string;
    };
    finish_reason: string;
  }>;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

/**
 * DeepSeek API 调用
 */
async function callDeepSeek(
  messages: DeepSeekMessage[],
  model: string = DEEPSEEK_MODELS.CHAT,
  stream: boolean = false
): Promise<DeepSeekResponse | ReadableStream> {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    throw new Error('DEEPSEEK_API_KEY 环境变量未设置');
  }

  const response = await fetch('https://api.deepseek.com/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages,
      stream,
      temperature: 0.7,
      max_tokens: 4096,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`DeepSeek API 错误: ${response.status} - ${error}`);
  }

  if (stream) {
    return response.body!;
  }

  return response.json();
}

/**
 * DeepSeek 智能问答
 */
export async function askQuestionDeepSeek(
  question: string,
  context?: string
): Promise<string> {
  const messages: DeepSeekMessage[] = [
    {
      role: 'system',
      content: SYSTEM_PROMPTS.sutraScholar,
    },
  ];

  if (context) {
    messages.push({
      role: 'user',
      content: `【经文背景】\n${context}\n\n【问题】\n${question}`,
    });
  } else {
    messages.push({
      role: 'user',
      content: question,
    });
  }

  try {
    const result = await callDeepSeek(messages) as DeepSeekResponse;
    return result.choices[0]?.message?.content || '';
  } catch (error) {
    console.error('DeepSeek API 错误:', error);
    throw new Error('AI 问答服务暂时不可用');
  }
}

/**
 * DeepSeek 流式对话
 */
export async function* chatStreamDeepSeek(
  message: string,
  history: Array<{ role: string; content: string }>
): AsyncGenerator<string, void, unknown> {
  const messages: DeepSeekMessage[] = [
    {
      role: 'system',
      content: SYSTEM_PROMPTS.sutraScholar,
    },
  ];

  // 添加历史消息
  for (const msg of history) {
    if (msg.role === 'user' || msg.role === 'assistant') {
      messages.push({
        role: msg.role,
        content: msg.content,
      });
    }
  }

  // 添加当前消息
  messages.push({
    role: 'user',
    content: message,
  });

  try {
    const stream = await callDeepSeek(messages, DEEPSEEK_MODELS.CHAT, true) as ReadableStream;
    const reader = stream.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      const lines = chunk.split('\n').filter(line => line.trim().startsWith('data:'));

      for (const line of lines) {
        const data = line.replace('data:', '').trim();
        if (data === '[DONE]') continue;

        try {
          const parsed = JSON.parse(data);
          const content = parsed.choices[0]?.delta?.content;
          if (content) {
            yield content;
          }
        } catch {
          // 忽略解析错误
        }
      }
    }
  } catch (error) {
    console.error('DeepSeek 流式对话错误:', error);
    throw new Error('AI 对话服务暂时不可用');
  }
}

// ==================== Gemini API (原有功能) ====================

import {
  GoogleGenerativeAI,
  GenerativeModel,
  GenerationConfig,
} from '@google/generative-ai';

let geminiClient: GoogleGenerativeAI | null = null;

export function getGeminiClient(): GoogleGenerativeAI {
  if (!geminiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY 环境变量未设置');
    }
    geminiClient = new GoogleGenerativeAI(apiKey);
  }
  return geminiClient;
}

export function getGeminiModel(
  modelName: string = GEMINI_MODELS.FLASH,
  systemPrompt?: string
): GenerativeModel {
  const client = getGeminiClient();

  const config: GenerationConfig = {
    temperature: 0.7,
    topP: 0.9,
    topK: 40,
    maxOutputTokens: 8192,
  };

  return client.getGenerativeModel(
    {
      model: modelName,
      systemInstruction: systemPrompt,
      generationConfig: config,
    },
    {
      apiVersion: 'v1beta',
    }
  );
}

/**
 * Gemini 智能问答
 */
export async function askQuestionGemini(
  question: string,
  context?: string,
  model: string = GEMINI_MODELS.FLASH
): Promise<string> {
  const gemini = getGeminiModel(model, SYSTEM_PROMPTS.sutraScholar);

  const prompt = context
    ? `【经文背景】\n${context}\n\n【问题】\n${question}`
    : question;

  try {
    const result = await gemini.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error('Gemini API 错误:', error);
    throw new Error('AI 问答服务暂时不可用');
  }
}

/**
 * Gemini 流式对话
 */
export async function* chatStreamGemini(
  message: string,
  history: Array<{ role: string; content: string }>,
  systemPrompt?: string
): AsyncGenerator<string, void, unknown> {
  const gemini = getGeminiModel(GEMINI_MODELS.FLASH, systemPrompt || SYSTEM_PROMPTS.sutraScholar);

  const chatHistory = history
    .filter((msg) => msg.role !== 'system')
    .map((msg) => ({
      role: msg.role === 'assistant' ? 'model' : msg.role,
      parts: [{ text: msg.content }],
    }));

  try {
    const chat = gemini.startChat({
      history: chatHistory,
    });

    const result = await chat.sendMessageStream(message);

    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      if (chunkText) {
        yield chunkText;
      }
    }
  } catch (error) {
    console.error('Gemini 流式对话错误:', error);
    throw new Error('AI 对话服务暂时不可用');
  }
}

// ==================== 统一接口 ====================

/**
 * 智能问答（根据配置选择 AI 提供商）
 */
export async function askQuestion(
  question: string,
  context?: string,
  provider?: AIProvider
): Promise<string> {
  const aiProvider = provider || getAIProvider();

  if (aiProvider === 'deepseek') {
    return askQuestionDeepSeek(question, context);
  } else {
    return askQuestionGemini(question, context);
  }
}

/**
 * 流式对话（根据配置选择 AI 提供商）
 */
export async function* chatStream(
  message: string,
  history: Array<{ role: string; content: string }>,
  provider?: AIProvider
): AsyncGenerator<string, void, unknown> {
  const aiProvider = provider || getAIProvider();

  if (aiProvider === 'deepseek') {
    yield* chatStreamDeepSeek(message, history);
  } else {
    yield* chatStreamGemini(message, history);
  }
}

/**
 * 验证 API 密钥
 */
export async function validateApiKey(provider?: AIProvider): Promise<boolean> {
  const aiProvider = provider || getAIProvider();

  if (aiProvider === 'deepseek') {
    try {
      const response = await fetch('https://api.deepseek.com/models', {
        headers: {
          'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`,
        },
      });
      return response.ok;
    } catch {
      return false;
    }
  } else {
    try {
      const client = getGeminiClient();
      const model = client.getGenerativeModel({ model: GEMINI_MODELS.FLASH });
      await model.generateContent('测试连接');
      return true;
    } catch {
      return false;
    }
  }
}
