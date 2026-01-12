#!/bin/bash
# 阿里云 ECS 部署脚本
# 适用于：阿里云 ECS + Docker + PostgreSQL

set -e

echo "========================================="
echo "  金刚经平台 - 阿里云部署脚本"
echo "========================================="

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# 检查 Docker 是否安装
if ! command -v docker &> /dev/null; then
    echo -e "${YELLOW}正在安装 Docker...${NC}"
    curl -fsSL https://get.docker.com | sh
    systemctl start docker
    systemctl enable docker
fi

# 检查 Docker Compose
if ! command -v docker-compose &> /dev/null; then
    echo -e "${YELLOW}正在安装 Docker Compose...${NC}"
    curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    chmod +x /usr/local/bin/docker-compose
fi

# 检查环境变量文件
if [ ! -f .env ]; then
    echo -e "${RED}错误: 未找到 .env 文件${NC}"
    echo "请先创建 .env 文件并配置以下环境变量："
    echo ""
    echo "DATABASE_URL=postgresql://user:password@host:5432/dbname"
    echo "NEXTAUTH_URL=https://your-domain.com"
    echo "NEXTAUTH_SECRET=your-random-secret-key"
    echo "GEMINI_API_KEY=your-gemini-api-key"
    echo ""
    exit 1
fi

# 停止旧容器
echo -e "${YELLOW}停止旧容器...${NC}"
docker-compose down

# 构建镜像
echo -e "${YELLOW}构建 Docker 镜像...${NC}"
docker-compose build

# 启动服务
echo -e "${YELLOW}启动服务...${NC}"
docker-compose up -d

# 等待数据库启动
echo -e "${YELLOW}等待数据库启动...${NC}"
sleep 10

# 运行数据库迁移
echo -e "${YELLOW}初始化数据库...${NC}"
docker-compose exec -T app npx prisma db push || echo "数据库迁移失败，请手动执行"

# 检查服务状态
echo ""
echo -e "${GREEN}=========================================${NC}"
echo -e "${GREEN}  部署完成！${NC}"
echo -e "${GREEN}=========================================${NC}"
echo ""
echo "服务状态："
docker-compose ps
echo ""
echo "查看日志："
echo "  docker-compose logs -f app"
echo ""
echo "数据库管理："
echo "  docker-compose exec db psql -U postgres -d diamond_sutra"
