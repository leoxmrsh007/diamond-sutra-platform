/**
 * NextAuth API 路由
 */

import NextAuth from 'next-auth';

export const dynamic = 'force-static';
export const fetchCache = 'force-cache';

// 临时禁用NextAuth以避免500错误
const handler = NextAuth({
  debug: false,
  
  providers: [],
  
  pages: {
    signIn: '/login',
    error: '/login',
  },
  
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };

export const auth = () => null;
export const handlers = { GET: handler, POST: handler };
