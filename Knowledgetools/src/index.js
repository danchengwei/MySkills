#!/usr/bin/env node

require('dotenv').config();
const { Command } = require('commander');
const chalk = require('chalk');
const path = require('path');
const config = require('../config');
const KnowledgeGenerator = require('./knowledge-generator');

const program = new Command();

let knowledgeGenerator;

console.log(chalk.blue.bold('知识库工具项目 v1.0.0'));
console.log(chalk.gray('一体化知识源生成、开发、CR/MR和测试平台'));

program
  .name('kb-tool')
  .description('知识库工具命令行')
  .version('1.0.0');

const knowledgeCmd = program.command('knowledge').description('知识源生成相关命令');

knowledgeCmd
  .command('init')
  .description('初始化知识生成器')
  .action(() => {
    if (!knowledgeGenerator) {
      knowledgeGenerator = new KnowledgeGenerator(config);
    }
    console.log(chalk.green('✅ 知识生成器已初始化'));
  });

knowledgeCmd
  .command('gitlab')
  .description('从 GitLab 拉取代码并生成知识库')
  .action(async () => {
    if (!knowledgeGenerator) {
      knowledgeGenerator = new KnowledgeGenerator(config);
    }
    try {
      await knowledgeGenerator.generateFromGitLab();
    } catch (error) {
      console.error(chalk.red('错误:'), error.message);
      process.exit(1);
    }
  });

knowledgeCmd
  .command('local <path>')
  .description('从本地代码目录生成知识库')
  .action(async (localPath) => {
    if (!knowledgeGenerator) {
      knowledgeGenerator = new KnowledgeGenerator(config);
    }
    try {
      await knowledgeGenerator.generateFromLocal(path.resolve(localPath));
    } catch (error) {
      console.error(chalk.red('错误:'), error.message);
      process.exit(1);
    }
  });

knowledgeCmd
  .command('ask <question...>')
  .description('提问关于业务场景的问题')
  .action((questionParts) => {
    if (!knowledgeGenerator) {
      knowledgeGenerator = new KnowledgeGenerator(config);
    }
    const question = questionParts.join(' ');
    knowledgeGenerator.askQuestion(question);
  });

knowledgeCmd
  .command('list')
  .description('列出所有业务场景')
  .action(() => {
    if (!knowledgeGenerator) {
      knowledgeGenerator = new KnowledgeGenerator(config);
    }
    knowledgeGenerator.listScenarios();
  });

knowledgeCmd
  .command('export <outputPath>')
  .description('导出知识库为 Markdown 文档')
  .action((outputPath) => {
    if (!knowledgeGenerator) {
      knowledgeGenerator = new KnowledgeGenerator(config);
    }
    knowledgeGenerator.exportMarkdown(path.resolve(outputPath));
  });

const kmCmd = program.command('km').description('知识源管理相关命令');

kmCmd
  .command('list')
  .description('列出所有知识源')
  .option('-c, --category <category>', '按分类筛选')
  .option('-t, --tag <tag>', '按标签筛选')
  .option('-s, --search <query>', '搜索知识源')
  .action((options) => {
    if (!knowledgeGenerator) {
      knowledgeGenerator = new KnowledgeGenerator(config);
    }
    knowledgeGenerator.listKnowledgeSources(options);
  });

kmCmd
  .command('get <id>')
  .description('获取指定知识源的详细内容')
  .action((id) => {
    if (!knowledgeGenerator) {
      knowledgeGenerator = new KnowledgeGenerator(config);
    }
    knowledgeGenerator.getKnowledgeSource(id);
  });

kmCmd
  .command('delete <id>')
  .description('删除指定知识源')
  .action((id) => {
    if (!knowledgeGenerator) {
      knowledgeGenerator = new KnowledgeGenerator(config);
    }
    knowledgeGenerator.deleteKnowledgeSource(id);
  });

kmCmd
  .command('search <query...>')
  .description('搜索知识源')
  .action((queryParts) => {
    if (!knowledgeGenerator) {
      knowledgeGenerator = new KnowledgeGenerator(config);
    }
    const query = queryParts.join(' ');
    knowledgeGenerator.searchKnowledgeSources(query);
  });

kmCmd
  .command('stats')
  .description('查看知识库统计信息')
  .action(() => {
    if (!knowledgeGenerator) {
      knowledgeGenerator = new KnowledgeGenerator(config);
    }
    knowledgeGenerator.getStatistics();
  });

const caseCmd = program.command('case').description('课诉问题处理相关命令');

caseCmd
  .command('ask <question...>')
  .description('提问课诉问题')
  .action((questionParts) => {
    if (!knowledgeGenerator) {
      knowledgeGenerator = new KnowledgeGenerator(config);
    }
    const question = questionParts.join(' ');
    knowledgeGenerator.askCaseQuestion(question);
  });

caseCmd
  .command('upload <filePath>')
  .description('上传课诉案例（支持 .json 或 .md 文件）')
  .action((filePath) => {
    if (!knowledgeGenerator) {
      knowledgeGenerator = new KnowledgeGenerator(config);
    }
    try {
      knowledgeGenerator.uploadCase(path.resolve(filePath));
    } catch (error) {
      console.error('❌ 上传失败:', error.message);
    }
  });

caseCmd
  .command('batch <directoryPath>')
  .description('批量上传课诉案例目录')
  .action((directoryPath) => {
    if (!knowledgeGenerator) {
      knowledgeGenerator = new KnowledgeGenerator(config);
    }
    try {
      knowledgeGenerator.batchUploadCases(path.resolve(directoryPath));
    } catch (error) {
      console.error('❌ 批量上传失败:', error.message);
    }
  });

caseCmd
  .command('list')
  .description('列出所有课诉案例')
  .option('-c, --category <category>', '按分类筛选')
  .option('-t, --tag <tag>', '按标签筛选')
  .option('-s, --status <status>', '按状态筛选')
  .option('-q, --search <query>', '搜索课诉案例')
  .action((options) => {
    if (!knowledgeGenerator) {
      knowledgeGenerator = new KnowledgeGenerator(config);
    }
    knowledgeGenerator.listCases(options);
  });

caseCmd
  .command('get <id>')
  .description('获取指定课诉案例的详细内容')
  .action((id) => {
    if (!knowledgeGenerator) {
      knowledgeGenerator = new KnowledgeGenerator(config);
    }
    knowledgeGenerator.getCase(id);
  });

caseCmd
  .command('delete <id>')
  .description('删除指定课诉案例')
  .action((id) => {
    if (!knowledgeGenerator) {
      knowledgeGenerator = new KnowledgeGenerator(config);
    }
    knowledgeGenerator.deleteCase(id);
  });

caseCmd
  .command('search <query...>')
  .description('搜索课诉案例')
  .action((queryParts) => {
    if (!knowledgeGenerator) {
      knowledgeGenerator = new KnowledgeGenerator(config);
    }
    const query = queryParts.join(' ');
    knowledgeGenerator.searchCases(query);
  });

caseCmd
  .command('stats')
  .description('查看课诉知识库统计信息')
  .action(() => {
    if (!knowledgeGenerator) {
      knowledgeGenerator = new KnowledgeGenerator(config);
    }
    knowledgeGenerator.getCaseStatistics();
  });

program
  .command('dev')
  .description('开发工具相关命令')
  .action(() => {
    console.log(chalk.green('开发工具模块'));
    console.log(chalk.gray('  请使用 kb-tool dev --help 查看可用命令'));
  });

program
  .command('cr')
  .description('代码审查相关命令')
  .action(() => {
    console.log(chalk.green('代码审查模块'));
    console.log(chalk.gray('  请使用 kb-tool cr --help 查看可用命令'));
  });

program
  .command('test')
  .description('测试相关命令')
  .action(() => {
    console.log(chalk.green('测试模块'));
    console.log(chalk.gray('  请使用 kb-tool test --help 查看可用命令'));
  });

program
  .command('config')
  .description('查看配置信息')
  .option('-k, --key <key>', '查看特定配置项')
  .action((options) => {
    console.log(chalk.blue.bold('\n当前配置:'));
    if (options.key) {
      const value = config.get(options.key);
      console.log(chalk.cyan(`  ${options.key}:`), chalk.yellow(JSON.stringify(value, null, 2)));
    } else {
      console.log(chalk.yellow(JSON.stringify(config.get(), null, 2)));
    }
    console.log();
  });

program.parse(process.argv);
