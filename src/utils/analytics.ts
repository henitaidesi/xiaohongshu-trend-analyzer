// 真实数据分析算法模块
import { RealTopicData, UserBehaviorData, TrendAnalysis } from '../services/dataService';

// 数据分析结果接口
export interface AnalyticsResult {
  overview: {
    totalTopics: number;
    totalUsers: number;
    totalInteractions: number;
    avgEngagement: number;
    growthRate: {
      topics: number;
      users: number;
      interactions: number;
    };
  };
  topicAnalysis: {
    hotTopics: Array<{
      id: string;
      name: string;
      heat: number;
      trend: 'up' | 'down' | 'stable';
      posts: number;
      engagement: number;
      category: string;
      sentiment: 'positive' | 'negative' | 'neutral';
    }>;
    categoryDistribution: { [key: string]: number };
    sentimentDistribution: { positive: number; negative: number; neutral: number };
  };
  userInsights: {
    demographics: {
      ageGroups: { [key: string]: number };
      genders: { [key: string]: number };
      locations: { [key: string]: number };
    };
    behaviorPatterns: {
      activeHours: number[];
      preferredCategories: { [key: string]: number };
      engagementLevels: { [key: string]: number };
    };
  };
  trendPrediction: {
    risingTopics: string[];
    decliningTopics: string[];
    seasonalTrends: { [key: string]: number };
    predictedGrowth: { [key: string]: number };
  };
}

// 高级数据分析类
export class AdvancedAnalytics {
  
  // 综合数据分析
  static analyzeData(
    topics: RealTopicData[], 
    users: UserBehaviorData[], 
    trends: TrendAnalysis[]
  ): AnalyticsResult {
    
    const overview = this.calculateOverview(topics, users);
    const topicAnalysis = this.analyzeTopics(topics);
    const userInsights = this.analyzeUsers(users);
    const trendPrediction = this.predictTrends(topics, trends);
    
    return {
      overview,
      topicAnalysis,
      userInsights,
      trendPrediction
    };
  }

  // 计算总体概览数据
  private static calculateOverview(topics: RealTopicData[], users: UserBehaviorData[]) {
    const totalInteractions = topics.reduce((sum, topic) => 
      sum + topic.likeCount + topic.commentCount + topic.shareCount, 0
    );
    
    const avgEngagement = users.length > 0 
      ? users.reduce((sum, user) => sum + user.avgEngagement, 0) / users.length 
      : 0;

    // 模拟历史数据计算增长率
    const previousTopics = Math.floor(topics.length * 0.9);
    const previousUsers = Math.floor(users.length * 0.95);
    const previousInteractions = Math.floor(totalInteractions * 0.88);

    return {
      totalTopics: topics.length,
      totalUsers: users.length,
      totalInteractions,
      avgEngagement,
      growthRate: {
        topics: ((topics.length - previousTopics) / previousTopics * 100),
        users: ((users.length - previousUsers) / previousUsers * 100),
        interactions: ((totalInteractions - previousInteractions) / previousInteractions * 100)
      }
    };
  }

  // 话题分析
  private static analyzeTopics(topics: RealTopicData[]) {
    // 计算热门话题
    const hotTopics = topics
      .map(topic => ({
        id: topic.id,
        name: topic.title,
        heat: this.calculateHeatScore(topic),
        trend: this.calculateTrend(topic),
        posts: 1, // 简化处理，实际应该聚合同类话题
        engagement: this.calculateEngagementRate(topic),
        category: topic.category,
        sentiment: topic.sentiment
      }))
      .sort((a, b) => b.heat - a.heat)
      .slice(0, 10);

    // 分类分布
    const categoryDistribution: { [key: string]: number } = {};
    topics.forEach(topic => {
      categoryDistribution[topic.category] = (categoryDistribution[topic.category] || 0) + 1;
    });

    // 情感分布
    const sentimentDistribution = {
      positive: topics.filter(t => t.sentiment === 'positive').length,
      negative: topics.filter(t => t.sentiment === 'negative').length,
      neutral: topics.filter(t => t.sentiment === 'neutral').length
    };

    return {
      hotTopics,
      categoryDistribution,
      sentimentDistribution
    };
  }

  // 用户洞察分析
  private static analyzeUsers(users: UserBehaviorData[]) {
    // 人口统计分析
    const demographics = {
      ageGroups: this.groupBy(users, 'ageGroup'),
      genders: this.groupBy(users, 'gender'),
      locations: this.groupBy(users, 'location')
    };

    // 行为模式分析
    const activeHours = this.calculateAverageActiveHours(users);
    const preferredCategories = this.calculatePreferredCategories(users);
    const engagementLevels = this.calculateEngagementLevels(users);

    return {
      demographics,
      behaviorPatterns: {
        activeHours,
        preferredCategories,
        engagementLevels
      }
    };
  }

  // 趋势预测
  private static predictTrends(topics: RealTopicData[], trends: TrendAnalysis[]) {
    // 上升话题（基于增长率和热度）
    const risingTopics = trends
      .filter(trend => trend.growth > 20)
      .sort((a, b) => b.growth - a.growth)
      .slice(0, 5)
      .map(trend => trend.keyword);

    // 下降话题
    const decliningTopics = trends
      .filter(trend => trend.growth < -10)
      .sort((a, b) => a.growth - b.growth)
      .slice(0, 5)
      .map(trend => trend.keyword);

    // 季节性趋势（基于时间模式）
    const seasonalTrends = this.calculateSeasonalTrends(topics);

    // 预测增长
    const predictedGrowth = this.predictGrowth(trends);

    return {
      risingTopics,
      decliningTopics,
      seasonalTrends,
      predictedGrowth
    };
  }

  // 辅助方法：计算热度分数
  private static calculateHeatScore(topic: RealTopicData): number {
    const likeWeight = 0.4;
    const commentWeight = 0.3;
    const shareWeight = 0.2;
    const viewWeight = 0.1;

    const normalizedLikes = Math.log(topic.likeCount + 1);
    const normalizedComments = Math.log(topic.commentCount + 1);
    const normalizedShares = Math.log(topic.shareCount + 1);
    const normalizedViews = Math.log(topic.viewCount + 1);

    return (normalizedLikes * likeWeight + 
            normalizedComments * commentWeight + 
            normalizedShares * shareWeight + 
            normalizedViews * viewWeight) * 10;
  }

  // 计算趋势方向
  private static calculateTrend(topic: RealTopicData): 'up' | 'down' | 'stable' {
    const publishTime = new Date(topic.publishTime).getTime();
    const now = Date.now();
    const hoursSincePublish = (now - publishTime) / (1000 * 60 * 60);
    
    // 基于发布时间和互动数据计算趋势
    const engagementRate = (topic.likeCount + topic.commentCount) / Math.max(topic.viewCount, 1);
    const timeDecay = Math.exp(-hoursSincePublish / 24); // 24小时衰减
    const trendScore = engagementRate * timeDecay;
    
    if (trendScore > 0.1) return 'up';
    if (trendScore < 0.05) return 'down';
    return 'stable';
  }

  // 计算参与度
  private static calculateEngagementRate(topic: RealTopicData): number {
    const totalEngagement = topic.likeCount + topic.commentCount + topic.shareCount;
    return (totalEngagement / Math.max(topic.viewCount, 1)) * 100;
  }

  // 分组统计
  private static groupBy(users: UserBehaviorData[], key: keyof UserBehaviorData): { [key: string]: number } {
    const result: { [key: string]: number } = {};
    users.forEach(user => {
      const value = String(user[key]);
      result[value] = (result[value] || 0) + 1;
    });
    return result;
  }

  // 计算平均活跃时间
  private static calculateAverageActiveHours(users: UserBehaviorData[]): number[] {
    const hourlyActivity = new Array(24).fill(0);
    
    users.forEach(user => {
      user.activeHours.forEach((activity, hour) => {
        hourlyActivity[hour] += activity;
      });
    });
    
    return hourlyActivity.map(total => total / users.length);
  }

  // 计算偏好分类
  private static calculatePreferredCategories(users: UserBehaviorData[]): { [key: string]: number } {
    const categoryCount: { [key: string]: number } = {};
    
    users.forEach(user => {
      user.preferredCategories.forEach(category => {
        categoryCount[category] = (categoryCount[category] || 0) + 1;
      });
    });
    
    return categoryCount;
  }

  // 计算参与度等级
  private static calculateEngagementLevels(users: UserBehaviorData[]): { [key: string]: number } {
    const levels = { high: 0, medium: 0, low: 0 };
    
    users.forEach(user => {
      if (user.avgEngagement > 7) levels.high++;
      else if (user.avgEngagement > 3) levels.medium++;
      else levels.low++;
    });
    
    return levels;
  }

  // 计算季节性趋势
  private static calculateSeasonalTrends(topics: RealTopicData[]): { [key: string]: number } {
    const monthlyTrends: { [key: string]: number } = {};
    
    topics.forEach(topic => {
      const month = new Date(topic.publishTime).getMonth();
      const monthName = ['1月', '2月', '3月', '4月', '5月', '6月', 
                        '7月', '8月', '9月', '10月', '11月', '12月'][month];
      monthlyTrends[monthName] = (monthlyTrends[monthName] || 0) + 1;
    });
    
    return monthlyTrends;
  }

  // 预测增长
  private static predictGrowth(trends: TrendAnalysis[]): { [key: string]: number } {
    const predictions: { [key: string]: number } = {};
    
    trends.forEach(trend => {
      // 简单的线性预测模型
      const momentum = trend.growth / 100;
      const sentimentBoost = trend.sentiment * 0.1;
      const volumeWeight = Math.log(trend.volume) / 10;
      
      predictions[trend.keyword] = (momentum + sentimentBoost) * volumeWeight * 100;
    });
    
    return predictions;
  }

  // 实时数据处理
  static processRealTimeData(rawData: any[]): any {
    return rawData.map(item => ({
      ...item,
      processedAt: new Date().toISOString(),
      score: this.calculateRealtimeScore(item)
    }));
  }

  private static calculateRealtimeScore(item: any): number {
    // 实时数据评分算法
    const recency = this.calculateRecencyScore(item.timestamp);
    const engagement = this.calculateEngagementScore(item);
    const quality = this.calculateQualityScore(item);
    
    return (recency * 0.3 + engagement * 0.4 + quality * 0.3) * 100;
  }

  private static calculateRecencyScore(timestamp: string): number {
    const now = Date.now();
    const itemTime = new Date(timestamp).getTime();
    const hoursDiff = (now - itemTime) / (1000 * 60 * 60);
    
    return Math.max(0, 1 - hoursDiff / 24); // 24小时内的内容得分更高
  }

  private static calculateEngagementScore(item: any): number {
    const totalEngagement = (item.likes || 0) + (item.comments || 0) + (item.shares || 0);
    return Math.min(totalEngagement / 1000, 1); // 标准化到0-1
  }

  private static calculateQualityScore(item: any): number {
    // 基于内容长度、图片数量等计算质量分数
    const contentLength = (item.content || '').length;
    const imageCount = (item.images || []).length;
    const hasVideo = item.video ? 1 : 0;
    
    const lengthScore = Math.min(contentLength / 500, 1);
    const mediaScore = Math.min((imageCount + hasVideo) / 5, 1);
    
    return (lengthScore * 0.6 + mediaScore * 0.4);
  }
}
