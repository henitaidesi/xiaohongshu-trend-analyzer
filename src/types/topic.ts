// 话题相关类型定义
import type { BaseEntity, TrendDirection } from './common';

export interface Topic extends BaseEntity {
  name: string;
  heatScore: number;
  trend: TrendDirection;
  category: string;
  tags: string[];
  relatedTopics: string[];
  metrics: TopicMetrics;
}

export interface TopicMetrics {
  posts: number;
  engagement: number;
  growth: number;
  views?: number;
  shares?: number;
  comments?: number;
  likes?: number;
}

export interface TopicTrend {
  topicId: string;
  topicName: string;
  data: {
    timestamp: number;
    heatScore: number;
  }[];
}

export interface TopicRelation {
  source: string;
  target: string;
  weight: number;
}

export interface TopicNetwork {
  nodes: {
    id: string;
    name: string;
    value: number;
    category?: string;
  }[];
  links: {
    source: string;
    target: string;
    value: number;
  }[];
}

export interface TopicWordCloud {
  words: {
    text: string;
    value: number;
    category?: string;
  }[];
}

export interface TopicCategory {
  id: string;
  name: string;
  count: number;
  percentage: number;
  color?: string;
}

export interface TopicFilter {
  categories?: string[];
  timeRange?: string;
  heatScoreRange?: [number, number];
  trendDirection?: TrendDirection[];
  keyword?: string;
}

export interface TopicRanking {
  id: string;
  name: string;
  rank: number;
  previousRank: number;
  heatScore: number;
  trend: TrendDirection;
  category: string;
  changePercentage: number;
}

export interface TopicDetail extends Topic {
  description?: string;
  examples: {
    id: string;
    title: string;
    author: string;
    engagement: number;
    url?: string;
  }[];
  history: {
    timestamp: number;
    heatScore: number;
  }[];
  demographics?: {
    ageGroups: {
      range: string;
      percentage: number;
    }[];
    genderDistribution: {
      gender: string;
      percentage: number;
    }[];
    locations: {
      name: string;
      percentage: number;
    }[];
  };
}
