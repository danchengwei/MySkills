const tools = require('./tools');

console.log('=== 客诉知识源索引生成测试 ===\n');

// 测试客诉知识源索引生成
tools.indexCaseKnowledge().then(stats => {
  console.log('\n✅ 测试完成!');
  console.log('客诉知识源索引已成功生成');
  
  // 列出所有客诉案例
  console.log('\n--- 客诉案例列表 ---');
  const cases = tools.listCases();
  cases.forEach((c, i) => {
    console.log(`${i + 1}. [${c.category}] ${c.title}`);
    if (c.tags && c.tags.length > 0) {
      console.log(`   标签: ${c.tags.join(', ')}`);
    }
  });
}).catch(error => {
  console.error('❌ 测试失败:', error);
});
