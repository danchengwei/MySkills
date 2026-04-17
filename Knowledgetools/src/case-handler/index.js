const path = require('path');
const CaseKnowledgeBase = require('./knowledge');
const CaseQASystem = require('./qa');
const CaseManagement = require('./management');

class CaseHandler {
  constructor(knowledgeBase) {
    this.caseStorageDir = path.join(process.cwd(), 'data/case-knowledge');
    this.caseKnowledgeBase = new CaseKnowledgeBase(this.caseStorageDir);
    this.caseQASystem = new CaseQASystem(this.caseKnowledgeBase, knowledgeBase);
    this.caseManagement = new CaseManagement(this.caseKnowledgeBase, knowledgeBase);
  }

  askCaseQuestion(question) {
    const result = this.caseQASystem.ask(question);
    this.caseQASystem.displayAnswer(result);
    return result;
  }

  uploadCase(filePath) {
    return this.caseManagement.uploadCaseFromFile(filePath);
  }

  batchUploadCases(directoryPath) {
    return this.caseManagement.batchUploadFromDirectory(directoryPath);
  }

  listCases(options = {}) {
    const cases = this.caseKnowledgeBase.listCases(options);
    const stats = this.caseKnowledgeBase.getStatistics();
    
    console.log('\n🏥 课诉案例管理:');
    console.log('─'.repeat(50));
    console.log(`   总计: ${stats.totalCount} 个案例`);
    
    if (Object.keys(stats.categories).length > 0) {
      console.log(`   分类: ${Object.entries(stats.categories).map(([k, v]) => `${k}(${v})`).join(', ')}`);
    }
    if (Object.keys(stats.statuses).length > 0) {
      console.log(`   状态: ${Object.entries(stats.statuses).map(([k, v]) => `${k}(${v})`).join(', ')}`);
    }
    
    console.log('\n📄 案例列表:');
    if (cases.length === 0) {
      console.log('   暂无课诉案例');
    } else {
      cases.forEach((c, i) => {
        console.log(`   ${i + 1}. [${c.category}] [${c.status}] ${c.title}`);
        console.log(`       ID: ${c.id}`);
        if (c.tags && c.tags.length > 0) {
          console.log(`       标签: ${c.tags.join(', ')}`);
        }
      });
    }
    console.log();
    return cases;
  }

  getCase(id) {
    const caseData = this.caseKnowledgeBase.getCase(id);
    if (caseData) {
      console.log('\n' + '─'.repeat(60));
      console.log(caseData.content);
      console.log('─'.repeat(60) + '\n');
    } else {
      console.log(`❌ 未找到课诉案例: ${id}`);
    }
    return caseData;
  }

  deleteCase(id) {
    return this.caseKnowledgeBase.deleteCase(id);
  }

  searchCases(query) {
    const results = this.caseKnowledgeBase.search(query);
    console.log(`\n🔍 搜索 "${query}" 找到 ${results.length} 个课诉案例:\n`);
    results.forEach((r, i) => {
      console.log(`   ${i + 1}. ${r.meta.title} (${r.meta.category})`);
    });
    console.log();
    return results;
  }

  getCaseStatistics() {
    const stats = this.caseKnowledgeBase.getStatistics();
    console.log('\n📊 课诉知识库统计:');
    console.log('─'.repeat(50));
    console.log(`   案例总数: ${stats.totalCount}`);
    console.log(`   分类统计:`, stats.categories);
    console.log(`   标签统计:`, stats.tags);
    console.log(`   状态统计:`, stats.statuses);
    console.log();
    return stats;
  }
}

module.exports = CaseHandler;
