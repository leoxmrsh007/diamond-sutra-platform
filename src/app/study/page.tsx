/**
 * 经文学习页面 - 服务端容器
 * 在服务端并行获取所有数据，避免客户端API请求
 */

import { StudyPageClient } from './study-client';
import { getStudyData } from './study-data';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

export default async function StudyPage() {
  // 在服务端并行获取所有数据
  const data = await getStudyData();

  return <StudyPageClient initialData={data} />;
}
