# API修复验证指南

## ✅ 已修复的问题

### 研究API 500错误修复

**问题表现：**
- 研究页面显示"数据加载失败"
- 浏览器控制台显示"获取研究数据失败"

**根本原因：**
Prisma模型名称错误：
- ❌ `prisma.sutraVersion` → ✅ `prisma.version`
- ❌ `prisma.commentary` → ✅ `prisma.commentary`
- ❌ `prisma.concept` → ✅ `prisma.concept`

**修复内容：**

#### 1. `/api/research` 端点

```typescript
// 修复前
const versionsCount = await prisma.sutraVersion.count();

// 修复后
const versionsCount = await prisma.version.count();
```

**更新的查询：**
- 版本统计查询现在使用 `prisma.version.findMany()`
- 包含 `metadata` 关联以获取完整的版本信息
- 注释查询使用正确的模型名称

#### 2. `/api/research/versions` 端点

```typescript
// 修复前
const versions = await prisma.sutraVersion.findMany({
  where,
  include: {
    verse: { ... }
  }
});

// 修复后
const versions = await prisma.version.findMany({
  where,
  include: {
    metadata: { ... },  // 新增metadata关联
    verse: { ... }
  }
});
```

**更新的返回数据结构：**

```typescript
{
  id: string,
  versionType: string,        // 从 metadata.versionType 获取
  versionName: string,        // 从 metadata.versionName 获取
  language: string,           // 从 metadata.language 获取
  content: string,
  translator: string,         // 从 metadata.author 获取
  year: string,              // 从 metadata.era 获取
  notes: string
}
```

#### 3. POST端点更新

```typescript
// 修复前
const version = await prisma.sutraVersion.upsert({
  where: { verseId_versionType: { verseId, versionType } },
  create: { verseId, versionType, versionName, ... }
});

// 修复后
// 1. 首先创建/获取versionMetadata
const metadata = await prisma.versionMetadata.upsert({
  where: { scriptureId_versionType: { ... } },
  create: { versionType, versionName, language, author, era }
});

// 2. 然后创建version关联
const version = await prisma.version.upsert({
  where: { metadataId_verseId: { metadataId, verseId } },
  create: { metadataId, verseId, content, notes }
});
```

---

## 🧪 验证步骤

### 1. 本地测试

```bash
# 确保Prisma客户端已更新
cd diamond-sutra-platform
npx prisma generate

# 重启开发服务器
npm run dev
```

### 2. 浏览器测试

```
1. 访问 https://www.jinganjing.cn/research
2. 打开浏览器开发者工具（F12）
3. 切换到Console标签
4. 刷新页面
5. 查看是否有错误
```

### 3. 验证API端点

```bash
# 测试研究统计API
curl https://www.jinganjing.cn/api/research

# 测试版本对照API
curl https://www.jinganjing.cn/api/research/versions?chapter=1

# 预期响应
{
  "data": [...],
  "metadata": {
    "total": 106,
    "groupedCount": 5,
    "availableVersions": [...]
  }
}
```

### 4. 验证返回数据结构

检查 `availableVersions` 数组中的每个版本对象：

```javascript
{
  versionType: "kumarajiva",  // ✅ 应该存在
  versionName: "鸠摩罗什译本",  // ✅ 应该存在
  language: "zh",              // ✅ 应该存在
  author: "鸠摩罗什",          // ✅ 应该存在
  era: "402"                  // ✅ 应该存在
}
```

---

## 📊 Schema模型对照

### 数据库表结构

| 表名 | 模型名称 | 说明 |
|-------|---------|------|
| sutras | Sutra | 经文 |
| chapters | Chapter | 章节 |
| verses | Verse | 偈颂 |
| version_metadata | VersionMetadata | 版本元数据 |
| versions | Version | 版本对照内容 |
| commentaries | Commentary | 注释 |
| concepts | Concept | 概念 |

### 关联关系

```
Version (versions表)
├── metadata → VersionMetadata (versionMetadata表)
└── verse → Verse (verses表)

Commentary (commentaries表)
└── verse → Verse (verses表，可为null)
```

---

## ⚠️ 常见错误模式

### 错误1：使用了不存在的模型

```typescript
// ❌ 错误
prisma.sutraVersion.findMany()

// ✅ 正确
prisma.version.findMany()
```

### 错误2：返回的数据结构不匹配

```typescript
// 如果schema中version关联了metadata
version.metadata.versionType  // ✅ 正确
version.versionType           // ❌ 错误 - 不存在
```

### 错误3：unique约束错误

```prisma
// versionMetadata的唯一约束
@@unique([scriptureId, versionType])

// version的唯一约束  
@@unique([metadataId, verseId])

// ❌ 错误：使用verseId_versionType
// ✅ 正确：使用metadataId_verseId
```

---

## 🚀 部署清单

### 部署前检查

- [x] 所有API端点使用正确的模型名称
- [x] 返回数据结构正确
- [x] Prisma客户端已生成
- [ ] 生产环境数据库已迁移
- [ ] Vercel部署成功

### 部署后验证

```bash
# 1. 检查部署状态
git push origin main

# 2. 等待Vercel部署完成

# 3. 测试生产环境
curl https://www.jinganjing.cn/api/research

# 4. 检查Vercel日志
npx vercel logs
```

---

## 📞 支持信息

如果问题仍然存在，请提供：

1. 浏览器控制台的完整错误消息
2. Network标签中API请求的响应
3. 服务器端日志（如果有访问权限）
4. 环境信息（本地/生产）

---

**文档更新时间：** 2026-01-25
**修复提交：** a564aee
