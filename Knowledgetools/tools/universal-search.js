#!/usr/bin/env node
const path = require('path');
const fs = require('fs');

// 加载知识工具
const knowledgeTools = require('./index');

class UniversalSearch {
  constructor() {
    this.knowledgeTools = knowledgeTools;
  }

  /**
   * 分析用户提问，识别场景类型
   * @param {string} query - 用户提问
   * @returns {string} 场景类型: 'development' | 'case' | 'knowledge' | 'general'
   */
  analyzeQuery(query) {
    const lowerQuery = query.toLowerCase();
    
    // 开发相关关键词
    const devKeywords = [
      '开发', '代码', 'bug', '修复', '审查', '规范', 'android', 'crash',
      '空指针', '死循环', '编译', '测试', '调试', '实现', '重构'
    ];
    
    // 客诉相关关键词
    const caseKeywords = [
      '客诉', '问题', '打不开', '报错', '故障', '异常', '投诉', '反馈',
      'bug', '崩溃', '无法', '失败', '错误', '闪退'
    ];
    
    // 知识库相关关键词
    const knowledgeKeywords = [
      '业务', '功能', '模块', '接口', 'API', '路径', '位置', '逻辑',
      '场景', '知识', '说明', '文档', '指南'
    ];
    
    // 统计各场景的关键词匹配数
    let devScore = 0;
    let caseScore = 0;
    let knowledgeScore = 0;
    
    for (const keyword of devKeywords) {
      if (lowerQuery.includes(keyword)) {
        devScore++;
      }
    }
    
    for (const keyword of caseKeywords) {
      if (lowerQuery.includes(keyword)) {
        caseScore++;
      }
    }
    
    for (const keyword of knowledgeKeywords) {
      if (lowerQuery.includes(keyword)) {
        knowledgeScore++;
      }
    }
    
    // 确定最高得分的场景
    const maxScore = Math.max(devScore, caseScore, knowledgeScore);
    
    if (maxScore === 0) {
      return 'general';
    }
    
    if (maxScore === devScore) {
      return 'development';
    } else if (maxScore === caseScore) {
      return 'case';
    } else {
      return 'knowledge';
    }
  }

  /**
   * 执行通用搜索
   * @param {string} query - 用户提问
   * @returns {Object} 搜索结果
   */
  async search(query) {
    console.log(`🔍 通用搜索: "${query}"`);
    
    // 分析场景
    const scenario = this.analyzeQuery(query);
    console.log(`📋 识别场景: ${this.getScenarioName(scenario)}`);
    
    let results = [];
    let primaryResult = null;
    
    // 根据场景执行不同的搜索
    switch (scenario) {
      case 'development':
        primaryResult = await this.searchDevelopment(query);
        break;
      case 'case':
        primaryResult = await this.searchCase(query);
        break;
      case 'knowledge':
        primaryResult = await this.searchKnowledge(query);
        break;
      default:
        // 通用搜索，同时搜索多个来源
        primaryResult = await this.searchGeneral(query);
    }
    
    // 处理结果
    if (primaryResult) {
      results.push(primaryResult);
    }
    
    // 补充其他相关搜索结果
    if (scenario !== 'development') {
      const devResults = await this.searchDevelopment(query);
      if (devResults && devResults.results && devResults.results.length > 0) {
        results.push({ ...devResults, scenario: 'development' });
      }
    }
    
    if (scenario !== 'case') {
      const caseResults = await this.searchCase(query);
      if (caseResults && caseResults.results && caseResults.results.length > 0) {
        results.push({ ...caseResults, scenario: 'case' });
      }
    }
    
    if (scenario !== 'knowledge') {
      const knowledgeResults = await this.searchKnowledge(query);
      if (knowledgeResults && knowledgeResults.results && knowledgeResults.results.length > 0) {
        results.push({ ...knowledgeResults, scenario: 'knowledge' });
      }
    }
    
    return {
      success: true,
      query,
      scenario,
      primaryResults: primaryResult,
      allResults: results
    };
  }

  /**
   * 搜索开发相关信息
   * @param {string} query - 用户提问
   * @returns {Object} 搜索结果
   */
  async searchDevelopment(query) {
    try {
      // 检查是否有相关的开发审查信息
      const projectPath = this.knowledgeTools.getLocalProjectPath();
      if (fs.existsSync(projectPath)) {
        console.log('🔧 搜索开发相关信息...');
        
        // 这里可以添加更复杂的开发相关搜索逻辑
        // 例如搜索本地项目中的相关代码文件
        
        return {
          scenario: 'development',
          results: [{
            type: 'development_guideline',
            title: 'Android开发规范',
            content: this.knowledgeTools.getAndroidDevelopmentGuidelines(),
            relevance: 0.8
          }]
        };
      }
    } catch (error) {
      console.warn('开发搜索失败:', error.message);
    }
    
    return null;
  }

  /**
   * 搜索客诉相关信息
   * @param {string} query - 用户提问
   * @returns {Object} 搜索结果
   */
  async searchCase(query) {
    try {
      console.log('📞 搜索客诉相关信息...');
      const result = this.knowledgeTools.askCaseQuestion(query);
      
      if (result.success && result.results && result.results.length > 0) {
        return {
          scenario: 'case',
          results: result.results.map(answer => ({
            type: 'case_answer',
            title: answer.substring(answer.indexOf('**课诉案例**: ') + 8, answer.indexOf('\n')) || '客诉案例',
            content: answer,
            relevance: 0.9
          }))
        };
      }
    } catch (error) {
      console.warn('客诉搜索失败:', error.message);
    }
    
    return null;
  }

  /**
   * 搜索知识库相关信息
   * @param {string} query - 用户提问
   * @returns {Object} 搜索结果
   */
  async searchKnowledge(query) {
    try {
      console.log('📚 搜索知识库相关信息...');
      const result = this.knowledgeTools.searchKnowledgeSources(query, 5, true);
      
      if (result.success && result.results && result.results.length > 0) {
        return {
          scenario: 'knowledge',
          results: result.results
        };
      }
    } catch (error) {
      console.warn('知识库搜索失败:', error.message);
    }
    
    return null;
  }

  /**
   * 通用搜索，同时搜索多个来源
   * @param {string} query - 用户提问
   * @returns {Object} 搜索结果
   */
  async searchGeneral(query) {
    console.log('🌐 执行通用搜索...');
    
    const [devResult, caseResult, knowledgeResult] = await Promise.all([
      this.searchDevelopment(query),
      this.searchCase(query),
      this.searchKnowledge(query)
    ]);
    
    const results = [];
    
    if (devResult && devResult.results) {
      results.push(...devResult.results.map(r => ({ ...r, scenario: 'development' })));
    }
    
    if (caseResult && caseResult.results) {
      results.push(...caseResult.results.map(r => ({ ...r, scenario: 'case' })));
    }
    
    if (knowledgeResult && knowledgeResult.results) {
      results.push(...knowledgeResult.results.map(r => ({ ...r, scenario: 'knowledge' })));
    }
    
    // 按相关性排序
    results.sort((a, b) => (b.relevance || 0) - (a.relevance || 0));
    
    return {
      scenario: 'general',
      results: results.slice(0, 5) // 只返回前5个结果
    };
  }

  /**
   * 获取场景名称
   * @param {string} scenario - 场景类型
   * @returns {string} 场景名称
   */
  getScenarioName(scenario) {
    const names = {
      development: '开发场景',
      case: '客诉场景',
      knowledge: '知识库场景',
      general: '通用场景'
    };
    return names[scenario] || scenario;
  }

  /**
   * 格式化搜索结果为可读形式
   * @param {Object} searchResult - 搜索结果
   * @returns {string} 格式化的结果
   */
  formatResults(searchResult) {
    if (!searchResult.success) {
      return '❌ 搜索失败';
    }
    
    let output = `\n🎯 搜索结果: "${searchResult.query}"\n`;
    output += '='.repeat(80) + '\n';
    output += `📋 识别场景: ${this.getScenarioName(searchResult.scenario)}\n\n`;
    
    // 主要结果
    if (searchResult.primaryResults) {
      output += `📌 主要结果 (${this.getScenarioName(searchResult.primaryResults.scenario)}):\n`;
      output += '─'.repeat(60) + '\n';
      
      if (searchResult.primaryResults.results) {
        searchResult.primaryResults.results.forEach((result, index) => {
          output += `\n${index + 1}. ${result.title || result.name || '结果'}\n`;
          output += `   相关性: ${(result.relevance * 100).toFixed(0)}%\n`;
          if (result.content) {
            output += `   内容: ${typeof result.content === 'string' ? result.content.substring(0, 100) + (result.content.length > 100 ? '...' : '') : '无内容'}\n`;
          }
          if (result.summary) {
            output += `   摘要: ${typeof result.summary === 'string' ? result.summary.substring(0, 100) + (result.summary.length > 100 ? '...' : '') : '无摘要'}\n`;
          }
          if (result.filename) {
            output += `   文件: ${result.filename}\n`;
          }
        });
      }
      output += '\n';
    }
    
    // 其他相关结果
    if (searchResult.allResults && searchResult.allResults.length > 1) {
      output += '🔍 其他相关结果:\n';
      output += '─'.repeat(60) + '\n';
      
      searchResult.allResults.forEach((resultSet, setIndex) => {
        if (resultSet.scenario !== searchResult.scenario) {
          output += `\n${setIndex + 1}. ${this.getScenarioName(resultSet.scenario)}:\n`;
          if (resultSet.results) {
            resultSet.results.forEach((result, index) => {
              output += `   ${index + 1}. ${result.title || result.name || '结果'}\n`;
              output += `      相关性: ${(result.relevance * 100).toFixed(0)}%\n`;
              if (result.content || result.summary) {
                const content = result.content || result.summary;
                output += `      ${typeof content === 'string' ? content.substring(0, 80) + (content.length > 80 ? '...' : '') : '无内容'}\n`;
              }
            });
          }
        }
      });
    }
    
    output += '='.repeat(80) + '\n';
    return output;
  }
}

// 命令行使用
if (require.main === module) {
  const universalSearch = new UniversalSearch();
  const query = process.argv.slice(2).join(' ');
  
  if (!query) {
    console.log('用法: node universal-search.js <搜索查询>');
    process.exit(1);
  }
  
  universalSearch.search(query)
    .then(result => {
      console.log(universalSearch.formatResults(result));
    })
    .catch(error => {
      console.error('搜索失败:', error);
    });
}

module.exports = UniversalSearch;