#!/usr/bin/env node

const path = require('path');
const fs = require('fs');
const tools = require('./tools');

console.log('🧠 分析已下载的代码...\n');

async function analyzeDownloadedProjects() {
  const sourceCodeDir = path.join(__dirname, '..', 'data', 'source-code');
  
  if (!fs.existsSync(sourceCodeDir)) {
    console.log('❌ 源代码目录不存在');
    return;
  }

  const projects = fs.readdirSync(sourceCodeDir).filter(item => {
    const itemPath = path.join(sourceCodeDir, item);
    return fs.statSync(itemPath).isDirectory();
  });

  console.log(`📦 发现 ${projects.length} 个项目:`);
  projects.forEach(project => {
    console.log(`   - ${project}`);
  });
  console.log();

  for (const project of projects) {
    const projectPath = path.join(sourceCodeDir, project);
    console.log(`📊 正在分析项目: ${project}`);
    console.log('─'.repeat(60));
    
    try {
      const result = await tools.analyzeAndGenerateKnowledge(projectPath, project);
      console.log(`✅ ${project} 分析完成!`);
      console.log(`   - 业务场景: ${result.businessScenarios} 个`);
      console.log(`   - 知识源: ${result.knowledgeSources} 个`);
      console.log(`   - API 接口: ${result.apis} 个`);
      console.log(`   - 类: ${result.classes} 个`);
      console.log(`   - 函数: ${result.functions} 个`);
    } catch (error) {
      console.log(`❌ ${project} 分析失败:`, error.message);
    }
    console.log();
  }
  
  console.log('📊 最终统计:');
  const stats = tools.getStatistics();
  console.log(stats);
  console.log();
  
  console.log('🎉 分析完成！');
  console.log();
  console.log('现在你可以提问了！比如:');
  console.log('- "列出所有知识源"');
  console.log('- "ivebasics 项目有什么业务？"');
  console.log('- "livebusiness 项目的接口有哪些？"');
}

analyzeDownloadedProjects().catch(console.error);
