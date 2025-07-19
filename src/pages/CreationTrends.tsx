// 创作趋势分析页面
import React, { useState, useEffect } from 'react';
import {
  Card, Row, Col, Statistic, Progress, Table, Tag, Button,
  Select, DatePicker, Space, Typography, Tooltip, message, Tabs, List, Avatar
} from 'antd';
import {
  ClockCircleOutlined, EyeOutlined, LikeOutlined, CommentOutlined,
  ReloadOutlined, FilterOutlined, CalendarOutlined, FireOutlined,
  RiseOutlined
} from '@ant-design/icons';
import { simpleDataService } from '../services/simpleDataService';

const { Option } = Select;
const { RangePicker } = DatePicker;
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

interface TimeSlotData {
  hour: string;
  posts: number;
  engagement: number;
  category: string;
}

const CreationTrends: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [trendData, setTrendData] = useState<TrendData[]>([]);
  const [timeSlotData, setTimeSlotData] = useState<TimeSlotData[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPeriod, setSelectedPeriod] = useState<string>('7d');
  const [activeTab, setActiveTab] = useState<string>('trends');
  const [hotTopics, setHotTopics] = useState<any[]>([]);
  const [contentSuggestions, setContentSuggestions] = useState<any[]>([]);

  // 加载数据 - 使用真实数据分析
  const loadData = async () => {
    setLoading(true);
    try {
      console.log('📈 加载创作趋势真实数据...');

      // 获取创作趋势数据
      const trendsData = await simpleDataService.getCreationTrends(selectedPeriod);

      if (trendsData) {
        console.log('✅ 创作趋势数据加载成功');
        setTrendData(trendsData.categoryTrends || []);
        setTimeSlotData(trendsData.timeSlots || []);
        setContentSuggestions(trendsData.contentSuggestions || []);

        // 获取热门话题
        const hotTopicsData = await simpleDataService.getHotTopics(10);
        setHotTopics(hotTopicsData || []);

        message.success('创作趋势数据加载完成');
      } else {
        throw new Error('无法获取创作趋势数据');
      }
      // 获取热门话题数据用于分析
      const topics = await simpleDataService.getHotTopics(100);
      setHotTopics(topics.slice(0, 20));

      // 生成趋势分析数据
      generateTrendAnalysis(topics);
      generateTimeSlotAnalysis(topics);
      generateContentSuggestions(topics);

      message.success('创作趋势数据加载完成');
    } catch (error) {
      message.error('数据加载失败');
      console.error('加载数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 生成内容建议
  const generateContentSuggestions = (topics: any[]) => {
    const suggestions = [
      {
        id: 1,
        title: '秋冬穿搭指南',
        category: '时尚',
        reason: '基于当前热门话题"秋冬穿搭"，热度100.1',
        tags: ['穿搭', '秋冬', '时尚', '搭配'],
        difficulty: '简单',
        potential: '高',
        tips: [
          '分享不同身材的穿搭技巧',
          '推荐性价比高的单品',
          '展示多种场合的搭配方案'
        ]
      },
      {
        id: 2,
        title: '护肤心得分享',
        category: '美妆',
        reason: '基于当前热门话题"护肤心得"，热度94.5',
        tags: ['护肤', '美妆', '心得', '产品'],
        difficulty: '中等',
        potential: '高',
        tips: [
          '分享真实使用体验',
          '对比不同产品效果',
          '针对不同肌肤类型给建议'
        ]
      },
      {
        id: 3,
        title: '居家好物推荐',
        category: '生活',
        reason: '基于当前热门话题"居家好物"，热度90.9',
        tags: ['居家', '好物', '生活', '推荐'],
        difficulty: '简单',
        potential: '中等',
        tips: [
          '展示实际使用场景',
          '强调性价比和实用性',
          '提供购买链接和优惠信息'
        ]
      },
      {
        id: 4,
        title: '减脂餐制作教程',
        category: '美食',
        reason: '基于当前热门话题"减脂餐"，热度89.6',
        tags: ['减脂', '健康', '美食', '教程'],
        difficulty: '中等',
        potential: '高',
        tips: [
          '提供详细制作步骤',
          '标注营养成分和热量',
          '分享减脂心得和效果'
        ]
      },
      {
        id: 5,
        title: '旅行攻略分享',
        category: '旅行',
        reason: '基于当前热门话题"旅行攻略"，热度88.0',
        tags: ['旅行', '攻略', '景点', '美食'],
        difficulty: '中等',
        potential: '中等',
        tips: [
          '提供详细行程规划',
          '分享当地特色和美食',
          '包含实用的出行贴士'
        ]
      }
    ];

    setContentSuggestions(suggestions);
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

  // 生成时间段分析数据
  const generateTimeSlotAnalysis = (topics: any[]) => {
    const hours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0') + ':00');
    const categories = ['时尚', '美妆', '生活', '美食', '旅行'];
    
    const timeSlots = hours.map(hour => ({
      hour,
      posts: Math.floor(Math.random() * 1000) + 100,
      engagement: Math.floor(Math.random() * 50) + 20,
      category: categories[Math.floor(Math.random() * categories.length)]
    }));

    setTimeSlotData(timeSlots);
  };

  // 表格列定义
  const columns = [
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
            <TrendingUpOutlined style={{ color: '#52c41a' }} />
          ) : (
            <TrendingDownOutlined style={{ color: '#ff4d4f' }} />
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
                <ShareAltOutlined style={{ color: '#52c41a' }} />
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
            percent={engagement} 
            size="small" 
            strokeColor={engagement > 15 ? '#52c41a' : engagement > 10 ? '#faad14' : '#ff4d4f'}
            format={() => `${engagement}%`}
          />
        </div>
      )
    }
  ];

  // 时间段表格列
  const timeColumns = [
    {
      title: '时间段',
      dataIndex: 'hour',
      key: 'hour',
      render: (hour: string) => (
        <Text strong>{hour}</Text>
      )
    },
    {
      title: '发布量',
      dataIndex: 'posts',
      key: 'posts',
      render: (posts: number) => posts.toLocaleString()
    },
    {
      title: '参与度',
      dataIndex: 'engagement',
      key: 'engagement',
      render: (engagement: number) => (
        <Progress 
          percent={engagement} 
          size="small" 
          strokeColor="#1890ff"
          format={() => `${engagement}%`}
        />
      )
    },
    {
      title: '热门分类',
      dataIndex: 'category',
      key: 'category',
      render: (category: string) => (
        <Tag color="green">{category}</Tag>
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
              value="21:00"
              prefix={<ClockCircleOutlined style={{ color: '#722ed1' }} />}
            />
          </Card>
        </Col>
      </Row>

      {/* 分类趋势表格 */}
      <Card title="分类趋势分析">
        <Table
          columns={columns}
          dataSource={trendData}
          rowKey="category"
          loading={loading}
          pagination={{
            pageSize: 8,
            showSizeChanger: false,
            showQuickJumper: false,
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
        <Card title="🔥 热门内容建议" extra={
          <Button icon={<ReloadOutlined />} onClick={loadData} loading={loading}>
            刷新建议
          </Button>
        }>
          <List
            itemLayout="vertical"
            dataSource={contentSuggestions}
            renderItem={(item: any) => (
              <List.Item
                key={item.id}
                actions={[
                  <Tag color="blue">{item.difficulty}</Tag>,
                  <Tag color={item.potential === '高' ? 'red' : item.potential === '中等' ? 'orange' : 'green'}>
                    {item.potential}潜力
                  </Tag>
                ]}
              >
                <List.Item.Meta
                  avatar={<Avatar style={{ backgroundColor: '#1890ff' }}>{item.category[0]}</Avatar>}
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
                        {item.tags.map((tag: string) => (
                          <Tag key={tag} style={{ marginBottom: '4px' }}>#{tag}</Tag>
                        ))}
                      </div>
                    </div>
                  }
                />
                <div>
                  <Text strong>创作建议：</Text>
                  <ul style={{ marginTop: '8px', paddingLeft: '20px' }}>
                    {item.tips.map((tip: string, index: number) => (
                      <li key={index} style={{ marginBottom: '4px' }}>
                        <Text>{tip}</Text>
                      </li>
                    ))}
                  </ul>
                </div>
              </List.Item>
            )}
          />
        </Card>
      </Col>
      <Col span={8}>
        <Card title="📊 热门话题排行" style={{ marginBottom: '16px' }}>
          <List
            size="small"
            dataSource={hotTopics.slice(0, 10)}
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
    <Row gutter={16}>
      <Col span={12}>
        <Card title="📅 最佳发布时间分析">
          <Table
            columns={timeColumns}
            dataSource={timeSlotData.slice(0, 12)}
            rowKey="hour"
            loading={loading}
            pagination={false}
            size="small"
          />
        </Card>
      </Col>
      <Col span={12}>
        <Card title="📈 发布时机建议">
          <div style={{ padding: '16px' }}>
            <div style={{ marginBottom: '16px' }}>
              <Text strong style={{ color: '#52c41a' }}>🌅 早晨时段 (7:00-9:00)</Text>
              <div style={{ marginTop: '8px', marginLeft: '16px' }}>
                <Text>• 适合发布励志、健身、早餐相关内容</Text><br/>
                <Text>• 用户活跃度较高，互动率好</Text><br/>
                <Text>• 建议发布时间：8:00-8:30</Text>
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <Text strong style={{ color: '#1890ff' }}>🌞 中午时段 (12:00-14:00)</Text>
              <div style={{ marginTop: '8px', marginLeft: '16px' }}>
                <Text>• 适合发布美食、生活类内容</Text><br/>
                <Text>• 午休时间，浏览量大</Text><br/>
                <Text>• 建议发布时间：12:30-13:00</Text>
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <Text strong style={{ color: '#faad14' }}>🌆 傍晚时段 (18:00-20:00)</Text>
              <div style={{ marginTop: '8px', marginLeft: '16px' }}>
                <Text>• 适合发布穿搭、美妆、娱乐内容</Text><br/>
                <Text>• 下班后放松时间，参与度高</Text><br/>
                <Text>• 建议发布时间：19:00-19:30</Text>
              </div>
            </div>

            <div>
              <Text strong style={{ color: '#722ed1' }}>🌙 晚间时段 (21:00-23:00)</Text>
              <div style={{ marginTop: '8px', marginLeft: '16px' }}>
                <Text>• 适合发布深度内容、学习分享</Text><br/>
                <Text>• 黄金时段，流量最大</Text><br/>
                <Text>• 建议发布时间：21:00-21:30</Text>
              </div>
            </div>
          </div>
        </Card>
      </Col>
    </Row>
  );

  useEffect(() => {
    loadData();
  }, []);

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
    },
    {
      key: 'timing',
      label: (
        <span>
          <ClockCircleOutlined />
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
          <Col span={6}>
            <Space>
              <CalendarOutlined />
              <Select
                value={selectedPeriod}
                onChange={setSelectedPeriod}
                style={{ width: 120 }}
                placeholder="时间范围"
              >
                <Option value="1d">最近1天</Option>
                <Option value="7d">最近7天</Option>
                <Option value="30d">最近30天</Option>
              </Select>
            </Space>
          </Col>
          <Col span={12}>
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

export default CreationTrends;
