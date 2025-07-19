const fs = require('fs');
const path = require('path');

console.log('📊 开始处理53k数据文件...');

// 读取53k数据文件
const dataPath = './data/processed/xiaohongshu_notes_53k.json';
if (!fs.existsSync(dataPath)) {
  console.error('❌ 53k数据文件不存在');
  process.exit(1);
}

console.log('📥 读取数据文件...');
const rawData = fs.readFileSync(dataPath, 'utf8');
const data = JSON.parse(rawData);

console.log(`📊 原始数据量: ${data.length} 条`);

// 按点赞数排序，取前1000条
const sortedData = data
  .filter(item => item && item.like_count && item.title)
  .sort((a, b) => (b.like_count || 0) - (a.like_count || 0))
  .slice(0, 1000);

console.log(`🔥 筛选出热门数据: ${sortedData.length} 条`);

// 转换为前端需要的格式
const transformedData = sortedData.map((item, index) => ({
  id: item.id || `hot_${index}`,
  title: item.title,
  content: item.content || item.title,
  author: item.author || '匿名用户',
  publishTime: item.publish_time || item.crawl_time || new Date().toISOString(),
  likeCount: item.like_count || 0,
  commentCount: item.comment_count || 0,
  shareCount: item.share_count || 0,
  viewCount: item.view_count || 0,
  tags: item.tags || [],
  category: item.category || '生活',
  images: item.images || [],
  sentiment: item.sentiment || 'neutral',
  trendScore: Math.min(100, Math.max(0, (item.like_count || 0) / 1000))
}));

// 确保public/data目录存在
const outputDir = './public/data';
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// 保存精简版数据
const outputPath = path.join(outputDir, 'hot_topics_1k.json');
fs.writeFileSync(outputPath, JSON.stringify(transformedData, null, 2));

console.log(`✅ 精简数据已保存到: ${outputPath}`);
console.log(`📊 数据量: ${transformedData.length} 条`);
console.log(`📁 文件大小: ${(fs.statSync(outputPath).size / 1024 / 1024).toFixed(2)} MB`);
