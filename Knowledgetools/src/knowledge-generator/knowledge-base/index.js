const fs = require('fs');
const path = require('path');

class KnowledgeBase {
  constructor(storageDir) {
    this.storageDir = storageDir;
    this.knowledgeFile = path.join(storageDir, 'knowledge-base.json');
    this.data = this.load();
  }

  load() {
    if (fs.existsSync(this.knowledgeFile)) {
      try {
        const content = fs.readFileSync(this.knowledgeFile, 'utf-8');
        return JSON.parse(content);
      } catch (error) {
        console.error('加载知识库失败:', error.message);
      }
    }
    return {
      businessScenarios: [],
      apis: [],
      classes: [],
      functions: [],
      created: new Date().toISOString(),
      updated: new Date().toISOString()
    };
  }

  save() {
    if (!fs.existsSync(this.storageDir)) {
      fs.mkdirSync(this.storageDir, { recursive: true });
    }
    
    this.data.updated = new Date().toISOString();
    fs.writeFileSync(this.knowledgeFile, JSON.stringify(this.data, null, 2));
    console.log('知识库已保存');
  }

  updateFromAnalysis(analysis) {
    this.data.businessScenarios = analysis.businessScenarios;
    this.data.apis = analysis.apis;
    this.data.classes = analysis.classes;
    this.data.functions = analysis.functions;
    this.save();
  }

  searchBusinessScenario(query) {
    const results = [];
    const lowerQuery = query.toLowerCase();
    
    for (const scenario of this.data.businessScenarios) {
      if (scenario.name.toLowerCase().includes(lowerQuery) ||
          scenario.description.toLowerCase().includes(lowerQuery) ||
          scenario.filePath.toLowerCase().includes(lowerQuery)) {
        results.push(this.enrichScenario(scenario));
      }
    }
    
    return results;
  }

  enrichScenario(scenario) {
    const relatedAPIs = this.data.apis.filter(api => 
      api.filePath === scenario.filePath
    );
    
    const relatedClasses = this.data.classes.filter(cls => 
      cls.filePath === scenario.filePath
    );
    
    const relatedFunctions = this.data.functions.filter(func => 
      func.filePath === scenario.filePath
    );
    
    return {
      ...scenario,
      relatedAPIs,
      relatedClasses,
      relatedFunctions
    };
  }

  searchAPI(query) {
    const lowerQuery = query.toLowerCase();
    return this.data.apis.filter(api =>
      api.url.toLowerCase().includes(lowerQuery) ||
      api.filePath.toLowerCase().includes(lowerQuery)
    );
  }

  getAllScenarios() {
    return this.data.businessScenarios;
  }

  getAllAPIs() {
    return this.data.apis;
  }

  exportMarkdown(outputPath) {
    let markdown = '# 知识库\n\n';
    markdown += `生成时间: ${new Date().toLocaleString()}\n\n`;
    
    markdown += '## 业务场景\n\n';
    for (const scenario of this.data.businessScenarios) {
      markdown += `### ${scenario.name}\n\n`;
      if (scenario.description) {
        markdown += `${scenario.description}\n\n`;
      }
      markdown += `- 文件: ${scenario.filePath}\n`;
      markdown += `- 行号: ${scenario.lineNumber}\n\n`;
    }
    
    markdown += '## API 接口\n\n';
    for (const api of this.data.apis) {
      markdown += `### ${api.method} ${api.url}\n\n`;
      markdown += `- 文件: ${api.filePath}\n`;
      markdown += `- 行号: ${api.lineNumber}\n`;
      if (api.parameters.length > 0) {
        markdown += `- 参数: ${api.parameters.join(', ')}\n`;
      }
      markdown += '\n';
    }
    
    fs.writeFileSync(outputPath, markdown);
    console.log(`Markdown 文档已导出到: ${outputPath}`);
  }
}

module.exports = KnowledgeBase;
