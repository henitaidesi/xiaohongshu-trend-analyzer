# 🚀 小红书创作趋势分析平台部署指南

## 📋 部署前准备

### 1. 确保项目可以本地运行
```bash
npm install
npm run build
npm run preview
```

## 🌟 方案一：Vercel部署（推荐）

### 优势
- ✅ 免费额度充足
- ✅ 自动HTTPS
- ✅ 全球CDN加速
- ✅ 自动部署
- ✅ 简单易用

### 部署步骤

#### 1. 注册Vercel账号
- 访问 [vercel.com](https://vercel.com)
- 使用GitHub账号注册

#### 2. 上传代码到GitHub
```bash
# 初始化Git仓库（如果还没有）
git init
git add .
git commit -m "Initial commit"

# 创建GitHub仓库并推送
git remote add origin https://github.com/你的用户名/xiaohongshu-trend-analyzer.git
git push -u origin main
```

#### 3. 在Vercel中导入项目
1. 登录Vercel控制台
2. 点击 "New Project"
3. 选择GitHub仓库
4. 选择 `xiaohongshu-trend-analyzer` 项目
5. 配置如下：
   - Framework Preset: `Vite`
   - Build Command: `npm run build`
   - Output Directory: `dist`
6. 点击 "Deploy"

#### 4. 访问网站
- 部署完成后，Vercel会提供一个免费域名
- 格式：`https://your-project-name.vercel.app`

## 🔧 方案二：Netlify部署

### 部署步骤
1. 访问 [netlify.com](https://netlify.com)
2. 注册账号
3. 拖拽 `dist` 文件夹到Netlify
4. 或连接GitHub仓库自动部署

## 🖥️ 方案三：GitHub Pages部署

### 1. 修改vite.config.ts
```typescript
export default defineConfig({
  base: '/xiaohongshu-trend-analyzer/',
  // ... 其他配置
})
```

### 2. 创建GitHub Actions
创建 `.github/workflows/deploy.yml`：

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '18'
        
    - name: Install dependencies
      run: npm install
      
    - name: Build
      run: npm run build
      
    - name: Deploy
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./dist
```

## 🌐 方案四：自己的服务器部署

### 使用Nginx
```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    location / {
        root /var/www/xiaohongshu-trend-analyzer;
        try_files $uri $uri/ /index.html;
    }
}
```

## 📱 访问地址示例

部署成功后，您的网站将可以通过以下地址访问：

- **Vercel**: `https://xiaohongshu-trend-analyzer.vercel.app`
- **Netlify**: `https://xiaohongshu-trend-analyzer.netlify.app`
- **GitHub Pages**: `https://你的用户名.github.io/xiaohongshu-trend-analyzer`

## 🔍 部署后验证

访问网站后，确保以下功能正常：
- ✅ 页面正常加载
- ✅ 数据可视化图表显示
- ✅ 路由跳转正常
- ✅ 响应式布局正常

## 🚨 常见问题

### 1. 路由404问题
确保配置了SPA路由重定向：
- Vercel: 已在 `vercel.json` 中配置
- Netlify: 创建 `_redirects` 文件

### 2. 静态资源加载失败
检查 `vite.config.ts` 中的 `base` 配置

### 3. 构建失败
检查依赖版本兼容性：
```bash
npm run type-check
npm run lint
```

## 📞 技术支持

如果遇到部署问题，可以：
1. 检查构建日志
2. 查看浏览器控制台错误
3. 确认所有依赖已正确安装
