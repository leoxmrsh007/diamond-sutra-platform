/**
 * 金刚经成语/术语提取种子数据
 * Diamond Sutra Idioms and Terms Seed Data
 */

const IDIOMS = [
  // 核心术语
  { word: '梦幻泡影', meaning: '形容一切有为法如梦如幻如泡如影，不实', category: 'ALLUSION', chapter: 6, source: '一切有为法，如梦幻泡影，如露亦如电，应作如是观' },
  { word: '如露亦如电', meaning: '比喻法的显现与消失，刹那生灭', category: 'ALLUSION', chapter: 6, source: '如露亦如电，应作如是观' },
  { word: '应无所住', meaning: '修行时不执著于任何境相', category: 'PRINCIPLE', chapter: 10, source: '菩萨于法，应无所住，行于布施' },

  // 六度
  { word: '六度万行', meaning: '布施、持戒、忍辱、精进、禅定、般若六种修行方法', category: 'PRINCIPLE', chapter: 4, source: '菩萨不住于事相，布施不住于相，应无所住，行于布施' },
  { word: '布施', meaning: '财法、法施、无畏施，度悭贪之心', category: 'PRINCIPLE', chapter: 4, source: '菩萨于法，应无所住，行于布施' },
  { word: '持戒', meaning: '持守戒律，防止作恶', category: 'PRINCIPLE', chapter: 4, source: '菩萨于法，应无所住，行于布施' },
  { word: '忍辱', meaning: '忍受侮辱不生嗔恨', category: 'PRINCIPLE', chapter: 4, source: '菩萨于法，应无所住，行于布施' },
  { word: '精进', meaning: '勤勉努力修行', category: 'PRINCIPLE', chapter: 4, source: '菩萨于法，应无所住，行于布施' },
  { word: '禅定', meaning: '修习禅定，调伏妄心', category: 'PRINCIPLE', chapter: 4, source: '菩萨于法，应无所住，行于布施' },
  { word: '般若', meaning: '圆满智慧，照见诸法实相', category: 'PRINCIPLE', chapter: 4, source: '菩萨于法，应无所住，行于布施' },

  // 核心思想
  { word: '不住相', meaning: '不执著于任何外在形相', category: 'PRINCIPLE', chapter: 10, source: '是故，不应取法，不应住色，声、香、味、触、法生心' },
  { word: '离四相', meaning: '远离我相、人相、众生相、寿者相', category: 'PRINCIPLE', chapter: 3, source: '所有众生相，即非相，是名众生相' },
  { word: '无所得', meaning: '无有少法可得，是名阿耨多罗三藐三菩提', category: 'PRINCIPLE', chapter: 22, source: '实无有法，名为阿耨多罗三藐三菩提' },
  { word: '诸法空相', meaning: '一切诸法都是空的，无自性', category: 'PRINCIPLE', chapter: 23, source: '是法空相，不生不灭，不垢不净，不增不减' },

  // 佛学术语
  { word: '一合相', meaning: '如来法身与众生平等无二', category: 'TERM', chapter: 23, source: '如来说一合相者，即是说有相' },
  { word: '法身', meaning: '佛的真如实相', category: 'TERM', chapter: 23, source: '须菩提！于意云何？可以三十二大士相见如来不？' },
  { word: '报身', meaning: '佛的应化身', category: 'TERM', chapter: 23, source: '可以三十二大士相见如来不？' },
  { word: '化身', meaning: '佛的随缘应化身', category: 'TERM', chapter: 23, source: '可以三十二大士相见如来不？' },

  // 经典比喻
  { word: '微尘', meaning: '极微细的尘埃', category: 'ALLUSION', chapter: 11, source: '乃至三千大千世界，所有微尘，是为多不？' },
  { word: '恒河沙', meaning: '恒河沙数的无量无边', category: 'ALLUSION', chapter: 11, source: '恒河沙数，三千大千世界' },
  { word: '三千大千世界', meaning: '宇宙三千大千世界', category: 'ALLUSION', chapter: 11, source: '恒河沙数，三千大千世界' },

  // 修行实践
  { word: '降伏其心', meaning: '调伏、降服妄念', category: 'PRINCIPLE', chapter: 2, source: '愿乐欲闻。善哉！善哉！如是，如是。' },
  { word: '善护念', meaning: '善巧护持、忆念菩萨', category: 'PRINCIPLE', chapter: 2, source: '如来善护念诸菩萨，善付嘱诸菩萨' },
  { word: '发阿耨多罗三藐三菩提心', meaning: '发起无上正等正觉的心', category: 'PRINCIPLE', chapter: 2, source: '发阿耨多罗三藐三菩提心' },

  // 特殊境界
  { word: '无余涅槃', meaning: '生死轮回完全终结', category: 'TERM', chapter: 3, source: '我皆令入无余涅槃而灭度之' },
  { word: '实无众生', meaning: '实无众生可度，众生皆空', category: 'PRINCIPLE', chapter: 3, source: '实无众生得灭度者' },

  // 其他重要术语
  { word: '四见', meaning: '我见、人见、众生见、寿者见', category: 'PRINCIPLE', chapter: 7, source: '须菩提！于意云何？菩萨于法，应无所住，行于布施，不住于相，是人所得福德，思惟其义，则为无所得' },
  { word: '法身非相', meaning: '法身无形相，不可执著', category: 'PRINCIPLE', chapter: 20, source: '是故，不应取法，不应住色，声、香、味、触、法生心' },
  { word: '一切有为法', meaning: '一切因缘所生之法', category: 'PRINCIPLE', chapter: 6, source: '一切有为法，如梦幻泡影，如露亦如电' },
  { word: '无住生心', meaning: '于一切法而不执著生起清净心', category: 'PRINCIPLE', chapter: 10, source: '应无所住，而生其心' },

  // 经典名句
  { word: '凡所有相', meaning: '凡是所有形相，皆是虚妄', category: 'ALLUSION', chapter: 5, source: '凡所有相，皆是虚妄' },
  { word: '若见诸相非相', meaning: '如果见到一切形相都是空的，就见到了如来', category: 'PRINCIPLE', chapter: 5, source: '若见诸相非相，则见如来' },
  { word: '法尚应舍', meaning: '对法的执著也应舍弃', category: 'PRINCIPLE', chapter: 7, source: '一切有为法，如梦幻泡影，如露亦如电，应作如是观' },
  { word: '知我说法如筏喻者', meaning: '知道我说的法就像竹筏的比喻', category: 'ALLUSION', chapter: 8, source: '知我说法如筏喻者，法尚应舍，何况非法？' },
  { word: '舍筏登岸', meaning: '舍弃竹筏登岸，指渡过河后法也应舍弃', category: 'ALLUSION', chapter: 8, source: '知我说法如筏喻者，法尚应舍，何况非法？' },
  { word: '无有定法', meaning: '没有固定的法可说', category: 'PRINCIPLE', chapter: 7, source: '如来所说法，皆不可取，不可说，非法，非非法' },
  { word: '非法非非法', meaning: '既不是法也不是非法', category: 'PRINCIPLE', chapter: 7, source: '如来所说法，皆不可取，不可说，非法，非非法' },

  // 修行方法
  { word: '四摄法', meaning: '布施、爱语、利行、同事四种摄化方法', category: 'PRINCIPLE', chapter: 12, source: '菩萨摩诃萨，应如是降伏其心' },
  { word: '菩萨行', meaning: '菩萨的修行实践', category: 'PRINCIPLE', chapter: 2, source: '发阿耨多罗三藐三菩提心' },

  // 修行成果
  { word: '得大忍辱', meaning: '证得大忍辱波罗蜜', category: 'PRINCIPLE', chapter: 14, source: '如我昔为歌利王割截身体，其时无我相、无人相、无众生相、无寿者相' },
  { word: '不惊不怖不畏', meaning: '不惊恐、不怖畏、不畏惧', category: 'PRINCIPLE', chapter: 14, source: '如我昔为歌利王割截身体，其时无我相、无人相、无众生相、无寿者相' },

  // 灌度修行
  { word: '忍辱波罗蜜', meaning: '到达彼岸的忍辱修行', category: 'PRINCIPLE', chapter: 14, source: '得成于忍波罗蜜' },
  { word: '禅定波罗蜜', meaning: '到达彼岸的禅定修行', category: 'PRINCIPLE', chapter: 14, source: '得成于禅定波罗蜜' },
  { word: '般若波罗蜜', meaning: '到达彼岸的智慧修行', category: 'PRINCIPLE', chapter: 14, source: '得成于般若波罗蜜' },

  // 佛果境界
  { word: '阿罗汉果', meaning: '小乘佛教的最高果位', category: 'TERM', chapter: 9, source: '须陀洹能作是念：我得阿罗汉果' },
  { word: '辟支佛果', meaning: '介于阿罗汉与佛之间的果位', category: 'TERM', chapter: 9, source: '须陀洹能作是念：我得阿罗汉果' },
  { word: '须陀洹果', meaning: '佛教入门果位', category: 'TERM', chapter: 9, source: '须陀洹能作是念：我得阿罗汉果' },

  // 经典比喻和故事
  { word: '歌利王', meaning: '舍卫国国王，曾为求法割截身体', category: 'ALLUSION', chapter: 12, source: '如我昔为歌利王割截身体' },
  { word: '忍辱仙人', meaning: '修忍辱行的仙人', category: 'ALLUSION', chapter: 12, source: '我昔在歌利王所，住山中，忍辱仙人' },
  { word: '五百大劫', meaning: '极长的时间单位', category: 'ALLUSION', chapter: 12, source: '我昔在歌利王所，住山中，于尔所前，五百大劫' },
];

export default IDIOMS;
