// 增强版热点话题页面 - 包含深度分析功能
import React, { useState, useEffect } from 'react';
import { Card, Table, Tag, Button, message, Tabs, Row, Col, Typography, Space, Statistic } from 'antd';
import type { ColumnsType, TabsProps } from 'antd';
import { FireOutlined, ReloadOutlined, TrophyOutlined, RiseOutlined, ClockCircleOutlined, TagsOutlined, EyeOutlined, HeartOutlined, MessageOutlined, ShareAltOutlined } from '@ant-design/icons';
import { simpleDataService } from '../services/simpleDataService';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface TopicData {
  id: string;
  title: string;
  category: string;
  likeCount: number;
  commentCount: number;
  shareCount: number;
  publishTime: string;
}

const { Title, Text } = Typography;

const SimpleHotTopics: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [topics, setTopics] = useState<TopicData[]>([]);
  const [analysisData, setAnalysisData] = useState<any>({
    categoryStats: [],
    trendData: [],
    keywordData: [],
    timeDistribution: [],
    totalStats: {
      totalTopics: 0,
      totalEngagement: 0,
      avgEngagement: 0,
      topCategory: ''
    }
  });

  // 生成简单的测试数据
  const generateTestData = (): TopicData[] => {
    const categories = ['时尚', '美妆', '生活', '美食', '旅行'];
    const titles = [
      '秋冬穿搭指南',
      '护肤心得分享', 
      '居家好物推荐',
      '减脂餐制作',
      '旅行攻略分享'
    ];

    return titles.map((title, index) => ({
      id: `topic_${index}`,
      title: `${title} #${index + 1}`,
      category: categories[index],
      likeCount: Math.floor(Math.random() * 10000) + 1000,
      commentCount: Math.floor(Math.random() * 500) + 50,
      shareCount: Math.floor(Math.random() * 100) + 10,
      publishTime: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString()
    }));
  };

  // 深度分析函数
  const performDeepAnalysis = (topicsData: TopicData[]) => {
    console.log('🧠 开始深度分析热点话题...');

    // 1. 分类统计分析
    const categoryStats: { [key: string]: any } = {};
    topicsData.forEach(topic => {
      const category = topic.category;
      if (!categoryStats[category]) {
        categoryStats[category] = {
          count: 0,
          totalLikes: 0,
          totalComments: 0,
          totalShares: 0,
          topics: []
        };
      }
      categoryStats[category].count++;
      categoryStats[category].totalLikes += topic.likeCount;
      categoryStats[category].totalComments += topic.commentCount;
      categoryStats[category].totalShares += topic.shareCount;
      categoryStats[category].topics.push(topic);
    });

    const categoryStatsArray = Object.entries(categoryStats).map(([category, stats]: [string, any]) => ({
      category,
      count: stats.count,
      avgLikes: Math.floor(stats.totalLikes / stats.count),
      avgComments: Math.floor(stats.totalComments / stats.count),
      avgShares: Math.floor(stats.totalShares / stats.count),
      totalEngagement: stats.totalLikes + stats.totalComments + stats.totalShares,
      percentage: (stats.count / topicsData.length * 100).toFixed(1)
    })).sort((a, b) => b.totalEngagement - a.totalEngagement);

    // 2. 关键词提取分析
    const keywordFreq: { [key: string]: number } = {};
    topicsData.forEach(topic => {
      // 简单的关键词提取（基于标题分词）
      const words = topic.title.split(/[｜\s\-\|]+/).filter(word => word.length > 1);
      words.forEach(word => {
        keywordFreq[word] = (keywordFreq[word] || 0) + 1;
      });
    });

    const keywordData = Object.entries(keywordFreq)
      .map(([word, count]) => ({ text: word, value: count }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 20);

    // 3. 时间分布分析
    const timeStats: { [key: string]: number } = {};
    topicsData.forEach(topic => {
      const hour = new Date(topic.publishTime).getHours();
      const timeSlot = `${hour}:00`;
      timeStats[timeSlot] = (timeStats[timeSlot] || 0) + 1;
    });

    const timeDistribution = Object.entries(timeStats)
      .map(([time, count]) => ({ time, count }))
      .sort((a, b) => parseInt(a.time) - parseInt(b.time));

    // 4. 趋势数据分析（模拟7天数据）
    const trendData = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dayTopics = topicsData.filter(topic => {
        const topicDate = new Date(topic.publishTime);
        return topicDate.toDateString() === date.toDateString();
      });

      trendData.push({
        date: date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' }),
        count: dayTopics.length,
        engagement: dayTopics.reduce((sum, topic) => sum + topic.likeCount + topic.commentCount + topic.shareCount, 0)
      });
    }

    // 5. 总体统计
    const totalEngagement = topicsData.reduce((sum, topic) => sum + topic.likeCount + topic.commentCount + topic.shareCount, 0);
    const topCategory = categoryStatsArray[0]?.category || '未知';

    setAnalysisData({
      categoryStats: categoryStatsArray,
      trendData,
      keywordData,
      timeDistribution,
      totalStats: {
        totalTopics: topicsData.length,
        totalEngagement,
        avgEngagement: Math.floor(totalEngagement / topicsData.length),
        topCategory
      }
    });

    console.log('✅ 深度分析完成');
  };

  // 加载数据 - 使用真实的10,000条数据
  const loadData = async () => {
    setLoading(true);
    try {
      console.log('🔥 加载热点话题真实数据...');

      // 获取热门话题数据
      const hotTopicsData = await simpleDataService.getHotTopics(20);

      if (hotTopicsData && hotTopicsData.length > 0) {
        console.log('✅ 热点话题数据加载成功，共', hotTopicsData.length, '条');
        setTopics(hotTopicsData);
        // 执行深度分析
        performDeepAnalysis(hotTopicsData);
      } else {
        console.log('⚠️ 未获取到热点话题数据，使用备用数据');
        const data = generateTestData();
        setTopics(data);
        // 执行深度分析
        performDeepAnalysis(data);
        message.warning('使用备用数据');
      }
    } catch (error) {
      console.error('❌ 热点话题数据加载失败:', error);
      message.error('数据加载失败，使用备用数据');
      const data = generateTestData();
      setTopics(data);
      // 执行深度分析
      performDeepAnalysis(data);
    } finally {
      setLoading(false);
    }
  };

  // 表格列定义
  const columns: ColumnsType<TopicData> = [
    {
      title: '排名',
      key: 'rank',
      width: 80,
      render: (_: any, __: TopicData, index: number) => (
        <div style={{ 
          width: 30, 
          height: 30, 
          borderRadius: '50%', 
          background: index < 3 ? '#ff4d4f' : '#1890ff',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 'bold'
        }}>
          {index + 1}
        </div>
      )
    },
    {
      title: '话题标题',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: '分类',
      dataIndex: 'category',
      key: 'category',
      render: (category: string) => (
        <Tag color="blue">{category}</Tag>
      )
    },
    {
      title: '点赞数',
      dataIndex: 'likeCount',
      key: 'likeCount',
      render: (count: number) => count.toLocaleString()
    },
    {
      title: '评论数',
      dataIndex: 'commentCount',
      key: 'commentCount',
      render: (count: number) => count.toLocaleString()
    },
    {
      title: '分享数',
      dataIndex: 'shareCount',
      key: 'shareCount',
      render: (count: number) => count.toLocaleString()
    },
    {
      title: '发布时间',
      dataIndex: 'publishTime',
      key: 'publishTime',
      render: (time: string) => new Date(time).toLocaleDateString('zh-CN')
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
          <FireOutlined style={{ color: '#ff4d4f', marginRight: '8px' }} />
          热点话题深度分析
        </Title>
        <Text type="secondary">基于真实数据的热点话题趋势分析与洞察</Text>
      </div>

      {/* 核心指标卡片 */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="总话题数"
              value={analysisData.totalStats.totalTopics}
              prefix={<TrophyOutlined style={{ color: '#1890ff' }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="总互动量"
              value={analysisData.totalStats.totalEngagement}
              prefix={<HeartOutlined style={{ color: '#f5222d' }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="平均互动"
              value={analysisData.totalStats.avgEngagement}
              prefix={<RiseOutlined style={{ color: '#52c41a' }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="热门分类"
              value={analysisData.totalStats.topCategory}
              prefix={<TagsOutlined style={{ color: '#722ed1' }} />}
            />
          </Card>
        </Col>
      </Row>

      {/* 分析标签页 */}
      <Tabs
        defaultActiveKey="list"
        size="large"
        items={[
          {
            key: 'list',
            label: '📊 话题列表',
            children: (
          <Card
            extra={
              <Button
                type="primary"
                icon={<ReloadOutlined />}
                onClick={loadData}
                loading={loading}
              >
                刷新数据
              </Button>
            }
          >
            <Table
              columns={columns}
              dataSource={topics}
              rowKey="id"
              loading={loading}
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total) => `共 ${total} 个话题`
              }}
            />
          </Card>
            )
          },
          {
            key: 'category',
            label: '📈 分类分析',
            children: (
          <Row gutter={[16, 16]}>
            <Col xs={24} lg={12}>
              <Card title="分类分布饼图">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={analysisData.categoryStats}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ category, percentage }) => `${category} ${percentage}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {analysisData.categoryStats.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={`hsl(${index * 45}, 70%, 60%)`} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </Card>
            </Col>
            <Col xs={24} lg={12}>
              <Card title="分类互动对比">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={analysisData.categoryStats}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="totalEngagement" fill="#8884d8" name="总互动量" />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </Col>
          </Row>
            )
          },
          {
            key: 'keywords',
            label: '🔥 关键词云',
            children: (
          <Row gutter={[16, 16]}>
            <Col xs={24} lg={10}>
              <Card title="热门关键词分布" style={{ height: '450px' }}>
                <div style={{
                  position: 'relative',
                  width: '100%',
                  height: '390px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  overflow: 'hidden',
                  padding: '20px'
                }}>
                  {analysisData.keywordData.slice(0, 15).map((item: any, index: number) => {
                    // 计算字体大小：控制在合理范围内
                    const maxValue = Math.max(...analysisData.keywordData.map((k: any) => k.value));
                    const fontSize = Math.max(12, Math.min(24, 12 + (item.value / maxValue) * 12));

                    // 颜色渐变：从红色到蓝色
                    const colors = ['#ff4d4f', '#ff7a45', '#ffa940', '#ffec3d', '#bae637', '#52c41a', '#13c2c2', '#1890ff', '#2f54eb', '#722ed1'];

                    // 计算位置：中心散开的圆形布局，控制在容器内
                    const angle = (index * 360 / analysisData.keywordData.slice(0, 15).length) * (Math.PI / 180);
                    const radius = 60 + (index % 3) * 30; // 缩小半径，多层圆形布局
                    const x = Math.cos(angle) * radius;
                    const y = Math.sin(angle) * radius;

                    return (
                      <span
                        key={item.text}
                        style={{
                          position: 'absolute',
                          fontSize: `${fontSize}px`,
                          color: colors[index % colors.length],
                          fontWeight: index < 5 ? 'bold' : 'normal',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          transform: `translate(${x}px, ${y}px)`,
                          textAlign: 'center',
                          whiteSpace: 'nowrap',
                          userSelect: 'none',
                          textShadow: '1px 1px 2px rgba(0,0,0,0.1)',
                          zIndex: maxValue - item.value + 1
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = `translate(${x}px, ${y}px) scale(1.2)`;
                          e.currentTarget.style.zIndex = '999';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = `translate(${x}px, ${y}px) scale(1)`;
                          e.currentTarget.style.zIndex = String(maxValue - item.value + 1);
                        }}
                        title={`${item.text} (${item.value}次)`}
                      >
                        {item.text}
                      </span>
                    );
                  })}

                </div>
              </Card>
            </Col>
            <Col xs={24} lg={14}>
              <Card title="关键词排行" style={{ height: '450px' }}>
                <div style={{
                  height: '390px',
                  overflowY: 'auto',
                  padding: '0 12px 0 8px'
                }}>
                  {analysisData.keywordData.slice(0, 15).map((item: any, index: number) => (
                    <div key={item.text} style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '10px 12px',
                      borderBottom: '1px solid #f0f0f0',
                      borderRadius: '6px',
                      margin: '3px 0',
                      background: index < 3 ? 'linear-gradient(90deg, #fff2f0, #fff)' :
                                 index < 6 ? 'linear-gradient(90deg, #fff7e6, #fff)' :
                                 'linear-gradient(90deg, #f6ffed, #fff)',
                      transition: 'all 0.3s ease',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateX(4px)';
                      e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateX(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                    >
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        flex: 1,
                        minWidth: 0
                      }}>
                        <Tag
                          color={index < 3 ? 'red' : index < 6 ? 'orange' : 'blue'}
                          style={{
                            minWidth: '24px',
                            textAlign: 'center',
                            fontWeight: 'bold',
                            flexShrink: 0
                          }}
                        >
                          {index + 1}
                        </Tag>
                        <Text
                          style={{
                            fontWeight: index < 3 ? 'bold' : 'normal',
                            fontSize: index < 3 ? '14px' : '13px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            flex: 1,
                            marginLeft: '8px'
                          }}
                          title={item.text}
                        >
                          {item.text}
                        </Text>
                      </div>
                      <div style={{
                        textAlign: 'right',
                        flexShrink: 0,
                        width: '50px'
                      }}>
                        <Text strong style={{ color: index < 3 ? '#ff4d4f' : '#666' }}>
                          {item.value}
                        </Text>
                        <div style={{ fontSize: '11px', color: '#999' }}>次</div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </Col>
          </Row>
            )
          },
          {
            key: 'time',
            label: '⏰ 时间分析',
            children: (
          <Row gutter={[16, 16]}>
            <Col xs={24} lg={12}>
              <Card title="发布时间分布" style={{ height: '450px' }}>
                <ResponsiveContainer width="100%" height={390}>
                  <BarChart data={analysisData.timeDistribution}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" fill="#82ca9d" name="话题数量" />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </Col>
            <Col xs={24} lg={12}>
              <Card title="时间段统计" style={{ height: '450px' }}>
                <div style={{
                  padding: '3px 20px',
                  height: '390px',
                  overflowY: 'auto'
                }}>
                  <div style={{ marginBottom: '16px' }}>
                    <Text strong>📊 发布时间分析结果：</Text>
                  </div>
                  {analysisData.timeDistribution.slice(0, 8).map((item: any, index: number) => (
                    <div key={item.time} style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '8px 0',
                      borderBottom: '1px solid #f0f0f0'
                    }}>
                      <Space>
                        <ClockCircleOutlined style={{ color: '#1890ff' }} />
                        <Text>{item.time}</Text>
                      </Space>
                      <div style={{ textAlign: 'right' }}>
                        <Text strong>{item.count} 个话题</Text>
                      </div>
                    </div>
                  ))}

                </div>
              </Card>
            </Col>
          </Row>
            )
          }
        ]}
      />
    </div>
  );
};

export default SimpleHotTopics;
