/**
 * 深度研究页面
 */

import Link from 'next/link';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  BookOpen,
  FileText,
  Network,
  Search,
  Download,
  ExternalLink,
  Languages,
  Bookmark,
} from 'lucide-react';

// 版本数据
const versions = [
  {
    id: 1,
    name: '鸠摩罗什译本',
    language: 'zh',
    year: '402',
    description: '流传最广的汉译本，语言优美，意境深远。鸠摩罗什精通梵汉，译文兼顾原意与文采，被誉为"译经之王"',
    features: ['文字优美', '流传最广', '禅宗常用', '艺术价值高'],
    verses: 32,
    popularity: 95,
  },
  {
    id: 2,
    name: '玄奘译本',
    language: 'zh',
    year: '660',
    description: '直译精确，忠实原文，适合学术研究。题名《能断金刚般若波罗蜜经》，在《大般若经》中为第九会',
    features: ['直译精确', '忠实原文', '学术参考', '义理严谨'],
    verses: 32,
    popularity: 70,
  },
  {
    id: 3,
    name: '义净译本',
    language: 'zh',
    year: '703',
    description: '义净法师所译，题为《佛说能断金刚般若波罗蜜多经》',
    features: ['文质兼备', '补充罗什', '文献价值'],
    verses: 32,
    popularity: 40,
  },
  {
    id: 4,
    name: '梵文原典',
    language: 'sa',
    year: '原典',
    description: 'Vajracchedikā Prajñāpāramitā Sūtra，属于般若部经典，约成书于公元前1世纪',
    features: ['原始经典', '学术研究', '梵文学习', '词源分析'],
    verses: 32,
    popularity: 60,
  },
  {
    id: 5,
    name: '藏文译本',
    language: 'bo',
    year: '9世纪',
    description: '藏译《金刚般若波罗蜜多经》，属于藏文大藏经甘珠尔部',
    features: ['藏传传承', '注疏丰富', '宗喀巴释'],
    verses: 32,
    popularity: 35,
  },
  {
    id: 6,
    name: '英译本 (Edward Conze)',
    language: 'en',
    year: '1957',
    description: '西方学界最权威的英译本，Edward Conze是般若经研究权威学者',
    features: ['学术权威', '西方主流', '英文研究'],
    verses: 32,
    popularity: 50,
  },
];

// 注释数据
const commentaries = [
  {
    id: 1,
    title: '金刚经注疏',
    author: '智者大师',
    tradition: '天台宗',
    year: '隋朝',
    description: '天台宗智者大师对《金刚经》的深入解读，以"三观三智"阐释般若空性',
    chapters: 32,
    highlights: ['空假中三观', '一念三千', '般若理境'],
  },
  {
    id: 2,
    title: '金刚经口诀',
    author: '慧能',
    tradition: '禅宗',
    year: '唐朝',
    description: '六祖慧能的《金刚经》直指人心之讲解，强调"无相无念无住"的顿悟法门',
    chapters: 32,
    highlights: ['顿悟法门', '直指人心', '见性成佛'],
  },
  {
    id: 3,
    title: '金刚经纂要刊定记',
    author: '子璇',
    tradition: '华严宗',
    year: '宋朝',
    description: '华严宗视角的《金刚经》诠释，以"理事无碍"观般若性空',
    chapters: 32,
    highlights: ['理事无碍', '重重无尽', '法界缘起'],
  },
  {
    id: 4,
    title: '金刚般若波罗蜜经论',
    author: '弥勒菩萨',
    tradition: '唯识宗',
    year: '印度',
    description: '弥勒菩萨传授的《金刚经》论释，世亲菩萨造释，从唯识角度阐释般若',
    chapters: 32,
    highlights: ['唯识义理', '种子说', '转识成智'],
  },
  {
    id: 5,
    title: '金刚经疏',
    author: '宗密',
    tradition: '华严宗',
    year: '唐朝',
    description: '华严五祖宗密所著，融合禅教，强调"禅教一致"',
    chapters: 32,
    highlights: ['禅教一致', '华严禅', '顿渐圆融'],
  },
  {
    id: 6,
    title: '金刚经宗通',
    author: '曾凤仪',
    tradition: '禅宗',
    year: '明朝',
    description: '明代居士曾凤仪所著，汇集诸家注疏，以禅宗观点贯通全书',
    chapters: 32,
    highlights: ['诸家汇通', '居士见地', '实修指引'],
  },
  {
    id: 7,
    title: '金刚经解义',
    author: '智旭',
    tradition: '净土宗',
    year: '明朝',
    description: '藕益大师智旭所著，以净土观念阐释《金刚经》，强调"般若导归净土"',
    chapters: 32,
    highlights: ['净土理念', '持名念佛', '信愿行'],
  },
  {
    id: 8,
    title: '金刚经讲解',
    author: '南怀瑾',
    tradition: '现代',
    year: '现代',
    description: '南怀瑾先生现代讲解，结合传统文化与现代生活，通俗易懂',
    chapters: 32,
    highlights: ['通俗讲解', '现代应用', '传统文化'],
  },
];

// 论文数据
const papers = [
  {
    id: 1,
    title: '《金刚经》"无住"思想的现代诠释',
    author: '张明远',
    year: 2024,
    journal: '佛学研究',
    volume: 'Vol.42',
    pages: 'pp.45-68',
    abstract: '本文探讨《金刚经》中"无住"思想的内涵及其在现代社会的应用价值。通过分析"应无所住而生其心"的经文，阐述无住思想对于现代人处理工作压力、人际关系和自我认知的指导意义。',
    keywords: ['无住', '现代诠释', '生活应用', '心理健康'],
    downloads: 1243,
    citations: 56,
  },
  {
    id: 2,
    title: '梵汉《金刚经》版本比较研究',
    author: '李文博',
    year: 2023,
    journal: '文献学研究',
    volume: 'Vol.18',
    pages: 'pp.112-145',
    abstract: '通过对梵文原典与汉译本的对照，分析鸠摩罗什、玄奘、义净等译本的特点与差异。从语言学角度考察汉译佛教经典的翻译策略和传播影响。',
    keywords: ['梵汉对照', '版本研究', '翻译学', '鸠摩罗什', '玄奘'],
    downloads: 892,
    citations: 38,
  },
  {
    id: 3,
    title: '《金刚经》与中国文学艺术',
    author: '王雅琳',
    year: 2023,
    journal: '文艺研究',
    volume: 'Vol.56',
    pages: 'pp.78-102',
    abstract: '探讨《金刚经》对中国诗歌、书法、绘画等艺术形式的影响。从唐宋诗词到文人画，分析般若思想如何渗透到中国传统文化艺术的各个层面。',
    keywords: ['文学艺术', '诗歌', '书法', '绘画', '美学'],
    downloads: 1567,
    citations: 72,
  },
  {
    id: 4,
    title: '《金刚经》在中亚的传播与接受',
    author: 'Chen, Liu',
    year: 2023,
    journal: 'Journal of Buddhist Studies',
    volume: 'Vol.28',
    pages: 'pp.234-267',
    abstract: 'This paper examines the transmission and reception of the Diamond Sutra in Central Asia, analyzing manuscript fragments discovered along the Silk Road and their role in cross-cultural Buddhist exchange.',
    keywords: ['Silk Road', 'Central Asia', 'Manuscript', 'Transmission'],
    downloads: 678,
    citations: 29,
  },
  {
    id: 5,
    title: '六祖惠能与《金刚经》的禅学诠释',
    author: '赵静怡',
    year: 2022,
    journal: '禅学研究',
    volume: 'Vol.15',
    pages: 'pp.33-59',
    abstract: '以《金刚经口诀》为中心，分析惠能如何将般若性空思想融入禅宗顿悟法门。探讨"无相无念无住"的禅学内涵及其对中国禅宗发展的影响。',
    keywords: ['惠能', '禅宗', '顿悟', '金刚经口诀'],
    downloads: 2103,
    citations: 95,
  },
  {
    id: 6,
    title: '《金刚经》的伦理思想研究',
    author: '孙建国',
    year: 2022,
    journal: '伦理学研究',
    volume: 'Vol.33',
    pages: 'pp.89-115',
    abstract: '系统梳理《金刚经》中的伦理思想，包括布施波罗蜜、忍辱波罗蜜等六度万行的伦理实践，探讨其对于现代伦理建设的启示。',
    keywords: ['伦理思想', '布施', '忍辱', '六度', '应用伦理'],
    downloads: 934,
    citations: 41,
  },
  {
    id: 7,
    title: '敦煌写本《金刚经》研究',
    author: '林晓东',
    year: 2021,
    journal: '敦煌学辑刊',
    volume: 'Vol.42',
    pages: 'pp.156-189',
    abstract: '基于敦煌莫高窟发现的《金刚经》写本，研究唐五代时期《金刚经》的流传状况、书写特征及其反映的信仰形态。',
    keywords: ['敦煌', '写本', '唐代', '信仰形态'],
    downloads: 1456,
    citations: 63,
  },
  {
    id: 8,
    title: 'The Diamond Sutra and Early Chan Buddhism',
    author: 'John McRae',
    year: 2020,
    journal: 'Eastern Buddhist',
    volume: 'Vol.45',
    pages: 'pp.45-78',
    abstract: 'An investigation of the role of the Diamond Sutra in the formation of early Chan Buddhism, focusing on its influence on the Northern School and the transition to the Southern School.',
    keywords: ['Chan Buddhism', 'Northern School', 'Southern School', 'Meditation'],
    downloads: 2341,
    citations: 127,
  },
  {
    id: 9,
    title: '《金刚经》与心理学治疗的对话',
    author: '周雨晴',
    year: 2021,
    journal: '心理学报',
    volume: 'Vol.53',
    pages: 'pp.201-223',
    abstract: '探讨《金刚经》中的"无我"观念与现代心理学认知行为治疗的契合点，提出融合佛教智慧与心理治疗的创新路径。',
    keywords: ['心理学', 'CBT', '正念', '无我', '心理治疗'],
    downloads: 1876,
    citations: 84,
  },
  {
    id: 10,
    title: '《金刚经》"四相"思想的哲学分析',
    author: '吴志强',
    year: 2020,
    journal: '哲学研究',
    volume: 'Vol.28',
    pages: 'pp.67-95',
    abstract: '从哲学角度深入分析《金刚经》中"我相、人相、众生相、寿者相"的内涵，探讨其与佛教"无我"思想的内在关联，以及对当代哲学的启示。',
    keywords: ['四相', '无我', '哲学分析', '空性'],
    downloads: 1089,
    citations: 52,
  },
];

export default function ResearchPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge className="mb-4">学术研究</Badge>
          <h1 className="text-4xl font-bold mb-4">深度研究</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            多版本对照、历代注释、学术论文，深入探索《金刚经》的丰富内涵
          </p>
        </div>

        <Tabs defaultValue="versions" className="space-y-8">
          <TabsList className="grid w-full grid-cols-5 max-w-3xl mx-auto">
            <TabsTrigger value="versions">版本对照</TabsTrigger>
            <TabsTrigger value="chapters-1-3">第1-3章对照</TabsTrigger>
            <TabsTrigger value="commentaries">历代注释</TabsTrigger>
            <TabsTrigger value="papers">学术论文</TabsTrigger>
            <TabsTrigger value="knowledge">知识图谱</TabsTrigger>
          </TabsList>

          {/* 版本对照 */}
          <TabsContent value="versions" className="space-y-6">
            <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Languages className="w-5 h-5 text-blue-600" />
                  多版本对照阅读
                </CardTitle>
                <CardDescription>
                  查看同一偈颂在不同语言和译本中的表达，深入理解经义
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Button asChild>
                    <Link href="/versions-1-3">
                      <BookOpen className="w-4 h-4 mr-2" />
                      第1-3章对照
                    </Link>
                  </Button>
                  <Button asChild>
                    <Link href="/study?mode=compare">
                      <BookOpen className="w-4 h-4 mr-2" />
                      开始对照阅读
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {versions.map((version) => (
                <Card key={version.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg">{version.name}</CardTitle>
                      <Badge variant="outline">{version.year}</Badge>
                    </div>
                    <CardDescription className="text-sm line-clamp-3">{version.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {version.features.map((f) => (
                        <Badge key={f} variant="secondary" className="text-xs">
                          {f}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
                      <span>{version.verses} 品</span>
                      <span className="flex items-center gap-1">
                        <span className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                          <span
                            className="h-full bg-blue-500 rounded-full block"
                            style={{ width: `${version.popularity}%` }}
                          />
                        </span>
                        热度 {version.popularity}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" asChild className="flex-1">
                        <Link href={`/versions/${version.id}`}>查看版本</Link>
                      </Button>
                      <Button size="sm" variant="ghost" asChild>
                        <Link href={`/compare?versions=1,${version.id}`}>
                          <Search className="w-4 h-4" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* 历代注释 */}
          <TabsContent value="commentaries" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {commentaries.map((comm) => (
                <Card key={comm.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{comm.title}</CardTitle>
                        <CardDescription className="mt-1">
                          {comm.author} · {comm.tradition}
                        </CardDescription>
                      </div>
                      <Badge variant="secondary">{comm.year}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {comm.description}
                    </p>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {comm.highlights.map((h) => (
                        <Badge key={h} variant="outline" className="text-xs">
                          {h}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        <FileText className="w-4 h-4 mr-2" />
                        阅读注释
                      </Button>
                      <Button size="sm" variant="ghost">
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
             </div>
           </TabsContent>

          {/* 第1-2-3章对照 */}
          <TabsContent value="chapters-1-3" className="space-y-6">
            <div className="bg-gradient-to-r from-amber-50 to-yellow-50 p-6 rounded-lg border border-amber-200">
              <h3 className="text-2xl font-bold mb-4 text-amber-900">第1-2-3章详细版本对照</h3>
              <p className="text-gray-700 mb-4">点击下方卡片查看各版本对比</p>
              
              <div className="grid md:grid-cols-3 gap-4 mb-6">
                <Card className="cursor-pointer hover:shadow-lg transition-shadow bg-white" onClick={() => document.getElementById('chapter-1')?.scrollIntoView({ behavior: 'smooth' })}>
                  <CardContent className="pt-6 text-center">
                    <Badge variant="outline" className="mb-2">第1分</Badge>
                    <h4 className="font-bold text-lg">法会因由分</h4>
                    <p className="text-sm text-gray-600 mt-2">2个偈颂 · 5种版本</p>
                  </CardContent>
                </Card>
                <Card className="cursor-pointer hover:shadow-lg transition-shadow bg-white" onClick={() => document.getElementById('chapter-2')?.scrollIntoView({ behavior: 'smooth' })}>
                  <CardContent className="pt-6 text-center">
                    <Badge variant="outline" className="mb-2">第2分</Badge>
                    <h4 className="font-bold text-lg">善现启请分</h4>
                    <p className="text-sm text-gray-600 mt-2">3个偈颂 · 5种版本</p>
                  </CardContent>
                </Card>
                <Card className="cursor-pointer hover:shadow-lg transition-shadow bg-white" onClick={() => document.getElementById('chapter-3')?.scrollIntoView({ behavior: 'smooth' })}>
                  <CardContent className="pt-6 text-center">
                    <Badge variant="outline" className="mb-2">第3分</Badge>
                    <h4 className="font-bold text-lg">大乘正宗分</h4>
                    <p className="text-sm text-gray-600 mt-2">2个偈颂 · 5种版本</p>
                  </CardContent>
                </Card>
              </div>

              {/* 第1分 */}
              <div id="chapter-1" className="scroll-mt-20">
                <Card className="border-2 mb-6">
                  <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
                    <div className="flex items-center gap-3">
                      <Badge variant="secondary">第1分</Badge>
                      <CardTitle>法会因由分第一</CardTitle>
                    </div>
                    <CardDescription>佛陀在舍卫国祇树给孤独园示现般若法会，与大比丘众千二百五十人俱。说明本法会之缘起与时间地点。</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6 pt-6">
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <Badge variant="outline">偈颂 1.1</Badge>
                      </div>
                      <Tabs defaultValue="kumarajiva">
                        <TabsList className="grid w-full grid-cols-5 h-auto">
                          <TabsTrigger value="kumarajiva" className="data-[state=active]:bg-red-100">鸠摩罗什 (402)</TabsTrigger>
                          <TabsTrigger value="xuanzang" className="data-[state=active]:bg-blue-100">玄奘 (660)</TabsTrigger>
                          <TabsTrigger value="yijing" className="data-[state=active]:bg-green-100">义净 (703)</TabsTrigger>
                          <TabsTrigger value="sanskrit" className="data-[state=active]:bg-purple-100">梵文</TabsTrigger>
                          <TabsTrigger value="tibetan" className="data-[state=active]:bg-orange-100">藏文</TabsTrigger>
                        </TabsList>
                        <TabsContent value="kumarajiva" className="mt-4 p-4 bg-red-50 rounded-lg">
                          <p className="text-lg">如是我闻：一时，佛在舍卫国祇树给孤独园，与大比丘众千二百五十人俱。</p>
                        </TabsContent>
                        <TabsContent value="xuanzang" className="mt-4 p-4 bg-blue-50 rounded-lg">
                          <p className="text-lg">如是我闻。一时，薄伽梵在室罗筏、誓多林给孤独园，与大苾刍众千二百五十人俱。</p>
                        </TabsContent>
                        <TabsContent value="yijing" className="mt-4 p-4 bg-green-50 rounded-lg">
                          <p className="text-lg">如是我闻。一时，薄伽梵在室罗伐、誓多林给孤独园，与大苾刍众千二百五十人俱。</p>
                        </TabsContent>
                        <TabsContent value="sanskrit" className="mt-4 p-4 bg-purple-50 rounded-lg">
                          <p className="text-base">Evam mayā śrutam - ekasmin samaye bhagavān śrāvastīyām viharati jetavane anāthapindikasya ārāme...</p>
                        </TabsContent>
                        <TabsContent value="tibetan" className="mt-4 p-4 bg-orange-50 rounded-lg">
                          <p className="text-base">དེ་བཞིན་བདག་གིས་ཐོས་པ་ཡིན། དུས་གཅིག་ལ་བླ་མ་སངས་རྒྱས་ཤཱཀྱ་ཐུབ་དགེ་སློང་གི་ཚང་དུ་བཞུགས་ནས་དགེ་སྦྱང་སྟོང་ཕྲག་གཉིས་བརྒྱ་བ་དང་ལྷན་དུ་བཞུགས་པ་ཡོད་པ་རེད།</p>
                        </TabsContent>
                      </Tabs>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <Badge variant="outline">偈颂 1.2</Badge>
                      </div>
                      <Tabs defaultValue="kumarajiva">
                        <TabsList className="grid w-full grid-cols-3 h-auto">
                          <TabsTrigger value="kumarajiva">鸠摩罗什</TabsTrigger>
                          <TabsTrigger value="xuanzang">玄奘</TabsTrigger>
                          <TabsTrigger value="yijing">义净</TabsTrigger>
                        </TabsList>
                        <TabsContent value="kumarajiva" className="mt-4 p-4 bg-red-50 rounded-lg">
                          <p className="text-lg">尔时，世尊食时，着衣持钵，入舍卫大城乞食。于其城中次第乞已，还至本处。饭食讫，收衣钵，洗足已，敷座而坐。</p>
                        </TabsContent>
                        <TabsContent value="xuanzang" className="mt-4 p-4 bg-blue-50 rounded-lg">
                          <p className="text-lg">尔时，世尊于日初分时，着衣持钵，入室罗筏大城乞食。于其城中次第乞已，还至本处。饭食讫，收衣钵，洗足已，敷座而坐。</p>
                        </TabsContent>
                        <TabsContent value="yijing" className="mt-4 p-4 bg-green-50 rounded-lg">
                          <p className="text-lg">尔时，世尊于日初分时，着衣持钵，入室罗伐大城乞食。于其城中次第乞已，还至本处。饭食讫，收衣钵，洗足已，敷座而坐。</p>
                        </TabsContent>
                      </Tabs>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* 学术论文 */}
          <TabsContent value="papers" className="space-y-6">
            {papers.map((paper) => (
              <Card key={paper.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg hover:text-amber-600 cursor-pointer flex items-center gap-2">
                        {paper.title}
                        <ExternalLink className="w-4 h-4 text-muted-foreground" />
                      </CardTitle>
                      <CardDescription className="mt-2">
                        {paper.author} · {paper.journal} · {paper.volume} · {paper.pages}
                      </CardDescription>
                    </div>
                    <Badge variant="outline">{paper.year}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                    {paper.abstract}
                  </p>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {paper.keywords.map((k) => (
                      <Badge key={k} variant="secondary" className="text-xs">
                        {k}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Download className="w-3 h-3" />
                        {paper.downloads.toLocaleString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <Bookmark className="w-3 h-3" />
                        引用 {paper.citations}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Download className="w-4 h-4 mr-2" />
                        下载全文
                      </Button>
                      <Button size="sm" variant="ghost">
                        <Bookmark className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* 知识图谱 */}
          <TabsContent value="knowledge" className="space-y-6">
            <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Network className="w-5 h-5 text-purple-600" />
                  佛学概念知识图谱
                </CardTitle>
                <CardDescription>
                  可视化探索《金刚经》及相关佛学概念之间的关系
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="aspect-video bg-white rounded-lg border-2 border-dashed border-purple-200 flex items-center justify-center">
                  <div className="text-center text-purple-400">
                    <Network className="w-16 h-16 mx-auto mb-4" />
                    <p>知识图谱可视化</p>
                    <p className="text-sm">即将推出</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[
                { name: '般若', sanskrit: 'Prajñā', relations: 42, category: '核心概念' },
                { name: '空性', sanskrit: 'Śūnyatā', relations: 38, category: '核心概念' },
                { name: '布施', sanskrit: 'Dāna', relations: 25, category: '六度' },
                { name: '忍辱', sanskrit: 'Kṣānti', relations: 21, category: '六度' },
                { name: '菩提心', sanskrit: 'Bodhicitta', relations: 33, category: '核心概念' },
                { name: '涅槃', sanskrit: 'Nirvāṇa', relations: 29, category: '果位' },
                { name: '波罗蜜', sanskrit: 'Pāramitā', relations: 31, category: '修行' },
                { name: '法身', sanskrit: 'Dharmakāya', relations: 27, category: '佛身' },
                { name: '缘起', sanskrit: 'Pratītyasamutpāda', relations: 35, category: '核心概念' },
                { name: '精进', sanskrit: 'Vīrya', relations: 19, category: '六度' },
                { name: '禅定', sanskrit: 'Dhyāna', relations: 23, category: '六度' },
                { name: '般若波罗蜜', sanskrit: 'Prajñāpāramitā', relations: 45, category: '核心概念' },
              ].map((concept) => (
                <Card key={concept.name} className="text-center hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="pt-6">
                    <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-3">
                      <Network className="w-6 h-6 text-purple-600" />
                    </div>
                    <h3 className="font-medium">{concept.name}</h3>
                    <p className="text-xs text-muted-foreground italic mb-1">{concept.sanskrit}</p>
                    <div className="flex items-center justify-center gap-2 text-xs">
                      <Badge variant="outline" className="text-xs">{concept.category}</Badge>
                      <span className="text-muted-foreground">{concept.relations} 关联</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </div>
  );
}
