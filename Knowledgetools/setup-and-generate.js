#!/usr/bin/env node

const tools = require('./tools');

console.log('🧠 知识库工具 - 配置和生成\n');

async function setupAndGenerate() {
  console.log('⚙️  配置 GitLab...');
  
  tools.configSet('gitlab', 'baseUrl', 'https://git.100tal.com');
  tools.configSet('gitlab', 'accessToken', 'RxF3SsLzjDFp7imeYqkS');
  tools.configSet('gitlab', 'defaultBranch', 'master');
  
  console.log('✅ GitLab 配置已保存');
  console.log();
  
  const projects = [
    { id: 30833, name: 'ivebasics' },
    { id: 9715, name: 'livebusiness' }
  ];
  
  for (const project of projects) {
    console.log(`📦 正在处理项目: ${project.name} (ID: ${project.id})`);
    console.log('─'.repeat(60));
    
    try {
      const result = await tools.generateKnowledgeFromGitLab(project.id);
      console.log(`✅ ${project.name} 知识库生成完成!`);
      console.log(`   - 业务场景: ${result.businessScenarios} 个`);
      console.log(`   - 知识源: ${result.knowledgeSources} 个`);
      console.log(`   - API 接口: ${result.apis} 个`);
      console.log(`   - 类: ${result.classes} 个`);
      console.log(`   - 函数: ${result.functions} 个`);
    } catch (error) {
      console.log(`❌ ${project.name} 生成失败:`, error.message);
    }
    console.log();
  }
  
  console.log('📊 最终统计:');
  const stats = tools.getStatistics();
  console.log(stats);
  console.log();
  
  console.log('🎉 全部完成！');
  console.log();
  console.log('现在你可以提问了！比如:');
  console.log('- "列出所有知识源"');
  console.log('- "ivebasics 项目有什么业务？"');
  console.log('- "livebusiness 项目的接口有哪些？"');
}

setupAndGenerate().catch(console.error);
