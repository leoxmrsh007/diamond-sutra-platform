import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 静态导出配置
  output: 'export',

  // 图片优化配置
  images: {
    unoptimized: true,
  },

  // 路由配置
  trailingSlash: true,

  // 禁用一些在静态构建中不支持的功能
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
