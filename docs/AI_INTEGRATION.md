# AI 功能实现与测试指南

## Gemini AI 集成概述

### 已实现功能

#### 1. AI 服务模块 (`src/lib/gemini.ts`)

**配置的模型:**
- `gemini-2.0-flash-exp` - 快速响应，实时对话
- `gemini-2.5-pro-exp` - 深度分析，研究用途
- `gemini-2.5-flash-thinking-exp` - 复杂推理

**系统提示词:**
- `sutraScholar` - 佛学学者人设
- `studyGuide` - 学习指导老师人设
- `verseAnalyzer` - 偈颂分析专家人设

**核心函数:**
```typescript
- askQuestion() - 智能问答
- analyzeVerse() - 偈颂深度解析
- generateIllustrationPrompt() - 生成插图提示词
- generateEmbedding() - 语义嵌入（向量）
- getStudyAdvice() - 个性化学习建议
- chatStream() - 流式对话
- validateApiKey() - API 密钥验证
```

#### 2. AI Chat API (`src/app/api/chat/route.ts`)

**端点:**
- `POST /api/chat` - 发送消息（支持流式/非流式）
- `GET /api/chat` - 获取推荐问题

**系统提示词:**
```
你是一位深入研究中观的佛学学者，专精于《金刚般若波罗蜜经》（简称《金刚经》）。

你的回答应该：
1. 准确引用经文内容
2. 结合龙树菩萨中观思想进行解释
3. 语言清晰易懂，适合不同层次的修行者
4. 保持客观、尊重的态度
5. 引用相关注释（如：弥勒菩萨《金刚经论》等）
...
```

**流式响应实现:**
```typescript
- 使用 ReadableStream
- Server-Sent Events (SSE)
- 实时 chunks 推送
- 前端逐步显示
```

#### 3. AI 聊天页面 (`src/app/ai/page.tsx`)

**功能特性:**
- 流式响应显示
- 对话历史管理
- 推荐问题快速提问
- 学习主题标签
- 复制回答内容
- 重新生成回答
- Markdown 渲染

**UI 组件:**
- 聊天气泡（用户/AI）
- 打字动画效果
- 滚动自动到底部
- 加载状态显示

## 获取 Gemini API 密钥

### 步骤 1: 访问 Google AI Studio

1. 打开 https://aistudio.google.com/app/apikey
2. 使用 Google 账号登录

### 步骤 2: 创建 API 密钥

1. 点击 "Create API Key"
2. 选择项目（或创建新项目）
3. 复制生成的 API 密钥

格式: `AIza...` (39字符)

### 步骤 3: 配置环境变量

在 `.env.local` 中添加:
```env
GEMINI_API_KEY="AIzaxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
```

### 步骤 4: 验证密钥

```bash
# 在 Node.js 中测试
node -e "
const { GoogleGenerativeAI } = require('@google/generative-ai');
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
model.generateContent('测试连接').then(console.log).catch(console.error);
"
```

或使用项目提供的验证函数（在 API 端点中）。

## 功能测试指南

### 测试 1: 基础问答测试

**操作步骤:**
1. 访问 `http://localhost:3000/ai`
2. 输入问题: "什么是般若？"
3. 点击发送按钮

**预期结果:**
- AI 返回详细回答
- 回答包含中文、梵文解释
- 引用经文出处
- 回答有逻辑结构

**示例回答:**
```
"般若"（梵文：Prajñā）是大乘佛教的核心概念，意为"智慧"或"圆满的智慧"。

在《金刚经》中，般若指的是超越世俗分别智的终极智慧，能如实认知一切事物和真理的本质。

般若波罗蜜（Prajñāpāramitā）意为"智慧到彼岸"，即通过修行般若智慧，到达觉悟的彼岸。...
```

### 测试 2: 流式响应测试

**操作步骤:**
1. 发送一个较长的问题:
   ```
   请详细解释《金刚经》中"应无所住而生其心"的含义，并举例说明如何在实际生活中应用？
   ```
2. 观察回答过程

**预期结果:**
- 回答逐字/逐句显示
- 没有长时间等待
- 响应速度平滑
- 流式效果明显

**技术验证:**
打开浏览器开发者工具 (F12) -> Network:
- 查看对 `/api/chat` 的请求
- 响应类型: `text/event-stream`
- 看到 `data: {"content": "..."}\n\n` 格式的数据流

### 测试 3: 对话历史测试

**操作步骤:**
1. 进行多轮对话:
   ```
   用户: 什么是空性？
   AI: [回答]
   用户: 空性是否什么都没有？
   AI: [回答]
   用户: 那为什么要修行空性？
   AI: [回答]
   ```
2. 刷新页面
3. 继续对话

**预期结果:**
- AI 记住之前的问题
- 回答有上下文连贯性
- 不会重复回答相同问题

**技术验证:**
- 检查请求体中的 `history` 参数
- 确认历史消息传递正确

### 测试 4: 推荐问题测试

**操作步骤:**
1. 查看 AI 页面左侧"推荐问题"列表
2. 点击任意问题
3. 问题自动填入并发送

**预期结果:**
- 问题正确填入输入框
- 自动触发发送
- 收到 AI 回答

**推荐问题列表:**
- 什么是"般若"（智慧）？
- 如何理解"凡所有相，皆是虚妄"？
- 什么是"无住生心"？
- 《金刚经》的核心思想是什么？
- 如何将经义应用到日常生活中？
- 什么是"四相"？
- 如何理解"应无所住而生其心"？
- 布施波罗蜜的含义是什么？

### 测试 5: 主题标签测试

**操作步骤:**
1. 点击"空性"标签
2. 观察 AI 回答
3. 点击"布施"标签
4. 对比两个问题的回答

**预期结果:**
- 标签点击发送主题相关问题
- 回答聚焦于该主题
- 不同标签得到不同侧重点的回答

**可用标签:**
- 空性
- 布施
- 忍辱
- 般若
- 菩提心
- 四相
- 无住
- 涅槃

### 测试 6: Markdown 渲染测试

**操作步骤:**
1. 问一个复杂问题
2. 查看回答的格式

**预期结果:**
- 列表使用项目符号
- 标题正确显示（#, ##）
- 引用块样式化（>）
- 代码块正确高亮（如果适用）
- 加粗、斜体正确渲染

**示例 Markdown 输入:**
```markdown
## "般若"的含义

般若（梵文：Prajñā）包含几个层面：

1. **世俗般若**：日常生活中的智慧
2. **胜义般若**：超越的终极智慧
3. **缘起性空**：一切法无自性

> 般若波罗蜜者，即非般若波罗蜜，是名般若波罗蜜。
```

### 测试 7: 重新生成测试

**操作步骤:**
1. 发送一个问题
2. 等待完整回答
3. 点击回答右侧的"重新生成"图标

**预期结果:**
- 同一问题得到不同回答
- AI 使用不同角度解释
- 保持回答质量

### 测试 8: 复制功能测试

**操作步骤:**
1. 点击回答右侧的"复制"图标
2. 粘贴到文本编辑器

**预期结果:**
- 答案内容完整复制
- 格式保持良好
- 可以轻松粘贴使用

## 高级功能测试

### 测试 9: 上下文问答测试

**操作场景:**
```
用户: 第一章讲了什么？
AI: 第一章"法会因由分第一"描述了法会的缘起...

用户: 那第二章呢？
AI: 第二章"善现启请分第二"讲述了须菩提启请佛陀...

用户: 这两章有什么关联？
AI: [应该能识别前两章的对话关系]
```

**验证点:**
- AI 记住前两章的内容
- 能建立章节间的逻辑关系
- 回答有连贯性

### 测试 10: 跨章节关联测试

**操作步骤:**
```
用户: 第三章中提到的"四相"是什么？
AI: [解释我相、人相、众生相、寿者相]

用户: 这一概念在后面的章节如何展开？
AI: [应该能联系到第十分、第十七分等]
```

**验证点:**
- AI 了解整部经文的上下文
- 能引用不同章节
- 展现全局理解

## 性能与可靠性测试

### 测试 11: 响应时间测试

**工具:**
- Chrome DevTools -> Network
- 或使用 `curl` 命令

**测试命令:**
```bash
time curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"什么是般若？","stream":false}'
```

**预期结果:**
- 首字响应时间 < 1秒
- 完整回答时间 < 5秒（短问题）
- 流式响应首字节 < 0.5秒

### 测试 12: 错误处理测试

**测试场景:**

**场景 A: API 密钥无效**
1. 设置错误的 GEMINI_API_KEY
2. 尝试发送问题
3. 预期: 显示友好的错误提示

**场景 B: 网络超时**
1. 断开网络
2. 发送问题
3. 预期: 显示"服务暂时不可用"提示

**场景 C: 速率限制**
1. 快速连续发送多个问题
2. 预期: 系统优雅处理，不会崩溃

### 测试 13: 并发请求测试

**测试脚本:**
```javascript
// 同时发送10个请求
const requests = Array(10).fill().map((_, i) => 
  fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      message: `测试问题 ${i}`,
      stream: false 
    })
  })
);

Promise.all(requests)
  .then(responses => Promise.all(responses.map(r => r.json())))
  .then(results => console.log('所有响应:', results))
  .catch(error => console.error('错误:', error));
```

**预期结果:**
- 所有请求都能处理
- 不会出现死锁或崩溃
- 响应时间合理

## AI 回答质量评估

### 评估维度

#### 1. 准确性
- [ ] 正确引用经文内容
- [ ] 梵文术语准确
- [ ] 注释出处正确

#### 2. 深度
- [ ] 超越表面解释
- [ ] 提供多个角度
- [ ] 引用相关概念

#### 3. 清晰度
- [ ] 语言通俗易懂
- [ ] 结构清晰有条理
- [ ] 例子生动具体

#### 4. 适用性
- [ ] 回答贴近问题
- [ ] 提供实用建议
- [ ] 适合不同层次修行者

#### 5. 佛学性
- [ ] 保持佛学严谨性
- [ ] 尊重经典传统
- [ ] 符合中观思想

### 评估示例问题

1. **基础概念**: 什么是般若？
2. **核心教义**: 如何理解"空性"？
3. **实践应用**: 如何在日常生活中修行？
4. **疑难问题**: 如果一切法皆空，为什么还要修行？
5. **历史背景**: 《金刚经》是如何传到中国的？

## 故障排除

### 问题 1: AI 无响应

**症状**: 发送问题后没有回答

**可能原因:**
1. GEMINI_API_KEY 未设置或错误
2. 网络连接问题
3. API 限流

**解决方案:**
```bash
# 1. 检查环境变量
echo $GEMINI_API_KEY

# 2. 测试网络连接
ping aistudio.google.com

# 3. 检查 API 配额
# 访问 Google AI Studio 查看使用情况
```

### 问题 2: 流式响应不工作

**症状**: 回答一次性显示，无流式效果

**可能原因:**
1. `stream: false` 被设置
2. ReadableStream 不支持
3. 浏览器兼容性问题

**解决方案:**
```javascript
// 确认请求包含 stream: true
fetch('/api/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    message: '测试问题',
    stream: true  // ← 确保为 true
  })
});
```

### 问题 3: 回答质量差

**症状**: AI 回答偏离主题或质量低下

**可能原因:**
1. 系统提示词不够明确
2. 温度参数设置不当
3. 模型选择不合适

**解决方案:**
- 检查 `src/lib/gemini.ts` 中的系统提示词
- 调整 `temperature` 参数（建议 0.7）
- 尝试使用 `gemini-2.5-pro-exp` 获取更高质量回答

### 问题 4: 对话历史丢失

**症状**: 刷新页面后对话历史消失

**可能原因:**
1. 对话历史未存储
2. 状态管理问题

**解决方案:**
```typescript
// 对话历史目前只在内存中保存
// 可以扩展为存储到数据库：

// 1. 创建 ChatSession 模型（已存在）
// 2. 保存对话历史到数据库
// 3. 页面加载时从数据库恢复
```

## 性能优化建议

### 1. 实现缓存

```typescript
// 使用简单的内存缓存
const answerCache = new Map<string, string>();

export async function askQuestion(question: string) {
  // 检查缓存
  if (answerCache.has(question)) {
    return answerCache.get(question)!;
  }
  
  // 调用 API
  const answer = await gemini.generateContent(question);
  
  // 存入缓存
  answerCache.set(question, answer.text());
  
  return answer.text();
}
```

### 2. 使用向量搜索

```typescript
// 生成问题向量
const questionEmbedding = await generateEmbedding(userQuestion);

// 在数据库中搜索相似问题
const similarQuestions = await prisma.$queryRaw`
  SELECT * FROM verses
  ORDER BY embedding <-> $1
  LIMIT 5
`, [questionEmbedding]);

// 使用相似问题作为上下文
const context = similarQuestions.map(q => q.chinese).join('\n');
```

### 3. 优化提示词

```typescript
// 使用更精确的提示词
const prompt = `
基于《金刚经》回答以下问题。要求：
1. 简洁明了，不超过300字
2. 引用1-2个经文原文
3. 使用编号列出要点

问题: ${userQuestion}
`;
```

## 下一步扩展

1. **多模态支持**
   - 图片识别（手写笔记）
   - 语音输入
   - 语音合成输出

2. **个性化学习**
   - 根据学习进度调整回答难度
   - 推荐相关偈颂
   - 生成学习计划

3. **社区互动**
   - AI 辅助的论坛功能
   - 问题审核与推荐
   - 专家回答集成

---

**AI 状态**: 已集成，待测试
**模型**: Gemini 2.0 Flash / 2.5 Pro
**功能**: 问答、流式响应、对话历史
