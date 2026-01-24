#!/usr/bin/env node
/**
 * 构建静态版本用于国内部署
 * 使用方式: node scripts/build-static.js
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('🔨 开始构建静态版本...\n');

const nextConfigPath = path.join(__dirname, '../next.config.ts');
const nextConfigBackupPath = path.join(__dirname, '../next.config.backup');

// 备份原配置
if (fs.existsSync(nextConfigPath)) {
  fs.copyFileSync(nextConfigPath, nextConfigBackupPath);
}
console.log('✅ 备份原配置');

// 创建静态配置
const staticConfig = `import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
`;
fs.writeFileSync(nextConfigPath, staticConfig);
console.log('✅ 切换到静态配置');

// 修复 API 路由的静态导出问题
// 在每个 API 路由中添加 dynamic = "force-static"
const apiDir = path.join(__dirname, '../src/app/api');
if (fs.existsSync(apiDir)) {
  const fixApiRoutes = (dir) => {
    const files = fs.readdirSync(dir, { withFileTypes: true });
    for (const file of files) {
      const fullPath = path.join(dir, file.name);
      if (file.isDirectory()) {
        fixApiRoutes(fullPath);
      } else if (file.name === 'route.ts') {
        let content = fs.readFileSync(fullPath, 'utf-8');
        if (!content.includes('export const dynamic')) {
          // 在文件顶部添加 dynamic 配置
          content = content.replace(
            /^(import .+;)/m,
            "$1\n\nexport const dynamic = 'force-static';\nexport const fetchCache = 'force-cache';"
          );
          fs.writeFileSync(fullPath, content);
        }
      }
    }
  };
  fixApiRoutes(apiDir);
  console.log('✅ 修复 API 路由静态导出配置');
}

// 构建项目
console.log('\n📦 构建中...');
try {
  execSync('npm run build', {
    stdio: 'inherit',
    cwd: path.join(__dirname, '..'),
  });
  console.log('\n✅ 构建成功！');
} catch (error) {
  console.error('\n❌ 构建失败:', error.message);
  // 恢复原配置
  if (fs.existsSync(nextConfigBackupPath)) {
    fs.copyFileSync(nextConfigBackupPath, nextConfigPath);
    fs.unlinkSync(nextConfigBackupPath);
  }
  process.exit(1);
}

// 恢复原配置
if (fs.existsSync(nextConfigBackupPath)) {
  fs.copyFileSync(nextConfigBackupPath, nextConfigPath);
  fs.unlinkSync(nextConfigBackupPath);
  console.log('✅ 恢复原配置');
}

console.log('\n🎉 静态版本构建完成！');
console.log('\n📁 输出目录: out/');
console.log('\n🚀 接下来可以：');
console.log('   1. 将 out/ 目录上传到静态托管服务');
console.log('   2. API 需要单独部署到函数计算');
console.log('   3. 配置 API_BASE_URL 环境变量指向 API 服务');
console.log('   4. 配置自定义域名');
