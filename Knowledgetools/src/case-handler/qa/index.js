class CaseQASystem {
  constructor(caseKnowledgeBase, knowledgeBase) {
    this.caseKnowledgeBase = caseKnowledgeBase;
    this.knowledgeBase = knowledgeBase;
  }

  ask(question) {
    console.log(`\n🔍 课诉问题: "${question}"`);
    console.log('='.repeat(60));

    const caseResults = this.searchCaseKnowledgeBase(question);
    const businessResults = this.searchBusinessKnowledge(question);
    
    const combinedResults = this.combineAndRankResults(caseResults, businessResults, question);
    
    if (combinedResults.length === 0) {
      return {
        success: false,
        message: '未找到相关的课诉案例或业务知识',
        suggestions: this.getSuggestions()
      };
    }

    return {
      success: true,
      results: combinedResults.map(r => this.formatAnswer(r))
    };
  }

  searchCaseKnowledgeBase(question) {
    const keywords = this.extractKeywords(question);
    const results = [];
    
    for (const keyword of keywords) {
      const cases = this.caseKnowledgeBase.search(keyword);
      results.push(...cases);
    }
    
    return this.deduplicate(results);
  }

  searchBusinessKnowledge(question) {
    const keywords = this.extractKeywords(question);
    const results = [];
    
    for (const keyword of keywords) {
      const scenarios = this.knowledgeBase.searchBusinessScenario(keyword);
      results.push(...scenarios.map(s => ({
        type: 'business',
        data: s
      })));
    }
    
    return this.deduplicate(results);
  }

  extractKeywords(question) {
    const stopWords = ['的', '是', '什么', '怎么', '如何', '哪里', '哪个', '吗', '呢', '啊',
                      '问题', '课诉', '投诉', '反馈', 'bug', '错误', '异常', '失败', '不行',
                      '不显示', '不见了', '没有', '无法', '不能', '闪退', '卡顿', '慢'];
    
    let processed = question.toLowerCase();
    
    for (const word of stopWords) {
      processed = processed.replace(new RegExp(word, 'g'), ' ');
    }
    
    const keywords = processed.split(/\s+/).filter(w => w.length > 0);
    
    // 保留原始查询作为关键词之一
    keywords.push(question);
    
    return [...new Set(keywords)];
  }

  deduplicate(items) {
    const seen = new Set();
    return items.filter(item => {
      const key = item.type === 'business' 
        ? `business-${item.data.id}` 
        : `case-${item.meta.id}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  combineAndRankResults(caseResults, businessResults, question) {
    const allResults = [];
    
    // 处理案例结果
    for (const r of caseResults) {
      const caseResult = {
        type: 'case',
        data: r
      };
      const score = this.calculateScore(caseResult, question);
      allResults.push({ ...caseResult, score });
    }
    
    // 处理业务结果
    for (const r of businessResults) {
      const businessResult = {
        type: 'business',
        data: r
      };
      const score = this.calculateScore(businessResult, question);
      allResults.push({ ...businessResult, score });
    }
    
    console.log('案例结果数量:', caseResults.length);
    console.log('业务结果数量:', businessResults.length);
    console.log('所有结果:', allResults);
    
    return allResults
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);
  }

  calculateScore(result, question) {
    let score = 0;
    const lowerQuestion = question.toLowerCase();
    
    if (result.type === 'case') {
      if (result.data && result.data.meta && result.data.meta.title) {
        const title = result.data.meta.title.toLowerCase();
        if (title.includes(lowerQuestion)) score += 100;
      }
      if (result.data && result.data.meta && result.data.meta.status === 'active') score += 20;
      if (result.data && result.data.meta && result.data.meta.priority === 'high') score += 30;
    } else {
      if (result.data && result.data.name) {
        const name = result.data.name.toLowerCase();
        if (name.includes(lowerQuestion)) score += 80;
      }
    }
    
    return score;
  }

  formatAnswer(result) {
    if (result.type === 'case') {
      return this.formatCaseAnswer(result);
    } else {
      return this.formatBusinessAnswer(result);
    }
  }

  formatCaseAnswer(result) {
    const c = result.data;
    if (!c || !c.meta || !c.meta.title) {
      return `\n🏥 **课诉案例**: 未知\n`;
    }
    let answer = `\n🏥 **课诉案例**: ${c.meta.title}\n`;
    answer += '─'.repeat(50) + '\n\n';
    
    answer += `📋 **分类**: ${c.meta.category || '未分类'}\n`;
    answer += `⚡ **优先级**: ${c.meta.priority || 'medium'}\n`;
    answer += `📌 **状态**: ${c.meta.status || 'active'}\n`;
    if (c.meta.tags && c.meta.tags.length > 0) {
      answer += `🏷️ **标签**: ${c.meta.tags.join(', ')}\n`;
    }
    answer += '\n';
    
    if (c.meta.relatedBusiness && c.meta.relatedBusiness.length > 0) {
      answer += `🔗 **关联业务**: ${c.meta.relatedBusiness.join(', ')}\n\n`;
    }
    
    answer += `📖 **查看完整案例**: km case get ${c.meta.id || 'unknown'}\n`;
    
    return answer;
  }

  formatBusinessAnswer(result) {
    const s = result.data;
    if (!s || !s.name) {
      return `\n💼 **业务场景**: 未知\n`;
    }
    let answer = `\n💼 **业务场景**: ${s.name}\n`;
    answer += '─'.repeat(50) + '\n\n';
    
    if (s.description) {
      answer += `📝 **业务描述**: ${s.description}\n\n`;
    }
    
    answer += `📍 **代码位置**:\n`;
    answer += `   - 文件路径: ${s.filePath || '未知'}\n`;
    if (s.lineNumber) {
      answer += `   - 行号: 第 ${s.lineNumber} 行\n`;
    }
    answer += '\n';
    
    if (s.relatedAPIs && s.relatedAPIs.length > 0) {
      answer += `🔗 **相关接口** (${s.relatedAPIs.length} 个):\n`;
      s.relatedAPIs.slice(0, 3).forEach(api => {
        answer += `   - [${api.method}] ${api.url}\n`;
      });
      if (s.relatedAPIs.length > 3) {
        answer += `   ... 还有 ${s.relatedAPIs.length - 3} 个接口\n`;
      }
      answer += '\n';
    }
    
    answer += `📖 **查看完整知识源**: km get ${s.id || 'unknown'}\n`;
    
    return answer;
  }

  getSuggestions() {
    const cases = this.caseKnowledgeBase.listCases();
    const scenarios = this.knowledgeBase.getAllScenarios();
    
    const suggestions = [];
    suggestions.push(...cases.slice(0, 3).map(c => c.title));
    suggestions.push(...scenarios.slice(0, 2).map(s => s.name));
    
    return suggestions;
  }

  displayAnswer(result) {
    if (!result.success) {
      console.log(`❌ ${result.message}`);
      if (result.suggestions && result.suggestions.length > 0) {
        console.log('\n💡 你可以问:');
        result.suggestions.forEach(s => console.log(`   - "${s} 怎么处理?"`));
      }
      return;
    }
    
    console.log(`\n✅ 找到 ${result.results.length} 个相关结果:`);
    result.results.forEach(answer => console.log(answer));
  }
}

module.exports = CaseQASystem;
