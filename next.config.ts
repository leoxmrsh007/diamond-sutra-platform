import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: 'standalone', // 启用独立输出，用于 Docker 部署

  // 图片优化配置
  images: {
    unoptimized: true, // Docker 环境下禁用图片优化
  },
};

export default nextConfig;
