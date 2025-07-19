# 小红书趋势分析器 - 项目启动指南

## 🚀 快速启动 (5分钟内运行)

### 第一步：环境检查
```bash
# 检查Node.js版本 (需要16+)
node --version

# 检查npm版本
npm --version

# 如果没有Node.js，请先安装：
# https://nodejs.org/
```

### 第二步：进入项目目录
```bash
# 进入项目根目录
cd "智能新媒体计算综合设计/xiaohongshu-trend-analyzer"

# 确认项目结构
ls -la
```

### 第三步：安装依赖
```bash
# 安装前端依赖
npm install

# 或使用yarn
yarn install
```

### 第四步：启动开发服务器
```bash
# 启动前端开发服务器
npm run dev

# 或使用yarn
yarn dev
```

### 第五步：访问应用
- 打开浏览器访问: http://localhost:3001
- 如果端口被占用，Vite会自动选择下一个可用端口

## 📊 数据说明

### 真实数据集
项目使用53,000条真实小红书数据：
- **数据文件**: `public/data/processed/xiaohongshu_notes_53k.json`
- **数据量**: 53,000条真实笔记数据
- **数据完整性**: 包含用户信息、地域分布、互动数据
- **数据质量**: 经过清洗和验证的高质量数据

### 数据加载
- 应用启动时会自动加载数据
- 首次加载可能需要几秒钟时间
- 数据加载完成后会显示实时统计信息

## 🔧 开发模式

### 热更新
- 修改代码后会自动刷新页面
- 支持TypeScript类型检查
- 实时错误提示和警告

### 调试工具
- 浏览器开发者工具
- React DevTools扩展
- TypeScript类型检查

## 📦 构建生产版本

### 构建命令
```bash
# 构建生产版本
npm run build

# 预览构建结果
npm run preview
```

### 构建输出
- 构建文件位于 `dist/` 目录
- 自动优化和压缩
- 支持现代浏览器

## 🚨 常见问题

### 端口占用
如果3001端口被占用：
```bash
# 查看端口占用
netstat -ano | findstr :3001

# 或者让Vite自动选择端口
npm run dev
```

### 依赖安装失败
```bash
# 清除缓存重新安装
npm cache clean --force
rm -rf node_modules
npm install
```

### 数据加载失败
- 检查 `public/data/processed/` 目录是否存在数据文件
- 确认网络连接正常
- 查看浏览器控制台错误信息

### TypeScript错误
```bash
# 运行类型检查
npm run type-check

# 修复ESLint问题
npm run lint:fix
```

## 📁 项目结构

```
xiaohongshu-trend-analyzer/
├── src/                    # 源代码
│   ├── components/         # React组件
│   ├── pages/             # 页面组件
│   ├── services/          # 数据服务
│   ├── types/             # TypeScript类型
│   └── utils/             # 工具函数
├── public/                # 静态资源
│   └── data/              # 数据文件
├── documentation/         # 项目文档
└── package.json          # 项目配置
```

## 🎯 功能模块

### 数据概览
- 平台核心指标统计
- 实时数据展示
- 快速导航功能

### 热点话题分析
- 话题排行榜
- 分类分析图表
- 关键词云展示
- 时间分布分析

### 创作趋势
- 内容类型分析
- 发布时机洞察
- 趋势预测功能

### 用户洞察
- 用户画像分析
- 地域分布统计
- 行为模式洞察

### AI助手
- 智能内容推荐
- 创作建议生成
- 数据洞察分析

## 🔄 数据更新

### 自动更新
- 页面数据每30秒自动刷新
- 支持手动刷新功能
- 实时显示更新时间

### 数据来源
- 基于真实小红书数据
- 定期更新和扩展
- 保证数据质量和完整性

## 📞 技术支持

### 开发环境问题
1. 确认Node.js版本 >= 16.0.0
2. 确认npm版本 >= 8.0.0
3. 检查网络连接
4. 查看控制台错误信息

### 数据问题
1. 确认数据文件存在
2. 检查文件权限
3. 验证JSON格式
4. 查看网络请求状态

### 性能问题
1. 关闭不必要的浏览器标签
2. 清除浏览器缓存
3. 检查系统资源使用
4. 使用生产构建版本

## 🎉 启动成功

当您看到以下信息时，说明启动成功：
- ✅ 开发服务器运行在 http://localhost:3001
- ✅ 数据加载完成，显示53,000条数据
- ✅ 所有功能模块正常工作
- ✅ 无控制台错误信息

现在您可以开始探索小红书趋势分析平台的各项功能了！

## 📚 更多资源

- [项目README](../../README.md)
- [部署指南](../../DEPLOYMENT.md)
- [项目总结](../../PROJECT_SUMMARY.md)
- [更新日志](../../CHANGELOG.md)
