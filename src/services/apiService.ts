// API服务 - 调用后端接口获取真实数据
export class ApiService {
  private baseUrl = '/api'; // 使用Vite代理

  // 检查后端服务是否可用
  async checkBackendHealth(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 5000
      });
      return response.ok;
    } catch (error) {
      console.warn('后端服务不可用:', error);
      return false;
    }
  }

  // 获取热门话题数据
  async getHotTopics(limit: number = 20): Promise<any[]> {
    try {
      const response = await fetch(`${this.baseUrl}/topics/hot?limit=${limit}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 10000
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.topics || [];
    } catch (error) {
      console.error('获取热门话题失败:', error);
      throw error;
    }
  }

  // 获取平台统计数据
  async getPlatformStats(): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/stats/platform`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 10000
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.stats || {};
    } catch (error) {
      console.error('获取平台统计失败:', error);
      throw error;
    }
  }

  // 获取用户行为分析数据
  async getUserBehaviorAnalysis(): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/analysis/user-behavior`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 10000
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.analysis || {};
    } catch (error) {
      console.error('获取用户行为分析失败:', error);
      throw error;
    }
  }

  // 搜索话题
  async searchTopics(keyword: string, limit: number = 20): Promise<any[]> {
    try {
      const response = await fetch(`${this.baseUrl}/topics/search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          keyword,
          limit
        }),
        timeout: 15000
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.topics || [];
    } catch (error) {
      console.error('搜索话题失败:', error);
      throw error;
    }
  }
}

export const apiService = new ApiService();
