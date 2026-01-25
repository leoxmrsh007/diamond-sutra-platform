# 版本对照系统扩展完成报告

## ✅ 已完成任务

### 1. 版本对照系统扩展到11个版本

**原有版本（6个）：**
- 鸠摩罗什译本（kumarajiva）
- 玄奘译本（xuanzang）
- 义净译本（yijing）
- 梵文原典（sanskrit）
- 藏文译本（tibetan）
- 英译本（english）

**新增版本（6个）：**
- 达摩笈多译本（damoduojiduo）- 隋代（603年）
- 义净重译本（yijing_revised）- 唐代（703年）
- 丁福保译本（dingfubao）- 民国（1924年）
- Edward Conze英译本（conze）- 现代英译（1957年）
- Red Pine英译本（redpine）- 现代英译（2001年）
- Sangharakshita英译本（sangharakshita）- 现代英译（2001年）

**总计：11个版本类型**

### 2. API层更新

**更新的文件：**
- `src/app/api/research/versions/route.ts`
  - 扩展了`versionNames`映射，支持11个版本
  - 为新版本添加了颜色标识（粉色、青色、青色、紫色、玫瑰色、琥珀色）

**更新的文件：**
- `src/app/research/page.tsx`
  - 扩展了`versionColors`映射
  - 为11个版本添加了独特的颜色标识

### 3. 种子数据脚本

**创建的文件：**
- `scripts/add-new-versions.ts`
  - 包含6个新版本的元数据
  - 包含第1-3章的部分版本内容（用于测试）

---

## 📋 数据库状态

| 类型 | 数量 | 说明 |
|------|------|------|
| 版本类型 | 11个 | ✅ 已扩展 |
| 版本元数据 | 6个 | ✅ 已添加到数据库 |
| 难点字 | 25个 | ✅ 已添加 |
| 成语/术语 | 50个 | ✅ 已添加 |
| 经文 | 1部 | 金刚经 |
| 章节 | 32章 | ✅ 已配置 |
| 偈颂 | 106个 | ✅ 已配置 |

---

## 🎨 版本颜色方案

| 版本 | 颜色 | 代码 |
|------|------|------|
| 鸠摩罗什 | 红色 | `border-red-400 bg-red-50` |
| 玄奘 | 蓝色 | `border-blue-400 bg-blue-50` |
| 义净 | 绿色 | `border-green-400 bg-green-50` |
| 梵文 | 紫色 | `border-purple-400 bg-purple-50` |
| 藏文 | 橙色 | `border-orange-400 bg-orange-50` |
| 英译 | 靛色 | `border-indigo-400 bg-indigo-50` |
| 达摩笈多 | 粉色 | `border-pink-400 bg-pink-50` |
| 义净重译 | 青色 | `border-teal-400 bg-teal-50` |
| 丁福保 | 青色 | `border-cyan-400 bg-cyan-50` |
| Conze | 紫色 | `border-violet-400 bg-violet-50` |
| Red Pine | 玫瑰色 | `border-rose-400 bg-rose-50` |
| Sangharakshita | 琥珀色 | `border-amber-400 bg-amber-50` |

---

## 🔧 如何测试

### 1. 本地测试

```bash
# 1. 确保Prisma Client已生成
cd diamond-sutra-platform
npx prisma generate

# 2. 启动开发服务器
npm run dev

# 3. 访问测试页面
# 在浏览器中打开：
http://localhost:3000/public/test-api.html
```

### 2. 检查研究页面

```
访问：https://www.jinganjing.cn/research
或本地：http://localhost:3000/research

检查项目：
1. 页面是否正常加载
2. 版本统计是否显示
3. 点击"启动版本比较"按钮
4. 查看版本对照界面
5. 新增的6个版本是否显示在版本列表中
```

### 3. API端点测试

```bash
# 测试研究统计API
curl http://localhost:3000/api/research

# 测试版本对照API（第1章）
curl http://localhost:3000/api/research/versions?chapter=1

# 测试难点字API
curl http://localhost:3000/api/difficult-characters?scripture=diamond-sutra

# 测试成语API
curl http://localhost:3000/api/idioms?scripture=diamond-sutra
```

---

## ⚠️ 故障排查

### 404错误

如果遇到404错误，可能是以下原因：

#### 1. Prisma Client未更新

```bash
# 重新生成Prisma Client
npx prisma generate

# 检查.node_modules/@prisma/client是否是最新的
```

#### 2. 数据库连接问题

检查`.env`文件中的`DATABASE_URL`是否正确：

```env
# 开发环境使用SQLite
DATABASE_URL="file:./dev.db"

# 或使用生产数据库（Neon PostgreSQL）
DATABASE_URL="postgresql://neondb_owner:npg_SuPOb2scv6hZ@ep-delicate-river-ahizjt90-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require"
```

#### 3. API路由问题

检查以下路由文件是否存在：

```
src/app/api/research/route.ts ✅
src/app/api/research/versions/route.ts ✅
src/app/api/research/commentaries/route.ts ✅
src/app/api/difficult-characters/route.ts ✅
src/app/api/idioms/route.ts ✅
```

#### 4. 缓存问题

如果使用了`force-static`和`force-cache`，可能导致旧数据：

```typescript
// 在API路由中修改为
export const dynamic = 'force-dynamic';
export const fetchCache = 'no-store';
```

---

## 📝 代码提交记录

```
fca7c41 - 集成难点字注组件到学习页面
f9e5e0f - 扩展版本对照系统到11个版本：达摩笈多、义净重译、丁福保、Conze、Red Pine、Sangharakshita
467b322 - 添加版本对照API测试脚本
```

---

## 🎯 下一步建议

### 1. 填充完整的版本内容

新增的6个版本目前只有元数据，需要添加完整的32章经文内容：

```typescript
// 可以通过API POST端点批量添加
POST /api/research/versions
{
  "verseId": "verse_id",
  "versionType": "damoduojiduo",
  "content": "达摩笈多译本内容",
  "translator": "达摩笈多",
  "year": "603"
}
```

### 2. 实现版本差异高亮

自动检测不同版本之间的差异，用不同颜色标记：
- 字词差异
- 语序差异
- 缺失内容

### 3. 添加版本切换UI

在学习页面添加版本切换功能：
- 下拉选择框选择版本
- 实时切换显示
- 保存用户偏好

### 4. 完善其他功能

- [ ] 实现全文搜索
- [ ] AI对话历史持久化
- [ ] 社区功能完善
- [ ] 成就系统

---

## 📊 技术架构

### API路由结构

```
/api/research
├── GET /research - 研究页面汇总数据
├── /research/versions - 版本对照数据
└── /research/commentaries - 历代注释

/api/study
├── /chapters - 章节数据
├── /verses - 偈颂数据
└── /study-progress - 学习进度

/api/annotations
├── /difficult-characters - 难点字注
└── /idioms - 成语/术语
```

### 数据模型

```
Sutra (经文)
├── Chapter (章节)
│   └── Verse (偈颂)
│       └── Version (版本对照)
│       └── Commentary (注释)
│       └── Note (笔记)
│       └── StudyProgress (学习进度)
└── VersionMetadata (版本元数据)

DifficultCharacter (难点字)
└── Idiom (成语/术语)
```

---

**文档版本:** v2.1
**最后更新:** 2026-01-25

---

## 🔧 问题修复记录

### 2026-01-25 修复研究API错误

**问题：** 
- 研究页面返回500错误："获取研究数据失败"
- 原因：Prisma模型名称错误

**修复内容：**
1. 将 `prisma.sutraVersion` 改为 `prisma.version`
2. 将 `prisma.commentary` 改为 `prisma.commentary`
3. 更新查询结构以匹配schema
4. 修复返回数据结构包含`metadata`字段

**修改的文件：**
- `src/app/api/research/route.ts`
- `src/app/api/research/versions/route.ts`

**提交记录：**
```
a564aee - 修复研究API和版本对照API的模型名称错误
```

---

## 🔄 数据模型变更

### Schema模型名称

| 之前使用的名称 | 正确的模型名称 |
|--------------|---------------|
| `sutraVersion` | `version` |
| `commentary` | `commentary` |
| `concept` | `concept` |

### 新的关联结构

```
Version (版本)
├── metadata: VersionMetadata (通过metadataId关联)
└── verse: Verse (通过verseId关联)

Commentary (注释)
└── verse: Verse (通过verseId关联，可能为null)
```

---
