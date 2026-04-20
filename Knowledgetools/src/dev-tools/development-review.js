const fs = require('fs');
const path = require('path');

class DevelopmentReview {
  constructor() {
    this.reviewResults = [];
  }

  getAndroidDevelopmentGuidelines() {
    return {
      role: 'Android开发工程师',
      corePrinciples: [
        '保持代码简洁、可读、可维护',
        '遵循现有的代码风格和架构模式',
        '不引入不必要的复杂性',
        '确保代码的稳定性和可靠性'
      ],
      codingStandards: {
        naming: [
          '类名使用大驼峰命名法 (PascalCase)',
          '方法名使用小驼峰命名法 (camelCase)',
          '常量使用全大写下划线分隔 (UPPER_SNAKE_CASE)',
          '变量名使用小驼峰命名法 (camelCase)',
          '私有成员变量使用 m 前缀 (如 mUserName)',
          '静态成员变量使用 s 前缀 (如 sInstance)',
          '布尔变量使用 is/has/can 前缀 (如 isVisible, hasPermission)'
        ],
        codeStructure: [
          '类成员顺序：常量 → 静态变量 → 成员变量 → 构造函数 → 公共方法 → 保护方法 → 私有方法',
          '每个方法尽量保持简短，不超过50行',
          '合理使用空行分隔逻辑块',
          '保持适当的缩进（4个空格）'
        ],
        comments: [
          '公共API必须添加JavaDoc注释',
          '复杂逻辑必须添加注释说明',
          'TODO/FIXME必须添加责任人',
          '不添加无意义的注释'
        ]
      },
      characterEncoding: {
        rules: [
          '只使用UTF-8字符编码',
          '避免使用特殊字符和非标准Unicode字符',
          '中文注释使用简体中文',
          '字符串资源统一放在 strings.xml 中'
        ],
        forbiddenPatterns: [
          /[\u0000-\u0008\u000B-\u000C\u000E-\u001F\u007F-\u009F]/,
          /[\u200B-\u200D\uFEFF]/
        ]
      },
      businessLogic: {
        principles: [
          '不修改现有业务逻辑的行为',
          '新功能通过扩展实现，而非修改',
          '保持向后兼容性',
          '充分测试所有修改的代码路径'
        ],
        checkpoints: [
          '是否修改了公共API的签名？',
          '是否改变了现有方法的返回值？',
          '是否影响了异常处理流程？',
          '是否修改了数据存储格式？'
        ]
      },
      errorPrevention: {
        nullPointer: [
          '使用 @Nullable 和 @NonNull 注解',
          '调用方法前检查对象是否为null',
          '使用 Optional 处理可能为null的值',
          '避免链式调用过长'
        ],
        infiniteLoop: [
          '确保循环有明确的退出条件',
          '避免在循环中修改循环变量',
          '使用 for-each 而非手动索引',
          '添加循环超时保护（如需要）'
        ],
        crashPrevention: [
          '捕获适当的异常',
          '不在主线程执行耗时操作',
          '合理使用 try-catch',
          '资源使用后及时释放'
        ],
        memoryLeaks: [
          '避免静态引用Context',
          '使用WeakReference持有Activity引用',
          '及时取消注册监听器',
          '使用LeakCanary检测内存泄漏'
        ]
      },
      performance: [
        '避免在 onDraw 中创建对象',
        '使用ViewHolder模式优化列表',
        '合理使用缓存',
        '避免频繁的GC'
      ],
      security: [
        '不在日志中输出敏感信息',
        '使用HTTPS进行网络请求',
        '合理使用权限',
        '对用户输入进行验证'
      ]
    };
  }

  getSelfChecklist() {
    return {
      preDevelopment: [
        '理解需求和现有代码结构',
        '确认修改范围和影响',
        '制定测试计划',
        '遵循现有代码风格'
      ],
      duringDevelopment: [
        '遵循命名规范',
        '添加必要的注释',
        '处理空指针情况',
        '避免死循环',
        '使用UTF-8编码',
        '不引入特殊字符',
        '保持业务逻辑不变',
        '编写单元测试'
      ],
      postDevelopment: [
        '代码自审查',
        '运行所有测试',
        '检查内存泄漏',
        '验证业务逻辑',
        '生成审查报告'
      ]
    };
  }

  reviewFile(filePath, content) {
    const issues = [];
    const warnings = [];
    const suggestions = [];

    const ext = path.extname(filePath).toLowerCase();
    
    if (ext === '.java' || ext === '.kt') {
      this.reviewCodeFile(filePath, content, issues, warnings, suggestions);
    } else if (ext === '.xml') {
      this.reviewXmlFile(filePath, content, issues, warnings, suggestions);
    }

    return {
      filePath,
      issues,
      warnings,
      suggestions,
      passed: issues.length === 0
    };
  }

  reviewCodeFile(filePath, content, issues, warnings, suggestions) {
    const lines = content.split('\n');
    const guidelines = this.getAndroidDevelopmentGuidelines();

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const lineNum = i + 1;

      for (const pattern of guidelines.characterEncoding.forbiddenPatterns) {
        if (pattern.test(line)) {
          issues.push({
            type: 'character_encoding',
            severity: 'error',
            line: lineNum,
            message: '包含禁止的特殊字符',
            code: line.substring(0, 100)
          });
        }
      }

      if (line.includes('.get(') && !line.includes('?') && !line.includes('if')) {
        warnings.push({
          type: 'null_pointer_risk',
          severity: 'warning',
          line: lineNum,
          message: '可能存在空指针风险，建议添加null检查',
          code: line.substring(0, 100)
        });
      }

      if (line.includes('while (true)') || line.includes('for (;;)')) {
        warnings.push({
          type: 'infinite_loop_risk',
          severity: 'warning',
          line: lineNum,
          message: '可能存在无限循环风险，确保有明确的退出条件',
          code: line.substring(0, 100)
        });
      }

      if (line.length > 120) {
        suggestions.push({
          type: 'line_length',
          severity: 'suggestion',
          line: lineNum,
          message: '行过长，建议分行',
          code: line.substring(0, 100) + '...'
        });
      }
    }
  }

  reviewXmlFile(filePath, content, issues, warnings, suggestions) {
    const guidelines = this.getAndroidDevelopmentGuidelines();

    for (const pattern of guidelines.characterEncoding.forbiddenPatterns) {
      if (pattern.test(content)) {
        issues.push({
          type: 'character_encoding',
          severity: 'error',
          line: 1,
          message: '包含禁止的特殊字符'
        });
      }
    }
  }

  reviewChanges(changedFiles, description, originalFiles = {}) {
    const reviewReport = {
      timestamp: new Date().toISOString(),
      description: description || '开发审查',
      guidelines: this.getAndroidDevelopmentGuidelines(),
      checklist: this.getSelfChecklist(),
      fileReviews: [],
      businessLogicImpact: {
        overallImpact: 'low',
        impactAreas: [],
        riskLevel: 'low',
        recommendations: []
      },
      summary: {
        totalFiles: changedFiles.length,
        passedFiles: 0,
        totalIssues: 0,
        totalWarnings: 0,
        totalSuggestions: 0
      }
    };

    for (const fileInfo of changedFiles) {
      let content;
      try {
        if (fileInfo.content) {
          content = fileInfo.content;
        } else if (fileInfo.path) {
          content = fs.readFileSync(fileInfo.path, 'utf8');
        }
      } catch (error) {
        console.warn(`无法读取文件 ${fileInfo.path}:`, error.message);
        continue;
      }

      if (content) {
        const fileReview = this.reviewFile(fileInfo.path || fileInfo.name, content);
        reviewReport.fileReviews.push(fileReview);
        
        if (fileReview.passed) {
          reviewReport.summary.passedFiles++;
        }
        reviewReport.summary.totalIssues += fileReview.issues.length;
        reviewReport.summary.totalWarnings += fileReview.warnings.length;
        reviewReport.summary.totalSuggestions += fileReview.suggestions.length;
      }
    }

    reviewReport.overallStatus = reviewReport.summary.totalIssues === 0 ? 'pass' : 'fail';
    
    this.analyzeBusinessLogicImpact(reviewReport, changedFiles, originalFiles);
    
    return reviewReport;
  }

  analyzeBusinessLogicImpact(reviewReport, changedFiles, originalFiles) {
    const impact = reviewReport.businessLogicImpact;
    const guidelines = this.getAndroidDevelopmentGuidelines();
    
    for (const fileInfo of changedFiles) {
      const filePath = fileInfo.path || fileInfo.name;
      const ext = path.extname(filePath).toLowerCase();
      
      if (ext === '.java' || ext === '.kt') {
        const content = fileInfo.content || '';
        const originalContent = originalFiles[filePath] || '';
        
        const impactResult = this.analyzeFileImpact(filePath, content, originalContent);
        
        if (impactResult.hasImpact) {
          impact.impactAreas.push({
            file: filePath,
            impactType: impactResult.impactType,
            description: impactResult.description,
            details: impactResult.details
          });
        }
      }
    }
    
    if (impact.impactAreas.length > 0) {
      const highRiskCount = impact.impactAreas.filter(a => 
        a.impactType === 'api_change' || a.impactType === 'behavior_change'
      ).length;
      
      if (highRiskCount > 0) {
        impact.overallImpact = 'high';
        impact.riskLevel = 'high';
        impact.recommendations.push('需要进行完整的回归测试');
        impact.recommendations.push('建议进行代码审查');
      } else {
        impact.overallImpact = 'medium';
        impact.riskLevel = 'medium';
        impact.recommendations.push('建议进行相关功能测试');
      }
    } else {
      impact.overallImpact = 'low';
      impact.riskLevel = 'low';
      impact.recommendations.push('进行基本功能验证即可');
    }
    
    impact.recommendations.push('确保所有测试通过');
    impact.recommendations.push('验证业务逻辑一致性');
  }

  analyzeFileImpact(filePath, newContent, oldContent) {
    const result = {
      hasImpact: false,
      impactType: 'unknown',
      description: '',
      details: []
    };

    const lines = newContent.split('\n');
    const oldLines = oldContent.split('\n');

    const publicMethodPattern = /public\s+\w+\s+\w+\s*\(/g;
    const privateMethodPattern = /private\s+\w+\s+\w+\s*\(/g;
    
    const newPublicMethods = (newContent.match(publicMethodPattern) || []).length;
    const oldPublicMethods = oldContent ? (oldContent.match(publicMethodPattern) || []).length : 0;
    
    if (oldContent && newPublicMethods !== oldPublicMethods) {
      result.hasImpact = true;
      result.impactType = 'api_change';
      result.description = '公共API方法数量发生变化';
      result.details.push(`原方法数: ${oldPublicMethods}, 新方法数: ${newPublicMethods}`);
    }

    const returnTypePattern = /return\s+[\w\[\]]+\s*;/g;
    const exceptionPattern = /throw\s+new\s+\w+Exception/g;
    
    for (let i = 0; i < Math.min(lines.length, oldLines.length); i++) {
      const oldLine = oldLines[i] || '';
      const newLine = lines[i] || '';
      
      if (oldLine !== newLine) {
        if (oldLine.includes('return') && newLine.includes('return')) {
          result.hasImpact = true;
          result.impactType = 'behavior_change';
          result.description = '返回值逻辑可能发生变化';
          result.details.push(`第${i + 1}行: "${oldLine.trim()}" → "${newLine.trim()}"`);
        }
        
        if (oldLine.includes('if') || oldLine.includes('else') || 
            oldLine.includes('switch') || oldLine.includes('case')) {
          if (newLine !== oldLine) {
            result.hasImpact = true;
            result.impactType = 'logic_change';
            result.description = '条件判断逻辑发生变化';
            result.details.push(`第${i + 1}行: "${oldLine.trim()}" → "${newLine.trim()}"`);
          }
        }
      }
    }

    if (!result.hasImpact) {
      result.description = '未检测到明显的业务逻辑变化';
    }

    return result;
  }

  generateReviewReport(reviewReport) {
    let report = '# Android 开发审查报告\n\n';
    report += `**审查时间**: ${reviewReport.timestamp}\n`;
    report += `**审查描述**: ${reviewReport.description}\n\n`;

    report += '## 📊 审查概览\n\n';
    report += `| 指标 | 数值 |\n`;
    report += `|------|------|\n`;
    report += `| 审查文件数 | ${reviewReport.summary.totalFiles} |\n`;
    report += `| 通过文件数 | ${reviewReport.summary.passedFiles} |\n`;
    report += `| 问题数 | ${reviewReport.summary.totalIssues} |\n`;
    report += `| 警告数 | ${reviewReport.summary.totalWarnings} |\n`;
    report += `| 建议数 | ${reviewReport.summary.totalSuggestions} |\n\n`;

    report += `## 🎯 整体状态: ${reviewReport.overallStatus === 'pass' ? '✅ 通过' : '❌ 失败'}\n\n`;

    report += '## 📊 业务逻辑影响度分析\n\n';
    report += `**整体影响度**: ${this.getImpactLabel(reviewReport.businessLogicImpact.overallImpact)}\n`;
    report += `**风险等级**: ${this.getRiskLabel(reviewReport.businessLogicImpact.riskLevel)}\n\n`;

    if (reviewReport.businessLogicImpact.impactAreas.length > 0) {
      report += '### 影响区域\n\n';
      for (const area of reviewReport.businessLogicImpact.impactAreas) {
        report += `#### ${this.getImpactTypeLabel(area.impactType)}: ${area.file}\n\n`;
        report += `- **描述**: ${area.description}\n`;
        if (area.details.length > 0) {
          report += '- **细节**:\n';
          for (const detail of area.details) {
            report += `  - ${detail}\n`;
          }
        }
        report += '\n';
      }
    } else {
      report += '✅ 未检测到明显的业务逻辑影响\n\n';
    }

    report += '### 建议\n\n';
    for (const recommendation of reviewReport.businessLogicImpact.recommendations) {
      report += `- [ ] ${recommendation}\n`;
    }
    report += '\n';

    if (reviewReport.fileReviews.length > 0) {
      report += '## 📝 文件审查详情\n\n';
      
      for (const fileReview of reviewReport.fileReviews) {
        report += `### ${fileReview.passed ? '✅' : '❌'} ${fileReview.filePath}\n\n`;
        
        if (fileReview.issues.length > 0) {
          report += '#### 🔴 问题\n\n';
          for (const issue of fileReview.issues) {
            report += `- **${issue.type}** (第${issue.line}行): ${issue.message}\n`;
            if (issue.code) {
              report += `  \`\`\`\n  ${issue.code}\n  \`\`\`\n`;
            }
          }
          report += '\n';
        }

        if (fileReview.warnings.length > 0) {
          report += '#### 🟡 警告\n\n';
          for (const warning of fileReview.warnings) {
            report += `- **${warning.type}** (第${warning.line}行): ${warning.message}\n`;
            if (warning.code) {
              report += `  \`\`\`\n  ${warning.code}\n  \`\`\`\n`;
            }
          }
          report += '\n';
        }

        if (fileReview.suggestions.length > 0) {
          report += '#### 💡 建议\n\n';
          for (const suggestion of fileReview.suggestions) {
            report += `- **${suggestion.type}** (第${suggestion.line}行): ${suggestion.message}\n`;
            if (suggestion.code) {
              report += `  \`\`\`\n  ${suggestion.code}\n  \`\`\`\n`;
            }
          }
          report += '\n';
        }
      }
    }

    report += '## 📋 开发规范参考\n\n';
    report += '### 编码规范\n\n';
    for (const rule of reviewReport.guidelines.codingStandards.naming) {
      report += `- ${rule}\n`;
    }
    report += '\n';

    report += '### 错误预防\n\n';
    report += '#### 空指针异常预防\n';
    for (const rule of reviewReport.guidelines.errorPrevention.nullPointer) {
      report += `- ${rule}\n`;
    }
    report += '\n';

    report += '#### 死循环预防\n';
    for (const rule of reviewReport.guidelines.errorPrevention.infiniteLoop) {
      report += `- ${rule}\n`;
    }
    report += '\n';

    report += '### 自我检查清单\n\n';
    report += '#### 开发前\n';
    for (const item of reviewReport.checklist.preDevelopment) {
      report += `- [ ] ${item}\n`;
    }
    report += '\n';

    report += '#### 开发中\n';
    for (const item of reviewReport.checklist.duringDevelopment) {
      report += `- [ ] ${item}\n`;
    }
    report += '\n';

    report += '#### 开发后\n';
    for (const item of reviewReport.checklist.postDevelopment) {
      report += `- [ ] ${item}\n`;
    }
    report += '\n';

    return report;
  }

  printDeveloperPrompt() {
    const guidelines = this.getAndroidDevelopmentGuidelines();
    const checklist = this.getSelfChecklist();
    
    let prompt = `
# Android 开发工程师指南

## 角色定位
你现在是一名专业的${guidelines.role}，请严格遵循以下开发规范进行开发工作。

## 核心原则
${guidelines.corePrinciples.map(p => `- ${p}`).join('\n')}

## 编码规范

### 命名规范
${guidelines.codingStandards.naming.map(r => `- ${r}`).join('\n')}

### 代码结构
${guidelines.codingStandards.codeStructure.map(r => `- ${r}`).join('\n')}

### 注释规范
${guidelines.codingStandards.comments.map(r => `- ${r}`).join('\n')}

## 字符编码规范
${guidelines.characterEncoding.rules.map(r => `- ${r}`).join('\n')}

⚠️ **禁止引入**:
- 非UTF-8字符
- 特殊控制字符
- 零宽字符

## 业务逻辑规范
${guidelines.businessLogic.principles.map(p => `- ${p}`).join('\n')}

## 错误预防

### 空指针异常预防
${guidelines.errorPrevention.nullPointer.map(r => `- ${r}`).join('\n')}

### 死循环预防
${guidelines.errorPrevention.infiniteLoop.map(r => `- ${r}`).join('\n')}

### 崩溃预防
${guidelines.errorPrevention.crashPrevention.map(r => `- ${r}`).join('\n')}

### 内存泄漏预防
${guidelines.errorPrevention.memoryLeaks.map(r => `- ${r}`).join('\n')}

## 性能规范
${guidelines.performance.map(p => `- ${p}`).join('\n')}

## 安全规范
${guidelines.security.map(p => `- ${p}`).join('\n')}

## 开发检查清单

### 开发前
${checklist.preDevelopment.map(item => `- [ ] ${item}`).join('\n')}

### 开发中
${checklist.duringDevelopment.map(item => `- [ ] ${item}`).join('\n')}

### 开发后
${checklist.postDevelopment.map(item => `- [ ] ${item}`).join('\n')}

## 开发完成后
请进行自我审查，生成审查报告，确保：
1. 所有代码符合规范
2. 没有引入问题
3. 业务逻辑保持一致
4. 通过所有检查项
`;

    console.log(prompt);
    return prompt;
  }

  getImpactLabel(impact) {
    const labels = {
      'low': '🟢 低',
      'medium': '🟡 中',
      'high': '🔴 高'
    };
    return labels[impact] || impact;
  }

  getRiskLabel(risk) {
    const labels = {
      'low': '🟢 低风险',
      'medium': '🟡 中等风险',
      'high': '🔴 高风险'
    };
    return labels[risk] || risk;
  }

  getImpactTypeLabel(type) {
    const labels = {
      'api_change': '🔌 API变更',
      'behavior_change': '🔄 行为变更',
      'logic_change': '⚡ 逻辑变更',
      'unknown': '❓ 未知'
    };
    return labels[type] || type;
  }
}

module.exports = DevelopmentReview;
