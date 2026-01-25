/**
 * 测试版本对照API
 */

async function testVersionAPI() {
  try {
    console.log('🧪 开始测试版本对照API...\n');

    // 测试获取所有可用版本
    console.log('1️⃣ 测试获取所有可用版本...');
    const versionsRes = await fetch('http://localhost:3000/api/research/versions?limit=5');
    const versionsData = await versionsRes.json();

    if (versionsData.metadata?.availableVersions) {
      console.log(`✅ 找到 ${versionsData.metadata.availableVersions.length} 个可用版本`);
      versionsData.metadata.availableVersions.forEach((v: any) => {
        console.log(`   - ${v.versionName} (${v.versionType})`);
      });
    }

    // 测试获取特定章节的版本对照
    console.log('\n2️⃣ 测试获取第1章的版本对照...');
    const chapterRes = await fetch('http://localhost:3000/api/research/versions?chapter=1');
    const chapterData = await chapterRes.json();

    if (chapterData.data && chapterData.data.length > 0) {
      console.log(`✅ 找到 ${chapterData.data.length} 个偈颂的版本对照`);
      const firstVerse = chapterData.data[0];
      console.log(`\n   第${firstVerse.verseNum}偈有 ${firstVerse.versions.length} 个版本`);
      firstVerse.versions.forEach((v: any) => {
        console.log(`      - ${v.versionName}: ${v.content.substring(0, 50)}...`);
      });
    }

    console.log('\n✨ 版本对照API测试完成！');
    console.log('\n📝 建议：');
    console.log('1. 访问 https://www.jinganjing.cn/research 查看研究页面');
    console.log('2. 点击"启动版本比较"按钮查看11个版本的对照');
    console.log('3. 新增的6个版本需要手动添加数据库内容（暂时无内容）');

  } catch (error) {
    console.error('❌ 测试失败:', error);
  }
}

testVersionAPI();
