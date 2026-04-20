---
name: emas-intelligent-analysis
description: EMAS 智能分析工具。基于阿里云 EMAS 平台进行应用性能分析、崩溃分析、卡顿分析。结合项目源码进行深度智能分析，自动定位问题代码，获取 Git 开发者信息，给出原因分析和修复建议。Keywords: EMAS, 阿里云, 应用性能, 崩溃分析, 智能分析, 源码分析, ANR, 卡顿分析.
---

# EMAS 智能分析 Skill

基于阿里云 EMAS（Enterprise Mobile Application Studio）平台，结合项目源码进行智能崩溃分析。

## 功能介绍

### 1️⃣ 环境自动检查

- 自动检测阿里云 CLI 是否安装
- 自动检测 emas-appmonitor 插件
- 如未安装，自动下载并安装
- 检查 AK/SK 配置状态

### 2️⃣ 多维度分析

| 分析类型 | 命令 | 说明 |
|---------|------|------|
| 崩溃分析 | `crash` | 应用 Crash 分析 |
| 卡顿分析 | `lag` | 应用卡顿分析 |
| ANR分析 | `anr` | 应用ANR分析 |
| 异常分析 | `exception` | Java 异常分析 |
| 自定义异常 | `custom` | 自定义上报异常 |
| 网络错误 | `network` | 网络请求错误 |
| 最新崩溃 | `latest` | 获取最新崩溃分析报告 |
| Top 10 崩溃 | `top10` | 生成 Top 10 崩溃报告 |
| Top 10 综合 | `top10-all` | 生成 Top 10 综合崩溃报告 |
| 版本分析 | `version-analyze` | 版本分析 - 区分新问题和旧问题 |
| 趋势分析 | `trend` | 趋势分析 - 分析连续几周的崩溃报告变化 |
| 批量查询 | `batch` | 批量查询多页数据 |
| 单个崩溃 | `hash` | 单个崩溃哈希查询 |

### 3️⃣ 智能分析模式 (核心功能)

#### 工作流程

```
1. 调用 get-issues 接口获取崩溃列表（一页10条）
   ↓
2. 对每条崩溃调用 get-issue 获取详情
   ↓
3. 提取堆栈中的应用代码位置
   ↓
4. 在项目中搜索源码文件
   ↓
5. 读取相关代码片段
   ↓
6. 获取 Git 信息（最近修改者、问题行责任人）
   ↓
7. 根据错误类型生成原因分析和修复建议
   ↓
8. 输出完整分析报告
```

#### 报告内容

**崩溃/卡顿/异常分析：**
```
📊 基本信息
   类型、次数、设备数、错误率、首现版本
   影响版本、最近时间、首次时间（来自详情接口）
   阿里云控制台链接（可点击跳转）

📍 堆栈分析 - 代码位置
   🏠 应用代码：类名、方法、文件名、行号
   ⚙️ 系统调用：触发崩溃的系统调用链
   📦 涉及的Native库（如 libhwui.so 等）
   ☕ 涉及的Java类

📋 详细堆栈信息（来自详情接口）

🔎 源码分析
   ✅ 找到源码路径
   相关代码片段 + 行号标注
   代码贡献者统计

👤 Git 信息
   最近修改者（姓名、邮箱、提交时间）
   问题行责任人（通过 git blame）

💡 原因分析
🛠️ 修改建议
📝 代码示例（修改前后对比）

📱 版本分布分析
📱 系统版本分布分析
📱 机型分布分析
🏷️ 品牌分布分析
```



### 4️⃣ 灵活的时间范围

```
--days 7       最近7天（默认）
--days 14      最近14天
--days 30      最近30天
--days 1       昨天

--start 2026-04-01 --end 2026-04-17  自定义范围
```

### 5️⃣ 分页查询

```
--page 1           第1页（默认）
--page 2           第2页
--page-size 10     每页10条（默认）
--page-size 20     每页20条
```

### 6️⃣ 提示词自动触发优化

#### 触发条件
- 当用户输入包含 "崩溃"、"卡顿"、"ANR"、"性能" 等关键词时，自动触发智能分析
- 当用户输入包含 "EMAS"、"阿里云"、"应用监控" 等平台相关词汇时，自动推荐相关分析命令

#### 优化策略
1. **智能识别上下文**：根据用户输入的具体问题，自动选择最适合的分析类型
2. **自动填充参数**：根据当前时间和常见需求，自动建议合理的时间范围和分页参数
3. **优先级排序**：根据崩溃次数、影响设备数等指标，自动对分析结果进行排序
4. **报告自动保存**：分析完成后，自动将报告保存到 [reports](file:///Users/tal/workSpace/TraeProject/MySkills/emas-intelligent-analysis/dist/reports/) 目录
5. **可点击报告链接**：所有生成的报告文件都会以可点击链接格式显示，方便快速打开查看

#### 示例触发场景
- 用户输入："分析最近一周的崩溃" → 自动执行 `emas-analyze crash --days 7 --format analysis`
- 用户输入："查看卡顿问题" → 自动执行 `emas-analyze lag --format analysis`
- 用户输入："生成综合报告" → 自动执行 `emas-analyze report`
- 用户输入："获取最新监控信息" → 自动执行 `emas-analyze latest`
- 用户输入："获取最新崩溃信息" → 自动执行 `emas-analyze latest`
- 用户输入："生成 Top 10 崩溃报告" → 自动执行 `emas-analyze top10`
- 用户输入："分析版本问题" → 自动执行 `emas-analyze version-analyze`
- 用户输入："分析崩溃趋势" → 自动执行 `emas-analyze trend`

## 使用说明

### 快速开始

```bash
# 1. 检查环境
emas-analyze check

# 2. 配置 AK/SK
emas-analyze configure \
  --ak YOUR_ACCESS_KEY \
  --sk YOUR_SECRET_KEY \
  --app-key 123456789 \
  --project-path /your/project/path

# 3. 智能分析 Top 10 崩溃（默认每页10条）
emas-analyze crash --format analysis

# 4. 分析第2页
emas-analyze crash --page 2 --format analysis

# 5. 获取最新崩溃分析报告
emas-analyze latest

# 6. 生成 Top 10 崩溃报告
emas-analyze top10

# 7. 生成 Top 10 综合崩溃报告
emas-analyze top10-all

# 8. 版本分析
emas-analyze version-analyze

# 9. 趋势分析（最近4周）
emas-analyze trend

# 10. 批量查询多页数据
emas-analyze batch --pages 1-3 --page-size 20

# 11. 单个崩溃哈希查询
emas-analyze hash --hash YOUR_CRASH_HASH
```

### 智能分析示例

```bash
# 分析 Top 10 崩溃（默认）
emas-analyze crash --format analysis

# 分析最近14天
emas-analyze crash --days 14 --format analysis

# 分析卡顿
emas-analyze lag --format analysis

# 分析ANR
emas-analyze anr --format analysis

# 指定自定义项目路径
emas-analyze crash --project-path /other/project --format analysis
```

### 表格列表

```bash
# 查看崩溃列表（表格格式）
emas-analyze crash

# 查看卡顿列表
emas-analyze lag

# 查看ANR列表
emas-analyze anr

# 查看异常列表
emas-analyze exception

# 查看自定义异常列表
emas-analyze custom

# 查看网络错误列表
emas-analyze network

# JSON 格式
emas-analyze crash --format json
```

### 综合报告

```bash
# 生成7天综合报告
emas-analyze report

# 生成30天报告
emas-analyze report --days 30
```

## 配置说明

### 配置文件位置

```
~/.emas-analysis/config.json
```

### 配置项

| 参数 | 说明 | 示例 |
|------|------|------|
| `accessKeyId` | 阿里云 AccessKey ID | LTAI5txxx |
| `accessKeySecret` | 阿里云 AccessKey Secret | xxx |
| `region` | 区域 | cn-shanghai |
| `appKey` | EMAS AppKey | 123456789 |
| `projectPath` | 项目源码路径 | /Users/xxx/project |

### 配置方式

**方式1: 命令行**
```bash
emas-analyze configure \
  --ak YOUR_AK \
  --sk YOUR_SK \
  --app-key 123456789 \
  --project-path /your/project/path
```

**方式2: 直接编辑配置**
```bash
vim ~/.emas-analysis/config.json
```

**方式3: 环境变量**
```bash
export EMAS_PROJECT_PATH=/your/project/path
```

## 命令参考

### emas-analyze check
检查环境配置
```bash
emas-analyze check
```

### emas-analyze configure
配置 AK/SK
```bash
emas-analyze configure [options]
  --ak <accessKey>        AccessKey ID
  --sk <secretKey>        AccessKey Secret
  --region <region>       区域 (默认 cn-shanghai)
  --app-key <appKey>      EMAS AppKey
  --project-path <path>   项目源码路径
```

### emas-analyze crash
崩溃分析
```bash
emas-analyze crash [options]
  --days <n>              最近N天
  --start <date>          开始日期
  --end <date>            结束日期
  --page <n>              页码（默认1）
  --page-size <n>         每页数量（默认10）
  --format <format>       输出格式 (table/json/analysis)
  --project-path <path>   项目路径
```

### emas-analyze lag
卡顿分析
```bash
# 同 crash 命令参数
emas-analyze lag --format analysis
```

### emas-analyze anr
ANR分析
```bash
# 同 crash 命令参数
emas-analyze anr --format analysis
```

### emas-analyze exception
异常分析
```bash
# 同 crash 命令参数
emas-analyze exception --format analysis
```

### emas-analyze custom
自定义异常分析
```bash
# 同 crash 命令参数
emas-analyze custom --format analysis
```

### emas-analyze network
网络错误分析
```bash
# 同 crash 命令参数
emas-analyze network --format analysis
```

### emas-analyze report
综合报告
```bash
emas-analyze report --days 30
```

### emas-analyze latest
获取最新崩溃分析报告
```bash
emas-analyze latest [options]
  --app-key <appKey>      EMAS AppKey
  --app-version <version>  应用版本
```

### emas-analyze top10
生成 Top 10 崩溃报告
```bash
emas-analyze top10 [options]
  --app-key <appKey>      EMAS AppKey
  --app-version <version>  应用版本
```

### emas-analyze top10-all
生成 Top 10 综合崩溃报告
```bash
emas-analyze top10-all [options]
  --app-key <appKey>      EMAS AppKey
  --app-version <version>  应用版本
```

### emas-analyze version-analyze
版本分析
```bash
emas-analyze version-analyze [options]
  --app-key <appKey>          EMAS AppKey
  --days <n>                  最近N天
  --start <date>              开始日期
  --end <date>                结束日期
  --threshold-version <version>  版本阈值
```

### emas-analyze trend
趋势分析
```bash
emas-analyze trend [options]
  --app-key <appKey>      EMAS AppKey
  --weeks <n>             分析最近N周的数据（默认4）
  --app-version <version>  应用版本
```

### emas-analyze batch
批量查询
```bash
emas-analyze batch [options]
  --app-key <appKey>      EMAS AppKey
  --type <type>           分析类型 (crash/lag/...)
  --days <n>              最近N天
  --start <date>          开始日期
  --end <date>            结束日期
  --pages <pages>         要查询的页码 (1,2,3 或 1-5)
  --page-size <n>         每页数量
  --format <format>       输出格式 (table/json)
  --app-version <version>  应用版本
  --crash-type <type>     崩溃类型筛选 (javaCrash/nativeCrash)
```

### emas-analyze hash
单个崩溃哈希查询
```bash
emas-analyze hash [options]
  --app-key <appKey>      EMAS AppKey
  --hash <hash>           崩溃哈希值
  --type <type>           分析类型 (crash/lag/...)
  --project-path <path>   项目源码路径
```

## 报告示例

```
════════════════════════════════════════════════════════════════════════════════
  🔍 智能分析报告
════════════════════════════════════════════════════════════════════════════════

📊 基本信息
────────────────────────────────────────
   崩溃类型: android.app.BackgroundServiceStartNotAllowedException
   崩溃次数: 138
   影响设备: 135
   错误率:   0.021%
   首现版本: 9.62.02

📍 堆栈分析 - 代码位置
────────────────────────────────────────
   🏠 应用代码:
      类:     com.xueersi.lib.framework.utils.LooperHook$XesHandlerCallback2
      方法:   handleMessage
      文件:   LooperHook.java
      行号:   100

🔎 源码分析
────────────────────────────────────────
   ✅ 找到源码: /project/.../LooperHook.java

      相关代码片段:
   >>>  100 |                 handler.handleMessage(msg);
        101 |             } catch (Exception e) {

👤 Git 信息
────────────────────────────────────────
   📝 最近修改者:
      👤 张三 <zhangsan@example.com>
      📅 2026-04-15 10:30:00
      💬 feat: 修复XXX问题
   
   ⚠️ 问题行(第100行)最近修改:
      👤 李四

💡 原因分析
────────────────────────────────────────
   Android 12+ 不允许在后台启动 Service

🛠️ 修改建议
────────────────────────────────────────
   方案1: 使用 WorkManager 替代后台 Service
   方案2: 使用 startForegroundService()
   
📝 代码示例
────────────────────────────────────────

 + 修改后   - 修改前

// 修改后
if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
    context.startForegroundService(intent);
}

════════════════════════════════════════════════════════════════════════════════
```

## 常见问题

### Q: 如何分析特定版本的问题？
```bash
emas-analyze crash --start 2026-04-01 --end 2026-04-07 --format analysis
```

### Q: 项目路径配置优先级？
```
命令行参数 > 配置文件 > 环境变量 > 默认值
```

### Q: 找不到源码怎么办？
- 确认项目路径正确
- 检查源码是否在项目目录下
- 第三方库无法分析源码

### Q: Git 信息显示 "文件被 .gitignore 忽略"？
- 该文件可能在 Submodule 中
- Submodule 的 Git 历史需要到对应仓库查询

## 技术细节

### API 调用

1. **get-issues** - 获取崩溃列表（分页）
2. **get-issue** - 获取单条崩溃详情

### 参考文档

- 阿里云 CLI 调用 RPC API 和 ROA API：https://help.aliyun.com/zh/cli/call-rpc-api-and-roa-api

### 源码搜索策略

1. 直接路径匹配
   ```
   com.xxx.ClassName -> src/.../com/xxx/ClassName.java
   ```

2. 模糊搜索
   ```
   find ... -name "*.java" | xargs grep "class ClassName"
   ```

### 堆栈解析

- 优先提取应用代码（非 android.*, java.* 等系统包）
- 提取第一个应用帧作为崩溃发生位置
- 提取第一个系统帧作为触发调用链

### Git 信息获取

1. **git log** - 获取文件最近修改者
2. **git blame** - 获取指定行的责任人

## 更新日志

### v1.5.0
- ✅ 添加 `latest` 命令：获取最新崩溃分析报告
- ✅ 添加 `top10` 命令：生成 Top 10 崩溃报告
- ✅ 添加 `top10-all` 命令：生成 Top 10 综合崩溃报告
- ✅ 添加 `version-analyze` 命令：版本分析 - 区分新问题和旧问题
- ✅ 添加 `trend` 命令：趋势分析 - 分析连续几周的崩溃报告变化
- ✅ 添加 `batch` 命令：批量查询多页数据
- ✅ 添加 `hash` 命令：单个崩溃哈希查询
- ✅ 优化 Native 崩溃分析，特别是 libhwui.so 相关的渲染崩溃
- ✅ 增强版本分析逻辑，获取应用最新版本进行比较
- ✅ 改进堆栈分析，添加 Native 库和 Java 类分析
- ✅ 优化报告生成，添加更多分布分析
- ✅ 修复正则表达式语法错误

### v1.4.0
- ✅ 完善 ANR 分析功能，支持智能分析模式
- ✅ 修复控制台URL生成，支持所有分析类型
- ✅ 优化命令行参数和报告生成

### v1.3.0
- ✅ 添加提示词自动触发优化功能
- ✅ 智能识别上下文，自动选择分析类型
- ✅ 自动填充参数，建议合理的时间范围和分页
- ✅ 报告自动保存到 [reports](file:///Users/tal/workSpace/TraeProject/MySkills/emas-intelligent-analysis/dist/reports/) 目录

### v1.2.0
- ✅ 调用崩溃详情接口获取更多信息
- ✅ 默认每页 10 条
- ✅ 不继承上次的 pageSize

### v1.1.0
- ✅ 添加智能分析模式
- ✅ 支持源码分析和代码定位
- ✅ 自动生成修复建议
- ✅ 支持项目路径配置
- ✅ Git 开发者信息获取

### v1.0.0
- ✅ 基础崩溃/卡顿/异常分析
- ✅ 灵活时间范围和分页
- ✅ 表格和 JSON 格式输出
