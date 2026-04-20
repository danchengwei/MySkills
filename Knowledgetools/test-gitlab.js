const https = require('https');

const baseUrl = 'https://git.100tal.com';
const accessToken = 'RxF3SsLzjDFp7imeYqkS';
const projectId = 30833;
const apiVersion = 'v4';

async function testGitLabAPI() {
  console.log('🧪 开始测试 GitLab API...\n');
  
  console.log('📋 测试配置:');
  console.log(`   基础 URL: ${baseUrl}`);
  console.log(`   API 版本: ${apiVersion}`);
  console.log(`   项目 ID: ${projectId}`);
  console.log(`   访问令牌: ${accessToken.substring(0, 5)}...\n`);

  async function makeRequest(endpoint, options = {}) {
    const url = new URL(`${baseUrl}/api/${apiVersion}/${endpoint}`);
    
    console.log(`📡 请求: ${url.toString()}`);
    
    const requestOptions = {
      hostname: url.hostname,
      path: url.pathname + url.search,
      method: options.method || 'GET',
      headers: {
        'PRIVATE-TOKEN': accessToken,
        'Content-Type': 'application/json',
        ...options.headers
      }
    };

    return new Promise((resolve, reject) => {
      const req = https.request(requestOptions, (res) => {
        console.log(`📥 响应状态: ${res.statusCode} ${res.statusMessage}`);
        console.log(`📥 响应头: ${JSON.stringify(res.headers, null, 2)}`);
        
        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
        });
        res.on('end', () => {
          try {
            if (res.statusCode >= 200 && res.statusCode < 300) {
              resolve(JSON.parse(data));
            } else {
              reject(new Error(`GitLab API Error: ${res.statusCode} - ${data}`));
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

  try {
    console.log('\n🔍 测试 1: 获取项目信息...');
    const projectInfo = await makeRequest(`projects/${encodeURIComponent(projectId)}`);
    console.log('✅ 项目信息获取成功:');
    console.log(`   名称: ${projectInfo.name}`);
    console.log(`   描述: ${projectInfo.description}`);
    console.log(`   默认分支: ${projectInfo.default_branch}`);
    console.log(`   完整响应:`, JSON.stringify(projectInfo, null, 2));

    console.log('\n🔍 测试 2: 获取仓库树 (不带 recursive)...');
    try {
      const tree = await makeRequest(`projects/${encodeURIComponent(projectId)}/repository/tree?ref=${projectInfo.default_branch}&per_page=100`);
      console.log('✅ 仓库树获取成功:');
      console.log(`   找到 ${tree.length} 个项目`);
      console.log('   内容:', JSON.stringify(tree, null, 2));
    } catch (error) {
      console.log('❌ 获取仓库树失败:', error.message);
    }

    console.log('\n🔍 测试 3: 获取仓库树 (带 recursive)...');
    try {
      const tree = await makeRequest(`projects/${encodeURIComponent(projectId)}/repository/tree?ref=${projectInfo.default_branch}&per_page=100&recursive=true`);
      console.log('✅ 仓库树获取成功:');
      console.log(`   找到 ${tree.length} 个项目`);
      console.log('   内容:', JSON.stringify(tree, null, 2));
    } catch (error) {
      console.log('❌ 获取仓库树失败:', error.message);
    }

  } catch (error) {
    console.error('\n❌ 测试失败:', error.message);
    console.error('错误详情:', error);
  }
}

testGitLabAPI();
