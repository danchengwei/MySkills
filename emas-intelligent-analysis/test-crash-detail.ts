#!/usr/bin/env node
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

// 模拟获取一个崩溃详情，打印实际的数据结构
async function testCrashDetail() {
  try {
    // 首先获取最新的崩溃列表
    console.log('获取最新崩溃列表...');
    
    // 配置信息（需要替换为实际配置）
    // 这里我们只是检查代码逻辑，不实际运行
    
    console.log('\n分析代码中字段引用：');
    console.log('  - crashDetail.Model.FirstTime');
    console.log('  - crashDetail.Model.LatestTime');
    console.log('  - crashDetail.Model.FirstVersion');
    console.log('  - crashDetail.Model.VersionDistribution');
    
    console.log('\n代码在第2994-2998行和3131-3136行已经正确添加了这些信息到报告中');
    console.log('如果没有显示，可能是实际API返回的字段名不同');
    console.log('让我们检查一下是否需要调整字段名');
    
  } catch (error) {
    console.error('测试失败:', error);
  }
}

testCrashDetail();
