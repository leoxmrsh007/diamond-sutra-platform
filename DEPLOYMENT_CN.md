# 国内部署指南

本项目支持多种国内部署方案，推荐按以下顺序选择：

## 方案一：腾讯云静态网站托管（推荐）

### 优势
- 免费额度：50GB 存储 + 100GB/月 CDN 流量
- 国内访问速度快
- 支持自定义域名 + SSL 证书
- 支持 Next.js 静态导出

### 部署步骤

1. **构建静态文件**
```bash
npm run build
```

2. **将 `.next` 目录上传到腾讯云静态网站托管**
- 登录 [腾讯云静态网站托管控制台](https://console.cloud.tencent.com/tcb/hosting)
- 创建静态网站托管
- 上传构建产物

3. **配置自定义域名**
- 在域名解析中添加 CNAME 记录
- 在托管设置中绑定域名

---

## 方案二：阿里云 OSS + CDN

### 优势
- 稳定可靠
- CDN 覆盖全国
- 按量付费

### 部署步骤

1. **创建 OSS Bucket**
- 登录 [阿里云 OSS 控制台](https://oss.console.aliyun.com/)
- 创建 Bucket（选择华东/华北区域）
- 开启静态网站托管

2. **配置 CDN 加速**
- 创建 CDN 域名
- 配置源站为 OSS Bucket
- 开启 HTTPS

3. **上传静态文件**
```bash
# 使用阿里云 CLI 上传
ossutil cp -r .next oss://your-bucket/ --update
```

---

## 方案三：Gitee Pages

### 优势
- 完全免费
- 支持自定义域名
- 国内访问快

### 部署步骤

1. **创建 Gitee 仓库**
- 将代码推送到 Gitee

2. **开启 Gitee Pages 服务**
- 在仓库设置中开启 Pages
- 选择部署分支

3. **配置自定义域名**（可选）

---

## 方案四：使用 Vercel + 自定义域名 + 国内 CDN

### 优势
- 无需修改代码
- 自动部署
- 配置国内 CDN 加速

### 部署步骤

1. **已在 Vercel 部署**
- https://diamond-sutra-platform.vercel.app

2. **配置国内域名 + CDN**
- 购买国内域名
- 在阿里云/腾讯云 DNS 解析到 Vercel
- 配置 CDN 回源到 Vercel

---

## 环境变量配置

无论选择哪种方案，以下环境变量需要配置：

```env
DATABASE_URL=postgresql://...
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=your-secret-key
GEMINI_API_KEY=your-gemini-api-key
```

对于静态部署，API 路由需要单独部署到函数计算。

---

## 推荐方案

**最佳性价比方案：**
- 静态页面：腾讯云静态网站托管（免费）
- API 接口：阿里云函数计算 FC
- 数据库：阿里云 RDS PostgreSQL 或 Supabase（通过专线）

**快速开始方案：**
- 使用 Vercel 香港区域 + 配置国内 CDN 加速
