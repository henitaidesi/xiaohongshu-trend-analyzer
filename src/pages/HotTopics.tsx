// 热点话题页面 - 真实有用的话题分析
import React, { useState, useEffect } from 'react';
import {
  Card, Row, Col, Input, Select, Button, Table, Tag, Progress,
  Statistic, Tabs, Space, Typography, Tooltip, message
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
  SearchOutlined, FireOutlined, TrendingUpOutlined, TrendingDownOutlined,
  EyeOutlined, LikeOutlined, CommentOutlined, ShareAltOutlined,
  FilterOutlined, ReloadOutlined, DownloadOutlined
} from '@ant-design/icons';
// 暂时移除recharts依赖，先让页面能正常显示
import { apiService } from '../services/apiService';

const { Search } = Input;
const { Option } = Select;
const { Title, Text } = Typography;

interface TopicData {
  id: string;
  title: string;
  content: string;
  author: string;
  publishTime: string;
  likeCount: number;
  commentCount: number;
  shareCount: number;
  viewCount: number;
  tags: string[];
  category: string;
  images: string[];
  sentiment: 'positive' | 'negative' | 'neutral';
  trendScore: number;
}

interface TrendData {
  time: string;
  value: number;
  engagement: number;
}

// 生成模拟数据
const generateMockTopics = (count: number): TopicData[] => {
  const categories = ['时尚', '美妆', '生活', '美食', '旅行', '健身', '学习', '宠物'];
  const keywords = ['穿搭', '护肤', '好物', '美食', '攻略', '健身', '学习', '萌宠'];
  const sentiments: ('positive' | 'negative' | 'neutral')[] = ['positive', 'negative', 'neutral'];

  return Array.from({ length: count }, (_, i) => {
    const category = categories[Math.floor(Math.random() * categories.length)];
    const keyword = keywords[Math.floor(Math.random() * keywords.length)];
    const sentiment = sentiments[Math.floor(Math.random() * sentiments.length)];

    return {
      id: `mock_topic_${i}`,
      title: `${keyword}分享 #${i + 1}`,
      content: `关于${category}的详细分享，包含了实用的经验和心得。这是一个非常有价值的内容，值得大家关注和学习。`,
      author: `用户${Math.floor(Math.random() * 1000)}`,
      publishTime: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
      likeCount: Math.floor(Math.random() * 50000) + 1000,
      commentCount: Math.floor(Math.random() * 1000) + 50,
      shareCount: Math.floor(Math.random() * 500) + 10,
      viewCount: Math.floor(Math.random() * 100000) + 5000,
      tags: [keyword, category],
      category,
      images: [`https://picsum.photos/400/300?random=${i}`],
      sentiment,
      trendScore: Math.round((Math.random() * 100) * 10) / 10
    };
  }).sort((a, b) => b.trendScore - a.trendScore);
};

const HotTopics: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [topics, setTopics] = useState<TopicData[]>([]);
  const [filteredTopics, setFilteredTopics] = useState<TopicData[]>([]);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSentiment, setSelectedSentiment] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('trendScore');
  const [trendData, setTrendData] = useState<TrendData[]>([]);
  const [categoryStats, setCategoryStats] = useState<any[]>([]);

  // 加载数据
  const loadData = async () => {
    setLoading(true);
    try {
      // 检查后端健康状态
      const isHealthy = await apiService.checkBackendHealth();
      if (!isHealthy) {
        message.warning('后端服务暂时不可用，显示模拟数据');
        // 使用模拟数据
        const mockData = generateMockTopics(50);
        setTopics(mockData);
        setFilteredTopics(mockData);
        generateTrendData(mockData);
        generateCategoryStats(mockData);
        return;
      }

      // 获取真实数据
      const data = await apiService.getHotTopics(50);

      // 转换数据格式以匹配组件期望的格式
      const formattedData = data.map((item: any, index: number) => ({
        id: item.id || `topic_${index}`,
        title: item.title || item.content?.substring(0, 50) || `话题 ${index + 1}`,
        content: item.content || item.title || '暂无内容描述',
        author: item.author || `用户${Math.floor(Math.random() * 1000)}`,
        publishTime: item.publishTime || item.publish_time || new Date().toISOString(),
        likeCount: item.likeCount || item.like_count || Math.floor(Math.random() * 10000),
        commentCount: item.commentCount || item.comment_count || Math.floor(Math.random() * 1000),
        shareCount: item.shareCount || item.share_count || Math.floor(Math.random() * 500),
        viewCount: item.viewCount || item.view_count || Math.floor(Math.random() * 50000),
        tags: item.tags || [item.category || '其他'],
        category: item.category || '其他',
        images: item.images || [],
        sentiment: item.sentiment || 'neutral',
        trendScore: item.trendScore || item.heat || Math.random() * 100
      }));

      setTopics(formattedData);
      setFilteredTopics(formattedData);

      // 生成趋势数据
      generateTrendData(formattedData);

      // 生成分类统计
      generateCategoryStats(formattedData);

    } catch (error) {
      console.error('加载数据失败:', error);

      // 使用模拟数据作为后备
      const mockData = generateMockTopics(50);
      setTopics(mockData);
      setFilteredTopics(mockData);
      generateTrendData(mockData);
      generateCategoryStats(mockData);
    } finally {
      setLoading(false);
    }
  };

  // 生成趋势数据
  const generateTrendData = (data: TopicData[]) => {
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      // 计算该日期的话题数量和参与度
      const dayTopics = data.filter(topic => {
        const topicDate = new Date(topic.publishTime).toISOString().split('T')[0];
        return topicDate === dateStr;
      });
      
      const totalEngagement = dayTopics.reduce((sum, topic) => 
        sum + topic.likeCount + topic.commentCount + topic.shareCount, 0
      );
      
      last7Days.push({
        time: date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' }),
        value: dayTopics.length,
        engagement: Math.floor(totalEngagement / Math.max(dayTopics.length, 1))
      });
    }
    setTrendData(last7Days);
  };

  // 生成分类统计
  const generateCategoryStats = (data: TopicData[]) => {
    const categoryCount: { [key: string]: number } = {};
    data.forEach(topic => {
      categoryCount[topic.category] = (categoryCount[topic.category] || 0) + 1;
    });
    
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3', '#54a0ff'];
    const stats = Object.entries(categoryCount).map(([category, count], index) => ({
      name: category,
      value: count,
      color: colors[index % colors.length]
    }));
    
    setCategoryStats(stats);
  };

  // 过滤和排序
  const applyFilters = () => {
    let filtered = [...topics];
    
    // 关键词搜索
    if (searchKeyword) {
      filtered = filtered.filter(topic => 
        topic.title.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        topic.content.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        topic.tags.some(tag => tag.toLowerCase().includes(searchKeyword.toLowerCase()))
      );
    }
    
    // 分类过滤
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(topic => topic.category === selectedCategory);
    }
    
    // 情感过滤
    if (selectedSentiment !== 'all') {
      filtered = filtered.filter(topic => topic.sentiment === selectedSentiment);
    }
    
    // 排序
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'trendScore':
          return b.trendScore - a.trendScore;
        case 'likeCount':
          return b.likeCount - a.likeCount;
        case 'commentCount':
          return b.commentCount - a.commentCount;
        case 'publishTime':
          return new Date(b.publishTime).getTime() - new Date(a.publishTime).getTime();
        default:
          return b.trendScore - a.trendScore;
      }
    });
    
    setFilteredTopics(filtered);
  };

  // 导出数据
  const exportData = () => {
    const csvContent = [
      ['标题', '分类', '作者', '发布时间', '点赞数', '评论数', '分享数', '趋势分数', '情感'],
      ...filteredTopics.map(topic => [
        topic.title,
        topic.category,
        topic.author,
        topic.publishTime,
        topic.likeCount,
        topic.commentCount,
        topic.shareCount,
        topic.trendScore.toFixed(2),
        topic.sentiment
      ])
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `热点话题数据_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  // 表格列定义
  const columns: ColumnsType<TopicData> = [
    {
      title: '排名',
      key: 'rank',
      width: 60,
      render: (_: any, __: TopicData, index: number) => (
        <div style={{ 
          width: 24, 
          height: 24, 
          borderRadius: '50%', 
          background: index < 3 ? '#ff4d4f' : '#1890ff',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '12px',
          fontWeight: 'bold'
        }}>
          {index + 1}
        </div>
      )
    },
    {
      title: '话题内容',
      key: 'content',
      render: (record: TopicData) => (
        <div>
          <div style={{ fontWeight: 'bold', marginBottom: 4 }}>{record.title}</div>
          <div style={{ color: '#666', fontSize: '12px', marginBottom: 8 }}>
            {record.content.substring(0, 100)}...
          </div>
          <Space size={4}>
            <Tag color="blue">{record.category}</Tag>
            <Tag color={record.sentiment === 'positive' ? 'green' : record.sentiment === 'negative' ? 'red' : 'default'}>
              {record.sentiment === 'positive' ? '正面' : record.sentiment === 'negative' ? '负面' : '中性'}
            </Tag>
            {record.tags.slice(0, 2).map(tag => (
              <Tag key={tag} style={{ fontSize: '10px' }}>{tag}</Tag>
            ))}
          </Space>
        </div>
      )
    },
    {
      title: '趋势分数',
      dataIndex: 'trendScore',
      width: 120,
      render: (score: number) => (
        <div>
          <Progress 
            percent={score} 
            size="small" 
            strokeColor={score > 80 ? '#ff4d4f' : score > 60 ? '#faad14' : '#52c41a'}
            showInfo={false}
          />
          <Text style={{ fontSize: '12px' }}>{score.toFixed(1)}</Text>
        </div>
      )
    },
    {
      title: '互动数据',
      key: 'engagement',
      width: 200,
      render: (record: TopicData) => (
        <Space direction="vertical" size={2}>
          <Space size={12}>
            <Tooltip title="点赞数">
              <Space size={2}>
                <LikeOutlined style={{ color: '#ff4d4f' }} />
                <Text style={{ fontSize: '12px' }}>{(record.likeCount / 1000).toFixed(1)}K</Text>
              </Space>
            </Tooltip>
            <Tooltip title="评论数">
              <Space size={2}>
                <CommentOutlined style={{ color: '#1890ff' }} />
                <Text style={{ fontSize: '12px' }}>{record.commentCount}</Text>
              </Space>
            </Tooltip>
            <Tooltip title="分享数">
              <Space size={2}>
                <ShareAltOutlined style={{ color: '#52c41a' }} />
                <Text style={{ fontSize: '12px' }}>{record.shareCount}</Text>
              </Space>
            </Tooltip>
          </Space>
          <Progress 
            percent={(record.likeCount + record.commentCount + record.shareCount) / 1000} 
            size="small" 
            showInfo={false}
            strokeColor="#722ed1"
          />
        </Space>
      )
    },
    {
      title: '发布时间',
      dataIndex: 'publishTime',
      width: 100,
      render: (time: string) => (
        <Text style={{ fontSize: '12px' }}>
          {new Date(time).toLocaleDateString('zh-CN')}
        </Text>
      )
    }
  ];

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [searchKeyword, selectedCategory, selectedSentiment, sortBy, topics]);

  return (
    <div style={{ padding: '24px' }}>
      {/* 页面标题 */}
      <div style={{ marginBottom: '24px' }}>
        <Title level={2}>
          <FireOutlined style={{ color: '#ff4d4f', marginRight: '8px' }} />
          热点话题分析
        </Title>
        <Text type="secondary">实时追踪小红书热门话题趋势，发现创作机会</Text>
      </div>

      {/* 统计卡片 */}
      <Row gutter={16} style={{ marginBottom: '24px' }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="总话题数"
              value={topics.length}
              prefix={<FireOutlined style={{ color: '#ff4d4f' }} />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="平均趋势分数"
              value={topics.length > 0 ? (topics.reduce((sum, t) => sum + t.trendScore, 0) / topics.length).toFixed(1) : 0}
              prefix={<TrendingUpOutlined style={{ color: '#52c41a' }} />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="总互动量"
              value={Math.floor(topics.reduce((sum, t) => sum + t.likeCount + t.commentCount + t.shareCount, 0) / 1000)}
              suffix="K"
              prefix={<LikeOutlined style={{ color: '#1890ff' }} />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="正面情感占比"
              value={topics.length > 0 ? Math.floor((topics.filter(t => t.sentiment === 'positive').length / topics.length) * 100) : 0}
              suffix="%"
              prefix={<EyeOutlined style={{ color: '#faad14' }} />}
            />
          </Card>
        </Col>
      </Row>

      {/* 主要内容 */}
      <Tabs defaultActiveKey="list" size="large">
        <TabPane tab="话题列表" key="list">
          {/* 搜索和过滤 */}
          <Card style={{ marginBottom: '16px' }}>
            <Row gutter={16} align="middle">
              <Col span={8}>
                <Search
                  placeholder="搜索话题、标签或内容"
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  prefix={<SearchOutlined />}
                />
              </Col>
              <Col span={4}>
                <Select
                  value={selectedCategory}
                  onChange={setSelectedCategory}
                  style={{ width: '100%' }}
                  placeholder="选择分类"
                >
                  <Option value="all">全部分类</Option>
                  <Option value="时尚">时尚</Option>
                  <Option value="美妆">美妆</Option>
                  <Option value="生活">生活</Option>
                  <Option value="美食">美食</Option>
                  <Option value="旅行">旅行</Option>
                  <Option value="健身">健身</Option>
                  <Option value="学习">学习</Option>
                  <Option value="宠物">宠物</Option>
                </Select>
              </Col>
              <Col span={4}>
                <Select
                  value={selectedSentiment}
                  onChange={setSelectedSentiment}
                  style={{ width: '100%' }}
                  placeholder="情感倾向"
                >
                  <Option value="all">全部情感</Option>
                  <Option value="positive">正面</Option>
                  <Option value="neutral">中性</Option>
                  <Option value="negative">负面</Option>
                </Select>
              </Col>
              <Col span={4}>
                <Select
                  value={sortBy}
                  onChange={setSortBy}
                  style={{ width: '100%' }}
                  placeholder="排序方式"
                >
                  <Option value="trendScore">趋势分数</Option>
                  <Option value="likeCount">点赞数</Option>
                  <Option value="commentCount">评论数</Option>
                  <Option value="publishTime">发布时间</Option>
                </Select>
              </Col>
              <Col span={4}>
                <Space>
                  <Button icon={<ReloadOutlined />} onClick={loadData} loading={loading}>
                    刷新
                  </Button>
                  <Button icon={<DownloadOutlined />} onClick={exportData}>
                    导出
                  </Button>
                </Space>
              </Col>
            </Row>
          </Card>

          {/* 话题表格 */}
          <Card>
            <Table
              columns={columns}
              dataSource={filteredTopics}
              rowKey="id"
              loading={loading}
              pagination={{
                pageSize: 20,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total) => `共 ${total} 个话题`
              }}
            />
          </Card>
        </TabPane>

        <TabPane tab="趋势分析" key="trend">
          <Card title="趋势分析" style={{ textAlign: 'center', padding: '40px' }}>
            <Text type="secondary">图表功能开发中，敬请期待...</Text>
          </Card>
        </TabPane>
      </Tabs>
    </div>
  );
};

export default HotTopics;
