const knowledgeTools = require('./tools');

async function testAntiTalkQuery() {
  console.log('🔍 测试"反讲"关键词匹配...');
  
  // 1. 查找关键词匹配
  const keywordMatches = knowledgeTools.findKeywordMatches('反讲');
  console.log('关键词匹配结果:', JSON.stringify(keywordMatches, null, 2));
  
  // 2