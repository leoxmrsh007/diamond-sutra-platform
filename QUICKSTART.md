# 快速启动指南

## 方案选择

由于 Docker 网络问题，提供两种数据库方案：

### 方案 A：Supabase 云数据库（推荐，5分钟）

**优点**：免费、无需本地安装、快速部署
**缺点**：需要网络连接

### 方案 B：本地 PostgreSQL（需手动安装）

**优点**：完全本地、无网络依赖
**缺点**：需要安装和配置

---

## 方案 A：使用 Supabase（推荐）

### 1. 创建 Supabase 项目

1. 访问 [https://supabase.com](https://supabase.com)
2. 点击 "Start your project"
3. 使用 GitHub 账号登录
4. 创建新项目：
   - Name: `diamond-sutra`
   - Database Password: 设置强密码（保存！）
   - Region: 选择靠近的区域（如：Singapore）
   - 点击 "Create new project"

等待 1-2 分钟，项目创建完成。

### 2. 获取数据库连接信息

1. 进入项目 Dashboard
2. 左侧菜单：**Settings** → **Database**
3. 向下滚动找到 **Connection string**
4. 点击 **URI** 标签
5. 复制 **Connection string**

格式示例：
```
postgresql://postgres.xxxxx:password@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres
```

### 3. 配置环境变量

编辑 `diamond-sutra-platform/.env.local`：

```env
# 替换为你的 Supabase 连接字符串
DATABASE_URL="postgresql://postgres.xxxxx:YOUR_PASSWORD@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?schema=public"

# Gemini AI - 获取方式见下文
GEMINI_API_KEY="your-gemini-api-key-here"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="diamond-sutra-secret-key-change-in-production"

# App Configuration
NODE_ENV="development"
```

### 4. 初始化数据库

```bash
cd diamond-sutra-platform

# 生成 Prisma Client（已完成）
npm run db:generate

# 推送数据库结构
npm run db:push

# 填充种子数据（32章经文 + 67个偈颂）
npm run db:seed
```

预期输出：
```
✓ 创建经文: 金刚般若波罗蜜经
✓ 创建 32 个章节
✓ 创建 67 个偈颂
✓ 创建示例注释
✓ 创建示例课程
✓ 创建 7 个佛学概念

✅ 数据初始化完成！
```

### 5. 验证数据库

```bash
# 启动 Prisma Studio（可视化数据库）
npm run db:studio
```

浏览器打开 `http://localhost:5555`，检查：
- sutras 表：1 条记录
- chapters 表：32 条记录
- verses 表：67 条记录
- concepts 表：7 条记录

### 6. 获取 Gemini API Key

**用于 AI 问答功能**

1. 访问 [https://aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)
2. 使用 Google 账号登录
3. 点击 "Create API Key"
4. 选择项目（或创建新项目）
5. 复制生成的 API Key（格式：`AIza...`，39字符）
6. 更新 `.env.local` 中的 `GEMINI_API_KEY`

### 7. 启动开发服务器

```bash
npm run dev
```

浏览器打开：`http://localhost:3000`

---

## 方案 B：本地 PostgreSQL

### Windows

1. **下载 PostgreSQL**：
   - 访问 [https://www.postgresql.org/download/windows/](https://www.postgresql.org/download/windows/)
   - 下载安装器（推荐版本：15 或 16）
   - 运行安装程序

2. **安装配置**：
   - 设置密码（保存！）
   - 默认端口：5432
   - 安装 pgAdmin 4（可选）

3. **创建数据库**：

```bash
# 使用 pgAdmin 或命令行
psql -U postgres

# 在 psql 中执行：
CREATE DATABASE diamond_sutra;
\q
```

4. **更新 .env.local**：

```env
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/diamond_sutra?schema=public"
```

5. **继续执行方案 A 的步骤 4-7**

---

## 测试验证

### 1. 运行系统检测

访问：`http://localhost:3000/debug`

点击 "开始检测" 按钮，验证所有模块正常运行。

### 2. 测试核心功能

| 功能 | 路径 | 验证要点 |
|------|------|----------|
| 首页 | `/` | 页面加载正常 |
| 经文学习 | `/study` | 32章显示、偈颂加载 |
| AI 问答 | `/ai` | 流式对话、Markdown 渲染 |
| 课程列表 | `/courses` | 课程显示 |
| 个人中心 | `/profile` | 用户信息显示 |

### 3. 注册测试账号

1. 访问 `/register`
2. 填写信息注册
3. 测试登录功能

---

## Docker 方案（网络修复后）

如果 Docker 网络恢复正常：

```bash
cd diamond-sutra-platform

# 启动 PostgreSQL 容器
docker-compose up -d db

# 等待容器启动（约10秒）
docker-compose logs db

# 更新 .env.local 中的 DATABASE_URL
DATABASE_URL="postgresql://postgres:diamondsutra@localhost:5432/diamond_sutra?schema=public"

# 继续执行方案 A 的步骤 4-7
```

---

## 常见问题

### 问题 1：数据库连接失败

```
Error: P1001: Can't reach database server
```

**解决方案**：
1. 检查 DATABASE_URL 是否正确
2. Supabase：确认项目状态为 Active
3. 本地 PostgreSQL：确认服务正在运行
4. 检查防火墙设置

### 问题 2：Prisma Client 生成失败

```
Error: Could not locate @prisma/client
```

**解决方案**：
```bash
rm -rf node_modules
npm install
npm run db:generate
```

### 问题 3：Seed 脚本执行失败

```
Error: Unique constraint failed
```

**解决方案**：Seed 使用 `upsert`，重复执行不会报错。如需重置：
```bash
# Supabase: 在 Dashboard 中执行 TRUNCATE
# 或重新创建项目
```

### 问题 4：AI 无响应

**解决方案**：
1. 检查 GEMINI_API_KEY 是否配置
2. 测试 API Key：访问 [AI Studio](https://aistudio.google.com/app/apikey)
3. 检查浏览器控制台错误信息

### 问题 5：端口被占用

```
Error: Port 3000 is already in use
```

**解决方案**：
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# 或使用其他端口
npm run dev -- -p 3001
```

---

## 数据统计

完成初始化后，数据库应包含：

| 表 | 记录数 | 说明 |
|----|--------|------|
| sutras | 1 | 金刚般若波罗蜜经 |
| chapters | 32 | 32章完整章节 |
| verses | 67 | 每章2-3个关键偈颂 |
| commentaries | 5+ | 六祖慧能等注释 |
| courses | 1 | 入门导读课程 |
| concepts | 7 | 核心佛学术语 |

---

## 下一步

1. ✅ 完成数据库初始化
2. ✅ 验证核心功能
3. 📝 补充更多注释内容
4. 📝 添加完整课程内容
5. 🚀 部署到 Vercel（见 README.md）

---

**状态**: ✅ 配置文档完成
**推荐方案**: Supabase（快速、免费、简单）
**预计耗时**: 10-15分钟
