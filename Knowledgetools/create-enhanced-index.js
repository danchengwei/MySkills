#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 创建增强知识源索引...\n');

function createEnhancedIndex() {
  const knowledgeSourcesDir = path.join(__dirname, 'data', 'knowledge-sources', 'sources');
  const indexPath = path.join(__dirname, 'data', 'knowledge-sources', 'enhanced-index.json');
  
  if (!fs.existsSync(knowledgeSourcesDir)) {
    console.log('❌ 知识源目录不存在');
    return;
  }

  const files = fs.readdirSync(knowledgeSourcesDir).filter(file => file.endsWith('.md'));
  console.log(`📦 发现 ${files.length} 个知识源文件`);

  const index = {
    version: '2.0',
    createdAt: new Date().toISOString(),
    totalSources: files.length,
    sources: [],
    indexes: {
      keyword: {},
      category: {},
      tag: {},
      file: {}
    },
    searchableContent: []
  };

  let processed = 0;
  for (const file of files) {
    const filePath = path.join(knowledgeSourcesDir, file);
    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      const source = processSourceFile(file, content);
      
      index.sources.push(source);
      
      // 构建索引
      buildIndexes(index, source, content);
      
      processed++;
      if (processed % 100 === 0) {
        console.log(`✅ 已处理 ${processed}/${files.length} 个文件`);
      }
    } catch (error) {
      console.warn(`⚠️  处理文件 ${file} 时出错:`, error.message);
    }
  }

  // 保存索引
  fs.writeFileSync(indexPath, JSON.stringify(index, null, 2));
  
  console.log(`\n🎉 增强索引创建完成！`);
  console.log(`📁 索引文件: ${indexPath}`);
  console.log(`📊 统计信息:`);
  console.log(`   - 知识源总数: ${index.totalSources}`);
  console.log(`   - 关键词索引: ${Object.keys(index.indexes.keyword).length} 个关键词`);
  console.log(`   - 分类索引: ${Object.keys(index.indexes.category).length} 个分类`);
  console.log(`   - 标签索引: ${Object.keys(index.indexes.tag).length} 个标签`);
  console.log(`   - 文件索引: ${Object.keys(index.indexes.file).length} 个文件`);
  
  console.log(`\n🚀 现在可以使用增强索引进行快速查询了！`);
}

function processSourceFile(filename, content) {
  const id = path.basename(filename, '.md');
  const name = id.replace(/-/g, ' ').replace(/\b\w/g, char => char.toUpperCase());
  
  // 提取元数据
  const metadata = extractMetadata(content);
  const category = metadata.category || '未分类';
  const tags = metadata.tags || [];
  
  return {
    id,
    name,
    filename,
    category,
    tags,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    wordCount: content.length,
    metadata
  };
}

function extractMetadata(content) {
  const metadata = {};
  
  // 尝试提取 YAML 或 JSON 元数据
  const yamlMatch = content.match(/^---[\s\S]*?---/);
  if (yamlMatch) {
    try {
      const yamlContent = yamlMatch[0].replace(/^---|---$/g, '').trim();
      const lines = yamlContent.split('\n');
      for (const line of lines) {
        const match = line.match(/^\s*(\w+):\s*(.+)$/);
        if (match) {
          const key = match[1];
          let value = match[2].trim();
          if (value.startsWith('[') && value.endsWith(']')) {
            value = JSON.parse(value);
          }
          metadata[key] = value;
        }
      }
    } catch (e) {
      // 忽略解析错误
    }
  }
  
  return metadata;
}

function buildIndexes(index, source, content) {
  // 关键词索引
  const keywords = extractKeywords(content);
  for (const keyword of keywords) {
    if (!index.indexes.keyword[keyword]) {
      index.indexes.keyword[keyword] = [];
    }
    index.indexes.keyword[keyword].push({
      id: source.id,
      filename: source.filename,
      name: source.name,
      category: source.category
    });
  }
  
  // 分类索引
  if (!index.indexes.category[source.category]) {
    index.indexes.category[source.category] = [];
  }
  index.indexes.category[source.category].push({
    id: source.id,
    filename: source.filename,
    name: source.name
  });
  
  // 标签索引
  for (const tag of source.tags) {
    if (!index.indexes.tag[tag]) {
      index.indexes.tag[tag] = [];
    }
    index.indexes.tag[tag].push({
      id: source.id,
      filename: source.filename,
      name: source.name,
      category: source.category
    });
  }
  
  // 文件索引
  index.indexes.file[source.id] = {
    name: source.name,
    filename: source.filename,
    category: source.category,
    tags: source.tags
  };
  
  // 搜索内容
  index.searchableContent.push({
    id: source.id,
    name: source.name,
    content: content.substring(0, 1000) // 只索引前1000字符
  });
}

function extractKeywords(content) {
  const stopWords = new Set([
    '的', '了', '是', '在', '我', '有', '和', '就', '不', '人', '都', '一', '一个', '上', '也', '很', '到', '说', '要', '去', '你', '会', '着', '没有', '看', '好', '自己', '这',
    'the', 'and', 'is', 'in', 'to', 'of', 'a', 'for', 'with', 'on', 'as', 'by', 'at', 'from', 'that', 'this', 'it', 'have', 'be', 'are', 'was', 'were'
  ]);
  
  // 提取中文关键词
  const chineseKeywords = content.match(/[\u4e00-\u9fa5]{2,}/g) || [];
  
  // 提取英文关键词
  const englishKeywords = content.match(/[a-zA-Z]{3,}/g) || [];
  
  // 合并并去重
  const allKeywords = [...chineseKeywords, ...englishKeywords]
    .filter(keyword => !stopWords.has(keyword.toLowerCase()))
    .filter(keyword => keyword.length >= 2);
  
  return [...new Set(allKeywords)];
}

createEnhancedIndex();
