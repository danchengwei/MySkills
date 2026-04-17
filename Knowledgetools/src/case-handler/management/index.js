const fs = require('fs');
const path = require('path');

class CaseManagement {
  constructor(caseKnowledgeBase, knowledgeBase) {
    this.caseKnowledgeBase = caseKnowledgeBase;
    this.knowledgeBase = knowledgeBase;
  }

  uploadCaseFromFile(filePath) {
    console.log(`📤 正在从文件上传课诉案例: ${filePath}`);
    
    if (!fs.existsSync(filePath)) {
      throw new Error(`文件不存在: ${filePath}`);
    }
    
    const ext = path.extname(filePath).toLowerCase();
    
    if (ext === '.json') {
      return this.uploadFromJson(filePath);
    } else if (ext === '.md') {
      return this.uploadFromMarkdown(filePath);
    } else {
      throw new Error('不支持的文件格式，请使用 .json 或 .md 文件');
    }
  }

  uploadFromJson(filePath) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const caseData = JSON.parse(content);
    
    this.validateCaseData(caseData);
    this.enrichCaseData(caseData);
    
    return this.caseKnowledgeBase.addCase(caseData);
  }

  uploadFromMarkdown(filePath) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const caseData = this.parseMarkdownToCaseData(content);
    
    caseData.title = caseData.title || path.basename(filePath, '.md');
    
    this.validateCaseData(caseData);
    this.enrichCaseData(caseData);
    
    return this.caseKnowledgeBase.addCase(caseData);
  }

  parseMarkdownToCaseData(content) {
    const caseData = {};
    
    const titleMatch = content.match(/^#\s+(.+)$/m);
    if (titleMatch) {
      caseData.title = titleMatch[1].trim();
    }
    
    const problemMatch = content.match(/##\s+📋\s*问题描述\s*\n([\s\S]*?)(?=\n##|$)/);
    if (problemMatch) {
      caseData.problemDescription = problemMatch[1].trim();
    }
    
    const rootCauseMatch = content.match(/##\s+🔍\s*根本原因\s*\n([\s\S]*?)(?=\n##|$)/);
    if (rootCauseMatch) {
      caseData.rootCause = rootCauseMatch[1].trim();
    }
    
    const businessLogicMatch = content.match(/##\s+💼\s*关联业务逻辑\s*\n([\s\S]*?)(?=\n##|$)/);
    if (businessLogicMatch) {
      caseData.businessLogic = businessLogicMatch[1].trim();
    }
    
    const solutionMatch = content.match(/##\s+✅\s*解决方案\s*\n([\s\S]*?)(?=\n##|$)/);
    if (solutionMatch) {
      caseData.solution = this.parseSolutionSteps(solutionMatch[1]);
    }
    
    const preventionMatch = content.match(/##\s+🛡️\s*预防措施\s*\n([\s\S]*?)(?=\n##|$)/);
    if (preventionMatch) {
      caseData.prevention = preventionMatch[1].trim();
    }
    
    return caseData;
  }

  parseSolutionSteps(content) {
    const steps = [];
    const stepMatches = content.match(/###\s+\d+\.\s+(.+)\s*\n([\s\S]*?)(?=###\s+\d+\.|$)/g);
    
    if (stepMatches) {
      stepMatches.forEach(stepContent => {
        const titleMatch = stepContent.match(/###\s+\d+\.\s+(.+)/);
        const title = titleMatch ? titleMatch[1].trim() : '';
        
        const codeMatch = stepContent.match(/```([\s\S]*?)```/);
        const codeReference = codeMatch ? codeMatch[1].trim() : '';
        
        const description = stepContent
          .replace(/###\s+\d+\.\s+.+\s*\n?/, '')
          .replace(/```[\s\S]*?```/g, '')
          .trim();
        
        steps.push({
          title,
          description,
          codeReference
        });
      });
    }
    
    return steps;
  }

  validateCaseData(caseData) {
    if (!caseData.title) {
      throw new Error('课诉案例必须有标题');
    }
    if (!caseData.problemDescription) {
      console.warn('⚠️  建议添加问题描述');
    }
  }

  enrichCaseData(caseData) {
    if (!caseData.relatedBusiness) {
      caseData.relatedBusiness = [];
    }
    
    if (!caseData.relatedKnowledge) {
      caseData.relatedKnowledge = [];
    }
    
    const searchText = `${caseData.title} ${caseData.problemDescription || ''} ${caseData.rootCause || ''}`;
    const relatedScenarios = this.knowledgeBase.searchBusinessScenario(searchText);
    
    for (const scenario of relatedScenarios) {
      if (!caseData.relatedBusiness.includes(scenario.name)) {
        caseData.relatedBusiness.push(scenario.name);
      }
      if (!caseData.relatedKnowledge.includes(scenario.id)) {
        caseData.relatedKnowledge.push(scenario.id);
      }
    }
    
    if (caseData.title) {
      this.extractTagsFromTitle(caseData);
    }
  }

  extractTagsFromTitle(caseData) {
    if (!caseData.tags) {
      caseData.tags = [];
    }
    
    const tagKeywords = [
      { keyword: '游戏化', tag: '游戏化' },
      { keyword: '宠物', tag: '宠物' },
      { keyword: '装扮', tag: '装扮' },
      { keyword: '支付', tag: '支付' },
      { keyword: '登录', tag: '登录' },
      { keyword: '注册', tag: '注册' },
      { keyword: '闪退', tag: '闪退' },
      { keyword: '卡顿', tag: '性能' },
      { keyword: '慢', tag: '性能' },
      { keyword: '不显示', tag: 'UI' },
      { keyword: '不见了', tag: '数据' }
    ];
    
    const titleLower = caseData.title.toLowerCase();
    
    for (const { keyword, tag } of tagKeywords) {
      if (titleLower.includes(keyword.toLowerCase()) && !caseData.tags.includes(tag)) {
        caseData.tags.push(tag);
      }
    }
  }

  createCaseInteractive(answers) {
    const caseData = {
      title: answers.title,
      category: answers.category || '未分类',
      priority: answers.priority || 'medium',
      status: answers.status || 'active',
      tags: answers.tags || [],
      problemDescription: answers.problemDescription,
      reproductionSteps: answers.reproductionSteps || [],
      rootCause: answers.rootCause,
      businessLogic: answers.businessLogic,
      solution: answers.solution || [],
      relatedBusiness: answers.relatedBusiness || [],
      relatedKnowledge: answers.relatedKnowledge || [],
      codeLocation: answers.codeLocation,
      prevention: answers.prevention,
      notes: answers.notes || []
    };
    
    this.enrichCaseData(caseData);
    return this.caseKnowledgeBase.addCase(caseData);
  }

  batchUploadFromDirectory(directoryPath) {
    console.log(`📤 批量上传目录: ${directoryPath}`);
    
    if (!fs.existsSync(directoryPath)) {
      throw new Error(`目录不存在: ${directoryPath}`);
    }
    
    const files = fs.readdirSync(directoryPath);
    let uploadedCount = 0;
    let failedCount = 0;
    
    for (const file of files) {
      const filePath = path.join(directoryPath, file);
      const ext = path.extname(file).toLowerCase();
      
      if (ext === '.json' || ext === '.md') {
        try {
          this.uploadCaseFromFile(filePath);
          uploadedCount++;
        } catch (error) {
          console.error(`❌ 上传失败 ${file}:`, error.message);
          failedCount++;
        }
      }
    }
    
    console.log(`\n✅ 批量上传完成: 成功 ${uploadedCount} 个, 失败 ${failedCount} 个`);
    return { uploadedCount, failedCount };
  }
}

module.exports = CaseManagement;
