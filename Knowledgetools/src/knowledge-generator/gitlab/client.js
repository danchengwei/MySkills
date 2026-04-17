const https = require('https');
const path = require('path');
const fs = require('fs');
const ProgressManager = require('../../progress-manager');

class GitLabClient {
  constructor(config, progressManager = null) {
    this.baseUrl = config.git.gitlab.baseUrl || 'https://gitlab.com';
    this.apiVersion = config.git.gitlab.apiVersion || 'v4';
    this.projectId = config.git.gitlab.projectId;
    this.accessToken = config.git.gitlab.accessToken;
    this.defaultBranch = config.git.gitlab.defaultBranch || 'master';
    this.progressManager = progressManager;
    this.taskName = `gitlab-fetch-${this.projectId}`;
  }

  async request(endpoint, options = {}) {
    const url = new URL(`${this.baseUrl}/api/${this.apiVersion}/${endpoint}`);
    const isRaw = options.raw || false;
    
    const requestOptions = {
      hostname: url.hostname,
      path: url.pathname + url.search,
      method: options.method || 'GET',
      headers: {
        'PRIVATE-TOKEN': this.accessToken,
        ...options.headers
      }
    };

    return new Promise((resolve, reject) => {
      const req = https.request(requestOptions, (res) => {
        const chunks = [];
        res.on('data', (chunk) => {
          chunks.push(chunk);
        });
        res.on('end', () => {
          try {
            if (res.statusCode >= 200 && res.statusCode < 300) {
              const buffer = Buffer.concat(chunks);
              
              if (isRaw) {
                resolve({
                  data: buffer,
                  headers: res.headers
                });
              } else {
                resolve({
                  data: JSON.parse(buffer.toString('utf8')),
                  headers: res.headers
                });
              }
            } else {
              const errorData = Buffer.concat(chunks).toString('utf8');
              reject(new Error(`GitLab API Error: ${res.statusCode} - ${errorData}`));
            }
          } catch (e) {
            reject(e);
          }
        });
      });

      req.on('error', reject);
      
      if (options.body) {
        req.write(JSON.stringify(options.body));
      }
      req.end();
    });
  }

  async getProjectInfo() {
    const endpoint = `projects/${encodeURIComponent(this.projectId)}`;
    const response = await this.request(endpoint);
    return response.data;
  }

  async getRepositoryTree(ref = this.defaultBranch, path = '', recursive = true, page = 1, perPage = 100) {
    const endpoint = `projects/${encodeURIComponent(this.projectId)}/repository/tree`;
    const params = new URLSearchParams({
      ref,
      path,
      per_page: String(perPage),
      page: String(page)
    });
    if (recursive) {
      params.set('recursive', 'true');
    }
    const response = await this.request(`${endpoint}?${params}`);
    return {
      data: response.data,
      headers: response.headers,
      totalPages: parseInt(response.headers['x-total-pages'] || '1', 10),
      total: parseInt(response.headers['x-total'] || '0', 10),
      nextPage: response.headers['x-next-page'] ? parseInt(response.headers['x-next-page'], 10) : null
    };
  }

  async getAllRepositoryTree(ref = this.defaultBranch) {
    console.log('📦 正在获取完整仓库树...');
    let allItems = [];
    let page = 1;
    let hasNextPage = true;
    
    while (hasNextPage) {
      console.log(`   获取第 ${page} 页...`);
      const result = await this.getRepositoryTree(ref, '', true, page, 100);
      allItems = allItems.concat(result.data);
      
      if (result.nextPage) {
        page = result.nextPage;
      } else {
        hasNextPage = false;
      }
      
      console.log(`   已获取 ${allItems.length}/${result.total || '?'} 个项目`);
    }
    
    console.log(`✅ 完整仓库树获取完成，共 ${allItems.length} 个项目`);
    return allItems;
  }

  async getFileContent(filePath, ref = this.defaultBranch) {
    const endpoint = `projects/${encodeURIComponent(this.projectId)}/repository/files/${encodeURIComponent(filePath)}/raw`;
    const params = new URLSearchParams({ ref });
    const response = await this.request(`${endpoint}?${params}`, { raw: true });
    return response.data;
  }

  async fetchAllFiles(outputDir, ref = null) {
    console.log('正在从 GitLab 获取文件...');
    
    const projectInfo = await this.getProjectInfo();
    const actualRef = ref || projectInfo.default_branch || this.defaultBranch;
    
    console.log(`   项目: ${projectInfo.name}`);
    console.log(`   使用分支: ${actualRef}`);
    console.log(`   API 地址: ${this.baseUrl}/api/${this.apiVersion}`);
    
    const tree = await this.getAllRepositoryTree(actualRef);
    
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const files = tree.filter(item => item.type === 'blob');
    console.log(`找到 ${files.length} 个文件`);

    let progress = { currentIndex: 0, downloaded: 0, total: files.length, completedFiles: [] };
    
    if (this.progressManager) {
      const existingProgress = this.progressManager.loadProgress(this.taskName);
      if (existingProgress) {
        console.log(`📂 找到已保存的进度，从第 ${existingProgress.currentIndex + 1} 个文件继续`);
        progress = { ...existingProgress };
      }
    }

    for (let i = progress.currentIndex; i < files.length; i++) {
      const file = files[i];
      const filePath = path.join(outputDir, file.path);
      const dirPath = path.dirname(filePath);
      
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
      }

      if (progress.completedFiles.includes(file.path)) {
        console.log(`跳过已下载 (${i + 1}/${files.length}): ${file.path}`);
        continue;
      }

      try {
        const content = await this.getFileContent(file.path, actualRef);
        fs.writeFileSync(filePath, content);
        console.log(`已下载 (${i + 1}/${files.length}): ${file.path}`);
        
        progress.currentIndex = i + 1;
        progress.downloaded++;
        progress.completedFiles.push(file.path);
        
        if (this.progressManager && (i % 10 === 0 || i === files.length - 1)) {
          this.progressManager.saveProgress(this.taskName, progress);
        }
      } catch (error) {
        console.error(`下载失败 ${file.path}:`, error.message);
        if (this.progressManager) {
          this.progressManager.saveProgress(this.taskName, progress);
        }
      }
    }

    if (this.progressManager) {
      this.progressManager.clearProgress(this.taskName);
    }
    
    console.log('✅ 文件下载完成');
    return outputDir;
  }
}

module.exports = GitLabClient;
