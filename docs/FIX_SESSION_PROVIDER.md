# 🔧 修复：NextAuth SessionProvider 错误

## 问题描述

应用启动时出现运行时错误：

```
[next-auth]: `useSession` must be wrapped in a <SessionProvider />
```

**错误位置**：`src/app/study/page.tsx` (第74行)

**原因**：NextAuth 的 `useSession` hook 必须被 `<SessionProvider>` 包裹，但是根布局（`src/app/layout.tsx`）中缺少这个 Provider。

---

## 解决方案

### 1. 创建 SessionProvider 组件

**文件**：`src/components/auth/session-provider.tsx`

```typescript
'use client';

import { SessionProvider as NextAuthSessionProvider } from 'next-auth/react';

export function SessionProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextAuthSessionProvider>
      {children}
    </NextAuthSessionProvider>
  );
}
```

### 2. 更新根布局

**文件**：`src/app/layout.tsx`

**修改前**：
```tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { LayoutWrapper } from "@/components/layout/layout-wrapper";

// ... rest of file

export default function RootLayout({ children }: { ... }) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <LayoutWrapper>{children}</LayoutWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}
```

**修改后**：
```tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { LayoutWrapper } from "@/components/layout/layout-wrapper";
import { SessionProvider } from "@/components/auth/session-provider";  // 新增

// ... rest of file

export default function RootLayout({ children }: { ... }) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body>
        <SessionProvider>  {/* 新增 */}
          <ThemeProvider>
            <LayoutWrapper>{children}</LayoutWrapper>
          </ThemeProvider>
        </SessionProvider>  {/* 新增 */}
      </body>
    </html>
  );
}
```

---

## 验证

### 检查点

| 项目 | 状态 |
|------|------|
| SessionProvider 组件创建 | ✅ |
| SessionProvider 导入到 layout.tsx | ✅ |
| SessionProvider 包裹 ThemeProvider 和 children | ✅ |
| 开发服务器重新启动 | ✅ |

### 测试结果

开发服务器成功启动：
```
✓ Next.js 16.1.1 (Turbopack)
✓ Local: http://localhost:3003
```

---

## 下一步

### 1. 访问应用

**地址**：http://localhost:3003

### 2. 测试 NextAuth 功能

| 功能 | 路径 | 测试点 |
|------|------|--------|
| 用户注册 | `/register` | 是否能注册新用户 |
| 用户登录 | `/login` | 是否能登录已注册用户 |
| 会话状态 | `/study` | useSession 是否正常工作 |

### 3. 可选：配置 OAuth

如果需要 Google 登录，配置环境变量：

```env
# .env.local
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

**获取方式**：
1. 访问 [Google Cloud Console](https://console.cloud.google.com)
2. 创建 OAuth 2.0 凭证
3. 配置授权重定向 URI：
   - 开发环境：`http://localhost:3003/api/auth/callback/google`

---

## 相关文件

| 文件 | 说明 |
|------|------|
| `src/components/auth/session-provider.tsx` | SessionProvider 组件 |
| `src/app/layout.tsx` | 根布局，已添加 SessionProvider |
| `src/app/api/auth/[...nextauth]/route.ts` | NextAuth 配置 |
| `src/lib/prisma.ts` | Prisma 客户端实例 |
| `src/app/study/page.tsx` | 使用 useSession 的页面 |

---

## 技术细节

### NextAuth 架构

```
RootLayout
└─ SessionProvider (next-auth/react)
   └─ ThemeProvider
      └─ LayoutWrapper
         └─ {children}
            └─ StudyPage
               └─ useSession() ✅ 现在可以正常工作
```

### 使用 useSession 的组件

```typescript
'use client';

import { useSession } from 'next-auth/react';

export default function MyComponent() {
  const { data: session } = useSession();

  return (
    <div>
      {session?.user ? (
        <p>已登录: {session.user.name}</p>
      ) : (
        <p>未登录</p>
      )}
    </div>
  );
}
```

---

## 常见问题

### Q1: 修改后仍然报错？

**A**: 清除 `.next` 缓存并重新启动：
```bash
rm -rf .next
npm run dev
```

### Q2: SessionProvider 位置不对？

**A**: SessionProvider 必须在根布局的最外层（除了 `<html>` 和 `<body>`），包裹所有使用 `useSession` 的组件。

### Q3: 数据库连接失败？

**A**: 检查 `.env.local` 中的 `DATABASE_URL` 配置：
```env
DATABASE_URL=file:./dev.db
```

---

**修复时间**：2026-01-13  
**修复状态**：✅ 已完成  
**服务器地址**：http://localhost:3003
