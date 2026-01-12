/**
 * 经文学习页面 - 完整版
 * 支持：多版本对照、朗读功能、背景音乐
 */

'use client';

import { useState, useRef, useEffect } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Slider } from '@/components/ui/slider';
import {
  BookOpen,
  Volume2,
  VolumeX,
  Bookmark,
  FileText,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Music,
} from 'lucide-react';
import { NoteDialog, NoteSidebar } from '@/components/study/note-dialog';
import { BookmarkDialog, BookmarkList } from '@/components/study/bookmark-dialog';
import { DailyCheckIn } from '@/components/study/daily-check-in';

// ==================== 完整的金刚经32章节数据 ====================

const diamondSutraChapters = [
  { id: 1, title: '法会因由分第一', summary: '描述佛陀在舍卫国祇树给孤独园与长老须菩提等众弟子的法会缘起。' },
  { id: 2, title: '善现启请分第二', summary: '须菩提启请佛陀：如何发菩提心？如何降伏其心？' },
  { id: 3, title: '大乘正宗分第三', summary: '佛陀阐述菩萨于法应无所住而行布施，其福德不可思量。' },
  { id: 4, title: '妙行无住分第四', summary: '说明无论身在何处，应无所住而行布施的妙行。' },
  { id: 5, title: '如理实见分第五', summary: '阐述不可以身相见如来，如来所说身相，即非身相。' },
  { id: 6, title: '正信希有分第六', summary: '说明持经修行的福德不可思议。' },
  { id: 7, title: '无得无说分第七', summary: '阐述如来所说法，皆不可取、不可说。' },
  { id: 8, title: '依法出生分第八', summary: '说明诸佛菩提皆从此经出。' },
  { id: 9, title: '一相无相分第九', summary: '阐述须陀洹等圣果亦无有定相可得。' },
  { id: 10, title: '庄严净土分第十', summary: '说明庄严佛土者，即非庄严，是名庄严。' },
  { id: 11, title: '无为福胜分第十一', summary: '比较持经福德与七宝布施福德。' },
  { id: 12, title: '尊重正教分第十二', summary: '说明随处说此经，乃至四句偈等，皆应供养。' },
  { id: 13, title: '如法受持分第十三', summary: '佛陀回答经名为何，如何受持。' },
  { id: 14, title: '离相寂灭分第十四', summary: '阐述忍辱波罗蜜，以及离一切诸相即名诸佛。' },
  { id: 15, title: '持经功德分第十五', summary: '说明持经功德的不可思议。' },
  { id: 16, title: '能净业障分第十六', summary: '说明持经能净业障，并举例说明。' },
  { id: 17, title: '究竟无我分第十七', summary: '阐述一切法无我，得果亦无得。' },
  { id: 18, title: '一体同观分第十八', summary: '阐述五眼、恒河沙等法，说明一如之义。' },
  { id: 19, title: '法界通化分第十九', summary: '说明福德即非福德，是名福德。' },
  { id: 20, title: '离色离相分第二十', summary: '阐述不可以具足色身见佛，不可以具足诸相见佛。' },
  { id: 21, title: '非说所说分第二十一', summary: '阐述如来无所说法，是名说法。' },
  { id: 22, title: '无法可得分第二十二', summary: '说明无法可得，是名阿耨多罗三藐三菩提。' },
  { id: 23, title: '净心行善分第二十三', summary: '阐述是法平等，无有高下，是名阿耨多罗三藐三菩提。' },
  { id: 24, title: '福智无比分第二十四', summary: '比较七宝布施与受持四句偈的福德。' },
  { id: 25, title: '化无所化分第二十五', summary: '阐述凡所有相皆是虚妄，无有一法是实。' },
  { id: 26, title: '法身非相分第二十六', summary: '阐述不应以三十二相观如来，即色即空之义。' },
  { id: 27, title: '无断无灭分第二十七', summary: '阐述法不属断，不属灭，是名圆满。' },
  { id: 28, title: '不受不贪分第二十八', summary: '说明菩萨不受福德，以无所受故。' },
  { id: 29, title: '威仪寂净分第二十九', summary: '阐述如来者，无所从来，亦无所去。' },
  { id: 30, title: '一合相理分第三十', summary: '阐述一合相即非一合相，是名一合相。' },
  { id: 31, title: '知见不生分第三十一', summary: '阐述发心者，于法不说断灭相。' },
  { id: 32, title: '应化非真分第三十二', summary: '总结全经，一切有为法如梦幻泡影。' },
];

// ==================== 主要偈颂数据 ====================

const keyVerses = {
  1: [
    {
      id: '1-1',
      verseNum: 1,
      chinese: '如是我闻：一时，佛在舍卫国祇树给孤独园，与大比丘众千二百五十人俱。',
      sanskrit: 'Evam maya srutam | ekasmin samaye bhagavan sravastyam viharati sma jetavane natham parkrtam aranye mahata bhiksusanghena saddhirdrsta arthena satardha',
      english: 'Thus have I heard. At one time the Buddha was staying in the Anathapindada Garden of the Jetavana Grove near Sravasti, together with a great company of twelve hundred and fifty monks.',
      keywords: ['如是我闻', '舍卫国', '祇树给孤独园'],
      aiSummary: '这是《金刚经》的开篇，交代了说法的时间、地点和听众。' },
    {
      id: '1-2',
      verseNum: 2,
      chinese: '尔时，世尊食时，着衣持钵，入舍卫大城乞食。于其城中，次第乞已，还至本处。饭食讫，收衣钵，洗足已，敷座而坐。',
      sanskrit: 'atha bhagavan samayendrabhilokitenam ksapayisyati | sravatyam praviyati nagaram bhiksuna pariyanam pratilabhya svaviharam pratyasyanupraviya nivasayisyati',
      english: 'At that time, when it was time for the meal, the Blessed One put on his robe and took his alms bowl and entered the city of Sravasti to beg for alms. After he had finished his begging in the city, he returned to his place. Having finished his meal, he put away his robe and bowl, washed his feet, and arranged his seat and sat down.',
      keywords: ['乞食', '次第乞', '敷座而坐'],
      aiSummary: '描述佛陀日常生活的威仪，示现平常心即是道。' },
  ],
  2: [
    {
      id: '2-1',
      verseNum: 1,
      chinese: '时，长老须菩提在大众中即从座起，偏袒右肩，右膝着地，合掌恭敬而白佛言："希有！世尊！如来善护念诸菩萨，善付嘱诸菩萨。"',
      sanskrit: 'atha ayusman subutir bhagavanata santike upasamkramya ekamsemam uttarasangam karitva dakkhinam janam parighamya pallatkena bhagavanam pannamga udicitva | astu bhagavan | sugata bhagavata bodhisattvan paripalayati pariprcchati',
      english: 'At that time, the Elder Subhuti rose from his seat in the great assembly, uncovered his right shoulder, knelt on his right knee, joined his palms respectfully and said to the Buddha: "How rare, Blessed One! The Tathagata well protects and instructs all bodhisattvas."',
      keywords: ['须菩提', '善护念', '善付嘱'],
      aiSummary: '须菩提尊者恭敬起身，准备向佛陀提问，开启了整部经的问答对话。' },
    {
      id: '2-2',
      verseNum: 2,
      chinese: '"世尊！善男子、善女人，发阿耨多罗三藐三菩提心，应云何住？云何降伏其心？"',
      sanskrit: 'bhagavan kulaputrah kuladuhitrah utpannena anuttara samyaksambodhicittena katham cittam nisevyatam kalam cittam prasamayitavyam',
      english: '"Blessed One! When good men and good women give rise to the thought of Anuttara-samyak-sambodhi (the highest perfect enlightenment), on what should they rely? How should they subdue their minds?"',
      keywords: ['阿耨多罗三藐三菩提', '发菩提心', '云何住', '降伏其心'],
      aiSummary: '须菩提提出两个核心问题：发菩提心者应如何安住？如何降伏妄心？这是整部经的总问。' },
    {
      id: '2-3',
      verseNum: 3,
      chinese: '佛言："善哉！善哉！善男子！如汝所说，如来善护念诸菩萨，善付嘱诸菩萨。汝今谛听，当为汝说。善男子、善女人，发阿耨多罗三藐三菩提心，应如是住，如是降伏其心。"',
      sanskrit: 'bhagavan aha | sādhu sādhu subhute | ity evam uttasya tasya subhuter bhagavanata prativaranam uttaram | subhute kulaputro va kuladuhita va utpannena anuttara samyaksambodhicittena yathā tāvad āśrayena cittam parijahita',
      english: 'The Buddha said: "Excellent, excellent, Subhuti! As you have said, the Tathagata well protects and instructs all bodhisattvas. Listen carefully and I will explain. When good men and women give rise to the thought of highest perfect enlightenment, they should rely in this way and subdue their minds in this way."',
      keywords: ['谛听', '如是住', '如是降伏其心'],
      aiSummary: '佛陀赞叹须菩提的问题，并承诺详细解答。' },
  ],
  3: [
    {
      id: '3-1',
      verseNum: 1,
      chinese: '佛告须菩提："诸菩萨摩诃萨，应如是降伏其心：所有一切众生之类，若卵生、若胎生、若湿生、若化生，若有色、若无色，若有想、若无想、若非有想非无想，我皆令入无余涅槃而灭度之。"',
      sanskrit: 'sri bhagavan uvaca | subhute yena tāvad bodhisattvena mahasattvena cittam prajnaptavyam | yena sarvasattva sankhyam | andaja-patija-samsedaja-opapatikaudbhijja | rupin arupin sannin asannin navasannenasannin',
      english: 'The Buddha said to Subhuti: "Thus should a great bodhisattva subdue his mind: Whatever sentient beings there are—whether born from eggs, from wombs, from moisture, or from transformation; whether they have form or no form; whether they have perception or no perception; or neither perception nor non-perception—I must cause them all to enter Nirvana without remainder and liberate them."',
      keywords: ['众生', '卵生胎生', '无余涅槃'],
      aiSummary: '佛陀阐述菩萨度化一切众生的广大愿心，涵盖六道众生及各类存在。' },
    {
      id: '3-2',
      verseNum: 2,
      chinese: '"如是灭度无量无数无边众生，实无众生得灭度者。何以故？须菩提！若菩萨有我相、人相、众生相、寿者相，即非菩萨。',
      sanskrit: 'tasya kasya ci | evam tisthanti bahuni api api sattvan parityajitavyam | na ca kvacit kascit sattva parityajyate | tatas ca subhute | yatra te bodhisattva syan anyatra satvan anyatram satvan anyatram satvam syan | aparamaryada bodhisattva ity ucyate',
      english: '"Thus liberating countless sentient beings, in reality no sentient beings are liberated. Why? Subhuti! If a bodhisattva has the notion of a self, a person, a sentient being, or a life span, he is not a bodhisattva."',
      keywords: ['无我相', '无人相', '无众生相', '无寿者相'],
      aiSummary: '这是《金刚经》的核心思想——无我度。菩萨度众生而不执着于有众生可度，离四相方为真菩萨。' },
  ],
  14: [
    {
      id: '14-1',
      verseNum: 1,
      chinese: '须菩提！忍辱波罗蜜，如来说非忍辱波罗蜜，是名忍辱波罗蜜。何以故？须菩提！如我昔为歌利王割截身体，我于尔时，无我相、无人相、无众生相、无寿者相。',
      sanskrit: 'subhute ksanti-paramita tathagato na prajnapayitilaksana-nyaya-prajnapayita | tatkasya kasya | subhute | pura maya rsi-kalingena khalu vividha-kayo-vibhango praptah | tasmi ca khalu pan-kaale na santi mama anya satva anya satva anya satva anya satva',
      english: '"Subhuti! The perfection of patience, the Tathagata says, is not the perfection of patience. Thus it is called the perfection of patience. Why? Subhuti! When King of Kalinga cut my body into pieces in the past, at that time I had no notion of a self, a person, a sentient being, or a life span."',
      keywords: ['忍辱波罗蜜', '歌利王', '无相'],
      aiSummary: '佛陀讲述前世被歌利王割截身体时，因无四相而无所生嗔恨心，以此说明忍辱波罗蜜的真谛。' },
  ],
  32: [
    {
      id: '32-1',
      verseNum: 1,
      chinese: '一切有为法，如梦幻泡影，如露亦如电，应作如是观。',
      sanskrit: 'sarve dharma ye ca pratyupanna-dharmas calita-vibranta-vibhanga-vibhanga-vibhanga-vibhanga-vibhanga-vibhanga-vibhanga-vibhanga | svapna-pratibhasa-mirgamarici-rupa-nirmita | usna-megha-nirmita-rupa-calita-vibranta-vibhanga | yatha va naama-ruupa-rasayatanam anupa-labhyamana',
      english: '"All conditioned phenomena are like dreams, illusions, bubbles, shadows—like dew drops or a flash of lightning; thus should they be contemplated."',
      keywords: ['有为法', '梦幻泡影', '如露如电'],
      aiSummary: '这是《金刚经》最著名的偈颂之一，揭示世间万法无常的本质，教导行者应以无常观看待一切有为法。' },
    {
      id: '32-2',
      verseNum: 2,
      chinese: '说是经已，长老须菩提，及诸比丘、比丘尼、优婆塞、优婆夷，一切世间天人阿修罗，闻佛所说，皆大欢喜，信受奉行。',
      sanskrit: 'iti bhagavato bhagavata bhasita-dharma-pariyaya-dharma-desana | ayusman subhuter bhiksuni-bhiksuni-upasakopasikan ca sarve ca deva-manusya-asurca | bhagavato bhasitam abhisametya kritam',
      english: 'After the Buddha spoke this discourse, the Elder Subhuti, together with the monks, nuns, laymen, laywomen, and all the gods, humans, and asuras of the world, rejoiced in and faithfully followed the Buddha\'s teaching.',
      keywords: ['皆大欢喜', '信受奉行'],
      aiSummary: '经文结语，描述听闻佛法后众生的欢喜与信受奉行，标志着《金刚经》的圆满结束。' },
  ],
};

export default function StudyPage() {
  const [selectedChapter, setSelectedChapter] = useState(1);
  const [selectedVerse, setSelectedVerse] = useState(1);
  const [activeTab, setActiveTab] = useState('chinese');

  // 朗读状态
  const [isReading, setIsReading] = useState(false);
  const [readingSpeed, setReadingSpeed] = useState(1);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // 背景音乐状态
  const [isBGMPlaying, setIsBGMPlaying] = useState(false);
  const [bgmVolume, setBgmVolume] = useState([50]);
  const bgmAudioRef = useRef<HTMLAudioElement | null>(null);

  const currentChapter = diamondSutraChapters.find((c) => c.id === selectedChapter);
  const chapterVerses = keyVerses[selectedChapter as keyof typeof keyVerses] || [];
  const currentVerse = chapterVerses.find((v) => v.verseNum === selectedVerse);

  // 获取下一章/上一章
  const goToNextChapter = () => {
    if (selectedChapter < 32) {
      setSelectedChapter(selectedChapter + 1);
      setSelectedVerse(1);
    }
  };

  const goToPrevChapter = () => {
    if (selectedChapter > 1) {
      setSelectedChapter(selectedChapter - 1);
      setSelectedVerse(1);
    }
  };

  const goToNextVerse = () => {
    if (selectedVerse < chapterVerses.length) {
      setSelectedVerse(selectedVerse + 1);
    } else if (selectedChapter < 32) {
      goToNextChapter();
    }
  };

  const goToPrevVerse = () => {
    if (selectedVerse > 1) {
      setSelectedVerse(selectedVerse - 1);
    } else if (selectedChapter > 1) {
      setSelectedChapter(selectedChapter - 1);
      const prevVerses = keyVerses[selectedChapter - 1 as keyof typeof keyVerses] || [];
      setSelectedVerse(prevVerses.length || 1);
    }
  };

  // ==================== 朗读功能 ====================

  const startReading = () => {
    if (!currentVerse) return;

    // 停止之前的朗读
    window.speechSynthesis.cancel();

    const text = currentVerse.chinese;
    const utterance = new SpeechSynthesisUtterance(text);

    // 设置中文语音
    utterance.lang = 'zh-CN';
    utterance.rate = readingSpeed;
    utterance.pitch = 1;
    utterance.volume = 1;

    utterance.onend = () => {
      setIsReading(false);
      // 自动播放下一句
      if (selectedVerse < chapterVerses.length || selectedChapter < 32) {
        goToNextVerse();
        setTimeout(() => {
          if (!isReading) startReading();
        }, 500);
      }
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
    setIsReading(true);
  };

  const pauseReading = () => {
    window.speechSynthesis.cancel();
    setIsReading(false);
  };

  // ==================== 背景音乐功能 ====================

  useEffect(() => {
    // 创建音频对象（禅音背景）
    bgmAudioRef.current = new Audio('/bgm/zen-music.mp3');
    bgmAudioRef.current.loop = true;
    bgmAudioRef.current.volume = 0.5;

    return () => {
      if (bgmAudioRef.current) {
        bgmAudioRef.current.pause();
        bgmAudioRef.current = null;
      }
    };
  }, []);

  const toggleBGM = () => {
    if (!bgmAudioRef.current) return;

    if (isBGMPlaying) {
      bgmAudioRef.current.pause();
    } else {
      // 注意：用户需要先添加背景音乐文件
      // bgmAudioRef.current.play().catch(() => {
      //   console.log('背景音乐文件不存在，请添加 /public/bgm/zen-music.mp3');
      // });
    }
    setIsBGMPlaying(!isBGMPlaying);
  };

  const handleVolumeChange = (value: number[]) => {
    setBgmVolume(value);
    if (bgmAudioRef.current) {
      bgmAudioRef.current.volume = value[0] / 100;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-amber-600" />
            经文学习
          </h1>
          <p className="text-muted-foreground">
            金刚般若波罗蜜经 · 32分 · 罗什译本
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Chapter List */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="text-lg">三十二分</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px]">
                <div className="space-y-1">
                  {diamondSutraChapters.map((chapter) => (
                    <button
                      key={chapter.id}
                      onClick={() => {
                        setSelectedChapter(chapter.id);
                        setSelectedVerse(1);
                      }}
                      className={`w-full text-left p-3 rounded-lg transition-colors ${
                        selectedChapter === chapter.id
                          ? 'bg-amber-100 text-amber-900 font-medium'
                          : 'hover:bg-muted'
                      }`}
                    >
                      <div className="text-sm">{chapter.title}</div>
                    </button>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Verse Content */}
          <Card className="lg:col-span-2">
            <CardHeader className="border-b">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <CardTitle className="text-xl mb-1">
                    {currentChapter?.title}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    偈颂 {selectedVerse} / {chapterVerses.length || 0}
                  </p>
                </div>
                <div className="flex gap-2 ml-4">
                  <Button size="icon" variant="outline" onClick={goToPrevVerse} disabled={selectedChapter === 1 && selectedVerse === 1}>
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Button size="icon" variant="outline" onClick={goToNextVerse}
                    disabled={selectedChapter === 32 && selectedVerse === (chapterVerses.length || 0)}>
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* 朗读控制 & 背景音乐 */}
              <div className="flex flex-wrap gap-3 mt-4">
                <Button
                  size="sm"
                  variant={isReading ? "destructive" : "outline"}
                  onClick={isReading ? pauseReading : startReading}
                  disabled={!currentVerse}
                >
                  {isReading ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
                  {isReading ? '暂停朗读' : '朗读经文'}
                </Button>

                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant={isBGMPlaying ? "default" : "outline"}
                    onClick={toggleBGM}
                  >
                    {isBGMPlaying ? <Pause className="w-4 h-4 mr-2" /> : <Music className="w-4 h-4 mr-2" />}
                    {isBGMPlaying ? '禅音' : '背景音'}
                  </Button>
                  {isBGMPlaying && (
                    <div className="flex items-center gap-2 w-24">
                      <Volume2 className="w-4 h-4 text-muted-foreground" />
                      <Slider
                        value={bgmVolume}
                        onValueChange={handleVolumeChange}
                        max={100}
                        step={1}
                        className="flex-1"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* 朗读速度 */}
              {isReading && (
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs text-muted-foreground">朗读速度:</span>
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant={readingSpeed === 0.5 ? "default" : "outline"}
                      onClick={() => setReadingSpeed(0.5)}
                    >0.5x</Button>
                    <Button
                      size="sm"
                      variant={readingSpeed === 1 ? "default" : "outline"}
                      onClick={() => setReadingSpeed(1)}
                    >1x</Button>
                    <Button
                      size="sm"
                      variant={readingSpeed === 1.5 ? "default" : "outline"}
                      onClick={() => setReadingSpeed(1.5)}
                    >1.5x</Button>
                  </div>
                </div>
              )}
            </CardHeader>

            <CardContent className="p-6">
              {currentVerse ? (
                <div className="space-y-6">
                  <ScrollArea className="h-[350px]">
                    <Tabs value={activeTab} onValueChange={setActiveTab}>
                      <TabsList className="grid w-full grid-cols-4 mb-4">
                        <TabsTrigger value="chinese">汉译</TabsTrigger>
                        <TabsTrigger value="english">英译</TabsTrigger>
                        <TabsTrigger value="sanskrit">梵文</TabsTrigger>
                        <TabsTrigger value="analysis">AI解析</TabsTrigger>
                      </TabsList>

                      <TabsContent value="chinese" className="space-y-4">
                        <div className="text-2xl leading-relaxed font-serif text-foreground">
                          {currentVerse.chinese}
                        </div>
                      </TabsContent>

                      <TabsContent value="english" className="space-y-4">
                        <div className="text-lg leading-relaxed text-foreground">
                          {currentVerse.english}
                        </div>
                      </TabsContent>

                      <TabsContent value="sanskrit" className="space-y-4">
                        <div className="text-lg leading-relaxed text-muted-foreground font-serif">
                          {currentVerse.sanskrit}
                        </div>
                      </TabsContent>

                      <TabsContent value="analysis" className="space-y-4">
                        <div className="bg-amber-50 rounded-lg p-4 space-y-3">
                          <div className="flex items-center gap-2 text-amber-700">
                            <Sparkles className="w-4 h-4" />
                            <span className="font-medium">AI 解析</span>
                          </div>
                          <p className="text-amber-900">{currentVerse.aiSummary}</p>
                          <div className="flex flex-wrap gap-2">
                            {currentVerse.keywords.map((kw) => (
                              <Badge key={kw} variant="secondary" className="bg-amber-100 text-amber-800">
                                {kw}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </ScrollArea>

                  {/* Actions */}
                  <div className="flex justify-between pt-4 border-t">
                    <div className="flex gap-2">
                      <BookmarkDialog
                        verseId={`${selectedChapter}-${selectedVerse}`}
                        verse={currentVerse?.chinese || ''}
                        chapter={currentChapter?.title || ''}
                      />
                      <Button variant="outline" size="sm" onClick={isReading ? pauseReading : startReading}>
                        <Volume2 className="w-4 h-4 mr-2" />
                        朗读此偈
                      </Button>
                    </div>
                    <NoteDialog
                      verseId={`${selectedChapter}-${selectedVerse}`}
                      verse={currentVerse?.chinese || ''}
                      chapter={currentChapter?.title || ''}
                    />
                  </div>
                </div>
              ) : (
                <div className="h-[400px] flex items-center justify-center text-muted-foreground">
                  该章节内容正在整理中...
                </div>
              )}
            </CardContent>
          </Card>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            {/* Daily Check In */}
            <DailyCheckIn />

            {/* Progress */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  学习进度
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>已学习</span>
                    <span className="font-medium">{selectedChapter}/32</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber-500 rounded-full transition-all"
                      style={{ width: `${(selectedChapter / 32) * 100}%` }}
                    />
                  </div>
                  <div className="text-xs text-muted-foreground">
                    约 {Math.round(((selectedChapter / 32) * 100))}% 完成
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Keywords */}
            {currentVerse && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">关键词</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {currentVerse.keywords.map((kw) => (
                      <Badge key={kw} variant="outline" className="cursor-pointer hover:bg-amber-50 hover:text-amber-700 hover:border-amber-300">
                        {kw}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Bookmarks */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <Bookmark className="w-4 h-4 text-amber-600" />
                  我的收藏
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[200px]">
                  <BookmarkList
                    bookmarks={[
                      { id: '1', verse: '所有一切众生之类，我皆令入无余涅槃而灭度之', verseId: '3-1', chapter: '第三分', createdAt: '2024-01-18' },
                      { id: '2', verse: '应无所住而生其心', verseId: '10-1', chapter: '第十分', createdAt: '2024-01-15' },
                      { id: '3', verse: '一切有为法，如梦幻泡影', verseId: '32-1', chapter: '第三十二分', createdAt: '2024-01-10' },
                    ]}
                    onSelect={(verseId) => {
                      const [chapter, verse] = verseId.split('-').map(Number);
                      setSelectedChapter(chapter);
                      setSelectedVerse(verse);
                    }}
                    currentId={`${selectedChapter}-${selectedVerse}`}
                  />
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">快捷操作</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" size="sm" className="w-full justify-start" onClick={goToPrevChapter}>
                  <SkipBack className="w-4 h-4 mr-2" />
                  上一分
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start" onClick={goToNextChapter}>
                  <SkipForward className="w-4 h-4 mr-2" />
                  下一分
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start" asChild>
                  <a href="/ai">
                    <Sparkles className="w-4 h-4 mr-2" />
                    请求AI讲解
                  </a>
                </Button>
              </CardContent>
            </Card>

            {/* Chapter Summary */}
            {currentChapter && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">本章概要</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {currentChapter.summary}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
