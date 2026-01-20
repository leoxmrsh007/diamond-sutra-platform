import { NextResponse } from 'next/server';

export const dynamic = 'force-static';
export const fetchCache = 'force-cache';
import { prisma } from '@/lib/prisma';

export async function POST() {
  try {
    console.log('Starting chapters seed...');

    // Create or update the Diamond Sutra
    const sutra = await prisma.sutra.upsert({
      where: { slug: 'diamond-sutra' },
      update: {},
      create: {
        title: 'Diamond Sutra (Vajracchedika Prajnaparamita Sutra)',
        titleSanskrit: 'Vajracchedika Prajnaparamita Sutra',
        titleTibetan: 'Vajracchedika Prajnaparamita Sutra',
        slug: 'diamond-sutra',
        description: 'The Diamond Sutra is one of the most influential Mahayana sutras in East Asian Buddhism.',
        order: 1,
      },
    });

    console.log('Created sutra:', sutra.id);

    // 32 chapters with ASCII titles to avoid encoding issues
    const chapters = [
      { num: 1, title: 'Fa Hui You Fen Di Yi', summary: 'Origin of the Dharma assembly.' },
      { num: 2, title: 'Shan Xian Qi Qing Fen Di Er', summary: 'Subhuti asks about bodhicitta.' },
      { num: 3, title: 'Da Cheng Zheng Zong Fen Di San', summary: 'Buddha explains giving without attachment.' },
      { num: 4, title: 'Miao Xing Wu Zhu Fen Di Si', summary: 'Giving without dwelling on forms.' },
      { num: 5, title: 'Ru Li Shi Jian Fen Di Wu', summary: 'Cannot see Tathagata by physical form.' },
      { num: 6, title: 'Zheng Xin Xi You Fen Di Liu', summary: 'Virtue of upholding this sutra is inconceivable.' },
      { num: 7, title: 'Wu De Wu Shuo Fen Di Qi', summary: 'Dharma cannot be grasped or spoken.' },
      { num: 8, title: 'Yi Fa Chu Sheng Fen Di Ba', summary: 'All Buddhas arise from this sutra.' },
      { num: 9, title: 'Yi Xiang Wu Xiang Fen Di Jiu', summary: 'Four fruits have no fixed form.' },
      { num: 10, title: 'Zhuang Yan Jing Tu Fen Di Shi', summary: 'Adorning Buddha-land is not adorning.' },
      { num: 11, title: 'Wei Wei Fu Sheng Fen Di Shi Yi', summary: 'Virtue of upholding surpasses material giving.' },
      { num: 12, title: 'Zun Zhong Zheng Jiao Fen Di Shi Er', summary: 'Even four verses should be revered.' },
      { num: 13, title: 'Ru Fa Shou Chi Fen Di Shi San', summary: 'How to uphold and name this sutra.' },
      { num: 14, title: 'Li Xiang Ji Mie Fen Di Shi Si', summary: 'Patience paramita and all marks are empty.' },
      { num: 15, title: 'Chi Jing Gong De Fen Di Shi Wu', summary: 'Inconceivable virtue of upholding this sutra.' },
      { num: 16, title: 'Neng Jing Ye Zhang Fen Di Shi Liu', summary: 'Can cleanse karma by upholding this sutra.' },
      { num: 17, title: 'Jiu Jing Wu Wo Fen Di Shi Qi', summary: 'All dharmas are without self.' },
      { num: 18, title: 'Yi Ti Tong Guan Fen Di Shi Ba', summary: 'Five eyes and sands of Ganges River.' },
      { num: 19, title: 'Fa Jie Tong Hua Fen Di Shi Jiu', summary: 'Virtue is not virtue, is called virtue.' },
      { num: 20, title: 'Li Se Li Xiang Fen Di Er Shi', summary: 'Cannot see Tathagata with complete marks.' },
      { num: 21, title: 'Fe Shuo Suo Shuo Fen Di Er Shi Yi', summary: 'Tathagata speaks no dharma, is called speaking.' },
      { num: 22, title: 'Wu Fa Ke De Fen Di Er Shi Er', summary: 'No dharma can be attained.' },
      { num: 23, title: 'Jing Xin Xing Shan Fen Di Er Shi San', summary: 'Dharma is equal, is called anuttara-samyak-sambodhi.' },
      { num: 24, title: 'Fu Zhi Wu Bi Fen Di Er Shi Si', summary: 'Four verses surpass giving seven jewels.' },
      { num: 25, title: 'Hua Wu Suo Hua Fen Di Er Shi Wu', summary: 'No being can be liberated by Tathagata.' },
      { num: 26, title: 'Fa Shen Fei Xiang Fen Di Er Shi Liu', summary: 'Should not view Tathagata by 32 marks.' },
      { num: 27, title: 'Wu Duan Wu Mie Fen Di Er Shi Qi', summary: 'Dharma is neither cut off nor extinguished.' },
      { num: 28, title: 'Bu Shou Bu Tan Fen Di Er Shi Ba', summary: 'Bodhisattvas do not receive merit.' },
      { num: 29, title: 'Wei Yi Ji Jing Fen Di Er Shi Jiu', summary: 'Tathagata comes from nowhere, goes nowhere.' },
      { num: 30, title: 'Yi He Xiang Li Fen Di San Shi', summary: 'One aggregate is not one aggregate.' },
      { num: 31, title: 'Zhi Jian Bu Sheng Fen Di San Shi Yi', summary: 'Do not speak of cutting off.' },
      { num: 32, title: 'Ying Hua Fei Zhen Fen Di Er Shi Er', summary: 'All conditioned phenomena are like a dream.' },
    ];

    let created = 0;
    for (const chapter of chapters) {
      await prisma.chapter.upsert({
        where: {
          sutraId_chapterNum: { sutraId: sutra.id, chapterNum: chapter.num },
        },
        update: {
          title: chapter.title,
          summary: chapter.summary,
        },
        create: {
          sutraId: sutra.id,
          chapterNum: chapter.num,
          title: chapter.title,
          summary: chapter.summary,
          order: chapter.num,
        },
      });
      created++;
    }

    console.log(`Created ${created} chapters`);

    return NextResponse.json({
      success: true,
      message: `Created ${created} chapters`,
      sutraId: sutra.id,
      chaptersCreated: created,
    });
  } catch (error) {
    console.error('Seeding error:', error);
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
