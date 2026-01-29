#!/bin/bash

echo "🔍 检查编译错误..."
npm run build 2>&1 | grep -i "error\|warning" | head -20

echo ""
echo "🚀 启动开发服务器..."
npm run dev
