# 部署文档

本文档描述金刚经研究与教学平台的部署方案，支持 Vercel、Docker、阿里云等多种部署方式。

## 目录

- [部署架构](#部署架构)
- [方案一：Vercel 部署（推荐）](#方案一vercel-部署推荐)
- [方案二：Docker 部署](#方案二docker-部署)
- [方案三：阿里云函数计算](#方案三阿里云函数计算)
- [域名配置](#域名配置)
- [环境变量](#环境变量)
- [数据库设置](#数据库设置)
- [故障排查](#故障排查)

---

## 部署架构

```
                    ┌─────────────────────────────────────┐
                    │          用户访问请求                │
                    └─────────────────┬───────────────────┘
                                      │
                         ┌────────────┴────────────┐
                         │                         │
                    ┌────▼─────┐             ┌────▼─────┐
                    │  Vercel  │             │  Docker   │
                    │ (Serverless)│           │ (VPS)     │
                    └────┬─────┘             └────┬─────┘
                         │                         │
                    ┌────▼─────┐             ┌────▼─────┐
                    │ Next.js  │             │ Next.js  │
                    │ + Prisma │             │ + Prisma │
                    └──────────┘             └────┬─────┘
                                                  │
                                            ┌─────▼─────┐
                                            │ PostgreSQL │
                                            └───────────┘
```

### 部署方案对比

| 特性 | Vercel | Docker | 阿里云 FC |
|------|--------|--------|-----------|
| 部署复杂度 | 简单 (Git 推送) | 中等 (命令行) | 中等 (CLI) |
| 运行成本 | 免费额度充足 | VPS 费用 | 按量付费 |
| 响应速度 | 全球 CDN | 取决于服务器 | 国内较快 |
| 数据库 | 需外部 | 自带 PostgreSQL | 需外部 |
| 适用场景 | 快速上线 | 长期稳定 | 国内优化 |

---

## 方案一：Vercel 部署（推荐）

适用于快速上线，利用 Vercel 的全球 CDN 和免费额度。

### 1.1 前置要求

- [x] GitHub 账号
- [x] Vercel 账号 (可用 GitHub 登录)
- [x] PostgreSQL 数据库 (Vercel Postgres / Supabase)

### 1.2 项目结构

```
diamond-sutra-platform/
├── src/                    # 源代码
├── prisma/                 # 数据库 schema
├── public/                 # 静态资源
├── package.json            # 依赖配置
├── next.config.ts          # Next.js 配置
├── vercel.json             # Vercel 配置
└── tsconfig.json           # TypeScript 配置
```

### 1.3 配置文件

**vercel.json** (当前配置)
```json
{
  "buildCommand": "prisma generate && next build",
  "devCommand": "next dev",
  "installCommand": "npm install",
  "framework": "nextjs",
  "regions": ["hkg1"]
}
```

**配置说明**:
- `buildCommand`: 构建 Prisma Client 和 Next.js 应用
- `regions`: 部署到香港区域，优化国内访问
- `framework`: 自动识别 Next.js 框架

### 1.4 部署步骤

#### 方法 A：通过 Vercel Dashboard

1. **推送代码到 GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

2. **在 Vercel 导入项目**
   - 访问 [Vercel Dashboard](https://vercel.com/dashboard)
   - 点击 "Add New Project"
   - 导入 GitHub 仓库
   - 配置项目名称

3. **配置环境变量** (必须)

   | 变量名 | 说明 | 获取方式 |
   |--------|------|----------|
   | `DATABASE_URL` | PostgreSQL 连接 | Vercel Postgres / Supabase |
   | `NEXTAUTH_URL` | 网站 URL | 部署后自动获取 |
   | `NEXTAUTH_SECRET` | 加密密钥 | `openssl rand -base64 32` |
   | `GEMINI_API_KEY` | Google AI 密钥 | [AI Studio](https://aistudio.google.com/app/apikey) |
   | `GOOGLE_CLIENT_ID` | Google OAuth | [Google Cloud Console](https://console.cloud.google.com) |
   | `GOOGLE_CLIENT_SECRET` | Google OAuth | 同上 |

4. **设置数据库**
   - **选项 A: Vercel Postgres** (推荐)
     - 在 Vercel 项目中添加 Storage > Postgres
     - 自动获取 `DATABASE_URL`
   - **选项 B: Supabase**
     - 访问 [Supabase](https://supabase.com) 创建项目
     - Settings > Database > Connection string

5. **运行数据库迁移**
   ```bash
   # 在本地运行，连接到生产数据库
   DATABASE_URL="your-production-db-url" npx prisma db push
   DATABASE_URL="your-production-db-url" npm run db:seed
   ```

6. **点击 Deploy**

#### 方法 B：通过 Vercel CLI

```bash
# 安装 Vercel CLI
npm install -g vercel

# 登录
vercel login

# 部署
vercel prod

# 设置域名
vercel alias set <deployment-url> diamond-sutra.vercel.app
```

### 1.5 Vercel Postgres 快速设置

1. 在 Vercel 项目中，进入 **Storage** 标签
2. 点击 **Create Database** > **Postgres**
3. 选择区域（推荐 Hong Kong）
4. 创建后自动连接到项目
5. 复制 `DATABASE_URL` 到环境变量

---

## 方案二：Docker 部署

适用于有 VPS 服务器的场景，完全控制运行环境。

### 2.1 前置要求

- [x] 服务器: Ubuntu 20.04+ / CentOS 7+
- [x] Docker & Docker Compose
- [x] 域名 (可选)

### 2.2 快速启动

```bash
# 克隆代码
git clone <your-repo-url>
cd diamond-sutra-platform

# 复制环境变量
cp .env.example .env

# 编辑配置
nano .env
```

**.env 配置**:
```env
DATABASE_URL="postgresql://postgres:password@db:5432/diamond_sutra?schema=public"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"
GEMINI_API_KEY="AIza..."
```

```bash
# 启动服务
docker-compose up -d

# 初始化数据库
docker-compose exec app npx prisma db push
docker-compose exec app npm run db:seed

# 查看日志
docker-compose logs -f app
```

### 2.3 服务结构

**docker-compose.yml** 包含三个服务:

| 服务 | 说明 | 端口 |
|------|------|------|
| `app` | Next.js 应用 | 3000 |
| `db` | PostgreSQL 数据库 | 5432 |
| `nginx` | 反向代理 (可选) | 80, 443 |

### 2.4 Nginx 配置

**nginx.conf** (已包含):
```nginx
server {
    listen 80;
    server_name _;

    location / {
        proxy_pass http://app:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 2.5 常用命令

```bash
# 停止服务
docker-compose down

# 重新构建
docker-compose up -d --build

# 查看日志
docker-compose logs -f

# 进入容器
docker-compose exec app sh
```

---

## 方案三：阿里云函数计算 FC

适用于国内访问优化，按量付费。

### 3.1 前置要求

- [x] 阿里云账号
- [x] 阿里云 CLI

### 3.2 配置文件

**aliyun_fc.json** (已包含):
```json
{
  "ROSTemplateFormatVersion": "2015-09-01",
  "Transform": "Aliyun::Serverless-2018-04-03",
  "Resources": {
    "diamond-sutra-service": {
      "Type": "Aliyun::Serverless::Service",
      "Properties": {
        "Description": "金刚经研究与教学平台"
      },
      "nextjs-app": {
        "Type": "Aliyun::Serverless::Function",
        "Properties": {
          "Description": "Next.js 应用",
          "CodeUri": "./",
          "Runtime": "nodejs20",
          "Handler": "index.handler",
          "MemorySize": 1024,
          "Timeout": 30
        }
      }
    }
  }
}
```

### 3.3 部署步骤

```bash
# 安装阿里云 CLI
npm install -g @alicloud/fun

# 配置认证
fun config

# 部署
fun deploy

# 或使用 Serverless Devs
s deploy
```

---

## 域名配置

### Vercel 自定义域名

1. 在 Vercel Dashboard 进入项目设置
2. **Domains** > **Add Domain**
3. 输入域名 (如 `jingangjin.example.com`)
4. 配置 DNS 记录:

| 类型 | 名称 | 值 |
|------|------|-----|
| CNAME | www | cname.vercel-dns.com |
| CNAME | @ | cname.vercel-dns.com |

### DNS 配置示例 (阿里云)

```
# 云解析 DNS
jingangjin.example.com    CNAME  cname.vercel-dns.com
www.jingangjin.example.com CNAME  cname.vercel-dns.com
```

### SSL 证书

- **Vercel**: 自动提供 Let's Encrypt 证书
- **Docker + Nginx**: 使用 Certbot

```bash
# 获取 Let's Encrypt 证书
sudo certbot --nginx -d yourdomain.com
```

---

## 环境变量

### 必需变量

| 变量名 | 说明 | 示例值 |
|--------|------|--------|
| `DATABASE_URL` | PostgreSQL 连接 | `postgresql://user:pass@host:5432/db` |
| `NEXTAUTH_URL` | 网站 URL | `https://yourdomain.com` |
| `NEXTAUTH_SECRET` | 加密密钥 | 随机字符串 |
| `GEMINI_API_KEY` | Google AI 密钥 | `AIza...` |

### 可选变量

| 变量名 | 说明 |
|--------|------|
| `GOOGLE_CLIENT_ID` | Google OAuth ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth Secret |
| `NODE_ENV` | 运行环境 (production) |

### 生成密钥

```bash
# 生成 NEXTAUTH_SECRET
openssl rand -base64 32

# 或使用 Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

---

## 数据库设置

### Vercel Postgres (推荐)

1. 在 Vercel 项目中 **Storage** > **Create Database**
2. 选择 **Postgres**
3. 区域选择 **Hong Kong**
4. 创建后自动获取连接信息

### Supabase

1. 访问 [Supabase](https://supabase.com)
2. 创建新项目
3. **Settings** > **Database**
4. 复制 **Connection string** (URI 格式)

### 运行迁移

```bash
# 开发环境
npm run db:push
npm run db:seed

# 生产环境 (设置 DATABASE_URL)
DATABASE_URL="production-url" npx prisma db push
DATABASE_URL="production-url" npm run db:seed
```

### Prisma Studio (数据库管理)

```bash
npm run db:studio
```

访问 http://localhost:5555 管理数据。

---

## 故障排查

### 常见问题

#### 1. Vercel 部署后 500 错误

**可能原因**:
- 数据库连接失败
- 环境变量未设置

**解决**:
```bash
# 检查环境变量
vercel env ls

# 检查构建日志
vercel logs <deployment-url>
```

#### 2. Prisma Client 生成失败

**错误信息**: `Error: @prisma/client did not initialize yet`

**解决**:
```bash
# 重新生成 Prisma Client
npx prisma generate

# 或使用 build 脚本
npm run build
```

#### 3. 数据库连接超时

**可能原因**:
- 防火墙阻止
- SSL 配置问题

**解决**:
在 `DATABASE_URL` 中添加 SSL 参数:
```
postgresql://user:pass@host:5432/db?sslmode=require
```

#### 4. AI 功能无响应

**可能原因**:
- `GEMINI_API_KEY` 未设置或无效
- API 速率限制

**解决**:
```bash
# 验证 API 密钥
curl https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=YOUR_API_KEY
```

#### 5. Docker 容器无法启动

**解决**:
```bash
# 查看详细日志
docker-compose logs app

# 重新构建
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

---

## 更新部署

### Vercel 自动部署

```bash
# 修改代码后直接推送
git add .
git commit -m "Update feature"
git push origin main

# Vercel 自动触发部署
```

### Docker 更新

```bash
# 拉取最新代码
git pull

# 重新构建部署
docker-compose down
docker-compose up -d --build
```

---

## 监控和日志

### Vercel Dashboard

- 访问 [Vercel Dashboard](https://vercel.com/dashboard)
- 查看部署日志、访问统计、错误追踪

### 日志查看

```bash
# Vercel CLI
vercel logs <deployment-url>
vercel logs <deployment-url> --follow  # 实时

# Docker
docker-compose logs -f app
```

---

## 成本估算

| 方案 | 月成本 | 流量/请求限制 |
|------|--------|---------------|
| Vercel 免费版 | $0 | 100GB 带宽 |
| Vercel Pro | $20 | 1TB 带宽 |
| Docker VPS | $5-50 | 取决于配置 |
| 阿里云 FC | 按量付费 | 100万次调用免费 |

对于中小型学习平台，**Vercel 免费版 + Supabase 免费版** 完全足够。

---

## 参考资料

- [Vercel Next.js 部署文档](https://vercel.com/docs/frameworks/nextjs)
- [Prisma 部署指南](https://www.prisma.io/docs/guides/deployment)
- [NextAuth.js 环境变量](https://next-auth.js.org/configuration/options)
- [Google AI Studio](https://aistudio.google.com/app/apikey)
