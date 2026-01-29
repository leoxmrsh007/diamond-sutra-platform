/** @type {import('next').NextConfig } */
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  swcMinify: true,

  // 优化图片优化
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.example.com',
        pathname: '/images/**',
      },
    ],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
  },

  // CDN 配置
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
          {
            key: 'CDN-Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/images/**',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/static/**',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },

  // 优化构建输出
  compress: true,

  // 实验性功能
  logging: {
    fetches: {
      fullUrl: true,
    },
  },

  // 环境变量支持
  env: {
    CDN_URL: process.env.CDN_URL,
  },

  // 输出配置
  output: 'standalone',
  
  // 性能优化
  experimental: {
    // 启用 Turbopack（已在开发中使用）
    optimizePackageImports: true,
    optimizeCss: true,
    optimizeServerReact: true,
  },
};

export default nextConfig;
