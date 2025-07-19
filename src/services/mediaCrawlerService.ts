// MediaCrawler集成服务 - 浏览器兼容版本

// 真实小红书数据接口
export interface XhsRealNote {
  note_id: string;
  title: string;
  desc: string;
  type: string;
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
  time: number;
  last_update_time: number;
}

export interface CrawlerStats {
  totalNotes: number;
  activeUsers: number;
  dailyPosts: number;
  totalInteractions: number;
  growthRate: {
    notes: number;
    users: number;
    interactions: number;
  };
}

// MediaCrawler服务类 - 浏览器兼容版本
class MediaCrawlerService {
  private isInitialized: boolean = false;

  constructor() {
    // 浏览器环境下的构造函数
  }

  // 初始化MediaCrawler环境 - 浏览器版本
  async initialize(): Promise<boolean> {
    try {
      // 浏览器环境下模拟初始化
      console.log('🌐 浏览器环境：MediaCrawler服务模拟模式');

      // 模拟初始化延迟
      await new Promise(resolve => setTimeout(resolve, 1000));

      this.isInitialized = true;
      console.log('✅ MediaCrawler模拟服务初始化完成');
      return true;

    } catch (error) {
      console.error('MediaCrawler初始化失败:', error);
      return false;
    }
  }

  // 模拟数据生成方法
  private generateMockData(keyword: string, count: number): XhsRealNote[] {
    const notes: XhsRealNote[] = [];
    const categories = ['时尚', '美妆', '生活', '美食', '旅行', '健身', '学习', '宠物'];

    for (let i = 0; i < count; i++) {
      const category = categories[Math.floor(Math.random() * categories.length)];

      notes.push({
        note_id: `${keyword}_${Date.now()}_${i}`,
        title: `${keyword}相关分享 #${i + 1}`,
        desc: `关于${keyword}的详细分享，包含了实用的经验和心得...`,
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
  }

  // 爬取小红书搜索结果 - 浏览器版本（生成模拟数据）
  async crawlXhsSearch(keywords: string[], maxResults: number = 20): Promise<XhsRealNote[]> {
    if (!this.isInitialized) {
      throw new Error('MediaCrawler未初始化');
    }

    try {
      const notes: XhsRealNote[] = [];

      for (const keyword of keywords) {
        console.log(`正在模拟爬取关键词: ${keyword}`);

        // 模拟网络延迟
        await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

        // 生成模拟数据
        const mockNotes = this.generateMockData(keyword, Math.ceil(maxResults / keywords.length));
        notes.push(...mockNotes);

        console.log(`✅ 模拟爬取 ${keyword} 完成，获得 ${mockNotes.length} 条数据`);
      }

      return notes.slice(0, maxResults);

    } catch (error) {
      console.error('模拟爬取失败:', error);
      throw error;
    }
  }



  // 分析爬取的数据，生成统计信息
  async analyzeData(notes: XhsRealNote[]): Promise<CrawlerStats> {
    if (notes.length === 0) {
      return {
        totalNotes: 0,
        activeUsers: 0,
        dailyPosts: 0,
        totalInteractions: 0,
        growthRate: { notes: 0, users: 0, interactions: 0 }
      };
    }

    // 计算总互动数
    const totalInteractions = notes.reduce((sum, note) => {
      const likes = parseInt(note.interact_info.liked_count) || 0;
      const comments = parseInt(note.interact_info.comment_count) || 0;
      const shares = parseInt(note.interact_info.share_count) || 0;
      return sum + likes + comments + shares;
    }, 0);

    // 计算独特用户数
    const uniqueUsers = new Set(notes.map(note => note.user.user_id)).size;

    // 计算时间范围内的日均发布
    const timestamps = notes.map(note => note.time).filter(t => t > 0);
    const minTime = Math.min(...timestamps);
    const maxTime = Math.max(...timestamps);
    const daysDiff = Math.max(1, (maxTime - minTime) / (24 * 60 * 60));
    const dailyPosts = Math.round(notes.length / daysDiff);

    // 模拟增长率计算（基于数据分布）
    const recentNotes = notes.filter(note => {
      const daysSincePost = (Date.now() / 1000 - note.time) / (24 * 60 * 60);
      return daysSincePost <= 7; // 最近7天
    });

    const recentRatio = recentNotes.length / notes.length;
    const growthRate = {
      notes: (recentRatio - 0.3) * 100, // 基准30%
      users: (uniqueUsers / notes.length) * 50, // 用户活跃度转换
      interactions: (totalInteractions / notes.length - 1000) / 100 // 基于平均互动数
    };

    return {
      totalNotes: notes.length * 1000, // 扩展到平台规模
      activeUsers: uniqueUsers * 10000, // 扩展到平台规模
      dailyPosts: dailyPosts * 100, // 扩展到平台规模
      totalInteractions,
      growthRate
    };
  }

  // 健康检查 - 浏览器版本
  async healthCheck(): Promise<boolean> {
    return this.isInitialized;
  }

  // 清理数据文件 - 浏览器版本
  async cleanupData(): Promise<void> {
    console.log('浏览器环境：无需清理数据文件');
  }
}

// 导出单例
export const mediaCrawlerService = new MediaCrawlerService();
