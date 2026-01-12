# 金刚经研究与教学平台

> 基于 Next.js 16、Google Gemini AI 构建的智能佛学学习平台

![Next.js](https://img.shields.io/badge/Next.js-16.1-black)
![React](https://img.shields.io/badge/React-19.2-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Gemini](https://img.shields.io/badge/Gemini-2.0-amber)

## 项目简介

本平台旨在利用现代科技，特别是人工智能技术，将古老的《金刚经》智慧以更易理解、更易学习的方式呈现给大众。

## 功能特性

### 核心功能
- **经文学习** - 完整的《金刚经》32分内容，多版本对照
- **AI 讲师** - 基于 Gemini 2.0 的智能问答系统，支持流式响应
- **系统课程** - 从入门到精进的完整课程体系
- **深度研究** - 版本对照、历代注释、学术论文
- **共修社区** - 与志同道合的修行者交流心得

### 学习工具
- **笔记功能** - 记录学习心得，支持标签分类
- **书签收藏** - 收藏重要偈颂，快速回顾
- **每日签到** - 培养持续修行的习惯
- **成就系统** - 获取学习徽章，提升修行等级

### 用户体验
- **搜索功能** - 全局搜索经文、课程、社区内容
- **阅读模式** - 专注的阅读体验，支持多种主题
- **主题切换** - 浅色、深色、琥珀色主题
- **移动适配** - 完整的移动端底部导航

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
- **模型**: Google Gemini 2.0 Flash
- **功能**: 智能问答、偈颂解析、学习建议

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
DATABASE_URL="postgresql://user:password@localhost:5432/diamond_sutra"
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
│   ├── page.tsx      # 首页
│   ├── study/        # 经文学习
│   ├── ai/           # AI问答
│   ├── courses/      # 课程
│   ├── community/    # 社区
│   └── api/          # API路由
├── components/       # 组件
│   ├── ui/          # shadcn/ui
│   ├── layout/      # 布局
│   ├── study/       # 学习组件
│   └── theme/       # 主题
├── lib/             # 工具库
└── types/           # 类型定义
```

## 页面列表

| 页面 | 路由 | 说明 |
|------|------|------|
| 首页 | `/` | 平台首页 |
| 经文学习 | `/study` | 32章金刚经学习 |
| AI问答 | `/ai` | 智能问答系统 |
| 课程 | `/courses` | 系统课程 |
| 课程详情 | `/courses/[id]` | 单个课程详情 |
| 社区 | `/community` | 共修社区 |
| 研究 | `/research` | 深度研究 |
| 个人中心 | `/profile` | 用户资料和进度 |
| 设置 | `/settings` | 账户设置 |
| 搜索 | `/search` | 全局搜索 |
| 关于 | `/about` | 关于我们 |
| 帮助 | `/help` | 帮助文档 |
| 登录 | `/login` | 用户登录 |
| 注册 | `/register` | 用户注册 |

## 部署

### Vercel 部署（推荐）

本项目配置了 Vercel 部署，区域设置为香港 (hkg1) 以优化国内访问。

#### 快速部署步骤

1. **推送到 GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

2. **连接 Vercel**
   - 访问 [vercel.com](https://vercel.com)
   - 点击 "Add New Project"
   - 导入 GitHub 仓库

3. **配置环境变量**（在 Vercel 项目设置中）：

   | 变量 | 说明 | 获取方式 |
   |------|------|----------|
   | `DATABASE_URL` | PostgreSQL 数据库连接 | Supabase/Vercel Postgres |
   | `NEXTAUTH_URL` | 网站域名 | 部署后自动获取 |
   | `NEXTAUTH_SECRET` | 随机密钥 | `openssl rand -base64 32` |
   | `GEMINI_API_KEY` | Google Gemini API | [AI Studio](https://aistudio.google.com/app/apikey) |

4. **部署** - 点击 "Deploy" 即可

#### 推荐数据库方案

- **Vercel Postgres**: 在 Vercel 项目中直接添加（最简单）
- **Supabase**: 访问 [supabase.com](https://supabase.com) 创建免费项目

部署后运行数据库迁移：
```bash
npx prisma db push
```

---

### 国内部署（备选）

如需更快的国内访问速度，可选择：

1. **腾讯云 CloudBase** - 配置文件: `cloudbaserc.json`
2. **阿里云 ECS + Docker** - 配置文件: `docker-compose.yml`
3. **自建服务器** - 详见 `docs/aliyun-deploy.md`

## 许可证

MIT
