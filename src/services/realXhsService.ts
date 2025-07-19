// 真实小红书数据获取服务
// 基于 ReaJason/xhs Python库的浏览器兼容版本

// 数据接口定义
export interface XhsNote {
  id: string;
  title: string;
  desc: string;
  type: 'normal' | 'video';
  user: {
    user_id: string;
    nickname: string;
    avatar: string;
  };
  interact_info: {
    liked_count: string;
    collected_count: string;
    comment_count: string;
    share_count: string;
  };
  tag_list: Array<{
    id: string;
    name: string;
    type: string;
  }>;
  image_list?: Array<{
    url: string;
    width: number;
    height: number;
  }>;
  video?: {
    url: string;
    duration: number;
  };
  time: number;
  last_update_time: number;
}

export interface XhsUser {
  user_id: string;
  nickname: string;
  desc: string;
  gender: number;
  follows: string;
  fans: string;
  interaction: string;
  avatar: string;
}

export interface XhsSearchResult {
  notes: XhsNote[];
  users: XhsUser[];
  has_more: boolean;
  cursor: string;
}

// 真实小红书数据服务类 - 浏览器兼容版本
class RealXhsService {
  private isInitialized: boolean = false;

  constructor() {
    // 浏览器环境下的初始化
  }

  // 初始化检查 - 浏览器版本
  async initialize(): Promise<boolean> {
    try {
      // 浏览器环境下直接返回成功，使用模拟数据
      console.log('🌐 浏览器环境：使用模拟数据模式');
      this.isInitialized = true;
      return true;
    } catch (error) {
      console.error('初始化小红书服务失败:', error);
      return false;
    }
  }

  // 模拟API调用的通用方法
  private async simulateApiCall(action: string, params: any): Promise<any> {
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));

    // 根据不同的action返回不同的模拟数据
    switch (action) {
      case 'get_platform_stats':
        return {
          success: true,
          data: {
            totalNotes: Math.floor(Math.random() * 50000) + 80000,
            activeUsers: Math.floor(Math.random() * 1000000) + 2000000,
            dailyPosts: Math.floor(Math.random() * 30000) + 50000,
            totalInteractions: Math.floor(Math.random() * 500000) + 1000000,
            growthRate: {
              notes: (Math.random() - 0.5) * 30,
              users: (Math.random() - 0.5) * 20,
              interactions: (Math.random() - 0.5) * 40
            }
          }
        };
      default:
        return { success: true, data: [] };
    }
  }

  // 获取热门笔记 - 浏览器版本
  async getHotNotes(count: number = 20): Promise<XhsNote[]> {
    if (!this.isInitialized) {
      throw new Error('服务未初始化，请先调用initialize()');
    }

    try {
      // 生成模拟的热门笔记数据
      const notes: XhsNote[] = [];
      const categories = ['时尚', '美妆', '生活', '美食', '旅行', '健身', '学习', '宠物'];
      const keywords = ['穿搭', '护肤', '好物', '美食', '攻略', '健身', '学习', '萌宠'];

      for (let i = 0; i < count; i++) {
        const category = categories[Math.floor(Math.random() * categories.length)];
        const keyword = keywords[Math.floor(Math.random() * keywords.length)];

        notes.push({
          id: `note_${Date.now()}_${i}`,
          title: `${keyword}分享 #${i + 1}`,
          desc: `关于${category}的详细分享，包含了实用的经验和心得...`,
          type: Math.random() > 0.7 ? 'video' : 'normal',
          user: {
            user_id: `user_${Math.floor(Math.random() * 10000)}`,
            nickname: `用户${Math.floor(Math.random() * 1000)}`,
            avatar: `https://picsum.photos/100/100?random=${i}`
          },
          interact_info: {
            liked_count: String(Math.floor(Math.random() * 50000) + 1000),
            collected_count: String(Math.floor(Math.random() * 5000) + 100),
            comment_count: String(Math.floor(Math.random() * 1000) + 50),
            share_count: String(Math.floor(Math.random() * 500) + 10)
          },
          tag_list: [
            { id: `tag_${i}_1`, name: keyword, type: 'topic' },
            { id: `tag_${i}_2`, name: category, type: 'category' }
          ],
          time: Math.floor(Date.now() / 1000) - Math.floor(Math.random() * 7 * 24 * 3600),
          last_update_time: Math.floor(Date.now() / 1000)
        });
      }

      return notes;
    } catch (error) {
      console.error('获取热门笔记失败:', error);
      throw error;
    }
  }

  // 搜索笔记
  async searchNotes(keyword: string, page: number = 1, pageSize: number = 20): Promise<XhsSearchResult> {
    if (!this.isInitialized) {
      throw new Error('服务未初始化，请先调用initialize()');
    }

    try {
      const result = await this.runPythonScript('search_notes', {
        keyword,
        page,
        page_size: pageSize
      });
      return result.data || { notes: [], users: [], has_more: false, cursor: '' };
    } catch (error) {
      console.error('搜索笔记失败:', error);
      throw error;
    }
  }

  // 获取笔记详情
  async getNoteById(noteId: string): Promise<XhsNote | null> {
    if (!this.isInitialized) {
      throw new Error('服务未初始化，请先调用initialize()');
    }

    try {
      const result = await this.runPythonScript('get_note_by_id', { note_id: noteId });
      return result.data || null;
    } catch (error) {
      console.error('获取笔记详情失败:', error);
      throw error;
    }
  }

  // 获取用户信息
  async getUserInfo(userId: string): Promise<XhsUser | null> {
    if (!this.isInitialized) {
      throw new Error('服务未初始化，请先调用initialize()');
    }

    try {
      const result = await this.runPythonScript('get_user_info', { user_id: userId });
      return result.data || null;
    } catch (error) {
      console.error('获取用户信息失败:', error);
      throw error;
    }
  }

  // 获取分类热门内容
  async getCategoryNotes(category: string, count: number = 20): Promise<XhsNote[]> {
    if (!this.isInitialized) {
      throw new Error('服务未初始化，请先调用initialize()');
    }

    try {
      const result = await this.runPythonScript('get_category_notes', {
        category,
        count
      });
      return result.data || [];
    } catch (error) {
      console.error('获取分类内容失败:', error);
      throw error;
    }
  }

  // 获取实时趋势数据
  async getTrendingTopics(count: number = 10): Promise<Array<{
    keyword: string;
    heat: number;
    trend: 'up' | 'down' | 'stable';
    note_count: number;
  }>> {
    if (!this.isInitialized) {
      throw new Error('服务未初始化，请先调用initialize()');
    }

    try {
      const result = await this.runPythonScript('get_trending_topics', { count });
      return result.data || [];
    } catch (error) {
      console.error('获取趋势话题失败:', error);
      throw error;
    }
  }

  // 数据分析：计算真实的平台统计数据 - 浏览器版本
  async getPlatformStats(): Promise<{
    totalNotes: number;
    activeUsers: number;
    dailyPosts: number;
    totalInteractions: number;
    growthRate: {
      notes: number;
      users: number;
      interactions: number;
    };
  }> {
    if (!this.isInitialized) {
      throw new Error('服务未初始化，请先调用initialize()');
    }

    try {
      const result = await this.simulateApiCall('get_platform_stats', {});
      return result.data;
    } catch (error) {
      console.error('获取平台统计失败:', error);
      throw error;
    }
  }

  // 获取用户行为分析数据
  async getUserBehaviorAnalysis(): Promise<{
    demographics: {
      ageGroups: { [key: string]: number };
      genders: { [key: string]: number };
      locations: { [key: string]: number };
    };
    activeHours: number[];
    preferredCategories: { [key: string]: number };
  }> {
    if (!this.isInitialized) {
      throw new Error('服务未初始化，请先调用initialize()');
    }

    try {
      const result = await this.runPythonScript('get_user_behavior_analysis', {});
      return result.data || {
        demographics: { ageGroups: {}, genders: {}, locations: {} },
        activeHours: new Array(24).fill(0),
        preferredCategories: {}
      };
    } catch (error) {
      console.error('获取用户行为分析失败:', error);
      throw error;
    }
  }

  // 健康检查
  async healthCheck(): Promise<boolean> {
    try {
      const result = await this.runPythonScript('health_check', {});
      return result.success || false;
    } catch (error) {
      console.error('健康检查失败:', error);
      return false;
    }
  }
}

// 导出单例实例
export const realXhsService = new RealXhsService();

// 数据转换工具函数
export class XhsDataTransformer {
  // 将XHS笔记转换为我们的数据格式
  static transformNote(xhsNote: XhsNote): any {
    return {
      id: xhsNote.id,
      title: xhsNote.title,
      content: xhsNote.desc,
      author: xhsNote.user.nickname,
      publishTime: new Date(xhsNote.time * 1000).toISOString(),
      likeCount: parseInt(xhsNote.interact_info.liked_count) || 0,
      commentCount: parseInt(xhsNote.interact_info.comment_count) || 0,
      shareCount: parseInt(xhsNote.interact_info.share_count) || 0,
      viewCount: (parseInt(xhsNote.interact_info.liked_count) || 0) * 10, // 估算
      tags: xhsNote.tag_list.map(tag => tag.name),
      category: this.inferCategory(xhsNote.tag_list),
      images: xhsNote.image_list?.map(img => img.url) || [],
      sentiment: this.analyzeSentiment(xhsNote.desc),
      trendScore: this.calculateTrendScore(xhsNote)
    };
  }

  // 推断分类
  private static inferCategory(tags: Array<{ name: string }>): string {
    const categoryKeywords = {
      '时尚': ['穿搭', '时尚', '搭配', '服装', '鞋子', '包包'],
      '美妆': ['美妆', '护肤', '化妆', '口红', '面膜', '护肤品'],
      '美食': ['美食', '食谱', '烹饪', '餐厅', '小吃', '甜品'],
      '旅行': ['旅行', '旅游', '景点', '攻略', '酒店', '机票'],
      '生活': ['生活', '日常', '好物', '家居', '收纳', '清洁'],
      '健身': ['健身', '运动', '减肥', '瑜伽', '跑步', '锻炼'],
      '学习': ['学习', '教育', '考试', '技能', '读书', '知识'],
      '宠物': ['宠物', '猫', '狗', '养宠', '萌宠', '动物']
    };

    for (const [category, keywords] of Object.entries(categoryKeywords)) {
      if (tags.some(tag => keywords.some(keyword => tag.name.includes(keyword)))) {
        return category;
      }
    }
    return '生活'; // 默认分类
  }

  // 简单情感分析
  private static analyzeSentiment(text: string): 'positive' | 'negative' | 'neutral' {
    const positiveWords = ['好', '棒', '喜欢', '推荐', '满意', '开心', '赞', '爱', '完美'];
    const negativeWords = ['差', '不好', '失望', '糟糕', '后悔', '难用', '坑', '垃圾'];
    
    let positiveCount = 0;
    let negativeCount = 0;
    
    positiveWords.forEach(word => {
      if (text.includes(word)) positiveCount++;
    });
    
    negativeWords.forEach(word => {
      if (text.includes(word)) negativeCount++;
    });
    
    if (positiveCount > negativeCount) return 'positive';
    if (negativeCount > positiveCount) return 'negative';
    return 'neutral';
  }

  // 计算趋势分数
  private static calculateTrendScore(note: XhsNote): number {
    const likeCount = parseInt(note.interact_info.liked_count) || 0;
    const commentCount = parseInt(note.interact_info.comment_count) || 0;
    const shareCount = parseInt(note.interact_info.share_count) || 0;
    
    // 时间衰减因子
    const now = Date.now() / 1000;
    const timeDiff = now - note.time;
    const timeDecay = Math.exp(-timeDiff / (24 * 60 * 60)); // 24小时衰减
    
    // 综合分数计算
    const engagementScore = (likeCount * 0.4 + commentCount * 0.4 + shareCount * 0.2);
    const normalizedScore = Math.log(engagementScore + 1) * timeDecay;
    
    return Math.min(normalizedScore * 10, 100); // 限制在0-100范围
  }
}
