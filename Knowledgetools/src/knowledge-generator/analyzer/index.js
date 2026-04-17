const fs = require('fs');
const path = require('path');

class CodeAnalyzer {
  constructor(sourceDir) {
    this.sourceDir = sourceDir;
    this.businessScenarios = [];
    this.apis = [];
    this.classes = [];
    this.functions = [];
    this.fileContents = new Map();
  }

  analyze() {
    console.log('🔍 开始深度分析代码...');
    this.scanDirectory(this.sourceDir);
    this.enrichBusinessScenarios();
    console.log(`✅ 分析完成: ${this.businessScenarios.length} 个业务场景, ${this.apis.length} 个 API 接口`);
    return {
      businessScenarios: this.businessScenarios,
      apis: this.apis,
      classes: this.classes,
      functions: this.functions
    };
  }

  scanDirectory(dir) {
    const files = fs.readdirSync(dir);
    
    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory()) {
        this.scanDirectory(filePath);
      } else if (this.isCodeFile(file)) {
        this.analyzeFile(filePath, dir);
      }
    }
  }

  isCodeFile(filename) {
    const ext = path.extname(filename).toLowerCase();
    return ['.js', '.ts', '.jsx', '.tsx', '.java', '.py', '.go', '.php', '.vue', '.html'].includes(ext);
  }

  analyzeFile(filePath, rootDir) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const relativePath = path.relative(rootDir, filePath);
    
    this.fileContents.set(relativePath, content);
    
    this.extractBusinessScenarios(content, relativePath);
    this.extractAPIs(content, relativePath);
    this.extractClasses(content, relativePath);
    this.extractFunctions(content, relativePath);
  }

  extractBusinessScenarios(content, filePath) {
    const scenarioPatterns = [
      {
        pattern: /\/\*\*[\s\S]*?业务场景[:：]?\s*([^\n]+)[\s\S]*?\*\//g,
        type: 'comment'
      },
      {
        pattern: /\/\/\s*业务场景[:：]?\s*(.+)/g,
        type: 'line-comment'
      },
      {
        pattern: /class\s+(\w+)(?:Controller|Service|Handler|Manager|UseCase|Facade|Activity|Fragment|View|Model|Presenter|Repository|Dao)/g,
        type: 'class'
      },
      {
        pattern: /export\s+(?:const|function|class)\s+(\w+)(?=\s*[=(]|$)/g,
        type: 'export'
      },
      {
        pattern: /\/\*\*[\s\S]*?@module\s+(\w+)[\s\S]*?\*\//g,
        type: 'jsdoc-module'
      },
      {
        pattern: /@Service|@Controller|@RestController|@Component|@Repository|@Configuration/g,
        type: 'spring-annotation'
      }
    ];

    for (const { pattern, type } of scenarioPatterns) {
      let match;
      const patternCopy = new RegExp(pattern.source, pattern.flags);
      while ((match = patternCopy.exec(content)) !== null) {
        let name;
        if (type === 'spring-annotation') {
          // 对于 Spring 注解，尝试提取后续的类名
          const classMatch = content.substring(match.index).match(/\s*class\s+(\w+)/);
          if (classMatch) {
            name = classMatch[1];
          } else {
            continue;
          }
        } else if (match[1]) {
          name = this.cleanName(match[1], type);
        } else {
          continue;
        }
        
        const existing = this.businessScenarios.find(s => s.name === name && s.filePath === filePath);
        
        if (!existing) {
          const scenario = {
            id: this.generateScenarioId(name, filePath),
            name,
            type,
            filePath,
            description: this.extractFullDescription(content, match.index),
            lineNumber: this.getLineNumber(content, match.index),
            category: this.inferCategory(filePath, name),
            tags: this.extractTags(content, match.index),
            businessLogic: this.extractBusinessLogic(content, match.index, filePath),
            dataFlow: this.extractDataFlow(content, match.index),
            notes: this.extractNotes(content, match.index)
          };
          this.businessScenarios.push(scenario);
        }
      }
    }
    
    this.extractFromDirectoryStructure(filePath, content);
  }

  cleanName(name, type) {
    let cleaned = name.trim();
    cleaned = cleaned.replace(/^(class|function|const|let|var)\s+/i, '');
    cleaned = cleaned.replace(/Controller|Service|Handler|Manager|UseCase|Facade$/g, '');
    return cleaned;
  }

  generateScenarioId(name, filePath) {
    const pathPart = filePath.replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, '-');
    const namePart = name.toLowerCase().replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, '-');
    return `${pathPart}-${namePart}`.replace(/-+/g, '-').replace(/^-|-$/g, '');
  }

  inferCategory(filePath, name) {
    const pathLower = filePath.toLowerCase();
    const nameLower = name.toLowerCase();
    
    if (pathLower.includes('controller') || nameLower.includes('controller')) return '控制器';
    if (pathLower.includes('service') || nameLower.includes('service')) return '服务层';
    if (pathLower.includes('model') || nameLower.includes('model')) return '数据模型';
    if (pathLower.includes('repository') || pathLower.includes('dao')) return '数据访问';
    if (pathLower.includes('util') || pathLower.includes('helper')) return '工具类';
    if (pathLower.includes('test') || pathLower.includes('spec')) return '测试';
    if (pathLower.includes('view') || pathLower.includes('page')) return '视图';
    
    return '业务逻辑';
  }

  extractFullDescription(content, index) {
    const start = Math.max(0, index - 500);
    const end = Math.min(content.length, index + 1000);
    const snippet = content.substring(start, end);
    
    const jsdocMatch = snippet.match(/\/\*\*([\s\S]*?)\*\//);
    if (jsdocMatch) {
      let desc = jsdocMatch[1].replace(/\*/g, '').trim();
      desc = desc.replace(/@\w+\s*[^\n]*/g, '').trim();
      return desc;
    }
    
    const multiLineComment = snippet.match(/\/\*([\s\S]*?)\*\//);
    if (multiLineComment && multiLineComment[1].trim().length > 20) {
      return multiLineComment[1].trim();
    }
    
    return '';
  }

  extractTags(content, index) {
    const tags = [];
    const snippet = content.substring(Math.max(0, index - 300), Math.min(content.length, index + 300));
    
    const tagPatterns = [
      /@tags?\s*[:：]?\s*([^\n]+)/g,
      /\/\/\s*标签?[:：]?\s*(.+)/g
    ];
    
    for (const pattern of tagPatterns) {
      let match;
      const patternCopy = new RegExp(pattern.source, pattern.flags);
      while ((match = patternCopy.exec(snippet)) !== null) {
        const tagStr = match[1].trim();
        const tagList = tagStr.split(/[,，\s]+/).filter(t => t.length > 0);
        tags.push(...tagList);
      }
    }
    
    return [...new Set(tags)];
  }

  extractBusinessLogic(content, index, filePath) {
    const logic = [];
    const snippet = content.substring(Math.max(0, index - 100), Math.min(content.length, index + 2000));
    
    const lines = snippet.split('\n');
    let step = 1;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      if (line.includes('//') && !line.includes('http') && !line.includes('https')) {
        const commentMatch = line.match(/\/\/\s*(.+)/);
        if (commentMatch && commentMatch[1].length > 5) {
          logic.push({
            step: step++,
            title: commentMatch[1].trim(),
            description: '',
            codeReference: this.getCodeAround(lines, i, 3)
          });
        }
      }
      
      if (line.match(/^(if|for|while|switch|try|catch|async|await|return)\b/)) {
        if (logic.length === 0 || logic[logic.length - 1].codeReference.split('\n').length < 10) {
          const lastLogic = logic[logic.length - 1];
          if (lastLogic) {
            lastLogic.codeReference = this.getCodeAround(lines, i, 5);
          }
        }
      }
    }
    
    if (logic.length === 0) {
      logic.push({
        step: 1,
        title: '核心业务逻辑',
        description: '请参考代码文件了解详细实现',
        codeReference: this.getCodeAround(lines, Math.floor(lines.length / 2), 20)
      });
    }
    
    return logic;
  }

  getCodeAround(lines, centerIndex, range) {
    const start = Math.max(0, centerIndex - range);
    const end = Math.min(lines.length, centerIndex + range + 1);
    return lines.slice(start, end).join('\n');
  }

  extractDataFlow(content, index) {
    const snippet = content.substring(Math.max(0, index - 200), Math.min(content.length, index + 500));
    
    const dataFlowPatterns = [
      /数据库|database|db\.|sql|mysql|mongodb|redis/i,
      /请求|request|req\.|axios|fetch|http/i,
      /响应|response|res\.|return/i,
      /缓存|cache|redis|localStorage/i
    ];
    
    const flows = [];
    for (const pattern of dataFlowPatterns) {
      if (pattern.test(snippet)) {
        flows.push(pattern.source.replace(/[\\|]/g, ''));
      }
    }
    
    if (flows.length > 0) {
      return `数据流程涉及: ${flows.join(' → ')}`;
    }
    
    return null;
  }

  extractNotes(content, index) {
    const notes = [];
    const snippet = content.substring(Math.max(0, index - 300), Math.min(content.length, index + 300));
    
    const notePatterns = [
      /TODO[:：]?\s*(.+)/g,
      /FIXME[:：]?\s*(.+)/g,
      /XXX[:：]?\s*(.+)/g,
      /NOTE[:：]?\s*(.+)/g,
      /注意[:：]?\s*(.+)/g
    ];
    
    for (const pattern of notePatterns) {
      let match;
      const patternCopy = new RegExp(pattern.source, pattern.flags);
      while ((match = patternCopy.exec(snippet)) !== null) {
        notes.push(match[1].trim());
      }
    }
    
    return notes;
  }

  extractFromDirectoryStructure(filePath, content) {
    const dirParts = filePath.split(path.sep);
    
    for (const part of dirParts) {
      if (part && !['src', 'lib', 'app', 'components', 'pages'].includes(part.toLowerCase())) {
        const existing = this.businessScenarios.find(s => s.name === part && s.filePath === filePath);
        if (!existing && part.length > 2) {
          this.businessScenarios.push({
            id: this.generateScenarioId(part, filePath),
            name: part,
            type: 'directory',
            filePath,
            description: `目录模块: ${part}`,
            lineNumber: 1,
            category: this.inferCategory(filePath, part),
            tags: ['目录模块'],
            businessLogic: [],
            dataFlow: null,
            notes: []
          });
        }
      }
    }
  }

  enrichBusinessScenarios() {
    for (const scenario of this.businessScenarios) {
      scenario.relatedAPIs = this.apis.filter(api => api.filePath === scenario.filePath);
      scenario.relatedClasses = this.classes.filter(cls => cls.filePath === scenario.filePath);
      scenario.relatedFunctions = this.functions.filter(func => func.filePath === scenario.filePath);
    }
  }

  extractAPIs(content, filePath) {
    const apiPatterns = [
      { pattern: /(?:app\.)?(?:get|post|put|delete|patch)\s*\(\s*['"]([^'"]+)['"]/g, framework: 'express' },
      { pattern: /@(Get|Post|Put|Delete|Patch|RequestMapping)\s*\(\s*(?:value\s*=\s*)?['"]([^'"]+)['"]/g, framework: 'spring' },
      { pattern: /router\.(?:get|post|put|delete|patch)\s*\(\s*['"]([^'"]+)['"]/g, framework: 'express-router' },
      { pattern: /@(?:api\.)?(?:get|post|put|delete|patch)\s*\(\s*['"]([^'"]+)['"]/g, framework: 'nestjs' }
    ];

    for (const { pattern, framework } of apiPatterns) {
      let match;
      const patternCopy = new RegExp(pattern.source, pattern.flags);
      while ((match = patternCopy.exec(content)) !== null) {
        const url = match.length > 2 ? match[2] : match[1];
        const methodMatch = content.substring(Math.max(0, match.index - 30), match.index);
        const method = this.extractHttpMethod(methodMatch + (match[1] || ''));
        
        this.apis.push({
          url,
          method,
          framework,
          filePath,
          parameters: this.extractParameters(content, match.index),
          lineNumber: this.getLineNumber(content, match.index),
          description: this.extractDescription(content, match.index)
        });
      }
    }
  }

  extractHttpMethod(text) {
    const methods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS', 'HEAD'];
    const textUpper = text.toUpperCase();
    for (const method of methods) {
      if (textUpper.includes(method)) {
        return method;
      }
    }
    return 'GET';
  }

  extractParameters(content, index) {
    const params = [];
    const paramPatterns = [
      /req\.(?:query|body|params)\.(\w+)/g,
      /@RequestParam\s*\(\s*(?:value\s*=\s*)?['"]?(\w+)['"]?/g,
      /@PathVariable\s*\(\s*(?:value\s*=\s*)?['"]?(\w+)['"]?/g,
      /@RequestBody\s+(\w+)/g,
      /interface\s+\w+\s*{([^}]+)}/g,
      /type\s+\w+\s*=\s*{([^}]+)}/g
    ];

    const snippet = content.substring(index, Math.min(content.length, index + 800));
    
    for (const pattern of paramPatterns) {
      let match;
      const patternCopy = new RegExp(pattern.source, pattern.flags);
      while ((match = patternCopy.exec(snippet)) !== null) {
        if (match[1]) {
          if (match[1].includes(':')) {
            const typeMatches = match[1].match(/(\w+)\s*:/g);
            if (typeMatches) {
              typeMatches.forEach(t => {
                const paramName = t.replace(/\s*:/g, '');
                if (!params.includes(paramName)) params.push(paramName);
              });
            }
          } else if (!params.includes(match[1]) && match[1].length > 1) {
            params.push(match[1]);
          }
        }
      }
    }

    return [...new Set(params)];
  }

  extractClasses(content, filePath) {
    const classPattern = /class\s+(\w+)/g;
    let match;
    while ((match = classPattern.exec(content)) !== null) {
      this.classes.push({
        name: match[1],
        filePath,
        lineNumber: this.getLineNumber(content, match.index),
        description: this.extractDescription(content, match.index)
      });
    }
  }

  extractFunctions(content, filePath) {
    const functionPatterns = [
      /function\s+(\w+)\s*\(/g,
      /(\w+)\s*[:=]\s*(?:async\s+)?\([^)]*\)\s*(?:=>|{)/g,
      /(?:public|private|protected)?\s*(?:static)?\s*(?:async)?\s*(\w+)\s*\([^)]*\)\s*{/g
    ];

    for (const pattern of functionPatterns) {
      let match;
      const patternCopy = new RegExp(pattern.source, pattern.flags);
      while ((match = patternCopy.exec(content)) !== null) {
        const name = match[1];
        if (name && !['if', 'for', 'while', 'switch', 'class', 'new', 'return'].includes(name)) {
          this.functions.push({
            name,
            filePath,
            lineNumber: this.getLineNumber(content, match.index),
            description: this.extractDescription(content, match.index)
          });
        }
      }
    }
  }

  extractDescription(content, index) {
    const start = Math.max(0, index - 200);
    const end = Math.min(content.length, index + 200);
    const snippet = content.substring(start, end);
    
    const commentMatch = snippet.match(/\/\*\*([\s\S]*?)\*\//);
    if (commentMatch) {
      return commentMatch[1].replace(/\*/g, '').trim();
    }
    
    return '';
  }

  getLineNumber(content, index) {
    return content.substring(0, index).split('\n').length;
  }
}

module.exports = CodeAnalyzer;
