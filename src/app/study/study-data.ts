/**
 * 经文学习页面数据获取
 * 直接从JSON文件导入，实现零延迟加载
 */

import studyDataJson from './study-data.json';

export interface Verse {
  id: string;
  chapterId: string;
  verseNum: number;
  chinese: string;
  english: string | null;
  sanskrit: string | null;
  aiKeyword: unknown;
}

export interface Chapter {
  id: string;
  chapterNum: number;
  title: string;
  summary: string | null;
  imageUrl: string | null;
  verses: Verse[];
}

export async function getStudyData() {
  // 直接返回JSON数据，零数据库查询
  return studyDataJson as { chapters: Chapter[] };
}
