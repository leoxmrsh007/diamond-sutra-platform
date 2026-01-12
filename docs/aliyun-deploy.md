# 阿里云部署指南

本指南介绍如何将金刚经平台部署到阿里云。

## 推荐方案对比

| 方案 | 适用场景 | 费用 | 复杂度 |
|------|----------|------|--------|
| **ECS + Docker** | 生产环境，高流量 | ¥100-300/月 | 中 |
| **SAE (Serverless)** | 低流量，按需付费 | 低（按量） | 低 |
| **函数计算 FC** | 纯静态/简单应用 | 极低（按调用） | 高 |

---

## 方案一：ECS + Docker（推荐）

### 1. 购买阿里云 ECS

1. 访问 [阿里云 ECS](https://www.aliyun.com/product/ecs)
2. 推荐配置：
   - CPU: 2核
   - 内存: 4GB
   - 系统: Ubuntu 22.04 / CentOS 8
   - 带宽: 5Mbps 以上

### 2. 购买/配置 RDS PostgreSQL

**选项 A: 使用阿里云 RDS**
1. 访问 [阿里云 RDS](https://www.aliyun.com/product/rds/postgresql)
2. 创建 PostgreSQL 实例
3. 获取连接字符串

**选项 B: 使用 Docker 自建数据库**
```bash
# 已在 docker-compose.yml 中配置
# 自动启动 PostgreSQL 容器
```

### 3. 配置 ECS 服务器

```bash
# SSH 连接到服务器
ssh root@your-server-ip

# 安装 Docker
curl -fsSL https://get.docker.com | sh
systemctl start docker
systemctl enable docker

# 安装 Docker Compose
curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose
```

### 4. 部署应用

```bash
# 克隆代码
git clone <your-repo-url> diamond-sutra
cd diamond-sutra

# 创建环境变量文件
cat > .env << EOF
DATABASE_URL=postgresql://postgres:your-password@db:5432/diamond_sutra?schema=public
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=$(openssl rand -base64 32)
GEMINI_API_KEY=your-gemini-api-key
EOF

# 启动服务
docker-compose up -d

# 初始化数据库
docker-compose exec app npx prisma db push
docker-compose exec app npx prisma db seed
```

### 5. 配置域名和 SSL

```bash
# 安装 Certbot 获取免费 SSL 证书
apt install certbot python3-certbot-nginx

# 获取证书
certbot --nginx -d your-domain.com

# 修改 nginx.conf 启用 HTTPS
# 已在项目根目录提供 nginx.conf 模板
```

---

## 方案二：阿里云 SAE (Serverless)

### 1. 准备工作

1. 访问 [阿里云 SAE](https://www.aliyun.com/product/sae)
2. 创建命名空间和应用

### 2. 配置环境变量

在 SAE 控制台配置：

| 变量名 | 值 |
|--------|-----|
| DATABASE_URL | 你的 RDS 连接字符串 |
| NEXTAUTH_URL | https://your-app-domain.cn |
| NEXTAUTH_SECRET | 随机生成的密钥 |
| GEMINI_API_KEY | Gemini API 密钥 |
| PORT | 8080 |

### 3. 部署代码

```bash
# 构建代码
npm run build

# 或使用 Serverless Devs 部署
npm install -g @serverless-devs/s
s deploy
```

---

## 环境变量获取

### DATABASE_URL
```bash
# RDS PostgreSQL 连接格式：
postgresql://username:password@rm-xxxxx.rds.aliyuncs.com:3433/dbname
```

### NEXTAUTH_SECRET
```bash
openssl rand -base64 32
```

### GEMINI_API_KEY
访问: https://aistudio.google.com/app/apikey

---

## 常见问题

### 1. 端口无法访问
```bash
# 检查安全组规则
# 在 ECS 控制台添加入方向规则：
# - 端口 80 (HTTP)
# - 端口 443 (HTTPS)
# - 端口 22 (SSH)
```

### 2. 数据库连接失败
```bash
# 检查 RDS 白名单
# 添加 ECS 内网 IP 到白名单
```

### 3. 内存不足
```bash
# 创建 Swap 分区
dd if=/dev/zero of=/swapfile bs=1M count=2048
chmod 600 /swapfile
mkswap /swapfile
swapon /swapfile
```

---

## 监控和维护

```bash
# 查看应用日志
docker-compose logs -f app

# 重启服务
docker-compose restart app

# 更新代码
git pull
docker-compose up -d --build

# 备份数据库
docker-compose exec db pg_dump -U postgres diamond_sutra > backup.sql
```

---

## 成本估算

| 资源 | 配置 | 月费用 |
|------|------|--------|
| ECS | 2核4GB | ~¥150 |
| RDS PostgreSQL | 1核2GB | ~¥180 |
| 带宽 | 5Mbps | ~¥100 |
| **总计** | | **~¥430/月** |
