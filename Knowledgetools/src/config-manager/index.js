const fs = require('fs');
const path = require('path');

class ConfigManager {
  constructor(configDir) {
    this.configDir = configDir || path.join(process.cwd(), 'configs');
    this.ensureConfigDir();
    this.configs = new Map();
    this.loadAllConfigs();
  }

  ensureConfigDir() {
    if (!fs.existsSync(this.configDir)) {
      fs.mkdirSync(this.configDir, { recursive: true });
    }
  }

  getConfigPath(name) {
    return path.join(this.configDir, `${name}.json`);
  }

  loadConfig(name) {
    const configPath = this.getConfigPath(name);
    
    if (!fs.existsSync(configPath)) {
      return null;
    }

    try {
      const content = fs.readFileSync(configPath, 'utf-8');
      const config = JSON.parse(content);
      this.configs.set(name, config);
      return config;
    } catch (error) {
      console.error(`加载配置失败 ${name}:`, error.message);
      return null;
    }
  }

  loadAllConfigs() {
    if (!fs.existsSync(this.configDir)) {
      return;
    }

    const files = fs.readdirSync(this.configDir);
    for (const file of files) {
      if (file.endsWith('.json')) {
        const name = path.basename(file, '.json');
        this.loadConfig(name);
      }
    }
  }

  saveConfig(name, config) {
    const configPath = this.getConfigPath(name);
    
    try {
      const content = JSON.stringify(config, null, 2);
      fs.writeFileSync(configPath, content);
      this.configs.set(name, config);
      console.log(`✅ 配置已保存: ${name}`);
      return true;
    } catch (error) {
      console.error(`保存配置失败 ${name}:`, error.message);
      return false;
    }
  }

  getConfig(name) {
    if (this.configs.has(name)) {
      return this.configs.get(name);
    }
    return this.loadConfig(name);
  }

  getConfigValue(name, keyPath, defaultValue = null) {
    const config = this.getConfig(name);
    if (!config) return defaultValue;

    const keys = keyPath.split('.');
    let value = config;
    
    for (const key of keys) {
      if (value && value[key] !== undefined) {
        value = value[key];
      } else {
        return defaultValue;
      }
    }
    
    return value;
  }

  setConfigValue(name, keyPath, value) {
    let config = this.getConfig(name) || {};
    
    const keys = keyPath.split('.');
    let current = config;
    
    for (let i = 0; i < keys.length - 1; i++) {
      const key = keys[i];
      if (!current[key] || typeof current[key] !== 'object') {
        current[key] = {};
      }
      current = current[key];
    }
    
    current[keys[keys.length - 1]] = value;
    return this.saveConfig(name, config);
  }

  deleteConfig(name) {
    const configPath = this.getConfigPath(name);
    
    if (fs.existsSync(configPath)) {
      fs.unlinkSync(configPath);
    }
    
    this.configs.delete(name);
    console.log(`🗑️ 配置已删除: ${name}`);
    return true;
  }

  listConfigs() {
    const configs = [];
    
    if (fs.existsSync(this.configDir)) {
      const files = fs.readdirSync(this.configDir);
      for (const file of files) {
        if (file.endsWith('.json')) {
          const name = path.basename(file, '.json');
          const configPath = this.getConfigPath(name);
          const stat = fs.statSync(configPath);
          
          configs.push({
            name,
            path: configPath,
            modified: stat.mtime,
            size: stat.size
          });
        }
      }
    }
    
    return configs;
  }

  configExists(name) {
    return this.configs.has(name) || fs.existsSync(this.getConfigPath(name));
  }

  createConfigTemplate(name, template) {
    if (this.configExists(name)) {
      console.log(`⚠️  配置已存在: ${name}`);
      return false;
    }
    return this.saveConfig(name, template);
  }

  exportConfig(name, exportPath) {
    const config = this.getConfig(name);
    if (!config) {
      console.log(`❌ 配置不存在: ${name}`);
      return false;
    }

    try {
      fs.writeFileSync(exportPath, JSON.stringify(config, null, 2));
      console.log(`✅ 配置已导出: ${exportPath}`);
      return true;
    } catch (error) {
      console.error('导出配置失败:', error.message);
      return false;
    }
  }

  importConfig(name, importPath) {
    if (!fs.existsSync(importPath)) {
      console.log(`❌ 文件不存在: ${importPath}`);
      return false;
    }

    try {
      const content = fs.readFileSync(importPath, 'utf-8');
      const config = JSON.parse(content);
      return this.saveConfig(name, config);
    } catch (error) {
      console.error('导入配置失败:', error.message);
      return false;
    }
  }

  getGitLabConfig() {
    return this.getConfig('gitlab');
  }

  getGitHubConfig() {
    return this.getConfig('github');
  }

  getMCPConfig(serverName) {
    const mcpConfig = this.getConfig('mcp');
    if (!mcpConfig) return null;
    return mcpConfig.servers ? mcpConfig.servers[serverName] : null;
  }

  getKnowledgeConfig() {
    return this.getConfig('knowledge') || {};
  }

  validateConfig(name, schema) {
    const config = this.getConfig(name);
    if (!config) {
      return { valid: false, errors: ['配置不存在'] };
    }

    const errors = [];
    
    for (const [key, keySchema] of Object.entries(schema)) {
      const value = config[key];
      
      if (keySchema.required && (value === undefined || value === null)) {
        errors.push(`缺少必填字段: ${key}`);
        continue;
      }
      
      if (value !== undefined && value !== null && keySchema.type) {
        const actualType = typeof value;
        if (actualType !== keySchema.type) {
          errors.push(`字段类型错误: ${key} 应该是 ${keySchema.type}，实际是 ${actualType}`);
        }
      }
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }
}

const gitlabConfigTemplate = {
  baseUrl: 'https://gitlab.com',
  apiVersion: 'v4',
  projectId: '',
  accessToken: '',
  defaultBranch: 'main'
};

const githubConfigTemplate = {
  baseUrl: 'https://api.github.com',
  owner: '',
  repo: '',
  accessToken: ''
};

const mcpConfigTemplate = {
  servers: {}
};

const knowledgeConfigTemplate = {
  sourceCodeDir: './data/source-code',
  knowledgeBaseDir: './data/knowledge-base',
  knowledgeSourcesDir: './data/knowledge-sources',
  autoAnalyze: false
};

const configTemplates = {
  gitlab: gitlabConfigTemplate,
  github: githubConfigTemplate,
  mcp: mcpConfigTemplate,
  knowledge: knowledgeConfigTemplate
};

module.exports = {
  ConfigManager,
  configTemplates
};
