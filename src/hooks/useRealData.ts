// 真实数据获取Hook
import { useState, useEffect, useCallback } from 'react';
import { realDataService, RealTopicData, UserBehaviorData, TrendAnalysis } from '../services/dataService';
import { AdvancedAnalytics, AnalyticsResult } from '../utils/analytics';

interface UseRealDataReturn {
  // 数据状态
  data: AnalyticsResult | null;
  loading: boolean;
  error: string | null;
  
  // 原始数据
  topics: RealTopicData[];
  users: UserBehaviorData[];
  trends: TrendAnalysis[];
  
  // 实时数据
  realTimeMetrics: any;
  
  // 操作方法
  refreshData: () => Promise<void>;
  searchTopics: (keyword: string) => Promise<RealTopicData[]>;
  getUserInsights: (userId: string) => Promise<UserBehaviorData | null>;
  getTrendAnalysis: (keywords: string[]) => Promise<TrendAnalysis[]>;
  
  // 数据更新状态
  lastUpdated: Date | null;
  isRealTime: boolean;
}

export const useRealData = (): UseRealDataReturn => {
  // 状态管理
  const [data, setData] = useState<AnalyticsResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [topics, setTopics] = useState<RealTopicData[]>([]);
  const [users, setUsers] = useState<UserBehaviorData[]>([]);
  const [trends, setTrends] = useState<TrendAnalysis[]>([]);
  const [realTimeMetrics, setRealTimeMetrics] = useState<any>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isRealTime, setIsRealTime] = useState(false);

  // 获取所有数据
  const fetchAllData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // 并行获取所有数据
      const [topicsData, usersData, trendsData, metricsData] = await Promise.all([
        realDataService.getHotTopics(50),
        realDataService.getUserBehaviorData(1000),
        realDataService.getTrendAnalysis(['时尚', '美妆', '生活', '美食', '旅行', '健身', '学习', '宠物']),
        realDataService.getRealTimeMetrics()
      ]);

      // 更新原始数据
      setTopics(topicsData);
      setUsers(usersData);
      setTrends(trendsData);
      setRealTimeMetrics(metricsData);

      // 进行数据分析
      const analysisResult = AdvancedAnalytics.analyzeData(topicsData, usersData, trendsData);
      setData(analysisResult);
      
      setLastUpdated(new Date());
      setLoading(false);

      console.log('✅ 真实数据加载完成:', {
        topics: topicsData.length,
        users: usersData.length,
        trends: trendsData.length,
        analysis: analysisResult
      });

    } catch (err) {
      console.error('❌ 数据获取失败:', err);
      setError(err instanceof Error ? err.message : '数据获取失败');
      setLoading(false);
    }
  }, []);

  // 刷新数据
  const refreshData = useCallback(async () => {
    await fetchAllData();
  }, [fetchAllData]);

  // 搜索话题
  const searchTopics = useCallback(async (keyword: string): Promise<RealTopicData[]> => {
    try {
      const allTopics = await realDataService.getHotTopics(100);
      return allTopics.filter(topic => 
        topic.title.includes(keyword) || 
        topic.content.includes(keyword) ||
        topic.tags.some(tag => tag.includes(keyword))
      );
    } catch (err) {
      console.error('搜索话题失败:', err);
      return [];
    }
  }, []);

  // 获取用户洞察
  const getUserInsights = useCallback(async (userId: string): Promise<UserBehaviorData | null> => {
    try {
      const allUsers = await realDataService.getUserBehaviorData(1000);
      return allUsers.find(user => user.userId === userId) || null;
    } catch (err) {
      console.error('获取用户洞察失败:', err);
      return null;
    }
  }, []);

  // 获取趋势分析
  const getTrendAnalysis = useCallback(async (keywords: string[]): Promise<TrendAnalysis[]> => {
    try {
      return await realDataService.getTrendAnalysis(keywords);
    } catch (err) {
      console.error('获取趋势分析失败:', err);
      return [];
    }
  }, []);

  // 实时数据更新
  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    const startRealTimeUpdates = () => {
      setIsRealTime(true);
      intervalId = setInterval(async () => {
        try {
          const metrics = await realDataService.getRealTimeMetrics();
          setRealTimeMetrics(metrics);
          
          // 每5分钟更新一次完整数据
          const now = new Date();
          if (lastUpdated && (now.getTime() - lastUpdated.getTime()) > 5 * 60 * 1000) {
            await fetchAllData();
          }
        } catch (err) {
          console.error('实时数据更新失败:', err);
        }
      }, 30000); // 每30秒更新实时指标
    };

    if (data && !loading) {
      startRealTimeUpdates();
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
        setIsRealTime(false);
      }
    };
  }, [data, loading, lastUpdated, fetchAllData]);

  // 初始化数据加载
  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  // 数据质量监控
  useEffect(() => {
    if (data) {
      const dataQuality = {
        topicsCount: topics.length,
        usersCount: users.length,
        trendsCount: trends.length,
        completeness: (topics.length > 0 && users.length > 0 && trends.length > 0) ? 100 : 0,
        freshness: lastUpdated ? Date.now() - lastUpdated.getTime() : 0
      };

      console.log('📊 数据质量报告:', dataQuality);

      // 数据质量警告
      if (dataQuality.completeness < 100) {
        console.warn('⚠️ 数据不完整，某些功能可能受限');
      }

      if (dataQuality.freshness > 10 * 60 * 1000) { // 10分钟
        console.warn('⚠️ 数据可能过时，建议刷新');
      }
    }
  }, [data, topics, users, trends, lastUpdated]);

  // 错误恢复机制
  useEffect(() => {
    if (error) {
      const retryTimer = setTimeout(() => {
        console.log('🔄 尝试重新获取数据...');
        fetchAllData();
      }, 10000); // 10秒后重试

      return () => clearTimeout(retryTimer);
    }
  }, [error, fetchAllData]);

  return {
    // 数据状态
    data,
    loading,
    error,
    
    // 原始数据
    topics,
    users,
    trends,
    
    // 实时数据
    realTimeMetrics,
    
    // 操作方法
    refreshData,
    searchTopics,
    getUserInsights,
    getTrendAnalysis,
    
    // 数据更新状态
    lastUpdated,
    isRealTime
  };
};

// 专门用于获取热门话题的Hook
export const useHotTopics = (limit: number = 10) => {
  const [hotTopics, setHotTopics] = useState<RealTopicData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHotTopics = async () => {
      try {
        setLoading(true);
        const topics = await realDataService.getHotTopics(limit);
        setHotTopics(topics);
      } catch (err) {
        console.error('获取热门话题失败:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHotTopics();
  }, [limit]);

  return { hotTopics, loading };
};

// 专门用于实时指标的Hook
export const useRealTimeMetrics = () => {
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const data = await realDataService.getRealTimeMetrics();
        setMetrics(data);
        setLoading(false);
      } catch (err) {
        console.error('获取实时指标失败:', err);
        setLoading(false);
      }
    };

    // 立即获取一次
    fetchMetrics();

    // 每30秒更新一次
    const interval = setInterval(fetchMetrics, 30000);

    return () => clearInterval(interval);
  }, []);

  return { metrics, loading };
};

// 用于趋势预测的Hook
export const useTrendPrediction = (keywords: string[]) => {
  const [predictions, setPredictions] = useState<TrendAnalysis[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPredictions = async () => {
      if (keywords.length === 0) return;

      try {
        setLoading(true);
        const trends = await realDataService.getTrendAnalysis(keywords);
        setPredictions(trends);
      } catch (err) {
        console.error('获取趋势预测失败:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPredictions();
  }, [keywords]);

  return { predictions, loading };
};
