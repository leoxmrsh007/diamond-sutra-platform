# 数据库配置指南

## 生产环境数据库推荐

### 1. Neon PostgreSQL（推荐）

**优势**:
- 免费套餐足够项目初期使用
- Serverless 架构，自动扩缩容
- 支持分支功能，便于开发测试
- 与 Vercel 深度集成

**配置步骤**:
1. 访问 https://neon.tech 注册账号
2. 创建新项目，选择区域（推荐离用户最近的区域）
3. 复制 Connection String (Pooling enabled)
4. 在 Vercel 项目环境变量中添加 `DATABASE_URL`

**连接字符串格式**:
```
postgresql://neondb_owner:password@ep-xxx.aws.neon.tech/neondb?sslmode=require&pgbouncer=true
```

### 2. Supabase PostgreSQL

**优势**:
- 免费套餐慷慨 (500MB)
- 内置认证和存储服务
- 实时订阅功能
- 丰富的管理界面

**配置步骤**:
1. 访问 https://supabase.com 注册账号
2. 创建新项目
3. 进入 Settings > Database > Connection String
4. 复制 URI 并填入环境变量

### 3. Vercel Postgres

**优势**:
- 与 Vercel 无缝集成
- 一键添加，无需单独配置
- 自动备份

**配置步骤**:
1. 在 Vercel 项目中点击 Storage
2. 添加 Postgres Database
3. 环境变量自动配置

## 环境变量配置

### Vercel 部署

在 Vercel 项目设置中添加以下环境变量:

| 变量名 | 说明 | 必填 |
|--------|------|------|
| `DATABASE_URL` | PostgreSQL 连接字符串 | 是 |
| `NEXTAUTH_URL` | 网站 URL（如 https://yourdomain.com） | 是 |
| `NEXTAUTH_SECRET` | 随机密钥 (openssl rand -base64 32) | 是 |
| `GEMINI_API_KEY` | Google Gemini API 密钥 | 是 |
| `AI_PROVIDER` | AI 提供商 (gemini/deepseek) | 否 |
| `DEEPSEEK_API_KEY` | DeepSeek API 密钥 | 否 |
| `GOOGLE_CLIENT_ID` | Google OAuth 客户端 ID | 否 |
| `GOOGLE_CLIENT_SECRET` | Google OAuth 客户端密钥 | 否 |

### 本地开发

复制 `.env.example` 为 `.env.local`，填入本地数据库配置:

```bash
cp .env.example .env.local
```

## 数据库迁移

### 初始化数据库

```bash
# 生成 Prisma Client
npm run db:generate

# 推送数据库结构（开发环境）
npm run db:push

# 或使用迁移（生产环境推荐）
npm run db:migrate

# 填充种子数据
npm run db:seed
```

### Vercel 部署时自动迁移

在 `package.json` 中已配置 `build` 脚本自动运行 Prisma 生成：

```json
{
  "scripts": {
    "build": "prisma generate && next build"
  }
}
```

部署后手动运行迁移:

```bash
npx prisma db push
```

或在 Vercel 中添加构建后脚本。

## 数据库管理

### Prisma Studio（开发用）

```bash
npm run db:studio
```

打开浏览器访问 http://localhost:5555

### 数据备份

- **Neon**: 自动备份，保留 7 天
- **Supabase**: 自动备份，保留 30 天（付费）
- **Vercel Postgres**: 自动备份

## 安全建议

1. **永远不要**将 `.env` 文件提交到 Git
2. 使用强密码作为数据库密码
3. 启用 SSL 连接 (`sslmode=require`)
4. 定期轮换 API 密钥和密码
5. 限制数据库访问 IP（如果支持）

## 故障排除

### 连接超时
- 检查是否启用 `pgbouncer=true` 参数
- 确认数据库区域与部署区域接近

### 迁移失败
- 删除 `node_modules/.prisma` 后重新运行 `npm run db:generate`
- 检查数据库连接是否正常

### Seed 数据导入失败
- 确保数据库表结构已创建 (`npm run db:push`)
- 检查 `.env.local` 中的 `DATABASE_URL` 是否正确
