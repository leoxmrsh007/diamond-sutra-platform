# 登录500错误修复说明

## 问题原因
登录失败是因为 NEXTAUTH_URL 环境变量设置为 `https://jinganjing.cn`，但实际访问的网站是 `https://www.jinganjing.cn`，导致域名不匹配，NextAuth无法正确处理认证。

## 修复方案

### 方法1：通过Vercel控制台更新（推荐）

1. 访问 Vercel Dashboard: https://vercel.com/dashboard
2. 选择项目：`diamond-sutra-platform`
3. 进入 Settings → Environment Variables
4. 找到 `NEXTAUTH_URL` 环境变量
5. 将值从 `https://jinganjing.cn` 改为 `https://www.jinganjing.cn`
6. 保存更改
7. 触发重新部署（或等待下次自动部署）

### 方法2：使用Vercel CLI更新

```bash
# 安装Vercel CLI（如果尚未安装）
npm i -g vercel

# 登录
vercel login

# 更新环境变量
vercel env set NEXTAUTH_URL https://www.jinganjing.cn production

# 触发重新部署
vercel --prod
```

### 方法3：使用域名重定向（备用）

如果您希望保留 `jinganjing.cn` 作为主域名，可以设置域名重定向：

1. 在Vercel中添加 `jinganjing.cn` 域名（如果尚未添加）
2. 配置将 `jinganjing.cn` 重定向到 `www.jinganjing.cn`

## 验证修复

等待部署完成后（约1-2分钟），访问：
- 登录页面：https://www.jinganjing.cn/login
- 测试账号：`admin@example.com` / `Admin@123`

如果仍然有问题，请检查：
1. NEXTAUTH_URL 是否正确设置为 `https://www.jinganjing.cn`
2. NEXTAUTH_SECRET 是否已设置
3. 数据库连接是否正常

## 其他相关环境变量

确保以下环境变量也已正确设置：

```
DATABASE_URL=postgresql://neondb_owner:npg_SuPOb2scv6hZ@ep-delicate-river-ahizjt90-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require
NEXTAUTH_SECRET=2b0240a45b5eddfeb0c1935e3d2b9845543797b28307b7ed0620e9cd95afc393
NODE_ENV=production
```

## 技术细节

### NextAuth域名验证
NextAuth 使用 NEXTAUTH_URL 来：
1. 生成回调URL
2. 验证请求来源
3. 防止CSRF攻击

如果域名不匹配，会导致：
- 认证失败
- 回调错误
- Session无法建立

### 测试方法
您可以使用以下命令测试环境变量：
```bash
curl https://www.jinganjing.cn/api/check-env
```

应该返回：
```json
{
  "databaseUrlSet": true,
  "nodeEnv": "production",
  "hasAuthSecret": true,
  ...
}
```

## 需要帮助？

如果问题仍然存在，请检查：
1. Vercel 部署日志（查看是否有错误）
2. 浏览器控制台（查看是否有JavaScript错误）
3. 网络请求（查看认证请求的状态）
