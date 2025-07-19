// 应用常量定义

// 应用信息
export const APP_CONFIG = {
  name: '小红书创作趋势分析平台',
  version: '1.0.0',
  description: '为内容创作者和营销人员提供小红书平台的数据洞察和创作建议',
  author: 'Trend Analyzer Team',
};

// API 配置
export const API_CONFIG = {
  baseURL: process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:3001/api',
  timeout: 10000,
  retryTimes: 3,
};

// 路由路径
export const ROUTES = {
  HOME: '/',
  TOPICS: '/topics',
  TRENDS: '/trends',
  INSIGHTS: '/insights',
  ASSISTANT: '/assistant',
  PROFILE: '/profile',
} as const;

// 菜单配置
export const MENU_ITEMS = [
  {
    key: ROUTES.HOME,
    label: '首页概览',
    icon: 'HomeOutlined',
  },
  {
    key: ROUTES.TOPICS,
    label: '热点话题',
    icon: 'FireOutlined',
  },
  {
    key: ROUTES.TRENDS,
    label: '创作趋势',
    icon: 'TrendingUpOutlined',
  },
  {
    key: ROUTES.INSIGHTS,
    label: '用户洞察',
    icon: 'UserOutlined',
  },
  {
    key: ROUTES.ASSISTANT,
    label: '创作助手',
    icon: 'RobotOutlined',
  },
  {
    key: ROUTES.PROFILE,
    label: '个人中心',
    icon: 'SettingOutlined',
  },
];

// 时间范围选项
export const TIME_RANGES = [
  { label: '最近1小时', value: '1h' },
  { label: '最近24小时', value: '24h' },
  { label: '最近7天', value: '7d' },
  { label: '最近30天', value: '30d' },
  { label: '最近90天', value: '90d' },
  { label: '自定义', value: 'custom' },
];

// 内容类型
export const CONTENT_TYPES = [
  { label: '图文', value: 'image', color: '#ff2442' },
  { label: '视频', value: 'video', color: '#1890ff' },
  { label: '文字', value: 'text', color: '#52c41a' },
  { label: '直播', value: 'live', color: '#722ed1' },
];

// 内容分类
export const CONTENT_CATEGORIES = [
  { label: '美妆', value: 'beauty', color: '#ff69b4' },
  { label: '穿搭', value: 'fashion', color: '#9370db' },
  { label: '美食', value: 'food', color: '#ff6347' },
  { label: '旅行', value: 'travel', color: '#20b2aa' },
  { label: '健身', value: 'fitness', color: '#32cd32' },
  { label: '居家', value: 'home', color: '#daa520' },
  { label: '数码', value: 'tech', color: '#4169e1' },
  { label: '教育', value: 'education', color: '#ff8c00' },
  { label: '娱乐', value: 'entertainment', color: '#dc143c' },
  { label: '其他', value: 'other', color: '#808080' },
];

// 趋势方向
export const TREND_DIRECTIONS = {
  UP: 'up',
  DOWN: 'down',
  STABLE: 'stable',
} as const;

// 趋势方向配置
export const TREND_CONFIG = {
  [TREND_DIRECTIONS.UP]: {
    label: '上升',
    color: '#52c41a',
    icon: 'ArrowUpOutlined',
  },
  [TREND_DIRECTIONS.DOWN]: {
    label: '下降',
    color: '#ff4d4f',
    icon: 'ArrowDownOutlined',
  },
  [TREND_DIRECTIONS.STABLE]: {
    label: '稳定',
    color: '#8c8c8c',
    icon: 'MinusOutlined',
  },
};

// 用户年龄组
export const AGE_GROUPS = [
  { label: '18-24岁', value: '18-24' },
  { label: '25-30岁', value: '25-30' },
  { label: '31-35岁', value: '31-35' },
  { label: '36-40岁', value: '36-40' },
  { label: '40岁以上', value: '40+' },
];

// 性别选项
export const GENDERS = [
  { label: '男性', value: 'male' },
  { label: '女性', value: 'female' },
  { label: '其他', value: 'other' },
];

// 地区选项（主要省份）
export const PROVINCES = [
  { label: '北京', value: 'beijing' },
  { label: '上海', value: 'shanghai' },
  { label: '广东', value: 'guangdong' },
  { label: '浙江', value: 'zhejiang' },
  { label: '江苏', value: 'jiangsu' },
  { label: '四川', value: 'sichuan' },
  { label: '湖北', value: 'hubei' },
  { label: '湖南', value: 'hunan' },
  { label: '河南', value: 'henan' },
  { label: '山东', value: 'shandong' },
];

// 图表颜色配置
export const CHART_COLORS = {
  primary: ['#ff2442', '#ff6b7a', '#ffb3ba', '#ffd6dc', '#ffe8eb'],
  secondary: ['#1890ff', '#40a9ff', '#69c0ff', '#91d5ff', '#bae7ff'],
  success: ['#52c41a', '#73d13d', '#95de64', '#b7eb8f', '#d9f7be'],
  warning: ['#faad14', '#ffc53d', '#ffd666', '#ffe58f', '#fff1b8'],
  error: ['#ff4d4f', '#ff7875', '#ffa39e', '#ffccc7', '#ffe1e1'],
  mixed: ['#ff2442', '#1890ff', '#52c41a', '#faad14', '#722ed1', '#eb2f96', '#13c2c2', '#fa8c16'],
};

// 图表默认配置
export const CHART_DEFAULT_CONFIG = {
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true,
  },
  tooltip: {
    trigger: 'axis',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderColor: 'transparent',
    textStyle: {
      color: '#ffffff',
    },
  },
  legend: {
    type: 'scroll',
    bottom: 0,
  },
  animation: true,
  animationDuration: 1000,
  animationEasing: 'cubicOut',
};

// 分页配置
export const PAGINATION_CONFIG = {
  defaultPageSize: 20,
  pageSizeOptions: ['10', '20', '50', '100'],
  showSizeChanger: true,
  showQuickJumper: true,
  showTotal: (total: number, range: [number, number]) =>
    `第 ${range[0]}-${range[1]} 条，共 ${total} 条`,
};

// 本地存储键名
export const STORAGE_KEYS = {
  USER_PREFERENCES: 'user_preferences',
  SAVED_REPORTS: 'saved_reports',
  SEARCH_HISTORY: 'search_history',
  THEME: 'theme',
  SIDEBAR_COLLAPSED: 'sidebar_collapsed',
};

// 导出格式
export const EXPORT_FORMATS = [
  { label: 'PDF', value: 'pdf', icon: 'FilePdfOutlined' },
  { label: 'Excel', value: 'excel', icon: 'FileExcelOutlined' },
  { label: 'CSV', value: 'csv', icon: 'FileTextOutlined' },
  { label: 'PNG', value: 'png', icon: 'FileImageOutlined' },
];

// 刷新间隔选项（毫秒）
export const REFRESH_INTERVALS = [
  { label: '不自动刷新', value: 0 },
  { label: '30秒', value: 30000 },
  { label: '1分钟', value: 60000 },
  { label: '5分钟', value: 300000 },
  { label: '10分钟', value: 600000 },
];

// 错误消息
export const ERROR_MESSAGES = {
  NETWORK_ERROR: '网络连接失败，请检查网络设置',
  SERVER_ERROR: '服务器错误，请稍后重试',
  DATA_LOAD_ERROR: '数据加载失败，请刷新页面重试',
  PERMISSION_DENIED: '权限不足，请联系管理员',
  INVALID_PARAMS: '参数错误，请检查输入',
  TIMEOUT_ERROR: '请求超时，请稍后重试',
};

// 成功消息
export const SUCCESS_MESSAGES = {
  DATA_SAVED: '数据保存成功',
  EXPORT_SUCCESS: '导出成功',
  SETTINGS_UPDATED: '设置更新成功',
  REPORT_GENERATED: '报告生成成功',
};
