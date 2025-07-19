// AI服务 - 集成DeepSeek API进行智能内容生成
import type { RealTopicData } from './simpleDataService';

interface AIConfig {
  apiKey?: string;
  baseURL?: string;
  model?: string;
}

interface ContentSuggestion {
  title: string;
  description: string;
  tags: string[];
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedViews: number;
  trendScore: number;
  reasons: string[];
}

interface TitleSuggestion {
  title: string;
  category: string;
  appeal: number;
  keywords: string[];
  style: 'informative' | 'emotional' | 'question' | 'list' | 'comparison';
  reasons: string[];
}

class AIService {
  private config: AIConfig;
  private isConfigured: boolean = false;

  constructor() {
    this.config = {
      baseURL: 'https://api.deepseek.com/v1',
      model: 'deepseek-chat',
      apiKey: undefined
    };
  }

  // 配置API密钥
  configure(apiKey: string, baseURL?: string, model?: string) {
    this.config.apiKey = apiKey;
    if (baseURL) this.config.baseURL = baseURL;
    if (model) this.config.model = model;
    this.isConfigured = !!apiKey;
    console.log('🤖 AI服务已配置');
  }

  // 检查是否已配置
  isReady(): boolean {
    return this.isConfigured && !!this.config.apiKey;
  }

  // 调用DeepSeek API
  private async callDeepSeekAPI(messages: any[], temperature: number = 0.7): Promise<string> {
    if (!this.isReady()) {
      throw new Error('AI服务未配置，请先提供API密钥');
    }

    try {
      const response = await fetch(`${this.config.baseURL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.apiKey}`
        },
        body: JSON.stringify({
          model: this.config.model,
          messages: messages,
          temperature: temperature,
          max_tokens: 2000,
          stream: false
        })
      });

      if (!response.ok) {
        throw new Error(`API调用失败: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return data.choices[0]?.message?.content || '';
    } catch (error) {
      console.error('❌ DeepSeek API调用失败:', error);
      throw error;
    }
  }

  // 基于真实数据生成内容创意
  async generateContentIdeas(
    realData: RealTopicData[], 
    category?: string, 
    count: number = 5
  ): Promise<ContentSuggestion[]> {
    if (!this.isReady()) {
      return this.getFallbackContentIdeas(category, count);
    }

    try {
      // 分析真实数据趋势
      const trendAnalysis = this.analyzeTrends(realData, category);
      
      const prompt = `
作为小红书内容策略专家，基于以下真实数据分析，生成${count}个高质量内容创意：

数据分析：
${JSON.stringify(trendAnalysis, null, 2)}

要求：
1. 基于数据中的热门话题和趋势
2. 考虑用户参与度和互动数据
3. 结合当前时间节点和季节性因素
4. 每个创意包含：标题、描述、标签、分类、难度、预估浏览量、趋势评分、推荐理由

请以JSON格式返回，格式如下：
[
  {
    "title": "具体标题",
    "description": "详细描述",
    "tags": ["标签1", "标签2"],
    "category": "分类",
    "difficulty": "beginner|intermediate|advanced",
    "estimatedViews": 数字,
    "trendScore": 数字(0-100),
    "reasons": ["理由1", "理由2"]
  }
]
`;

      const messages = [
        { role: 'system', content: '你是一个专业的小红书内容策略专家，擅长基于数据分析生成高质量内容创意。' },
        { role: 'user', content: prompt }
      ];

      const response = await this.callDeepSeekAPI(messages, 0.8);
      const suggestions = JSON.parse(response);
      
      console.log('🤖 AI生成内容创意成功');
      return suggestions;
    } catch (error) {
      console.warn('⚠️ AI内容创意生成失败，使用备用方案:', error);
      return this.getFallbackContentIdeas(category, count);
    }
  }

  // 基于真实数据生成标题建议
  async generateTitleSuggestions(
    realData: RealTopicData[], 
    keyword?: string, 
    category?: string,
    count: number = 8
  ): Promise<TitleSuggestion[]> {
    if (!this.isReady()) {
      return this.getFallbackTitleSuggestions(keyword, category, count);
    }

    try {
      // 分析相关数据
      const relevantData = this.filterRelevantData(realData, keyword, category);
      const topPerformers = relevantData
        .sort((a, b) => (b.likeCount + b.commentCount) - (a.likeCount + a.commentCount))
        .slice(0, 10);

      const prompt = `
作为小红书标题优化专家，基于以下高表现内容数据，生成${count}个吸引人的标题：

关键词：${keyword || '通用'}
分类：${category || '全分类'}

高表现内容参考：
${topPerformers.map(item => `- ${item.title} (点赞:${item.likeCount}, 评论:${item.commentCount})`).join('\n')}

要求：
1. 标题要有吸引力和点击欲望
2. 融入热门关键词和话题
3. 考虑不同的标题风格（信息型、情感型、疑问型、列表型、对比型）
4. 每个标题包含：标题、分类、吸引力评分、关键词、风格、推荐理由

请以JSON格式返回：
[
  {
    "title": "具体标题",
    "category": "分类",
    "appeal": 数字(0-100),
    "keywords": ["关键词1", "关键词2"],
    "style": "informative|emotional|question|list|comparison",
    "reasons": ["理由1", "理由2"]
  }
]
`;

      const messages = [
        { role: 'system', content: '你是一个专业的小红书标题优化专家，擅长创作高点击率标题。' },
        { role: 'user', content: prompt }
      ];

      const response = await this.callDeepSeekAPI(messages, 0.9);
      const suggestions = JSON.parse(response);
      
      console.log('🤖 AI生成标题建议成功');
      return suggestions;
    } catch (error) {
      console.warn('⚠️ AI标题建议生成失败，使用备用方案:', error);
      return this.getFallbackTitleSuggestions(keyword, category, count);
    }
  }

  // 分析数据趋势
  private analyzeTrends(data: RealTopicData[], category?: string): any {
    const filteredData = category 
      ? data.filter(item => item.category === category)
      : data;

    // 分析热门标签
    const tagCounts: { [key: string]: number } = {};
    filteredData.forEach(item => {
      item.tags?.forEach(tag => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    });

    const hotTags = Object.entries(tagCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([tag, count]) => ({ tag, count }));

    // 分析高表现内容
    const topContent = filteredData
      .sort((a, b) => (b.likeCount + b.commentCount) - (a.likeCount + a.commentCount))
      .slice(0, 5)
      .map(item => ({
        title: item.title,
        engagement: item.likeCount + item.commentCount,
        category: item.category
      }));

    // 分析时间趋势
    const timeDistribution: { [key: string]: number } = {};
    filteredData.forEach(item => {
      const month = item.publishTime?.substring(0, 7) || '2025-07';
      timeDistribution[month] = (timeDistribution[month] || 0) + 1;
    });

    return {
      totalItems: filteredData.length,
      category: category || '全分类',
      hotTags,
      topContent,
      timeDistribution,
      avgEngagement: filteredData.reduce((sum, item) => sum + item.likeCount + item.commentCount, 0) / filteredData.length
    };
  }

  // 过滤相关数据
  private filterRelevantData(data: RealTopicData[], keyword?: string, category?: string): RealTopicData[] {
    return data.filter(item => {
      const matchesCategory = !category || item.category === category;
      const matchesKeyword = !keyword || 
        item.title?.includes(keyword) || 
        item.tags?.some(tag => tag.includes(keyword));
      return matchesCategory && matchesKeyword;
    });
  }

  // 备用内容创意（当AI不可用时）
  private getFallbackContentIdeas(category?: string, count: number = 5): ContentSuggestion[] {
    const fallbackIdeas: ContentSuggestion[] = [
      {
        title: "2025年最值得入手的好物清单",
        description: "基于真实用户反馈，精选年度最受欢迎的好物推荐",
        tags: ["好物推荐", "2025", "种草", "实用"],
        category: category || "生活方式",
        difficulty: "beginner",
        estimatedViews: 15000,
        trendScore: 85,
        reasons: ["年度总结类内容受欢迎", "好物推荐是热门话题"]
      },
      {
        title: "新手必看！从零开始的完整攻略",
        description: "详细的新手指南，包含所有必要步骤和注意事项",
        tags: ["新手", "攻略", "教程", "必看"],
        category: category || "学习成长",
        difficulty: "beginner",
        estimatedViews: 12000,
        trendScore: 78,
        reasons: ["新手内容需求量大", "教程类内容实用性强"]
      }
    ];

    return fallbackIdeas.slice(0, count);
  }

  // 备用标题建议（当AI不可用时）
  private getFallbackTitleSuggestions(keyword?: string, category?: string, count: number = 8): TitleSuggestion[] {
    const baseKeyword = keyword || "好物";
    const fallbackTitles: TitleSuggestion[] = [
      {
        title: `${baseKeyword}种草！这个真的太好用了`,
        category: category || "生活方式",
        appeal: 85,
        keywords: [baseKeyword, "种草", "好用"],
        style: "emotional",
        reasons: ["情感化表达吸引点击", "种草是热门话题"]
      },
      {
        title: `${baseKeyword}测评｜真实使用感受分享`,
        category: category || "生活方式",
        appeal: 82,
        keywords: [baseKeyword, "测评", "真实"],
        style: "informative",
        reasons: ["测评内容可信度高", "真实体验受欢迎"]
      }
    ];

    return fallbackTitles.slice(0, count);
  }
}

// 导出单例
export const aiService = new AIService();
export type { ContentSuggestion, TitleSuggestion, AIConfig };
