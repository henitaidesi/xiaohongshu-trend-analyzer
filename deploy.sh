#!/bin/bash

# 小红书创作趋势分析平台 - 快速部署脚本

echo "🚀 开始部署小红书创作趋势分析平台..."

# 检查Node.js环境
if ! command -v node &> /dev/null; then
    echo "❌ Node.js 未安装，请先安装 Node.js"
    exit 1
fi

if ! command -v npm &> /dev/null; then
    echo "❌ npm 未安装，请先安装 npm"
    exit 1
fi

echo "✅ Node.js 环境检查通过"

# 安装依赖
echo "📦 安装项目依赖..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ 依赖安装失败"
    exit 1
fi

echo "✅ 依赖安装成功"

# 类型检查
echo "🔍 进行类型检查..."
npm run type-check

if [ $? -ne 0 ]; then
    echo "❌ 类型检查失败"
    exit 1
fi

echo "✅ 类型检查通过"

# 代码检查
echo "🔍 进行代码检查..."
npm run lint

if [ $? -ne 0 ]; then
    echo "⚠️  代码检查有警告，但继续构建..."
fi

# 构建项目
echo "🏗️  构建项目..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ 项目构建失败"
    exit 1
fi

echo "✅ 项目构建成功"

# 预览构建结果
echo "👀 启动预览服务器..."
echo "📱 请在浏览器中访问 http://localhost:4173"
echo "🛑 按 Ctrl+C 停止预览服务器"

npm run preview
