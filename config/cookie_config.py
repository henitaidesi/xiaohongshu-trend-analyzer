#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
小红书Cookie配置管理
用于安全地管理和使用小红书cookie
"""

import os
import json
import time
from datetime import datetime, timedelta
from typing import Dict, Optional

class CookieManager:
    """Cookie管理器"""
    
    def __init__(self, config_file: str = "cookie_config.json"):
        self.config_file = config_file
        self.cookie_data = self.load_config()
    
    def load_config(self) -> Dict:
        """加载cookie配置"""
        if os.path.exists(self.config_file):
            try:
                with open(self.config_file, 'r', encoding='utf-8') as f:
                    return json.load(f)
            except Exception as e:
                print(f"加载配置失败: {e}")
                return {}
        return {}
    
    def save_config(self):
        """保存cookie配置"""
        try:
            with open(self.config_file, 'w', encoding='utf-8') as f:
                json.dump(self.cookie_data, f, ensure_ascii=False, indent=2)
            print("✅ Cookie配置已保存")
        except Exception as e:
            print(f"❌ 保存配置失败: {e}")
    
    def set_cookie(self, cookie_string: str, user_id: str = "default"):
        """设置cookie"""
        if not cookie_string or not cookie_string.strip():
            raise ValueError("Cookie字符串不能为空")
        
        # 验证cookie格式
        if not self.validate_cookie(cookie_string):
            raise ValueError("Cookie格式不正确")
        
        # 解析cookie
        cookie_dict = self.parse_cookie(cookie_string)
        
        # 保存cookie信息
        self.cookie_data[user_id] = {
            'cookie_string': cookie_string.strip(),
            'cookie_dict': cookie_dict,
            'created_at': datetime.now().isoformat(),
            'last_used': None,
            'is_valid': True
        }
        
        self.save_config()
        print(f"✅ Cookie已设置 (用户: {user_id})")
    
    def get_cookie(self, user_id: str = "default") -> Optional[str]:
        """获取cookie字符串"""
        if user_id not in self.cookie_data:
            return None
        
        cookie_info = self.cookie_data[user_id]
        
        # 检查cookie是否过期（7天）
        created_at = datetime.fromisoformat(cookie_info['created_at'])
        if datetime.now() - created_at > timedelta(days=7):
            print(f"⚠️ Cookie可能已过期 (创建于: {created_at.strftime('%Y-%m-%d %H:%M:%S')})")
        
        # 更新最后使用时间
        self.cookie_data[user_id]['last_used'] = datetime.now().isoformat()
        self.save_config()
        
        return cookie_info['cookie_string']
    
    def get_headers(self, user_id: str = "default") -> Dict[str, str]:
        """获取包含cookie的请求头"""
        cookie = self.get_cookie(user_id)
        if not cookie:
            raise ValueError(f"未找到用户 {user_id} 的cookie")
        
        return {
            'Cookie': cookie,
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
            'Accept-Encoding': 'gzip, deflate, br',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1',
            'Sec-Fetch-Dest': 'document',
            'Sec-Fetch-Mode': 'navigate',
            'Sec-Fetch-Site': 'none',
            'Cache-Control': 'max-age=0'
        }
    
    def validate_cookie(self, cookie_string: str) -> bool:
        """验证cookie格式"""
        if not cookie_string or not isinstance(cookie_string, str):
            return False
        
        # 检查基本格式
        if '=' not in cookie_string:
            return False
        
        # 检查必要字段
        required_fields = ['web_session', 'xsecappid']
        for field in required_fields:
            if field not in cookie_string:
                print(f"⚠️ Cookie缺少必要字段: {field}")
                return False
        
        return True
    
    def parse_cookie(self, cookie_string: str) -> Dict[str, str]:
        """解析cookie字符串为字典"""
        cookie_dict = {}
        
        # 分割cookie项
        items = cookie_string.split(';')
        
        for item in items:
            item = item.strip()
            if '=' in item:
                key, value = item.split('=', 1)
                cookie_dict[key.strip()] = value.strip()
        
        return cookie_dict
    
    def list_cookies(self):
        """列出所有cookie"""
        if not self.cookie_data:
            print("📭 暂无cookie配置")
            return
        
        print("🍪 Cookie列表:")
        print("-" * 50)
        
        for user_id, info in self.cookie_data.items():
            created_at = datetime.fromisoformat(info['created_at'])
            last_used = info.get('last_used')
            last_used_str = datetime.fromisoformat(last_used).strftime('%Y-%m-%d %H:%M:%S') if last_used else '从未使用'
            
            print(f"用户ID: {user_id}")
            print(f"创建时间: {created_at.strftime('%Y-%m-%d %H:%M:%S')}")
            print(f"最后使用: {last_used_str}")
            print(f"状态: {'✅ 有效' if info.get('is_valid', True) else '❌ 无效'}")
            print(f"包含字段: {len(info.get('cookie_dict', {}))}")
            print("-" * 30)
    
    def remove_cookie(self, user_id: str = "default"):
        """删除cookie"""
        if user_id in self.cookie_data:
            del self.cookie_data[user_id]
            self.save_config()
            print(f"✅ 已删除用户 {user_id} 的cookie")
        else:
            print(f"⚠️ 未找到用户 {user_id} 的cookie")
    
    def test_cookie(self, user_id: str = "default") -> bool:
        """测试cookie是否有效"""
        try:
            import requests
            
            headers = self.get_headers(user_id)
            
            # 测试请求小红书首页
            response = requests.get('https://www.xiaohongshu.com', 
                                  headers=headers, 
                                  timeout=10)
            
            if response.status_code == 200:
                print(f"✅ Cookie测试成功 (用户: {user_id})")
                return True
            else:
                print(f"❌ Cookie测试失败，状态码: {response.status_code}")
                return False
                
        except Exception as e:
            print(f"❌ Cookie测试失败: {e}")
            return False

def main():
    """主函数 - 命令行工具"""
    import sys
    
    cookie_manager = CookieManager()
    
    if len(sys.argv) < 2:
        print("🍪 小红书Cookie管理工具")
        print("使用方法:")
        print("  python cookie_config.py set <cookie_string> [user_id]")
        print("  python cookie_config.py get [user_id]")
        print("  python cookie_config.py list")
        print("  python cookie_config.py test [user_id]")
        print("  python cookie_config.py remove [user_id]")
        return
    
    command = sys.argv[1]
    
    if command == 'set':
        if len(sys.argv) < 3:
            print("❌ 请提供cookie字符串")
            return
        
        cookie_string = sys.argv[2]
        user_id = sys.argv[3] if len(sys.argv) > 3 else "default"
        
        try:
            cookie_manager.set_cookie(cookie_string, user_id)
        except ValueError as e:
            print(f"❌ {e}")
    
    elif command == 'get':
        user_id = sys.argv[2] if len(sys.argv) > 2 else "default"
        cookie = cookie_manager.get_cookie(user_id)
        
        if cookie:
            print(f"🍪 Cookie (用户: {user_id}):")
            print(cookie)
        else:
            print(f"❌ 未找到用户 {user_id} 的cookie")
    
    elif command == 'list':
        cookie_manager.list_cookies()
    
    elif command == 'test':
        user_id = sys.argv[2] if len(sys.argv) > 2 else "default"
        cookie_manager.test_cookie(user_id)
    
    elif command == 'remove':
        user_id = sys.argv[2] if len(sys.argv) > 2 else "default"
        cookie_manager.remove_cookie(user_id)
    
    else:
        print(f"❌ 未知命令: {command}")

if __name__ == "__main__":
    main()
