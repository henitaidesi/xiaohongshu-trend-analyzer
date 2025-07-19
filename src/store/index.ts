import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { Topic, TopicFilter } from '../types/topic';
import type { Content, ContentFilter } from '../types/content';
import type { UserSegment } from '../types/user';
import type { LoadingState } from '../types/common';

// 主数据存储
interface DataStore {
  // 话题数据
  topics: Topic[];
  topicFilter: TopicFilter;
  topicsLoading: LoadingState;
  
  // 内容数据
  contents: Content[];
  contentFilter: ContentFilter;
  contentsLoading: LoadingState;
  
  // 用户数据
  userSegments: UserSegment[];
  usersLoading: LoadingState;
  
  // 操作方法
  setTopics: (topics: Topic[]) => void;
  setTopicFilter: (filter: TopicFilter) => void;
  setTopicsLoading: (loading: LoadingState) => void;
  
  setContents: (contents: Content[]) => void;
  setContentFilter: (filter: ContentFilter) => void;
  setContentsLoading: (loading: LoadingState) => void;
  
  setUserSegments: (segments: UserSegment[]) => void;
  setUsersLoading: (loading: LoadingState) => void;
  
  // 清除数据
  clearData: () => void;
}

export const useDataStore = create<DataStore>()(
  devtools(
    (set) => ({
      // 初始状态
      topics: [],
      topicFilter: {},
      topicsLoading: { isLoading: false },
      
      contents: [],
      contentFilter: {},
      contentsLoading: { isLoading: false },
      
      userSegments: [],
      usersLoading: { isLoading: false },
      
      // 话题相关操作
      setTopics: (topics) => set({ topics }),
      setTopicFilter: (filter) => set({ topicFilter: filter }),
      setTopicsLoading: (loading) => set({ topicsLoading: loading }),
      
      // 内容相关操作
      setContents: (contents) => set({ contents }),
      setContentFilter: (filter) => set({ contentFilter: filter }),
      setContentsLoading: (loading) => set({ contentsLoading: loading }),
      
      // 用户相关操作
      setUserSegments: (segments) => set({ userSegments: segments }),
      setUsersLoading: (loading) => set({ usersLoading: loading }),
      
      // 清除所有数据
      clearData: () => set({
        topics: [],
        contents: [],
        userSegments: [],
        topicFilter: {},
        contentFilter: {},
        topicsLoading: { isLoading: false },
        contentsLoading: { isLoading: false },
        usersLoading: { isLoading: false },
      }),
    }),
    {
      name: 'data-store',
    }
  )
);

// UI状态存储
interface UIStore {
  // 侧边栏状态
  sidebarCollapsed: boolean;
  
  // 主题设置
  theme: 'light' | 'dark';
  
  // 当前选中的菜单项
  selectedMenuKey: string;
  
  // 面包屑导航
  breadcrumbs: { title: string; path?: string }[];
  
  // 全局加载状态
  globalLoading: boolean;
  
  // 操作方法
  setSidebarCollapsed: (collapsed: boolean) => void;
  setTheme: (theme: 'light' | 'dark') => void;
  setSelectedMenuKey: (key: string) => void;
  setBreadcrumbs: (breadcrumbs: { title: string; path?: string }[]) => void;
  setGlobalLoading: (loading: boolean) => void;
}

export const useUIStore = create<UIStore>()(
  devtools(
    (set) => ({
      // 初始状态
      sidebarCollapsed: false,
      theme: 'light',
      selectedMenuKey: '/',
      breadcrumbs: [{ title: '首页' }],
      globalLoading: false,
      
      // 操作方法
      setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
      setTheme: (theme) => set({ theme }),
      setSelectedMenuKey: (key) => set({ selectedMenuKey: key }),
      setBreadcrumbs: (breadcrumbs) => set({ breadcrumbs }),
      setGlobalLoading: (loading) => set({ globalLoading: loading }),
    }),
    {
      name: 'ui-store',
    }
  )
);

// 用户偏好存储
interface UserStore {
  // 用户设置
  preferences: {
    defaultTimeRange: string;
    favoriteCategories: string[];
    language: 'zh' | 'en';
    autoRefresh: boolean;
    refreshInterval: number;
  };
  
  // 收藏的报告
  savedReports: {
    id: string;
    title: string;
    type: string;
    createdAt: number;
    config: any;
  }[];
  
  // 使用历史
  history: {
    id: string;
    action: string;
    timestamp: number;
    details: any;
  }[];
  
  // 操作方法
  setPreferences: (preferences: Partial<UserStore['preferences']>) => void;
  addSavedReport: (report: Omit<UserStore['savedReports'][0], 'id' | 'createdAt'>) => void;
  removeSavedReport: (id: string) => void;
  addHistory: (action: string, details: any) => void;
  clearHistory: () => void;
}

export const useUserStore = create<UserStore>()(
  devtools(
    (set) => ({
      // 初始状态
      preferences: {
        defaultTimeRange: '7d',
        favoriteCategories: [],
        language: 'zh',
        autoRefresh: false,
        refreshInterval: 30000,
      },
      savedReports: [],
      history: [],
      
      // 操作方法
      setPreferences: (newPreferences) => set((state) => ({
        preferences: { ...state.preferences, ...newPreferences }
      })),
      
      addSavedReport: (report) => set((state) => ({
        savedReports: [
          ...state.savedReports,
          {
            ...report,
            id: Date.now().toString(),
            createdAt: Date.now(),
          }
        ]
      })),
      
      removeSavedReport: (id) => set((state) => ({
        savedReports: state.savedReports.filter(report => report.id !== id)
      })),
      
      addHistory: (action, details) => set((state) => ({
        history: [
          {
            id: Date.now().toString(),
            action,
            timestamp: Date.now(),
            details,
          },
          ...state.history.slice(0, 99), // 保留最近100条记录
        ]
      })),
      
      clearHistory: () => set({ history: [] }),
    }),
    {
      name: 'user-store',
    }
  )
);
