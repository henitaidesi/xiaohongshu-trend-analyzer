// 通用类型定义

export interface BaseEntity {
  id: string;
  createdAt: number;
  updatedAt: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  code?: number;
}

export interface PaginationParams {
  page: number;
  pageSize: number;
}

export interface PaginationResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface FilterParams {
  category?: string;
  timeRange?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface ChartDataPoint {
  name: string;
  value: number;
  timestamp?: number;
}

export interface TimeSeriesData {
  timestamp: number;
  value: number;
  label?: string;
}

export interface CategoryData {
  category: string;
  value: number;
  percentage: number;
  color?: string;
}

export type TrendDirection = 'up' | 'down' | 'stable';

export interface TrendIndicator {
  direction: TrendDirection;
  percentage: number;
  description?: string;
}

export interface LoadingState {
  isLoading: boolean;
  error?: string | null;
}

export interface UserPreferences {
  theme: 'light' | 'dark';
  language: 'zh' | 'en';
  defaultTimeRange: string;
  favoriteCategories: string[];
}

export interface MenuItem {
  key: string;
  label: string;
  icon?: string;
  path: string;
  children?: MenuItem[];
}

export interface BreadcrumbItem {
  title: string;
  path?: string;
}

export interface SearchParams {
  keyword?: string;
  filters?: Record<string, any>;
  pagination?: PaginationParams;
}

export interface ExportOptions {
  format: 'pdf' | 'excel' | 'csv' | 'png';
  filename?: string;
  includeCharts?: boolean;
  dateRange?: {
    start: string;
    end: string;
  };
}
