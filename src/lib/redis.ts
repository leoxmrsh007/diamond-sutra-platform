/**
 * Redis 缓存工具
 * 用于缓存热门章节、AI对话历史、用户学习进度等
 */

import { Redis } from 'ioredis';

// 缓存键前缀
const CACHE_PREFIX = {
  CHAPTER: 'chapter:',
  VERSE: 'verse:',
  USER_PROGRESS: 'user:progress:',
  CHAT_HISTORY: 'chat:history:',
  COURSE: 'course:',
  SEARCH: 'search:',
  CONCEPT: 'concept:',
} as const;

// 缓存 TTL（秒）
const CACHE_TTL = {
  SHORT: 300,        // 5分钟
  MEDIUM: 1800,      // 30分钟
  LONG: 3600,        // 1小时
  VERY_LONG: 86400,  // 24小时
} as const;

let redisClient: Redis | null = null;

/**
 * 获取 Redis 客户端实例
 */
export function getRedisClient(): Redis | null {
  // 如果没有配置 Redis URL，返回 null（降级为不使用缓存）
  if (!process.env.REDIS_URL) {
    return null;
  }

  if (!redisClient) {
    try {
      redisClient = new Redis(process.env.REDIS_URL, {
        maxRetriesPerRequest: 3,
        retryStrategy: (times) => {
          if (times > 3) return null;
          return Math.min(times * 100, 3000);
        },
      });

      redisClient.on('error', (err) => {
        console.error('Redis 连接错误:', err);
      });
    } catch (error) {
      console.error('Redis 初始化失败:', error);
      return null;
    }
  }

  return redisClient;
}

/**
 * 获取缓存
 */
export async function cacheGet<T>(key: string): Promise<T | null> {
  const redis = getRedisClient();
  if (!redis) return null;

  try {
    const cached = await redis.get(key);
    if (!cached) return null;
    return JSON.parse(cached) as T;
  } catch (error) {
    console.error('缓存读取失败:', error);
    return null;
  }
}

/**
 * 设置缓存
 */
export async function cacheSet<T>(
  key: string,
  value: T,
  ttl: number = CACHE_TTL.MEDIUM
): Promise<void> {
  const redis = getRedisClient();
  if (!redis) return;

  try {
    await redis.setex(key, ttl, JSON.stringify(value));
  } catch (error) {
    console.error('缓存写入失败:', error);
  }
}

/**
 * 删除缓存
 */
export async function cacheDel(key: string): Promise<void> {
  const redis = getRedisClient();
  if (!redis) return;

  try {
    await redis.del(key);
  } catch (error) {
    console.error('缓存删除失败:', error);
  }
}

/**
 * 删除匹配模式的所有缓存
 */
export async function cacheDelPattern(pattern: string): Promise<void> {
  const redis = getRedisClient();
  if (!redis) return;

  try {
    const keys = await redis.keys(pattern);
    if (keys.length > 0) {
      await redis.del(...keys);
    }
  } catch (error) {
    console.error('批量缓存删除失败:', error);
  }
}

/**
 * 缓存章节
 */
export async function cacheChapter(chapterId: string, data: any): Promise<void> {
  await cacheSet(`${CACHE_PREFIX.CHAPTER}${chapterId}`, data, CACHE_TTL.LONG);
}

export async function getCachedChapter<T>(chapterId: string): Promise<T | null> {
  return cacheGet<T>(`${CACHE_PREFIX.CHAPTER}${chapterId}`);
}

/**
 * 缓存偈颂
 */
export async function cacheVerse(verseId: string, data: any): Promise<void> {
  await cacheSet(`${CACHE_PREFIX.VERSE}${verseId}`, data, CACHE_TTL.LONG);
}

export async function getCachedVerse<T>(verseId: string): Promise<T | null> {
  return cacheGet<T>(`${CACHE_PREFIX.VERSE}${verseId}`);
}

/**
 * 缓存用户学习进度
 */
export async function cacheUserProgress(userId: string, data: any): Promise<void> {
  await cacheSet(`${CACHE_PREFIX.USER_PROGRESS}${userId}`, data, CACHE_TTL.MEDIUM);
}

export async function getCachedUserProgress<T>(userId: string): Promise<T | null> {
  return cacheGet<T>(`${CACHE_PREFIX.USER_PROGRESS}${userId}`);
}

/**
 * 清除用户相关缓存
 */
export async function clearUserCache(userId: string): Promise<void> {
  await cacheDelPattern(`${CACHE_PREFIX.USER_PROGRESS}${userId}*`);
}

/**
 * 缓存课程
 */
export async function cacheCourse(courseId: string, data: any): Promise<void> {
  await cacheSet(`${CACHE_PREFIX.COURSE}${courseId}`, data, CACHE_TTL.LONG);
}

export async function getCachedCourse<T>(courseId: string): Promise<T | null> {
  return cacheGet<T>(`${CACHE_PREFIX.COURSE}${courseId}`);
}

/**
 * 缓存搜索结果
 */
export async function cacheSearch(query: string, data: any): Promise<void> {
  const key = `${CACHE_PREFIX.SEARCH}${Buffer.from(query).toString('base64')}`;
  await cacheSet(key, data, CACHE_TTL.SHORT);
}

export async function getCachedSearch<T>(query: string): Promise<T | null> {
  const key = `${CACHE_PREFIX.SEARCH}${Buffer.from(query).toString('base64')}`;
  return cacheGet<T>(key);
}

/**
 * 缓存概念
 */
export async function cacheConcept(conceptId: string, data: any): Promise<void> {
  await cacheSet(`${CACHE_PREFIX.CONCEPT}${conceptId}`, data, CACHE_TTL.VERY_LONG);
}

export async function getCachedConcept<T>(conceptId: string): Promise<T | null> {
  return cacheGet<T>(`${CACHE_PREFIX.CONCEPT}${conceptId}`);
}

/**
 * 获取或设置缓存（缓存穿透保护）
 */
export async function cacheGetOrSet<T>(
  key: string,
  fetchFn: () => Promise<T>,
  ttl: number = CACHE_TTL.MEDIUM
): Promise<T> {
  // 先尝试从缓存获取
  const cached = await cacheGet<T>(key);
  if (cached !== null) {
    return cached;
  }

  // 缓存未命中，执行获取函数
  const value = await fetchFn();

  // 写入缓存
  await cacheSet(key, value, ttl);

  return value;
}

/**
 * 批量获取缓存
 */
export async function cacheMGet<T>(keys: string[]): Promise<(T | null)[]> {
  const redis = getRedisClient();
  if (!redis) return keys.map(() => null);

  try {
    const values = await redis.mget(...keys);
    return values.map((v) => (v ? JSON.parse(v) : null));
  } catch (error) {
    console.error('批量缓存读取失败:', error);
    return keys.map(() => null);
  }
}

/**
 * 批量设置缓存
 */
export async function cacheMSet(
  items: Array<{ key: string; value: any; ttl?: number }>
): Promise<void> {
  const redis = getRedisClient();
  if (!redis) return;

  try {
    const pipeline = redis.pipeline();
    for (const item of items) {
      const ttl = item.ttl ?? CACHE_TTL.MEDIUM;
      pipeline.setex(item.key, ttl, JSON.stringify(item.value));
    }
    await pipeline.exec();
  } catch (error) {
    console.error('批量缓存写入失败:', error);
  }
}

/**
 * 原子递增（用于计数器）
 */
export async function cacheIncr(key: string): Promise<number> {
  const redis = getRedisClient();
  if (!redis) return 0;

  try {
    return await redis.incr(key);
  } catch (error) {
    console.error('缓存递增失败:', error);
    return 0;
  }
}

/**
 * 原子递减
 */
export async function cacheDecr(key: string): Promise<number> {
  const redis = getRedisClient();
  if (!redis) return 0;

  try {
    return await redis.decr(key);
  } catch (error) {
    console.error('缓存递减失败:', error);
    return 0;
  }
}

/**
 * 检查缓存是否存在
 */
export async function cacheExists(key: string): Promise<boolean> {
  const redis = getRedisClient();
  if (!redis) return false;

  try {
    const result = await redis.exists(key);
    return result === 1;
  } catch (error) {
    console.error('缓存检查失败:', error);
    return false;
  }
}

/**
 * 设置过期时间
 */
export async function cacheExpire(key: string, ttl: number): Promise<void> {
  const redis = getRedisClient();
  if (!redis) return;

  try {
    await redis.expire(key, ttl);
  } catch (error) {
    console.error('设置过期时间失败:', error);
  }
}

/**
 * 获取缓存剩余时间（秒）
 */
export async function cacheTTL(key: string): Promise<number> {
  const redis = getRedisClient();
  if (!redis) return -1;

  try {
    return await redis.ttl(key);
  } catch (error) {
    console.error('获取 TTL 失败:', error);
    return -1;
  }
}
