#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
小红书爬虫环境设置脚本
自动安装所需依赖
"""

import subprocess
import sys
import os

def run_command(command, description):
    """执行命令并显示进度"""
    print(f"正在{description}...")
    try:
        result = subprocess.run(command, shell=True, capture_output=True, text=True)
        if result.returncode == 0:
            print(f"✅ {description}成功")
            return True
        else:
            print(f"❌ {description}失败: {result.stderr}")
            return False
    except Exception as e:
        print(f"❌ {description}出错: {e}")
        return False

def check_python():
    """检查Python版本"""
    print("检查Python环境...")
    version = sys.version_info
    if version.major >= 3 and version.minor >= 7:
        print(f"✅ Python版本: {version.major}.{version.minor}.{version.micro}")
        return True
    else:
        print(f"❌ Python版本过低: {version.major}.{version.minor}.{version.micro}")
        print("请升级到Python 3.7+")
        return False

def install_dependencies():
    """安装Python依赖"""
    dependencies = [
        "xhs",
        "playwright",
        "requests",
        "lxml"
    ]
    
    print("安装Python依赖包...")
    for dep in dependencies:
        if not run_command(f"pip install {dep}", f"安装{dep}"):
            return False
    
    return True

def install_playwright_browsers():
    """安装Playwright浏览器"""
    return run_command("playwright install chromium", "安装Playwright浏览器")

def test_installation():
    """测试安装是否成功"""
    print("测试安装...")
    
    try:
        # 测试导入
        import xhs
        from playwright.sync_api import sync_playwright
        print("✅ 依赖导入成功")
        
        # 测试浏览器
        with sync_playwright() as p:
            browser = p.chromium.launch(headless=True)
            browser.close()
        print("✅ 浏览器测试成功")
        
        return True
        
    except Exception as e:
        print(f"❌ 测试失败: {e}")
        return False

def main():
    print("🚀 开始设置小红书爬虫环境")
    print("=" * 50)
    
    # 检查Python版本
    if not check_python():
        return False
    
    # 安装依赖
    if not install_dependencies():
        print("❌ 依赖安装失败")
        return False
    
    # 安装浏览器
    if not install_playwright_browsers():
        print("❌ 浏览器安装失败")
        return False
    
    # 测试安装
    if not test_installation():
        print("❌ 安装测试失败")
        return False
    
    print("=" * 50)
    print("🎉 小红书爬虫环境设置完成！")
    print("\n使用说明:")
    print("1. 运行 python xhs_crawler.py check_dependencies '{}' 检查环境")
    print("2. 运行 python xhs_crawler.py health_check '{}' 进行健康检查")
    print("3. 如需真实数据，请提供小红书cookie")
    
    return True

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
