const fs = require('fs');
const path = require('path');

class KeywordManager {
  constructor(dataDir) {
    this.dataDir = dataDir;
    this.keywordFile = path.join(dataDir, 'keyword-db.json');
    this.keywords = {};
    this.loadKeywords();
  }

  loadKeywords() {
    try {
      if (fs.existsSync(this.keywordFile)) {
        const content = fs.readFileSync(this.keywordFile, 'utf8');
        this.keywords = JSON.parse(content);
        console.log(`✅ 加载了 ${Object.keys(this.keywords).length} 个关键词`);
      } else {
        this.keywords = {};
        console.log('📋 创建新的关键词库');
      }
    } catch (error) {
      console.error('加载关键词库失败:', error.message);
      this.keywords = {};
    }
  }

  saveKeywords() {
    try {
      const content = JSON.stringify(this.keywords, null, 2);
      fs.writeFileSync(this.keywordFile, content, 'utf8');
      console.log(`💾 保存了 ${Object.keys(this.keywords).length} 个关键词`);
    } catch (error) {
      console.error('保存关键词库失败:', error.message);
    }
  }

  addSynonym(mainTerm, synonym) {
    if (!this.keywords[mainTerm]) {
      this.keywords[mainTerm] = {
        synonyms: [],
        description: '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
    }

    if (!this.keywords[mainTerm].synonyms.includes(synonym)) {
      this.keywords[mainTerm].synonyms.push(synonym);
      this.keywords[mainTerm].updatedAt = new Date().toISOString();
      this.saveKeywords();
      console.log(`✅ 添加同义词: "${synonym}" → "${mainTerm}"`);
    } else {
      console.log(`ℹ️ 同义词已存在: "${synonym}" → "${mainTerm}"`);
    }

    return true;
  }

  addSynonyms(mainTerm, synonyms) {
    for (const synonym of synonyms) {
      this.addSynonym(mainTerm, synonym);
    }
    return true;
  }

  findMatches(term) {
    const matches = [];
    const termLower = term.toLowerCase();

    for (const [mainTerm, data] of Object.entries(this.keywords)) {
      if (mainTerm.toLowerCase().includes(termLower) || termLower.includes(mainTerm.toLowerCase())) {
        matches.push({
          mainTerm,
          matchType: 'exact_contains',
          synonyms: data.synonyms,
          description: data.description
        });
      }

      for (const synonym of data.synonyms) {
        if (synonym.toLowerCase().includes(termLower) || termLower.includes(synonym.toLowerCase())) {
          matches.push({
            mainTerm,
            matchType: 'synonym_contains',
            synonyms: data.synonyms,
            description: data.description
          });
        }
      }
    }

    const uniqueMatches = [];
    const seen = new Set();
    for (const match of matches) {
      const key = match.mainTerm;
      if (!seen.has(key)) {
        seen.add(key);
        uniqueMatches.push(match);
      }
    }

    return uniqueMatches;
  }

  getMainTerm(term) {
    const termLower = term.toLowerCase();

    if (this.keywords[term]) {
      return term;
    }

    for (const [mainTerm, data] of Object.entries(this.keywords)) {
      if (mainTerm.toLowerCase() === termLower) {
        return mainTerm;
      }

      for (const synonym of data.synonyms) {
        if (synonym.toLowerCase() === termLower) {
          return mainTerm;
        }
      }
    }

    return null;
  }

  getAllSynonyms(term) {
    const mainTerm = this.getMainTerm(term);
    if (mainTerm && this.keywords[mainTerm]) {
      return [mainTerm, ...this.keywords[mainTerm].synonyms];
    }
    return [term];
  }

  searchKnowledgeQuery(query) {
    const words = query.split(/\s+/).filter(w => w.length > 1);
    const expandedTerms = [];

    for (const word of words) {
      const synonyms = this.getAllSynonyms(word);
      expandedTerms.push(...synonyms);
    }

    const uniqueTerms = [...new Set(expandedTerms)];
    return uniqueTerms.join(' ');
  }

  updateDescription(term, description) {
    if (!this.keywords[term]) {
      this.keywords[term] = {
        synonyms: [],
        description: '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
    }

    this.keywords[term].description = description;
    this.keywords[term].updatedAt = new Date().toISOString();
    this.saveKeywords();
    console.log(`✅ 更新描述: "${term}"`);
    return true;
  }

  listKeywords() {
    return Object.entries(this.keywords).map(([term, data]) => ({
      term,
      synonyms: data.synonyms,
      description: data.description,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt
    }));
  }

  deleteKeyword(term) {
    if (this.keywords[term]) {
      delete this.keywords[term];
      this.saveKeywords();
      console.log(`🗑️ 删除关键词: "${term}"`);
      return true;
    }
    return false;
  }
}

module.exports = KeywordManager;
