#!/usr/bin/env node
import { Command } from 'commander';
import chalk from 'chalk';
import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';
import os from 'os';

const execAsync = promisify(exec);

const CONFIG_DIR = path.join(os.homedir(), '.emas-analysis');
const CONFIG_FILE = path.join(CONFIG_DIR, 'config.json');

interface EMASConfig {
  accessKeyId?: string;
  accessKeySecret?: string;
  region?: string;
  appKey?: string;
  projectPath?: string;
  consoleUrlTemplate?: string;
}

function loadConfig(): EMASConfig {
  if (fs.existsSync(CONFIG_FILE)) {
    return JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf-8'));
  }
  return {};
}

async function callEMASAPI(
  action: string,
  params: Record<string, string>,
  config: EMASConfig
): Promise<any> {
  const { accessKeyId, accessKeySecret, region = 'cn-shanghai' } = config;
  
  if (!accessKeyId || !accessKeySecret) {
    throw new Error('AK/SK 未配置');
  }
  
  const paramStr = Object.entries(params)
    .map(([k, v]) => {
      if (k === 'filter') {
        return `--${k} '${v}'`;
      }
      return `--${k} "${v}"`;
    })
    .join(' ');
  
  const cmd = `aliyun emas-appmonitor ${action} ${paramStr} --access-key-id "${accessKeyId}" --access-key-secret "${accessKeySecret}" --region "${region}"`;
  
  try {
    const { stdout } = await execAsync(cmd, { timeout: 30000 });
    return JSON.parse(stdout);
  } catch (error: any) {
    try {
      const errorData = JSON.parse(error.stdout || error.message);
      throw new Error(errorData.Message || errorData.message || 'API 调用失败');
    } catch {
      throw new Error(error.message || 'API 调用失败');
    }
  }
}

async function debugCrash() {
  console.log(chalk.cyan('\n🔍 调试崩溃详情 API\n'));
  
  const config = loadConfig();
  if (!config.accessKeyId || !config.appKey) {
    console.log(chalk.red('请先配置 AK/SK 和 AppKey'));
    return;
  }
  
  console.log(chalk.gray('配置加载成功'));
  
  // 使用用户提供的哈希值
  const crashHash = '1MT55O8EMXL1R';
  console.log(chalk.cyan(`\n使用用户提供的崩溃哈希: ${crashHash}`));
  
  // 获取崩溃详情
  console.log(chalk.cyan('\n获取崩溃详情...'));
  const today = new Date().toISOString().split('T')[0];
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const crashDetail = await callEMASAPI('get-issue', {
    'app-key': config.appKey,
    'biz-module': 'crash',
    'digest-hash': crashHash,
    'os': 'android',
    'time-range': `StartTime=${weekAgo}T00:00:00+08:00 EndTime=${today}T23:59:59+08:00 Granularity=1 GranularityUnit=day`
  }, config);
  
  console.log(chalk.green('\n✅ 崩溃详情获取成功!'));
  console.log(chalk.cyan('\n完整数据结构:'));
  console.log(JSON.stringify(crashDetail, null, 2));
  
  // 重点看 Model 部分
  if (crashDetail?.Model) {
    console.log(chalk.cyan('\n\nModel 部分字段:'));
    for (const key of Object.keys(crashDetail.Model)) {
      const value = crashDetail.Model[key];
      if (typeof value !== 'object' || value === null) {
        console.log(chalk.gray(`  ${key}: ${value}`));
      } else {
        console.log(chalk.gray(`  ${key}: [Object/Array]`));
        if (Array.isArray(value) && value.length > 0) {
          console.log(chalk.gray(`    示例: ${JSON.stringify(value[0], null, 2).split('\n').join('\n    ')}`));
        }
      }
    }
  }
  
  // 保存完整响应到文件
  const debugFile = path.join(__dirname, 'debug-crash-detail.json');
  fs.writeFileSync(debugFile, JSON.stringify(crashDetail, null, 2));
  console.log(chalk.green(`\n完整响应已保存到: ${debugFile}`));
}

debugCrash().catch(console.error);
