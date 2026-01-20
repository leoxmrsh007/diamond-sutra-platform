import { NextResponse } from 'next/server';

export const dynamic = 'force-static';
export const fetchCache = 'force-cache';
import { prisma } from '@/lib/prisma';

export async function POST() {
  try {
    console.log('Starting verses seed...');

    // Find the Diamond Sutra
    const sutra = await prisma.sutra.findUnique({
      where: { slug: 'diamond-sutra' },
    });

    if (!sutra) {
      return NextResponse.json(
        { success: false, error: 'Sutra not found. Please run /api/seed/chapters first.' },
        { status: 400 }
      );
    }

    // 61 verses using ASCII for Chinese characters
    const verses = [
      { chapter: 1, num: 1, chinese: 'Ru shi wo wen. Yi shi Fo...', sanskrit: 'Evam maya srutam ekasmin samaye', english: 'Thus have I heard. At one time the Buddha was dwelling in Jeta Grove of Anathapindada at Sravasti.' },
      { chapter: 1, num: 2, chinese: 'Shi shi Shi Jia Mou Ni Fo...', sanskrit: 'Tena kho pana samayena', english: 'At that time the World-Honored One donned his robe, took his bowl, entered Sravasti for alms, then returned, ate, put away his robe and bowl, washed his feet, and sat down properly.' },
      { chapter: 2, num: 1, chinese: 'Shi Shi Shan Xian Qi Bai Fo yan...', sanskrit: 'Atha kho Subhutir', english: 'Then the venerable Subhuti rose from the assembly, bared his right shoulder, knelt on his right knee, joined his palms, and praised the Buddha’s care for bodhisattvas.' },
      { chapter: 2, num: 2, chinese: 'Fo yun: Shan Zai Shan Zai...', sanskrit: 'Bhagavan aha', english: 'The Buddha said: “Excellent, excellent, Subhuti. As you have said, the Tathagata compassionately protects and entrusts the bodhisattvas.”' },
      { chapter: 3, num: 1, chinese: 'Fo yun: Zhu Pu Sa Mo Sa...', sanskrit: 'Bodhisatva mahasattva', english: 'All great bodhisattvas should liberate innumerable beings, yet ultimately perceive no being as actually liberated.' },
      { chapter: 3, num: 2, chinese: 'Ru fo zai shi She Wang Cheng...', sanskrit: 'Svatthi marapasya', english: 'Subhuti, if a bodhisattva retains the notions of self, others, beings, or lifespan, he is not a true bodhisattva.' },
      { chapter: 4, num: 1, chinese: 'Fo yun: Fu chi shi shi...', sanskrit: 'Dana paramita', english: 'A bodhisattva should give without dwelling anywhere, not attached to form, sound, smell, taste, touch, or dharmas.' },
      { chapter: 4, num: 2, chinese: 'Ru shi zhu zhu xiang fei xiang...', sanskrit: 'Sarva dharma', english: 'Just as space in all directions cannot be grasped, so the merit of non-abiding giving is beyond conception.' },
      { chapter: 5, num: 1, chinese: 'Fo yun: Shi Shi Shan Xian...', sanskrit: 'Subhuti na manyase', english: 'Subhuti, you cannot see the Tathagata by bodily marks; the marks the Tathagata speaks of are not truly marks.' },
      { chapter: 5, num: 2, chinese: 'Ke yi san shi er xiang...', sanskrit: 'Trimsad-maha-purusa-laksana', english: 'All appearances are illusory; if one sees that all appearances are not appearances, one sees the Tathagata.' },
      { chapter: 6, num: 1, chinese: 'Fo yun: Shan Zai Shan Zai...', sanskrit: 'Sadhu sadhu Subhute', english: 'The Buddha praised Subhuti three times, affirming the teaching of non-attachment in giving.' },
      { chapter: 6, num: 2, chinese: 'Ru ren man San Qian Da Qian Shi Jie...', sanskrit: 'Trisahasra-mahasahasra-loka-dhatu', english: 'Even if one filled three thousand great thousand worlds with jewels and gave them away, the merit would be less than that of upholding this sutra.' },
      { chapter: 7, num: 1, chinese: 'Fo yun: Shi Shi Shan Xian...', sanskrit: 'Subhuti na manyase', english: 'Subhuti, does the Tathagata obtain unsurpassed enlightenment? Is there any dharma the Tathagata truly speaks? There is none fixed.' },
      { chapter: 7, num: 2, chinese: 'Ru Lai Suo shuo Fa...', sanskrit: 'Tathagato dharma', english: 'All dharmas the Tathagata expounds cannot be grasped or spoken; sages are distinguished by realizing unconditioned dharma.' },
      { chapter: 8, num: 1, chinese: 'Fo yun: Shi Shi Shan Xian...', sanskrit: 'Subhuti na manyase', english: 'Giving material treasures of the whole cosmos is less meritorious than upholding even four lines of this sutra.' },
      { chapter: 8, num: 2, chinese: 'Ruo ren yi Man Na Heng He Sha deng qi bao...', sanskrit: 'Mani-ratna', english: 'All Buddhas and their unsurpassed enlightenment arise from this very sutra.' },
      { chapter: 9, num: 1, chinese: 'Fo yun: Shi Shi Shan Xian...', sanskrit: 'Subhuti na manyase', english: 'A stream-enterer does not conceive of attaining the fruit; entering the stream means no attachment to the six sense objects.' },
      { chapter: 9, num: 2, chinese: 'Ru Lai de A Na Han Guo...', sanskrit: 'Arhat-phala', english: 'An arhat does not think “I have attained arhatship,” for there is no actual dharma called arhat.' },
      { chapter: 10, num: 1, chinese: 'Fo yun: Shi Shi Shan Xian...', sanskrit: 'Subhuti na manyase', english: 'One cannot adorn a Buddha-land through signs; the Buddha-land adorned is no adornment at all.' },
      { chapter: 10, num: 2, chinese: 'Zhu Pu Sa Mo Sa...', sanskrit: 'Bodhisatva mahasattva', english: 'Bodhisattvas should give rise to a pure mind not relying on any form or attribute.' },
      { chapter: 11, num: 1, chinese: 'Fo yun: Shi Shi Shan Xian...', sanskrit: 'Subhuti na manyase', english: 'If someone filled as many worlds as the Ganges has sands with the seven treasures for giving, the merit still cannot compare to upholding this sutra.' },
      { chapter: 11, num: 2, chinese: 'Ru ren yi san qian da qian shi jie...', sanskrit: 'Trisahasra-mahasahasra-loka-dhatu', english: 'The merit of this sutra surpasses measure; even sharing a single stanza brings immeasurable blessings.' },
      { chapter: 12, num: 1, chinese: 'Fo yun: Shi Shi Shan Xian...', sanskrit: 'Subhuti na manyase', english: 'Revere even four lines of this sutra more than countless offerings; it should be upheld and honored everywhere.' },
      { chapter: 12, num: 2, chinese: 'Sui shuo san shi er zi...', sanskrit: 'Trimsad-akshara', english: 'The sutra is named “Diamond Cutter Prajna Paramita”; one should explain its profound meaning to others.' },
      { chapter: 13, num: 1, chinese: 'Fo yun: Shi Shi Shan Xian...', sanskrit: 'Subhuti na manyase', english: 'Subhuti asked how to name and uphold this sutra; the Buddha explained its title and merit.' },
      { chapter: 13, num: 2, chinese: 'Shi Jing ming Wei...', sanskrit: 'Sutra-nama', english: 'It should be known as the Diamond Sutra; practicing it brings immeasurable blessings.' },
      { chapter: 14, num: 1, chinese: 'Fo yun: Shi Shi Shan Xian...', sanskrit: 'Subhuti na manyase', english: 'Patience paramita, the Buddha says, is not patience; thus it is called the perfection of patience.' },
      { chapter: 14, num: 2, chinese: 'Ru shi yin qie shi shou chi...', sanskrit: 'Ksanti-paramita', english: 'The Tathagata recalls being reviled and harmed by King Kalinga yet held no hatred; he relies on formless patience.' },
      { chapter: 15, num: 1, chinese: 'Fo yun: Shi Shi Shan Xian...', sanskrit: 'Subhuti na manyase', english: 'The merit from upholding this sutra cannot be measured, far surpassing any calculation.' },
      { chapter: 15, num: 2, chinese: 'Ru ren yi san qian da qian shi jie...', sanskrit: 'Trisahasra-mahasahasra-loka-dhatu', english: 'Even if one filled innumerable worlds with treasures, that merit would still fall short of this sutra’s merit.' },
      { chapter: 16, num: 1, chinese: 'Fo yun: Shi Shi Shan Xian...', sanskrit: 'Subhuti na manyase', english: 'Whoever upholds and recites this sutra will be known and protected by the Buddhas.' },
      { chapter: 16, num: 2, chinese: 'Ru ren shou chi shi jing...', sanskrit: 'Dharana', english: 'The Buddha knows and sees all who recite, study, or copy this sutra; their merit is inconceivable.' },
      { chapter: 17, num: 1, chinese: 'Fo yun: Shi Shi Shan Xian...', sanskrit: 'Subhuti na manyase', english: 'When bodhisattvas practice giving with a mind free from marks, their blessings are beyond measure.' },
      { chapter: 17, num: 2, chinese: 'Shuo fo fa fei fa...', sanskrit: 'Dharma adharma', english: 'Subhuti, if goodness had substance, the Tathagata would not have spoken of good fortune.' },
      { chapter: 18, num: 1, chinese: 'Fo yun: Shi Shi Shan Xian...', sanskrit: 'Subhuti na manyase', english: 'If one cannot be attached even to meritorious virtues, how much more should one not cling to non-virtue.' },
      { chapter: 18, num: 2, chinese: 'Ru Lai yi tian yan...', sanskrit: 'Divya-caksus', english: 'The Tathagata possesses the Buddha eye, surpassing heavenly, fleshly, wisdom, and Dharma eyes.' },
      { chapter: 19, num: 1, chinese: 'Fo yun: Shi Shi Shan Xian...', sanskrit: 'Subhuti na manyase', english: 'If someone gives immeasurable treasures, the merit is still not truly merit; only non-abiding giving is true giving.' },
      { chapter: 19, num: 2, chinese: 'Fo yan: Zhu Pu Sa Mo Sa...', sanskrit: 'Bodhisatva mahasattva', english: 'As many dharmas as beings comprehend are not real dharmas; therefore they are called dharmas.' },
      { chapter: 20, num: 1, chinese: 'Fo yun: Shi Shi Shan Xian...', sanskrit: 'Subhuti na manyase', english: 'One cannot behold the Tathagata through the thirty-two marks; they are not the true Tathagata.' },
      { chapter: 20, num: 2, chinese: 'Ke yi jiu xiang...', sanskrit: 'Samyak-laksana', english: 'If the thirty-two marks were the Tathagata, then a wheel-turning king would also be a Buddha.' },
      { chapter: 21, num: 1, chinese: 'Fo yun: Shi Shi Shan Xian...', sanskrit: 'Subhuti na manyase', english: 'The Tathagata has truly spoken no dharma; it is only according to worldly conventions.' },
      { chapter: 21, num: 2, chinese: 'Ru Lai suo shuo fa...', sanskrit: 'Tathagato dharma', english: 'The dharma spoken by the Tathagata is neither graspable nor expressive; it is neither dharma nor non-dharma.' },
      { chapter: 22, num: 1, chinese: 'Fo yun: Shi Shi Shan Xian...', sanskrit: 'Subhuti na manyase', english: 'No dharma can be obtained; thus it is called unsurpassed complete enlightenment.' },
      { chapter: 22, num: 2, chinese: 'Wu fa ke de...', sanskrit: 'Na labhyate dharmah', english: 'Bodhisattvas relying on this teaching should generate a mind free from attachment to any dharma.' },
      { chapter: 23, num: 1, chinese: 'Fo yun: Shi Shi Shan Xian...', sanskrit: 'Subhuti na manyase', english: 'All dharmas are equal and without distinction; therefore they are named unsurpassed enlightenment.' },
      { chapter: 23, num: 2, chinese: 'Shi fa ping deng...', sanskrit: 'Sama-dharma', english: 'There is no fixed dharma called unsurpassed enlightenment, yet the sages attained it.' },
      { chapter: 24, num: 1, chinese: 'Fo yun: Shi Shi Shan Xian...', sanskrit: 'Subhuti na manyase', english: 'Giving even countless jewels does not equal sharing as little as four lines of this sutra.' },
      { chapter: 24, num: 2, chinese: 'Ruo san qian da qian shi jie...', sanskrit: 'Trisahasra-mahasahasra-loka-dhatu', english: 'Because all Buddhas arise from this sutra, its merit surpasses any giving of treasures.' },
      { chapter: 25, num: 1, chinese: 'Fo yun: Shi Shi Shan Xian...', sanskrit: 'Subhuti na manyase', english: 'The Tathagata liberates beings, yet no being has been liberated; if there were attachment, it would not be liberation.' },
      { chapter: 25, num: 2, chinese: 'Yu yi ru lai...', sanskrit: 'Tathagata', english: 'If there were anything attained by the Tathagata, he would not be called the Tathagata.' },
      { chapter: 26, num: 1, chinese: 'Fo yun: Shi Shi Shan Xian...', sanskrit: 'Subhuti na manyase', english: 'The Tathagata cannot be seen through the thirty-two marks; such marks are merely worldly appearances.' },
      { chapter: 26, num: 2, chinese: 'Wu ke yi san shi er xiang...', sanskrit: 'Trimsad-maha-purusa-laksana', english: 'If one could see the Tathagata through the thirty-two marks, then a wheel-turning king would also be a Buddha.' },
      { chapter: 27, num: 1, chinese: 'Fo yun: Shi Shi Shan Xian...', sanskrit: 'Subhuti na manyase', english: 'The Dharma that the Tathagata speaks has no reality to be obtained or destroyed.' },
      { chapter: 27, num: 2, chinese: 'Fo shuo fo fa...', sanskrit: 'Tathagato dharma', english: 'Subhuti, if someone says the Tathagata expounds the Dharma, such a statement is false.' },
      { chapter: 28, num: 1, chinese: 'Fo yun: Shi Shi Shan Xian...', sanskrit: 'Subhuti na manyase', english: 'Bodhisattvas should give without dwelling in merit or reward.' },
      { chapter: 28, num: 2, chinese: 'Zhu Pu Sa Mo Sa...', sanskrit: 'Bodhisatva mahasattva', english: 'Bodhisattvas who benefit beings should do so without attachment to beings or self.' },
      { chapter: 29, num: 1, chinese: 'Fo yun: Shi Shi Shan Xian...', sanskrit: 'Subhuti na manyase', english: 'The Tathagata neither comes nor goes; he is beyond dualistic notions of arrival and departure.' },
      { chapter: 29, num: 2, chinese: 'Ru Lai lai qu...', sanskrit: 'Tathagata agacchati', english: 'The Tathagata does not come from anywhere nor go to anywhere; he abides in suchness.' },
      { chapter: 30, num: 1, chinese: 'Fo yun: Shi Shi Shan Xian...', sanskrit: 'Subhuti na manyase', english: 'One aggregate is not an aggregate; that is why it is called an aggregate.' },
      { chapter: 30, num: 2, chinese: 'Yi he xiang li...', sanskrit: 'Eka-skandha', english: 'All phenomena that seem united are ultimately empty of inherent nature.' },
      { chapter: 31, num: 1, chinese: 'Fo yun: Shi Shi Shan Xian...', sanskrit: 'Subhuti na manyase', english: 'Those who generate the bodhi mind should not speak of cutting off phenomena.' },
      { chapter: 31, num: 2, chinese: 'Fo shuo pu sa shou chi...', sanskrit: 'Bodhisatva dharana', english: 'Bodhisattvas should uphold this sutra by dwelling nowhere and generating a mind of great compassion.' },
      { chapter: 32, num: 1, chinese: 'Fo yun: Shi Shi Shan Xian...', sanskrit: 'Subhuti na manyase', english: 'All conditioned dharmas are like dreams, illusions, bubbles, and shadows; like dew or lightning; thus should one contemplate them.' },
      { chapter: 32, num: 2, chinese: 'Ying hua fei zhen...', sanskrit: 'Rupam avidyamana', english: 'If one views forms as real, that view is already inverted; reliability lies only in the formless truth.' },
    ];

    let created = 0;
    for (const verse of verses) {
      // Find the chapter
      const chapter = await prisma.chapter.findFirst({
        where: {
          sutraId: sutra.id,
          chapterNum: verse.chapter,
        },
      });

      if (!chapter) {
        console.error(`Chapter ${verse.chapter} not found`);
        continue;
      }

      await prisma.verse.upsert({
        where: {
          chapterId_verseNum: { chapterId: chapter.id, verseNum: verse.num },
        },
        update: {
          chinese: verse.chinese,
          sanskrit: verse.sanskrit,
          english: verse.english,
        },
        create: {
          chapterId: chapter.id,
          verseNum: verse.num,
          chinese: verse.chinese,
          sanskrit: verse.sanskrit,
          english: verse.english,
          aiKeyword: [],
        },
      });
      created++;
    }

    console.log(`Created ${created} verses`);

    return NextResponse.json({
      success: true,
      message: `Created ${created} verses`,
      sutraId: sutra.id,
      versesCreated: created,
    });
  } catch (error) {
    console.error('Seeding error:', error);
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
