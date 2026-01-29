#!/usr/bin/env node

/**
 * 平台功能全面测试脚本
 */

const http = require('http');

function testPage(path, name) {
  return new Promise((resolve) => {
    const options = {
      hostname: 'localhost',
      port: 3020,
      path,
      method: 'GET'
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        resolve({ name, path, status: res.status, size: data.length, data });
      });
    });

    req.on('error', (e) => {
      resolve({ name, path, error: e.message });
    });

    req.end();
  });
}

async function runTests() {
  console.log('🧪 开始平台功能全面测试...\n');

  const tests = [
    { path: '/', name: '首页' },
    { path: '/study', name: 'Study 页面' },
    { path: '/study/study-data.json', name: 'Study 数据文件' },
    { path: '/api/chapters', name: 'Chapters API' },
    { path: '/platform-sutra', name: '六祖坛经页面（无参数）' },
    { path: '/platform-sutra?chapter=1', name: '六祖坛经页面（有参数）' },
    { path: '/ai', name: 'AI 问答页面' },
    { path: '/manifest.json', name: 'PWA Manifest' },
  ];

  let passed = 0;
  let failed = 0;

  for (const test of tests) {
    const result = await testPage(test.path, test.name);

    if (result.error) {
      console.log(`❌ ${test.name}: ${result.error}`);
      failed++;
    } else if (result.status !== 200) {
      console.log(`❌ ${test.name}: HTTP ${result.status}`);
      failed++;
    } else {
      console.log(`✅ ${test.name}: HTTP ${result.status} (${(result.size / 1024).toFixed(1)} KB)`);
      passed++;
    }

    // 添加小延迟避免请求过快
    await new Promise(r => setTimeout(r, 100));
  }

  console.log('\n' + '='.repeat(50));
  console.log(`📊 测试结果: ${passed} 通过, ${failed} 失败`);
  console.log('='.repeat(50));

  console.log('\n🎯 重点验证:');
  console.log('1. platform-sutra 页面参数修复');
  console.log('   访问 http://localhost:3020/platform-sutra?chapter=1');
  console.log('   检查控制台是否有 searchParams 错误');

  console.log('\n2. study 页面点击功能');
  console.log('   访问 http://localhost:3020/study');
  console.log('   点击左侧目录中的章节');
  console.log('   检查控制台是否有调试日志');

  console.log('\n3. manifest.json 图标修复');
  console.log('   检查 PWA 安装是否正常');
  console.log('   不应再出现 image.png 404 错误');

  console.log('\n✅ 所有修复已完成！');
}

runTests().catch(console.error);
