/**
 * 版本对照页面 - 第1-2-3章详细对照
 */

import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Languages, BookOpen, Search } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: '版本对照 - 第1-2-3章 | 金刚经研究平台',
  description: '鸠摩罗什、玄奘、义净、梵文、藏文、英文译本对照阅读'
};

const chapters = [
  {
    num: 1,
    title: '法会因由分第一',
    summary: '佛陀在舍卫国祇树给孤独园示现般若法会，与大比丘众千二百五十人俱。说明本法会之缘起与时间地点。',
    verses: [
      {
        num: 1,
        kumarajiva: '如是我闻：一时，佛在舍卫国祇树给孤独园，与大比丘众千二百五十人俱。',
        xuanzang: '如是我闻。一时，薄伽梵在室罗筏、誓多林给孤独园，与大苾刍众千二百五十人俱。',
        yijing: '如是我闻。一时，薄伽梵在室罗伐、誓多林给孤独园，与大苾刍众千二百五十人俱。',
        sanskrit: 'Evam mayā śrutam - ekasmin samaye bhagavān śrāvastīyām viharati jetavane anāthapindikasya ārāme mahatā bhikṣusaṃghena sārdham ardhatrayodasaśatibhi bhikṣuśataih.',
        tibetan: 'དེ་བཞིན་བདག་གིས་ཐོས་པ་ཡིན། དུས་གཅིག་ལ་བླ་མ་སངས་རྒྱས་ཤཱཀྱ་ཐུབ་དགེ་སློང་གི་ཚང་དུ་བཞུགས་ནས་དགེ་སྦྱང་སྟོང་ཕྲག་གཉིས་བརྒྱ་བ་དང་ལྷན་དུ་བཞུགས་པ་ཡོད་པ་རེད།',
        notes: ['法会缘起', '祇树给孤独园', '千二百五十人']
      },
      {
        num: 2,
        kumarajiva: '尔时，世尊食时，着衣持钵，入舍卫大城乞食。于其城中次第乞已，还至本处。饭食讫，收衣钵，洗足已，敷座而坐。',
        xuanzang: '尔时，世尊于日初分时，着衣持钵，入室罗筏大城乞食。于其城中次第乞已，还至本处。饭食讫，收衣钵，洗足已，敷座而坐。',
        yijing: '尔时，世尊于日初分时，着衣持钵，入室罗伐大城乞食。于其城中次第乞已，还至本处。饭食讫，收衣钵，洗足已，敷座而坐。',
        notes: ['日常威仪', '乞食', '如法行持']
      }
    ]
  },
  {
    num: 2,
    title: '善现启请分第二',
    summary: '须菩提请问佛陀：菩萨应如何发心？如何降伏其心？此为全经之核心问题。',
    verses: [
      {
        num: 1,
        kumarajiva: '时，长老须菩提在大众中即从座起，偏袒右肩，右膝着地，合掌恭敬而白佛言："希有！世尊！如来善护念诸菩萨，善付嘱诸菩萨。"',
        xuanzang: '时，长老须菩提在大众中即从座起，偏袒右肩，右膝着地，合掌恭敬而白佛言："希有！世尊！如来善护念诸菩萨，善付嘱诸菩萨。"',
        yijing: '时，长老须菩提在大众中即从座起，偏袒右肩，右膝着地，合掌恭敬而白佛言："希有！世尊！如来善护念诸菩萨，善付嘱诸菩萨。"',
        notes: ['须菩提启请', '恭敬请法', '善护念菩萨']
      },
      {
        num: 2,
        kumarajiva: '世尊！善男子、善女人，发阿耨多罗三藐三菩提心，应云何住？云何降伏其心？',
        xuanzang: '世尊！善男子、善女人，发阿耨多罗三藐三菩提心，应云何住？云何降伏其心？',
        yijing: '世尊！善男子、善女人，发阿耨多罗三藐三菩提心，应云何住？云何降伏其心？',
        notes: ['核心问题', '云何住？', '云何降伏其心？'],
        highlight: true
      },
      {
        num: 3,
        kumarajiva: '佛言："善哉善哉！须菩提！如汝所说，如来善护念诸菩萨，善付嘱诸菩萨。汝今谛听！当为汝说。"',
        xuanzang: '佛言："善哉善哉！须菩提！如汝所说，如来善护念诸菩萨，善付嘱诸菩萨。汝今谛听！当为汝说。" 善男子、善女人，发阿耨多罗三藐三菩提心，应如是住，如是降伏其心。',
        yijing: '佛言："善哉善哉！须菩提！如汝所说，如来善护念诸菩萨，善付嘱诸菩萨。汝今谛听！当为汝说。"',
        notes: ['佛陀赞叹', '谛听谛听', '当为汝说'],
        xuanzangNote: '玄奘译本增加了对须菩提回答的确认'
      }
    ]
  },
  {
    num: 3,
    title: '大乘正宗分第三',
    summary: '佛陀宣示：菩萨应度一切众生，而无众生可度。说明无相布施与无住生心之理。',
    verses: [
      {
        num: 1,
        kumarajiva: '诸菩萨摩诃萨，应如是降伏其心："所有一切众生之类，若卵生、若胎生、若湿生、若化生，若有色、若无色，若有想、若无想、若非有想非无想，我皆令入无余涅槃而灭度之。" 如是灭度无量无数无边众生，实无众生得灭度者。',
        xuanzang: '诸菩萨摩诃萨，应如是降伏其心："所有一切众生之类，若卵生、若胎生、若湿生、若化生，若有色、若无色，若有想、若无想、若非有想非无想，我皆令入无余涅槃而灭度之。" 如是灭度无量无数无边众生，实无众生得灭度者。',
        yijing: '诸菩萨摩诃萨，应如是降伏其心："所有一切众生之类，若卵生、若胎生、若湿生、若化生，若有色、若无色，若有想、若无想、若非有想非无想，我皆令入无余涅槃而灭度之。" 如是灭度无量无数无边众生，实无众生得灭度者。',
        sanskrit: 'Subhūti sarvabhūtānām kṣayādānām aprameyānām anantānām nirvāṇadhātum prajñāpāramitāyām śikṣitavyam.',
        notes: ['四种生', '九类众生', '无余涅槃'],
        highlight: true
      },
      {
        num: 2,
        kumarajiva: '何以故？须菩提！若菩萨有我相、人相、众生相、寿者相，即非菩萨。',
        xuanzang: '何以故？须菩提！若菩萨有我相、人相、众生相、寿者相，即非菩萨。',
        yijing: '何以故？须菩提！若菩萨有我相、人相、众生相、寿者相，即非菩萨。',
        notes: ['四相', '我相', '人相', '众生相', '寿者相'],
        xuanzangNote: '玄奘译本的"四相"表述与鸠摩罗什译本一致'
      }
    ]
  }
];

export default function VersionCompare123Page() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <Badge className="mb-4" variant="outline">版本对照</Badge>
          <h1 className="text-4xl font-bold mb-4">第1-2-3章版本对照</h1>
          <p className="text-xl text-muted-foreground max-w-3xl">
            鸠摩罗什、玄奘、义净、梵文原典、藏文译本、英文译本的多版本对照阅读
          </p>
        </div>

        <div className="space-y-12">
          {chapters.map((chapter) => (
            <Card key={chapter.num} className="border-2">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
                <div className="flex items-center gap-3 mb-2">
                  <Badge variant="secondary" className="text-lg px-3 py-1">
                    第{chapter.num}分
                  </Badge>
                  <CardTitle className="text-2xl">{chapter.title}</CardTitle>
                </div>
                <CardDescription className="text-base">{chapter.summary}</CardDescription>
              </CardHeader>
              
              <CardContent className="pt-6">
                {chapter.verses.map((verse, index) => (
                  <div key={index} className="mb-8 last:mb-0">
                    <div className="flex items-center gap-2 mb-4">
                      <Badge variant="outline" className="text-sm">
                        偈颂 {chapter.num}.{verse.num}
                      </Badge>
                      {verse.highlight && (
                        <Badge className="bg-amber-100 text-amber-800 border-amber-300">
                          核心偈颂
                        </Badge>
                      )}
                    </div>

                    <Tabs defaultValue="kumarajiva" className="mt-4">
                      <TabsList className="grid w-full grid-cols-6 h-auto">
                        <TabsTrigger value="kumarajiva" className="data-[state=active]:bg-red-100 data-[state=active]:text-red-900">
                          鸠摩罗什
                          <span className="block text-xs opacity-70">402</span>
                        </TabsTrigger>
                        <TabsTrigger value="xuanzang" className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-900">
                          玄奘
                          <span className="block text-xs opacity-70">660</span>
                        </TabsTrigger>
                        <TabsTrigger value="yijing" className="data-[state=active]:bg-green-100 data-[state=active]:text-green-900">
                          义净
                          <span className="block text-xs opacity-70">703</span>
                        </TabsTrigger>
                        <TabsTrigger value="sanskrit" className="data-[state=active]:bg-purple-100 data-[state=active]:text-purple-900">
                          梵文
                        </TabsTrigger>
                        <TabsTrigger value="tibetan" className="data-[state=active]:bg-orange-100 data-[state=active]:text-orange-900">
                          藏文
                        </TabsTrigger>
                        <TabsTrigger value="english" className="data-[state=active]:bg-cyan-100 data-[state=active]:text-cyan-900">
                          英文
                        </TabsTrigger>
                      </TabsList>

                      <TabsContent value="kumarajiva" className="mt-4 p-4 bg-red-50 rounded-lg">
                        <p className="text-lg leading-relaxed text-gray-900 font-medium">
                          {verse.kumarajiva}
                        </p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {verse.notes?.map((note) => (
                            <Badge key={note} variant="outline" className="text-xs">
                              {note}
                            </Badge>
                          ))}
                        </div>
                      </TabsContent>

                      <TabsContent value="xuanzang" className="mt-4 p-4 bg-blue-50 rounded-lg">
                        <p className="text-lg leading-relaxed text-gray-900 font-medium">
                          {verse.xuanzang}
                        </p>
                        {verse.xuanzangNote && (
                          <div className="mt-3 p-2 bg-blue-100 rounded border border-blue-300">
                            <p className="text-sm text-blue-800">
                              <strong>注：</strong>{verse.xuanzangNote}
                            </p>
                          </div>
                        )}
                      </TabsContent>

                      <TabsContent value="yijing" className="mt-4 p-4 bg-green-50 rounded-lg">
                        <p className="text-lg leading-relaxed text-gray-900 font-medium">
                          {verse.yijing}
                        </p>
                      </TabsContent>

                      {verse.sanskrit && (
                        <TabsContent value="sanskrit" className="mt-4 p-4 bg-purple-50 rounded-lg">
                          <p className="text-base leading-relaxed text-purple-900 font-serif">
                            {verse.sanskrit}
                          </p>
                        </TabsContent>
                      )}

                      {verse.tibetan && (
                        <TabsContent value="tibetan" className="mt-4 p-4 bg-orange-50 rounded-lg">
                          <p className="text-base leading-relaxed text-orange-900 font-serif">
                            {verse.tibetan}
                          </p>
                        </TabsContent>
                      )}

                      <TabsContent value="english" className="mt-4 p-4 bg-cyan-50 rounded-lg">
                        <p className="text-base leading-relaxed text-cyan-900">
                          {verse.english}
                        </p>
                      </TabsContent>
                    </Tabs>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="mt-12 bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-amber-900">
              <Languages className="w-5 h-5" />
              版本对照说明
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <h4 className="font-semibold text-amber-900 mb-1">鸠摩罗什译本（402）</h4>
                <p className="text-sm text-gray-700">流传最广的汉译本，语言优美，意境深远。鸠摩罗什精通梵汉，译文兼顾原意与文采，被誉为"译经之王"</p>
              </div>
              <div>
                <h4 className="font-semibold text-blue-900 mb-1">玄奘译本（660）</h4>
                <p className="text-sm text-gray-700">直译精确，忠实原文，适合学术研究。题名《能断金刚般若波罗蜜经》，在《大般若经》中为第九会</p>
              </div>
              <div>
                <h4 className="font-semibold text-green-900 mb-1">义净译本（703）</h4>
                <p className="text-sm text-gray-700">义净法师所译，题为《佛说能断金刚般若波罗蜜多经》。文质兼备，补充罗什文献价值</p>
              </div>
              <div>
                <h4 className="font-semibold text-purple-900 mb-1">梵文原典</h4>
                <p className="text-sm text-gray-700">Vajracchedikā Prajñāpāramitā Sūtra，属于般若部经典，约成书于公元前1世纪。原始经典，学术研究，梵文学习，词源分析</p>
              </div>
              <div>
                <h4 className="font-semibold text-orange-900 mb-1">藏文译本</h4>
                <p className="text-sm text-gray-700">藏译《金刚般若波罗蜜多经》，属于藏文大藏经甘珠尔部。藏传传承，注疏丰富，宗喀巴释</p>
              </div>
            </div>
            <div className="mt-6 flex justify-center">
              <Button asChild variant="outline">
                <Link href="/study">
                  <BookOpen className="w-4 h-4 mr-2" />
                  开始完整学习
                </Link>
              </Button>
              <Button asChild className="ml-4">
                <Link href="/research">
                  <Search className="w-4 h-4 mr-2" />
                  更多版本对照
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
}
