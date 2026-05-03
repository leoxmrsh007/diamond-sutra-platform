#!/bin/bash

echo "🔍 检查并停止所有 Node 进程..."
taskkill /F /IM node.exe 2>/dev/null || true

echo ""
echo "🗑️  清理缓存..."
rm -rf .next

echo ""
echo "🚀 启动开发服务器..."
npm run dev
