const KnowledgeSearch = require('./src/knowledge-search/index.js');

// 测试知识源查询
const indexPath = '/Users/tal/workSpace/TraeProject/data/knowledge-sources/enhanced-index.json';
const sourcesPath = '/Users/tal/workSpace/TraeProject/data/knowledge-sources/sources';

const searcher = new KnowledgeSearch(indexPath, sourcesPath);

// 测试查询
const testQueries = [
  '伴读预习',
  '卡牌游戏',
  'AI语音',
  '直播课堂',
  '成就系统'
];

console.log('测试知识源查询工具...\n');

testQueries.forEach((query, index) => {
  console.log(`=== 测试查询 ${index + 1}: "${query}" ===`);
  
  const results = searcher.searchAndSummarize(query, 3);
  
  if (results.length === 0) {
    console.log('未找到相关知识源\n');
  } else {
    results.forEach((result, i) => {
      console.log(`结果 ${i + 1}: ${result.name}`);
      console.log(`相关性: ${result.relevance}`);
      console.log(`摘要: ${result.summary}`);
      console.log(`文件: ${result.filename}`);
      console.log('---');
    });
    console.log('');
  }
});

console.log('测试完成！');
