class QASystem {
  constructor(knowledgeBase) {
    this.knowledgeBase = knowledgeBase;
  }

  ask(question) {
    console.log(`\n🤔 问题: "${question}"`);
    console.log('='.repeat(60));

    const results = this.analyzeQuestion(question);
    
    if (results.length === 0) {
      return {
        success: false,
        message: '未找到相关的业务场景信息',
        suggestions: this.getSuggestions()
      };
    }

    return {
      success: true,
      results: results.map(r => this.formatAnswer(r))
    };
  }

  analyzeQuestion(question) {
    const keywords = this.extractKeywords(question);
    const results = [];
    
    for (const keyword of keywords) {
      const scenarios = this.knowledgeBase.searchBusinessScenario(keyword);
      results.push(...scenarios);
    }
    
    const uniqueResults = this.deduplicate(results);
    return uniqueResults;
  }

  extractKeywords(question) {
    const stopWords = ['的', '是', '什么', '怎么', '如何', '哪里', '哪个', '吗', '呢', '啊',
                      '业务', '场景', '功能', '模块', '接口', '代码', '路径', '位置'];
    
    let processed = question.toLowerCase();
    
    for (const word of stopWords) {
      processed = processed.replace(new RegExp(word, 'g'), ' ');
    }
    
    const keywords = processed.split(/\s+/).filter(w => w.length > 0);
    
    if (keywords.length === 0) {
      keywords.push(question);
    }
    
    return keywords;
  }

  deduplicate(items) {
    const seen = new Set();
    return items.filter(item => {
      const key = `${item.name}-${item.filePath}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  formatAnswer(scenario) {
    let answer = `\n📌 **${scenario.name}**\n`;
    answer += '─'.repeat(50) + '\n\n';
    
    if (scenario.description) {
      answer += `📝 **业务逻辑**: ${scenario.description}\n\n`;
    }
    
    answer += `📍 **代码位置**:\n`;
    answer += `   - 文件路径: ${scenario.filePath}\n`;
    answer += `   - 行号: 第 ${scenario.lineNumber} 行\n\n`;
    
    if (scenario.relatedAPIs && scenario.relatedAPIs.length > 0) {
      answer += `🔗 **相关接口**:\n`;
      for (const api of scenario.relatedAPIs) {
        answer += `   - [${api.method}] ${api.url}\n`;
        answer += `     位置: ${api.filePath}:${api.lineNumber}\n`;
        if (api.parameters.length > 0) {
          answer += `     关键参数: ${api.parameters.join(', ')}\n`;
        }
        answer += '\n';
      }
    }
    
    if (scenario.relatedClasses && scenario.relatedClasses.length > 0) {
      answer += `🏷️ **相关类**:\n`;
      for (const cls of scenario.relatedClasses) {
        answer += `   - ${cls.name} (${cls.filePath}:${cls.lineNumber})\n`;
      }
      answer += '\n';
    }
    
    if (scenario.relatedFunctions && scenario.relatedFunctions.length > 0) {
      answer += `⚡ **相关函数**:\n`;
      const funcNames = scenario.relatedFunctions.map(f => f.name).slice(0, 10);
      answer += `   - ${funcNames.join(', ')}\n`;
      if (scenario.relatedFunctions.length > 10) {
        answer += `   ... 还有 ${scenario.relatedFunctions.length - 10} 个函数\n`;
      }
      answer += '\n';
    }
    
    return answer;
  }

  getSuggestions() {
    const scenarios = this.knowledgeBase.getAllScenarios();
    if (scenarios.length === 0) return [];
    
    return scenarios.slice(0, 5).map(s => s.name);
  }

  displayAnswer(result) {
    if (!result.success) {
      console.log(`❌ ${result.message}`);
      if (result.suggestions && result.suggestions.length > 0) {
        console.log('\n💡 你可以问:');
        result.suggestions.forEach(s => console.log(`   - "${s} 是什么业务?"`));
      }
      return;
    }
    
    console.log(`\n✅ 找到 ${result.results.length} 个相关结果:`);
    result.results.forEach(answer => console.log(answer));
  }
}

module.exports = QASystem;
