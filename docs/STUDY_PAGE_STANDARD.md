# 经文学习页面统一规范

## 目标

确保所有经文学习页面（金刚经、六祖坛经、未来新增经典）保持一致的：
- 呈现方式
- 交互方式
- UI风格
- 功能特性

---

## 核心规范

### 1. 页面结构

#### 标准布局
```
┌─────────────────────────────────────────────────────┐
│ Header (全局导航)                              │
├─────────────────────────────────────────────────────┤
│ 标题区                                       │
│ - 图标 + 经文标题                               │
│ - 描述（译者、章节数等）                        │
├─────────────────────────────────────────────────────┤
│ ┌──────────┬──────────────────┬───────────────┐ │
│ │ 章节列表  │   内容区           │   侧边栏      │ │
│ │          │                   │               │ │
│ │ - 章节   │   - 章节标题        │   - 签到       │ │
│ │ - 进度   │   - 摘要           │   - 学习进度   │ │
│ │          │   - 控制按钮        │   - 快捷操作   │ │
│ │          │   - 段落/偈颂      │   - 概要       │ │
│ │          │                   │               │ │
│ └──────────┴──────────────────┴───────────────┘ │
├─────────────────────────────────────────────────────┤
│ Footer (全局页脚)                              │
└─────────────────────────────────────────────────────┘
```

### 2. 数据结构

#### 偈颂型经典（如金刚经）
```typescript
interface Verse {
  id: string;
  chapterId: string;
  verseNum: number;
  chinese: string;
  sanskrit?: string | null;
  english?: string | null;
  pinyin?: string | null;
  modern?: string | null;
  original?: string | null;
  aiKeyword?: unknown;
  aiAnalysis?: AiAnalysis | null;
}

interface Chapter {
  id: string;
  chapterNum: number;
  title: string;
  summary: string | null;
  imageUrl?: string | null;
  verses: Verse[];
}
```

#### 段落型经典（如六祖坛经）
```typescript
interface Section {
  id: string;
  chapterId: string;
  sectionNum: number;
  heading?: string | null;
  content: string;
  modern?: string | null;
  notes?: string | null;
  aiKeyword?: unknown;
  aiAnalysis?: AiAnalysis | null;
}

interface Chapter {
  id: string;
  chapterNum: number;
  title: string;
  summary: string | null;
  imageUrl?: string | null;
  sections: Section[];
}
```

### 3. 必备功能

#### A. 基础功能
- ✅ 章节列表导航
- ✅ 章节选择
- ✅ 章节切换（上一/下一）
- ✅ 内容展示
- ✅ 摘要显示

#### B. 学习辅助
- ✅ 朗读功能（语音合成）
  - 支持中文朗读
  - 速度调节（0.5x, 1x, 1.5x）
  - 播放/暂停控制
  - 自动切换到下一段
- ✅ 背景音乐（禅音）
  - 播放/暂停控制
  - 音量调节
  - 循环播放

#### C. 显示模式
- ✅ 整章模式（完整显示）
- ✅ 逐段/偈模式（分段显示）
- ✅ 展开/收起机制（仅段落型）
  - 默认展开前3段
  - 可一键展开/收起全部
  - 每段独立控制

#### D. 学习进度
- ✅ 进度百分比显示
- ✅ 可视化进度条
- ✅ 已学/总数显示
- ✅ 段落/偈颂学习状态（学习中/已背诵/已掌握）

#### E. 学习辅助
- ✅ 每日签到
- ✅ 笔记功能
- ✅ 收藏功能
- ✅ AI讲解入口
- ✅ 快捷操作面板

#### F. 内容展示
- ✅ 原文显示（必需）
- ✅ 白话翻译（推荐）
- ✅ 英文翻译（可选）
- ✅ 梵文原文（可选）
- ✅ 拼音标注（可选）
- ✅ AI解析（推荐）
- ✅ 注释（可选）

### 4. UI组件规范

#### 色彩主题
- **金刚经**：琥珀色（amber）主题
  - 主色：amber-600
  - 背景：amber-100
  - 文字：amber-900

- **六祖坛经**：绿色（green）主题
  - 主色：green-600
  - 背景：green-100
  - 文字：green-900

- **通用**：系统默认色（muted, foreground, primary）

#### 章节列表项
```tsx
<ChapterItem
  chapter={chapter}
  isSelected={selectedChapterId === chapter.id}
  hasProgress={hasProgress}
  onClick={() => handleChapterChange(chapter.id)}
/>
```

**规范**：
- 完整宽度（w-full）
- 左对齐文本
- 圆角边框（rounded-lg）
- 过渡动画（transition-colors）
- 选中状态高亮
- 进度标识（✓ Badge）

#### 内容项（偈颂/段落）
```tsx
<VerseItem
  verse={verse}
  index={index}
  isAuthenticated={isAuthenticated}
  studyProgress={studyProgress}
/>
```

**规范**：
- 底部边框分隔（border-b）
- 偈颂/段号Badge
- 学习状态Badge（登录用户）
- 原文大字号（text-xl）
- 白话翻译中等字号（text-base）
- 英文/梵文小字号（text-sm）

#### 控制按钮组
```tsx
<div className="flex border rounded-md p-0.5">
  <Button variant={mode === 'chapter' ? 'default' : 'ghost'}>
    整章
  </Button>
  <Button variant={mode === 'verse' ? 'default' : 'ghost'}>
    逐偈
  </Button>
</div>
```

### 5. 状态管理

#### 必需状态
```typescript
const [chapters, setChapters] = useState<Chapter[]>([]);
const [currentChapter, setCurrentChapter] = useState<Chapter | null>(null);
const [selectedChapterId, setSelectedChapterId] = useState<string>('');
const [activeTab, setActiveTab] = useState('chinese');
const [studyProgress, setStudyProgress] = useState<Record<string, StudyProgress>>({});
const [isReading, setIsReading] = useState(false);
const [readingSpeed, setReadingSpeed] = useState(1);
const [isBGMPlaying, setIsBGMPlaying] = useState(false);
const [bgmVolume, setBgmVolume] = useState([50]);
const [displayMode, setDisplayMode] = useState<'chapter' | 'verse'>('chapter');
```

#### 性能优化
- 使用 `useMemo` 优化段落数组
- 使用 `useCallback` 优化事件处理
- 使用 `memo` 优化列表项组件
- 服务端获取初始数据，避免客户端请求

### 6. 响应式设计

#### 断点
- **移动端**：< 640px
  - 单列布局
  - 固定底部操作按钮
  - 章节列表可折叠

- **平板**：640px - 1024px
  - 两列布局
  - 章节列表侧边栏

- **桌面**：≥ 1024px
  - 三列布局（4:8:4比例）
  - 固定侧边栏高度

### 7. 无障碍性

- 语义化HTML标签
- 键盘导航支持
- ARIA标签
- 色彩对比度符合WCAG标准
- 屏幕阅读器友好

### 8. 数据获取

#### 服务端组件
```typescript
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

export default async function StudyPage() {
  const data = await getStudyData();
  return <StudyPageClient initialData={data} />;
}
```

#### 数据获取函数
```typescript
async function getStudyData() {
  'use server';
  const [sutra, chapters] = await Promise.all([
    getSutraData(),
    getChaptersList(),
  ]);
  return { sutra, chapters };
}
```

### 9. 路由规范

#### URL结构
```
/                    # 首页
/study               # 金刚经学习
/platform-sutra      # 六祖坛经学习
/sutra/{slug}       # 其他经典学习
```

#### 查询参数
```
/platform-sutra?chapter=1  # 选择章节
```

---

## 新增经典流程

### 1. 数据准备
- 创建Sutra记录（slug, title, description）
- 创建Chapter记录（chapterNum, title, summary）
- 创建Verse或Section记录

### 2. 创建页面
```
src/app/sutra/{slug}/
├── page.tsx           # 服务端组件
└── client.tsx          # 客户端组件
```

### 3. 实现服务端组件
```typescript
import { StudyPageClient } from './client';
import { getStudyData } from './study-data';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

export default async function StudyPage() {
  const data = await getStudyData();
  return <StudyPageClient initialData={data} />;
}
```

### 4. 实现客户端组件
- 复用通用组件（ChapterItem, VerseItem, SectionItem）
- 使用标准布局（Header, Footer, Sidebar）
- 实现必备功能（朗读、背景音乐、进度追踪）

### 5. 选择主题色
根据经典特性选择主题色：
- 禅宗经典：绿色（green）
- 密宗经典：紫色（purple）
- 净土宗经典：蓝色（blue）
- 其他经典：自定义

### 6. 测试清单
- ✅ 章节导航正常
- ✅ 朗读功能正常
- ✅ 背景音乐正常
- ✅ 进度追踪正常
- ✅ 显示模式切换正常
- ✅ 响应式布局正常
- ✅ 移动端体验良好
- ✅ 无障碍性符合标准

---

## 组件复用

### 可复用组件位置
```
src/components/study/
├── chapter-item.tsx         # 章节列表项
├── verse-item.tsx           # 偈颂列表项
├── section-item.tsx         # 段落列表项
├── study-controls.tsx        # 学习控制（朗读、音乐）
├── progress-tracker.tsx      # 进度追踪
└── display-mode-toggle.tsx   # 显示模式切换
```

### 通用组件
```
src/components/study/
├── note-dialog.tsx          # 笔记对话框
├── bookmark-dialog.tsx       # 收藏对话框
└── daily-check-in.tsx       # 每日签到
```

---

## 持续维护

### 代码审查检查点
1. 新经典是否使用标准布局？
2. 是否包含所有必备功能？
3. UI风格是否一致？
4. 主题色是否合理？
5. 响应式是否正常？
6. 性能优化是否到位？

### 版本更新
- 更新本文档以反映新经典实现
- 记录特殊需求和例外情况
- 维护最佳实践清单

---

**文档版本**: v1.0
**最后更新**: 2026年1月29日
**维护者**: AI Assistant

---

## 快速参考

### 经典类型对照表

| 经典 | 数据结构 | 显示模式 | 主题色 |
|------|----------|----------|--------|
| 金刚经 | Verse（偈颂） | 整章/逐偈 | 琥珀色 |
| 六祖坛经 | Section（段落） | 分段/全文 | 绿色 |
| 心经 | Verse（偈颂） | 整章/逐偈 | 蓝色 |
| 圆觉经 | Verse（偈颂） | 整章/逐偈 | 紫色 |
| ... | ... | ... | ... |

### 功能对照表

| 功能 | 金刚经 | 六祖坛经 | 新经典 |
|------|--------|----------|--------|
| 章节导航 | ✅ | ✅ | ✅ |
| 朗读功能 | ✅ | ✅ | ✅ |
| 背景音乐 | ✅ | ✅ | ✅ |
| 学习进度 | ✅ | ✅ | ✅ |
| 显示模式 | ✅ | ✅ | ✅ |
| 签到功能 | ✅ | ✅ | ✅ |
| 笔记功能 | ✅ | ✅ | ✅ |
| 收藏功能 | ✅ | ✅ | ✅ |
| AI讲解 | ✅ | ✅ | ✅ |

---

**记住：所有新增经典必须遵循此规范！**
