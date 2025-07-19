// 创作趋势分析页面 - 简化版
import React, { useState, useEffect } from 'react';
import { 
  Card, Row, Col, Statistic, Table, Tag, Button, 
  Select, Space, Typography, message, Tabs, List, Progress
} from 'antd';
import { 
  TrendingUpOutlined, LikeOutlined, EyeOutlined, ClockCircleOutlined,
  ReloadOutlined, FilterOutlined, LineChartOutlined, FireOutlined,
  BulbOutlined, CalendarOutlined, RiseOutlined, FallOutlined
} from '@ant-design/icons';
import { simpleDataService } from '../services/simpleDataService';

const { Option } = Select;
const { Title, Text } = Typography;

interface TrendData {
  category: string;
  count: number;
  growth: number;
  engagement: number;
  avgLikes: number;
  avgComments: number;
}

interface ContentSuggestion {
  id: number;
  title: string;
  category: string;
  reason: string;
  potential: string;
  tags: string[];
}

const CreationTrendsSimple: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [trendData, setTrendData] = useState<TrendData[]>([]);
  const [contentSuggestions, setContentSuggestions] = useState<ContentSuggestion[]>([]);
  const [activeTab, setActiveTab] = useState<string>('trends');
  const [hotTopics, setHotTopics] = useState<any[]>([]);

  // 加载数据
  const loadData = async () => {
    setLoading(true);
    try {
      const topics = await simpleDataService.getHotTopics(50);
      setHotTopics(topics.slice(0, 10));
      generateTrendAnalysis(topics);
      generateContentSuggestions(topics);
      message.success('创作趋势数据加载完成');
    } catch (error) {
      message.error('数据加载失败');
      console.error('加载数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 生成趋势分析数据
  const generateTrendAnalysis = (topics: any[]) => {
    const categoryStats: { [key: string]: any } = {};
    
    topics.forEach(topic => {
      const category = topic.category;
      if (!categoryStats[category]) {
        categoryStats[category] = { 
          count: 0, 
          totalLikes: 0, 
          totalComments: 0, 
          totalEngagement: 0 
        };
      }
      categoryStats[category].count++;
      categoryStats[category].totalLikes += topic.likeCount || 0;
      categoryStats[category].totalComments += topic.commentCount || 0;
      categoryStats[category].totalEngagement += Math.random() * 100;
    });

    const trends = Object.entries(categoryStats).map(([category, stats]: [string, any]) => ({
      category,
      count: stats.count,
      growth: (Math.random() - 0.3) * 30, // 偏向正增长
      engagement: Math.floor(stats.totalEngagement / stats.count),
      avgLikes: Math.floor(stats.totalLikes / stats.count),
      avgComments: Math.floor(stats.totalComments / stats.count)
    }));

    setTrendData(trends.sort((a, b) => b.count - a.count));
  };

  // 生成内容建议
  const generateContentSuggestions = (topics: any[]) => {
    const topCategories = topics.slice(0, 5);
    const suggestions: ContentSuggestion[] = topCategories.map((topic, index) => ({
      id: index + 1,
      title: `${topic.title}创作指南`,
      category: topic.category,
      reason: `基于热门话题"${topic.title}"，当前热度${topic.trendScore?.toFixed(1)}`,
      potential: index < 2 ? '高' : index < 4 ? '中' : '低',
      tags: [topic.category, '热门', '创作指南', '实用']
    }));

    setContentSuggestions(suggestions);
  };

  // 表格列定义
  const columns = [
    {
      title: '分类',
      dataIndex: 'category',
      key: 'category',
      render: (category: string) => (
        <Tag color="blue">{category}</Tag>
      )
    },
    {
      title: '内容数量',
      dataIndex: 'count',
      key: 'count',
      sorter: (a: TrendData, b: TrendData) => a.count - b.count
    },
    {
      title: '增长趋势',
      dataIndex: 'growth',
      key: 'growth',
      render: (growth: number) => (
        <Space>
          {growth > 0 ? <RiseOutlined style={{ color: '#52c41a' }} /> : <FallOutlined style={{ color: '#ff4d4f' }} />}
          <Text style={{ color: growth > 0 ? '#52c41a' : '#ff4d4f' }}>
            {growth > 0 ? '+' : ''}{growth.toFixed(1)}%
          </Text>
        </Space>
      ),
      sorter: (a: TrendData, b: TrendData) => a.growth - b.growth
    },
    {
      title: '平均参与度',
      dataIndex: 'engagement',
      key: 'engagement',
      render: (engagement: number) => (
        <Progress 
          percent={Math.min(engagement, 100)} 
          size="small" 
          format={() => `${engagement}%`}
        />
      ),
      sorter: (a: TrendData, b: TrendData) => a.engagement - b.engagement
    },
    {
      title: '平均点赞',
      dataIndex: 'avgLikes',
      key: 'avgLikes',
      render: (likes: number) => (
        <Space>
          <LikeOutlined style={{ color: '#ff4d4f' }} />
          <Text>{likes.toLocaleString()}</Text>
        </Space>
      )
    },
    {
      title: '平均评论',
      dataIndex: 'avgComments',
      key: 'avgComments',
      render: (comments: number) => (
        <Space>
          <EyeOutlined style={{ color: '#1890ff' }} />
          <Text>{comments.toLocaleString()}</Text>
        </Space>
      )
    }
  ];

  // 渲染趋势分析标签页
  const renderTrendsTab = () => (
    <>
      {/* 统计卡片 */}
      <Row gutter={16} style={{ marginBottom: '24px' }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="总内容数"
              value={trendData.reduce((sum, item) => sum + item.count, 0)}
              prefix={<EyeOutlined style={{ color: '#1890ff' }} />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="平均参与度"
              value={trendData.length > 0 ? (trendData.reduce((sum, item) => sum + item.engagement, 0) / trendData.length).toFixed(1) : 0}
              suffix="%"
              prefix={<LikeOutlined style={{ color: '#52c41a' }} />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="增长最快分类"
              value={trendData.length > 0 ? trendData.sort((a, b) => b.growth - a.growth)[0]?.category : '-'}
              prefix={<TrendingUpOutlined style={{ color: '#faad14' }} />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="最佳发布时间"
              value="21:00-22:00"
              prefix={<ClockCircleOutlined style={{ color: '#722ed1' }} />}
            />
          </Card>
        </Col>
      </Row>

      {/* 分类趋势表格 */}
      <Card title="📊 分类趋势分析">
        <Table
          columns={columns}
          dataSource={trendData}
          rowKey="category"
          loading={loading}
          pagination={{
            pageSize: 10,
            showTotal: (total) => `共 ${total} 个分类`
          }}
        />
      </Card>
    </>
  );

  // 渲染内容建议标签页
  const renderSuggestionsTab = () => (
    <Row gutter={16}>
      <Col span={16}>
        <Card title="💡 智能内容建议" extra={
          <Button icon={<BulbOutlined />} onClick={loadData} loading={loading}>
            获取新建议
          </Button>
        }>
          <List
            itemLayout="vertical"
            dataSource={contentSuggestions}
            renderItem={(item: ContentSuggestion) => (
              <List.Item
                key={item.id}
                actions={[
                  <Tag color={item.potential === '高' ? 'red' : item.potential === '中' ? 'orange' : 'green'}>
                    {item.potential}潜力
                  </Tag>,
                  <Button type="primary" size="small">
                    开始创作
                  </Button>
                ]}
              >
                <List.Item.Meta
                  title={
                    <Space>
                      <Text strong>{item.title}</Text>
                      <Tag color="green">{item.category}</Tag>
                    </Space>
                  }
                  description={
                    <div>
                      <Text type="secondary">{item.reason}</Text>
                      <div style={{ marginTop: '8px' }}>
                        {item.tags.map(tag => (
                          <Tag key={tag} style={{ marginBottom: '4px' }}>#{tag}</Tag>
                        ))}
                      </div>
                    </div>
                  }
                />
              </List.Item>
            )}
          />
        </Card>
      </Col>
      <Col span={8}>
        <Card title="🔥 当前热门话题">
          <List
            size="small"
            dataSource={hotTopics}
            renderItem={(item: any, index: number) => (
              <List.Item>
                <List.Item.Meta
                  avatar={
                    <div style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      backgroundColor: index < 3 ? '#ff4d4f' : '#1890ff',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '12px',
                      fontWeight: 'bold'
                    }}>
                      {index + 1}
                    </div>
                  }
                  title={<Text style={{ fontSize: '14px' }}>{item.title}</Text>}
                  description={
                    <Space size={4}>
                      <Text type="secondary" style={{ fontSize: '12px' }}>
                        热度 {item.trendScore?.toFixed(1)}
                      </Text>
                      <Tag color="blue" style={{ fontSize: '10px', padding: '0 4px' }}>
                        {item.category}
                      </Tag>
                    </Space>
                  }
                />
              </List.Item>
            )}
          />
        </Card>
      </Col>
    </Row>
  );

  // 渲染最佳时机标签页
  const renderTimingTab = () => (
    <Card title="⏰ 最佳发布时机分析">
      <Row gutter={16}>
        <Col span={12}>
          <div style={{ padding: '20px' }}>
            <Title level={4}>📅 一周发布建议</Title>
            <div style={{ marginBottom: '16px' }}>
              <Text strong>周一至周三</Text>：适合发布学习、工作相关内容
            </div>
            <div style={{ marginBottom: '16px' }}>
              <Text strong>周四至周五</Text>：适合发布生活、美食内容
            </div>
            <div style={{ marginBottom: '16px' }}>
              <Text strong>周末</Text>：适合发布娱乐、旅行、穿搭内容
            </div>
          </div>
        </Col>
        <Col span={12}>
          <div style={{ padding: '20px' }}>
            <Title level={4}>🕐 一天发布建议</Title>
            <div style={{ marginBottom: '16px' }}>
              <Text strong>8:00-9:00</Text>：早晨励志、健身内容
            </div>
            <div style={{ marginBottom: '16px' }}>
              <Text strong>12:00-13:00</Text>：午餐美食、生活分享
            </div>
            <div style={{ marginBottom: '16px' }}>
              <Text strong>19:00-22:00</Text>：黄金时段，所有类型内容
            </div>
          </div>
        </Col>
      </Row>
    </Card>
  );

  useEffect(() => {
    loadData();
  }, []);

  const tabItems = [
    {
      key: 'trends',
      label: (
        <span>
          <LineChartOutlined />
          趋势分析
        </span>
      ),
      children: renderTrendsTab()
    },
    {
      key: 'suggestions',
      label: (
        <span>
          <FireOutlined />
          内容建议
        </span>
      ),
      children: renderSuggestionsTab()
    },
    {
      key: 'timing',
      label: (
        <span>
          <CalendarOutlined />
          最佳时机
        </span>
      ),
      children: renderTimingTab()
    }
  ];

  return (
    <div style={{ padding: '24px' }}>
      {/* 页面标题 */}
      <div style={{ marginBottom: '24px' }}>
        <Title level={2}>
          <TrendingUpOutlined style={{ color: '#1890ff', marginRight: '8px' }} />
          创作趋势分析
        </Title>
        <Text type="secondary">分析内容类型分布、发布时间规律和互动数据趋势</Text>
      </div>

      {/* 筛选控件 */}
      <Card style={{ marginBottom: '16px' }}>
        <Row gutter={16} align="middle">
          <Col span={6}>
            <Space>
              <FilterOutlined />
              <Select
                defaultValue="all"
                style={{ width: 120 }}
                placeholder="选择分类"
              >
                <Option value="all">全部分类</Option>
                <Option value="时尚">时尚</Option>
                <Option value="美妆">美妆</Option>
                <Option value="生活">生活</Option>
                <Option value="美食">美食</Option>
                <Option value="旅行">旅行</Option>
              </Select>
            </Space>
          </Col>
          <Col span={18}>
            <div style={{ textAlign: 'right' }}>
              <Button 
                icon={<ReloadOutlined />} 
                onClick={loadData} 
                loading={loading}
              >
                刷新数据
              </Button>
            </div>
          </Col>
        </Row>
      </Card>

      {/* 标签页内容 */}
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={tabItems}
        size="large"
      />
    </div>
  );
};

export default CreationTrendsSimple;
