const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');

class CaseIndexer {
  constructor(caseKnowledgeBase) {
    this.caseKnowledgeBase = caseKnowledgeBase;
    this.storageDir = caseKnowledgeBase.storageDir;
  }

  async indexAllExcelFiles() {
    console.log('🔍 开始扫描客诉知识库Excel文件...');
    
    const excelFiles = this.findExcelFiles(this.storageDir);
    console.log(`📁 找到 ${excelFiles.length} 个Excel文件`);
    
    for (const file of excelFiles) {
      await this.indexExcelFile(file);
    }
    
    console.log('✅ 客诉知识源索引生成完成');
  }

  findExcelFiles(dir) {
    const files = [];
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        files.push(...this.findExcelFiles(fullPath));
      } else if (entry.isFile() && (entry.name.endsWith('.xlsx') || entry.name.endsWith('.xls'))) {
        files.push(fullPath);
      }
    }
    
    return files;
  }

  async indexExcelFile(filePath) {
    console.log(`📄 正在处理: ${path.basename(filePath)}`);
    
    try {
      const workbook = XLSX.readFile(filePath);
      
      for (const sheetName of workbook.SheetNames) {
        const worksheet = workbook.Sheets[sheetName];
        const data = XLSX.utils.sheet_to_json(worksheet);
        
        console.log(`   工作表 "${sheetName}": ${data.length} 行数据`);
        
        for (const row of data) {
          const caseData = this.parseCaseFromRow(row, sheetName, filePath);
          if (caseData) {
            this.caseKnowledgeBase.addCase(caseData);
          }
        }
      }
    } catch (error) {
      console.error(`❌ 处理文件失败 ${filePath}:`, error.message);
    }
  }

  parseCaseFromRow(row, sheetName, filePath) {
    const title = row['标题'] || row['问题标题'] || row['问题'] || `客诉案例-${Date.now()}`;
    
    if (!title || title === '标题' || title === '问题标题') {
      return null;
    }
    
    const caseData = {
      title: String(title),
      category: row['分类'] || row['类别'] || sheetName || '未分类',
      tags: this.parseTags(row),
      priority: row['优先级'] || 'medium',
      status: row['状态'] || 'active',
      problemDescription: row['问题描述'] || row['描述'] || '',
      rootCause: row['根本原因'] || row['原因'] || '',
      businessLogic: row['业务逻辑'] || row['关联业务'] || '',
      reproductionSteps: this.parseSteps(row['复现步骤'] || row['步骤']),
      solution: this.parseSolution(row),
      prevention: row['预防措施'] || row['预防'] || '',
      codeLocation: this.parseCodeLocation(row),
      relatedBusiness: this.parseRelatedBusiness(row),
      relatedKnowledge: this.parseRelatedKnowledge(row),
      notes: this.parseNotes(row),
      sourceFile: path.basename(filePath),
      sourceSheet: sheetName
    };
    
    return caseData;
  }

  parseTags(row) {
    const tagStr = row['标签'] || row['关键字'] || '';
    if (!tagStr) return [];
    
    if (Array.isArray(tagStr)) {
      return tagStr;
    }
    
    return String(tagStr).split(/[,，;；\s]+/).filter(t => t.trim().length > 0);
  }

  parseSteps(stepsStr) {
    if (!stepsStr) return [];
    
    if (Array.isArray(stepsStr)) {
      return stepsStr;
    }
    
    const steps = String(stepsStr).split(/\n|\d+\.\s*/).filter(s => s.trim().length > 0);
    return steps;
  }

  parseSolution(row) {
    const solutionStr = row['解决方案'] || row['解决方法'] || '';
    if (!solutionStr) return [];
    
    return [
      {
        title: '解决方案',
        description: String(solutionStr),
        codeReference: row['代码参考'] || ''
      }
    ];
  }

  parseCodeLocation(row) {
    const filePath = row['文件路径'] || row['代码位置'] || '';
    if (!filePath) return null;
    
    return {
      filePath: String(filePath),
      lineNumber: row['行号'] ? Number(row['行号']) : null,
      gitUrl: row['Git链接'] || ''
    };
  }

  parseRelatedBusiness(row) {
    const businessStr = row['关联业务'] || row['业务场景'] || '';
    if (!businessStr) return [];
    
    if (Array.isArray(businessStr)) {
      return businessStr;
    }
    
    return String(businessStr).split(/[,，;；\s]+/).filter(b => b.trim().length > 0);
  }

  parseRelatedKnowledge(row) {
    const knowledgeStr = row['关联知识'] || row['知识源'] || '';
    if (!knowledgeStr) return [];
    
    if (Array.isArray(knowledgeStr)) {
      return knowledgeStr;
    }
    
    return String(knowledgeStr).split(/[,，;；\s]+/).filter(k => k.trim().length > 0);
  }

  parseNotes(row) {
    const notesStr = row['备注'] || row['说明'] || '';
    if (!notesStr) return [];
    
    if (Array.isArray(notesStr)) {
      return notesStr;
    }
    
    return String(notesStr).split(/\n/).filter(n => n.trim().length > 0);
  }
}

module.exports = CaseIndexer;
