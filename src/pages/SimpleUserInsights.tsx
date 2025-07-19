// 简化版用户洞察分析页面
import React, { useState, useEffect } from 'react';
import {
  Card, Row, Col, Statistic, Progress, Table, Tag, Button,
  Space, Typography, message, Tabs, List, Avatar
} from 'antd';
import type { ColumnsType, TabsProps } from 'antd';
import {
  UserOutlined, TeamOutlined, EnvironmentOutlined,
  ClockCircleOutlined, HeartOutlined, EyeOutlined,
  ReloadOutlined, RiseOutlined
} from '@ant-design/icons';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { simpleDataService } from '../services/simpleDataService';

const { Title, Text } = Typography;

interface UserInsightData {
  totalUsers: number;
  userActivity: Array<{
    timeSlot: string;
    activeUsers: number;
    avgEngagement: number;
    percentage: number;
  }>;
  regionDistribution: Array<{
    region: string;
    userCount: number;
    percentage: number;
    avgPosts: number;
    topCategory: string;
  }>;
  ageGroups: Array<{
    ageGroup: string;
    count: number;
    percentage: number;
    avgEngagement: number;
    topCategory: string;
    activeTime: string;
    growth: number;
  }>;
  engagementPatterns: {
    avgLikesPerPost: number;
    avgCommentsPerPost: number;
    avgSharesPerPost: number;
    peakEngagementHour: string;
    engagementTrend: string;
  };
}

const SimpleUserInsights: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [userInsights, setUserInsights] = useState<UserInsightData | null>(null);
  const [activeTab, setActiveTab] = useState<string>('overview');

  // 加载数据 - 使用真实数据分析
  const loadData = async () => {
    setLoading(true);
    try {
      console.log('👥 加载用户洞察真实数据...');
      
      // 获取用户洞察数据
      const userInsightsData = await simpleDataService.getUserInsights();
      
      if (userInsightsData) {
        console.log('✅ 用户洞察数据加载成功');
        console.log('📊 用户活跃度数据:', userInsightsData.userActivity);
        console.log('👥 年龄分组数据:', userInsightsData.ageGroups);
        console.log('🌍 地域分布数据:', userInsightsData.regionDistribution);
        console.log('📈 总用户数:', userInsightsData.totalUsers);
        console.log('🔍 数据来源: 真实数据分析');

        // 检查数据完整性
        if (!userInsightsData.userActivity || userInsightsData.userActivity.length === 0) {
          console.warn('⚠️ 用户活跃度数据为空');
        }
        if (!userInsightsData.ageGroups || userInsightsData.ageGroups.length === 0) {
          console.warn('⚠️ 年龄分组数据为空');
        }

        // 验证是否使用了真实数据
        const isRealData = userInsightsData.totalUsers > 100000;
        console.log(`🎯 数据验证: ${isRealData ? '使用真实数据' : '使用备用数据'}`);
        console.log('📊 最终数据结构:', {
          totalUsers: userInsightsData.totalUsers,
          userActivityCount: userInsightsData.userActivity?.length,
          ageGroupsCount: userInsightsData.ageGroups?.length,
          regionCount: userInsightsData.regionDistribution?.length
        });

        setUserInsights(userInsightsData);

        // 详细检查数据结构
        console.log('🔍 详细数据检查:');
        console.log('userActivity:', userInsightsData.userActivity);
        console.log('ageGroups:', userInsightsData.ageGroups);


      } else {
        throw new Error('无法获取用户洞察数据');
      }
    } catch (error) {
      console.error('❌ 用户洞察数据加载失败:', error);
      message.error('数据加载失败，使用备用数据');
      
      // 使用备用数据
      const fallbackData = {
        totalUsers: 500000,
        userActivity: [
          { timeSlot: '上午', activeUsers: 125000, avgEngagement: 3.2, percentage: 25 },
          { timeSlot: '下午', activeUsers: 175000, avgEngagement: 4.1, percentage: 35 },
          { timeSlot: '晚上', activeUsers: 150000, avgEngagement: 4.8, percentage: 30 },
          { timeSlot: '深夜', activeUsers: 50000, avgEngagement: 2.5, percentage: 10 }
        ],
        regionDistribution: [
          { region: '北京', userCount: 75000, percentage: 15, avgPosts: 8, topCategory: '时尚' },
          { region: '上海', userCount: 70000, percentage: 14, avgPosts: 9, topCategory: '美妆' },
          { region: '广州', userCount: 60000, percentage: 12, avgPosts: 7, topCategory: '美食' },
          { region: '深圳', userCount: 55000, percentage: 11, avgPosts: 8, topCategory: '科技' },
          { region: '杭州', userCount: 45000, percentage: 9, avgPosts: 6, topCategory: '生活' }
        ],
        ageGroups: [
          { ageGroup: '16-18', count: 40000, percentage: 8, avgEngagement: 5.2, topCategory: '学习成长', activeTime: '16:00-19:00', growth: 12.3 },
          { ageGroup: '19-22', count: 85000, percentage: 17, avgEngagement: 4.8, topCategory: '美妆护肤', activeTime: '19:00-22:00', growth: 10.5 },
          { ageGroup: '23-26', count: 90000, percentage: 18, avgEngagement: 4.5, topCategory: '时尚穿搭', activeTime: '20:00-23:00', growth: 8.7 },
          { ageGroup: '27-30', count: 80000, percentage: 16, avgEngagement: 4.2, topCategory: '生活方式', activeTime: '19:00-22:00', growth: 6.8 },
          { ageGroup: '31-35', count: 70000, percentage: 14, avgEngagement: 3.9, topCategory: '母婴育儿', activeTime: '20:00-22:00', growth: 5.2 },
          { ageGroup: '36-40', count: 60000, percentage: 12, avgEngagement: 3.6, topCategory: '美食料理', activeTime: '18:00-21:00', growth: 3.1 },
          { ageGroup: '41-45', count: 40000, percentage: 8, avgEngagement: 3.3, topCategory: '健康养生', activeTime: '07:00-09:00', growth: 2.1 },
          { ageGroup: '46-50', count: 25000, percentage: 5, avgEngagement: 3.0, topCategory: '投资理财', activeTime: '08:00-10:00', growth: 1.5 },
          { ageGroup: '51-55', count: 10000, percentage: 2, avgEngagement: 2.8, topCategory: '旅行攻略', activeTime: '09:00-11:00', growth: 0.8 }
        ],
        engagementPatterns: {
          avgLikesPerPost: 1200,
          avgCommentsPerPost: 85,
          avgSharesPerPost: 22,
          peakEngagementHour: '20:00',
          engagementTrend: 'increasing'
        }
      };
      console.log('📊 使用备用数据 - 用户活跃度:', fallbackData.userActivity);
      console.log('👥 使用备用数据 - 年龄分组:', fallbackData.ageGroups);
      console.log('⚠️ 数据来源: 备用模拟数据');
      setUserInsights(fallbackData);
    } finally {
      setLoading(false);
    }
  };



  useEffect(() => {
    loadData();
  }, []);



  // 年龄群体表格列
  const ageColumns: ColumnsType<any> = [
    {
      title: '年龄段',
      dataIndex: 'ageGroup',
      key: 'ageGroup',
      render: (text: string) => <Tag color="purple">{text}</Tag>
    },
    {
      title: '用户数量',
      dataIndex: 'count',
      key: 'count',
      render: (count: number) => count.toLocaleString()
    },
    {
      title: '占比',
      dataIndex: 'percentage',
      key: 'percentage',
      render: (percentage: number) => `${percentage}%`
    },
    {
      title: '平均参与度',
      dataIndex: 'avgEngagement',
      key: 'avgEngagement',
      render: (engagement: number) => `${engagement}%`
    },
    {
      title: '活跃时间',
      dataIndex: 'activeTime',
      key: 'activeTime',
      render: (time: string) => <Tag icon={<ClockCircleOutlined />} color="green">{time}</Tag>
    },
    {
      title: '增长率',
      dataIndex: 'growth',
      key: 'growth',
      render: (growth: number) => (
        <span style={{ color: growth > 0 ? '#52c41a' : '#ff4d4f' }}>
          {growth > 0 ? '+' : ''}{growth.toFixed(1)}%
        </span>
      )
    }
  ];

  const tabItems = [
    {
      key: 'overview',
      label: '📊 用户概览',
      children: (
        <div>
          <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
            <Col span={6}>
              <Card
                style={{
                  borderRadius: '12px',
                  border: '1px solid #e8f4fd',
                  background: 'linear-gradient(135deg, #e8f4fd 0%, #ffffff 100%)',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}
              >
                <Statistic
                  title="总用户数"
                  value={userInsights?.totalUsers || 0}
                  prefix={<TeamOutlined style={{ color: '#1890ff' }} />}
                  formatter={(value) => value.toLocaleString()}
                  valueStyle={{ color: '#1890ff', fontWeight: 'bold' }}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card
                style={{
                  borderRadius: '12px',
                  border: '1px solid #fff2e8',
                  background: 'linear-gradient(135deg, #fff2e8 0%, #ffffff 100%)',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}
              >
                <Statistic
                  title="平均点赞数"
                  value={userInsights?.engagementPatterns?.avgLikesPerPost || 0}
                  prefix={<HeartOutlined style={{ color: '#fa8c16' }} />}
                  formatter={(value) => value.toLocaleString()}
                  valueStyle={{ color: '#fa8c16', fontWeight: 'bold' }}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card
                style={{
                  borderRadius: '12px',
                  border: '1px solid #f6ffed',
                  background: 'linear-gradient(135deg, #f6ffed 0%, #ffffff 100%)',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}
              >
                <Statistic
                  title="平均评论数"
                  value={userInsights?.engagementPatterns?.avgCommentsPerPost || 0}
                  prefix={<EyeOutlined style={{ color: '#52c41a' }} />}
                  formatter={(value) => value.toLocaleString()}
                  valueStyle={{ color: '#52c41a', fontWeight: 'bold' }}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card
                style={{
                  borderRadius: '12px',
                  border: '1px solid #fff1f0',
                  background: 'linear-gradient(135deg, #fff1f0 0%, #ffffff 100%)',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}
              >
                <Statistic
                  title="峰值活跃时间"
                  value={userInsights?.engagementPatterns?.peakEngagementHour || '20:00'}
                  prefix={<ClockCircleOutlined style={{ color: '#f5222d' }} />}
                  valueStyle={{ color: '#f5222d', fontWeight: 'bold' }}
                />
              </Card>
            </Col>
          </Row>

          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Card
                title={
                  <Space>
                    <ClockCircleOutlined style={{ color: '#667eea' }} />
                    <span style={{ fontSize: '16px', fontWeight: 600 }}>用户活跃时段分布</span>
                  </Space>
                }
                size="small"
                style={{
                  height: '400px',
                  borderRadius: '12px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                  border: '1px solid #f0f0f0'
                }}
                headStyle={{
                  borderBottom: '1px solid #f0f0f0',
                  paddingBottom: '16px'
                }}
              >
                <div className="flex items-center justify-center h-full">
                  <ResponsiveContainer width="100%" height={320}>
                    <PieChart>
                      <Pie
                        data={userInsights?.userActivity || []}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ timeSlot, percentage }) => `${timeSlot} ${percentage}%`}
                        outerRadius={100}
                        innerRadius={40}
                        fill="#8884d8"
                        dataKey="activeUsers"
                        nameKey="timeSlot"
                        stroke="#fff"
                        strokeWidth={3}
                      >
                        {(userInsights?.userActivity || []).map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={['#667eea', '#764ba2', '#f093fb', '#4facfe'][index]}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#fff',
                          border: 'none',
                          borderRadius: '12px',
                          boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                          fontSize: '14px'
                        }}
                        formatter={(value: any, name: string) => [
                          `${Number(value).toLocaleString()} 人`,
                          '活跃用户'
                        ]}
                        labelFormatter={(label: string) => `${label}时段`}
                      />
                      <Legend
                        verticalAlign="bottom"
                        height={36}
                        iconType="circle"
                        wrapperStyle={{
                          paddingTop: '20px',
                          fontSize: '14px'
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </Col>
            <Col span={12}>
              <Card
                title={
                  <Space>
                    <UserOutlined style={{ color: '#f093fb' }} />
                    <span style={{ fontSize: '16px', fontWeight: 600 }}>年龄分布统计</span>
                  </Space>
                }
                size="small"
                style={{
                  height: '400px',
                  borderRadius: '12px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                  border: '1px solid #f0f0f0'
                }}
                headStyle={{
                  borderBottom: '1px solid #f0f0f0',
                  paddingBottom: '16px'
                }}
              >
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={userInsights?.ageGroups?.slice(0, 8) || []}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ ageLabel, percentage }) => `${ageLabel} ${percentage}%`}
                      outerRadius={90}
                      innerRadius={30}
                      fill="#8884d8"
                      dataKey="count"
                      nameKey="ageLabel"
                      stroke="#fff"
                      strokeWidth={2}
                    >
                      {(userInsights?.ageGroups?.slice(0, 8) || []).map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={[
                            '#667eea', '#764ba2', '#f093fb', '#f5576c',
                            '#4facfe', '#00f2fe', '#43e97b', '#38f9d7'
                          ][index % 8]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#fff',
                        border: 'none',
                        borderRadius: '8px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                        fontSize: '14px'
                      }}
                      formatter={(value: any, name: string, props: any) => [
                        `${Number(value).toLocaleString()} 人 (${props.payload.percentage}%)`,
                        '用户数量'
                      ]}
                    />
                    <Legend
                      verticalAlign="bottom"
                      height={36}
                      iconType="circle"
                      wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </Card>
            </Col>
          </Row>
        </div>
      )
    },
    {
      key: 'age',
      label: '👥 年龄分析',
      children: (
        <div>
          <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
            <Col span={24}>
              <Card
                title={
                  <Space>
                    <UserOutlined style={{ color: '#f5576c' }} />
                    <span style={{ fontSize: '14px', fontWeight: 600 }}>年龄分布</span>
                  </Space>
                }
                style={{
                  height: '720px',
                  borderRadius: '12px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                  border: '1px solid #f0f0f0'
                }}
                headStyle={{
                  borderBottom: '1px solid #f0f0f0',
                  paddingBottom: '1px',
                  paddingTop: '12px'
                }}
              >
                <div style={{ padding: '1px 8px 12px 8px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {(userInsights?.ageGroups || []).map((item, index) => {
                    const colors = [
                      { bg: '#3b82f6', light: '#dbeafe' }, // blue
                      { bg: '#8b5cf6', light: '#ede9fe' }, // purple
                      { bg: '#ec4899', light: '#fce7f3' }, // pink
                      { bg: '#ef4444', light: '#fee2e2' }, // red
                      { bg: '#6366f1', light: '#e0e7ff' }, // indigo
                      { bg: '#06b6d4', light: '#cffafe' }, // cyan
                      { bg: '#10b981', light: '#d1fae5' }, // green
                      { bg: '#14b8a6', light: '#ccfbf1' }  // teal
                    ];
                    const color = colors[index % 8];
                    const maxCount = Math.max(...(userInsights?.ageGroups || []).map(g => g.count));
                    const widthPercent = (item.count / maxCount) * 100;

                    return (
                      <div
                        key={item.ageLabel}
                        style={{
                          backgroundColor: '#ffffff',
                          borderRadius: '6px',
                          padding: '6px',
                          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                          border: '1px solid #e5e7eb',
                          transition: 'box-shadow 0.2s'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '3px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div
                              style={{
                                width: '10px',
                                height: '10px',
                                borderRadius: '50%',
                                backgroundColor: color.bg,
                                flexShrink: 0
                              }}
                            />
                            <span style={{ fontWeight: '600', color: '#374151', fontSize: '13px' }}>{item.ageLabel}</span>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#111827' }}>
                              {(item.count / 1000).toFixed(0)}K
                            </div>
                            <div style={{ fontSize: '10px', color: '#6b7280' }}>{item.percentage}%</div>
                          </div>
                        </div>

                        <div
                          style={{
                            width: '100%',
                            height: '4px',
                            borderRadius: '2px',
                            backgroundColor: color.light,
                            overflow: 'hidden',
                            marginBottom: '3px'
                          }}
                        >
                          <div
                            style={{
                              height: '4px',
                              borderRadius: '2px',
                              backgroundColor: color.bg,
                              width: `${widthPercent}%`,
                              transition: 'width 1s ease-out'
                            }}
                          />
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px', color: '#6b7280' }}>
                          <span>参与度: {item.avgEngagement}</span>
                          <span>{item.count.toLocaleString()} 用户</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>
            </Col>
          </Row>
          <Card title="年龄群体详情">
            <Table
              columns={ageColumns}
              dataSource={userInsights?.ageGroups || []}
              rowKey="ageGroup"
              loading={loading}
              pagination={false}
              size="middle"
            />
          </Card>
        </div>
      )
    }
  ];

  return (
    <div style={{ padding: '24px', background: '#f5f5f5', minHeight: '100vh' }}>
      <Card
        style={{
          marginBottom: 24,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          border: 'none',
          borderRadius: '12px'
        }}
      >
        <div style={{ color: 'white' }}>
          <Title level={2} style={{ color: 'white', margin: 0, marginBottom: 8 }}>
            <UserOutlined style={{ marginRight: 8 }} />
            用户洞察分析
          </Title>
          <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: '16px' }}>
            专业的小红书用户洞察分析平台
          </Text>
        </div>
      </Card>

      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={tabItems}
        size="large"
      />
    </div>
  );
};

export default SimpleUserInsights;
