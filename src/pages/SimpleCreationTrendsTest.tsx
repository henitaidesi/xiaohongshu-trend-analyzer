// 简化版创作趋势分析页面 - 用于测试
import React, { useState, useEffect } from 'react';
import { 
  Card, Row, Col, Statistic, Table, Tag, Button, 
  Select, Space, Typography, message, Tabs
} from 'antd';
import { 
  TrendingUpOutlined, LikeOutlined, EyeOutlined,
  ReloadOutlined, FilterOutlined, LineChartOutlined,
  FireOutlined, ClockCircleOutlined
} from '@ant-design/icons';
import { simpleDataService } from '../services/simpleDataService';

const { Option } = Select;
const { Title, Text } = Typography;

interface TrendData {
  category: string;
  count: number;
  growth: number;
  engagement: number;
}

const SimpleCreationTrendsTest: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [trendData, setTrendData] = useState<TrendData[]>([]);
  const [activeTab, setActiveTab] = useState<string>('trends');

  // 加载数据
  const loadData = async () => {
    setLoading(true);
    try {
      const topics = await simpleDataService.getHotTopics(20);
      generateTrendAnalysis(topics);
      message.success('数据加载完成');
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
        categoryStats[category] = { count: 0, totalEngagement: 0 };
      }
      categoryStats[category].count++;
      categoryStats[category].totalEngagement += Math.random() * 100;
    });

    const trends = Object.entries(categoryStats).map(([category, stats]: [string, any]) => ({
      category,
      count: stats.count,
      growth: (Math.random() - 0.5) * 40,
      engagement: Math.floor(stats.totalEngagement / stats.count)
    }));

    setTrendData(trends.sort((a, b) => b.count - a.count));
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
      key: 'count'
    },
    {
      title: '增长趋势',
      dataIndex: 'growth',
      key: 'growth',
      render: (growth: number) => (
        <Text style={{ color: growth > 0 ? '#52c41a' : '#ff4d4f' }}>
          {growth > 0 ? '+' : ''}{growth.toFixed(1)}%
        </Text>
      )
    },
    {
      title: '参与度',
      dataIndex: 'engagement',
      key: 'engagement',
      render: (engagement: number) => `${engagement}%`
    }
  ];

  // 渲染趋势分析标签页
  const renderTrendsTab = () => (
    <>
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
              value="21:00"
              prefix={<ClockCircleOutlined style={{ color: '#722ed1' }} />}
            />
          </Card>
        </Col>
      </Row>

      <Card title="分类趋势分析">
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
    <Card title="🔥 内容建议">
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <FireOutlined style={{ fontSize: '48px', color: '#ff4d4f', marginBottom: '16px' }} />
        <Title level={3}>内容建议功能</Title>
        <Text type="secondary">基于热门话题生成创作建议</Text>
      </div>
    </Card>
  );

  // 标签页配置
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
    }
  ];

  useEffect(() => {
    loadData();
  }, []);

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

export default SimpleCreationTrendsTest;
