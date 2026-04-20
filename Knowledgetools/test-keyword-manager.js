const tools = require('./tools');

console.log('=== 关键词管理工具测试 ===\n');

// 测试1: 添加常用业务场景同义词
console.log('--- 测试1: 添加业务场景同义词 ---\n');

const businessKeywords = [
  { main: '卡牌游戏', synonyms: ['card', 'game', '卡牌'] },
  { main: '伴读预习', synonyms: ['companion', 'reading', 'preview'] },
  { main: 'AI语音', synonyms: ['ai', 'speech', 'voice', '人工智能语音'] },
  { main: '直播课堂', synonyms: ['live', 'class', 'lesson', '在线课堂'] },
  { main: '成就系统', synonyms: ['achievement', 'system', '成就'] }
];

businessKeywords.forEach(item => {
  tools.addKeywordSynonyms(item.main, item.synonyms);
});

console.log('\n--- 测试2: 列出所有关键词 ---\n');
tools.listAllKeywords();

console.log('\n--- 测试3: 查找关键词匹配 ---\n');
tools.findKeywordMatches('游戏');
tools.findKeywordMatches('语音');

console.log('\n--- 测试4: 关键词扩展搜索 ---\n');
tools.searchKnowledgeSources('卡牌');
tools.searchKnowledgeSources('在线课堂');
