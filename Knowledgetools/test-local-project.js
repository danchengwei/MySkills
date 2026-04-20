const tools = require('./tools');

console.log('=== 本地项目路径配置测试 ===\n');

// 测试1: 获取当前本地项目路径
console.log('1. 当前本地项目路径:');
const currentPath = tools.getLocalProjectPath();
console.log(`   ${currentPath}\n`);

// 测试2: 审查本地项目
console.log('2. 开始审查本地项目...');
try {
  const result = tools.reviewLocalProject();
  console.log('\n3. 审查完成!');
  console.log(`   状态: ${result.success ? '成功' : '失败'}`);
  if (result.report) {
    console.log(`   审查文件数: ${result.report.summary.totalFiles}`);
    console.log(`   通过文件数: ${result.report.summary.passedFiles}`);
    console.log(`   问题数: ${result.report.summary.totalIssues}`);
    console.log(`   警告数: ${result.report.summary.totalWarnings}`);
    console.log(`   业务逻辑影响度: ${result.report.businessLogicImpact.overallImpact}`);
  }
} catch (error) {
  console.error('审查过程中出现错误:', error.message);
}
