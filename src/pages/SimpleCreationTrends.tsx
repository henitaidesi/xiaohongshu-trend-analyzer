// 简化版创作趋势页面
import React, { useState, useEffect } from 'react';
import {
  Card, Row, Col, Statistic, Progress, Table, Tag, Button,
  Select, Space, Typography, Tooltip, message
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
  ClockCircleOutlined, EyeOutlined, LikeOutlined, CommentOutlined,
  ReloadOutlined, FilterOutlined, RiseOutlined, FireOutlined, SendOutlined
} from '@ant-design/icons';
import { simpleDataService } from '../services/simpleDataService';

const { Option } = Select;
const { Title, Text } = Typography;

interface TrendData {
  category: string;
  count: number;
  growth: number;
  avgLikes: number;
  avgComments: number;
  avgShares: number;
  bestTime: string;
  engagement: number;
}

const SimpleCreationTrends: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [trendData, setTrendData] = useState<TrendData[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // 加载数据 - 使用全部53,000条数据进行趋势分析
  const loadData = async () => {
    setLoading(true);
    try {
      console.log('📈 开始加载创作趋势数据...');

      // 获取全部53,000条数据用于趋势分析
      const topics = await simpleDataService.getHotTopics(53000);
      console.log(`📊 成功获取 ${topics.length} 条数据用于趋势分析`);

      // 生成趋势分析数据
      generateTrendAnalysis(topics);
    } catch (error) {
      message.error('数据加载失败');
      console.error('❌ 加载数据失败:', error);
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
          totalShares: 0,
          totalViews: 0
        };
      }
      
      categoryStats[category].count++;
      categoryStats[category].totalLikes += topic.likeCount;
      categoryStats[category].totalComments += topic.commentCount;
      categoryStats[category].totalShares += topic.shareCount;
      categoryStats[category].totalViews += topic.viewCount;
    });

    const trends = Object.entries(categoryStats).map(([category, stats]: [string, any]) => ({
      category,
      count: stats.count,
      growth: (Math.random() - 0.5) * 40, // 模拟增长率
      avgLikes: Math.floor(stats.totalLikes / stats.count),
      avgComments: Math.floor(stats.totalComments / stats.count),
      avgShares: Math.floor(stats.totalShares / stats.count),
      bestTime: ['09:00', '12:00', '15:00', '18:00', '21:00'][Math.floor(Math.random() * 5)],
      engagement: Math.floor((stats.totalLikes + stats.totalComments + stats.totalShares) / stats.totalViews * 100)
    }));

    setTrendData(trends.sort((a, b) => b.count - a.count));
  };

  // 表格列定义
  const columns: ColumnsType<TrendData> = [
    {
      title: '分类',
      dataIndex: 'category',
      key: 'category',
      render: (category: string) => (
        <Tag color="blue" style={{ fontSize: '14px', padding: '4px 8px' }}>
          {category}
        </Tag>
      )
    },
    {
      title: '内容数量',
      dataIndex: 'count',
      key: 'count',
      render: (count: number) => (
        <Text strong style={{ fontSize: '16px' }}>{count.toLocaleString()}</Text>
      )
    },
    {
      title: '增长趋势',
      dataIndex: 'growth',
      key: 'growth',
      render: (growth: number) => (
        <Space>
          {growth > 0 ? (
            <RiseOutlined style={{ color: '#52c41a' }} />
          ) : (
            <RiseOutlined style={{ color: '#ff4d4f', transform: 'rotate(180deg)' }} />
          )}
          <Text style={{ color: growth > 0 ? '#52c41a' : '#ff4d4f' }}>
            {Math.abs(growth).toFixed(1)}%
          </Text>
        </Space>
      )
    },
    {
      title: '平均互动',
      key: 'avgInteraction',
      render: (record: TrendData) => (
        <Space direction="vertical" size={2}>
          <Space size={8}>
            <Tooltip title="平均点赞">
              <Space size={2}>
                <LikeOutlined style={{ color: '#ff4d4f' }} />
                <Text style={{ fontSize: '12px' }}>{record.avgLikes.toLocaleString()}</Text>
              </Space>
            </Tooltip>
            <Tooltip title="平均评论">
              <Space size={2}>
                <CommentOutlined style={{ color: '#1890ff' }} />
                <Text style={{ fontSize: '12px' }}>{record.avgComments}</Text>
              </Space>
            </Tooltip>
            <Tooltip title="平均分享">
              <Space size={2}>
                <SendOutlined style={{ color: '#52c41a' }} />
                <Text style={{ fontSize: '12px' }}>{record.avgShares}</Text>
              </Space>
            </Tooltip>
          </Space>
        </Space>
      )
    },
    {
      title: '最佳发布时间',
      dataIndex: 'bestTime',
      key: 'bestTime',
      render: (time: string) => (
        <Space>
          <ClockCircleOutlined style={{ color: '#faad14' }} />
          <Text>{time}</Text>
        </Space>
      )
    },
    {
      title: '参与度',
      dataIndex: 'engagement',
      key: 'engagement',
      render: (engagement: number) => (
        <div style={{ width: 80 }}>
          <Progress 
            percent={Math.min(engagement, 100)} 
            size="small" 
            strokeColor={engagement > 15 ? '#52c41a' : engagement > 10 ? '#faad14' : '#ff4d4f'}
            format={() => `${engagement}%`}
          />
        </div>
      )
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
          <RiseOutlined style={{ color: '#1890ff', marginRight: '8px' }} />
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
                value={selectedCategory}
                onChange={setSelectedCategory}
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
              prefix={<RiseOutlined style={{ color: '#faad14' }} />}
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

      {/* 主要内容 */}
      <Card title="分类趋势分析">
        <Table
          columns={columns}
          dataSource={trendData}
          rowKey="category"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: false,
            showQuickJumper: false,
            showTotal: (total) => `共 ${total} 个分类`
          }}
        />
      </Card>
    </div>
  );
};

export default SimpleCreationTrends;
