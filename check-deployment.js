#!/usr/bin/env node

/**
 * 部署状态检查脚本
 * 检查网站是否正常部署和运行
 */

const https = require('https');
const http = require('http');

// 要检查的URL列表
const urls = [
  'https://xiaohongshu-trend-analyzer.vercel.app',
  'https://xiaohongshu-trend-analyzer.netlify.app',
  // 添加您的其他部署URL
];

function checkUrl(url) {
  return new Promise((resolve) => {
    const protocol = url.startsWith('https') ? https : http;
    
    const req = protocol.get(url, (res) => {
      const status = res.statusCode;
      const success = status >= 200 && status < 400;
      
      resolve({
        url,
        status,
        success,
        message: success ? '✅ 正常' : `❌ 错误 (${status})`
      });
    });
    
    req.on('error', (error) => {
      resolve({
        url,
        status: 0,
        success: false,
        message: `❌ 连接失败: ${error.message}`
      });
    });
    
    req.setTimeout(10000, () => {
      req.destroy();
      resolve({
        url,
        status: 0,
        success: false,
        message: '❌ 超时'
      });
    });
  });
}

async function checkAllUrls() {
  console.log('🔍 检查部署状态...\n');
  
  const results = await Promise.all(urls.map(checkUrl));
  
  results.forEach(result => {
    console.log(`${result.message} ${result.url}`);
  });
  
  const successCount = results.filter(r => r.success).length;
  const totalCount = results.length;
  
  console.log(`\n📊 检查结果: ${successCount}/${totalCount} 个部署正常运行`);
  
  if (successCount === 0) {
    console.log('\n⚠️  所有部署都无法访问，请检查：');
    console.log('1. 部署是否完成');
    console.log('2. 域名是否正确');
    console.log('3. 网络连接是否正常');
  } else if (successCount < totalCount) {
    console.log('\n⚠️  部分部署无法访问，请检查相应的部署服务');
  } else {
    console.log('\n🎉 所有部署都正常运行！');
  }
}

// 如果没有提供URL，显示帮助信息
if (urls.length === 0 || urls.every(url => url.includes('example'))) {
  console.log('📝 请在脚本中添加您的部署URL');
  console.log('例如：');
  console.log('- https://your-project.vercel.app');
  console.log('- https://your-project.netlify.app');
  console.log('- https://your-username.github.io/your-project');
  process.exit(1);
}

checkAllUrls().catch(console.error);
