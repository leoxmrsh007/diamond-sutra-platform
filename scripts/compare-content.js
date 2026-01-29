#!/usr/bin/env node

/**
 * 六祖坛经内容对比脚本
 * 比较数据库内容和提取的文档内容
 */

const fs = require('fs');
const path = require('path');

// 预期的每章段落数量（根据实际数据库）
const EXPECTED_SECTIONS = [8, 5, 6, 5, 5, 4, 5, 5, 4, 6]; // 对应第1-10章

// 从 Word 文档提取的文本
const DOCX_TEXT_FILE = path.join('tmp', 'platform-sutra-text.txt');

async function compareContent() {
  console.log('📖 六祖坛经内容对比\n');

  // 1. 读取 Word 文档文本
  let docxText = '';
  if (fs.existsSync(DOCX_TEXT_FILE)) {
    docxText = fs.readFileSync(DOCX_TEXT_FILE, 'utf8');
    console.log('✅ Word 文档已读取');
    console.log('   文档长度:', docxText.length, '字符\n');
  } else {
    console.log('⚠️ Word 文档未找到');
    console.log('   请先运行: node scripts/extract-docx.js <docx路径>');
    console.log('   或者将文档内容复制到 tmp/platform-sutra-text.txt\n');
    process.exit(1);
  }

  // 2. 分析文档内容
  const lines = docxText.split('\n').filter(l => l.trim().length > 0);
  console.log('📊 文档分析:');
  console.log('   总行数:', lines.length);
  console.log('   总字符数:', docxText.length);

  // 3. 预估文档内容是否符合《六祖坛经》
  const expectedMinChars = 8000; // 最少 8000 字
  const expectedMaxChars = 25000; // 最多 25000 字

  if (docxText.length < expectedMinChars) {
    console.log(`⚠️ 文档字符数偏少: ${docxText.length} 字符`);
    console.log(`   预期最少: ${expectedMinChars} 字符`);
    console.log(`   可能缺少大量内容`);
  } else if (docxText.length > expectedMaxChars) {
    console.log(`⚠️ 文档字符数偏多: ${docxText.length} 字符`);
    console.log(`   预期最多: ${expectedMaxChars} 字符`);
    console.log(`   可能包含其他内容`);
  } else {
    console.log(`✅ 文档字符数正常: ${docxText.length} 字符`);
  }

  // 4. 查找关键词
  const keywords = [
    '行由品',
    '般若品',
    '疑问品',
    '定慧品',
    '妙行品',
    '忏悔品',
    '机缘品',
    '顿渐品',
    '宣诏品',
    '付嘱品',
  ];

  console.log('\n🔍 关键词检查:');
  const foundKeywords = keywords.filter(kw => docxText.includes(kw));
  console.log(`   找到关键词: ${foundKeywords.length}/${keywords.length}`);
  foundKeywords.forEach(kw => {
    const pos = docxText.indexOf(kw);
    const preview = docxText.substring(pos, pos + 30) + '...';
    console.log(`   - ${kw}: ${preview}`);
  });

  if (foundKeywords.length < 8) {
    console.log(`   ⚠️ 关键词偏少，可能不完整`);
  } else {
    console.log(`   ✅ 关键词数量正常`);
  }

  // 5. 文档预览
  console.log('\n📄 文档预览:');
  console.log(docxText.substring(0, 500) + '\n...\n');

  // 6. 生成分析报告
  const report = `
# 六祖坛经内容分析报告

生成时间: ${new Date().toLocaleString('zh-CN')}

## 文档信息
- 源文件: Word 文档
- 总字符数: ${docxText.length}
- 总行数: ${lines.length}
- 平均行长度: ${(docxText.length / lines.length).toFixed(1)} 字符

## 关键词检查
找到 ${foundKeywords.length}/${keywords.length} 个关键词
${foundKeywords.map(kw => `- ${kw}`).join('\n')}

## 内容完整性评估
- 字符数范围: ${docxText.length < expectedMinChars ? '❌ 偏少' : (docxText.length > expectedMaxChars ? '⚠️ 偏多' : '✅ 正常')}
- 关键词数量: ${foundKeywords.length < 8 ? '⚠️ 偏少' : '✅ 正常'}
- 建议状态: ${docxText.length < expectedMinChars || foundKeywords.length < 8 ? '需要补充内容' : '内容可能完整'}

## 下一步
如果内容不完整，请：
1. 确认 Word 文档包含完整内容
2. 重新运行提取脚本
3. 运行导入脚本更新数据库内容
`;

  fs.writeFileSync(path.join('tmp', 'content-analysis.md'), report, 'utf8');
  console.log('✅ 分析报告已保存到: tmp/content-analysis.md');

  console.log('\n💡 建议:');
  if (docxText.length < expectedMinChars) {
    console.log('- 检查 Word 文档是否包含完整内容');
    console.log('- 可能缺少部分章节或段落');
    console.log('- 考虑使用完整版的《六祖坛经》');
  }
  console.log('- 如果文档内容完整，可以运行导入脚本更新数据库');
}

compareContent().catch(console.error);
