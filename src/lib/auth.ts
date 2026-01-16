/**
 * 导出 NextAuth 配置和函数
 */

export { auth, handlers } from '@/app/api/auth/[...nextauth]/route';

// 客户端使用的 signIn 和 signOut 从 next-auth/react 导入
export { signIn, signOut } from 'next-auth/react';
