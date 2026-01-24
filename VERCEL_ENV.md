# Vercel 部署环境变量配置

## 必需环境变量

### 1. 数据库配置
```
DATABASE_URL=postgresql://username:password@host:port/database?sslmode=require
```
- **推荐**: 使用 Vercel Postgres 或 Supabase
- **获取方式**: 
  - Vercel Postgres: 在 Vercel 项目中添加 Postgres 数据库
  - Supabase: 创建免费项目后获取连接字符串

### 2. NextAuth 配置
```
NEXTAUTH_URL=https://your-domain.vercel.app
NEXTAUTH_SECRET=your-secret-key-here
```
- **NEXTAUTH_SECRET**: 运行 `openssl rand -base64 32` 生成

### 3. AI 提供商配置 (至少配置一个)

#### Gemini (推荐)
```
GEMINI_API_KEY=your-gemini-api-key
AI_PROVIDER=gemini
```
- **获取方式**: 访问 [Google AI Studio](https://aistudio.google.com/app/apikey)

#### DeepSeek (备选)
```
DEEPSEEK_API_KEY=your-deepseek-api-key
AI_PROVIDER=deepseek
```
- **获取方式**: 访问 [DeepSeek API](https://platform.deepseek.com/api_keys)

## 可选环境变量

### OAuth 提供商 (用于社交登录)
```
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

### 应用配置
```
NODE_ENV=production
```

## 快速部署步骤

1. **推送到 GitHub**
   ```bash
   git add .
   git commit -m "准备部署"
   git push origin main
   ```

2. **在 Vercel 中导入项目**
   - 访问 [vercel.com](https://vercel.com)
   - 点击 "Add New Project"
   - 导入 GitHub 仓库

3. **配置环境变量**
   - 在项目设置 > Environment Variables 中添加上述变量
   - 确保所有变量都已设置

4. **部署**
   - 点击 "Deploy"
   - 等待构建完成

5. **数据库初始化**
   - 部署完成后，访问 `https://your-domain.vercel.app/api/init-database`
   - 或运行数据库迁移命令

## 数据库迁移命令

```bash
# 在 Vercel CLI 或本地运行
npx prisma db push
npx prisma db seed
```

## 故障排除

### 数据库连接失败
- 检查 DATABASE_URL 格式
- 确保数据库允许外部连接
- 检查防火墙设置

### AI 服务不可用
- 验证 API 密钥是否正确
- 检查 API 配额是否充足
- 尝试切换 AI 提供商

### 构建失败
- 检查 Node.js 版本 (需要 18+)
- 查看构建日志中的具体错误
- 确保所有依赖项已正确安装