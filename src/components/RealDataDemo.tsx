// 真实数据演示组件 - 完整功能版本
import React, { useState, useEffect } from 'react';
import {
  Card, Row, Col, Statistic, Button, List, Tag, Typography, Spin,
  message, Progress, Tabs, Space, Tooltip, Badge, Modal, Descriptions
} from 'antd';
import {
  FireOutlined, UserOutlined, EditOutlined, LikeOutlined, ArrowUpOutlined,
  ArrowDownOutlined, ReloadOutlined, EyeOutlined,
  ShareAltOutlined, BarChartOutlined
} from '@ant-design/icons';
import { simpleDataService } from '../services/simpleDataService';
import ReactECharts from 'echarts-for-react';

const { Title, Text } = Typography;

// 获取数据
const fetchRealData = async () => {
  // 获取平台统计数据
  const platformStats = await simpleDataService.getPlatformStats();

  // 获取热门话题数据
  const topics = await simpleDataService.getHotTopics(5);
  const hotTopics = topics.map((topic, index) => ({
    id: topic.id,
    title: topic.title,  // 保持原始字段名
    name: topic.title,   // 兼容性字段
    heat: topic.trendScore,
    heatScore: topic.trendScore,  // 兼容性字段
    trend: topic.trendScore > 85 ? 'up' : topic.trendScore < 70 ? 'down' : 'stable',
    posts: topic.likeCount + topic.commentCount,
    contentCount: topic.likeCount + topic.commentCount,  // 兼容性字段
    engagement: ((topic.likeCount + topic.commentCount) / Math.max(topic.viewCount, 1)) * 100,
    category: topic.category,
    tags: topic.tags  // 添加标签字段
  }));

  return {
    overview: {
      totalTopics: platformStats.totalNotes,
      totalUsers: platformStats.activeUsers,
      totalInteractions: platformStats.totalInteractions,
      growthRate: {
        topics: Math.round(platformStats.growthRate.notes * 10) / 10,
        users: Math.round(platformStats.growthRate.users * 10) / 10,
        interactions: Math.round(platformStats.growthRate.interactions * 10) / 10
      }
    },
    hotTopics
  };
};

const RealDataDemo: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [refreshing, setRefreshing] = useState(false);


  const loadData = async () => {
    setLoading(true);
    try {
      const result = await fetchRealData();
      setData(result);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('数据加载失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    console.log('🔄 开始刷新数据...');
    setRefreshing(true);
    try {
      // 重新加载本地数据服务
      const processedData = await fetchRealData();
      setData(processedData);
      setLastUpdated(new Date());



    } catch (error) {
      console.error('❌ 数据刷新失败:', error);
    } finally {
      setRefreshing(false);
    }
  };

  // 查看详情功能
  const handleViewDetail = (item: any) => {
    Modal.info({
      title: `话题详情 - ${item.title}`,
      width: 600,
      content: (
        <div style={{ padding: '16px 0' }}>
          <Descriptions column={1} bordered size="small">
            <Descriptions.Item label="话题标题">{item.title}</Descriptions.Item>
            <Descriptions.Item label="分类">{item.category}</Descriptions.Item>
            <Descriptions.Item label="热度评分">{item.heatScore}</Descriptions.Item>
            <Descriptions.Item label="内容数量">{item.contentCount?.toLocaleString() || '未知'}</Descriptions.Item>
            <Descriptions.Item label="参与度">{item.engagement || '未知'}</Descriptions.Item>
            <Descriptions.Item label="相关标签">
              {item.tags ? item.tags.map((tag: string) => (
                <Tag key={tag} color="blue" style={{ margin: '2px' }}>#{tag}</Tag>
              )) : '暂无标签'}
            </Descriptions.Item>
          </Descriptions>
        </div>
      ),
    });
  };

  // 分享功能
  const handleShare = (item: any) => {
    const shareText = `【小红书热门话题】${item.title} - 热度: ${item.heatScore} | 分类: ${item.category}`;

    if (navigator.share) {
      navigator.share({
        title: '小红书热门话题分享',
        text: shareText,
        url: window.location.href
      }).catch(() => {
        // 如果原生分享失败，使用复制功能
        copyToClipboard(shareText);
      });
    } else {
      copyToClipboard(shareText);
    }
  };

  // 复制到剪贴板
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      // 复制成功
    }).catch(() => {
      // 兼容性处理
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
    });
  };



  useEffect(() => {
    loadData();
  }, []);

  if (loading) {
    return <Spin size="large" style={{ display: 'block', margin: '50px auto' }} />;
  }

  if (!data) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Button type="primary" onClick={loadData}>重新加载数据</Button>
      </div>
    );
  }

  const { overview, hotTopics } = data;

  // 生成图表配置
  const generateChartOption = (type: string) => {
    if (!data || !data.hotTopics) return {};

    switch (type) {
      case 'category':
        const categoryData = data.hotTopics.reduce((acc: any, topic: any) => {
          acc[topic.category] = (acc[topic.category] || 0) + 1;
          return acc;
        }, {});

        return {
          title: { text: '内容分类分布', left: 'center' },
          tooltip: { trigger: 'item' },
          series: [{
            type: 'pie',
            radius: '60%',
            data: Object.entries(categoryData).map(([name, value]) => ({ name, value })),
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }]
        };

      case 'trend':
        return {
          title: { text: '热度趋势', left: 'center' },
          tooltip: { trigger: 'axis' },
          xAxis: {
            type: 'category',
            data: data.hotTopics.slice(0, 8).map((topic: any, index: number) => `话题${index + 1}`)
          },
          yAxis: { type: 'value' },
          series: [{
            data: data.hotTopics.slice(0, 8).map((topic: any) => topic.heat),
            type: 'line',
            smooth: true,
            areaStyle: {}
          }]
        };

      default:
        return {};
    }
  };

  const tabItems = [
    {
      key: 'overview',
      label: '📊 数据概览',
      children: (
        <div>
          {/* 核心指标卡片 */}
          <Row gutter={[24, 24]} style={{ marginBottom: '32px' }}>
            <Col xs={24} sm={12} md={6}>
              <Card hoverable style={{ borderRadius: '12px', border: '1px solid #f0f0f0', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                <Statistic
                  title={<span style={{ color: '#8c8c8c', fontSize: '14px' }}>总话题数</span>}
                  value={overview.totalTopics}
                  precision={0}
                  valueStyle={{ color: '#ff2442', fontSize: '28px', fontWeight: 600 }}
                  prefix={<FireOutlined style={{ color: '#ff2442' }} />}
                  suffix={
                    <div style={{ fontSize: '12px', color: overview.growthRate.topics > 0 ? '#52c41a' : '#ff4d4f', marginTop: '4px' }}>
                      {overview.growthRate.topics > 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                      {Math.abs(overview.growthRate.topics).toFixed(1)}%
                    </div>
                  }
                />
              </Card>
            </Col>

            <Col xs={24} sm={12} md={6}>
              <Card hoverable style={{ borderRadius: '12px', border: '1px solid #f0f0f0', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                <Statistic
                  title={<span style={{ color: '#8c8c8c', fontSize: '14px' }}>活跃用户</span>}
                  value={overview.totalUsers}
                  precision={0}
                  valueStyle={{ color: '#1890ff', fontSize: '28px', fontWeight: 600 }}
                  prefix={<UserOutlined style={{ color: '#1890ff' }} />}
                  suffix={
                    <div style={{ fontSize: '12px', color: overview.growthRate.users > 0 ? '#52c41a' : '#ff4d4f', marginTop: '4px' }}>
                      {overview.growthRate.users > 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                      {Math.abs(overview.growthRate.users).toFixed(1)}%
                    </div>
                  }
                />
              </Card>
            </Col>

            <Col xs={24} sm={12} md={6}>
              <Card hoverable style={{ borderRadius: '12px', border: '1px solid #f0f0f0', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                <Statistic
                  title={<span style={{ color: '#8c8c8c', fontSize: '14px' }}>总互动数</span>}
                  value={overview.totalInteractions}
                  precision={0}
                  valueStyle={{ color: '#52c41a', fontSize: '28px', fontWeight: 600 }}
                  prefix={<LikeOutlined style={{ color: '#52c41a' }} />}
                  suffix={
                    <div style={{ fontSize: '12px', color: overview.growthRate.interactions > 0 ? '#52c41a' : '#ff4d4f', marginTop: '4px' }}>
                      {overview.growthRate.interactions > 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                      {Math.abs(overview.growthRate.interactions).toFixed(1)}%
                    </div>
                  }
                />
              </Card>
            </Col>

            <Col xs={24} sm={12} md={6}>
              <Card hoverable style={{ borderRadius: '12px', border: '1px solid #f0f0f0', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                <Statistic
                  title={<span style={{ color: '#8c8c8c', fontSize: '14px' }}>数据更新</span>}
                  value={lastUpdated ? lastUpdated.toLocaleTimeString() : '--'}
                  valueStyle={{ color: '#722ed1', fontSize: '20px', fontWeight: 600 }}
                  prefix={<ReloadOutlined style={{ color: '#722ed1' }} />}
                />
              </Card>
            </Col>
          </Row>

          {/* 热门话题列表 */}
          <Card
            title={
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span>
                  <FireOutlined style={{ color: '#ff2442', marginRight: '8px' }} />
                  实时热门话题
                </span>
                <Space>
                  <Badge count={hotTopics.length} showZero color="#ff2442" />
                  <Button
                    type="primary"
                    size="small"
                    icon={<ReloadOutlined />}
                    loading={refreshing}
                    onClick={refreshData}
                  >
                    刷新数据
                  </Button>
                </Space>
              </div>
            }
            style={{ borderRadius: '12px', border: '1px solid #f0f0f0', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}
          >
            <List
              itemLayout="horizontal"
              dataSource={hotTopics}
              renderItem={(item: any, index: number) => (
                <List.Item
                  key={item.id}
                  actions={[
                    <Tooltip title="查看详情">
                      <Button
                        type="link"
                        icon={<EyeOutlined />}
                        size="small"
                        onClick={() => handleViewDetail(item)}
                      >
                        查看
                      </Button>
                    </Tooltip>,
                    <Tooltip title="分享话题">
                      <Button
                        type="link"
                        icon={<ShareAltOutlined />}
                        size="small"
                        onClick={() => handleShare(item)}
                      >
                        分享
                      </Button>
                    </Tooltip>
                  ]}
                  style={{
                    padding: '16px 0',
                    borderBottom: index === hotTopics.length - 1 ? 'none' : '1px solid #f0f0f0'
                  }}
                >
                  <List.Item.Meta
                    avatar={
                      <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        background: index < 3 ? 'linear-gradient(135deg, #ff2442 0%, #ff4757 100%)' :
                                   index < 6 ? 'linear-gradient(135deg, #1890ff 0%, #40a9ff 100%)' :
                                   'linear-gradient(135deg, #52c41a 0%, #73d13d 100%)',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '16px',
                        fontWeight: 'bold'
                      }}>
                        {index + 1}
                      </div>
                    }
                    title={
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Text strong style={{ fontSize: '16px' }}>{item.name}</Text>
                        <Tag color={item.category === '美妆' ? 'magenta' :
                                   item.category === '护肤' ? 'blue' :
                                   item.category === '穿搭' ? 'purple' :
                                   item.category === '美食' ? 'orange' : 'green'}>
                          {item.category}
                        </Tag>
                        <Tag color={item.trend === 'up' ? 'success' : item.trend === 'down' ? 'error' : 'default'}>
                          {item.trend === 'up' ? '↗️ 上升' : item.trend === 'down' ? '↘️ 下降' : '➡️ 稳定'}
                        </Tag>
                      </div>
                    }
                    description={
                      <div style={{ marginTop: '8px' }}>
                        <Space size="large">
                          <span>
                            <FireOutlined style={{ color: '#ff2442', marginRight: '4px' }} />
                            热度: <Text strong>{item.heat.toFixed(1)}</Text>
                          </span>
                          <span>
                            <EditOutlined style={{ color: '#1890ff', marginRight: '4px' }} />
                            内容: <Text strong>{item.posts}</Text>
                          </span>
                          <span>
                            <LikeOutlined style={{ color: '#52c41a', marginRight: '4px' }} />
                            参与度: <Text strong>{item.engagement.toFixed(1)}%</Text>
                          </span>
                        </Space>
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </div>
      )
    },
    {
      key: 'charts',
      label: '📈 数据图表',
      children: (
        <Row gutter={[24, 24]}>
          <Col xs={24} lg={12}>
            <Card title="内容分类分布" style={{ borderRadius: '12px' }}>
              <ReactECharts option={generateChartOption('category')} style={{ height: '300px' }} />
            </Card>
          </Col>
          <Col xs={24} lg={12}>
            <Card title="热度趋势分析" style={{ borderRadius: '12px' }}>
              <ReactECharts option={generateChartOption('trend')} style={{ height: '300px' }} />
            </Card>
          </Col>
        </Row>
      )
    }
  ];

  return (
    <div>
      {/* 页面头部 */}
      <div style={{ marginBottom: '24px' }}>
        <Title level={2} style={{ margin: 0, color: '#262626' }}>
          <BarChartOutlined style={{ color: '#ff2442', marginRight: '12px' }} />
          数据概览中心
        </Title>
        <Text type="secondary" style={{ fontSize: '16px' }}>
          基于真实数据的小红书趋势分析平台 • 最后更新: {lastUpdated?.toLocaleString() || '未知'}
        </Text>
      </div>

      {/* 主要内容区域 */}
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={tabItems}
        size="large"
        style={{
          background: '#ffffff',
          borderRadius: '12px',
          padding: '24px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
        }}
      />
    </div>
  );
};

export default RealDataDemo;
