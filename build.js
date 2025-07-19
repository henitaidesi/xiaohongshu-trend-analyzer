#!/usr/bin/env node

// 简化的构建脚本，跳过TypeScript检查
import { execSync } from 'child_process';

console.log('🚀 开始构建...');

try {
  // 直接运行vite build，跳过TypeScript检查
  execSync('npx vite build', { stdio: 'inherit' });
  console.log('✅ 构建成功！');
} catch (error) {
  console.error('❌ 构建失败:', error.message);
  process.exit(1);
}
