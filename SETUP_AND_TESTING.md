# 金刚经平台 - 开发完成与测试指南

## 项目完成情况

### ✅ 已完成功能

#### 1. 数据库架构
- **Prisma 7.2.0** 配置完成
- 完整数据模型设计
  - User, Sutra, Chapter, Verse
  - StudyProgress, Note, Bookmark
  - CheckIn, Course, Lesson, CourseEnrollment
  - Question, Answer, ChatSession, ChatMessage
  - Post, Comment, Concept, ConceptRelation
- Seed 脚本准备完成（32分金刚经数据）

#### 2. 后端 API 系统（12个API端点）

**经文与学习**
- `GET /api/sutra/[slug]` - 获取经文信息
- `GET /api/chapters` - 获取所有章节
- `GET /api/chapters/[id]` - 获取章节详情
- `GET /api/verses/[id]` - 获取偈颂详情

**学习进度**
- `GET/POST/PATCH/DELETE /api/study-progress` - 学习进度管理
- `GET /api/study-statistics` - 学习统计

**笔记与书签**
- `GET/POST /api/notes` - 笔记管理
- `PUT/DELETE /api/notes/[id]` - 笔记详情操作
- `GET/POST/DELETE /api/bookmarks` - 书签管理

**用户签到**
- `GET/POST /api/check-in` - 每日签到功能

**课程系统**
- `GET/POST /api/courses` - 课程列表
- `GET/PATCH/DELETE /api/courses/[id]` - 课程详情
- `POST/DELETE /api/courses/[id]/enroll` - 课程报名
- `GET/POST /api/courses/[courseId]/lessons` - 课时管理

**AI 对话**
- `POST /api/chat` - AI 聊天（支持流式响应）
- `GET /api/chat` - 获取推荐问题

**认证**
- `POST /api/register` - 用户注册
- `All /api/auth/[...nextauth]` - NextAuth 认证

#### 3. 前端页面（14个页面）

- `/` - 首页
- `/login` - 登录页面
- `/register` - 注册页面
- `/study` - 经文学习（数据库集成）
- `/ai` - AI 讲师问答
- `/courses` - 系统课程（数据库集成）
- `/courses/[id]` - 课程详情
- `/community` - 共修社区
- `/research` - 深度研究
- `/profile` - 个人中心
- `/settings` - 设置
- `/search` - 全局搜索
- `/about` - 关于
- `/help` - 帮助文档

#### 4. 核心功能组件

- **学习组件**
  - ReadingMode - 阅读模式（主题、字号、背景音乐）
  - NoteDialog - 笔记对话框
  - BookmarkDialog - 书签对话框
  - DailyCheckIn - 每日签到
  - ProgressVisuals - 进度可视化

- **UI 组件**（shadcn/ui）
  - Button, Input, Card, Dialog, Avatar
  - Tabs, ScrollArea, Badge, Textarea, Slider
  - Dropdown Menu, Separator

- **布局组件**
  - LayoutWrapper - 布局包装器
  - Header, Footer - 头部和底部
  - MobileBottomNav - 移动端导航

## 下一步：环境配置与测试

### 1. 数据库配置

#### 创建 PostgreSQL 数据库

**方法 A: 使用本地 PostgreSQL**
```bash
# 安装 PostgreSQL（如果还没有）
# Windows: https://www.postgresql.org/download/windows/
# macOS: brew install postgresql
# Linux: sudo apt-get install postgresql

# 启动 PostgreSQL 服务
# Windows: 在服务管理器中启动 PostgreSQL 服务
# macOS: brew services start postgresql
# Linux: sudo systemctl start postgresql

# 创建数据库
psql -U postgres
CREATE DATABASE diamond_sutra;
CREATE USER diamond_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE diamond_sutra TO diamond_user;
\q
```

**方法 B: 使用 Docker（推荐）**
```bash
docker run --name postgres-diamond \
  -e POSTGRES_DB=diamond_sutra \
  -e POSTGRES_USER=diamond_user \
  -e POSTGRES_PASSWORD=your_password \
  -p 5432:5432 \
  -d postgres:16
```

**方法 C: 使用 Supabase（云数据库）**
1. 访问 https://supabase.com
2. 创建新项目
3. 在 Project Settings > Database 获取连接字符串
4. 格式: `postgresql://postgres.xxxx:password@aws-x.us-east-1.supabase.co:5432/postgres`

#### 配置环境变量

创建 `.env.local` 文件：
```env
# Database
DATABASE_URL="postgresql://diamond_user:your_password@localhost:5432/diamond_sutra"

# Gemini AI
GEMINI_API_KEY="your-gemini-api-key"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-min-32-chars"

# OAuth Providers (可选)
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""

# App Configuration
NODE_ENV="development"
```

生成 NEXTAUTH_SECRET:
```bash
openssl rand -base64 32
```

获取 GEMINI_API_KEY:
1. 访问 https://aistudio.google.com/app/apikey
2. 创建新 API 密钥
3. 复制密钥到 `.env.local`

### 2. 初始化数据库

```bash
# 进入项目目录
cd diamond-sutra-platform

# 安装依赖
npm install

# 生成 Prisma Client
npm run db:generate

# 推送数据库结构
npm run db:push

# 填充种子数据（32分金刚经）
npm run db:seed
```

### 3. 启动开发服务器

```bash
# 启动开发服务器
npm run dev

# 访问应用
# 打开浏览器: http://localhost:3000
```

### 4. 功能测试指南

#### 测试 1: 用户注册与登录

**注册流程测试：**
1. 访问 `http://localhost:3000/register`
2. 填写注册表单：
   - 邮箱: `test@example.com`
   - 密码: `password123`
   - 姓名: `测试用户`
3. 点击"注册"按钮
4. 预期：注册成功，自动跳转到首页

**登录流程测试：**
1. 访问 `http://localhost:3000/login`
2. 使用刚注册的账号登录
3. 预期：登录成功，导航栏显示用户名

**Google OAuth 测试（需要配置）：**
1. 访问 https://console.cloud.google.com
2. 创建 OAuth 2.0 客户端 ID
3. 配置授权重定向 URI: `http://localhost:3000/api/auth/callback/google`
4. 将 Client ID 和 Secret 添加到 `.env.local`
5. 在登录页面点击"使用 Google 账号登录"

#### 测试 2: 经文学习功能

**章节导航测试：**
1. 访问 `http://localhost:3000/study`
2. 查看左侧章节列表（32分）
3. 点击不同章节切换内容
4. 预期：章节标题、内容正确更新

**偈颂阅读测试：**
1. 在"经文学习"页面
2. 点击"汉译"标签查看中文内容
3. 点击"英译"、"梵文"、"AI解析"标签
4. 预期：各标签内容正确显示

**朗读功能测试：**
1. 点击"朗读经文"按钮
2. 调整朗读速度（0.5x, 1x, 1.5x）
3. 预期：浏览器朗读中文经文
4. 点击"暂停朗读"停止

**背景音乐测试：**
1. 添加背景音乐文件到 `public/bgm/zen-music.mp3`
2. 点击"背景音"按钮
3. 调整音量滑块
4. 预期：背景音乐播放/暂停

#### 测试 3: 学习进度功能

**标记学习状态测试：**
1. 确保已登录
2. 在学习页面点击"标记已背诵"
3. 预期：状态显示"已背诵"，背诵次数+1

**进度统计测试：**
1. 学习多个章节的偈颂
2. 查看右侧"学习进度"卡片
3. 预期：进度百分比正确更新
4. 已学习偈颂数量正确

**签到功能测试：**
1. 点击"每日签到"卡片
2. 点击"签到"按钮
3. 预期：显示"签到成功！"
4. 奖励积分正确（连续签到奖励）

#### 测试 4: 笔记功能

**创建笔记测试：**
1. 在学习页面点击"笔记"按钮
2. 填写笔记标题和内容
3. 点击"保存笔记"
4. 预期：笔记创建成功

**查看笔记测试：**
1. 在个人笔记列表查看
2. 预期：显示所有已创建笔记

**编辑/删除笔记测试：**
1. 点击已有笔记
2. 修改内容并保存
3. 点击删除按钮
4. 预期：修改/删除操作成功

#### 测试 5: 书签功能

**添加书签测试：**
1. 在学习页面点击"书签"按钮
2. 添加备注（可选）
3. 点击"收藏"
4. 预期：书签创建成功

**查看书签测试：**
1. 在右侧"我的收藏"卡片查看
2. 预期：显示所有已收藏偈颂

**跳转到书签测试：**
1. 点击任一书签
2. 预期：跳转到对应偈颂

#### 测试 6: AI 讲师功能

**基础对话测试：**
1. 访问 `http://localhost:3000/ai`
2. 输入问题："什么是般若？"
3. 预期：AI 返回详细解答
4. 响应应该流式显示（逐字显示）

**流式响应测试：**
1. 发送一个较长的问题
2. 观察回答是否逐字出现
3. 预期：看到流式效果

**对话历史测试：**
1. 进行多轮对话
2. 刷新页面
3. 预期：对话历史保持

**推荐问题测试：**
1. 查看左侧"推荐问题"
2. 点击任一问题
3. 预期：问题自动填入输入框并发送

**主题标签测试：**
1. 点击"空性"、"布施"等标签
2. 预期：发送相关主题问题

#### 测试 7: 课程系统

**课程列表测试：**
1. 访问 `http://localhost:3000/courses`
2. 切换"初级/中级/高级"标签
3. 预期：显示对应等级课程

**报名课程测试：**
1. 点击"立即报名"
2. 预期：显示"已报名"标签
3. "我的学习"统计更新

**继续学习测试：**
1. 报名后点击"继续学习"
2. 预期：跳转到课程详情页

### 5. 端到端集成测试

#### 完整学习流程测试

```
1. 注册/登录
2. 访问"经文学习"
3. 选择一个章节
4. 阅读偈颂内容
5. 使用朗读功能
6. 创建笔记
7. 添加书签
8. 标记学习进度
9. 每日签到
10. 向 AI 提问
11. 报名课程
12. 继续学习
```

#### 数据一致性检查

使用 Prisma Studio 查看数据：
```bash
npm run db:studio
```

检查：
- User 表中有新用户记录
- StudyProgress 表中有学习进度
- Note 表中有笔记记录
- Bookmark 表中有书签记录
- CheckIn 表中有签到记录
- CourseEnrollment 表中有报名记录

### 6. 性能与优化测试

**页面加载测试：**
```bash
# 使用 Lighthouse 检查性能
npm run build
npm run start
```

在 Chrome DevTools 中运行 Lighthouse:
- Performance 目标: > 90
- Accessibility 目标: > 90
- Best Practices 目标: > 90
- SEO 目标: > 80

**API 响应时间测试：**
```bash
# 使用 curl 测试 API 响应时间
time curl http://localhost:3000/api/chapters
time curl http://localhost:3000/api/courses
```

## 部署指南

### Vercel 部署（推荐）

1. **推送到 GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

2. **连接 Vercel**
   - 访问 https://vercel.com
   - 点击 "Add New Project"
   - 导入 GitHub 仓库

3. **配置环境变量**
   在 Vercel 项目设置中添加：
   - `DATABASE_URL`
   - `GEMINI_API_KEY`
   - `NEXTAUTH_URL` (自动设置为域名)
   - `NEXTAUTH_SECRET`

4. **运行数据库迁移**
   ```bash
   # 在 Vercel 控制台中
   npx prisma db push
   npx prisma db seed
   ```

### Docker 部署

1. **构建 Docker 镜像**
   ```bash
   docker build -t diamond-sutra-platform .
   ```

2. **运行容器**
   ```bash
   docker run -p 3000:3000 \
     -e DATABASE_URL="postgresql://..." \
     -e GEMINI_API_KEY="..." \
     -e NEXTAUTH_SECRET="..." \
     diamond-sutra-platform
   ```

## 故障排除

### 常见问题

**1. 数据库连接失败**
```
Error: Can't reach database server at `localhost:5432`
```
解决：
- 检查 PostgreSQL 服务是否运行
- 验证 DATABASE_URL 是否正确
- 确认数据库用户名和密码

**2. Prisma Client 生成失败**
```
Error: Prisma Client is not generated
```
解决：
```bash
npm run db:generate
```

**3. AI 聊天无响应**
```
Error: AI 问答服务暂时不可用
```
解决：
- 检查 GEMINI_API_KEY 是否正确
- 验证 API 密钥是否有效
- 检查网络连接

**4. NextAuth 登录失败**
```
Error: NEXTAUTH_SECRET 未设置
```
解决：
- 在 `.env.local` 中设置 NEXTAUTH_SECRET
- 生成: `openssl rand -base64 32`

**5. 页面样式异常**
```
Tailwind CSS 样式未生效
```
解决：
```bash
# 重新构建
npm run build
npm run dev
```

## 技术栈总结

- **前端框架**: Next.js 16.1.1 (App Router)
- **UI 库**: shadcn/ui + Tailwind CSS 4
- **数据库 ORM**: Prisma 7.2.0
- **数据库**: PostgreSQL
- **认证**: NextAuth.js 4.24.13
- **AI**: Google Gemini 2.0
- **语言**: TypeScript 5
- **状态管理**: React Hooks
- **部署**: Vercel / Docker

## 后续优化建议

1. **性能优化**
   - 实现 API 响应缓存
   - 添加静态页面生成 (ISR)
   - 图片优化和 CDN

2. **功能增强**
   - 添加离线支持 (PWA)
   - 实现导出笔记功能 (PDF)
   - 添加学习提醒通知
   - 实现用户社区功能

3. **监控与分析**
   - 集成 Google Analytics
   - 添加错误追踪 (Sentry)
   - 实现用户行为分析

4. **测试覆盖**
   - 添加单元测试 (Jest)
   - 添加集成测试 (Playwright)
   - 添加 E2E 测试

## 联系与支持

如有问题，请：
1. 查看本文档的故障排除部分
2. 检查 GitHub Issues
3. 联系开发团队

---

**项目状态**: 开发完成，待测试与部署

**最后更新**: 2026-01-13
