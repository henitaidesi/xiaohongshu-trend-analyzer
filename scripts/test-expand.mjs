import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🚀 测试脚本开始运行...');
console.log('📁 当前目录:', __dirname);

// 检查现有数据文件
const existingDataPath = path.join(__dirname, '../public/data/ultra_mass_notes_20250718_200337.json');
console.log('📊 检查数据文件:', existingDataPath);

try {
  const stats = fs.statSync(existingDataPath);
  console.log('✅ 数据文件存在，大小:', (stats.size / 1024 / 1024).toFixed(2), 'MB');
  
  // 读取前几行测试
  const content = fs.readFileSync(existingDataPath, 'utf8');
  const data = JSON.parse(content);
  console.log('📊 数据条数:', data.length);
  console.log('📝 第一条数据:', JSON.stringify(data[0], null, 2).substring(0, 200) + '...');
  
} catch (error) {
  console.error('❌ 读取数据文件失败:', error.message);
}

console.log('✅ 测试完成');
