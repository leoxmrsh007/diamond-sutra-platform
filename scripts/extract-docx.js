const mammoth = require('mammoth');
const fs = require('fs');
const path = require('path');

// 提取文档内容的函数
async function extractDocxContent(docxPath) {
  console.log('📄 读取文档:', docxPath);

  try {
    const result = await mammoth.extractRawText({path: docxPath});
    const text = result.value;

    console.log('✅ 文档读取成功');
    console.log('文档长度:', text.length, '字符');

    // 保存到文件
    const outputPath = path.join('tmp', 'platform-sutra-text.txt');
    fs.writeFileSync(outputPath, text, 'utf8');

    console.log('✅ 内容已保存到:', outputPath);
    console.log('\n文档前 500 字符:');
    console.log(text.substring(0, 500));

    return text;
  } catch (err) {
    console.error('❌ 读取文档失败:', err.message);
    return null;
  }
}

// 使用方法
async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log('用法: node extract-docx.js <docx文件路径>');
    console.log('\n示例:');
    console.log('  node extract-docx.js ../tmp/docs/六祖法宝坛经.docx');
    console.log('  node extract-docx.js E:/path/to/document.docx');
    process.exit(1);
  }

  const docxPath = args[0];
  const text = await extractDocxContent(docxPath);

  if (text) {
    // 简单的内容分析
    const paragraphs = text.split('\n').filter(p => p.trim().length > 0);
    console.log('\n📊 文档统计:');
    console.log('段落数:', paragraphs.length);
    console.log('总字符数:', text.length);
    console.log('平均段落长度:', (text.length / paragraphs.length).toFixed(1));
  }
}

main().catch(console.error);
