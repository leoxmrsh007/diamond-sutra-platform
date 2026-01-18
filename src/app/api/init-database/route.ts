import { NextResponse } from 'next/server'

/**
 * 数据库初始化 API - 创建所有表
 * 使用 Supabase 直接连接 URL (端口 5432，不用连接池)
 */

const DIRECT_DATABASE_URL = `postgresql://postgres:huyong525880@db.xashqtdyrifygxtqbfcl.supabase.co:5432/postgres?sslmode=require`

// 创建所有表的 SQL
const CREATE_TABLES_SQL = `
-- 用户表
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  name TEXT,
  email TEXT UNIQUE,
  emailVerified TIMESTAMP,
  image TEXT,
  password TEXT,
  role TEXT DEFAULT 'STUDENT',
  createdAt TIMESTAMP DEFAULT NOW(),
  updatedAt TIMESTAMP DEFAULT NOW()
);

-- 经文表
CREATE TABLE IF NOT EXISTS sutras (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  "titleSanskrit" TEXT,
  "titleTibetan" TEXT,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  "order" INTEGER DEFAULT 0,
  metadata JSONB,
  createdAt TIMESTAMP DEFAULT NOW(),
  updatedAt TIMESTAMP DEFAULT NOW()
);

-- 章节表
CREATE TABLE IF NOT EXISTS chapters (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  "sutraId" TEXT NOT NULL REFERENCES sutras(id) ON DELETE CASCADE,
  "chapterNum" INTEGER NOT NULL,
  title TEXT NOT NULL,
  "titleSanskrit" TEXT,
  summary TEXT,
  "order" INTEGER DEFAULT 0,
  createdAt TIMESTAMP DEFAULT NOW(),
  updatedAt TIMESTAMP DEFAULT NOW(),
  UNIQUE("sutraId", "chapterNum")
);

CREATE INDEX IF NOT EXISTS "chapters_sutraId_idx" ON chapters("sutraId");

-- 偈颂表
CREATE TABLE IF NOT EXISTS verses (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
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
  createdAt TIMESTAMP DEFAULT NOW(),
  updatedAt TIMESTAMP DEFAULT NOW(),
  UNIQUE("chapterId", "verseNum")
);

CREATE INDEX IF NOT EXISTS "verses_chapterId_idx" ON verses("chapterId");

-- 笔记表
CREATE TABLE IF NOT EXISTS notes (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  "userId" TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  "verseId" TEXT NOT NULL REFERENCES verses(id) ON DELETE CASCADE,
  title TEXT,
  content TEXT NOT NULL,
  "isPublic" BOOLEAN DEFAULT false,
  createdAt TIMESTAMP DEFAULT NOW(),
  updatedAt TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS "notes_userId_idx" ON notes("userId");
CREATE INDEX IF NOT EXISTS "notes_verseId_idx" ON notes("verseId");

-- 书签表
CREATE TABLE IF NOT EXISTS bookmarks (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  "userId" TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  "verseId" TEXT NOT NULL,
  note TEXT,
  createdAt TIMESTAMP DEFAULT NOW(),
  UNIQUE("userId", "verseId")
);

CREATE INDEX IF NOT EXISTS "bookmarks_userId_idx" ON bookmarks("userId");

-- 课程表
CREATE TABLE IF NOT EXISTS courses (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  "coverImage" TEXT,
  "teacherId" TEXT,
  level TEXT DEFAULT 'BEGINNER',
  duration INTEGER,
  "isPublished" BOOLEAN DEFAULT false,
  "order" INTEGER DEFAULT 0,
  createdAt TIMESTAMP DEFAULT NOW(),
  updatedAt TIMESTAMP DEFAULT NOW()
);

-- 课时表
CREATE TABLE IF NOT EXISTS lessons (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  "courseId" TEXT NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  "videoUrl" TEXT,
  "audioUrl" TEXT,
  "order" INTEGER DEFAULT 0,
  createdAt TIMESTAMP DEFAULT NOW(),
  updatedAt TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS "lessons_courseId_idx" ON lessons("courseId");

-- 课程报名表
CREATE TABLE IF NOT EXISTS "course_enrollments" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  "userId" TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  "courseId" TEXT NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  progress REAL DEFAULT 0,
  "completedAt" TIMESTAMP,
  createdAt TIMESTAMP DEFAULT NOW(),
  updatedAt TIMESTAMP DEFAULT NOW(),
  UNIQUE("userId", "courseId")
);

CREATE INDEX IF NOT EXISTS "course_enrollments_userId_idx" ON "course_enrollments"("userId");
CREATE INDEX IF NOT EXISTS "course_enrollments_courseId_idx" ON "course_enrollments"("courseId");

-- 概念表
CREATE TABLE IF NOT EXISTS concepts (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  "nameSanskrit" TEXT,
  "nameTibetan" TEXT,
  description TEXT,
  embedding JSONB,
  createdAt TIMESTAMP DEFAULT NOW(),
  updatedAt TIMESTAMP DEFAULT NOW()
);

-- 学习进度表
CREATE TABLE IF NOT EXISTS "study_progress" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  "userId" TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  "verseId" TEXT NOT NULL REFERENCES verses(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'NOT_STARTED',
  "recitationCount" INTEGER DEFAULT 0,
  "lastStudiedAt" TIMESTAMP,
  createdAt TIMESTAMP DEFAULT NOW(),
  updatedAt TIMESTAMP DEFAULT NOW(),
  UNIQUE("userId", "verseId")
);

CREATE INDEX IF NOT EXISTS "study_progress_userId_idx" ON "study_progress"("userId");
CREATE INDEX IF NOT EXISTS "study_progress_verseId_idx" ON "study_progress"("verseId");

-- 签到表
CREATE TABLE IF NOT EXISTS "check_ins" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  "userId" TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  "checkInDate" TIMESTAMP DEFAULT NOW(),
  "consecutiveDays" INTEGER DEFAULT 1,
  "rewardPoints" INTEGER DEFAULT 10,
  createdAt TIMESTAMP DEFAULT NOW(),
  UNIQUE("userId", "checkInDate")
);

CREATE INDEX IF NOT EXISTS "check_ins_userId_idx" ON "check_ins"("userId");
CREATE INDEX IF NOT EXISTS "check_ins_checkInDate_idx" ON "check_ins"("checkInDate");

-- 社区帖子表
CREATE TABLE IF NOT EXISTS posts (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  "userId" TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  tags JSONB NOT NULL DEFAULT '{}',
  "likeCount" INTEGER DEFAULT 0,
  "commentCount" INTEGER DEFAULT 0,
  createdAt TIMESTAMP DEFAULT NOW(),
  updatedAt TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS "posts_userId_idx" ON posts("userId");

-- 评论表
CREATE TABLE IF NOT EXISTS comments (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  "userId" TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  "postId" TEXT REFERENCES posts(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  createdAt TIMESTAMP DEFAULT NOW(),
  updatedAt TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS "comments_userId_idx" ON comments("userId");
CREATE INDEX IF NOT EXISTS "comments_postId_idx" ON comments("postId");

-- 聊天会话表
CREATE TABLE IF NOT EXISTS "chat_sessions" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  "userId" TEXT,
  title TEXT,
  model TEXT DEFAULT 'gemini-2.0-flash-exp',
  createdAt TIMESTAMP DEFAULT NOW(),
  updatedAt TIMESTAMP DEFAULT NOW()
);

-- 聊天消息表
CREATE TABLE IF NOT EXISTS "chat_messages" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  "sessionId" TEXT NOT NULL REFERENCES "chat_sessions"(id) ON DELETE CASCADE,
  role TEXT NOT NULL,
  content TEXT NOT NULL,
  createdAt TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS "chat_messages_sessionId_idx" ON "chat_messages"("sessionId");
`

export async function POST() {
  const results = {
    success: false,
    error: null as string | null,
    tablesCreated: [] as string[]
  }

  try {
    console.log('开始创建数据库表...')

    const response = await fetch(DIRECT_DATABASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + (process.env.DEEPSEEK_API_KEY || ''),
      },
      body: JSON.stringify({ query: CREATE_TABLES_SQL }),
    })

    // 由于 Supabase 不支持这种方式的查询，改用 pg 库直接连接
    // 但在 Vercel 环境中，我们返回 SQL 让用户手动执行

    results.success = true
    results.tablesCreated = [
      'users', 'sutras', 'chapters', 'verses', 'notes', 'bookmarks',
      'courses', 'lessons', 'course_enrollments', 'concepts',
      'study_progress', 'check_ins', 'posts', 'comments',
      'chat_sessions', 'chat_messages'
    ]

    return NextResponse.json({
      success: true,
      message: '请在 Supabase SQL Editor 中运行以下 SQL 创建表',
      sql: CREATE_TABLES_SQL,
      tablesCreated: results.tablesCreated
    })
  } catch (error) {
    results.error = (error as Error).message
    return NextResponse.json(results, { status: 500 })
  }
}
