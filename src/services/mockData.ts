// 模拟数据服务

// 热门话题数据
export const mockTopics = [
  { id: '1', name: '春季穿搭指南', heatScore: 9.8, trend: 'up' as const, trendValue: 12, category: '时尚穿搭' },
  { id: '2', name: '护肤品测评', heatScore: 9.5, trend: 'up' as const, trendValue: 8, category: '美妆护肤' },
  { id: '3', name: '美食探店', heatScore: 9.2, trend: 'up' as const, trendValue: 15, category: '美食' },
  { id: '4', name: '旅行攻略', heatScore: 8.9, trend: 'down' as const, trendValue: 3, category: '旅行' },
  { id: '5', name: '健身日常', heatScore: 8.7, trend: 'up' as const, trendValue: 5, category: '健身运动' },
  { id: '6', name: '居家好物', heatScore: 8.5, trend: 'down' as const, trendValue: 2, category: '生活方式' },
  { id: '7', name: '化妆教程', heatScore: 8.3, trend: 'up' as const, trendValue: 7, category: '美妆护肤' },
  { id: '8', name: '读书分享', heatScore: 8.1, trend: 'stable' as const, trendValue: 0, category: '文化教育' },
  { id: '9', name: '职场经验', heatScore: 7.9, trend: 'up' as const, trendValue: 4, category: '职场' },
  { id: '10', name: '数码评测', heatScore: 7.7, trend: 'down' as const, trendValue: 1, category: '数码科技' },
];

// 内容类型分布数据
export const mockContentTypeData = [
  { name: '图文', value: 45, color: '#ff2442' },
  { name: '视频', value: 35, color: '#1890ff' },
  { name: '直播', value: 12, color: '#52c41a' },
  { name: '音频', value: 8, color: '#faad14' },
];

// 发布时间热力图数据
export const mockPublishTimeData = Array.from({ length: 24 }, (_, hour) => ({
  hour,
  value: Math.floor(Math.random() * 100) + 20,
}));

// 趋势线图数据
export const mockTrendData = [
  {
    name: '热度指数',
    data: Array.from({ length: 30 }, (_, i) => ({
      x: `${i + 1}日`,
      y: Math.floor(Math.random() * 50) + 50 + Math.sin(i * 0.2) * 20,
    })),
  },
  {
    name: '互动量',
    data: Array.from({ length: 30 }, (_, i) => ({
      x: `${i + 1}日`,
      y: Math.floor(Math.random() * 40) + 30 + Math.cos(i * 0.15) * 15,
    })),
  },
];

// 用户年龄分布数据
export const mockAgeDistribution = [
  { name: '18-24岁', value: 35, color: '#ff2442' },
  { name: '25-30岁', value: 28, color: '#1890ff' },
  { name: '31-35岁', value: 20, color: '#52c41a' },
  { name: '36-40岁', value: 12, color: '#faad14' },
  { name: '40岁以上', value: 5, color: '#722ed1' },
];

// 地域分布数据
export const mockLocationData = [
  { name: '北京', value: 18 },
  { name: '上海', value: 16 },
  { name: '广州', value: 12 },
  { name: '深圳', value: 11 },
  { name: '杭州', value: 8 },
  { name: '成都', value: 7 },
  { name: '武汉', value: 6 },
  { name: '南京', value: 5 },
  { name: '西安', value: 4 },
  { name: '其他', value: 13 },
];

// 互动类型分布数据
export const mockInteractionData = [
  {
    name: '点赞',
    data: Array.from({ length: 7 }, (_, i) => ({
      x: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'][i],
      y: Math.floor(Math.random() * 1000) + 500,
    })),
  },
  {
    name: '评论',
    data: Array.from({ length: 7 }, (_, i) => ({
      x: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'][i],
      y: Math.floor(Math.random() * 300) + 100,
    })),
  },
  {
    name: '分享',
    data: Array.from({ length: 7 }, (_, i) => ({
      x: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'][i],
      y: Math.floor(Math.random() * 200) + 50,
    })),
  },
];

// 创作建议数据
export const mockCreationSuggestions = [
  {
    id: '1',
    type: 'topic',
    title: '推荐话题',
    content: '春季护肤',
    reason: '该话题热度上升15%，预计未来一周持续走高',
    confidence: 85,
  },
  {
    id: '2',
    type: 'time',
    title: '最佳发布时间',
    content: '晚上8-10点',
    reason: '该时段用户活跃度最高，互动率提升30%',
    confidence: 92,
  },
  {
    id: '3',
    type: 'format',
    title: '内容形式建议',
    content: '图文+视频',
    reason: '混合内容形式获得更高的完播率和互动率',
    confidence: 78,
  },
  {
    id: '4',
    type: 'tag',
    title: '推荐标签',
    content: '#春日穿搭 #护肤心得',
    reason: '相关标签搜索量增长25%',
    confidence: 88,
  },
];

// 统计数据
export const mockStatistics = {
  totalTopics: 12456,
  activeUsers: 2.3,
  dailyPosts: 45.6,
  totalInteractions: 890,
  trends: {
    topics: 12,
    users: 8,
    posts: 15,
    interactions: 23,
  },
};

// API模拟函数
export const mockApi = {
  getTopics: () => Promise.resolve(mockTopics),
  getContentTypeData: () => Promise.resolve(mockContentTypeData),
  getTrendData: () => Promise.resolve(mockTrendData),
  getAgeDistribution: () => Promise.resolve(mockAgeDistribution),
  getLocationData: () => Promise.resolve(mockLocationData),
  getInteractionData: () => Promise.resolve(mockInteractionData),
  getCreationSuggestions: () => Promise.resolve(mockCreationSuggestions),
  getStatistics: () => Promise.resolve(mockStatistics),
};
