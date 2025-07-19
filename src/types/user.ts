// 用户相关类型定义
import type { BaseEntity } from './common';

export interface User extends BaseEntity {
  ageGroup: string;
  gender: 'male' | 'female' | 'other';
  location: {
    province: string;
    city: string;
  };
  interests: string[];
  activityPattern: {
    activeHours: number[];
    activeDays: number[];
  };
  engagementRate: number;
}

export interface UserSegment {
  id: string;
  name: string;
  description?: string;
  count: number;
  percentage: number;
  demographics: {
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
  interests: {
    category: string;
    percentage: number;
  }[];
  activityPattern: {
    hourly: number[];
    daily: number[];
  };
}

export interface UserBehavior {
  action: 'view' | 'like' | 'comment' | 'share' | 'save';
  count: number;
  percentage: number;
  trend: number;
}

export interface UserJourney {
  steps: {
    action: string;
    percentage: number;
    nextActions: {
      action: string;
      percentage: number;
    }[];
  }[];
}

export interface UserInterest {
  category: string;
  subcategories: {
    name: string;
    percentage: number;
  }[];
  trend: number;
}

export interface UserLocationData {
  province: string;
  city?: string;
  count: number;
  percentage: number;
}

export interface UserActivityTime {
  hour: number;
  day: number;
  value: number;
}

export interface UserProfile {
  segment: string;
  demographics: {
    ageGroup: string;
    gender: string;
    location: string;
  };
  interests: string[];
  behaviors: {
    action: string;
    frequency: string;
  }[];
  activeTime: {
    peak: string;
    regular: string[];
  };
  contentPreferences: {
    types: string[];
    categories: string[];
    creators: string[];
  };
}

export interface UserInsight {
  title: string;
  description: string;
  value: number | string;
  change?: number;
  recommendation?: string;
}
