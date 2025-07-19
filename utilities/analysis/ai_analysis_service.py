#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
AI分析服务 - 智能数据分析和处理
"""

import re
import json
import math
import random
from datetime import datetime, timedelta
from typing import List, Dict, Any, Tuple
from collections import Counter, defaultdict

class AIAnalysisService:
    def __init__(self):
        """初始化AI分析服务"""
        # 情感词典
        self.positive_words = {
            '好', '棒', '赞', '喜欢', '爱', '美', '漂亮', '完美', '优秀', '推荐',
            '值得', '满意', '惊艳', '心动', '种草', '必买', '神仙', '绝了', '爱了',
            '太好了', '超级', '非常', '特别', '真的', '确实', '效果好', '质量好'
        }
        
        self.negative_words = {
            '差', '坏', '烂', '难用', '不好', '失望', '后悔', '踩雷', '不推荐',
            '浪费', '骗人', '假的', '劣质', '糟糕', '恶心', '讨厌', '垃圾',
            '不值', '坑', '翻车', '避雷', '慎买', '别买', '退货', '投诉'
        }
        
        # 分类关键词
        self.category_keywords = {
            '美妆': ['口红', '粉底', '眼影', '睫毛膏', '腮红', '化妆', '彩妆', '美妆', '护肤品'],
            '护肤': ['面膜', '精华', '乳液', '洁面', '防晒', '护肤', '保养', '抗老', '补水'],
            '穿搭': ['穿搭', '搭配', '衣服', '裙子', '外套', '鞋子', '包包', '时尚', '风格'],
            '美食': ['美食', '食谱', '烘焙', '餐厅', '小吃', '甜品', '料理', '做饭', '好吃'],
            '旅行': ['旅行', '旅游', '攻略', '景点', '酒店', '机票', '签证', '游记', '打卡'],
            '健身': ['健身', '运动', '瑜伽', '减肥', '塑形', '锻炼', '跑步', '健康', '体重'],
            '数码': ['手机', '电脑', '相机', '耳机', '数码', '科技', '测评', '开箱', '配置'],
            '家居': ['家居', '装修', '收纳', '家具', '装饰', '清洁', '整理', '布置', '设计']
        }
        
    def analyze_sentiment(self, text: str) -> Dict[str, Any]:
        """情感分析"""
        if not text:
            return {'sentiment': 'neutral', 'score': 0.5, 'confidence': 0.0}
        
        text = text.lower()
        
        # 计算正负面词汇数量
        positive_count = sum(1 for word in self.positive_words if word in text)
        negative_count = sum(1 for word in self.negative_words if word in text)
        
        # 计算情感分数
        total_words = len(text.split())
        if total_words == 0:
            return {'sentiment': 'neutral', 'score': 0.5, 'confidence': 0.0}
        
        positive_ratio = positive_count / total_words
        negative_ratio = negative_count / total_words
        
        # 确定情感倾向
        if positive_ratio > negative_ratio:
            sentiment = 'positive'
            score = 0.5 + min(0.5, positive_ratio * 10)
        elif negative_ratio > positive_ratio:
            sentiment = 'negative'
            score = 0.5 - min(0.5, negative_ratio * 10)
        else:
            sentiment = 'neutral'
            score = 0.5
        
        # 计算置信度
        confidence = min(1.0, (positive_count + negative_count) / max(1, total_words) * 5)
        
        return {
            'sentiment': sentiment,
            'score': score,
            'confidence': confidence,
            'positive_words': positive_count,
            'negative_words': negative_count
        }
    
    def classify_content(self, text: str) -> Dict[str, Any]:
        """内容分类"""
        if not text:
            return {'category': '其他', 'confidence': 0.0, 'keywords': []}
        
        text = text.lower()
        category_scores = {}
        matched_keywords = {}
        
        # 计算每个分类的匹配分数
        for category, keywords in self.category_keywords.items():
            score = 0
            matched = []
            for keyword in keywords:
                if keyword in text:
                    score += 1
                    matched.append(keyword)
            
            if score > 0:
                category_scores[category] = score
                matched_keywords[category] = matched
        
        # 确定最佳分类
        if not category_scores:
            return {'category': '其他', 'confidence': 0.0, 'keywords': []}
        
        best_category = max(category_scores.items(), key=lambda x: x[1])
        confidence = min(1.0, best_category[1] / 3)  # 最多3个关键词匹配为满分
        
        return {
            'category': best_category[0],
            'confidence': confidence,
            'keywords': matched_keywords.get(best_category[0], []),
            'all_scores': category_scores
        }
    
    def calculate_engagement_score(self, data: Dict[str, Any]) -> float:
        """计算参与度分数"""
        like_count = data.get('like_count', 0)
        comment_count = data.get('comment_count', 0)
        share_count = data.get('share_count', 0)
        view_count = data.get('view_count', 0)
        
        # 加权计算参与度
        engagement = (
            like_count * 1.0 +
            comment_count * 2.0 +  # 评论权重更高
            share_count * 3.0 +    # 分享权重最高
            view_count * 0.1       # 浏览量权重较低
        )
        
        # 归一化到0-100分
        score = min(100, math.log10(max(1, engagement)) * 20)
        
        return round(score, 2)
    
    def extract_keywords(self, texts: List[str], top_k: int = 20) -> List[Dict[str, Any]]:
        """提取关键词"""
        if not texts:
            return []
        
        # 简单的词频统计
        word_counts = Counter()
        
        for text in texts:
            if not text:
                continue
            
            # 简单的中文分词（基于常见分隔符）
            words = re.findall(r'[\u4e00-\u9fff]+', text)
            
            # 过滤停用词和短词
            stop_words = {'的', '了', '是', '在', '有', '和', '就', '不', '人', '都', '一', '我', '你', '他', '她', '它'}
            filtered_words = [word for word in words if len(word) >= 2 and word not in stop_words]
            
            word_counts.update(filtered_words)
        
        # 转换为结果格式
        keywords = []
        for word, count in word_counts.most_common(top_k):
            keywords.append({
                'keyword': word,
                'frequency': count,
                'weight': round(count / max(1, len(texts)), 3)
            })
        
        return keywords
    
    def analyze_user_behavior(self, notes: List[Dict[str, Any]]) -> Dict[str, Any]:
        """用户行为分析"""
        if not notes:
            return {}
        
        # 统计用户活跃时间
        hour_distribution = defaultdict(int)
        category_preferences = defaultdict(int)
        engagement_levels = {'high': 0, 'medium': 0, 'low': 0}
        sentiment_distribution = {'positive': 0, 'negative': 0, 'neutral': 0}
        
        for note in notes:
            # 时间分析
            try:
                publish_time = datetime.fromisoformat(note.get('publish_time', ''))
                hour_distribution[publish_time.hour] += 1
            except:
                pass
            
            # 分类偏好
            category = note.get('category', '其他')
            category_preferences[category] += 1
            
            # 参与度分析
            engagement = self.calculate_engagement_score(note)
            if engagement >= 70:
                engagement_levels['high'] += 1
            elif engagement >= 40:
                engagement_levels['medium'] += 1
            else:
                engagement_levels['low'] += 1
            
            # 情感分析
            content = note.get('content', '') + ' ' + note.get('title', '')
            sentiment = self.analyze_sentiment(content)
            sentiment_distribution[sentiment['sentiment']] += 1
        
        # 找出最活跃时间段
        peak_hours = sorted(hour_distribution.items(), key=lambda x: x[1], reverse=True)[:3]
        
        return {
            'total_notes': len(notes),
            'peak_hours': [{'hour': h, 'count': c} for h, c in peak_hours],
            'category_preferences': dict(category_preferences),
            'engagement_levels': dict(engagement_levels),
            'sentiment_distribution': dict(sentiment_distribution),
            'avg_engagement': round(sum(self.calculate_engagement_score(note) for note in notes) / len(notes), 2)
        }
    
    def predict_trend(self, historical_data: List[Dict[str, Any]], days_ahead: int = 7) -> Dict[str, Any]:
        """趋势预测"""
        if not historical_data:
            return {}
        
        # 按时间排序
        sorted_data = sorted(historical_data, key=lambda x: x.get('publish_time', ''))
        
        # 简单的线性趋势预测
        daily_stats = defaultdict(lambda: {'count': 0, 'engagement': 0})
        
        for item in sorted_data:
            try:
                date = datetime.fromisoformat(item.get('publish_time', '')).date()
                daily_stats[date]['count'] += 1
                daily_stats[date]['engagement'] += self.calculate_engagement_score(item)
            except:
                continue
        
        # 计算平均值
        for date, stats in daily_stats.items():
            if stats['count'] > 0:
                stats['avg_engagement'] = stats['engagement'] / stats['count']
        
        # 预测未来趋势
        if len(daily_stats) < 2:
            return {'prediction': 'insufficient_data'}
        
        recent_days = list(sorted(daily_stats.keys()))[-7:]  # 最近7天
        
        # 计算增长率
        if len(recent_days) >= 2:
            early_avg = sum(daily_stats[day]['count'] for day in recent_days[:3]) / 3
            late_avg = sum(daily_stats[day]['count'] for day in recent_days[-3:]) / 3
            
            growth_rate = (late_avg - early_avg) / max(1, early_avg)
            
            if growth_rate > 0.1:
                trend = 'increasing'
            elif growth_rate < -0.1:
                trend = 'decreasing'
            else:
                trend = 'stable'
        else:
            trend = 'stable'
            growth_rate = 0
        
        return {
            'trend': trend,
            'growth_rate': round(growth_rate * 100, 2),
            'confidence': min(1.0, len(recent_days) / 7),
            'prediction_days': days_ahead,
            'daily_stats': {str(k): v for k, v in daily_stats.items()}
        }
    
    def generate_insights(self, notes: List[Dict[str, Any]]) -> Dict[str, Any]:
        """生成智能洞察"""
        if not notes:
            return {}
        
        # 综合分析
        user_behavior = self.analyze_user_behavior(notes)
        trend_prediction = self.predict_trend(notes)
        
        # 提取内容关键词
        all_content = [note.get('content', '') + ' ' + note.get('title', '') for note in notes]
        keywords = self.extract_keywords(all_content, top_k=10)
        
        # 生成洞察
        insights = []
        
        # 分类洞察
        if user_behavior.get('category_preferences'):
            top_category = max(user_behavior['category_preferences'].items(), key=lambda x: x[1])
            insights.append(f"最受欢迎的内容类别是{top_category[0]}，占比{round(top_category[1]/len(notes)*100, 1)}%")
        
        # 参与度洞察
        if user_behavior.get('engagement_levels'):
            high_engagement = user_behavior['engagement_levels'].get('high', 0)
            if high_engagement > len(notes) * 0.3:
                insights.append(f"内容质量较高，{round(high_engagement/len(notes)*100, 1)}%的内容获得了高参与度")
        
        # 情感洞察
        if user_behavior.get('sentiment_distribution'):
            positive_ratio = user_behavior['sentiment_distribution'].get('positive', 0) / len(notes)
            if positive_ratio > 0.6:
                insights.append(f"用户反馈积极，{round(positive_ratio*100, 1)}%的内容情感倾向为正面")
        
        # 趋势洞察
        if trend_prediction.get('trend'):
            trend = trend_prediction['trend']
            if trend == 'increasing':
                insights.append(f"内容热度呈上升趋势，增长率为{trend_prediction.get('growth_rate', 0)}%")
            elif trend == 'decreasing':
                insights.append(f"内容热度呈下降趋势，需要关注内容质量")
        
        return {
            'insights': insights,
            'keywords': keywords,
            'user_behavior': user_behavior,
            'trend_prediction': trend_prediction,
            'analysis_time': datetime.now().isoformat()
        }

# 全局AI分析服务实例
ai_service = AIAnalysisService()

def main():
    """测试AI分析服务"""
    print("🤖 测试AI分析服务...")
    
    # 测试数据
    test_notes = [
        {
            'title': '这款口红真的太好看了！',
            'content': '颜色超级美，质地也很好，强烈推荐给大家！',
            'category': '美妆',
            'like_count': 150,
            'comment_count': 20,
            'share_count': 5,
            'view_count': 1000,
            'publish_time': datetime.now().isoformat()
        },
        {
            'title': '穿搭分享',
            'content': '今天的搭配很满意，简约又时尚',
            'category': '穿搭',
            'like_count': 80,
            'comment_count': 10,
            'share_count': 2,
            'view_count': 500,
            'publish_time': (datetime.now() - timedelta(hours=2)).isoformat()
        }
    ]
    
    # 测试各项功能
    print("\n📊 情感分析测试:")
    sentiment = ai_service.analyze_sentiment("这款产品真的太好用了，强烈推荐！")
    print(f"   结果: {sentiment}")
    
    print("\n🏷️ 内容分类测试:")
    classification = ai_service.classify_content("这款口红颜色很美，质地也不错")
    print(f"   结果: {classification}")
    
    print("\n📈 参与度分析测试:")
    engagement = ai_service.calculate_engagement_score(test_notes[0])
    print(f"   参与度分数: {engagement}")
    
    print("\n🔍 关键词提取测试:")
    keywords = ai_service.extract_keywords([note['content'] for note in test_notes])
    print(f"   关键词: {keywords[:5]}")
    
    print("\n🧠 智能洞察测试:")
    insights = ai_service.generate_insights(test_notes)
    print(f"   洞察: {insights['insights']}")
    
    print("\n✅ AI分析服务测试完成！")

if __name__ == "__main__":
    main()
