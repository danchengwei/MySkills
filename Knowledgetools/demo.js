#!/usr/bin/env node

const tools = require('./tools');

console.log('🧠 知识库工具演示\n');

async function runDemo() {
  console.log('📁 目录信息:');
  const dirInfo = tools.getDirectoriesInfo();
  console.log(dirInfo);
  console.log();

  console.log('🔍 分析测试代码...');
  try {
    const testCodeDir = './test-sample';
    const result = await tools.generateKnowledgeFromLocal(testCodeDir);
    console.log('✅ 分析完成:', result);
  } catch (error) {
    console.log('⚠️  分析测试代码:', error.message);
  }
  console.log();

  console.log('📥 导入课诉案例...');
  try {
    const importResult = tools.importCaseKnowledge();
    console.log('✅ 导入结果:', importResult);
  } catch (error) {
    console.log('⚠️  导入课诉案例:', error.message);
  }
  console.log();

  console.log('📊 统计信息:');
  const stats = tools.getStatistics();
  console.log(stats);
  console.log();

  console.log('💡 演示完成！');
  console.log();
  console.log('现在你可以直接和我对话了！比如:');
  console.log('- "帮我分析一下这个目录的代码"');
  console.log('- "宠物装扮是什么业务？"');
  console.log('- "游戏化里面宠物的装扮不见了怎么处理？"');
}

runDemo().catch(console.error);
