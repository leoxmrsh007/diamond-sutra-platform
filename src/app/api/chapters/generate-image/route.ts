/**
 * 章节配图生成 API
 * 为《金刚经》章节生成 AI 配图提示词
 */

import { NextRequest, NextResponse } from 'next/server';
import type { Session } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

export const dynamic = 'force-static';
export const fetchCache = 'force-cache';

const getSession = async (): Promise<Session | null> => (await auth()) as Session | null;

const assertSessionUser = (session: Session | null): session is Session & { user: Session['user'] } =>
  Boolean(session?.user);

// 金刚经 32 章的配图提示词
const chapterImagePrompts: Record<number, string> = {
  1: 'A serene Buddhist temple at dawn, golden light streaming through ancient wooden pillars, a solitary monk meditating in lotus position, soft mist rolling over mountain peaks in the background, traditional Chinese painting style, watercolor and ink, peaceful and contemplative mood',
  2: 'An elderly Buddhist master with a compassionate expression, teaching disciples under a bodhi tree, golden hour lighting, flowing robes, detailed face with wisdom lines, traditional thangka painting style, rich colors and gold leaf accents',
  3: 'A radiant Buddha figure seated on a lotus throne, emanating golden light in all directions, surrounded by floating lotus flowers, celestial beings offering prayers, ethereal and divine atmosphere, medieval Chinese Buddhist art style, vibrant colors',
  4: 'A vast ocean with a single moon reflection, the water perfectly still, symbolizing emptiness and illusion, minimalist composition, shades of blue and gold, traditional ink wash painting with subtle color accents, serene and meditative',
  5: 'A magnificent jeweled palace floating in clouds, with countless offerings being made, ornate architecture with golden spires, devotees bowing in reverence, celestial musicians playing instruments, richly detailed Tibetan thangka style, intricate patterns',
  6: 'A person practicing meditation, dissolving into light, their form becoming translucent and ethereal, symbolizing the impermanence of self, dreamlike quality, soft pastel colors, contemporary spiritual art style, mystical and transcendent',
  7: 'The Buddha receiving a golden bowl of food from a devotee, expressing gratitude and equanimity, a simple village setting with mud huts, morning light, earthy tones, realistic style with spiritual atmosphere, humble and sincere',
  8: 'A lotus flower blooming in muddy water, its petals pristine and pure, droplets of water glistening like pearls, symbolizing purity arising from suffering, macro photography style, shallow depth of field, soft natural lighting',
  9: 'Four distinct figures gradually dissolving into light and emptiness, representing the dissolution of self-concepts, ethereal and abstract, flowing robes becoming transparent, gradient from solid form to pure light, modern digital art with spiritual themes',
  10: 'A figure in meditation, their heart chakra radiating golden light, symbols of generosity floating around them - giving food, teachings, and protection, warm amber tones, sacred geometry patterns, contemporary Buddhist inspirational art',
  11: 'A magnificent seven-tiered pagoda temple, each level adorned with countless offerings, golden light streaming from each tier, set against a majestic mountain backdrop, architectural detail, traditional East Asian painting style',
  12: 'A person sitting in perfect stillness while the world around them changes rapidly - seasons passing, cities rising and falling, symbolizing the truth of cessation, time-lapse effect blended with meditation, conceptual art style',
  13: 'An ancient Buddhist scripture floating above a lotus pond, the text glowing with golden light, sacred geometry patterns emanating from the words, mystical atmosphere, traditional calligraphy meets digital art, reverent and scholarly',
  14: 'A jeweled stupa monument shining brilliantly, devotees circumambulating with offerings of flowers and light, the structure radiating spiritual energy, detailed architectural rendering, warm golden hour lighting, sacred pilgrimage site atmosphere',
  15: 'A person counting offerings, their expression showing the understanding that numbers are illusory, mathematical symbols dissolving into lotus flowers, conceptual piece about the nature of measurement and merit, abstract symbolic style',
  16: 'A humble person bowing to everyone they meet, seeing the Buddha in all beings, their form beginning to merge with those they bow to, unity consciousness theme, warm earthy colors, traditional narrative painting style',
  17: 'A single Buddha speaking, but his words manifesting as countless forms and teachings, streaming out like golden ribbons, transforming into lotus flowers and sacred texts, divine speech visualization, rich detailed composition',
  18: 'A person examining a precious gem, their reflection showing not their face but the nature of reality itself - light, emptiness, and interconnection, symbolic and philosophical, surreal style with sacred geometry',
  19: 'A vast assemblage of beings listening to the Buddha - humans, celestial beings, animals, all in harmony, gathered under an ancient tree, diverse community united in teaching, rich detailed narrative, traditional Buddhist mural style',
  20: 'A person receiving the teaching but not being attached to the words, the teachings manifesting as birds flying away into the sky, non-attachment theme, flowing composition, liberation symbolism, contemporary spiritual art',
  21: 'A perfectly still lake reflecting the complete landscape, but the reflection shows the ultimate nature of reality - interdependent and empty, philosophical visualization, minimalist style, profound stillness, meditation inspiration',
  22: 'A person speaking about the Dharma, their words not benefitting themselves but flowing outward to benefit all beings, golden speech bubbles transforming into helping hands, selfless giving theme, warm and compassionate imagery',
  23: 'An ordinary person and a Buddha walking side by side, their forms showing the subtle and gross manifestations of the same truth, comparative visualization showing transformation, spiritual journey theme, inspiring and hopeful',
  24: 'A person accumulating merit but understanding it like a dream - ethereal and insubstantial, floating above clouds of illusions, traditional Chinese landscape with spiritual symbolism, profound philosophical concept rendered visually',
  25: 'A woman appearing in different forms - sometimes as a teacher, sometimes as a servant, sometimes as royalty - all forms being expressions of the same truth, transformation theme, flowing metamorphic art style, mystical',
  26: 'A person examining their body part by part, each part dissolving into light and revealing its empty nature, analytical meditation visualization, contemporary digital art with spiritual themes, profound introspection',
  27: 'A person receiving praise and blame equally, both passing through them like wind through a screen, emotional equanimity visualization, balanced and symmetrical composition, zen minimalism style, inner peace represented visually',
  28: 'A person practicing generosity without attachment - giving freely while remaining unattached to the gift, the act of giving creating ripples of benefit spreading outward, compassionate action theme, warm and inspiring',
  29: 'The Buddha predicting a devotee\'s enlightenment, showing the future and present simultaneously, time represented as a flowing river rather than separate moments, non-dual time concept, mystical and prophetic imagery',
  30: 'A person transforming their body through wisdom, the physical form becoming a body of light and truth, transcendence visualization, ethereal and radiant, ascension theme, contemporary visionary art style',
  31: 'A person seeing through appearances - looking at a beautiful form and perceiving its empty nature directly, two-layered reality revealed, philosophical insight visualization, surrealist style with spiritual symbolism',
  32: 'A dreamlike scene - a bubble reflecting the world, a flash of lightning illuminating emptiness, dew drops on a spiderweb glistening with rainbow light, impermanence and illusion theme, ethereal and delicate, poetic visualization',
};

// GET - 获取章节配图提示词
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const chapterNum = parseInt(searchParams.get('chapter') || '0');

  if (chapterNum < 1 || chapterNum > 32) {
    return NextResponse.json(
      { error: 'Invalid chapter number' },
      { status: 400 }
    );
  }

  const prompt = chapterImagePrompts[chapterNum] || generateDefaultPrompt(chapterNum);

  return NextResponse.json({
    chapterNum,
    prompt,
    style: 'Buddhist spiritual art, traditional Chinese painting influence, contemplative and peaceful mood, golden and earth tones'
  });
}

// POST - 生成并保存章节配图信息
export async function POST(request: NextRequest) {
  const session = await getSession();

  if (!assertSessionUser(session)) {
    return NextResponse.json(
      { error: '未登录' },
      { status: 401 }
    );
  }

  const user = session.user;
  if (user.role !== 'ADMIN') {
    return NextResponse.json(
      { error: '需要管理员权限' },
      { status: 403 }
    );
  }

  const body = await request.json();
  const { chapterNum, imageUrl } = body;

  if (!chapterNum || !imageUrl) {
    return NextResponse.json(
      { error: '缺少必要参数' },
      { status: 400 }
    );
  }

  try {
    // 更新章节配图
    const updated = await prisma.chapter.updateMany({
      where: { chapterNum },
      data: {
        imageUrl,
        imagePrompt: chapterImagePrompts[chapterNum] || generateDefaultPrompt(chapterNum),
      },
    });

    return NextResponse.json({ success: true, updated });
  } catch (error) {
    console.error('保存章节配图失败:', error);
    return NextResponse.json(
      { error: '保存章节配图失败' },
      { status: 500 }
    );
  }
}

function generateDefaultPrompt(chapterNum: number): string {
  return `Diamond Sutra Chapter ${chapterNum}, Buddhist temple setting, serene meditation scene, traditional Chinese art style, golden light, lotus flowers, peaceful and contemplative mood, spiritual and transcendental atmosphere, earthy tones with gold accents`;
}
