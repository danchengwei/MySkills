const fs = require('fs');
const path = require('path');

class KnowledgeSearch {
  constructor(indexPath, sourcesPath) {
    this.indexPath = indexPath;
    this.sourcesPath = sourcesPath;
    this.index = null;
    this.loadIndex();
  }

  loadIndex() {
    try {
      const indexContent = fs.readFileSync(this.indexPath, 'utf8');
      this.index = JSON.parse(indexContent);
      console.log(`Loaded index with ${this.index.totalSources} sources`);
    } catch (error) {
      console.error('Failed to load index:', error);
      this.index = { sources: [], indexes: {} };
    }
  }

  search(query, limit = 10) {
    if (!this.index) {
      this.loadIndex();
    }

    const queryWords = this.extractKeywords(query);
    const results = [];

    // 搜索每个知识源
    for (const source of this.index.sources) {
      const relevance = this.calculateRelevance(source, queryWords);
      if (relevance > 0) {
        results.push({ ...source, relevance });
      }
    }

    // 按相关性排序
    results.sort((a, b) => b.relevance - a.relevance);

    // 限制结果数量
    return results.slice(0, limit);
  }

  extractKeywords(text) {
    // 简单的关键词提取，实际应用中可以使用更复杂的NLP技术
    return text.toLowerCase()
      .replace(/[.,?!;:/"'()]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 1);
  }

  // 中英文关键词映射
  getKeywordMap() {
    return {
      '卡牌游戏': ['card', 'game'],
      '伴读预习': ['companion', 'reading', 'preview'],
      'AI语音': ['ai', 'speech', 'voice'],
      '直播课堂': ['live', 'class', 'lesson'],
      '成就系统': ['achievement', 'system']
    };
  }

  // 扩展查询关键词
  expandKeywords(query) {
    const keywords = this.extractKeywords(query);
    const keywordMap = this.getKeywordMap();
    const expanded = [...keywords];

    // 添加中英文映射
    for (const [chinese, englishWords] of Object.entries(keywordMap)) {
      if (query.includes(chinese)) {
        expanded.push(...englishWords);
      }
    }

    return expanded;
  }

  calculateRelevance(source, queryWords) {
    let score = 0;
    const expandedWords = this.expandKeywords(queryWords.join(' '));
    
    // 检查基本信息
    const sourceText = `${source.name} ${source.category} ${source.tags.join(' ')}`.toLowerCase();
    for (const word of expandedWords) {
      if (sourceText.includes(word)) {
        score += 1;
      }
    }

    // 检查文件内容
    const content = this.getSourceContent(source.id);
    if (content) {
      const contentText = content.toLowerCase();
      for (const word of expandedWords) {
        if (contentText.includes(word)) {
          score += 2; // 内容匹配权重更高
        }
      }
    }

    return score;
  }

  getSourceContent(sourceId) {
    const source = this.index.sources.find(s => s.id === sourceId);
    if (!source) {
      return null;
    }

    const filePath = path.join(this.sourcesPath, source.filename);
    try {
      return fs.readFileSync(filePath, 'utf8');
    } catch (error) {
      console.error(`Failed to read source ${sourceId}:`, error);
      return null;
    }
  }

  searchAndSummarize(query, limit = 5) {
    const results = this.search(query, limit);
    const summaries = [];

    for (const result of results) {
      const content = this.getSourceContent(result.id);
      if (content) {
        const summary = this.extractSummary(content);
        summaries.push({
          id: result.id,
          name: result.name,
          filename: result.filename,
          relevance: result.relevance,
          summary
        });
      }
    }

    return summaries;
  }

  extractSummary(content, maxLength = 200) {
    // 简单的摘要提取，实际应用中可以使用更复杂的NLP技术
    const plainText = content.replace(/[#*`]/g, '');
    const lines = plainText.split('\n').filter(line => line.trim().length > 0);
    const summary = lines.slice(0, 3).join(' ');
    return summary.length > maxLength ? summary.substring(0, maxLength) + '...' : summary;
  }
}

module.exports = KnowledgeSearch;