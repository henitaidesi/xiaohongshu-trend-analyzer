#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
数据库管理器 - 支持MongoDB存储
"""

import json
import os
import asyncio
from datetime import datetime, timedelta
from typing import List, Dict, Any, Optional
import logging

try:
    import pymongo
    from pymongo import MongoClient
    import motor.motor_asyncio
    MONGODB_AVAILABLE = True
except ImportError:
    print("⚠️ MongoDB库未安装，请运行: pip install pymongo motor")
    MONGODB_AVAILABLE = False

# 配置日志
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class DatabaseManager:
    def __init__(self, connection_string: str = "mongodb://localhost:27017/", db_name: str = "xiaohongshu_data"):
        """
        初始化数据库管理器
        
        Args:
            connection_string: MongoDB连接字符串
            db_name: 数据库名称
        """
        self.connection_string = connection_string
        self.db_name = db_name
        self.client = None
        self.db = None
        self.async_client = None
        self.async_db = None
        self.connected = False
        
        # 集合名称
        self.collections = {
            'notes': 'xhs_notes',
            'keywords': 'trending_keywords', 
            'users': 'user_profiles',
            'trends': 'trend_analysis',
            'crawl_logs': 'crawl_logs'
        }
        
    def connect(self) -> bool:
        """连接到MongoDB"""
        if not MONGODB_AVAILABLE:
            logger.warning("MongoDB不可用，将使用文件存储")
            return False
            
        try:
            # 同步客户端
            self.client = MongoClient(self.connection_string, serverSelectionTimeoutMS=5000)
            self.db = self.client[self.db_name]
            
            # 测试连接
            self.client.admin.command('ping')
            
            # 异步客户端
            self.async_client = motor.motor_asyncio.AsyncIOMotorClient(self.connection_string)
            self.async_db = self.async_client[self.db_name]
            
            self.connected = True
            logger.info(f"✅ 成功连接到MongoDB: {self.db_name}")
            
            # 创建索引
            self._create_indexes()
            
            return True
            
        except Exception as e:
            logger.error(f"❌ MongoDB连接失败: {e}")
            self.connected = False
            return False
    
    def _create_indexes(self):
        """创建数据库索引"""
        try:
            # 笔记集合索引
            notes_collection = self.db[self.collections['notes']]
            notes_collection.create_index("note_id", unique=True)
            notes_collection.create_index("author_id")
            notes_collection.create_index("category")
            notes_collection.create_index("publish_time")
            notes_collection.create_index("crawl_time")
            
            # 关键词集合索引
            keywords_collection = self.db[self.collections['keywords']]
            keywords_collection.create_index("keyword", unique=True)
            keywords_collection.create_index("heat")
            
            # 爬取日志索引
            logs_collection = self.db[self.collections['crawl_logs']]
            logs_collection.create_index("timestamp")
            logs_collection.create_index("status")
            
            logger.info("✅ 数据库索引创建完成")
            
        except Exception as e:
            logger.error(f"❌ 创建索引失败: {e}")
    
    def save_notes(self, notes: List[Dict[str, Any]]) -> bool:
        """保存笔记数据"""
        if not self.connected:
            return self._save_to_file(notes, 'notes.json')
        
        try:
            collection = self.db[self.collections['notes']]
            
            # 批量插入，忽略重复
            for note in notes:
                try:
                    # 添加存储时间戳
                    note['stored_at'] = datetime.now()
                    
                    # 使用upsert避免重复
                    collection.update_one(
                        {'note_id': note.get('id', note.get('note_id'))},
                        {'$set': note},
                        upsert=True
                    )
                except Exception as e:
                    logger.warning(f"保存笔记失败: {e}")
                    continue
            
            logger.info(f"✅ 成功保存 {len(notes)} 条笔记到数据库")
            
            # 记录爬取日志
            self._log_crawl_activity('notes', len(notes), 'success')
            
            return True
            
        except Exception as e:
            logger.error(f"❌ 保存笔记失败: {e}")
            return self._save_to_file(notes, 'notes.json')
    
    def save_keywords(self, keywords: List[Dict[str, Any]]) -> bool:
        """保存关键词数据"""
        if not self.connected:
            return self._save_to_file(keywords, 'keywords.json')
        
        try:
            collection = self.db[self.collections['keywords']]
            
            # 清空旧数据（关键词数据需要保持最新）
            collection.delete_many({})
            
            # 添加时间戳
            for keyword in keywords:
                keyword['updated_at'] = datetime.now()
            
            # 批量插入
            if keywords:
                collection.insert_many(keywords)
            
            logger.info(f"✅ 成功保存 {len(keywords)} 个关键词到数据库")
            
            # 记录爬取日志
            self._log_crawl_activity('keywords', len(keywords), 'success')
            
            return True
            
        except Exception as e:
            logger.error(f"❌ 保存关键词失败: {e}")
            return self._save_to_file(keywords, 'keywords.json')
    
    def get_notes(self, limit: int = 20, category: str = None, days: int = 7) -> List[Dict[str, Any]]:
        """获取笔记数据"""
        if not self.connected:
            return self._load_from_file('notes.json', limit)
        
        try:
            collection = self.db[self.collections['notes']]
            
            # 构建查询条件
            query = {}
            
            # 按分类筛选
            if category:
                query['category'] = category
            
            # 按时间筛选（最近N天）
            if days > 0:
                since_date = datetime.now() - timedelta(days=days)
                query['crawl_time'] = {'$gte': since_date.isoformat()}
            
            # 查询并排序
            cursor = collection.find(query).sort('crawl_time', -1).limit(limit)
            notes = list(cursor)
            
            # 转换ObjectId为字符串
            for note in notes:
                if '_id' in note:
                    note['_id'] = str(note['_id'])
            
            logger.info(f"✅ 从数据库获取 {len(notes)} 条笔记")
            return notes
            
        except Exception as e:
            logger.error(f"❌ 获取笔记失败: {e}")
            return self._load_from_file('notes.json', limit)
    
    def get_keywords(self) -> List[Dict[str, Any]]:
        """获取关键词数据"""
        if not self.connected:
            return self._load_from_file('keywords.json')
        
        try:
            collection = self.db[self.collections['keywords']]
            cursor = collection.find().sort('heat', -1)
            keywords = list(cursor)
            
            # 转换ObjectId为字符串
            for keyword in keywords:
                if '_id' in keyword:
                    keyword['_id'] = str(keyword['_id'])
            
            logger.info(f"✅ 从数据库获取 {len(keywords)} 个关键词")
            return keywords
            
        except Exception as e:
            logger.error(f"❌ 获取关键词失败: {e}")
            return self._load_from_file('keywords.json')
    
    def get_statistics(self) -> Dict[str, Any]:
        """获取数据库统计信息"""
        if not self.connected:
            return self._get_file_statistics()
        
        try:
            stats = {}
            
            # 笔记统计
            notes_collection = self.db[self.collections['notes']]
            stats['total_notes'] = notes_collection.count_documents({})
            
            # 按分类统计
            pipeline = [
                {'$group': {'_id': '$category', 'count': {'$sum': 1}}},
                {'$sort': {'count': -1}}
            ]
            category_stats = list(notes_collection.aggregate(pipeline))
            stats['notes_by_category'] = {item['_id']: item['count'] for item in category_stats}
            
            # 最近7天的笔记数量
            since_date = datetime.now() - timedelta(days=7)
            recent_count = notes_collection.count_documents({
                'crawl_time': {'$gte': since_date.isoformat()}
            })
            stats['recent_notes'] = recent_count
            
            # 关键词统计
            keywords_collection = self.db[self.collections['keywords']]
            stats['total_keywords'] = keywords_collection.count_documents({})
            
            # 爬取日志统计
            logs_collection = self.db[self.collections['crawl_logs']]
            stats['total_crawls'] = logs_collection.count_documents({})
            
            logger.info("✅ 获取数据库统计信息成功")
            return stats
            
        except Exception as e:
            logger.error(f"❌ 获取统计信息失败: {e}")
            return self._get_file_statistics()
    
    def _log_crawl_activity(self, data_type: str, count: int, status: str):
        """记录爬取活动"""
        if not self.connected:
            return
        
        try:
            collection = self.db[self.collections['crawl_logs']]
            log_entry = {
                'timestamp': datetime.now(),
                'data_type': data_type,
                'count': count,
                'status': status
            }
            collection.insert_one(log_entry)
            
        except Exception as e:
            logger.warning(f"记录爬取日志失败: {e}")
    
    def _save_to_file(self, data: Any, filename: str) -> bool:
        """备用：保存到文件"""
        try:
            data_dir = os.path.join(os.path.dirname(__file__), 'data')
            os.makedirs(data_dir, exist_ok=True)
            
            filepath = os.path.join(data_dir, filename)
            with open(filepath, 'w', encoding='utf-8') as f:
                json.dump(data, f, ensure_ascii=False, indent=2, default=str)
            
            logger.info(f"💾 数据已保存到文件: {filepath}")
            return True
            
        except Exception as e:
            logger.error(f"❌ 保存到文件失败: {e}")
            return False
    
    def _load_from_file(self, filename: str, limit: int = None) -> List[Dict[str, Any]]:
        """备用：从文件加载"""
        try:
            data_dir = os.path.join(os.path.dirname(__file__), 'data')
            filepath = os.path.join(data_dir, filename)
            
            if not os.path.exists(filepath):
                return []
            
            with open(filepath, 'r', encoding='utf-8') as f:
                data = json.load(f)
            
            if isinstance(data, list) and limit:
                data = data[:limit]
            
            logger.info(f"📁 从文件加载数据: {filepath}")
            return data if isinstance(data, list) else []
            
        except Exception as e:
            logger.error(f"❌ 从文件加载失败: {e}")
            return []
    
    def _get_file_statistics(self) -> Dict[str, Any]:
        """备用：获取文件统计"""
        try:
            data_dir = os.path.join(os.path.dirname(__file__), 'data')
            stats = {}
            
            # 统计文件中的数据
            notes = self._load_from_file('notes.json')
            stats['total_notes'] = len(notes)
            
            keywords = self._load_from_file('keywords.json')
            stats['total_keywords'] = len(keywords)
            
            return stats
            
        except Exception as e:
            logger.error(f"❌ 获取文件统计失败: {e}")
            return {}
    
    def close(self):
        """关闭数据库连接"""
        if self.client:
            self.client.close()
        if self.async_client:
            self.async_client.close()
        
        logger.info("🔒 数据库连接已关闭")

# 全局数据库管理器实例
db_manager = DatabaseManager()

def main():
    """测试数据库功能"""
    print("🚀 测试数据库管理器...")
    
    # 尝试连接数据库
    if db_manager.connect():
        print("✅ 数据库连接成功")
        
        # 测试保存数据
        test_notes = [
            {
                'id': 'test_001',
                'title': '测试笔记1',
                'content': '这是一个测试笔记',
                'author': '测试用户',
                'category': '测试',
                'crawl_time': datetime.now().isoformat()
            }
        ]
        
        db_manager.save_notes(test_notes)
        
        # 测试获取数据
        notes = db_manager.get_notes(limit=5)
        print(f"📊 获取到 {len(notes)} 条笔记")
        
        # 获取统计信息
        stats = db_manager.get_statistics()
        print(f"📈 数据库统计: {stats}")
        
    else:
        print("⚠️ 数据库连接失败，使用文件存储")
    
    db_manager.close()

if __name__ == "__main__":
    main()
