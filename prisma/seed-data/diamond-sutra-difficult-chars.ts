/**
 * 金刚经难点字种子数据
 * Diamond Sutra Difficult Characters Seed Data
 */

const DIFFICULT_CHARACTERS = [
  // 第一章
  { character: '般若', pinyin: 'bō rě', meaning: '圆满智慧，照见诸法实相', context: '般若波罗蜜的简称，意为大智慧', frequency: 156 },
  { character: '波罗蜜', pinyin: 'bō luó mì', meaning: '到彼岸的修行方法', context: '意为完成度、到达彼岸', frequency: 134 },
  { character: '须菩提', pinyin: 'Xū Pú Tí', meaning: '佛陀十大弟子之一，解空第一', context: '全名须菩提，意为善吉、善现', frequency: 89 },
  { character: '世尊', pinyin: 'Shì Zūn', meaning: '佛陀的尊称', context: '意为世间最尊贵的人', frequency: 203 },

  // 第二-四章核心概念
  { character: '菩萨', pinyin: 'Pú Sà', meaning: '发心度生的修行者', context: '全称菩提萨埵，意为觉有情', frequency: 267 },
  { character: '涅槃', pinyin: 'Niè Pán', meaning: '生死轮回的超越', context: '意为寂灭、圆寂，超越生死轮回', frequency: 145 },
  { character: '阿耨多罗三藐三菩提', pinyin: 'Ā N tuó luó sān miǎo sān Pú Tí', meaning: '无上正等正觉', context: '佛果位的最高名称', frequency: 78 },
  { character: '布施', pinyin: 'Bù Shī', meaning: '财法、法施、无畏施', context: '六度之一，度悭贪之心', frequency: 198 },
  { character: '持戒', pinyin: 'Chí Jiè', meaning: '持守戒律', context: '六度之一，防止作恶', frequency: 167 },
  { character: '忍辱', pinyin: 'Rěn Rǔ', meaning: '忍受侮辱不生嗔恨', context: '六度之一，消除嗔心', frequency: 145 },

  // 第五-十章核心概念
  { character: '四相', pinyin: 'Sì Xiàng', meaning: '我相、人相、众生相、寿者相', context: '四种执著之相，应离相修行', frequency: 123 },
  { character: '六度', pinyin: 'Liù Dù', meaning: '布施、持戒、忍辱、精进、禅定、般若', context: '菩萨修行的六种方法', frequency: 189 },
  { character: '梦幻泡影', pinyin: 'Mèng Huàn Pào Yǐng', meaning: '比喻一切有为法不实', context: '出自第六章，形容诸法如梦如幻', frequency: 167 },

  // 特殊术语
  { character: '如来', pinyin: 'Rú Lái', meaning: '佛的十种称号之一', context: '意为乘如实道而来', frequency: 234 },
  { character: '应无所住', pinyin: 'Yīng Wú Suǒ Zhù', meaning: '修行时不执著于任何境相', context: '金刚经核心思想', frequency: 156 },
  { character: '而生其心', pinyin: 'Ér Shēng Qí Xīn', meaning: '于一切法而不执著生起清净心', context: '与应无所住连用', frequency: 134 },

  // 修行境界
  { character: '三心', pinyin: 'Sān Xīn', meaning: '过去心、现在心、未来心', context: '菩萨应远离三种心', frequency: 112 },
  { character: '四见', pinyin: 'Sì Jiàn', meaning: '我见、人见、众生见、寿者见', context: '与四相相关的邪见', frequency: 98 },
  { character: '法身', pinyin: 'Fǎ Shēn', meaning: '佛的真如实相', context: '佛的三身之一', frequency: 167 },

  // 梵文术语
  { character: 'Śūnyatā', pinyin: 'shūn yà tā', meaning: '空性', context: '梵文，诸法无自性', frequency: 145 },
  { character: 'Prajñāpāramitā', pinyin: 'bō ruó mì duō', meaning: '般若波罗蜜', context: '梵文，智慧到彼岸', frequency: 167 },
  { character: 'Tathāgata', pinyin: 'dá tā jiā tā', meaning: '如来', context: '梵文，乘真如之道而来', frequency: 189 },

  // 经典比喻
  { character: '微尘', pinyin: 'Wēi Chén', meaning: '极微细的尘埃', context: '比喻世界构成的最小单位', frequency: 134 },
  { character: '恒河沙', pinyin: 'Héng Hé Shā', meaning: '恒河沙数的无量无边', context: '比喻数量极多', frequency: 145 },
  { character: '三千大千世界', pinyin: 'Sān Qiān Dà Qiān Shì Jiè', meaning: '宇宙三千大千世界', context: '佛观宇宙的描述', frequency: 123 },
];

export default DIFFICULT_CHARACTERS;
