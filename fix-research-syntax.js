const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/app/research/page.tsx');

// 读取文件
let content = fs.readFileSync(filePath, 'utf8');

// 修复第 31 行：在 'diamond'); 后添加逗号
const oldPattern = "useState<'diamond' | 'platform'>('diamond');/]";
const newPattern = "useState<'diamond' | 'platform'>('diamond'),\n]";

if (content.includes(oldPattern)) {
  content = content.replace(oldPattern, newPattern);
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('✅ 已修复：在 useState 调用后添加了逗号');
} else {
  console.log('⚠️ 未找到匹配的代码模式');
}
