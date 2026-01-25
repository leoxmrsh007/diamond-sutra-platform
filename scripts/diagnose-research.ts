/**
 * 诊断研究页面404错误
 */

const API_ENDPOINTS = [
  '/api/research',
  '/api/research/versions',
  '/api/research/commentaries',
  '/api/difficult-characters',
  '/api/idioms',
  '/api/chapters',
  '/api/verses',
  '/api/study-progress',
  '/api/courses',
  '/api/community/posts',
  '/api/search',
];

async function diagnose() {
  console.log('🔍 开始诊断研究页面问题...\n');

  // 检查所有API端点
  console.log('1️⃣ 检查API端点可访问性...\n');

  for (const endpoint of API_ENDPOINTS) {
    try {
      const res = await fetch(endpoint, {
        method: 'HEAD',
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache',
      },
      redirect: 'manual',
      credentials: 'same-origin',
      mode: 'cors',
      signal: AbortSignal.timeout(10000),
      referrerPolicy: 'no-referrer',
      keepalive: false,
      });
      console.log(`✅ ${res.status} - ${endpoint}`);
    } catch (error) {
      console.error(`❌ 错误 - ${endpoint}:`, error);
    }
  }

  console.log('\n2️⃣ 检查研究页面数据获取...\n');

  // 检查研究API响应
  try {
    const researchRes = await fetch('/api/research', {
      cache: 'no-store',
      headers: { 'Cache-Control': 'no-cache' },
    });
    console.log(`研究API状态: ${researchRes.status}`);

    if (!researchRes.ok) {
      const errorText = await researchRes.text();
      console.error('❌ 研究API返回错误:');
      console.error(`   状态码: ${researchRes.status}`);
      console.error(`   响应内容: ${errorText.substring(0, 200)}`);
    } else {
      const data = await researchRes.json();
      console.log('✅ 研究API响应成功');
      console.log(`   版本总数: ${data.summary?.versions || 0}`);
      console.log(`   注释总数: ${data.summary?.commentaries || 0}`);
      console.log(`   可用版本数: ${data.versions?.available?.length || 0}`);

      if (data.versions?.available) {
        console.log('\n   可用版本列表:');
        data.versions.available.forEach((v: any) => {
          console.log(`      - ${v.versionName} (${v.versionType})`);
        });
      }
    }
  } catch (error) {
    console.error('❌ 研究API调用失败:', error);
  }

  console.log('\n3️⃣ 检查版本对照API...\n');

  // 检查版本对照API
  try {
    const versionsRes = await fetch('/api/research/versions?chapter=1&limit=3', {
      cache: 'no-store',
      headers: { 'Cache-Control': 'no-cache' },
    });
    console.log(`版本对照API状态: ${versionsRes.status}`);

    if (!versionsRes.ok) {
      const errorText = await versionsRes.text();
      console.error('❌ 版本对照API返回错误:');
      console.error(`   状态码: ${versionsRes.status}`);
      console.error(`   响应内容: ${errorText.substring(0, 200)}`);
    } else {
      const data = await versionsRes.json();
      console.log('✅ 版本对照API响应成功');
      console.log(`   数据条目数: ${data.data?.length || 0}`);
      console.log(`   可用版本数: ${data.metadata?.availableVersions?.length || 0}`);
    }
  } catch (error) {
    console.error('❌ 版本对照API调用失败:', error);
  }

  console.log('\n4️⃣ 检查浏览器环境...\n');
  console.log(`   当前URL: ${window.location.href}`);
  console.log(`   User Agent: ${navigator.userAgent}`);
  console.log(`   是否在线: ${navigator.onLine}`);

  console.log('\n5️⃣ 可能的问题和解决方案...\n');

  console.log('如果所有API都正常但页面仍然报错：');
  console.log('');
  console.log('1. 检查Vercel部署状态:');
  console.log('   npx vercel ls');
  console.log('   npx vercel inspect');
  console.log('');
  console.log('2. 清除浏览器缓存:');
  console.log('   - Ctrl+Shift+R (Windows)');
  console.log('   - Cmd+Shift+R (Mac)');
  console.log('   - 或使用隐私/无痕模式');
  console.log('');
  console.log('3. 检查Network标签:');
  console.log('   - 打开开发者工具(F12)');
  console.log('   - 切换到Network标签');
  console.log('   - 刷新页面');
  console.log('   - 查找失败的请求');
  console.log('');
  console.log('4. 确认数据库连接:');
  console.log('   - 检查.env文件中的DATABASE_URL');
  console.log('   - 运行 npx prisma db pull');
  console.log('');
  console.log('5. 检查Prisma客户端:');
  console.log('   - npx prisma generate');
  console.log('   - 删除node_modules/.prisma目录');
  console.log('');
}

diagnose();
