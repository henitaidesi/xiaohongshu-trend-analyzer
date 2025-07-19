// 用户洞察页面
import React, { useState, useEffect } from 'react';
import { 
  Card, Row, Col, Statistic, Table, Tag, Button, 
  Progress, Space, Typography, Tooltip, message 
} from 'antd';
import {
  UserOutlined, TeamOutlined, EnvironmentOutlined,
  ClockCircleOutlined, HeartOutlined, EyeOutlined,
  ReloadOutlined, RiseOutlined
} from '@ant-design/icons';
import { simpleDataService } from '../services/simpleDataService';

const { Title, Text } = Typography;

interface UserData {
  ageGroup: string;
  count: number;
  percentage: number;
  avgEngagement: number;
  topCategory: string;
  activeTime: string;
  growth: number;
}

interface RegionData {
  region: string;
  userCount: number;
  percentage: number;
  avgPosts: number;
  topCategory: string;
}

const UserInsights: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [ageData, setAgeData] = useState<UserData[]>([]);
  const [regionData, setRegionData] = useState<RegionData[]>([]);
  const [totalUsers, setTotalUsers] = useState(0);

  // 加载数据 - 使用真实数据分析
  const loadData = async () => {
    setLoading(true);
    try {
      console.log('👥 加载用户洞察真实数据...');

      // 获取用户洞察数据
      const userInsightsData = await simpleDataService.getUserInsights();

      if (userInsightsData) {
        console.log('✅ 用户洞察数据加载成功');
        setTotalUsers(userInsightsData.totalUsers);
        setAgeData(userInsightsData.ageGroups || []);
        setRegionData(userInsightsData.regionDistribution || []);

      } else {
        throw new Error('无法获取用户洞察数据');
      }

    } catch (error) {
      console.error('加载数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 生成用户洞察数据
  const generateUserInsights = () => {
    // 年龄分布数据
    const ageGroups = [
      { ageGroup: '18-24岁', basePercentage: 35 },
      { ageGroup: '25-30岁', basePercentage: 28 },
      { ageGroup: '31-35岁', basePercentage: 20 },
      { ageGroup: '36-40岁', basePercentage: 12 },
      { ageGroup: '40岁以上', basePercentage: 5 }
    ];

    const categories = ['时尚', '美妆', '生活', '美食', '旅行'];
    const activeTimes = ['09:00-12:00', '12:00-15:00', '15:00-18:00', '18:00-21:00', '21:00-24:00'];

    const ageInsights = ageGroups.map(group => {
      const percentage = group.basePercentage + (Math.random() - 0.5) * 10;
      return {
        ageGroup: group.ageGroup,
        count: Math.floor(totalUsers * percentage / 100),
        percentage: Math.round(percentage * 10) / 10,
        avgEngagement: Math.floor(Math.random() * 50) + 20,
        topCategory: categories[Math.floor(Math.random() * categories.length)],
        activeTime: activeTimes[Math.floor(Math.random() * activeTimes.length)],
        growth: (Math.random() - 0.5) * 20
      };
    });

    setAgeData(ageInsights);

    // 地域分布数据
    const regions = [
      { region: '北京', basePercentage: 15 },
      { region: '上海', basePercentage: 12 },
      { region: '广州', basePercentage: 10 },
      { region: '深圳', basePercentage: 8 },
      { region: '杭州', basePercentage: 6 },
      { region: '成都', basePercentage: 5 },
      { region: '其他', basePercentage: 44 }
    ];

    const regionInsights = regions.map(region => {
      const percentage = region.basePercentage + (Math.random() - 0.5) * 5;
      return {
        region: region.region,
        userCount: Math.floor(totalUsers * percentage / 100),
        percentage: Math.round(percentage * 10) / 10,
        avgPosts: Math.floor(Math.random() * 20) + 5,
        topCategory: categories[Math.floor(Math.random() * categories.length)]
      };
    });

    setRegionData(regionInsights);
  };

  // 年龄分布表格列
  const ageColumns = [
    {
      title: '年龄段',
      dataIndex: 'ageGroup',
      key: 'ageGroup',
      render: (ageGroup: string) => (
        <Tag color="blue" style={{ fontSize: '14px', padding: '4px 8px' }}>
          {ageGroup}
        </Tag>
      )
    },
    {
      title: '用户数量',
      dataIndex: 'count',
      key: 'count',
      render: (count: number) => (
        <Text strong>{count.toLocaleString()}</Text>
      )
    },
    {
      title: '占比',
      dataIndex: 'percentage',
      key: 'percentage',
      render: (percentage: number) => (
        <div style={{ width: 100 }}>
          <Progress 
            percent={percentage} 
            size="small" 
            strokeColor="#1890ff"
            format={() => `${percentage}%`}
          />
        </div>
      )
    },
    {
      title: '平均参与度',
      dataIndex: 'avgEngagement',
      key: 'avgEngagement',
      render: (engagement: number) => (
        <Space>
          <HeartOutlined style={{ color: '#ff4d4f' }} />
          <Text>{engagement}%</Text>
        </Space>
      )
    },
    {
      title: '偏好分类',
      dataIndex: 'topCategory',
      key: 'topCategory',
      render: (category: string) => (
        <Tag color="green">{category}</Tag>
      )
    },
    {
      title: '活跃时段',
      dataIndex: 'activeTime',
      key: 'activeTime',
      render: (time: string) => (
        <Space>
          <ClockCircleOutlined style={{ color: '#faad14' }} />
          <Text>{time}</Text>
        </Space>
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
            <FallOutlined style={{ color: '#ff4d4f' }} />
          )}
          <Text style={{ color: growth > 0 ? '#52c41a' : '#ff4d4f' }}>
            {Math.abs(growth).toFixed(1)}%
          </Text>
        </Space>
      )
    }
  ];

  // 地域分布表格列
  const regionColumns = [
    {
      title: '地区',
      dataIndex: 'region',
      key: 'region',
      render: (region: string) => (
        <Space>
          <EnvironmentOutlined style={{ color: '#1890ff' }} />
          <Text strong>{region}</Text>
        </Space>
      )
    },
    {
      title: '用户数量',
      dataIndex: 'userCount',
      key: 'userCount',
      render: (count: number) => count.toLocaleString()
    },
    {
      title: '占比',
      dataIndex: 'percentage',
      key: 'percentage',
      render: (percentage: number) => (
        <Progress 
          percent={percentage} 
          size="small" 
          strokeColor="#52c41a"
          format={() => `${percentage}%`}
        />
      )
    },
    {
      title: '平均发布',
      dataIndex: 'avgPosts',
      key: 'avgPosts',
      render: (posts: number) => `${posts}篇/月`
    },
    {
      title: '热门分类',
      dataIndex: 'topCategory',
      key: 'topCategory',
      render: (category: string) => (
        <Tag color="orange">{category}</Tag>
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
          <UserOutlined style={{ color: '#52c41a', marginRight: '8px' }} />
          用户洞察分析
        </Title>
        <Text type="secondary">深入了解用户画像、地域分布和行为模式</Text>
      </div>

      {/* 统计卡片 */}
      <Row gutter={16} style={{ marginBottom: '24px' }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="总用户数"
              value={totalUsers}
              prefix={<TeamOutlined style={{ color: '#1890ff' }} />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="主要年龄段"
              value="18-24岁"
              prefix={<UserOutlined style={{ color: '#52c41a' }} />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="主要地区"
              value="北京"
              prefix={<EnvironmentOutlined style={{ color: '#faad14' }} />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="平均参与度"
              value="32.5"
              suffix="%"
              prefix={<EyeOutlined style={{ color: '#722ed1' }} />}
            />
          </Card>
        </Col>
      </Row>

      {/* 主要内容 */}
      <Row gutter={16}>
        <Col span={14}>
          <Card 
            title="年龄分布分析" 
            style={{ marginBottom: '16px' }}
            extra={
              <Button 
                icon={<ReloadOutlined />} 
                onClick={loadData} 
                loading={loading}
                size="small"
              >
                刷新
              </Button>
            }
          >
            <Table
              columns={ageColumns}
              dataSource={ageData}
              rowKey="ageGroup"
              loading={loading}
              pagination={false}
              size="small"
            />
          </Card>
        </Col>
        <Col span={10}>
          <Card title="地域分布分析" style={{ marginBottom: '16px' }}>
            <Table
              columns={regionColumns}
              dataSource={regionData}
              rowKey="region"
              loading={loading}
              pagination={false}
              size="small"
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default UserInsights;
