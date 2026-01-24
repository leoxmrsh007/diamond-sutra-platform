/**
 * 数据库全量初始化与修复 API
 * 用于在生产环境中一键创建所有表并填充种子数据
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

const CREATE_TABLES_SQL = `
-- 基础表
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  name TEXT,
  email TEXT UNIQUE,
  "emailVerified" TIMESTAMP,
  image TEXT,
  password TEXT,
  role TEXT DEFAULT 'STUDENT',
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS sutras (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  "titleSanskrit" TEXT,
  "titleTibetan" TEXT,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  "order" INTEGER DEFAULT 0,
  metadata JSONB,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS chapters (
  id TEXT PRIMARY KEY,
  "sutraId" TEXT NOT NULL REFERENCES sutras(id) ON DELETE CASCADE,
  "chapterNum" INTEGER NOT NULL,
  title TEXT NOT NULL,
  "titleSanskrit" TEXT,
  summary TEXT,
  "order" INTEGER DEFAULT 0,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE("sutraId", "chapterNum")
);

CREATE TABLE IF NOT EXISTS verses (
  id TEXT PRIMARY KEY,
  "chapterId" TEXT NOT NULL REFERENCES chapters(id) ON DELETE CASCADE,
  "verseNum" INTEGER NOT NULL,
  sanskrit TEXT,
  tibetan TEXT,
  chinese TEXT NOT NULL,
  english TEXT,
  "aiAnalysis" JSONB,
  "aiKeyword" JSONB NOT NULL DEFAULT '{}',
  embedding JSONB,
  "order" INTEGER DEFAULT 0,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE("chapterId", "verseNum")
);

-- 版本对照与注释
CREATE TABLE IF NOT EXISTS sutra_versions (
  id TEXT PRIMARY KEY,
  "verseId" TEXT NOT NULL REFERENCES verses(id) ON DELETE CASCADE,
  "versionType" TEXT NOT NULL,
  "versionName" TEXT NOT NULL,
  language TEXT NOT NULL,
  content TEXT NOT NULL,
  translator TEXT,
  year TEXT,
  notes TEXT,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE("verseId", "versionType")
);

CREATE TABLE IF NOT EXISTS commentaries (
  id TEXT PRIMARY KEY,
  "verseId" TEXT NOT NULL REFERENCES verses(id) ON DELETE CASCADE,
  author TEXT NOT NULL,
  source TEXT,
  language TEXT NOT NULL DEFAULT 'zh',
  content TEXT NOT NULL,
  "order" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 其他辅助表
CREATE TABLE IF NOT EXISTS concepts (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  "nameSanskrit" TEXT,
  "nameTibetan" TEXT,
  description TEXT,
  embedding JSONB,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS courses (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  "coverImage" TEXT,
  "teacherId" TEXT,
  level TEXT DEFAULT 'BEGINNER',
  duration INTEGER,
  "isPublished" BOOLEAN DEFAULT false,
  "order" INTEGER DEFAULT 0,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS lessons (
  id TEXT PRIMARY KEY,
  "courseId" TEXT NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  "videoUrl" TEXT,
  "audioUrl" TEXT,
  "order" INTEGER DEFAULT 0,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS course_enrollments (
  id TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  "courseId" TEXT NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  progress REAL DEFAULT 0,
  "lessonProgress" JSONB DEFAULT '{}',
  "completedAt" TIMESTAMP,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE("userId", "courseId")
);

CREATE TABLE IF NOT EXISTS study_progress (
  id TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  "verseId" TEXT NOT NULL REFERENCES verses(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'NOT_STARTED',
  "recitationCount" INTEGER DEFAULT 0,
  "lastStudiedAt" TIMESTAMP,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE("userId", "verseId")
);

CREATE TABLE IF NOT EXISTS notes (
  id TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  "verseId" TEXT NOT NULL REFERENCES verses(id) ON DELETE CASCADE,
  title TEXT,
  content TEXT NOT NULL,
  "isPublic" BOOLEAN DEFAULT false,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS bookmarks (
  id TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  "verseId" TEXT NOT NULL,
  note TEXT,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE("userId", "verseId")
);

CREATE TABLE IF NOT EXISTS check_ins (
  id TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  "checkInDate" TIMESTAMP DEFAULT NOW(),
  "consecutiveDays" INTEGER DEFAULT 1,
  "rewardPoints" INTEGER DEFAULT 10,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE("userId", "checkInDate")
);

CREATE TABLE IF NOT EXISTS posts (
  id TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  tags JSONB NOT NULL DEFAULT '{}',
  "likeCount" INTEGER DEFAULT 0,
  "commentCount" INTEGER DEFAULT 0,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS comments (
  id TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  "postId" TEXT REFERENCES posts(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS chat_sessions (
  id TEXT PRIMARY KEY,
  "userId" TEXT,
  title TEXT,
  model TEXT DEFAULT 'gemini-2.0-flash-exp',
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS chat_messages (
  id TEXT PRIMARY KEY,
  "sessionId" TEXT NOT NULL REFERENCES chat_sessions(id) ON DELETE CASCADE,
  role TEXT NOT NULL,
  content TEXT NOT NULL,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
`;

export async function GET(request: NextRequest) {
  try {
    console.log('开始执行数据库初始化与修复...');

    // 1. 执行 SQL 创建表
    const sqlStatements = CREATE_TABLES_SQL.split(';').filter(s => s.trim());
    for (const statement of sqlStatements) {
      if (statement.trim()) {
        try {
          await prisma.$executeRawUnsafe(statement);
        } catch (e) {
          // 忽略已存在的表错误
          console.warn('执行 SQL 语句警告 (可能表已存在):', (e as Error).message);
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: '数据库表结构检查/创建完成。请继续访问 /api/seed/all 以填充数据。',
      tables: [
        'users', 'sutras', 'chapters', 'verses', 'sutra_versions', 
        'commentaries', 'concepts', 'courses', 'lessons', 
        'course_enrollments', 'study_progress', 'notes', 
        'bookmarks', 'check_ins', 'posts', 'comments', 
        'chat_sessions', 'chat_messages'
      ]
    });
  } catch (error) {
    console.error('设置数据库错误:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: '数据库修复失败', 
        details: (error as Error).message 
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  return GET(request);
}
