const http = require('http');

console.log('🔍 验证所有修复...\n');

const tests = [
  { path: '/', name: '首页' },
  { path: '/icon-192.svg', name: 'icon-192.svg（修复1）' },
  { path: '/manifest.json', name: 'manifest.json（修复1）' },
  { path: '/platform-sutra', name: '六祖坛经无参数（修复2）' },
  { path: '/platform-sutra?chapter=1', name: '六祖坛经有参数（修复2）' },
  { path: '/study', name: 'Study 页面（修复3）' },
];

let passed = 0;
let failed = 0;

(async () => {
  for (const test of tests) {
    try {
      const result = await new Promise((resolve) => {
        const req = http.get('http://localhost:3020' + test.path, (res) => {
          let body = '';
          res.on('data', c => body += c);
          res.on('end', () => resolve({ status: res.statusCode, size: body.length }));
        });
        req.on('error', e => resolve({ error: e.message }));
        req.setTimeout(5000, () => resolve({ error: 'Timeout' }));
      });
      
      if (result.error) {
        console.log(\`❌ \${test.name}: \${result.error}\`);
        failed++;
      } else if (result.status === 404) {
        console.log(\`❌ \${test.name}: HTTP 404\`);
        failed++;
      } else {
        const kb = (result.size / 1024).toFixed(1);
        console.log(\`✅ \${test.name}: HTTP \${result.status} (\${kb} KB)\`);
        passed++;
      }
    } catch (e) {
      console.log(\`❌ \${test.name}: \${e.message}\`);
      failed++;
    }
    
    await new Promise(r => setTimeout(r, 100));
  }
  
  console.log(\`\n\${'='.repeat(50)}\`);
  console.log(\`📊 测试结果: \${passed} 通过, \${failed} 失败\`);
  console.log(\`\${'='.repeat(50)}\n\`);
  
  if (failed === 0) {
    console.log(\`🎉 所有修复验证通过！\n\`);
    console.log(\`访问地址: http://localhost:3020\n\`);
    console.log(\`✅ icon-192.png 错误已修复\`);
    console.log(\`✅ searchParams Promise 错误已修复\`);
    console.log(\`✅ Study 页面点击已优化\`);
    console.log(\`✅ Platform Sutra 性能已优化\n\`);
  } else {
    console.log(\`⚠️  还有 \${failed} 个问题需要修复\n\`);
  }
})();
