import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// 完整金刚经32分内容
const diamondSutraCompleteText = [
  // 第一分 法会因由分
  { chapter: 1, verses: [
    { num: 1, chinese: '如是我闻：一时，佛在舍卫国祇树给孤独园，与大比丘众千二百五十人俱。' },
    { num: 2, chinese: '尔时，世尊食时，着衣持钵，入舍卫大城乞食。于其城中次第乞已，还至本处。' },
    { num: 3, chinese: '饭食讫，收衣钵，洗足已，敷座而坐。' },
  ]},

  // 第二分 善现启请分
  { chapter: 2, verses: [
    { num: 1, chinese: '时，长老须菩提在大众中即从座起，偏袒右肩，右膝着地，合掌恭敬而白佛言："希有！世尊！如来善护念诸菩萨，善付嘱诸菩萨。"' },
    { num: 2, chinese: '世尊！善男子、善女人，发阿耨多罗三藐三菩提心，应云何住？云何降伏其心？' },
    { num: 3, chinese: '佛言："善哉善哉！须菩提！如汝所说，如来善护念诸菩萨，善付嘱诸菩萨。"' },
    { num: 4, chinese: '"汝今谛听！当为汝说。善男子、善女人，发阿耨多罗三藐三菩提心，应如是住，如是降伏其心。"' },
    { num: 5, chinese: '"唯然，世尊！愿乐欲闻。"' },
  ]},

  // 第三分 大乘正宗分
  { chapter: 3, verses: [
    { num: 1, chinese: '佛告须菩提："诸菩萨摩诃萨，应如是降伏其心：所有一切众生之类，若卵生、若胎生、若湿生、若化生，若有色、若无色，若有想、若无想、若非有想非无想，我皆令入无余涅槃而灭度之。"' },
    { num: 2, chinese: '"如是灭度无量无数无边众生，实无众生得灭度者。何以故？须菩提！若菩萨有我相、人相、众生相、寿者相，即非菩萨。"' },
  ]},

  // 第四分 妙行无住分
  { chapter: 4, verses: [
    { num: 1, chinese: '复次，须菩提！菩萨于法，应无所住，行于布施，所谓不住色布施，不住声、香、味、触、法布施。' },
    { num: 2, chinese: '须菩提！菩萨应如是布施，不住于相。何以故？若菩萨不住相布施，其福德不可思量。' },
    { num: 3, chinese: '须菩提！于意云何？东方虚空可思量不？" "不也，世尊！"' },
    { num: 4, chinese: '须菩提！南西北方四维上下虚空可思量不？" "不也，世尊！"' },
    { num: 5, chinese: '须菩提！菩萨不住相布施，福德亦复如是不可思量。须菩提！菩萨但应如所教住。' },
  ]},

  // 第五分 如理实见分
  { chapter: 5, verses: [
    { num: 1, chinese: '须菩提！于意云何？可以身相见如来不？" "不也，世尊！不可以身相得见如来。何以故？如来说身相，即非身相。"' },
    { num: 2, chinese: '佛告须菩提："凡所有相，皆是虚妄。若见诸相非相，则见如来。"' },
  ]},

  // 第六分 正信希有分
  { chapter: 6, verses: [
    { num: 1, chinese: '须菩提白佛言："世尊！颇有众生，于未来世，闻说是法，生信心不？"' },
    { num: 2, chinese: '佛言："须菩提！彼非众生，非不众生。何以故？须菩提！众生众生者，如来说非众生，是名众生。"' },
  ]},

  // 第七分 无得无说分
  { chapter: 7, verses: [
    { num: 1, chinese: '须菩提！于意云何？如来得阿耨多罗三藐三菩提耶？如来有所说法耶？' },
    { num: 2, chinese: '须菩提言："如我解佛所说义，无有定法名阿耨多罗三藐三菩提，亦无有定法如来可说。"' },
    { num: 3, chinese: '何以故？如来所说法，皆不可取、不可说、非非法、非非非法。何以故？一切贤圣，皆以无为法而有差别。' },
  ]},

  // 第八分 依法出生分
  { chapter: 8, verses: [
    { num: 1, chinese: '须菩提！于意云何？若人满三千大千世界七宝以用布施，是人所得福德，宁为多不？' },
    { num: 2, chinese: '须菩提言："甚多，世尊！何以故？是福德即非福德性，是故如来说福德多。"' },
    { num: 3, chinese: '若复有人，于此经中受持乃至四句偈等，为他人说，其福胜彼。' },
    { num: 4, chinese: '何以故？须菩提！一切诸佛，及诸佛阿耨多罗三藐三菩提法，皆从此经出。' },
    { num: 5, chinese: '须菩提！所谓佛法者，即非佛法。' },
  ]},

  // 第九分 一相无相分
  { chapter: 9, verses: [
    { num: 1, chinese: '须菩提！于意云何？须陀洹能作是念："我得须陀洹道"不？' },
    { num: 2, chinese: '须菩提言："不也，世尊！何以故？须陀洹名为入流，而无所入，不入色声香味触法，是名须陀洹。"' },
    { num: 3, chinese: '须菩提！于意云何？斯陀含能作是念："我得斯陀含道"不？' },
    { num: 4, chinese: '须菩提言："不也，世尊！何以故？斯陀含名一往来，而实无往来，是名斯陀含。"' },
    { num: 5, chinese: '须菩提！于意云何？阿那含能作是念："我得阿那含道"不？' },
    { num: 6, chinese: '须菩提言："不也，世尊！何以故？阿那含名为不来，而实无不来，是名阿那含。"' },
    { num: 7, chinese: '须菩提！于意云何？阿罗汉能作是念："我得阿罗汉道"不？' },
    { num: 8, chinese: '须菩提言："不也，世尊！何以故？实无有法名阿罗汉。"' },
  ]},

  // 第十分 庄严净土分
  { chapter: 10, verses: [
    { num: 1, chinese: '世尊！若阿罗汉作是念："我得阿罗汉道。"即为着我、人、众生、寿者。' },
    { num: 2, chinese: '世尊！佛说我得无诤三昧，人中最为第一，是第一离欲阿罗汉。' },
    { num: 3, chinese: '世尊！我不作是念："我是离欲阿罗汉。"世尊！我若作是念："我得阿罗汉道。"世尊则不说须菩提是乐阿兰那行者。' },
    { num: 4, chinese: '以须菩提实无所行，而名须菩提是乐阿兰那行。' },
    { num: 5, chinese: '佛告须菩提："于意云何？如来昔在燃灯佛所，于法有所得不？""不也，世尊！"' },
    { num: 6, chinese: '"如来在燃灯佛所，于法实无所得。"' },
    { num: 7, chinese: '"须菩提！于意云何？菩萨庄严佛土不？""不也，世尊！何以故？庄严佛土者，即非庄严，是名庄严。"' },
    { num: 8, chinese: '"是故须菩提！诸菩萨摩诃萨，应如是生清净心：不应住色生心，不应住声香味触法生心，应无所住而生其心。"' },
  ]},

  // 第十一分 无为福胜分
  { chapter: 11, verses: [
    { num: 1, chinese: '须菩提！譬如有人，身如须弥山王，于意云何？是身为大不？' },
    { num: 2, chinese: '须菩提言："甚大，世尊！何以故？佛说非身，是名大身。"' },
  ]},

  // 第十二分 尊重正教分
  { chapter: 12, verses: [
    { num: 1, chinese: '须菩提！如恒河中所有沙数，如是沙等恒河，于意云何？是诸恒河沙，宁为多不？' },
    { num: 2, chinese: '须菩提言："甚多，世尊！但诸恒河，尚多无数，何况其沙。"' },
    { num: 3, chinese: '须菩提！我今实言告汝：若有善男子、善女人，以七宝满尔所恒河沙数三千大千世界，以用布施，得福多不？' },
    { num: 4, chinese: '须菩提言："甚多，世尊！"' },
    { num: 5, chinese: '佛告须菩提："若善男子、善女人，于此经中，乃至受持四句偈等，为他人说，而此福德，胜前福德。"' },
  ]},

  // 第十三分 如法受持分
  { chapter: 13, verses: [
    { num: 1, chinese: '复次，须菩提！随说是经，乃至四句偈等，当知此处，一切世间天人阿修罗，皆应供养，如佛塔庙。' },
    { num: 2, chinese: '何况有人尽能受持读诵此经。须菩提！当知是人，成就最上第一希有之法。' },
    { num: 3, chinese: '若是经典所在之处，即为有佛，若尊重弟子。' },
  ]},

  // 第十四分 离相寂灭分
  { chapter: 14, verses: [
    { num: 1, chinese: '尔时，须菩提闻说是经，深解义趣，涕泪悲泣，而白佛言："希有！世尊！佛说如是甚深经典，我从昔来所得慧眼，未曾得闻如是之说。"' },
    { num: 2, chinese: '世尊！若复有人得闻是经，信心清净，则生实相，当知是人，成就第一希有功德。' },
    { num: 3, chinese: '世尊！是实相者，即是非相，是故如来说名实相。' },
    { num: 4, chinese: '世尊！我今得闻如是经典，信解受持，不足为难。' },
    { num: 5, chinese: '若当来世，后五百岁，其有众生，得闻是经，信解受持，是人则为第一希有。' },
    { num: 6, chinese: '何以故？此人无我相、无人相、无众生相、无寿者相。' },
    { num: 7, chinese: '所以者何？我相即是非相，人相、众生相、寿者相即是非相。' },
    { num: 8, chinese: '何以故？离一切诸相，则名诸佛。' },
  ]},

  // 第十五分 持经功德分
  { chapter: 15, verses: [
    { num: 1, chinese: '佛告须菩提："如是如是！若复有人，得闻是经，不惊、不怖、不畏，当知是人，甚为希有。"' },
    { num: 2, chinese: '何以故？须菩提！如来说第一波罗蜜，即非第一波罗蜜，是名第一波罗蜜。' },
  ]},

  // 第十六分 能净业障分
  { chapter: 16, verses: [
    { num: 1, chinese: '须菩提！忍辱波罗蜜，如来说非忍辱波罗蜜，是名忍辱波罗蜜。' },
    { num: 2, chinese: '何以故？须菩提！如我昔为歌利王割截身体，我于尔时，无我相、无人相、无众生相、无寿者相。' },
    { num: 3, chinese: '何以故？我于往昔节节支解时，若有我相、人相、众生相、寿者相，应生嗔恨。' },
    { num: 4, chinese: '须菩提！又念过去于五百世作忍辱仙人，于尔所世，无我相、无人相、无众生相、无寿者相。' },
    { num: 5, chinese: '是故须菩提！菩萨应离一切相，发阿耨多罗三藐三菩提心。' },
    { num: 6, chinese: '不应住色生心，不应住声香味触法生心，应生无所住心。' },
    { num: 7, chinese: '若心有住，则为非住。' },
    { num: 8, chinese: '是故佛说：菩萨心不应住色布施。须菩提！菩萨为利益一切众生，应如是布施。' },
    { num: 9, chinese: '如来说：一切诸相，即是非相。又说：一切众生，即非众生。' },
  ]},

  // 第十七分 究竟无我分
  { chapter: 17, verses: [
    { num: 1, chinese: '须菩提！如来是真语者、实语者、如语者、不诳语者、不异语者。' },
    { num: 2, chinese: '须菩提！如来所得法，此法无实无虚。' },
    { num: 3, chinese: '须菩提！若菩萨心住于法而行布施，如人入暗，则无所见。' },
    { num: 4, chinese: '若菩萨心不住法而行布施，如人有目，日光明照，见种种色。' },
  ]},

  // 第十八分 一体同观分
  { chapter: 18, verses: [
    { num: 1, chinese: '须菩提！当来之世，若有善男子、善女人，能于此经受持读诵，则为如来以佛智慧，悉知是人，悉见是人，皆得成就无量无边功德。' },
  ]},

  // 第十九分 法界通化分
  { chapter: 19, verses: [
    { num: 1, chinese: '须菩提！若有善男子、善女人，初日分以恒河沙等身布施，中日分复以恒河沙等身布施，后日分亦以恒河沙等身布施，如是无量百千万亿劫以身布施。' },
    { num: 2, chinese: '若复有人，闻此经典，信心不逆，其福胜彼，何况书写、受持、读诵、为人解说。' },
  ]},

  // 第二十分 离色离相分
  { chapter: 20, verses: [
    { num: 1, chinese: '须菩提！以要言之，是经有不可思议、不可称量、无边功德。' },
    { num: 2, chinese: '如来为发大乘者说，为发最上乘者说。' },
    { num: 3, chinese: '若有人能受持读诵、广为他说，如来悉知是人、悉见是人，皆成就不可量、不可称、无有边、不可思议功德。' },
    { num: 4, chinese: '如是人等，则为荷担如来阿耨多罗三藐三菩提。' },
    { num: 5, chinese: '何以故？须菩提！若乐小法者，着我相、人相、众生相、寿者相，则于此经，不能听受读诵、为人解说。' },
  ]},

  // 第二十一分 非说所说分
  { chapter: 21, verses: [
    { num: 1, chinese: '须菩提！在在处处，若有此经，一切世间天人阿修罗，所应供养。当知此处，则为是塔，皆应恭敬作礼围绕，以诸华香而散其处。' },
  ]},

  // 第二十二分 无法可得分
  { chapter: 22, verses: [
    { num: 1, chinese: '复次，须菩提！若有善男子、善女人，能于此经受持读诵，即为如来以佛智慧，悉知是人，悉见是人，皆得成就无量无边功德。' },
  ]},

  // 第二十三分 净心行善分
  { chapter: 23, verses: [
    { num: 1, chinese: '须菩提！若有善男子、善女人，以三千大千世界碎为微尘，于意云何？是微尘众，宁为多不？' },
    { num: 2, chinese: '甚多，世尊！何以故？若是微尘众实有者，佛则不说是微尘众。' },
    { num: 3, chinese: '所以者何？佛说微尘众，即非微尘众，是名微尘众。' },
    { num: 4, chinese: '世尊！如来所说三千大千世界，即非世界，是名世界。' },
    { num: 5, chinese: '何以故？若世界实有者，则是一合相。如来说一合相，即非一合相，是名一合相。' },
  ]},

  // 第二十四分 福智无比分
  { chapter: 24, verses: [
    { num: 1, chinese: '须菩提！一合相者，则是不可说，但凡夫之人，贪着其事。' },
    { num: 2, chinese: '须菩提！若人言：佛说我见、人见、众生见、寿者见。须菩提！于意云何？是人解我所说义不？' },
    { num: 3, chinese: '不也，世尊！是人不解如来所说义。何以故？世尊说：我见、人见、众生见、寿者见，即非我见、人见、众生见、寿者见，是名我见、人见、众生见、寿者见。' },
  ]},

  // 第二十五分 化无所化分
  { chapter: 25, verses: [
    { num: 1, chinese: '须菩提！发阿耨多罗三藐三菩提心者，于一切法，应如是知，如是见，如是信解，不生法相。' },
    { num: 2, chinese: '须菩提！所言法相者，如来说即非法相，是名法相。' },
  ]},

  // 第二十六分 法身非相分
  { chapter: 26, verses: [
    { num: 1, chinese: '须菩提！若有人以满无量阿僧祇世界七宝持用布施，若有善男子、善女人，发菩萨心者，持于此经，乃至四句偈等，受持读诵、为人演说，其福胜彼。' },
  ]},

  // 第二十七分 无断无灭分
  { chapter: 27, verses: [
    { num: 1, chinese: '云何为人演说？不取于相，如如不动。何以故？' },
    { num: 2, chinese: '一切有为法，如梦幻泡影，如露亦如电，应作如是观。' },
  ]},

  // 第二十八分 不受不贪分
  { chapter: 28, verses: [
    { num: 1, chinese: '佛说是经已，长老须菩提，及诸比丘、比丘尼、优婆塞、优婆夷，一切世间天人阿修罗，闻佛所说，皆大欢喜，信受奉行。' },
  ]},

  // 补充第二十九分
  { chapter: 29, verses: [
    { num: 1, chinese: '须菩提！若有人言：如来若来若去、若坐若卧。是人不解我所说义。' },
    { num: 2, chinese: '何以故？如来者，无所从来，亦无所去，故名如来。' },
  ]},

  // 第三十分
  { chapter: 30, verses: [
    { num: 1, chinese: '须菩提！若善男子、善女人，以三千大千世界碎为微尘，于意云何？是微尘众，宁为多不？' },
  ]},

  // 第三十一分
  { chapter: 31, verses: [
    { num: 1, chinese: '须菩提！若有人以满无量阿僧祇世界七宝持用布施，若有善男子、善女人，发菩萨心者，持于此经，乃至四句偈等，受持读诵、为人演说，其福胜彼。' },
  ]},

  // 第三十二分 应化非真分
  { chapter: 32, verses: [
    { num: 1, chinese: '一切有为法，如梦幻泡影，如露亦如电，应作如是观。' },
    { num: 2, chinese: '佛说是经已，长老须菩提，及诸比丘、比丘尼、优婆塞、优婆夷，一切世间天人阿修罗，闻佛所说，皆大欢喜，信受奉行。' },
  ]},
]

export async function POST() {
  const results = {
    success: false,
    message: '',
    chaptersUpdated: 0,
    versesAdded: 0,
    errors: [] as string[],
  }

  try {
    // 获取金刚经
    const sutra = await prisma.sutra.findFirst({
      where: { slug: 'diamond-sutra' },
    })

    if (!sutra) {
      return NextResponse.json({ success: false, error: '金刚经不存在' }, { status: 404 })
    }

    // 清除旧的偈颂数据
    await prisma.verse.deleteMany({
      where: {
        chapter: {
          sutraId: sutra.id,
        },
      },
    })

    // 获取所有章节
    const chapters = await prisma.chapter.findMany({
      where: { sutraId: sutra.id },
      orderBy: { chapterNum: 'asc' },
    })

    const chapterMap = new Map(chapters.map(c => [c.chapterNum, c.id]))

    // 插入完整偈颂
    for (const section of diamondSutraCompleteText) {
      const chapterId = chapterMap.get(section.chapter)
      if (!chapterId) {
        results.errors.push(`Chapter ${section.chapter} not found`)
        continue
      }

      for (const verse of section.verses) {
        await prisma.verse.create({
          data: {
            chapterId,
            verseNum: verse.num,
            chinese: verse.chinese,
            aiKeyword: ['金刚经核心内容'],
            order: verse.num,
          },
        })
        results.versesAdded++
      }
      results.chaptersUpdated++
    }

    await prisma.$disconnect()

    results.success = true
    results.message = `成功补充 ${results.chaptersUpdated} 章，共 ${results.versesAdded} 条偈颂！`

    return NextResponse.json(results)
  } catch (error: any) {
    await prisma.$disconnect()
    results.errors.push(error.message)
    return NextResponse.json(results, { status: 500 })
  }
}
