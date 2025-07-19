# 🍪 Cookie使用指南

## 📋 概述

本指南详细说明如何在小红书趋势分析器项目中使用Cookie进行数据获取和API调用。

## 🔧 Cookie在项目中的应用

### 数据获取流程
1. **用户认证**: 使用Cookie验证用户身份
2. **API调用**: 在请求头中携带Cookie
3. **数据解析**: 处理返回的JSON数据
4. **错误处理**: 处理Cookie失效等异常情况

### 支持的API端点
- 用户信息获取
- 笔记内容抓取
- 话题趋势分析
- 用户行为数据
- 地域分布统计

## 💻 代码实现

### Python实现

#### 基础请求类
```python
import requests
import json
import time
from typing import Dict, Any, Optional

class XiaohongshuAPI:
    def __init__(self, config_path: str = 'config/cookie_config.json'):
        self.config = self._load_config(config_path)
        self.session = requests.Session()
        self._setup_session()
    
    def _load_config(self, config_path: str) -> Dict[str, Any]:
        """加载Cookie配置"""
        with open(config_path, 'r', encoding='utf-8') as f:
            return json.load(f)
    
    def _setup_session(self):
        """设置请求会话"""
        headers = {
            'Cookie': self.config['xiaohongshu']['cookie'],
            'User-Agent': self.config['xiaohongshu']['userAgent'],
            'Referer': self.config['xiaohongshu']['referer'],
            'Origin': self.config['xiaohongshu']['origin'],
            'Accept': 'application/json, text/plain, */*',
            'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
            'Accept-Encoding': 'gzip, deflate, br',
            'Connection': 'keep-alive',
            'Sec-Fetch-Dest': 'empty',
            'Sec-Fetch-Mode': 'cors',
            'Sec-Fetch-Site': 'same-origin'
        }
        self.session.headers.update(headers)
    
    def make_request(self, url: str, method: str = 'GET', **kwargs) -> Optional[Dict[str, Any]]:
        """发起API请求"""
        try:
            response = self.session.request(method, url, **kwargs)
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            print(f"请求失败: {e}")
            return None
        except json.JSONDecodeError as e:
            print(f"JSON解析失败: {e}")
            return None
```

#### 具体API调用
```python
class TrendAnalyzer(XiaohongshuAPI):
    def get_trending_topics(self, limit: int = 20) -> Optional[Dict[str, Any]]:
        """获取热门话题"""
        url = "https://www.xiaohongshu.com/api/sns/web/v1/search/trending"
        params = {'limit': limit}
        return self.make_request(url, params=params)
    
    def get_user_notes(self, user_id: str, cursor: str = '') -> Optional[Dict[str, Any]]:
        """获取用户笔记"""
        url = f"https://www.xiaohongshu.com/api/sns/web/v1/user/{user_id}/notes"
        params = {'cursor': cursor, 'num': 30}
        return self.make_request(url, params=params)
    
    def search_notes(self, keyword: str, page: int = 1) -> Optional[Dict[str, Any]]:
        """搜索笔记"""
        url = "https://www.xiaohongshu.com/api/sns/web/v1/search/notes"
        params = {
            'keyword': keyword,
            'page': page,
            'page_size': 20,
            'search_id': int(time.time() * 1000)
        }
        return self.make_request(url, params=params)
```

### JavaScript/TypeScript实现

#### API服务类
```typescript
interface CookieConfig {
  xiaohongshu: {
    cookie: string;
    userAgent: string;
    referer: string;
    origin: string;
  };
}

class XiaohongshuService {
  private config: CookieConfig;
  private baseURL = 'https://www.xiaohongshu.com/api/sns/web/v1';

  constructor(config: CookieConfig) {
    this.config = config;
  }

  private getHeaders(): HeadersInit {
    return {
      'Cookie': this.config.xiaohongshu.cookie,
      'User-Agent': this.config.xiaohongshu.userAgent,
      'Referer': this.config.xiaohongshu.referer,
      'Origin': this.config.xiaohongshu.origin,
      'Accept': 'application/json, text/plain, */*',
      'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
      'Content-Type': 'application/json'
    };
  }

  async makeRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T | null> {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        ...options,
        headers: {
          ...this.getHeaders(),
          ...options.headers
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API请求失败:', error);
      return null;
    }
  }

  async getTrendingTopics(limit: number = 20) {
    return this.makeRequest(`/search/trending?limit=${limit}`);
  }

  async searchNotes(keyword: string, page: number = 1) {
    const searchId = Date.now();
    return this.makeRequest(
      `/search/notes?keyword=${encodeURIComponent(keyword)}&page=${page}&page_size=20&search_id=${searchId}`
    );
  }
}
```

## 🔄 Cookie管理

### 自动刷新机制
```python
class CookieManager:
    def __init__(self, config_path: str):
        self.config_path = config_path
        self.last_check = 0
        self.check_interval = 3600  # 1小时检查一次
    
    def is_cookie_valid(self) -> bool:
        """检查Cookie是否有效"""
        api = XiaohongshuAPI(self.config_path)
        test_url = "https://www.xiaohongshu.com/api/sns/web/v1/user/otherinfo"
        response = api.make_request(test_url)
        return response is not None and 'code' in response and response['code'] == 0
    
    def should_check_cookie(self) -> bool:
        """是否需要检查Cookie"""
        current_time = time.time()
        return current_time - self.last_check > self.check_interval
    
    def check_and_notify(self):
        """检查Cookie并通知"""
        if self.should_check_cookie():
            if not self.is_cookie_valid():
                print("⚠️ Cookie已失效，请更新配置")
                # 这里可以添加邮件通知或其他提醒机制
            self.last_check = time.time()
```

### 错误处理和重试
```python
import time
from functools import wraps

def retry_on_failure(max_retries: int = 3, delay: float = 1.0):
    """重试装饰器"""
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            for attempt in range(max_retries):
                try:
                    result = func(*args, **kwargs)
                    if result is not None:
                        return result
                except Exception as e:
                    print(f"第{attempt + 1}次尝试失败: {e}")
                
                if attempt < max_retries - 1:
                    time.sleep(delay * (2 ** attempt))  # 指数退避
            
            print(f"所有重试都失败了，放弃执行 {func.__name__}")
            return None
        return wrapper
    return decorator

class RobustXiaohongshuAPI(XiaohongshuAPI):
    @retry_on_failure(max_retries=3, delay=1.0)
    def get_trending_topics(self, limit: int = 20):
        return super().make_request(
            "https://www.xiaohongshu.com/api/sns/web/v1/search/trending",
            params={'limit': limit}
        )
```

## 📊 数据处理

### 响应数据结构
```python
from dataclasses import dataclass
from typing import List, Optional

@dataclass
class Note:
    id: str
    title: str
    content: str
    author_id: str
    author_name: str
    like_count: int
    comment_count: int
    share_count: int
    create_time: str
    tags: List[str]
    location: Optional[str] = None

@dataclass
class TrendingTopic:
    keyword: str
    heat_score: int
    note_count: int
    trend_type: str
    related_keywords: List[str]

class DataProcessor:
    @staticmethod
    def parse_note(raw_note: Dict[str, Any]) -> Note:
        """解析笔记数据"""
        return Note(
            id=raw_note.get('id', ''),
            title=raw_note.get('title', ''),
            content=raw_note.get('desc', ''),
            author_id=raw_note.get('user', {}).get('user_id', ''),
            author_name=raw_note.get('user', {}).get('nickname', ''),
            like_count=raw_note.get('interact_info', {}).get('liked_count', 0),
            comment_count=raw_note.get('interact_info', {}).get('comment_count', 0),
            share_count=raw_note.get('interact_info', {}).get('share_count', 0),
            create_time=raw_note.get('time', ''),
            tags=[tag.get('name', '') for tag in raw_note.get('tag_list', [])],
            location=raw_note.get('ip_location', '')
        )
    
    @staticmethod
    def parse_trending_topics(raw_data: Dict[str, Any]) -> List[TrendingTopic]:
        """解析热门话题数据"""
        topics = []
        for item in raw_data.get('items', []):
            topic = TrendingTopic(
                keyword=item.get('keyword', ''),
                heat_score=item.get('heat_score', 0),
                note_count=item.get('note_count', 0),
                trend_type=item.get('trend_type', ''),
                related_keywords=item.get('related_keywords', [])
            )
            topics.append(topic)
        return topics
```

## 🔒 安全最佳实践

### 环境变量配置
```python
import os
from dotenv import load_dotenv

load_dotenv()

class SecureCookieManager:
    def __init__(self):
        self.cookie = os.getenv('XIAOHONGSHU_COOKIE')
        self.user_agent = os.getenv('XIAOHONGSHU_USER_AGENT')
        
        if not self.cookie:
            raise ValueError("未找到XIAOHONGSHU_COOKIE环境变量")
    
    def get_headers(self) -> Dict[str, str]:
        return {
            'Cookie': self.cookie,
            'User-Agent': self.user_agent or 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
```

### 日志记录
```python
import logging

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('xiaohongshu_api.log'),
        logging.StreamHandler()
    ]
)

logger = logging.getLogger(__name__)

class LoggedXiaohongshuAPI(XiaohongshuAPI):
    def make_request(self, url: str, method: str = 'GET', **kwargs):
        logger.info(f"发起请求: {method} {url}")
        result = super().make_request(url, method, **kwargs)
        
        if result:
            logger.info(f"请求成功: {url}")
        else:
            logger.error(f"请求失败: {url}")
        
        return result
```

## 📈 性能优化

### 请求频率控制
```python
import time
from threading import Lock

class RateLimiter:
    def __init__(self, max_requests: int = 10, time_window: int = 60):
        self.max_requests = max_requests
        self.time_window = time_window
        self.requests = []
        self.lock = Lock()
    
    def wait_if_needed(self):
        with self.lock:
            now = time.time()
            # 清理过期的请求记录
            self.requests = [req_time for req_time in self.requests if now - req_time < self.time_window]
            
            if len(self.requests) >= self.max_requests:
                sleep_time = self.time_window - (now - self.requests[0])
                if sleep_time > 0:
                    time.sleep(sleep_time)
            
            self.requests.append(now)

class ThrottledXiaohongshuAPI(XiaohongshuAPI):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.rate_limiter = RateLimiter(max_requests=10, time_window=60)
    
    def make_request(self, url: str, method: str = 'GET', **kwargs):
        self.rate_limiter.wait_if_needed()
        return super().make_request(url, method, **kwargs)
```

通过以上指南，您可以在项目中有效地使用Cookie进行小红书数据获取和分析。
