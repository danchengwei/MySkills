const fs = require('fs');
const path = require('path');

class CaseKnowledgeBase {
  constructor(storageDir) {
    this.storageDir = storageDir;
    this.indexFile = path.join(storageDir, 'case-index.json');
    this.casesDir = path.join(storageDir, 'cases');
    this.ensureDirectories();
    this.index = this.loadIndex();
  }

  ensureDirectories() {
    if (!fs.existsSync(this.storageDir)) {
      fs.mkdirSync(this.storageDir, { recursive: true });
    }
    if (!fs.existsSync(this.casesDir)) {
      fs.mkdirSync(this.casesDir, { recursive: true });
    }
  }

  loadIndex() {
    if (fs.existsSync(this.indexFile)) {
      try {
        const content = fs.readFileSync(this.indexFile, 'utf-8');
        return JSON.parse(content);
      } catch (error) {
        console.error('加载课诉知识库索引失败:', error.message);
      }
    }
    return {
      version: '1.0',
      created: new Date().toISOString(),
      updated: new Date().toISOString(),
      cases: [],
      statistics: {
        totalCount: 0,
        categories: {},
        tags: {},
        statuses: {}
      }
    };
  }

  saveIndex() {
    this.index.updated = new Date().toISOString();
    this.index.statistics.totalCount = this.index.cases.length;
    
    const categories = {};
    const tags = {};
    const statuses = {};
    
    for (const c of this.index.cases) {
      if (c.category) {
        categories[c.category] = (categories[c.category] || 0) + 1;
      }
      if (c.tags) {
        for (const tag of c.tags) {
          tags[tag] = (tags[tag] || 0) + 1;
        }
      }
      if (c.status) {
        statuses[c.status] = (statuses[c.status] || 0) + 1;
      }
    }
    
    this.index.statistics.categories = categories;
    this.index.statistics.tags = tags;
    this.index.statistics.statuses = statuses;
    
    fs.writeFileSync(this.indexFile, JSON.stringify(this.index, null, 2));
  }

  addCase(caseData) {
    const id = this.generateCaseId(caseData.title);
    const filename = `${id}.md`;
    const filepath = path.join(this.casesDir, filename);
    
    const caseMeta = {
      id,
      title: caseData.title,
      filename,
      category: caseData.category || '未分类',
      tags: caseData.tags || [],
      status: caseData.status || 'active',
      priority: caseData.priority || 'medium',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      relatedBusiness: caseData.relatedBusiness || [],
      relatedKnowledge: caseData.relatedKnowledge || []
    };
    
    const markdownContent = this.generateCaseMarkdown(caseData);
    fs.writeFileSync(filepath, markdownContent);
    
    const existingIndex = this.index.cases.findIndex(c => c.id === id);
    if (existingIndex >= 0) {
      this.index.cases[existingIndex] = caseMeta;
    } else {
      this.index.cases.push(caseMeta);
    }
    
    this.saveIndex();
    console.log(`✅ 已添加课诉案例: ${caseData.title}`);
    return id;
  }

  generateCaseId(title) {
    return title.toLowerCase()
      .replace(/[^\w\u4e00-\u9fa5]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  generateCaseMarkdown(caseData) {
    let markdown = `# ${caseData.title}\n\n`;
    
    markdown += `> 创建时间: ${new Date().toLocaleString()}\n\n`;
    
    if (caseData.category) {
      markdown += `**分类**: ${caseData.category}\n\n`;
    }
    
    if (caseData.priority) {
      markdown += `**优先级**: ${caseData.priority}\n\n`;
    }
    
    if (caseData.status) {
      markdown += `**状态**: ${caseData.status}\n\n`;
    }
    
    if (caseData.tags && caseData.tags.length > 0) {
      markdown += `**标签**: ${caseData.tags.join(', ')}\n\n`;
    }
    
    markdown += '---\n\n';
    
    if (caseData.problemDescription) {
      markdown += '## 📋 问题描述\n\n';
      markdown += `${caseData.problemDescription}\n\n`;
    }
    
    if (caseData.reproductionSteps && caseData.reproductionSteps.length > 0) {
      markdown += '## 🔄 复现步骤\n\n';
      caseData.reproductionSteps.forEach((step, i) => {
        markdown += `${i + 1}. ${step}\n`;
      });
      markdown += '\n';
    }
    
    if (caseData.rootCause) {
      markdown += '## 🔍 根本原因\n\n';
      markdown += `${caseData.rootCause}\n\n`;
    }
    
    if (caseData.businessLogic) {
      markdown += '## 💼 关联业务逻辑\n\n';
      markdown += `${caseData.businessLogic}\n\n`;
    }
    
    if (caseData.solution && caseData.solution.length > 0) {
      markdown += '## ✅ 解决方案\n\n';
      caseData.solution.forEach((step, i) => {
        markdown += `### ${i + 1}. ${step.title}\n\n`;
        if (step.description) {
          markdown += `${step.description}\n\n`;
        }
        if (step.codeReference) {
          markdown += '```\n';
          markdown += `${step.codeReference}\n`;
          markdown += '```\n\n';
        }
      });
    }
    
    if (caseData.relatedBusiness && caseData.relatedBusiness.length > 0) {
      markdown += '## 🔗 关联业务场景\n\n';
      caseData.relatedBusiness.forEach(b => {
        markdown += `- ${b}\n`;
      });
      markdown += '\n';
    }
    
    if (caseData.relatedKnowledge && caseData.relatedKnowledge.length > 0) {
      markdown += '## 📚 关联知识源\n\n';
      caseData.relatedKnowledge.forEach(k => {
        markdown += `- ${k}\n`;
      });
      markdown += '\n';
    }
    
    if (caseData.codeLocation) {
      markdown += '## 📍 代码位置\n\n';
      markdown += `- **文件路径**: ${caseData.codeLocation.filePath || '未知'}\n`;
      if (caseData.codeLocation.lineNumber) {
        markdown += `- **行号**: 第 ${caseData.codeLocation.lineNumber} 行\n`;
      }
      if (caseData.codeLocation.gitUrl) {
        markdown += `- **Git 链接**: ${caseData.codeLocation.gitUrl}\n`;
      }
      markdown += '\n';
    }
    
    if (caseData.prevention) {
      markdown += '## 🛡️ 预防措施\n\n';
      markdown += `${caseData.prevention}\n\n`;
    }
    
    if (caseData.notes && caseData.notes.length > 0) {
      markdown += '## 📌 备注\n\n';
      caseData.notes.forEach(note => {
        markdown += `- ${note}\n`;
      });
      markdown += '\n';
    }
    
    return markdown;
  }

  getCase(id) {
    const caseMeta = this.index.cases.find(c => c.id === id);
    if (!caseMeta) return null;
    
    const filepath = path.join(this.casesDir, caseMeta.filename);
    if (!fs.existsSync(filepath)) return null;
    
    const content = fs.readFileSync(filepath, 'utf-8');
    return {
      meta: caseMeta,
      content
    };
  }

  listCases(options = {}) {
    let cases = [...this.index.cases];
    
    if (options.category) {
      cases = cases.filter(c => c.category === options.category);
    }
    
    if (options.tag) {
      cases = cases.filter(c => c.tags && c.tags.includes(options.tag));
    }
    
    if (options.status) {
      cases = cases.filter(c => c.status === options.status);
    }
    
    if (options.search) {
      const searchLower = options.search.toLowerCase();
      cases = cases.filter(c => 
        c.title.toLowerCase().includes(searchLower) ||
        c.id.toLowerCase().includes(searchLower)
      );
    }
    
    return cases;
  }

  deleteCase(id) {
    const index = this.index.cases.findIndex(c => c.id === id);
    if (index < 0) return false;
    
    const caseMeta = this.index.cases[index];
    const filepath = path.join(this.casesDir, caseMeta.filename);
    
    if (fs.existsSync(filepath)) {
      fs.unlinkSync(filepath);
    }
    
    this.index.cases.splice(index, 1);
    this.saveIndex();
    
    console.log(`🗑️ 已删除课诉案例: ${caseMeta.title}`);
    return true;
  }

  search(query) {
    const cases = this.listCases({ search: query });
    const results = [];
    
    for (const c of cases) {
      const fullCase = this.getCase(c.id);
      if (fullCase) {
        results.push(fullCase);
      }
    }
    
    return results;
  }

  getStatistics() {
    return this.index.statistics;
  }

  getCategories() {
    return Object.keys(this.index.statistics.categories || {});
  }

  getTags() {
    return Object.keys(this.index.statistics.tags || {});
  }
}

module.exports = CaseKnowledgeBase;
