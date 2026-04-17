const fs = require('fs');
const path = require('path');

class KnowledgeManager {
  constructor(knowledgeDir) {
    this.knowledgeDir = knowledgeDir;
    this.indexFile = path.join(knowledgeDir, 'index.json');
    this.ensureDirectory();
    this.index = this.loadIndex();
  }

  ensureDirectory() {
    if (!fs.existsSync(this.knowledgeDir)) {
      fs.mkdirSync(this.knowledgeDir, { recursive: true });
    }
    const sourcesDir = path.join(this.knowledgeDir, 'sources');
    if (!fs.existsSync(sourcesDir)) {
      fs.mkdirSync(sourcesDir, { recursive: true });
    }
  }

  loadIndex() {
    if (fs.existsSync(this.indexFile)) {
      try {
        const content = fs.readFileSync(this.indexFile, 'utf-8');
        return JSON.parse(content);
      } catch (error) {
        console.error('加载知识索引失败:', error.message);
      }
    }
    return {
      version: '1.0',
      created: new Date().toISOString(),
      updated: new Date().toISOString(),
      knowledgeSources: [],
      statistics: {
        totalCount: 0,
        categories: {},
        tags: {}
      }
    };
  }

  saveIndex() {
    this.index.updated = new Date().toISOString();
    this.index.statistics.totalCount = this.index.knowledgeSources.length;
    
    const categories = {};
    const tags = {};
    for (const source of this.index.knowledgeSources) {
      if (source.category) {
        categories[source.category] = (categories[source.category] || 0) + 1;
      }
      if (source.tags) {
        for (const tag of source.tags) {
          tags[tag] = (tags[tag] || 0) + 1;
        }
      }
    }
    this.index.statistics.categories = categories;
    this.index.statistics.tags = tags;
    
    fs.writeFileSync(this.indexFile, JSON.stringify(this.index, null, 2));
  }

  addKnowledgeSource(knowledgeSource) {
    const id = this.generateId(knowledgeSource.name);
    const filename = `${id}.md`;
    const filepath = path.join(this.knowledgeDir, 'sources', filename);
    
    const sourceMeta = {
      id,
      name: knowledgeSource.name,
      filename,
      category: knowledgeSource.category || '未分类',
      tags: knowledgeSource.tags || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      filePath: knowledgeSource.filePath,
      relatedAPIs: knowledgeSource.relatedAPIs ? knowledgeSource.relatedAPIs.length : 0,
      relatedClasses: knowledgeSource.relatedClasses ? knowledgeSource.relatedClasses.length : 0,
      relatedFunctions: knowledgeSource.relatedFunctions ? knowledgeSource.relatedFunctions.length : 0
    };
    
    const markdownContent = this.generateMarkdown(knowledgeSource);
    fs.writeFileSync(filepath, markdownContent);
    
    const existingIndex = this.index.knowledgeSources.findIndex(s => s.id === id);
    if (existingIndex >= 0) {
      this.index.knowledgeSources[existingIndex] = sourceMeta;
    } else {
      this.index.knowledgeSources.push(sourceMeta);
    }
    
    this.saveIndex();
    console.log(`✅ 已保存知识源: ${knowledgeSource.name}`);
    return id;
  }

  generateId(name) {
    return name.toLowerCase()
      .replace(/[^\w\u4e00-\u9fa5]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  generateMarkdown(knowledgeSource) {
    let markdown = `# ${knowledgeSource.name}\n\n`;
    
    markdown += `> 生成时间: ${new Date().toLocaleString()}\n\n`;
    
    if (knowledgeSource.category) {
      markdown += `**分类**: ${knowledgeSource.category}\n\n`;
    }
    
    if (knowledgeSource.tags && knowledgeSource.tags.length > 0) {
      markdown += `**标签**: ${knowledgeSource.tags.join(', ')}\n\n`;
    }
    
    markdown += '---\n\n';
    
    if (knowledgeSource.description) {
      markdown += '## 📝 业务描述\n\n';
      markdown += `${knowledgeSource.description}\n\n`;
    }
    
    markdown += '## 📍 代码位置\n\n';
    markdown += `- **文件路径**: ${knowledgeSource.filePath}\n`;
    if (knowledgeSource.lineNumber) {
      markdown += `- **行号**: 第 ${knowledgeSource.lineNumber} 行\n`;
    }
    markdown += '\n';
    
    if (knowledgeSource.businessLogic && knowledgeSource.businessLogic.length > 0) {
      markdown += '## 🔄 业务逻辑\n\n';
      for (const logic of knowledgeSource.businessLogic) {
        markdown += `### ${logic.step}. ${logic.title}\n\n`;
        if (logic.description) {
          markdown += `${logic.description}\n\n`;
        }
        if (logic.codeReference) {
          markdown += '```\n';
          markdown += `${logic.codeReference}\n`;
          markdown += '```\n\n';
        }
      }
    }
    
    if (knowledgeSource.relatedAPIs && knowledgeSource.relatedAPIs.length > 0) {
      markdown += '## 🔗 相关接口\n\n';
      for (const api of knowledgeSource.relatedAPIs) {
        markdown += `### [${api.method}] ${api.url}\n\n`;
        markdown += `- **位置**: ${api.filePath}:${api.lineNumber}\n`;
        if (api.parameters && api.parameters.length > 0) {
          markdown += `- **关键参数**: ${api.parameters.join(', ')}\n`;
        }
        if (api.description) {
          markdown += `- **说明**: ${api.description}\n`;
        }
        markdown += '\n';
      }
    }
    
    if (knowledgeSource.relatedClasses && knowledgeSource.relatedClasses.length > 0) {
      markdown += '## 🏷️ 相关类\n\n';
      for (const cls of knowledgeSource.relatedClasses) {
        markdown += `- **${cls.name}** (${cls.filePath}:${cls.lineNumber})\n`;
      }
      markdown += '\n';
    }
    
    if (knowledgeSource.relatedFunctions && knowledgeSource.relatedFunctions.length > 0) {
      markdown += '## ⚡ 相关函数\n\n';
      for (const func of knowledgeSource.relatedFunctions) {
        markdown += `- **${func.name}** (${func.filePath}:${func.lineNumber})\n`;
      }
      markdown += '\n';
    }
    
    if (knowledgeSource.dataFlow) {
      markdown += '## 📊 数据流程\n\n';
      markdown += `${knowledgeSource.dataFlow}\n\n`;
    }
    
    if (knowledgeSource.notes && knowledgeSource.notes.length > 0) {
      markdown += '## 📌 注意事项\n\n';
      for (const note of knowledgeSource.notes) {
        markdown += `- ${note}\n`;
      }
      markdown += '\n';
    }
    
    return markdown;
  }

  getKnowledgeSource(id) {
    const sourceMeta = this.index.knowledgeSources.find(s => s.id === id);
    if (!sourceMeta) return null;
    
    const filepath = path.join(this.knowledgeDir, 'sources', sourceMeta.filename);
    if (!fs.existsSync(filepath)) return null;
    
    const content = fs.readFileSync(filepath, 'utf-8');
    return {
      meta: sourceMeta,
      content
    };
  }

  listKnowledgeSources(options = {}) {
    let sources = [...this.index.knowledgeSources];
    
    if (options.category) {
      sources = sources.filter(s => s.category === options.category);
    }
    
    if (options.tag) {
      sources = sources.filter(s => s.tags && s.tags.includes(options.tag));
    }
    
    if (options.search) {
      const searchLower = options.search.toLowerCase();
      sources = sources.filter(s => 
        s.name.toLowerCase().includes(searchLower) ||
        s.id.toLowerCase().includes(searchLower)
      );
    }
    
    return sources;
  }

  deleteKnowledgeSource(id) {
    const index = this.index.knowledgeSources.findIndex(s => s.id === id);
    if (index < 0) return false;
    
    const sourceMeta = this.index.knowledgeSources[index];
    const filepath = path.join(this.knowledgeDir, 'sources', sourceMeta.filename);
    
    if (fs.existsSync(filepath)) {
      fs.unlinkSync(filepath);
    }
    
    this.index.knowledgeSources.splice(index, 1);
    this.saveIndex();
    
    console.log(`🗑️ 已删除知识源: ${sourceMeta.name}`);
    return true;
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

  search(query) {
    const sources = this.listKnowledgeSources({ search: query });
    const results = [];
    
    for (const source of sources) {
      const fullSource = this.getKnowledgeSource(source.id);
      if (fullSource) {
        results.push(fullSource);
      }
    }
    
    return results;
  }
}

module.exports = KnowledgeManager;
