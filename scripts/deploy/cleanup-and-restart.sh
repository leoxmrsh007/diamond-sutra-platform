#!/bin/bash

echo "🔍 检查所有 Node 进程..."
ps aux | grep -E "node|next" | grep -v grep

echo ""
echo "🛑️ 停止所有 Node 进程..."
taskkill /F /IM node.exe 2>/dev/null || true
taskkill /F /IM powershell.exe 2>/dev/null || true

echo ""
echo "🗑️ 删除 Next.js 锁文件..."
rm -f .next/DEV/lock
rm -f .next/BUILD/lock

echo ""
echo "🧹 清理 .next 目录..."
rm -rf .next

echo ""
echo "🚀 重新启动开发服务器..."
npm run dev
