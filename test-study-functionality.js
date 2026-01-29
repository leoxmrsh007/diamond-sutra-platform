#!/usr/bin/env node

/**
 * Study Page 功能测试脚本
 */

const http = require('http');

function testPage(path, name) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3020,
      path: path,
      method: 'GET'
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        resolve({
          name,
          path,
          status: res.statusCode,
          size: data.length,
          data
        });
      });
    });

    req.on('error', (e) => {
      reject({ name, error: e.message });
    });

    req.end();
  });
}

async function runTests() {
  console.log('开始测试 Study Page 功能...\n');

  try {
    // 测试1: 主页面
    const test1 = await testPage('/study', 'Study 主页面');
    console.log(`✅ ${test1.name}: HTTP ${test1.status} (${test1.size} 字节)`);
    console.log(`   包含标题: ${test1.data.includes('经文学习') ? '是' : '否'}`);
    console.log(`   包含章节数据: ${test1.data.includes('chapters') ? '是' : '否'}`);
    console.log(`   包含第一章: ${test1.data.includes('法会因由分第一') ? '是' : '否'}\n`);

    // 测试2: study-data.json
    const test2 = await testPage('/study/study-data.json', 'Study 数据文件');
    console.log(`✅ ${test2.name}: HTTP ${test2.status} (${test2.size} 字节)`);
    try {
      const jsonData = JSON.parse(test2.data);
      console.log(`   章节数量: ${jsonData.chapters?.length || 0}`);
      console.log(`   第一章偈颂: ${jsonData.chapters?.[0]?.verses?.length || 0}`);
      console.log(`   数据完整: ${jsonData.chapters?.[0]?.verses?.[0]?.chinese ? '是' : '否'}\n`);
    } catch (e) {
      console.log(`   JSON 解析失败: ${e.message}\n`);
    }

    // 测试3: API 路由
    const test3 = await testPage('/api/chapters', 'Chapters API');
    console.log(`✅ ${test3.name}: HTTP ${test3.status} (${test3.size} 字节)`);
    try {
      const apiData = JSON.parse(test3.data);
      console.log(`   返回章节数量: ${apiData.length}`);
      console.log(`   第一章: ${apiData[0]?.title}\n`);
    } catch (e) {
      console.log(`   JSON 解析失败: ${e.message}\n`);
    }

    // 测试4: manifest.json
    const test4 = await testPage('/manifest.json', 'PWA Manifest');
    console.log(`✅ ${test4.name}: HTTP ${test4.status} (${test4.size} 字节)`);
    try {
      const manifest = JSON.parse(test4.data);
      console.log(`   应用名称: ${manifest.name}`);
      console.log(`   图标数量: ${manifest.icons?.length || 0}`);
      console.log(`   图标类型: ${manifest.icons?.[0]?.type}\n`);
    } catch (e) {
      console.log(`   JSON 解析失败: ${e.message}\n`);
    }

    console.log('=== 所有测试完成 ===');
    console.log('\n下一步：');
    console.log('1. 打开浏览器访问 http://localhost:3020/study');
    console.log('2. 按F12打开开发者工具');
    console.log('3. 点击左侧目录中的章节');
    console.log('4. 查看控制台是否有调试日志');

  } catch (error) {
    console.error('❌ 测试失败:', error);
  }
}

runTests();
