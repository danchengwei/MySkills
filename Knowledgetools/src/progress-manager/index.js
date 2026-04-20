const fs = require('fs');
const path = require('path');

class ProgressManager {
  constructor(progressDir) {
    this.progressDir = progressDir;
    this.ensureProgressDir();
  }

  ensureProgressDir() {
    if (!fs.existsSync(this.progressDir)) {
      fs.mkdirSync(this.progressDir, { recursive: true });
    }
  }

  getProgressPath(taskName) {
    return path.join(this.progressDir, `${taskName.replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, '-')}.progress.json`);
  }

  saveProgress(taskName, progress) {
    const progressPath = this.getProgressPath(taskName);
    const progressData = {
      taskName,
      timestamp: new Date().toISOString(),
      ...progress
    };
    
    fs.writeFileSync(progressPath, JSON.stringify(progressData, null, 2));
    console.log(`💾 进度已保存: ${taskName}`);
    return true;
  }

  loadProgress(taskName) {
    const progressPath = this.getProgressPath(taskName);
    
    if (!fs.existsSync(progressPath)) {
      return null;
    }

    try {
      const content = fs.readFileSync(progressPath, 'utf-8');
      return JSON.parse(content);
    } catch (error) {
      console.error(`加载进度失败 ${taskName}:`, error.message);
      return null;
    }
  }

  hasProgress(taskName) {
    return fs.existsSync(this.getProgressPath(taskName));
  }

  clearProgress(taskName) {
    const progressPath = this.getProgressPath(taskName);
    
    if (fs.existsSync(progressPath)) {
      fs.unlinkSync(progressPath);
      console.log(`🗑️  进度已清除: ${taskName}`);
    }
    return true;
  }

  clearAllProgress() {
    if (!fs.existsSync(this.progressDir)) {
      return;
    }

    const files = fs.readdirSync(this.progressDir);
    for (const file of files) {
      if (file.endsWith('.progress.json')) {
        fs.unlinkSync(path.join(this.progressDir, file));
      }
    }
    console.log('🗑️  所有进度已清除');
  }

  listProgress() {
    if (!fs.existsSync(this.progressDir)) {
      return [];
    }

    const progressList = [];
    const files = fs.readdirSync(this.progressDir);
    
    for (const file of files) {
      if (file.endsWith('.progress.json')) {
        try {
          const content = fs.readFileSync(path.join(this.progressDir, file), 'utf-8');
          progressList.push(JSON.parse(content));
        } catch (error) {
          console.error(`读取进度文件失败 ${file}:`, error.message);
        }
      }
    }

    return progressList.sort((a, b) => 
      new Date(b.timestamp) - new Date(a.timestamp)
    );
  }
}

module.exports = ProgressManager;
