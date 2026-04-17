const path = require('path');
const GitLabClient = require('./gitlab/client');
const CodeAnalyzer = require('./analyzer');
const KnowledgeBase = require('./knowledge-base');
const QASystem = require('./qa');
const KnowledgeManager = require('./knowledge-management');
const CaseHandler = require('../case-handler');

class KnowledgeGenerator {
  constructor(config) {
    this.config = config;
    this.sourceDir = path.join(process.cwd(), 'temp/source-code');
    this.kbDir = path.join(process.cwd(), 'data/knowledge-base');
    this.knowledgeSourcesDir = path.join(process.cwd(), 'data/knowledge-sources');
    this.gitlabClient = new GitLabClient(config);
    this.knowledgeBase = new KnowledgeBase(this.kbDir);
    this.qaSystem = new QASystem(this.knowledgeBase);
    this.knowledgeManager = new KnowledgeManager(this.knowledgeSourcesDir);
    this.caseHandler = new CaseHandler(this.knowledgeBase);
  }

  async generateFromGitLab() {
    console.log('🚀 开始从 GitLab 生成知识库...\n');
    
    try {
      await this.gitlabClient.fetchAllFiles(this.sourceDir);
      await this.analyzeAndGenerate(this.sourceDir);
      
      // 生成完成后删除代码库
      console.log('\n🧹 清理临时代码库...');
      this.cleanupSourceCode();
      
    } catch (error) {
      console.error('❌ 生成知识库失败:', error.message);
      throw error;
    }
  }

  cleanupSourceCode() {
    const fs = require('fs');
    const path = require('path');
    
    try {
      if (fs.existsSync(this.sourceDir)) {
        this.rmdirSyncRecursive(this.sourceDir);
        console.log(`✅ 已删除代码库: ${this.sourceDir}`);
      }
    } catch (error) {
      console.warn('⚠️  清理代码库失败:', error.message);
    }
  }

  rmdirSyncRecursive(dir) {
    const fs = require('fs');
    const path = require('path');
    
    if (fs.existsSync(dir)) {
      const files = fs.readdirSync(dir);
      files.forEach(file => {
        const fullPath = path.join(dir, file);
        if (fs.lstatSync(fullPath).isDirectory()) {
          this.rmdirSyncRecursive(fullPath);
        } else {
          fs.unlinkSync(fullPath);
        }
      });
      fs.rmdirSync(dir);
    }
  }

  async generateFromLocal(localPath) {
    console.log('🚀 开始从本地代码生成知识库...\n');
    
    try {
      await this.analyzeAndGenerate(localPath);
      
    } catch (error) {
      console.error('❌ 生成知识库失败:', error.message);
      throw error;
    }
  }

  async analyzeAndGenerate(sourcePath) {
    const analyzer = new CodeAnalyzer(sourcePath);
    const analysis = analyzer.analyze();
    
    this.knowledgeBase.updateFromAnalysis(analysis);
    
    console.log('\n📄 开始生成每个业务场景的知识源文件...');
    let generatedCount = 0;
    
    for (const scenario of analysis.businessScenarios) {
      try {
        this.knowledgeManager.addKnowledgeSource(scenario);
        generatedCount++;
      } catch (error) {
        console.warn(`⚠️  生成知识源失败 ${scenario.name}:`, error.message);
      }
    }
    
    console.log('\n✅ 知识库生成完成!');
    console.log(`   - 业务场景: ${analysis.businessScenarios.length} 个`);
    console.log(`   - 生成知识源文件: ${generatedCount} 个`);
    console.log(`   - API 接口: ${analysis.apis.length} 个`);
    console.log(`   - 类: ${analysis.classes.length} 个`);
    console.log(`   - 函数: ${analysis.functions.length} 个`);
    console.log(`   - 知识源目录: ${this.knowledgeSourcesDir}`);
  }

  askQuestion(question) {
    const result = this.qaSystem.ask(question);
    this.qaSystem.displayAnswer(result);
    return result;
  }

  listScenarios() {
    const scenarios = this.knowledgeBase.getAllScenarios();
    console.log('\n📋 所有业务场景:');
    console.log('─'.repeat(50));
    if (scenarios.length === 0) {
      console.log('   暂无业务场景，请先生成知识库');
    } else {
      scenarios.forEach((s, i) => {
        console.log(`   ${i + 1}. ${s.name} (${s.filePath})`);
      });
    }
    console.log();
    return scenarios;
  }

  listKnowledgeSources(options = {}) {
    const sources = this.knowledgeManager.listKnowledgeSources(options);
    const stats = this.knowledgeManager.getStatistics();
    
    console.log('\n📚 知识源管理:');
    console.log('─'.repeat(50));
    console.log(`   总计: ${stats.totalCount} 个知识源`);
    
    if (Object.keys(stats.categories).length > 0) {
      console.log(`   分类: ${Object.entries(stats.categories).map(([k, v]) => `${k}(${v})`).join(', ')}`);
    }
    
    console.log('\n📄 知识源列表:');
    if (sources.length === 0) {
      console.log('   暂无知识源，请先生成知识库');
    } else {
      sources.forEach((s, i) => {
        console.log(`   ${i + 1}. [${s.category}] ${s.name}`);
        console.log(`       ID: ${s.id}`);
        console.log(`       文件: ${s.filePath}`);
        if (s.tags && s.tags.length > 0) {
          console.log(`       标签: ${s.tags.join(', ')}`);
        }
      });
    }
    console.log();
    return sources;
  }

  getKnowledgeSource(id) {
    const source = this.knowledgeManager.getKnowledgeSource(id);
    if (source) {
      console.log('\n' + '─'.repeat(60));
      console.log(source.content);
      console.log('─'.repeat(60) + '\n');
    } else {
      console.log(`❌ 未找到知识源: ${id}`);
    }
    return source;
  }

  deleteKnowledgeSource(id) {
    return this.knowledgeManager.deleteKnowledgeSource(id);
  }

  searchKnowledgeSources(query) {
    const results = this.knowledgeManager.search(query);
    console.log(`\n🔍 搜索 "${query}" 找到 ${results.length} 个知识源:\n`);
    results.forEach((r, i) => {
      console.log(`   ${i + 1}. ${r.meta.name} (${r.meta.category})`);
    });
    console.log();
    return results;
  }

  exportMarkdown(outputPath) {
    this.knowledgeBase.exportMarkdown(outputPath);
  }

  getStatistics() {
    const stats = this.knowledgeManager.getStatistics();
    console.log('\n📊 知识库统计:');
    console.log('─'.repeat(50));
    console.log(`   知识源总数: ${stats.totalCount}`);
    console.log(`   分类统计:`, stats.categories);
    console.log(`   标签统计:`, stats.tags);
    console.log();
    return stats;
  }

  askCaseQuestion(question) {
    return this.caseHandler.askCaseQuestion(question);
  }

  uploadCase(filePath) {
    return this.caseHandler.uploadCase(filePath);
  }

  batchUploadCases(directoryPath) {
    return this.caseHandler.batchUploadCases(directoryPath);
  }

  listCases(options = {}) {
    return this.caseHandler.listCases(options);
  }

  getCase(id) {
    return this.caseHandler.getCase(id);
  }

  deleteCase(id) {
    return this.caseHandler.deleteCase(id);
  }

  searchCases(query) {
    return this.caseHandler.searchCases(query);
  }

  getCaseStatistics() {
    return this.caseHandler.getCaseStatistics();
  }
}

module.exports = KnowledgeGenerator;
