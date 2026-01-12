/**
 * API 响应类型定义
 */

// ==================== 通用类型 ====================

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

// ==================== 认证相关 ====================

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

export interface AuthResponse {
  user: User;
  token?: string;
}

export interface User {
  id: string;
  email: string;
  emailVerified?: Date;
  name?: string;
  image?: string;
  role: 'ADMIN' | 'TEACHER' | 'STUDENT';
  createdAt: Date;
  updatedAt: Date;
}

// ==================== 学习进度相关 ====================

export interface StudyProgress {
  id: string;
  verseId: string;
  status: 'NOT_STARTED' | 'LEARNING' | 'MEMORIZED' | 'MASTERED';
  recitationCount: number;
  lastStudiedAt?: Date;
  verse?: Verse;
}

export interface Verse {
  id: string;
  chapterId: string;
  verseNum: number;
  chinese: string;
  sanskrit?: string;
  tibetan?: string;
  pinyin?: string;
  aiKeyword?: string[];
  aiAnalysis?: any;
  chapter?: {
    id: string;
    title: string;
    chapterNum: number;
  };
}

export interface Chapter {
  id: string;
  sutraId: string;
  chapterNum: number;
  title: string;
  summary?: string;
  titleSanskrit?: string;
  verses?: Verse[];
}

// ==================== 笔记相关 ====================

export interface Note {
  id: string;
  userId: string;
  verseId: string;
  verse?: Verse;
  title?: string;
  content: string;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateNoteRequest {
  verseId: string;
  title?: string;
  content: string;
  isPublic?: boolean;
}

export interface UpdateNoteRequest {
  title?: string;
  content?: string;
  isPublic?: boolean;
}

// ==================== 书签相关 ====================

export interface Bookmark {
  id: string;
  userId: string;
  verseId: string;
  note?: string;
  createdAt: Date;
  verse?: {
    chinese: string;
    chapter: {
      title: string;
    };
  };
}

// ==================== 课程相关 ====================

export interface Course {
  id: string;
  title: string;
  description: string;
  coverImage?: string;
  teacherId?: string;
  level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  duration?: number;
  isPublished: boolean;
  order: number;
  lessons?: Lesson[];
  enrollments?: CourseEnrollment[];
}

export interface Lesson {
  id: string;
  courseId: string;
  title: string;
  content: string;
  videoUrl?: string;
  audioUrl?: string;
  order: number;
}

export interface CourseEnrollment {
  id: string;
  userId: string;
  courseId: string;
  progress: number;
  completedAt?: Date;
  course?: Course;
}

// ==================== 问答相关 ====================

export interface Question {
  id: string;
  userId: string;
  title: string;
  content: string;
  aiAnswer?: string;
  aiConfidence?: number;
  isResolved: boolean;
  createdAt: Date;
  updatedAt: Date;
  answers?: Answer[];
}

export interface Answer {
  id: string;
  questionId: string;
  userId: string;
  content: string;
  isAccepted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// ==================== 社区相关 ====================

export interface Post {
  id: string;
  userId: string;
  user?: {
    name?: string;
    image?: string;
  };
  title: string;
  content: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  comments?: Comment[];
  likes?: number;
}

export interface Comment {
  id: string;
  userId: string;
  postId?: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

// ==================== AI 相关 ====================

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: Date;
}

export interface ChatRequest {
  message: string;
  history?: ChatMessage[];
  stream?: boolean;
}

export interface ChatResponse {
  message: string;
  timestamp: string;
}

export interface VerseAnalysis {
  summary: string;
  keyConcepts: string[];
  sanskritAnalysis?: string;
  practicalAdvice: string;
  relatedVerses: number[];
}

// ==================== 签到相关 ====================

export interface CheckInRecord {
  id: string;
  userId: string;
  checkInDate: string;
  consecutiveDays: number;
  createdAt: Date;
}

export interface CheckInResponse {
  success: boolean;
  message: string;
  consecutiveDays: number;
  reward?: {
    type: 'exp' | 'badge' | 'title';
    amount: number;
    message: string;
  };
}

export interface CheckInStats {
  checkedDays: number[];
  consecutiveDays: number;
  totalDays: number;
  lastCheckIn?: Date;
}

// ==================== 成就相关 ====================

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  requirement: {
    type: 'consecutive_days' | 'total_days' | 'verses_learned' | 'notes_created';
    value: number;
  };
  reward?: {
    type: 'exp' | 'badge' | 'title';
    amount: number;
  };
}

export interface UserAchievement {
  id: string;
  userId: string;
  achievementId: string;
  earnedAt: Date;
  achievement?: Achievement;
}
