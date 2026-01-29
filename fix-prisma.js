const { execSync } = require('child_process');
const fs = require('fs');

console.log('🔍 检查 Prisma 锁文件...');

const lockFiles = [
  'node_modules/.prisma/query_engine-windows.dll.node',
  'node_modules/.prisma/query_engine-windows.dll.node.tmp*',
];

lockFiles.forEach(pattern => {
  try {
    const files = require('glob').sync(pattern);
    files.forEach(file => {
      try {
        fs.unlinkSync(file);
        console.log(`   ✅ 删除: ${file}`);
      } catch (err) {
        // 忽略删除错误
      }
    });
  } catch (err) {
    // 忽略 glob 错误
  }
});

console.log('\n🔄 重新生成 Prisma 客户端...');

try {
  execSync('npx prisma generate', { stdio: 'inherit' });
  console.log('\n✅ Prisma 生成成功！');
} catch (err) {
  console.error('\n❌ Prisma 生成失败:', err.message);
  console.log('\n💡 建议：');
  console.log('   1. 手动删除 node_modules/.prisma 文件夹');
  console.log('   2. 然后运行: npx prisma generate');
}
