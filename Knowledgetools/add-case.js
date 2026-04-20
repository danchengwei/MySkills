#!/usr/bin/env node

const knowledgeTools = require('./tools');

// 解析命令行参数
const args = process.argv.slice(2);
if (args.length === 0) {
  console.log('用法: node add-case.js <用户ID> <讲次> <问题描述>');
  process.exit(1);
}

// 提取参数
const userId = args[0];
const lessonId = args[1];
const description = args.slice(2).join(' ');

// 构建案例数据
const caseData = {
  title: `反讲功能无法进入 - 用户${userId}`,
  category: '功能异常',
  tags: ['反讲', '无法进入', '热点', '卸载重装'],
  status: 'active',
  priority: 'high',
  problemDescription: `用户ID: ${userId}\n讲次: ${lessonId}\n问题: 反讲功能无法进入，已尝试使用热点和卸载重装，问题仍然存在。`,
  reproductionSteps: [
    '打开应用',
    '进入课程',
    '尝试进入反讲功能',
    '功能无法加载或进入'
  ],
  relatedBusiness: ['反讲', '课后小讲师'],
  notes: [
    '用户已尝试热点连接',
    '用户已尝试卸载重装',
    '问题仍然存在'
  ]
};

// 添加案例
try {
  console.log('🔧 添加客诉案例...');
  const caseId = knowledgeTools.caseKnowledgeBase.addCase(caseData);
  console.log(`✅ 客诉案例添加成功！`);
  console.log(`📋 案例ID: ${caseId}`);
  console.log(`📁 案例文件: data/case-knowledge/cases/${caseId}.md`);
} catch (error) {
  console.error('❌ 添加客诉案例失败:', error.message);
  process.exit(1);
}
