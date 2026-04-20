module.exports = {
  knowledge: {
    outputDir: './output',
    format: 'markdown',
    sources: [],
    templateDir: './templates'
  },
  dev: {
    autoReload: true,
    port: 3000,
    host: 'localhost',
    hotModuleReplacement: false
  },
  git: {
    provider: 'gitlab',
    gitlab: {
      baseUrl: 'https://gitlab.com',
      apiVersion: 'v4',
      projectId: '',
      accessToken: '',
      defaultBranch: 'main'
    },
    github: {
      baseUrl: 'https://api.github.com',
      owner: '',
      repo: '',
      accessToken: '',
      defaultBranch: 'main'
    }
  },
  cr: {
    enabled: true,
    gitProvider: 'gitlab',
    reviewers: [],
    requiredApprovals: 1,
    autoMerge: false,
    labels: ['ready-to-merge'],
    checkList: [
      '代码符合规范',
      '有充分的测试覆盖',
      '文档已更新'
    ]
  },
  mr: {
    titleTemplate: '[${type}] ${description}',
    descriptionTemplate: './templates/mr-template.md',
    squashCommits: true,
    removeSourceBranch: true
  },
  testing: {
    framework: 'jest',
    coverage: true,
    coverageThreshold: 80,
    testDir: './tests',
    watchMode: false,
    reporters: ['default', 'json']
  },
  logging: {
    level: 'info',
    format: 'text',
    outputFile: './logs/app.log',
    consoleOutput: true
  }
};
