# 配置文件说明

## 配置文件结构

项目使用多层次配置系统：

1. **默认配置** - `config/default.js`
2. **环境变量配置** - 通过 `.env` 文件或系统环境变量
3. **运行时配置** - 可以通过代码动态修改

## 配置项详解

### 1. 知识生成配置 (knowledge)

```javascript
knowledge: {
  outputDir: './output',        // 输出目录
  format: 'markdown',           // 输出格式
  sources: [],                  // 知识源列表
  templateDir: './templates'    // 模板目录
}
```

### 2. 开发工具配置 (dev)

```javascript
dev: {
  autoReload: true,             // 自动重载
  port: 3000,                   // 端口号
  host: 'localhost',            // 主机地址
  hotModuleReplacement: false   // 热模块替换
}
```

### 3. Git 配置 (git)

#### GitLab 配置
```javascript
git: {
  provider: 'gitlab',
  gitlab: {
    baseUrl: 'https://gitlab.com',       // GitLab 地址
    apiVersion: 'v4',                     // API 版本
    projectId: '',                        // 项目 ID
    accessToken: '',                      // 访问令牌
    defaultBranch: 'main'                 // 默认分支
  }
}
```

#### GitHub 配置
```javascript
git: {
  provider: 'github',
  github: {
    baseUrl: 'https://api.github.com',   // GitHub API 地址
    owner: '',                            // 用户名/组织名
    repo: '',                             // 仓库名
    accessToken: '',                      // 访问令牌
    defaultBranch: 'main'                 // 默认分支
  }
}
```

### 4. 代码审查配置 (cr)

```javascript
cr: {
  enabled: true,                          // 启用代码审查
  gitProvider: 'gitlab',                  // Git 提供商
  reviewers: [],                          // 审查者列表
  requiredApprovals: 1,                   // 所需批准数
  autoMerge: false,                       // 自动合并
  labels: ['ready-to-merge'],             // 标签
  checkList: [                            // 检查清单
    '代码符合规范',
    '有充分的测试覆盖',
    '文档已更新'
  ]
}
```

### 5. 合并请求配置 (mr)

```javascript
mr: {
  titleTemplate: '[${type}] ${description}',    // 标题模板
  descriptionTemplate: './templates/mr-template.md',  // 描述模板
  squashCommits: true,                           // 压缩提交
  removeSourceBranch: true                       // 删除源分支
}
```

### 6. 测试配置 (testing)

```javascript
testing: {
  framework: 'jest',                 // 测试框架
  coverage: true,                    // 覆盖率统计
  coverageThreshold: 80,             // 覆盖率阈值
  testDir: './tests',                // 测试目录
  watchMode: false,                  // 监听模式
  reporters: ['default', 'json']     // 报告格式
}
```

### 7. 日志配置 (logging)

```javascript
logging: {
  level: 'info',                     // 日志级别
  format: 'text',                    // 日志格式
  outputFile: './logs/app.log',      // 输出文件
  consoleOutput: true                // 控制台输出
}
```

## 环境变量配置

复制 `.env.example` 为 `.env` 并填写配置：

```bash
cp .env.example .env
```

支持的环境变量：

| 环境变量 | 说明 |
|---------|------|
| GITLAB_BASE_URL | GitLab 基础 URL |
| GITLAB_ACCESS_TOKEN | GitLab 访问令牌 |
| GITLAB_PROJECT_ID | GitLab 项目 ID |
| GITHUB_ACCESS_TOKEN | GitHub 访问令牌 |
| GITHUB_OWNER | GitHub 用户名/组织 |
| GITHUB_REPO | GitHub 仓库名 |
| LOG_LEVEL | 日志级别 |

## 使用配置

### 在代码中获取配置

```javascript
const config = require('../config');

// 获取完整配置
const fullConfig = config.get();

// 获取特定配置项
const gitlabUrl = config.get('git.gitlab.baseUrl');
const port = config.get('dev.port');
```

### 通过命令行查看配置

```bash
# 查看完整配置
node src/index.js config

# 查看特定配置项
node src/index.js config -k git.gitlab
node src/index.js config -k dev.port
```
