# 数据库 Seed 脚本执行指南

## 前置条件

1. PostgreSQL 数据库已启动
2. 环境变量已配置在 `.env.local`
3. Prisma Client 已生成

## 验证数据库连接

```bash
# 测试数据库连接
npm run db:generate

# 如果成功，应该看到：
# ✔ Generated Prisma Client to .\node_modules\@prisma\client
```

## 执行数据库迁移

### 方式 1: 使用 db:push（推荐用于开发）

```bash
# 推送数据库结构（无迁移文件）
npm run db:push
```

预期输出：
```
Loaded Prisma config from prisma.config.ts.
Prisma schema loaded from prisma\schema.prisma.
Datasource "db": PostgreSQL database "diamond_sutra", schema "public" at "localhost:5432"

✔ The database is ready to use.
```

### 方式 2: 使用 db:migrate（生产环境）

```bash
# 创建并应用迁移
npm run db:migrate dev --name init
```

预期输出：
```
Applying migration `20240113000000_init`

The following migration has been applied:
migrations/
  └─ 20240113000000_init/
    └─ migration.sql
```

## 执行 Seed 脚本

```bash
# 填充种子数据
npm run db:seed
```

预期输出：
```
开始初始化金刚经数据...
✓ 创建经文: 金刚般若波罗蜜经
✓ 创建 32 个章节
✓ 创建 11 个偈颂
✓ 创建示例注释
✓ 创建示例课程
✓ 创建 7 个佛学概念

✅ 数据初始化完成！
```

## 验证数据

### 使用 Prisma Studio

```bash
# 启动 Prisma Studio（可视化数据库）
npm run db:studio
```

在浏览器打开 `http://localhost:5555`

检查：
- ✅ sutras 表中有 1 条记录
- ✅ chapters 表中有 32 条记录
- ✅ verses 表中有 11 条偈颂
- ✅ commentaries 表中有注释记录
- ✅ courses 表中有 1 条课程记录
- ✅ concepts 表中有 7 条佛学概念

### 使用 SQL 查询

```bash
# 连接到 PostgreSQL
psql -U diamond_user -d diamond_sutra

# 查看表记录数
SELECT 'sutras' as table_name, COUNT(*) as count FROM sutras
UNION ALL
SELECT 'chapters' as table_name, COUNT(*) as count FROM chapters
UNION ALL
SELECT 'verses' as table_name, COUNT(*) as count FROM verses
UNION ALL
SELECT 'courses' as table_name, COUNT(*) as count FROM courses;
```

## Seed 数据详情

### 1. 经文数据（Sutras）

```json
{
  "title": "金刚般若波罗蜜经",
  "titleSanskrit": "Vajracchedikā Prajñāpāramitā Sūtra",
  "titleTibetan": "རྡོ་རྗེ་གཅོད་པ་ཤེས་རབ་ཀྱི་ཕ་རོལ་ཏུ་ཕྱིན་པའི་མདོ",
  "slug": "diamond-sutra",
  "description": "《金刚般若波罗蜜经》，简称《金刚经》，是大乘佛教般若部的重要经典..."
}
```

### 2. 章节数据（Chapters - 32分）

包含完整 32 章节：
- 法会因由分第一
- 善现启请分第二
- 大乘正宗分第三
- ...
- 应化非真分第三十二

每章包含：
- 章节编号 (1-32)
- 章节标题
- 章节摘要

### 3. 偈颂数据（Verses - 11个关键偈颂）

精选的重要偈颂：
- 第一分: 如是我闻、尔时世尊食时
- 第二分: 须菩提启请、发菩提心
- 第三分: 所有一切众生、我皆令入无余涅槃
- 第六分: 众生者如来说非众生
- 第十四分: 忍辱波罗蜜
- 第三十二分: 一切有为法、如梦幻泡影

每偈颂包含：
- 中文文本
- 梵文文本
- 拼音
- AI 关键词
- 英语翻译

### 4. 注释数据（Commentaries）

示例注释：
- 作者: 六祖慧能
- 来源: 金刚经口诀
- 内容: "此偈颂揭示般若深意..."

### 5. 课程数据（Courses）

创建示例课程：
```json
{
  "title": "《金刚经》入门导读",
  "description": "了解《金刚经》的缘起、核心思想和基本概念...",
  "level": "BEGINNER",
  "duration": 120,
  "isPublished": true
}
```

### 6. 佛学概念（Concepts）

7 个核心概念：
1. 般若 (Prajñā) - 智慧
2. 波罗蜜 (Pāramitā) - 到彼岸
3. 空性 (Śūnyatā) - 缘起性空
4. 菩提心 (Bodhicitta) - 追求成佛的发心
5. 涅槃 (Nirvāna) - 烦恼止息
6. 布施 (Dāna) - 给予而不求回报
7. 忍辱 (Kṣānti) - 忍受侮辱而不起嗔恨

每个概念包含：
- 中文名称
- 梵文原名
- 详细说明

## 扩展 Seed 数据

如需添加更多偈颂或课程，编辑 `prisma/seed.ts`:

### 添加更多偈颂

```typescript
const verses = [
  // 现有偈颂...
  
  // 添加新偈颂
  { 
    chapter: 4, 
    num: 1, 
    chinese: '菩萨于法，应无所住，行于布施。', 
    sanskrit: 'bodhisattvo dharma...niveśo dānam...', 
    pinyin: 'púsà yú fǎ, yīng wúsuǒzhù, xíng yú bùshī.',
    keywords: ['无所住', '布施', '菩萨'] 
  },
];
```

### 添加更多课程

```typescript
// 在 seed.ts 中添加
await prisma.course.create({
  data: {
    title: '《金刚经》中级精讲',
    description: '深入理解核心概念...',
    level: 'INTERMEDIATE',
    duration: 180,
    isPublished: true,
    order: 2,
  },
});
```

### 重新执行 Seed

```bash
# 添加新数据后，重新执行
npm run db:seed
```

注意：Seed 脚本使用 `upsert`，重复执行不会产生重复数据。

## 故障排除

### 问题 1: 数据库连接超时

```
Error: P1001: Can't reach database server at `localhost:5432`
```

解决方案：
```bash
# 检查 PostgreSQL 服务
# Windows: services.msc 中查找 PostgreSQL 服务
# macOS/Linux:
brew services list | grep postgres
sudo systemctl status postgresql

# 测试连接
psql -U diamond_user -d diamond_sutra
```

### 问题 2: Schema 验证失败

```
Error: P1012: error: The datasource property `url` is no longer supported
```

解决方案：
- 确认 `prisma/schema.prisma` 中 datasource 不包含 `url`
- 确认 `prisma/config.ts` 配置正确
- 重新生成 Prisma Client: `npm run db:generate`

### 问题 3: Seed 执行失败

```
Error: Unique constraint failed on the fields: `(userId, verseId)`
```

解决方案：
- Seed 使用 `upsert`，正常情况下不会冲突
- 如果出现此错误，可能是数据库中已有旧数据
- 清空数据库重新开始：
  ```bash
  # 警告：这将删除所有数据
  npm run db:push --force-reset
  npm run db:seed
  ```

### 问题 4: 中文编码问题

确保数据库使用 UTF-8 编码：

```sql
-- 在创建数据库时指定编码
CREATE DATABASE diamond_sutra
  ENCODING 'UTF8'
  LC_COLLATE 'zh_CN.UTF-8'
  LC_CTYPE 'zh_CN.UTF-8';
```

## 数据备份与恢复

### 备份数据

```bash
# 导出整个数据库
pg_dump -U diamond_user diamond_sutra > backup.sql

# 或只导出特定表
pg_dump -U diamond_user -t sutras -t chapters -t verses diamond_sutra > backup.sql
```

### 恢复数据

```bash
# 恢复数据库
psql -U diamond_user diamond_sutra < backup.sql

# 或使用 psql 命令行
psql -U diamond_user -d diamond_sutra -f backup.sql
```

## 下一步

数据库初始化完成后：

1. ✅ 启动开发服务器: `npm run dev`
2. ✅ 访问应用: `http://localhost:3000`
3. ✅ 注册用户账号
4. ✅ 测试经文学习功能
5. ✅ 验证 API 数据读取

详见: `SETUP_AND_TESTING.md`

---

**Seed 状态**: 准备完成，待执行
**数据量**: 1 经文, 32 章节, 11 偈颂, 7 概念
