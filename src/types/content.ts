// 内容相关类型定义
import type { BaseEntity } from './common';

export type ContentType = 'image' | 'video' | 'text' | 'live';

export interface Content extends BaseEntity {
  title: string;
  type: ContentType;
  category: string;
  author: Author;
  metrics: ContentMetrics;
  publishTime: number;
  tags: string[];
  topicId?: string;
}

export interface Author {
  id: string;
  name: string;
  avatar?: string;
  followers: number;
  verified?: boolean;
  level?: number;
}

export interface ContentMetrics {
  likes: number;
  comments: number;
  shares: number;
  views: number;
  saves?: number;
  engagementRate: number;
}

export interface ContentTrend {
  type: ContentType;
  category: string;
  data: {
    timestamp: number;
    count: number;
    engagement: number;
  }[];
}

export interface ContentDistribution {
  type: ContentType;
  count: number;
  percentage: number;
  avgEngagement: number;
}

export interface PublishTimeAnalysis {
  hour: number;
  day: number; // 0-6 (Sunday-Saturday)
  count: number;
  avgEngagement: number;
}

export interface ContentPerformance {
  contentId: string;
  title: string;
  type: ContentType;
  publishTime: number;
  metrics: ContentMetrics;
  score: number; // 综合评分
  ranking?: number;
}

export interface TagTrend {
  tag: string;
  count: number;
  growth: number;
  category?: string;
  relatedTags?: string[];
}

export interface ContentFilter {
  types?: ContentType[];
  categories?: string[];
  timeRange?: string;
  authorId?: string;
  minEngagement?: number;
  tags?: string[];
}

export interface ContentRecommendation {
  type: 'topic' | 'timing' | 'format' | 'tag';
  title: string;
  description: string;
  confidence: number; // 0-1
  data?: any;
  reason?: string;
}

export interface CreatorInsight {
  authorId: string;
  authorName: string;
  totalContents: number;
  avgEngagement: number;
  bestPerformingType: ContentType;
  bestPublishTime: {
    hour: number;
    day: number;
  };
  topTags: string[];
  growthTrend: number;
}
