import { NextResponse } from 'next/server'

// 使用 Supabase REST API 而不是直接 PostgreSQL 连接
const SUPABASE_URL = 'https://db.xashqtdyrifygxtqbfcl.supabase.co'
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhhc2hxdGR5cmlmeWd4dHFiZmNsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc2MDQ4MTQsImV4cCI6MjA1MzE4MDgxNH0.bXNbwnRQbmHY6nY-iWUb0u_qK0gD2SCgExZDq7V7y1A'

export async function GET() {
  const results = {
    databaseTest: false,
    sutraCount: 0,
    chapterCount: 0,
    error: null as string | null,
  }

  try {
    // 测试数据库连接 - 获取 sutras 数量
    const sutraRes = await fetch(`${SUPABASE_URL}/rest/v1/sutras?select=count`, {
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
      },
    })

    if (sutraRes.ok) {
      const sutras = await sutraRes.json()
      results.sutraCount = Array.isArray(sutras) ? sutras.length : 0
      results.databaseTest = true
    }

    // 测试获取 chapters
    const chapterRes = await fetch(`${SUPABASE_URL}/rest/v1/chapters?select=count`, {
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
      },
    })

    if (chapterRes.ok) {
      const chapters = await chapterRes.json()
      results.chapterCount = Array.isArray(chapters) ? chapters.length : 0
    }

    return NextResponse.json(results)
  } catch (error: any) {
    results.error = error?.message || 'Unknown error'
    return NextResponse.json(results, { status: 500 })
  }
}

// 使用 Supabase REST API 插入数据
export async function POST() {
  const results = {
    success: false,
    sutraCreated: false,
    chaptersCreated: 0,
    error: null as string | null,
  }

  try {
    // 1. 创建金刚经
    const sutraRes = await fetch(`${SUPABASE_URL}/rest/v1/sutras`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation',
      },
      body: JSON.stringify({
        id: 'diamond-sutra-main',
        title: '金刚般若波罗蜜经',
        title_sanskrit: 'Vajracchedikā Prajñāpāramitā Sūtra',
        title_tibetan: 'རྡོ་རྗེ་ཤེས་རབ་ཀྱི་ཕ་རོལ་ཏ་པའི་མདོ།',
        slug: 'diamond-sutra',
        description: '简称《金刚经》，是大乘佛教般若部的重要经典，由姚秦鸠摩罗什译，共一卷，三十二分。',
        order: 1,
      }),
    })

    if (sutraRes.ok) {
      results.sutraCreated = true
    }

    // 2. 创建32章
    const chapters = [
      [1, '法会因由分第一', '佛陀在舍卫国祇树给孤独园示现般若法会。'],
      [2, '善现启请分第二', '须菩提请问佛陀：菩萨应如何发心？'],
      [3, '大乘正宗分第三', '佛陀宣示：菩萨应度一切众生，而无众生可度。'],
      [4, '妙行无住分第四', '菩萨于法应无所住，行于布施。'],
      [5, '如理实见分第五', '不可以身相见如来。凡所有相，皆是虚妄。'],
      [6, '正信希有分第六', '如来灭后，后五百岁，有持戒修福者。'],
      [7, '无得无说分第七', '如来所得法，此法无实无虚。'],
      [8, '依法出生分第八', '应无所住而生其心。'],
      [9, '一相无相分第九', '须陀洹名为入流，而无所入。'],
      [10, '庄严净土分第十', '庄严佛土者，即非庄严，是名庄严。'],
      [11, '无为福胜分第十一', '满三千大千世界七宝布施，不如持经。'],
      [12, '尊重正教分第十二', '随说是经乃至四句偈等，皆应供养。'],
      [13, '如法受持分第十三', '此经名为金刚般若波罗蜜。'],
      [14, '离相寂灭分第十四', '忍辱波罗蜜，如来说非忍辱波罗蜜。'],
      [15, '持经功德分第十五', '受持读诵此经，功德无量。'],
      [16, '能净业障分第十六', '受持读诵此经，能净业障。'],
      [17, '究竟无我分第十七', '如来昔在燃灯佛所，于法实无所得。'],
      [18, '一体同观分第十八', '五眼者，如来说非五眼。'],
      [19, '法界通化分第十九', '若三千大千世界七宝聚布施。'],
      [20, '离色离相分第二十', '佛说具足色身，即非具足色身。'],
      [21, '非说所说分第二十一', '如来无所说法。'],
      [22, '无法可得分第二十二', '无有定法名阿耨多罗三藐三菩提。'],
      [23, '净心行善分第二十三', '是法平等，无有高下。'],
      [24, '福智无比分第二十四', '七宝布施，不如持经。'],
      [25, '化无所化分第二十五', '实无有众生如来度者。'],
      [26, '法身非相分第二十六', '不应以三十二相观如来。'],
      [27, '无断无灭分第二十七', '法无所断，亦无所灭。'],
      [28, '不受不贪分第二十八', '菩萨与法，不应贪著。'],
      [29, '威仪寂净分第二十九', '如来无所从来，亦无所去。'],
      [30, '一合相理分第三十', '一合相即非一合相。'],
      [31, '知见不生分第三十一', '若菩萨通达无我法者，是名真菩萨。'],
      [32, '应化非真分第三十二', '一切有为法，如梦幻泡影。'],
    ]

    for (const [num, title, summary] of chapters) {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/chapters`, {
        method: 'POST',
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'resolution=ignore-duplicates',
        },
        body: JSON.stringify({
          sutra_id: 'diamond-sutra-main',
          chapter_num: num,
          title: title,
          summary: summary,
          order: num,
        }),
      })
      if (res.ok) {
        results.chaptersCreated++
      }
    }

    results.success = true
    return NextResponse.json(results)
  } catch (error: any) {
    results.error = error?.message || 'Unknown error'
    return NextResponse.json(results, { status: 500 })
  }
}
