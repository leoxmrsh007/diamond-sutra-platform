/**
 * 六祖坛经学习页面
 */

import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import Link from 'next/link'

async function PlatformSutraPage({
  searchParams,
}: {
  searchParams: { chapter?: string }
}) {
  const sutra = await prisma.sutra.findUnique({
    where: { slug: 'platform-sutra' },
  })

  if (!sutra) {
    return (
      <div className="container mx-auto py-8 px-4 text-center">
        <h1 className="text-2xl font-bold mb-4">数据未初始化</h1>
        <p className="text-gray-600 dark:text-gray-400">
          请先运行 <code>npm run db:seed</code> 初始化六祖坛经数据
        </p>
      </div>
    )
  }

  const chapters = await prisma.chapter.findMany({
    where: { sutraId: sutra.id },
    orderBy: { chapterNum: 'asc' },
    include: {
      sections: {
        orderBy: { sectionNum: 'asc' },
      },
    },
  })

  const selectedChapter = searchParams.chapter
    ? chapters.find((c) => c.id === searchParams.chapter || c.chapterNum === Number(searchParams.chapter))
    : null

  return (
    <div className="container mx-auto py-8 px-4">
      {/* 标题区域 */}
      <div className="mb-8 text-center">
        <Badge className="mb-3" variant="secondary">禅宗经典</Badge>
        <h1 className="text-4xl font-bold mb-3">{sutra.title}</h1>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          {sutra.description}
        </p>
      </div>

      <Separator className="my-8" />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* 左侧章节列表 */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">目录</CardTitle>
              <CardDescription>共 {chapters.length} 品</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <nav className="space-y-1">
                {chapters.map((chapter) => (
                  <Link
                    key={chapter.id}
                    href={`/platform-sutra?chapter=${chapter.chapterNum}`}
                    className={`block px-4 py-3 rounded-lg transition-colors ${
                      selectedChapter?.id === chapter.id
                        ? 'bg-amber-100 dark:bg-amber-900/20 text-amber-900 dark:text-amber-100'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    <div className="font-medium text-sm">
                      第{chapter.chapterNum}品 {chapter.title}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {chapter.sections.length} 个段落
                    </div>
                  </Link>
                ))}
              </nav>
            </CardContent>
          </Card>
        </div>

        {/* 右侧内容区域 */}
        <div className="lg:col-span-3">
          {!selectedChapter ? (
            // 默认显示经书简介
            <Card>
              <CardHeader>
                <CardTitle>关于本经</CardTitle>
              </CardHeader>
              <CardContent className="prose dark:prose-invert max-w-none">
                <p>
                  《六祖大师法宝坛经》，简称《坛经》，是中国禅宗第六代祖师惠能的言行录，
                  是中国人撰写的唯一被称为"经"的佛教典籍。
                </p>
                <h3>核心思想</h3>
                <ul>
                  <li><strong>菩提自性</strong>：人人本有佛性，自性本来清净</li>
                  <li><strong>顿悟法门</strong>：直指人心，顿悟成佛</li>
                  <li><strong>无念为宗</strong>：于念而无念，不执著于任何念头</li>
                  <li><strong>定慧一体</strong>：定与慧不是二法，而是一体的两个方面</li>
                </ul>
                <h3>特色</h3>
                <p>
                  《坛经》以简洁直白的语言，讲述深奥的禅理，强调"见性成佛"，
                  认为每个人都有成佛的可能性，只需认识自性即可。全书分为十品，
                  记录了惠能大师的生平、说法、问答机锋等内容。
                </p>
                <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg border border-amber-200 dark:border-amber-800">
                  <p className="text-sm text-amber-900 dark:text-amber-100 mb-2 font-medium">
                    💡 点击左侧目录选择要学习的品
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            // 显示选中章节的内容
            <div className="space-y-6">
              <div>
                <Badge variant="outline" className="mb-2">
                  第{selectedChapter.chapterNum}品
                </Badge>
                <h2 className="text-3xl font-bold mb-2">{selectedChapter.title}</h2>
                {selectedChapter.summary && (
                  <p className="text-gray-600 dark:text-gray-400">
                    {selectedChapter.summary}
                  </p>
                )}
              </div>

              <Separator />

              <div className="space-y-8">
                {selectedChapter.sections.map((section) => (
                  <div
                    key={section.id}
                    id={`section-${section.sectionNum}`}
                    className="scroll-mt-8"
                  >
                    {section.heading && (
                      <div className="flex items-center gap-3 mb-4">
                        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 text-sm font-medium">
                          {section.sectionNum}
                        </span>
                        <h3 className="text-lg font-semibold">{section.heading}</h3>
                      </div>
                    )}
                    <div className="prose dark:prose-invert max-w-none">
                      <p className="text-lg leading-relaxed whitespace-pre-line">
                        {section.content}
                      </p>
                      {section.modern && (
                        <>
                          <Separator className="my-4" />
                          <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
                            <p className="text-sm text-gray-700 dark:text-gray-300 mb-1 font-medium">
                              白话解说
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-line">
                              {section.modern}
                            </p>
                          </div>
                        </>
                      )}
                      {section.notes && (
                        <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                          注：{section.notes}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 底部导航 */}
      {selectedChapter && (
        <div className="mt-12 flex justify-between">
          {selectedChapter.chapterNum > 1 && (
            <Link
              href={`/platform-sutra?chapter=${selectedChapter.chapterNum - 1}`}
              className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              ← 上一品
            </Link>
          )}
          {selectedChapter.chapterNum < chapters.length && (
            <Link
              href={`/platform-sutra?chapter=${selectedChapter.chapterNum + 1}`}
              className="ml-auto flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              下一品 →
            </Link>
          )}
        </div>
      )}
    </div>
  )
}

export default PlatformSutraPage
