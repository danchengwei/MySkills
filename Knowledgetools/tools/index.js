const path = require('path');
const fs = require('fs');

const GitLabClient = require('../src/knowledge-generator/gitlab/client');
const CodeAnalyzer = require('../src/knowledge-generator/analyzer');
const KnowledgeBase = require('../src/knowledge-generator/knowledge-base');
const KnowledgeManager = require('../src/knowledge-generator/knowledge-management');
const CaseKnowledgeBase = require('../src/case-handler/knowledge');
const CaseManagement = require('../src/case-handler/management');
const CaseQASystem = require('../src/case-handler/qa');
const { ConfigManager, configTemplates } = require('../src/config-manager');
const ProgressManager = require('../src/progress-manager');
const KnowledgeSearch = require('../src/knowledge-search');
const KeywordManager = require('../src/keyword-manager');
const DevelopmentReview = require('../src/dev-tools/development-review');
const CaseIndexer = require('../src/case-handler/case-indexer');

class KnowledgeTools {
  constructor() {
    this.projectRoot = path.dirname(__dirname);
    this.dataDir = path.join(this.projectRoot, 'data');
    this.configDir = path.join(this.projectRoot, 'configs');
    this.progressDir = path.join(this.projectRoot, 'data', 'progress');
    this.ensureDirectories();
    
    this.configManager = new ConfigManager(this.configDir);
    this.progressManager = new ProgressManager(this.progressDir);
    this.initializeConfigTemplates();
    
    // 本地项目路径配置
    this.localProjectPath = this.configManager.getConfigValue('development', 'localProjectPath') || '/Users/tal/workSpace/wangxiaoyouke/xw-youke';
    
    this.knowledgeBase = new KnowledgeBase(this.getPath('knowledge-base'));
    this.knowledgeManager = new KnowledgeManager(this.getPath('knowledge-sources'));
    this.caseKnowledgeBase = new CaseKnowledgeBase(this.getPath('case-knowledge'));
    this.caseManagement = new CaseManagement(this.caseKnowledgeBase, this.knowledgeBase);
    this.caseQASystem = new CaseQASystem(this.caseKnowledgeBase, this.knowledgeBase);
    
    // 初始化知识源查询
    this.knowledgeSearch = new KnowledgeSearch(
      path.join(this.getPath('knowledge-sources'), 'enhanced-index.json'),
      path.join(this.getPath('knowledge-sources'), 'sources')
    );
    
    // 初始化关键词管理
    this.keywordManager = new KeywordManager(this.dataDir);
    
    // 初始化开发审查
    this.developmentReview = new DevelopmentReview();
    
    // 初始化客诉知识源索引器
    this.caseIndexer = new CaseIndexer(this.caseKnowledgeBase);
  }

  ensureDirectories() {
    const dirs = [
      'data/knowledge-base',
      'data/knowledge-sources',
      'data/case-knowledge',
      'data/source-code',
      'data/progress',
      'import/knowledge-sources',
      'import/case-knowledge',
      'configs'
    ];
    
    for (const dir of dirs) {
      const fullPath = path.join(this.projectRoot, dir);
      if (!fs.existsSync(fullPath)) {
        fs.mkdirSync(fullPath, { recursive: true });
      }
    }
  }

  initializeConfigTemplates() {
    for (const [name, template] of Object.entries(configTemplates)) {
      if (!this.configManager.configExists(name)) {
        this.configManager.createConfigTemplate(name, template);
        console.log(`📋 已创建配置模板: ${name}`);
      }
    }
  }

  getPath(relativePath) {
    return path.join(this.projectRoot, 'data', relativePath);
  }



  async generateKnowledgeFromLocal(localPath) {
    if (!fs.existsSync(localPath)) {
      throw new Error(`目录不存在: ${localPath}`);
    }
    
    return this.analyzeAndGenerateKnowledge(localPath);
  }

  async analyzeAndGenerateKnowledge(sourcePath, projectId = 'unknown') {
    console.log(`📊 正在分析代码 (项目 ${projectId})...`);
    
    const analyzer = new CodeAnalyzer(sourcePath);
    const analysis = analyzer.analyze();
    
    this.knowledgeBase.updateFromAnalysis(analysis);
    
    let generatedCount = 0;
    for (const scenario of analysis.businessScenarios) {
      try {
        scenario.projectId = projectId;
        this.knowledgeManager.addKnowledgeSource(scenario);
        generatedCount++;
      } catch (error) {
        console.warn(`生成知识源失败 ${scenario.name}:`, error.message);
      }
    }
    
    const result = {
      success: true,
      projectId,
      businessScenarios: analysis.businessScenarios.length,
      knowledgeSources: generatedCount,
      apis: analysis.apis.length,
      classes: analysis.classes.length,
      functions: analysis.functions.length
    };
    
    console.log(`✅ 项目 ${projectId} 分析完成:`);
    console.log(`   - 业务场景: ${result.businessScenarios} 个`);
    console.log(`   - 知识源: ${result.knowledgeSources} 个`);
    console.log(`   - API 接口: ${result.apis} 个`);
    console.log(`   - 类: ${result.classes} 个`);
    console.log(`   - 函数: ${result.functions} 个`);
    
    return result;
  }

  askBusinessQuestion(question) {
    const keywords = this.extractKeywords(question);
    const results = [];
    
    for (const keyword of keywords) {
      const scenarios = this.knowledgeBase.searchBusinessScenario(keyword);
      results.push(...scenarios);
    }
    
    const uniqueResults = this.deduplicate(results);
    
    if (uniqueResults.length === 0) {
      return {
        success: false,
        message: '未找到相关的业务场景信息',
        suggestions: this.knowledgeBase.getAllScenarios().slice(0, 5).map(s => s.name)
      };
    }
    
    return {
      success: true,
      results: uniqueResults.map(r => this.formatBusinessAnswer(r))
    };
  }

  askCaseQuestion(question) {
    const result = this.caseQASystem.ask(question);
    return result;
  }

  importKnowledgeSources() {
    const importDir = this.config.knowledgeSourcesDir;
    if (!fs.existsSync(importDir)) {
      return { success: false, message: '导入目录不存在' };
    }
    
    let imported = 0;
    const files = fs.readdirSync(importDir);
    
    for (const file of files) {
      const filePath = path.join(importDir, file);
      if (file.endsWith('.md') || file.endsWith('.json')) {
        try {
          const content = fs.readFileSync(filePath, 'utf-8');
          console.log(`导入知识源: ${file}`);
          imported++;
        } catch (error) {
          console.warn(`导入失败 ${file}:`, error.message);
        }
      }
    }
    
    return { success: true, imported };
  }

  importCaseKnowledge() {
    const importDir = this.config.caseKnowledgeDir;
    if (!fs.existsSync(importDir)) {
      return { success: false, message: '导入目录不存在' };
    }
    
    let imported = 0;
    const files = fs.readdirSync(importDir);
    
    for (const file of files) {
      const filePath = path.join(importDir, file);
      try {
        if (file.endsWith('.json')) {
          this.caseManagement.uploadFromJson(filePath);
          imported++;
        } else if (file.endsWith('.md')) {
          this.caseManagement.uploadFromMarkdown(filePath);
          imported++;
        }
      } catch (error) {
        console.warn(`导入失败 ${file}:`, error.message);
      }
    }
    
    return { success: true, imported };
  }

  listKnowledgeSources(options = {}) {
    return this.knowledgeManager.listKnowledgeSources(options);
  }

  getKnowledgeSource(id) {
    return this.knowledgeManager.getKnowledgeSource(id);
  }

  listCases(options = {}) {
    return this.caseKnowledgeBase.listCases(options);
  }

  getCase(id) {
    return this.caseKnowledgeBase.getCase(id);
  }

  getStatistics() {
    return {
      knowledge: this.knowledgeManager.getStatistics(),
      cases: this.caseKnowledgeBase.getStatistics()
    };
  }

  searchKnowledgeSources(query, limit = 5, useKeywordExpansion = true) {
    let searchQuery = query;
    
    if (useKeywordExpansion) {
      searchQuery = this.keywordManager.searchKnowledgeQuery(query);
      if (searchQuery !== query) {
        console.log(`🔄 关键词扩展: "${query}" → "${searchQuery}"`);
      }
    }
    
    console.log(`🔍 搜索知识源: "${searchQuery}"`);
    const results = this.knowledgeSearch.searchAndSummarize(searchQuery, limit);
    
    if (results.length === 0) {
      return {
        success: false,
        message: '未找到相关知识源',
        originalQuery: query,
        searchQuery
      };
    }
    
    console.log(`✅ 找到 ${results.length} 个相关知识源:`);
    results.forEach((result, index) => {
      console.log(`   ${index + 1}. ${result.name}`);
      console.log(`      相关性: ${result.relevance}`);
      console.log(`      摘要: ${result.summary}`);
      console.log(`      文件: ${result.filename}`);
      console.log('   ────────────────────────────────');
    });
    
    return {
      success: true,
      originalQuery: query,
      searchQuery,
      results: results.map(r => ({
        id: r.id,
        name: r.name,
        filename: r.filename,
        relevance: r.relevance,
        summary: r.summary
      }))
    };
  }

  addKeywordSynonym(mainTerm, synonym) {
    return this.keywordManager.addSynonym(mainTerm, synonym);
  }

  addKeywordSynonyms(mainTerm, synonyms) {
    return this.keywordManager.addSynonyms(mainTerm, synonyms);
  }

  findKeywordMatches(term) {
    const matches = this.keywordManager.findMatches(term);
    
    if (matches.length === 0) {
      console.log(`🔍 未找到关键词匹配: "${term}"`);
      return { success: false, term, matches: [] };
    }
    
    console.log(`✅ 找到 ${matches.length} 个关键词匹配:`);
    matches.forEach((match, index) => {
      console.log(`   ${index + 1}. ${match.mainTerm}`);
      console.log(`      匹配类型: ${match.matchType}`);
      console.log(`      同义词: ${match.synonyms.join(', ')}`);
      if (match.description) {
        console.log(`      描述: ${match.description}`);
      }
      console.log('   ────────────────────────────────');
    });
    
    return { success: true, term, matches };
  }

  listAllKeywords() {
    const keywords = this.keywordManager.listKeywords();
    
    if (keywords.length === 0) {
      console.log('📋 关键词库为空');
      return { success: true, keywords: [] };
    }
    
    console.log(`📋 关键词库 (${keywords.length} 个):`);
    keywords.forEach((keyword, index) => {
      console.log(`   ${index + 1}. ${keyword.term}`);
      if (keyword.synonyms.length > 0) {
        console.log(`      同义词: ${keyword.synonyms.join(', ')}`);
      }
      if (keyword.description) {
        console.log(`      描述: ${keyword.description}`);
      }
      console.log('   ────────────────────────────────');
    });
    
    return { success: true, keywords };
  }

  updateKeywordDescription(term, description) {
    return this.keywordManager.updateDescription(term, description);
  }

  deleteKeyword(term) {
    return this.keywordManager.deleteKeyword(term);
  }

  startDevelopmentReview() {
    console.log('🚀 开始Android开发审查...\n');
    return this.developmentReview.printDeveloperPrompt();
  }

  reviewDevelopmentChanges(changedFiles, description, originalFiles = {}) {
    console.log('🔍 开始审查开发变更...\n');
    
    const reviewReport = this.developmentReview.reviewChanges(changedFiles, description, originalFiles);
    const reportText = this.developmentReview.generateReviewReport(reviewReport);
    
    console.log('\n' + '='.repeat(80) + '\n');
    console.log(reportText);
    console.log('\n' + '='.repeat(80) + '\n');
    
    return {
      report: reviewReport,
      reportText
    };
  }

  getAndroidDevelopmentGuidelines() {
    return this.developmentReview.getAndroidDevelopmentGuidelines();
  }

  getDevelopmentChecklist() {
    return this.developmentReview.getSelfChecklist();
  }

  getLocalProjectPath() {
    return this.localProjectPath;
  }

  setLocalProjectPath(path) {
    this.localProjectPath = path;
    this.configManager.setConfigValue('development', 'localProjectPath', path);
    console.log(`✅ 本地项目路径已设置为: ${path}`);
    return true;
  }

  reviewLocalProject() {
    const projectPath = this.localProjectPath;
    console.log(`🔍 开始审查本地项目: ${projectPath}`);
    
    if (!fs.existsSync(projectPath)) {
      console.error(`❌ 项目路径不存在: ${projectPath}`);
      return { success: false, message: '项目路径不存在' };
    }
    
    const changedFiles = [];
    const javaFiles = this.findJavaFiles(projectPath);
    
    for (const javaFile of javaFiles) {
      try {
        const content = fs.readFileSync(javaFile, 'utf8');
        changedFiles.push({
          path: javaFile,
          content: content
        });
      } catch (error) {
        console.warn(`无法读取文件 ${javaFile}:`, error.message);
      }
    }
    
    if (changedFiles.length === 0) {
      console.log('ℹ️ 未找到Java文件');
      return { success: false, message: '未找到Java文件' };
    }
    
    console.log(`📁 找到 ${changedFiles.length} 个Java文件`);
    return this.reviewDevelopmentChanges(changedFiles, `本地项目审查: ${projectPath}`);
  }

  findJavaFiles(dir) {
    const files = [];
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        files.push(...this.findJavaFiles(fullPath));
      } else if (entry.isFile() && (entry.name.endsWith('.java') || entry.name.endsWith('.kt'))) {
        files.push(fullPath);
      }
    }
    
    return files;
  }

  async indexCaseKnowledge() {
    console.log('🚀 开始生成客诉知识源索引...\n');
    await this.caseIndexer.indexAllExcelFiles();
    
    const stats = this.caseKnowledgeBase.getStatistics();
    console.log('\n📊 客诉知识源统计:');
    console.log(`   总案例数: ${stats.totalCount}`);
    console.log(`   分类数: ${Object.keys(stats.categories || {}).length}`);
    console.log(`   标签数: ${Object.keys(stats.tags || {}).length}`);
    
    return stats;
  }

  extractKeywords(question) {
    const stopWords = ['的', '是', '什么', '怎么', '如何', '哪里', '哪个', '吗', '呢', '啊',
                      '业务', '场景', '功能', '模块', '接口', '代码', '路径', '位置'];
    
    let processed = question.toLowerCase();
    for (const word of stopWords) {
      processed = processed.replace(new RegExp(word, 'g'), ' ');
    }
    
    const keywords = processed.split(/\s+/).filter(w => w.length > 0);
    return keywords.length > 0 ? keywords : [question];
  }

  deduplicate(items) {
    const seen = new Set();
    return items.filter(item => {
      const key = item.id || item.name;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  formatBusinessAnswer(scenario) {
    let answer = `\n📌 **${scenario.name}**\n`;
    answer += '─'.repeat(50) + '\n\n';
    
    if (scenario.description) {
      answer += `📝 **业务逻辑**: ${scenario.description}\n\n`;
    }
    
    answer += `📍 **代码位置**:\n`;
    answer += `   - 文件路径: ${scenario.filePath}\n`;
    if (scenario.lineNumber) {
      answer += `   - 行号: 第 ${scenario.lineNumber} 行\n`;
    }
    answer += '\n';
    
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
    
    return answer;
  }

  getDirectoriesInfo() {
    const knowledgeConfig = this.configManager.getKnowledgeConfig();
    return {
      projectRoot: this.projectRoot,
      dataDir: this.dataDir,
      configDir: this.configDir,
      knowledgeSourcesImport: path.join(this.projectRoot, 'import/knowledge-sources'),
      caseKnowledgeImport: path.join(this.projectRoot, 'import/case-knowledge'),
      sourceCodeDir: knowledgeConfig.sourceCodeDir || path.join(this.projectRoot, 'data/source-code')
    };
  }

  getAntiTalkResponseTemplate() {
    const templatePath = path.join(this.projectRoot, 'data', 'templates', 'anti-talk-response.md');
    if (fs.existsSync(templatePath)) {
      return fs.readFileSync(templatePath, 'utf8');
    }
    return '未找到反讲问题回复模板';
  }

  configList() {
    const configs = this.configManager.listConfigs();
    console.log('\n📋 配置列表:');
    console.log('─'.repeat(50));
    if (configs.length === 0) {
      console.log('   暂无配置');
    } else {
      configs.forEach(c => {
        console.log(`   - ${c.name}`);
        console.log(`     路径: ${c.path}`);
        console.log(`     修改时间: ${c.modified}`);
      });
    }
    console.log();
    return configs;
  }

  configGet(name) {
    const config = this.configManager.getConfig(name);
    if (config) {
      console.log(`\n⚙️  配置 ${name}:`);
      console.log('─'.repeat(50));
      console.log(JSON.stringify(config, null, 2));
      console.log();
    } else {
      console.log(`❌ 配置不存在: ${name}`);
    }
    return config;
  }

  configSet(name, keyPath, value) {
    return this.configManager.setConfigValue(name, keyPath, value);
  }

  async generateKnowledgeFromGitLab(projectId, gitlabConfig = {}) {
    const gitlabFullConfig = this.configManager.getGitLabConfig() || {};
    const mergedConfig = { ...gitlabFullConfig, ...gitlabConfig };
    
    if (projectId) {
      mergedConfig.projectId = projectId;
    }

    if (!mergedConfig.projectId) {
      throw new Error('缺少项目 ID，请在配置中设置或提供参数');
    }

    if (!mergedConfig.accessToken) {
      throw new Error('缺少访问令牌，请在配置中设置');
    }

    const fullConfig = {
      git: {
        gitlab: mergedConfig
      }
    };

    console.log(`🚀 开始从 GitLab 生成知识库...`);
    console.log(`   项目 ID: ${mergedConfig.projectId}`);
    console.log(`   GitLab: ${mergedConfig.baseUrl || 'https://gitlab.com'}`);
    console.log();

    const client = new GitLabClient(fullConfig, this.progressManager);
    const sourceCodeDir = path.join(this.projectRoot, 'data/source-code', String(projectId));
    
    await client.fetchAllFiles(sourceCodeDir);
    
    const analyzeTaskName = `analyze-${projectId}`;
    let analyzeProgress = { 
      stage: 'analyzing', 
      completed: false 
    };
    
    if (this.progressManager.hasProgress(analyzeTaskName)) {
      const savedProgress = this.progressManager.loadProgress(analyzeTaskName);
      if (savedProgress && savedProgress.completed) {
        console.log('✅ 检测到已完成的分析，直接使用结果...');
        // 清理代码库
        this.cleanupSourceCode(sourceCodeDir);
        return savedProgress.result;
      }
    }
    
    const result = await this.analyzeAndGenerateKnowledge(sourceCodeDir, projectId);
    
    analyzeProgress.completed = true;
    analyzeProgress.result = result;
    this.progressManager.saveProgress(analyzeTaskName, analyzeProgress);
    
    // 生成完成后清理代码库
    this.cleanupSourceCode(sourceCodeDir);
    
    return result;
  }

  cleanupSourceCode(sourceDir) {
    console.log('\n🧹 清理临时代码库...');
    
    try {
      if (fs.existsSync(sourceDir)) {
        this.rmdirSyncRecursive(sourceDir);
        console.log(`✅ 已删除代码库: ${sourceDir}`);
      }
    } catch (error) {
      console.warn('⚠️  清理代码库失败:', error.message);
    }
  }

  rmdirSyncRecursive(dir) {
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
}

module.exports = new KnowledgeTools();
