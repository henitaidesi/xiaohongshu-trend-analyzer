# 部署指南

## 🚀 快速部署

### 环境要求

- Node.js >= 16.0.0
- npm >= 8.0.0 或 yarn >= 1.22.0

### 1. 克隆项目

```bash
git clone <repository-url>
cd xiaohongshu-trend-analyzer
```

### 2. 安装依赖

```bash
npm install
# 或
yarn install
```

### 3. 启动开发服务器

```bash
npm run dev
# 或
yarn dev
```

访问 http://localhost:3001 查看应用

### 4. 构建生产版本

```bash
npm run build
# 或
yarn build
```

构建文件将生成在 `dist/` 目录中。

## 📦 静态部署

### Vercel 部署

1. 将项目推送到 GitHub
2. 在 Vercel 中导入项目
3. 设置构建命令: `npm run build`
4. 设置输出目录: `dist`
5. 点击部署

### Netlify 部署

1. 将项目推送到 GitHub
2. 在 Netlify 中连接 GitHub 仓库
3. 设置构建命令: `npm run build`
4. 设置发布目录: `dist`
5. 点击部署

### GitHub Pages 部署

1. 安装 gh-pages:
```bash
npm install --save-dev gh-pages
```

2. 在 package.json 中添加部署脚本:
```json
{
  "scripts": {
    "deploy": "npm run build && gh-pages -d dist"
  }
}
```

3. 运行部署:
```bash
npm run deploy
```

## 🐳 Docker 部署

### Dockerfile

```dockerfile
# 构建阶段
FROM node:16-alpine as builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

# 生产阶段
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### nginx.conf

```nginx
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /static/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

### 构建和运行

```bash
# 构建镜像
docker build -t xiaohongshu-analyzer .

# 运行容器
docker run -p 80:80 xiaohongshu-analyzer
```

## ⚙️ 环境变量配置

创建 `.env` 文件:

```env
# 应用配置
VITE_APP_TITLE=小红书创作趋势分析平台
VITE_APP_VERSION=1.0.0

# API配置 (如果需要)
VITE_API_BASE_URL=https://api.example.com

# 功能开关
VITE_ENABLE_MOCK=false
VITE_ENABLE_ANALYTICS=true
```

## 🔧 性能优化

### 构建优化

1. **代码分割**: 已配置路由级别的代码分割
2. **资源压缩**: Vite 自动压缩 JS、CSS 和图片
3. **Tree Shaking**: 自动移除未使用的代码
4. **缓存策略**: 静态资源添加缓存头

### 运行时优化

1. **懒加载**: 组件和路由懒加载
2. **虚拟滚动**: 大列表使用虚拟滚动
3. **图片优化**: 使用 WebP 格式和响应式图片
4. **CDN**: 建议使用 CDN 加速静态资源

## 📊 监控和分析

### 性能监控

建议集成以下工具:

- **Google Analytics**: 用户行为分析
- **Sentry**: 错误监控和性能追踪
- **Lighthouse**: 性能评分和优化建议

### 日志记录

```javascript
// 生产环境日志配置
if (import.meta.env.PROD) {
  console.log = () => {};
  console.warn = () => {};
  console.error = (error) => {
    // 发送错误到监控服务
    sendErrorToMonitoring(error);
  };
}
```

## 🔒 安全配置

### HTTPS 配置

生产环境必须使用 HTTPS:

```nginx
server {
    listen 443 ssl http2;
    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;
    
    # 安全头
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
}
```

### 内容安全策略 (CSP)

```html
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; 
               script-src 'self' 'unsafe-inline'; 
               style-src 'self' 'unsafe-inline';">
```

## 🚨 故障排除

### 常见问题

1. **端口占用**:
   - 检查端口使用: `netstat -ano | findstr :3001`
   - 更改端口: 在 vite.config.ts 中配置

2. **内存不足**:
   - 增加 Node.js 内存限制: `--max-old-space-size=4096`

3. **构建失败**:
   - 清除缓存: `npm run clean`
   - 重新安装依赖: `rm -rf node_modules && npm install`

### 日志查看

```bash
# 开发环境日志
npm run dev -- --debug

# 生产环境日志
docker logs container-name
```

## 📞 技术支持

如遇到部署问题，请检查:

1. Node.js 版本是否符合要求
2. 依赖是否正确安装
3. 环境变量是否正确配置
4. 网络连接是否正常

## 🎯 部署检查清单

- [ ] 环境要求检查
- [ ] 依赖安装完成
- [ ] 构建成功
- [ ] 静态资源正常加载
- [ ] 路由跳转正常
- [ ] 数据加载正常
- [ ] 响应式布局测试
- [ ] 性能测试通过
- [ ] 安全配置完成
- [ ] 监控配置完成

完成以上检查后，项目即可正式上线运行。
