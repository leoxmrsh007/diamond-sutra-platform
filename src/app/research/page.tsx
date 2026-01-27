/**
 * 深度研究页面
 * 提供《金刚经》的学术研究工具和资源
 */

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  BookOpen,
  FileText,
  Languages,
  Search,
  BookMarked,
  Users,
  Library,
  Globe,
  History,
  BarChart,
  Download,
  Share2,
  Loader2,
  AlertCircle,
} from 'lucide-react';

interface VersionData {
  versionType: string;
  versionName: string;
  language: string;
  translator?: string;
  year?: string;
}

interface CommentaryData {
  author: string;
  source?: string;
  language: string;
  content: string;
  order: number;
}

interface VerseWithVersions {
  chapterNum: number;
  chapterTitle: string;
  verseNum: number;
  versions: Array<{
    id: string;
    versionType: string;
    versionName: string;
    language: string;
    content: string;
    translator?: string;
    year?: string;
    notes?: string;
  }>;
}

interface VerseWithCommentaries {
  chapterNum: number;
  chapterTitle: string;
  verseNum: number;
  commentaries: CommentaryData[];
}

interface ResearchStats {
  summary: {
    versions: number;
    commentaries: number;
    concepts: number;
    chapters: number;
    verses: number;
  };
  versions: {
    available: VersionData[];
    byType: Array<{
      versionType: string;
      versionName: string;
      _count: { id: number };
    }>;
    recent: Array<{
      id: string;
      versionType: string;
      versionName: string;
      chapterNum: number;
      verseNum: number;
      contentPreview: string;
    }>;
  };
  commentaries: {
    availableAuthors: Array<{ author: string; source?: string }>;
    byAuthor: Array<{
      author: string;
      _count: { id: number };
    }>;
    recent: Array<{
      id: string;
      author: string;
      source?: string;
      chapterNum: number;
      verseNum: number;
      contentPreview: string;
    }>;
  };
  tools: {
    versionComparison: boolean;
    commentaryBrowser: boolean;
    conceptExplorer: boolean;
    searchAvailable: boolean;
    exportAvailable: boolean;
  };
}

export default function ResearchPage() {
  const [activeTab, setActiveTab] = useState('versions');
  const [researchStats, setResearchStats] = useState<ResearchStats | null>(null);
  const [versionData, setVersionData] = useState<VerseWithVersions[]>([]);
  const [commentaryData, setCommentaryData] = useState<VerseWithCommentaries[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showVersionComparison, setShowVersionComparison] = useState(false);
  const [selectedChapter, setSelectedChapter] = useState<number>(1);

  useEffect(() => {
    async function fetchResearchData() {
      try {
        setIsLoading(true);
        setError(null);

        // 只加载基础统计数据，不加载详细数据
        const statsRes = await fetch('/api/research-simple');

        if (!statsRes.ok) {
          throw new Error('获取研究数据失败');
        }

        const stats = await statsRes.json();
        setResearchStats(stats);

        // 版本对照和注释数据按需加载（点击时再加载）
        setVersionData([]);
        setCommentaryData([]);
      } catch (err) {
        console.error('获取研究数据错误:', err);
        setError(err instanceof Error ? err.message : '未知错误');
      } finally {
        setIsLoading(false);
        setIsLoadingDetails(false);
      }
    }

    fetchResearchData();
  }, []);

  // 按需加载详细版本对照数据
  const loadVersionData = async (chapter: number, currentData: typeof versionData) => {
    if (currentData.some(v => v.chapterNum === chapter)) return; // 已加载

    setIsLoadingDetails(true);
    try {
      const versionsRes = await fetch(`/api/research/versions?chapter=${chapter}&limit=10`);
      if (versionsRes.ok) {
        const versions = await versionsRes.json();
        setVersionData(prev => [...prev, ...(versions.data || [])]);
      }
    } catch (err) {
      console.error('加载版本数据失败:', err);
    } finally {
      setIsLoadingDetails(false);
    }
  };

  // 当选择章节时加载该章节的版本数据
  useEffect(() => {
    if (selectedChapter && researchStats?.tools.versionComparison) {
      loadVersionData(selectedChapter, versionData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedChapter]);

  const researchTools = [
    {
      title: '版本对照',
      description: `梵文、藏文、汉译多版本逐句对照（${researchStats?.summary.versions || 0}个版本）`,
      icon: Languages,
      color: 'bg-blue-100 text-blue-600',
      href: '#',
      action: 'version-comparison' as const,
      enabled: researchStats?.tools.versionComparison || false,
    },
    {
      title: '注释研究',
      description: `历代高僧大德注释汇集（${researchStats?.summary.commentaries || 0}条注释）`,
      icon: BookMarked,
      color: 'bg-green-100 text-green-600',
      href: '#',
      enabled: researchStats?.tools.commentaryBrowser || false,
    },
    {
      title: '学术论文',
      description: '现代佛学研究文献',
      icon: FileText,
      color: 'bg-purple-100 text-purple-600',
      href: '#',
      enabled: false,
    },
    {
      title: '词汇索引',
      description: '关键词检索与统计',
      icon: Search,
      color: 'bg-amber-100 text-amber-600',
      href: '#',
      enabled: researchStats?.tools.searchAvailable || false,
    },
    {
      title: '历史流变',
      description: '经文翻译与传播历史',
      icon: History,
      color: 'bg-red-100 text-red-600',
      href: '#',
      enabled: false,
    },
    {
      title: '统计分析',
      description: '经文用字频率与结构分析',
      icon: BarChart,
      color: 'bg-indigo-100 text-indigo-600',
      href: '#',
      enabled: false,
    },
  ];

  // 基于API数据动态生成版本信息
  const versions = (researchStats?.versions.available || []).map((version, index) => {
    const colors = [
      'border-red-300 bg-red-50',
      'border-blue-300 bg-blue-50',
      'border-green-300 bg-green-50', 
      'border-purple-300 bg-purple-50',
      'border-orange-300 bg-orange-50',
      'border-indigo-300 bg-indigo-50',
    ];
    
    const featuresMap: Record<string, string[]> = {
      'kumarajiva': ['流传最广', '语言优美', '意境深远'],
      'xuanzang': ['直译精确', '忠实原文', '学术研究'],
      'yijing': ['文质兼备', '补充罗什', '文献价值'],
      'sanskrit': ['原始文本', '学术研究', '语言分析'],
      'tibetan': ['藏文大藏经', '注疏丰富', '藏传佛教'],
      'english': ['Edward Conze', '现代翻译', '国际研究'],
    };

    const languageNames: Record<string, string> = {
      'zh': '古汉语',
      'sa': '梵语', 
      'bo': '藏语',
      'en': '英语',
    };

    return {
      name: version.versionName,
      language: languageNames[version.language] || version.language,
      features: featuresMap[version.versionType] || ['学术研究', '文献价值'],
      color: colors[index % colors.length],
      versionType: version.versionType,
      translator: version.translator,
      year: version.year,
    };
  }) || [];

  // 基于API数据动态生成注释信息
  const commentaries = (researchStats?.commentaries.availableAuthors || [])
    .slice(0, 4)
    .map((item) => {
      // 处理字符串或对象格式
      const authorName = typeof item === 'string' ? item : item?.author;
      const sourceValue = typeof item === 'string' ? undefined : item?.source;

      if (!authorName) return null;

      const authorInfo: Record<string, { work: string; dynasty: string; summary: string }> = {
      '六祖慧能': {
        work: '《金刚经口诀》',
        dynasty: '唐',
        summary: '禅宗视角的《金刚经》解读，强调顿悟',
      },
      '智者大师': {
        work: '《金刚经疏》',
        dynasty: '隋',
        summary: '天台宗教理体系下的经文阐释',
      },
      '窥基大师': {
        work: '《金刚般若经赞述》',
        dynasty: '唐',
        summary: '唯识宗对《金刚经》的注解',
      },
      '宗喀巴大师': {
        work: '《金刚经广释》',
        dynasty: '明',
        summary: '格鲁派中观见地的详细开示',
      },
    };

    const info = authorInfo[authorName] || {
      work: sourceValue || '《金刚经注疏》',
      dynasty: '历代',
      summary: '对《金刚经》的深刻阐释与解读',
    };

    return {
      author: authorName,
      work: info.work,
      dynasty: info.dynasty,
      summary: info.summary,
    };
  }).filter((c): c is NonNullable<typeof c> => c !== null);

  // 加载状态
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container max-w-7xl mx-auto px-4 py-8 flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-amber-600 mx-auto mb-4" />
            <p className="text-lg text-muted-foreground">正在加载研究数据...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // 错误状态
  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container max-w-7xl mx-auto px-4 py-8">
          <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-6 h-6 text-red-600 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-medium text-red-800">数据加载失败</h3>
                <p className="text-red-700 mt-1">{error}</p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => window.location.reload()}
                >
                  重试
                </Button>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // 无数据状态
  if (!researchStats) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container max-w-7xl mx-auto px-4 py-8 text-center">
          <p className="text-lg text-muted-foreground">暂无研究数据</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white">
              <Library className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">深度研究</h1>
              <p className="text-muted-foreground">学术研究工具与资源库</p>
            </div>
          </div>
           <p className="text-lg text-muted-foreground mt-4 max-w-3xl">
             提供《金刚般若波罗蜜经》的多版本对照、历代注释、学术论文等研究资源，
             支持学者、修行者进行深入学习和研究。
           </p>
           
           {/* 研究统计数据 */}
           {researchStats && (
             <div className="flex flex-wrap gap-3 mt-6">
               <div className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-sm">
                 <span className="font-medium">{researchStats.summary.versions}</span> 个版本
               </div>
               <div className="px-3 py-1.5 bg-green-50 text-green-700 rounded-lg text-sm">
                 <span className="font-medium">{researchStats.summary.commentaries}</span> 条注释
               </div>
               <div className="px-3 py-1.5 bg-purple-50 text-purple-700 rounded-lg text-sm">
                 <span className="font-medium">{researchStats.summary.concepts}</span> 个概念
               </div>
               <div className="px-3 py-1.5 bg-amber-50 text-amber-700 rounded-lg text-sm">
                 <span className="font-medium">{researchStats.summary.chapters}</span> 章
               </div>
               <div className="px-3 py-1.5 bg-red-50 text-red-700 rounded-lg text-sm">
                 <span className="font-medium">{researchStats.summary.verses}</span> 偈
               </div>
             </div>
           )}
        </div>

        {/* Research Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="versions" className="flex items-center gap-2">
              <Languages className="w-4 h-4" />
              版本研究
            </TabsTrigger>
            <TabsTrigger value="commentaries" className="flex items-center gap-2">
              <BookMarked className="w-4 h-4" />
              注释汇集
            </TabsTrigger>
            <TabsTrigger value="tools" className="flex items-center gap-2">
              <Search className="w-4 h-4" />
              研究工具
            </TabsTrigger>
            <TabsTrigger value="resources" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              学术资源
            </TabsTrigger>
          </TabsList>

          {/* 版本研究 */}
          <TabsContent value="versions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">版本对照研究</CardTitle>
                <CardDescription>
                  《金刚经》六种主要版本的详细对照
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {versions.map((version, index) => (
                    <Card key={index} className={version.color}>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg">{version.name}</CardTitle>
                        <CardDescription>{version.language}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-1 text-sm">
                          {version.features.map((feature, i) => (
                            <li key={i} className="flex items-start">
                              <span className="mr-2">•</span>
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                      <CardFooter>
                        <Button variant="outline" size="sm" className="w-full" onClick={() => {
                          setSelectedChapter(parseInt(version.versionType === 'kumarajiva' ? '1' : '1'));
                          setShowVersionComparison(true);
                        }}>
                          查看对照
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                 </div>
               </CardContent>
             </Card>

             {/* 实际版本对照数据 */}
             {versionData.length > 0 && (
               <Card>
                 <CardHeader>
                   <CardTitle className="text-xl">实际版本对照示例</CardTitle>
                   <CardDescription>
                     数据库中的实际版本对照数据（共 {researchStats.summary.versions} 个版本记录）
                   </CardDescription>
                 </CardHeader>
                 <CardContent>
                   <div className="space-y-6">
                     {versionData.slice(0, 3).map((verse, index) => (
                       <div key={index} className="border rounded-lg p-4">
                         <div className="mb-3">
                           <Badge variant="outline" className="mr-2">
                             第{verse.chapterNum}章
                           </Badge>
                           <Badge variant="outline">
                             第{verse.verseNum}偈
                           </Badge>
                           <span className="text-sm text-muted-foreground ml-2">
                             {verse.chapterTitle}
                           </span>
                         </div>
                         <div className="space-y-3">
                           {verse.versions.map((version, vIndex) => (
                             <div key={vIndex} className="border-l-4 border-l-blue-500 pl-3 py-2">
                               <div className="flex justify-between items-start">
                                 <div>
                                   <span className="font-medium">{version.versionName}</span>
                                   <span className="text-sm text-muted-foreground ml-2">
                                     {version.translator} ({version.year})
                                   </span>
                                 </div>
                                 <Badge variant="secondary">{version.language}</Badge>
                               </div>
                               <p className="text-sm mt-1">{version.content}</p>
                             </div>
                           ))}
                         </div>
                       </div>
                     ))}
                   </div>
                   {versionData.length > 3 && (
                     <div className="mt-4 text-center">
                       <Button variant="outline" onClick={() => setShowVersionComparison(true)}>
                         在此页面查看完整版本对照
                       </Button>
                     </div>
                   )}
                 </CardContent>
               </Card>
             )}

              <div className="grid md:grid-cols-2 gap-6">
               <Card>
                 <CardHeader>
                   <CardTitle className="text-lg">版本比较工具</CardTitle>
                   <CardDescription>并行查看多个版本</CardDescription>
                 </CardHeader>
                 <CardContent>
                   <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">选择版本:</span>
                        <div className="flex gap-2 flex-wrap">
                          {versions.slice(0, 3).map((version, index) => (
                            <Badge key={index} variant="outline">
                              {version.name?.split(' ')[0] || version.versionType}
                            </Badge>
                          ))}
                        </div>
                      </div>
                     <Button className="w-full" onClick={() => setShowVersionComparison(true)}>
                       启动版本比较
                     </Button>
                   </div>
                 </CardContent>
               </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">翻译历史</CardTitle>
                  <CardDescription>从梵文到汉译的流传过程</CardDescription>
                </CardHeader>
                 <CardContent>
                   <div className="space-y-3">
                     {versions
                       .filter(v => v.year && !isNaN(parseInt(v.year)))
                       .sort((a, b) => parseInt(a.year || '0') - parseInt(b.year || '0'))
                       .map((version, index, arr) => (
                         <div key={index} className="flex items-center justify-between text-sm">
                           <span>{version.translator || version.name?.split(' ')[0] || version.versionType} ({version.year}年)</span>
                           {index < arr.length - 1 && (
                             <span className="text-muted-foreground">→</span>
                           )}
                         </div>
                       ))}
                     {versions.length === 0 && (
                       <div className="text-sm text-muted-foreground">暂无翻译历史数据</div>
                     )}
                   </div>
                 </CardContent>
              </Card>

              {/* 内联版本对照 */}
              {showVersionComparison && (
                <Card className="border-2 border-blue-200">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-xl">版本对照</CardTitle>
                        <CardDescription>查看不同译本的差异</CardDescription>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => setShowVersionComparison(false)}>
                        关闭
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* 章节选择 */}
                      <div>
                        <label className="text-sm font-medium mb-2 block">选择章节</label>
                        <select
                          value={selectedChapter}
                          onChange={(e) => setSelectedChapter(parseInt(e.target.value))}
                          className="w-full max-w-xs px-3 py-2 border rounded-md"
                        >
                          {Array.from({ length: 32 }, (_, i) => (
                            <option key={i + 1} value={i + 1}>
                              第{i + 1}章
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* 版本对照内容 */}
                      {isLoadingDetails ? (
                        <div className="flex items-center justify-center py-8">
                          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                          <span className="ml-2 text-muted-foreground">加载版本对照数据...</span>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {versionData
                            .filter(v => v.chapterNum === selectedChapter)
                            .slice(0, 5)
                            .map((verse, index) => (
                              <div key={index} className="border rounded-lg p-4">
                                <div className="mb-3">
                                  <Badge variant="outline" className="mr-2">
                                    第{verse.verseNum}偈
                                  </Badge>
                                  <span className="text-sm text-muted-foreground">
                                    {verse.chapterTitle}
                                  </span>
                                </div>
                                <div className="space-y-3">
                                  {verse.versions.map((version, vIndex) => {
                                    const versionColors: Record<string, string> = {
                                      kumarajiva: 'border-red-400 bg-red-50',
                                      xuanzang: 'border-blue-400 bg-blue-50',
                                      yijing: 'border-green-400 bg-green-50',
                                      sanskrit: 'border-purple-400 bg-purple-50',
                                      tibetan: 'border-orange-400 bg-orange-50',
                                      english: 'border-indigo-400 bg-indigo-50',
                                      damoduojiduo: 'border-pink-400 bg-pink-50',
                                      yijing_revised: 'border-teal-400 bg-teal-50',
                                      dingfubao: 'border-cyan-400 bg-cyan-50',
                                      conze: 'border-violet-400 bg-violet-50',
                                      redpine: 'border-rose-400 bg-rose-50',
                                      sangharakshita: 'border-amber-400 bg-amber-50',
                                    };
                                    return (
                                      <div
                                        key={vIndex}
                                        className={`border-l-4 pl-3 py-2 ${versionColors[version.versionType] || 'border-gray-400'}`}
                                      >
                                        <div className="flex justify-between items-start">
                                          <div>
                                            <span className="font-medium">{version.versionName}</span>
                                            {version.translator && (
                                              <span className="text-sm text-muted-foreground ml-2">
                                                {version.translator}
                                              </span>
                                            )}
                                          </div>
                                          <Badge variant="secondary">{version.language}</Badge>
                                        </div>
                                        <p className="text-sm mt-2">{version.content}</p>
                                        {version.notes && (
                                          <p className="text-xs text-muted-foreground mt-1 italic">
                                            注：{version.notes}
                                          </p>
                                        )}
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            ))}
                          {versionData.filter(v => v.chapterNum === selectedChapter).length === 0 && (
                            <div className="text-center py-8 text-muted-foreground">
                              暂无该章节的版本对照数据
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

             </div>
           </TabsContent>

          {/* 注释汇集 */}
          <TabsContent value="commentaries" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">历代注释</CardTitle>
                <CardDescription>
                  从南北朝到现代的《金刚经》注释文献
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {commentaries.map((commentary, index) => (
                    <Card key={index} className="border-l-4 border-l-blue-500">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle className="text-lg">
                              {commentary.author} · {commentary.work}
                            </CardTitle>
                            <CardDescription>{commentary.dynasty}代</CardDescription>
                          </div>
                          <Badge variant="secondary">{commentary.author?.split(' ')[0] || '禅'}宗</Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">
                          {commentary.summary}
                        </p>
                      </CardContent>
                      <CardFooter>
                        <div className="flex gap-2 w-full">
                          <Button variant="outline" size="sm">
                            <BookOpen className="w-4 h-4 mr-2" />
                            在线阅读
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Download className="w-4 h-4 mr-2" />
                            下载PDF
                          </Button>
                        </div>
                      </CardFooter>
                    </Card>
                  ))}
                 </div>
               </CardContent>
             </Card>

             {/* 实际注释数据 */}
             {commentaryData.length > 0 && (
               <Card>
                 <CardHeader>
                   <CardTitle className="text-xl">实际注释示例</CardTitle>
                   <CardDescription>
                     数据库中的实际注释数据（共 {researchStats.summary.commentaries} 条注释）
                   </CardDescription>
                 </CardHeader>
                 <CardContent>
                   <div className="space-y-6">
                     {commentaryData.slice(0, 3).map((verse, index) => (
                       <div key={index} className="border rounded-lg p-4">
                         <div className="mb-3">
                           <Badge variant="outline" className="mr-2">
                             第{verse.chapterNum}章
                           </Badge>
                           <Badge variant="outline">
                             第{verse.verseNum}偈
                           </Badge>
                           <span className="text-sm text-muted-foreground ml-2">
                             {verse.chapterTitle}
                           </span>
                         </div>
                         <div className="space-y-3">
                           {verse.commentaries.slice(0, 2).map((commentary, cIndex) => (
                             <div key={cIndex} className="border-l-4 border-l-green-500 pl-3 py-2">
                               <div className="flex justify-between items-start">
                                 <div>
                                   <span className="font-medium">{commentary.author}</span>
                                   {commentary.source && (
                                     <span className="text-sm text-muted-foreground ml-2">
                                       {commentary.source}
                                     </span>
                                   )}
                                 </div>
                                 <Badge variant="secondary">{commentary.language}</Badge>
                               </div>
                               <p className="text-sm mt-1 line-clamp-2">{commentary.content}</p>
                             </div>
                           ))}
                         </div>
                       </div>
                     ))}
                   </div>
                   {commentaryData.length > 3 && (
                     <div className="mt-4 text-center">
                       <Button variant="outline" onClick={() => setActiveTab('commentaries')}>
                         查看更多注释
                       </Button>
                     </div>
                   )}
                 </CardContent>
               </Card>
             )}
           </TabsContent>

           {/* 研究工具 */}
          <TabsContent value="tools" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">研究工具</CardTitle>
                <CardDescription>
                  专为《金刚经》研究设计的数字化工具
                </CardDescription>
              </CardHeader>
              <CardContent>
                 <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                   {researchTools.map((tool, index) => (
                     <Card 
                       key={index} 
                       className={`hover:shadow-lg transition-shadow ${!tool.enabled ? 'opacity-60' : ''}`}
                     >
                       <CardHeader>
                         <div className={`w-12 h-12 rounded-lg ${tool.color} flex items-center justify-center mb-4`}>
                           <tool.icon className="w-6 h-6" />
                         </div>
                         <CardTitle>{tool.title}</CardTitle>
                         <CardDescription>{tool.description}</CardDescription>
                         {!tool.enabled && (
                           <Badge variant="outline" className="mt-2 w-fit">开发中</Badge>
                         )}
                       </CardHeader>
                       <CardFooter>
                         <Button
                           variant="outline"
                           size="sm"
                           className="w-full"
                           disabled={!tool.enabled}
                           onClick={() => {
                             if (tool.action === 'version-comparison') {
                               setActiveTab('versions');
                               setShowVersionComparison(true);
                             }
                           }}
                         >
                           {tool.enabled ? '使用工具' : '即将推出'}
                         </Button>
                       </CardFooter>
                     </Card>
                   ))}
                 </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 学术资源 */}
          <TabsContent value="resources" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">学术资源库</CardTitle>
                <CardDescription>
                  现代佛学研究论文与数字资源
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                    <div>
                      <h3 className="font-medium">《金刚经》研究论文合集</h3>
                      <p className="text-sm text-muted-foreground">收录1980-2023年核心期刊论文</p>
                    </div>
                    <Badge>PDF · 2.3GB</Badge>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                    <div>
                      <h3 className="font-medium">梵文《金刚经》数字化校勘本</h3>
                      <p className="text-sm text-muted-foreground">基于多个写本的校勘成果</p>
                    </div>
                    <Badge variant="outline">XML/TEI格式</Badge>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                    <div>
                      <h3 className="font-medium">《金刚经》注疏数据库</h3>
                      <p className="text-sm text-muted-foreground">历代注释全文检索</p>
                    </div>
                    <Badge variant="secondary">在线访问</Badge>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex gap-2">
                <Button variant="outline">
                  <Globe className="w-4 h-4 mr-2" />
                  访问外部资源
                </Button>
                <Button>
                  <Users className="w-4 h-4 mr-2" />
                  加入研究社群
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Quick Links */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">快速开始</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="border-2 border-blue-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Languages className="w-5 h-5 text-blue-600" />
                  版本对照
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  比较不同译本的差异，理解翻译选择
                </p>
                <Button className="w-full" onClick={() => {
                  setActiveTab('versions');
                  setShowVersionComparison(true);
                }}>
                  开始对照
                </Button>
              </CardContent>
            </Card>

            <Card className="border-2 border-green-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="w-5 h-5 text-green-600" />
                  关键词检索
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  搜索经文中的关键词，查看出现位置
                </p>
                <Button className="w-full" asChild>
                  <Link href="/search">搜索关键词</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="border-2 border-purple-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-purple-600" />
                  学习课程
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  系统学习《金刚经》的课程体系
                </p>
                <Button className="w-full" asChild>
                  <Link href="/courses">查看课程</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}