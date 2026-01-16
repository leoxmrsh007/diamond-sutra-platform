/**
 * 搜索页面
 */

import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Suspense } from 'react';
import { SearchContent } from './search-content';

export default function SearchPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container max-w-5xl mx-auto px-4 py-8">
        {/* Search Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">搜索</h1>
          <p className="text-muted-foreground">
            搜索经文、课程、社区讨论等内容
          </p>
        </div>

        <Suspense fallback={<div className="text-center py-12">加载中...</div>}>
          <SearchContent />
        </Suspense>
      </div>

      <Footer />
    </div>
  );
}
