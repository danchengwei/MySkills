# 知识库工具集

一套完整的知识库工具集合，包含业务知识生成、课诉问题处理等功能。你可以直接和我对话，我会根据你的需求调用相应的工具。

## 项目结构

```
knowledge-base-tool/
├── src/
│   ├── knowledge-generator/    # 知识源生成模块
│   │   ├── gitlab/            # GitLab 客户端
│   │   ├── analyzer/          # 代码分析器
│   │   ├── knowledge-base/    # 知识库管理
│   │   ├── knowledge-management/ # 知识源管理
│   │   ├── qa/                # 知识问答系统
│   │   └── index.js
│   ├── case-handler/          # 课诉问题处理模块
│   │   ├── knowledge/         # 课诉知识库
│   │   ├── qa/                # 课诉问答系统
│   │   ├── management/        # 课诉管理
│   │   └── index.js
│   ├── dev-tools/              # 开发工具模块
│   ├── cr-mr/                  # 代码审查模块
│   ├── testing/                # 测试模块
│   └── index.js                # 主入口文件
├── config/                      # 配置文件目录
│   ├── default.js              # 默认配置
│   ├── loader.js               # 配置加载器
│   └── index.js                # 配置入口
├── examples/                    # 示例文件目录
│   ├── case-example.json       # 课诉案例 JSON 示例
│   └── case-example.md         # 课诉案例 Markdown 示例
├── tests/                       # 测试目录
├── docs/                        # 文档目录
│   └── CONFIG.md               # 配置文件说明
├── .env.example                 # 环境变量示例
├── .gitignore
├── package.json
└── README.md
```

## 安装依赖

```bash
npm install
```

## 配置

1. 复制环境变量文件：
   ```bash
   cp .env.example .env
   ```

2. 根据需要修改 `.env` 文件中的配置项，特别是 GitLab/GitHub 相关配置。

详细配置说明请参考 [docs/CONFIG.md](docs/CONFIG.md)。

## 主要功能

### 1. 知识源生成

从 GitLab 拉取代码，自动分析业务场景，生成详细的知识源文件。

### 2. 业务知识问答

根据生成的知识库，回答关于业务场景的问题，提供业务逻辑、代码位置、接口信息等。

### 3. 课诉问题处理

上传和管理课诉案例，结合业务知识，快速定位和解决问题。

## 命令详解

### 知识源生成命令 (knowledge)

```bash
# 从 GitLab 生成知识库
node src/index.js knowledge gitlab

# 从本地代码生成知识库
node src/index.js knowledge local /path/to/your/code

# 列出所有业务场景
node src/index.js knowledge list

# 提问业务问题
node src/index.js knowledge ask "伴读预习是什么业务"

# 导出知识库为 Markdown
node src/index.js knowledge export ./knowledge.md
```

### 知识源管理命令 (km)

```bash
# 列出所有知识源
node src/index.js km list

# 按分类筛选
node src/index.js km list -c "控制器"

# 搜索知识源
node src/index.js km search "伴读"

# 查看知识源详情
node src/index.js km get <knowledge-id>

# 查看知识库统计
node src/index.js km stats
```

### 课诉问题处理命令 (case)

```bash
# 提问课诉问题
node src/index.js case ask "游戏化里面宠物的装扮不见了"

# 上传课诉案例（JSON 或 Markdown）
node src/index.js case upload ./examples/case-example.json

# 批量上传课诉案例
node src/index.js case batch ./examples/

# 列出所有课诉案例
node src/index.js case list

# 查看课诉案例详情
node src/index.js case get <case-id>

# 搜索课诉案例
node src/index.js case search "宠物"

# 查看课诉知识库统计
node src/index.js case stats
```

### 其他命令

```bash
# 查看配置信息
node src/index.js config

# 查看特定配置项
node src/index.js config -k git.gitlab
```

## 使用示例

### 示例 1: 生成知识库

```bash
# 1. 配置 GitLab
# 编辑 .env 文件，填入 GitLab 访问信息

# 2. 从 GitLab 生成知识库
node src/index.js knowledge gitlab

# 3. 查看生成的业务场景
node src/index.js knowledge list

# 4. 提问业务问题
node src/index.js knowledge ask "伴读预习是什么业务"
```

### 示例 2: 处理课诉问题

```bash
# 1. 上传课诉案例
node src/index.js case upload ./examples/case-example.json

# 2. 提问课诉问题
node src/index.js case ask "宠物装扮不见了怎么处理"

# 3. 查看课诉案例
node src/index.js case list
```

## 课诉案例格式

支持 JSON 和 Markdown 两种格式：

### JSON 格式

参考 [examples/case-example.json](examples/case-example.json)

### Markdown 格式

参考 [examples/case-example.md](examples/case-example.md)

## 主要配置模块

- **Git 配置** - 支持 GitLab 和 GitHub
- **知识生成配置** - 知识源生成相关设置
- **开发工具配置** - 开发环境设置
- **代码审查配置** - CR/MR 流程设置
- **测试配置** - 测试框架和覆盖率设置
- **日志配置** - 日志级别和输出设置

详细配置说明请参考 [docs/CONFIG.md](docs/CONFIG.md)。
