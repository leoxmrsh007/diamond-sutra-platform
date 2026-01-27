# 佛学经典研究平台

> 基于 Next.js 16、Google Gemini AI 构建的智能佛学学习平台

![Next.js](https://img.shields.io/badge/Next.js-16.1-black)
![React](https://img.shields.io/badge/React-19.2-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Gemini](https://img.shields.io/badge/Gemini-2.0-amber)

## 项目简介

本平台旨在利用现代科技，特别是人工智能技术，将古老的佛教经典智慧以更易理解、更易学习的方式呈现给大众。目前已支持《金刚经》和《六祖坛经》两部经典。

## 支持的经典

| 经典 | 译名 | 结构 | 路由 | 状态 |
|------|------|------|------|------|
| 金刚般若波罗蜜经 | Diamond Sutra | 32分 × 偈颂 | `/study` | ✅ |
| 六祖大师法宝坛经 | Platform Sutra | 10品 × 段落 | `/platform-sutra` | ✅ |

## 功能特性

### 核心功能
- **多经书学习** - 支持金刚经、六祖坛经等多部经典
- **版本对照** - 梵文、汉文、藏文多版本对照阅读
- **AI 讲师** - 基于 Gemini 2.0 的智能问答系统，支持流式响应
- **系统课程** - 从入门到精进的完整课程体系
- **深度研究** - 版本对照、历代注释、学术论文
- **共修社区** - 与志同道合的修行者交流心得

### 学习工具
- **笔记功能** - 记录学习心得，支持标签分类
- **书签收藏** - 收藏重要段落，快速回顾
- **每日签到** - 培养持续修行的习惯
- **成就系统** - 获取学习徽章，提升修行等级

## 技术架构

### 前端
- **框架**: Next.js 16 (App Router)
- **UI 库**: shadcn/ui + Tailwind CSS
- **语言**: TypeScript
- **状态**: React Hooks

### 后端
- **API**: Next.js API Routes
- **数据库**: PostgreSQL + Prisma
- **认证**: NextAuth.js

### AI
- **模型**: Google Gemini 2.0 Flash / Pro
- **功能**: 智能问答、经文解析、学习建议

## 快速开始

### 环境要求
- Node.js 18+
- PostgreSQL 14+

### 安装
```bash
npm install
```

### 环境配置
创建 `.env.local`：
```env
DATABASE_URL="postgresql://user:password@localhost:5432/buddhist_classics"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"
GEMINI_API_KEY="your-gemini-api-key"
```

### 数据库
```bash
npm run db:generate  # 生成 Prisma Client
npm run db:push      # 推送数据库结构
npm run db:seed      # 初始化种子数据
```

### 启动
```bash
npm run dev
```
访问 http://localhost:3000

## 构建
```bash
npm run build
npm run start
```

## 项目结构

```
src/
├── app/              # 页面路由
│   ├── page.tsx      # 首页（多经书切换）
│   ├── study/        # 金刚经学习
│   ├── platform-sutra/ # 六祖坛经学习
│   ├── ai/           # AI问答
│   ├── courses/      # 课程
│   ├── community/    # 社区
│   └── api/          # API路由
├── components/       # 组件
│   ├── ui/          # shadcn/ui
│   ├── layout/      # 布局
│   └── pwa/         # PWA支持
├── lib/             # 工具库
└── types/           # 类型定义
```

## 部署

本项目配置了 Vercel 部署，区域设置为香港 (hkg1)。

### 快速部署步骤

1. **推送到 GitHub**
2. **连接 Vercel** - 导入 GitHub 仓库
3. **配置环境变量**：DATABASE_URL, NEXTAUTH_SECRET, GEMINI_API_KEY
4. **部署** - 点击 Deploy 即可

## 管理员账号

- 邮箱: `admin@example.com`
- 密码: `Admin@123`

## 许可证

MIT
