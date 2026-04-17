# 知识库工具使用指南

## 目录说明

项目中预定义了以下目录用于存储和导入数据：

```
knowledge-base-tool/
├── data/                          # 数据存储目录（自动生成）
│   ├── knowledge-base/            # 知识库索引
│   ├── knowledge-sources/         # 生成的知识源文件
│   ├── case-knowledge/            # 课诉案例存储
│   ├── source-code/               # 从 GitLab 拉取的源代码
│   ├── progress/                  # 进度管理存储
│   └── templates/                 # 回复模板存储
├── configs/                       # 配置文件目录
│   ├── gitlab.json                # GitLab 配置
│   ├── github.json                # GitHub 配置
│   ├── mcp.json                   # MCP 配置
│   └── knowledge.json             # 知识源配置
├── import/                        # 导入目录（你需要在这里放文件）
│   ├── knowledge-sources/         # 放置要导入的知识源文件
│   └── case-knowledge/            # 放置要导入的课诉案例文件
├── tools/                         # 工具脚本目录
│   ├── index.js                   # 工具入口
│   └── universal-search.js        # 通用搜索脚本
└── add-case.js                    # 添加客诉案例脚本
```

## 配置步骤

项目会自动创建默认配置模板，无需手动复制。你可以通过以下方式管理配置：

1. **查看配置列表**：
   > "查看配置列表"

2. **设置 GitLab 配置**：
   > "设置 GitLab 配置"

3. **导入/导出配置**：
   > "导入配置"
   > "导出配置"

4. **本地项目路径配置**：
   > "设置本地项目路径"

默认配置已经预置，你可以根据需要进行修改。

## 技能清单

### 1. 知识源生成技能

**功能**：从 GitLab 或本地代码生成业务知识源

**使用场景**：
- 你有 GitLab 项目代码，需要分析并生成业务知识
- 你有本地代码目录，需要分析并生成业务知识

**使用样例**：
```javascript
// 从 GitLab 生成知识源
await tools.generateKnowledgeFromGitLab('30833', {
  accessToken: 'YOUR_TOKEN',
  baseUrl: 'https://git.100tal.com'
});

// 从本地生成知识源
await tools.generateKnowledgeFromLocal('/path/to/project');

// 列出知识源
const sources = tools.listKnowledgeSources();

// 获取特定知识源
const source = tools.getKnowledgeSource('source-id');
```

**你可以直接跟我说**：
> "帮我从 GitLab 生成知识库，项目地址是 xxx，访问令牌是 xxx"
> "帮我分析这个目录的代码：/path/to/your/code"
> "列出所有知识源"

### 2. 客诉知识技能

**功能**：管理和查询客诉相关知识

**使用场景**：
- 你有课诉案例文件，需要导入到系统中
- 你需要从 Excel 文件生成客诉知识源索引
- 你遇到了课诉问题，想查找相关案例和解决方案

**使用样例**：
```javascript
// 导入客诉案例
const result = tools.importCaseKnowledge();

// 生成客诉知识源索引
await tools.indexCaseKnowledge();

// 提问客诉问题
const result = tools.askCaseQuestion('反讲打不开怎么办');

// 列出客诉案例
const cases = tools.listCases();

// 获取特定案例
const caseItem = tools.getCase('case-id');
```

**你可以直接跟我说**：
> "导入课诉案例"
> "生成客诉知识源索引"
> "宠物装扮不见了怎么处理？"
> "列出所有课诉案例"

### 3. 搜索与查询技能

**功能**：快速搜索和查询知识

**使用场景**：
- 你想了解某个业务功能的逻辑、代码位置、接口信息等
- 你想搜索特定的知识源内容
- 你需要管理关键词和同义词

**使用样例**：
```javascript
// 提问业务问题
const result = tools.askBusinessQuestion('反讲功能');

// 搜索知识源
const results = tools.searchKnowledgeSources('反讲功能');

// 添加关键词同义词
tools.addKeywordSynonym('反讲', '课后小讲师');

// 查看所有关键词
const keywords = tools.listAllKeywords();
```

**你可以直接跟我说**：
> "伴读预习是什么业务？"
> "支付功能的代码在哪里？"
> "搜索反讲功能无法进入"
> "添加关键词同义词"

### 4. 开发审查技能

**功能**：辅助开发过程的代码审查

**使用场景**：
- 你需要进行 Android 开发规范检查
- 你需要审查本地项目的代码
- 你需要获取 Android 开发指南

**使用样例**：
```javascript
// 开始开发审查
tools.startDevelopmentReview();

// 审查本地项目
const result = tools.reviewLocalProject();

// 获取 Android 开发指南
const guidelines = tools.getAndroidDevelopmentGuidelines();

// 获取开发检查清单
const checklist = tools.getDevelopmentChecklist();
```

**你可以直接跟我说**：
> "开始开发审查"
> "审查本地项目"
> "获取 Android 开发指南"

### 5. 配置管理技能

**功能**：管理工具的各种配置

**使用场景**：
- 你需要查看当前的配置
- 你需要设置或更新配置值
- 你需要管理本地项目路径

**使用样例**：
```javascript
// 查看配置列表
const configs = tools.configList();

// 获取特定配置
const gitlabConfig = tools.configGet('gitlab');

// 设置配置
tools.configSet('gitlab', 'accessToken', 'YOUR_TOKEN');
tools.configSet('gitlab', 'baseUrl', 'https://git.100tal.com');

// 设置本地项目路径
tools.setLocalProjectPath('/path/to/project');

// 获取本地项目路径
const path = tools.getLocalProjectPath();
```

**你可以直接跟我说**：
> "查看配置列表"
> "查看 GitLab 配置"
> "设置 GitLab 配置"
> "设置本地项目路径"

### 6. 系统管理技能

**功能**：系统级别的管理功能

**使用场景**：
- 你需要获取工具的目录结构信息
- 你需要了解知识库的总体情况

**使用样例**：
```javascript
// 获取目录信息
const dirs = tools.getDirectoriesInfo();

// 获取统计信息
const stats = tools.getStatistics();

// 获取反讲问题回复模板
const template = tools.getAntiTalkResponseTemplate();
```

**你可以直接跟我说**：
> "查看统计信息"
> "反讲打不开怎么办"

## 交互示例

### 示例 1: 生成并查询业务知识

**你**: "我有个本地项目在 /Users/xxx/project，帮我分析一下"

**我**: 好的，我来帮你分析这个项目...（执行分析）

**你**: "伴读预习是什么业务？"

**我**: （查询知识库并返回详细信息）

### 示例 2: 处理课诉问题

**你**: "我把课诉案例放到了 import 目录，帮我导入一下"

**我**: 好的，正在导入课诉案例...（执行导入）

**你**: "宠物装扮不见了怎么处理？"

**我**: （查询课诉案例和业务知识，返回解决方案）

### 示例 3: 使用通用搜索

**你**: "搜索反讲功能无法进入"

**我**: （自动识别客诉场景，搜索相关案例和解决方案）

### 示例 4: 反讲问题回复

**你**: "反讲打不开怎么办"

**我**: （返回标准的反讲问题解决方案，包括文档地址、处理步骤和接口信息）

### 示例 5: 开发审查

**你**: "开始开发审查"

**我**: （提供 Android 开发规范和自我审查清单）

**你**: "审查本地项目"

**我**: （分析本地项目代码，生成审查报告）

### 示例 6: 配置管理

**你**: "设置 GitLab 配置"

**我**: 好的，请提供 GitLab 配置信息...（完成配置）

**你**: "帮我从 GitLab 生成知识库，项目 ID 是 30833"

**我**: 好的，正在从 GitLab 生成知识库...（执行生成）

## 注意事项

1. **目录权限**: 确保程序对 `data/` 和 `import/` 目录有读写权限
2. **文件格式**: 导入的课诉案例请使用 JSON 或 Markdown 格式
3. **GitLab 配置**: 如果使用 GitLab，确保访问令牌有足够的权限
4. **代码分析**: 代码分析器会自动识别常见的代码模式，建议在代码中添加必要的注释
5. **Excel 文件**: 客诉知识源索引支持 Excel 文件，请确保文件格式正确
6. **本地项目路径**: 开发审查功能需要配置本地项目路径
7. **关键词管理**: 定期更新关键词库以提高搜索准确性
8. **代码库清理**: 知识源生成完成后，系统会自动清理下载的代码库，节省存储空间

## 配置管理

项目使用新的配置管理系统，配置文件存储在 `configs/` 目录中：

### 配置文件列表

| 配置文件 | 说明 |
|---------|------|
| gitlab.json | GitLab 配置 |
| github.json | GitHub 配置 |
| mcp.json | MCP 配置 |
| knowledge.json | 知识源配置 |

### 配置管理命令

**你可以直接跟我说**：
- "查看配置列表"
- "查看 GitLab 配置"
- "设置 GitLab 配置"
- "导入配置"
- "导出配置"

## 技能调用方式

你可以通过以下方式调用技能：

1. **直接命令**：直接说出你需要的功能
   > "帮我从 GitLab 生成知识库"
   > "导入课诉案例"
   > "搜索反讲功能"

2. **自然语言**：用自然语言描述你的需求
   > "伴读预习是什么业务？"
   > "反讲打不开怎么办"
   > "宠物装扮不见了怎么处理？"

3. **参数提供**：当需要特定参数时，系统会自动询问
   > "帮我从 GitLab 生成知识库"
   > （系统会询问 GitLab 配置信息）

系统会根据你的输入自动识别需要调用的技能，并执行相应的操作。