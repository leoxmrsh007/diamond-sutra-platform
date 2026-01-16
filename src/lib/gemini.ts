/**
 * Gemini AI 服务
 * 金刚经平台 AI 功能核心模块
 */

import {
  GoogleGenerativeAI,
  GenerativeModel,
  GenerationConfig,
} from '@google/generative-ai';

// Gemini 模型配置
export const GEMINI_MODELS = {
  FLASH: 'gemini-2.0-flash-exp',          // 快速响应，适合实时对话
  PRO: 'gemini-2.5-pro-exp-08-27',         // 深度分析，适合研究
  THINKING: 'gemini-2.5-flash-thinking-exp', // 复杂推理
} as const;

export type GeminiModel = typeof GEMINI_MODELS[keyof typeof GEMINI_MODELS];

// 系统提示词模板
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

// 初始化 Gemini 客户端
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

// 获取模型实例
export function getModel(
  modelName: GeminiModel = GEMINI_MODELS.FLASH,
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

// ==================== AI 功能函数 ====================

/**
 * 智能问答
 */
export async function askQuestion(
  question: string,
  context?: string,
  model: GeminiModel = GEMINI_MODELS.FLASH
): Promise<string> {
  const gemini = getModel(model, SYSTEM_PROMPTS.sutraScholar);

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
 * 偈颂深度解析
 */
export async function analyzeVerse(verse: {
  chinese: string;
  sanskrit?: string;
  english?: string;
  verseNum: number;
}): Promise<{
  summary: string;
  keyConcepts: string[];
  sanskritAnalysis?: string;
  practicalAdvice: string;
  relatedVerses: number[];
}> {
  const gemini = getModel(GEMINI_MODELS.PRO, SYSTEM_PROMPTS.verseAnalyzer);

  const prompt = `请对以下《金刚经》偈颂进行深度分析：

【偈颂编号】第 ${verse.verseNum} 偈
【汉译】${verse.chinese}
${verse.sanskrit ? `【梵文】${verse.sanskrit}` : ''}
${verse.english ? `【英译】${verse.english}` : ''}

请以 JSON 格式返回以下内容：
{
  "summary": "偈颂大意（100字以内）",
  "keyConcepts": ["关键概念1", "关键概念2", ...],
  "sanskritAnalysis": "梵文语法结构分析（如果有梵文）",
  "practicalAdvice": "如何将此偈颂应用于日常生活和修行",
  "relatedVerses": [相关偈颂编号列表]
}`;

  try {
    const result = await gemini.generateContent(prompt);
    const text = result.response.text();

    // 尝试解析 JSON
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }

    // 如果无法解析 JSON，返回默认结构
    return {
      summary: text.slice(0, 200),
      keyConcepts: [],
      practicalAdvice: '',
      relatedVerses: [],
    };
  } catch (error) {
    console.error('偈颂解析错误:', error);
    throw new Error('AI 解析服务暂时不可用');
  }
}

/**
 * 生成经文插图描述（用于图像生成）
 */
export async function generateIllustrationPrompt(
  verseContent: string,
  style: 'traditional' | 'modern' | 'minimalist' = 'minimalist'
): Promise<string> {
  const gemini = getModel(GEMINI_MODELS.FLASH);

  const stylePrompts = {
    traditional: '传统中国画风格，水墨画技法，古典意境',
    modern: '现代插画风格，扁平化设计，色彩明快',
    minimalist: '极简主义风格，留白，禅意，线条简洁',
  };

  const prompt = `根据以下《金刚经》偈颂，生成一个用于AI图像生成的提示词（英文）：

【偈颂内容】
${verseContent}

【要求】
1. 风格：${stylePrompts[style]}
2. 画面应传达偈颂的禅意和哲学内涵
3. 避免直接描绘佛陀形象，使用象征性元素（莲花、明月、山水、云雾等）
4. 保持简洁、宁静的美学
5. 返回格式：简洁的英文图像提示词，适合 Midjourney 或 DALL-E 使用
6. 只返回提示词，不要其他内容`;

  try {
    const result = await gemini.generateContent(prompt);
    return result.response.text().trim();
  } catch (error) {
    console.error('插图生成错误:', error);
    throw new Error('AI 插图生成服务暂时不可用');
  }
}

/**
 * 语义搜索（使用 Gemini Embeddings）
 */
export async function generateEmbedding(text: string): Promise<number[]> {
  const client = getGeminiClient();
  const embeddingModel = 'text-embedding-004';

  try {
    const result = await client.getGenerativeModel({ model: embeddingModel }).embedContent(text);
    return result.embedding.values;
  } catch (error) {
    console.error('向量生成错误:', error);
    throw new Error('AI 嵌入服务暂时不可用');
  }
}

/**
 * 个性化学习建议
 */
export async function getStudyAdvice(progress: {
  studiedVerses: number;
  totalVerses: number;
  stuckPoints: string[];
  recentQuestions: string[];
}): Promise<{
  advice: string;
  suggestedVerses: number[];
  practiceRecommendations: string[];
}> {
  const gemini = getModel(GEMINI_MODELS.THINKING, SYSTEM_PROMPTS.studyGuide);

  const stuck = Array.isArray(progress.stuckPoints) ? progress.stuckPoints : []
  const recent = Array.isArray(progress.recentQuestions) ? progress.recentQuestions : []
  const percent = progress.totalVerses > 0 ? ((progress.studiedVerses / progress.totalVerses) * 100).toFixed(1) : '0.0'

  const prompt = `根据学员的学习情况，提供个性化学习建议：

【学习进度】
- 已学习偈颂：${progress.studiedVerses} / ${progress.totalVerses}
- 学习进度：${percent}%

【困惑点】
${stuck.map((p, i) => `${i + 1}. ${p}`).join('\n') || '无'}

【最近问题】
${recent.map((q, i) => `${i + 1}. ${q}`).join('\n') || '无'}

请以 JSON 格式返回：
{
  "advice": "整体学习建议（鼓励性语言）",
  "suggestedVerses": [建议重点复习的偈颂编号],
  "practiceRecommendations": ["具体的修行建议1", "建议2", ...]
}`;

  try {
    const result = await gemini.generateContent(prompt);
    const text = result.response.text();

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }

    return {
      advice: text,
      suggestedVerses: [],
      practiceRecommendations: [],
    };
  } catch (error) {
    console.error('学习建议生成错误:', error);
    throw new Error('AI 学习建议服务暂时不可用');
  }
}

/**
 * 流式对话
 */
export async function* chatStream(
  message: string,
  history: Array<{ role: string; content: string }>,
  systemPrompt?: string
): AsyncGenerator<string, void, unknown> {
  const gemini = getModel(GEMINI_MODELS.FLASH, systemPrompt || SYSTEM_PROMPTS.sutraScholar);

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
    console.error('流式对话错误:', error);
    throw new Error('AI 对话服务暂时不可用');
  }
}

// ==================== 工具函数 ====================

/**
 * 验证 API 密钥
 */
export async function validateApiKey(): Promise<boolean> {
  try {
    const client = getGeminiClient();
    const model = client.getGenerativeModel({ model: GEMINI_MODELS.FLASH });
    await model.generateContent('测试连接');
    return true;
  } catch {
    return false;
  }
}
