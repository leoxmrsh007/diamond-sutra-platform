# 后续优化建议

## 一、功能完善（优先级：高）

### 1. 搜索功能实现

**当前状态**：前端UI已完成，后端未实现

**建议方案**：
```typescript
// src/app/api/search/route.ts

import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');

  if (!query || query.length < 2) {
    return NextResponse.json({ results: [] });
  }

  // 全文搜索
  const verses = await prisma.verse.findMany({
    where: {
      OR: [
        { chinese: { contains: query, mode: 'insensitive' } },
        { sanskrit: { contains: query, mode: 'insensitive' } },
        { pinyin: { contains: query, mode: 'insensitive' } },
      ],
    },
    include: { chapter: true },
    take: 20,
  });

  return NextResponse.json({ results: verses });
}
```

### 2. 社区功能实现

**建议优先级**：
1. 帖子列表与详情
2. 评论系统
3. 点赞功能
4. 标签过滤

**数据库模型已存在**：Post, Comment

### 3. 研究内容填充

**建议内容**：
- 版本对照（鸠摩罗什译本 vs 玄奘译本）
- 历代注释（六祖慧能、憨山大师等）
- 学术论文引用
- 知识图谱可视化

---

## 二、性能优化（优先级：中）

### 1. Redis 缓存

**缓存场景**：
- 热门章节（/study 页面）
- AI 对话历史
- 用户学习进度

```typescript
// src/lib/redis.ts

import { Redis } from 'ioredis';

const redis = new Redis(process.env.REDIS_URL);

export async function cacheGet(key: string) {
  const cached = await redis.get(key);
  return cached ? JSON.parse(cached) : null;
}

export async function cacheSet(key: string, value: any, ttl: number = 3600) {
  await redis.setex(key, ttl, JSON.stringify(value));
}
```

**部署选项**：
- Vercel KV
- Upstash Redis
- 自建 Redis

### 2. CDN 静态资源

**优化项**：
- 图片：Vercel Blob / AWS S3 / 阿里云 OSS
- 音频：背景音乐、朗读音频
- 静态文件：Next.js 自动优化

### 3. 数据库查询优化

```typescript
// 添加索引
// prisma/schema.prisma

model Verse {
  // ... existing fields

  @@index([chapterId, verseNum])
  @@index([chinese(255)]) // 全文搜索索引
}
```

### 4. Next.js 优化

**ISR（增量静态再生）**：
```typescript
// src/app/study/page.tsx

export const revalidate = 3600; // 1小时重新生成
```

**图片优化**：
```typescript
import Image from 'next/image';

<Image
  src="/cover.jpg"
  width={800}
  height={600}
  alt="课程封面"
  priority={false}
  loading="lazy"
/>
```

---

## 三、AI 功能增强（优先级：高）

### 1. 对话历史持久化

**当前状态**：对话仅保存在内存

**改进方案**：
```typescript
// src/lib/ai-history.ts

export async function saveConversation(userId: string, messages: Message[]) {
  await prisma.chatSession.create({
    data: {
      userId,
      title: messages[0].content.substring(0, 50),
      messages: {
        create: messages.map(m => ({
          role: m.role,
          content: m.content,
        })),
      },
    },
  });
}
```

### 2. 上下文记忆增强

```typescript
// 基于学习进度调整回答

export async function getContextualPrompt(userProgress: StudyProgress[]) {
  const studiedChapters = new Set(userProgress.map(p => p.chapterId));
  return `
    用户已学习 ${studiedChapters.size} 个章节。
    ${studiedChapters.size > 10 ? '可以深入讨论核心概念。' : '保持解释简洁易懂。'}
  `;
}
```

### 3. 多模态支持

**功能规划**：
- 手写笔记识别（OCR）
- 语音输入（Web Speech API）
- 语音合成输出

```typescript
// src/lib/voice.ts

export async function speechToText(audioBlob: Blob) {
  const formData = new FormData();
  formData.append('audio', audioBlob);

  const response = await fetch('/api/speech-to-text', {
    method: 'POST',
    body: formData,
  });

  return response.json();
}
```

### 4. AI 辅助背经

```typescript
// src/lib/recitation.ts

export async function checkRecitation(userInput: string, verse: Verse) {
  const prompt = `
    原文：${verse.chinese}
    用户背诵：${userInput}

    判断背诵是否正确，如有错误，指出具体位置和正确内容。
  `;

  return await gemini.generateContent(prompt);
}
```

---

## 四、用户体验改进（优先级：中）

### 1. 深色模式优化

```typescript
// src/components/theme/theme-provider.tsx

const themes = ['light', 'dark', 'amber'];

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState('light');

  return (
    <html className={theme} data-theme={theme}>
      {children}
    </html>
  );
}
```

### 2. 离线支持（PWA）

```typescript
// public/sw.js

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('v1').then((cache) => {
      return cache.addAll([
        '/',
        '/study',
        '/ai',
        '/offline',
      ]);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
```

### 3. 加载状态优化

```typescript
// 使用 Suspense + Loading

export default function Loading() {
  return (
    <div className="animate-pulse">
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
    </div>
  );
}
```

### 4. 移动端优化

- 触摸手势优化
- 底部导航适配
- 横屏支持
- 性能监控

---

## 五、运营工具（优先级：低）

### 1. 管理员后台

**功能清单**：
- 用户管理
- 内容审核
- 数据统计
- 系统监控

```typescript
// src/app/admin/page.tsx

export default function AdminPage() {
  return (
    <div>
      <h1>管理后台</h1>
      <Tabs>
        <TabsList>
          <TabsTrigger value="users">用户</TabsTrigger>
          <TabsTrigger value="content">内容</TabsTrigger>
          <TabsTrigger value="stats">统计</TabsTrigger>
        </TabsList>
        {/* ... */}
      </Tabs>
    </div>
  );
}
```

### 2. 成就系统

```typescript
// src/lib/achievements.ts

const achievements = [
  {
    id: 'first-login',
    title: '初次登录',
    condition: (user) => user.loginCount >= 1,
  },
  {
    id: 'study-10-chapters',
    title: '初窥门径',
    condition: (user) => user.studiedChapters >= 10,
  },
  {
    id: 'recite-100-verses',
    title: '经文通晓',
    condition: (user) => user.recitationCount >= 100,
  },
];
```

### 3. 学习报告生成

```typescript
// src/app/api/reports/generate.ts

export async function generateWeeklyReport(userId: string) {
  const progress = await prisma.studyProgress.findMany({
    where: { userId },
    orderBy: { updatedAt: 'desc' },
  });

  const weeklyStats = {
    studiedChapters: progress.length,
    totalVerses: progress.reduce((sum, p) => sum + p.recitationCount, 0),
    checkInDays: await prisma.checkIn.count({
      where: {
        userId,
        checkInDate: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
      },
    }),
  };

  return weeklyStats;
}
```

---

## 六、部署优化（优先级：中）

### 1. Vercel 部署配置

**优化项**：
- 区域：Hong Kong (hkg1) - 国内访问优化
- 环境变量：在 Dashboard 配置
- 数据库：使用 Vercel Postgres 或 Supabase

```json
// vercel.json
{
  "regions": ["hkg1"],
  "buildCommand": "prisma generate && next build",
  "env": {
    "DATABASE_URL": "@database-url"
  }
}
```

### 2. CI/CD 配置

```yaml
# .github/workflows/deploy.yml

name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run build
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

### 3. 监控与日志

**推荐工具**：
- Sentry - 错误追踪
- Vercel Analytics - 性能监控
- LogRocket - 用户行为记录

```typescript
// src/lib/sentry.ts

import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
});
```

---

## 七、内容扩展（优先级：低）

### 1. 更多经典

**计划列表**：
- 《般若波罗蜜多心经》
- 《地藏菩萨本愿经》
- 《楞严经》
- 《妙法莲华经》

### 2. 多语言支持

```typescript
// src/lib/i18n.ts

const translations = {
  zh: {
    sutra: '金刚经',
    study: '学习',
  },
  en: {
    sutra: 'Diamond Sutra',
    study: 'Study',
  },
  // 藏文、日文等
};
```

### 3. 课程体系完善

**建议课程**：
1. 《金刚经》入门导读（已完成）
2. 《金刚经》中级精讲
3. 《金刚经》高级研修
4. 般若思想史
5. 中观哲学入门

---

## 八、安全加固（优先级：中）

### 1. API 限流

```typescript
// src/lib/rate-limit.ts

import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '1 m'), // 10次/分钟
});

export async function checkRateLimit(ip: string) {
  const { success } = await ratelimit.limit(ip);
  return success;
}
```

### 2. XSS 防护

```typescript
// 使用 DOMPurify 清理用户输入

import DOMPurify from 'dompurify';

export function sanitizeHTML(html: string) {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['b', 'i', 'p', 'br'],
  });
}
```

### 3. 数据验证

```typescript
// 使用 Zod 验证

import { z } from 'zod';

const noteSchema = z.object({
  verseId: z.string().cuid(),
  content: z.string().min(1).max(2000),
  isPublic: z.boolean().default(false),
});
```

---

## 九、开发工具（优先级：低）

### 1. E2E 测试

```typescript
// tests/e2e/study.spec.ts

import { test, expect } from '@playwright/test';

test('学习流程', async ({ page }) => {
  await page.goto('/study');
  await expect(page.locator('h1')).toContainText('金刚经');

  await page.click('text=第一章');
  await expect(page.locator('.verse')).toBeVisible();

  await page.click('text=书签');
  await expect(page.locator('text=已添加书签')).toBeVisible();
});
```

### 2. 单元测试

```typescript
// tests/lib/gemini.test.ts

import { describe, it, expect } from 'vitest';
import { askQuestion } from '@/lib/gemini';

describe('AI Service', () => {
  it('should return answer', async () => {
    const answer = await askQuestion('什么是般若？');
    expect(answer).toBeDefined();
    expect(answer.length).toBeGreaterThan(10);
  });
});
```

### 3. 代码质量

```json
// package.json scripts

{
  "scripts": {
    "lint": "eslint .",
    "format": "prettier --write .",
    "type-check": "tsc --noEmit",
    "test": "vitest",
    "test:e2e": "playwright test"
  }
}
```

---

## 十、商业考虑（优先级：低）

### 1. 会员体系

```typescript
// prisma/schema.prisma

model Subscription {
  id String @id @default(cuid())
  userId String @unique
  user User @relation(fields: [userId], references: [id])
  plan SubscriptionPlan @default(FREE)
  startDate DateTime @default(now())
  endDate DateTime?
}

enum SubscriptionPlan {
  FREE
  BASIC
  PREMIUM
}
```

### 2. 付费功能

**基础版（免费）**：
- 访问全部经文
- 基础AI问答（每日10次）
- 学习进度追踪

**高级版（¥29/月）**：
- 无限AI对话
- 高级AI模型（GPT-4）
- 历代注释完整版
- 语音识别功能
- 离线下载

### 3. 内容变现

- 在线课程直播
- 线下工作坊
- 法师邀请
- 礼品商城

---

## 实施路线图

### 第一阶段（1-2周）- 核心功能完善
- ✅ 补充偈颂内容
- ⏳ 实现搜索功能
- ⏳ 社区功能基础版
- ⏳ AI 对话持久化

### 第二阶段（2-3周）- 性能优化
- ⏳ Redis 缓存
- ⏳ CDN 部署
- ⏳ 数据库优化
- ⏳ PWA 支持

### 第三阶段（1个月）- 功能扩展
- ⏳ 多模态AI
- ⏳ 管理后台
- ⏳ 成就系统
- ⏳ 学习报告

### 第四阶段（持续）- 内容与运营
- ⏳ 更多经典
- ⏳ 多语言
- ⏳ 会员体系
- ⏳ 活动运营

---

**总结**：
- 优先级排序：核心功能 > 性能 > UX > 运营 > 商业
- 技术债务控制：代码审查、测试覆盖、文档完善
- 用户反馈驱动：收集数据、快速迭代、持续优化

**文档版本**: v1.0
**最后更新**: 2026-01-13
