const path = require('path');
const defaultConfig = require('./default');

class ConfigLoader {
  constructor() {
    this.config = { ...defaultConfig };
    this.envConfig = this.loadEnvConfig();
    this.mergeConfig();
  }

  loadEnvConfig() {
    const envConfig = {};
    
    if (process.env.GITLAB_BASE_URL) {
      envConfig.git = envConfig.git || {};
      envConfig.git.gitlab = envConfig.git.gitlab || {};
      envConfig.git.gitlab.baseUrl = process.env.GITLAB_BASE_URL;
    }
    
    if (process.env.GITLAB_ACCESS_TOKEN) {
      envConfig.git = envConfig.git || {};
      envConfig.git.gitlab = envConfig.git.gitlab || {};
      envConfig.git.gitlab.accessToken = process.env.GITLAB_ACCESS_TOKEN;
    }
    
    if (process.env.GITLAB_PROJECT_ID) {
      envConfig.git = envConfig.git || {};
      envConfig.git.gitlab = envConfig.git.gitlab || {};
      envConfig.git.gitlab.projectId = process.env.GITLAB_PROJECT_ID;
    }
    
    if (process.env.GITHUB_ACCESS_TOKEN) {
      envConfig.git = envConfig.git || {};
      envConfig.git.github = envConfig.git.github || {};
      envConfig.git.github.accessToken = process.env.GITHUB_ACCESS_TOKEN;
    }
    
    if (process.env.GITHUB_OWNER) {
      envConfig.git = envConfig.git || {};
      envConfig.git.github = envConfig.git.github || {};
      envConfig.git.github.owner = process.env.GITHUB_OWNER;
    }
    
    if (process.env.GITHUB_REPO) {
      envConfig.git = envConfig.git || {};
      envConfig.git.github = envConfig.git.github || {};
      envConfig.git.github.repo = process.env.GITHUB_REPO;
    }
    
    if (process.env.LOG_LEVEL) {
      envConfig.logging = envConfig.logging || {};
      envConfig.logging.level = process.env.LOG_LEVEL;
    }
    
    return envConfig;
  }

  mergeConfig() {
    this.deepMerge(this.config, this.envConfig);
  }

  deepMerge(target, source) {
    for (const key in source) {
      if (source[key] instanceof Object && key in target) {
        this.deepMerge(target[key], source[key]);
      } else {
        target[key] = source[key];
      }
    }
  }

  get(path) {
    if (!path) return this.config;
    
    const keys = path.split('.');
    let result = this.config;
    
    for (const key of keys) {
      if (result && result[key] !== undefined) {
        result = result[key];
      } else {
        return undefined;
      }
    }
    
    return result;
  }

  set(path, value) {
    const keys = path.split('.');
    let current = this.config;
    
    for (let i = 0; i < keys.length - 1; i++) {
      const key = keys[i];
      if (!(key in current)) {
        current[key] = {};
      }
      current = current[key];
    }
    
    current[keys[keys.length - 1]] = value;
  }
}

module.exports = new ConfigLoader();
