import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Tabs, Progress, Avatar, List, Tag, Spin, Alert } from 'antd';
import { UserOutlined, TeamOutlined, EnvironmentOutlined, HeartOutlined, ShoppingOutlined, TrophyOutlined, ClockCircleOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { realUserInsightsService, UserInsightData } from '../../services/realUserInsightsService';
import PieChart from '../../components/charts/PieChart';
import BarChart from '../../components/charts/BarChart';

const { TabPane } = Tabs;

const PageHeader = styled.div`
  margin-bottom: 24px;

  h1 {
    font-size: 24px;
    font-weight: 600;
    color: #262626;
    margin-bottom: 8px;
  }

  p {
    color: #8c8c8c;
    margin: 0;
  }
`;

const UserCard = styled(Card)`
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  transition: all 0.3s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  }
`;

const InsightsPage: React.FC = () => {
  const [userInsights, setUserInsights] = useState<UserInsightData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadUserInsights();
  }, []);

  const loadUserInsights = async () => {
    try {
      setLoading(true);
      setError(null);

      const insights = await realUserInsightsService.getUserInsights();
      setUserInsights(insights);
    } catch (err) {
      console.error('❌ 用户洞察数据加载失败:', err);
      setError('数据加载失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  // 处理图表数据
  const getAgeChartData = () => {
    if (!userInsights?.ageGroups) return [];
    return userInsights.ageGroups.map(group => ({
      name: group.ageLabel,
      value: group.percentage,
      color: ['#ff2442', '#1890ff', '#52c41a', '#faad14', '#722ed1', '#eb2f96'][Math.floor(Math.random() * 6)]
    }));
  };

  const getRegionChartData = () => {
    if (!userInsights?.regionDistribution) return [];
    return [{
      name: '用户分布',
      data: userInsights.regionDistribution.slice(0, 8).map(region => ({
        x: region.region,
        y: region.percentage
      }))
    }];
  };

  const getInterestChartData = () => {
    if (!userInsights?.interestPreferences) return [];
    return userInsights.interestPreferences.map(interest => ({
      name: interest.category,
      value: interest.percentage,
      color: interest.color
    }));
  };

  const getActivityChartData = () => {
    if (!userInsights?.userActivity) return [];
    return [{
      name: '活跃度',
      data: userInsights.userActivity.map(activity => ({
        x: activity.timeSlot,
        y: activity.percentage
      }))
    }];
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 0' }}>
        <Spin size="large" />
        <div style={{ marginTop: 16, color: '#666' }}>正在分析用户洞察数据...</div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert
        message="数据加载失败"
        description={error}
        type="error"
        showIcon
        style={{ margin: '50px 0' }}
      />
    );
  }

  return (
    <div>
      <PageHeader>
        <h1>
          <UserOutlined style={{ marginRight: 8, color: '#ff2442' }} />
          用户洞察分析
        </h1>
        <p>基于 {userInsights?.ageGroups.reduce((sum, group) => sum + group.count, 0).toLocaleString()} 条真实数据的深度用户画像分析</p>
      </PageHeader>

      <Row gutter={[24, 24]}>
        {/* 年龄分布 */}
        <Col xs={24} md={12}>
          <Card title="年龄分布" bordered={false}>
            <PieChart
              data={getAgeChartData()}
              height={300}
              loading={false}
              showLegend={true}
            />
          </Card>
        </Col>

        {/* 地域分布 */}
        <Col xs={24} md={12}>
          <Card title="地域分布" bordered={false}>
            <BarChart
              data={getRegionChartData()}
              height={300}
              loading={false}
              horizontal={true}
              showLabel={true}
            />
          </Card>
        </Col>

        {/* 兴趣偏好 */}
        <Col xs={24} md={12}>
          <Card title="兴趣偏好" bordered={false}>
            <PieChart
              data={getInterestChartData()}
              height={300}
              loading={false}
              showLegend={true}
            />
          </Card>
        </Col>

        {/* 用户活跃时间 */}
        <Col xs={24} md={12}>
          <Card title="用户活跃时间" bordered={false}>
            <BarChart
              data={getActivityChartData()}
              height={300}
              loading={false}
              horizontal={false}
              showLabel={true}
            />
          </Card>
        </Col>

        {/* 年龄群体详细分析 */}
        <Col span={24}>
          <Card title="年龄群体详细分析" bordered={false}>
            <Row gutter={[16, 16]}>
              {userInsights?.ageGroups.slice(0, 3).map((group, index) => (
                <Col xs={24} md={8} key={group.ageGroup}>
                  <UserCard>
                    <div style={{ padding: '20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
                        <Avatar
                          size={48}
                          style={{
                            backgroundColor: ['#ff2442', '#1890ff', '#52c41a'][index],
                            marginRight: 12
                          }}
                        >
                          {group.ageLabel.slice(0, 2)}
                        </Avatar>
                        <div>
                          <h3 style={{ margin: 0, fontSize: 16 }}>{group.ageLabel}</h3>
                          <p style={{ margin: 0, color: '#8c8c8c', fontSize: 12 }}>{group.ageGroup}岁</p>
                        </div>
                      </div>

                      <div style={{ marginBottom: 12 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                          <span style={{ fontSize: 12, color: '#666' }}>用户占比</span>
                          <span style={{ fontSize: 12, fontWeight: 600 }}>{group.percentage}%</span>
                        </div>
                        <Progress percent={group.percentage} strokeColor={['#ff2442', '#1890ff', '#52c41a'][index]} size="small" />
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                        <span style={{ fontSize: 12, color: '#666' }}>参与度</span>
                        <span style={{ fontSize: 12, fontWeight: 600 }}>{group.avgEngagement}%</span>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                        <span style={{ fontSize: 12, color: '#666' }}>热门分类</span>
                        <Tag color="blue" style={{ fontSize: 10 }}>{group.topCategory}</Tag>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                        <span style={{ fontSize: 12, color: '#666' }}>活跃时间</span>
                        <span style={{ fontSize: 12, fontWeight: 600 }}>{group.activeTime}</span>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                        <span style={{ fontSize: 12, color: '#666' }}>消费水平</span>
                        <Tag color={group.consumptionLevel.includes('高') ? 'red' : group.consumptionLevel.includes('中') ? 'orange' : 'green'}>
                          {group.consumptionLevel}
                        </Tag>
                      </div>

                      <div style={{ marginTop: 12 }}>
                        <div style={{ fontSize: 12, color: '#666', marginBottom: 4 }}>特征标签</div>
                        <div>
                          {group.characteristicTags.slice(0, 3).map(tag => (
                            <Tag key={tag} size="small" style={{ marginBottom: 4 }}>{tag}</Tag>
                          ))}
                        </div>
                      </div>
                    </div>
                  </UserCard>
                </Col>
              ))}
            </Row>
          </Card>
        </Col>

        {/* 地域分布详细分析 */}
        <Col span={24}>
          <Card title="地域分布详细分析" bordered={false}>
            <Row gutter={[16, 16]}>
              {userInsights?.regionDistribution.slice(0, 5).map((region, index) => (
                <Col xs={24} sm={12} md={8} lg={4} xl={4} key={region.region}>
                  <UserCard>
                    <div style={{ padding: '16px', textAlign: 'center' }}>
                      <EnvironmentOutlined
                        style={{
                          fontSize: 32,
                          color: ['#ff2442', '#1890ff', '#52c41a', '#faad14', '#722ed1'][index],
                          marginBottom: 12
                        }}
                      />
                      <h4 style={{ margin: '0 0 8px 0', fontSize: 16 }}>{region.region}</h4>
                      <div style={{ marginBottom: 8 }}>
                        <span style={{ fontSize: 20, fontWeight: 600, color: '#262626' }}>
                          {region.percentage}%
                        </span>
                      </div>
                      <div style={{ fontSize: 12, color: '#8c8c8c', marginBottom: 8 }}>
                        {region.userCount.toLocaleString()} 用户
                      </div>
                      <Tag color="blue" size="small">{region.topCategory}</Tag>
                      <div style={{ marginTop: 8, fontSize: 12, color: '#666' }}>
                        参与度: {region.engagementRate}%
                      </div>
                    </div>
                  </UserCard>
                </Col>
              ))}
            </Row>
          </Card>
        </Col>

        {/* 用户行为洞察 */}
        <Col span={24}>
          <Card title="用户行为洞察" bordered={false}>
            <Row gutter={[16, 16]}>
              <Col xs={24} md={6}>
                <UserCard>
                  <div style={{ textAlign: 'center', padding: '20px' }}>
                    <TeamOutlined style={{ fontSize: 48, color: '#ff2442', marginBottom: 16 }} />
                    <h3>社交偏好</h3>
                    <p style={{ color: '#8c8c8c', marginBottom: 12 }}>
                      {userInsights?.behaviorPatterns.socialSharingBehavior || '高分享意愿'}
                    </p>
                    <div style={{ fontSize: 12, color: '#666' }}>
                      平均互动: {userInsights?.behaviorPatterns.avgInteractionsPerPost || 156} 次/篇
                    </div>
                  </div>
                </UserCard>
              </Col>

              <Col xs={24} md={6}>
                <UserCard>
                  <div style={{ textAlign: 'center', padding: '20px' }}>
                    <ClockCircleOutlined style={{ fontSize: 48, color: '#1890ff', marginBottom: 16 }} />
                    <h3>使用习惯</h3>
                    <p style={{ color: '#8c8c8c', marginBottom: 12 }}>
                      {userInsights?.behaviorPatterns.contentConsumptionPattern || '深度阅读型'}
                    </p>
                    <div style={{ fontSize: 12, color: '#666' }}>
                      平均停留: {userInsights?.behaviorPatterns.avgSessionDuration || 25} 分钟
                    </div>
                  </div>
                </UserCard>
              </Col>

              <Col xs={24} md={6}>
                <UserCard>
                  <div style={{ textAlign: 'center', padding: '20px' }}>
                    <HeartOutlined style={{ fontSize: 48, color: '#52c41a', marginBottom: 16 }} />
                    <h3>参与度</h3>
                    <p style={{ color: '#8c8c8c', marginBottom: 12 }}>
                      平均参与度 {userInsights?.engagementMetrics.engagementRate || 6.8}%
                    </p>
                    <div style={{ fontSize: 12, color: '#666' }}>
                      最活跃时间: {userInsights?.engagementMetrics.peakEngagementHour || '20:00'}
                    </div>
                  </div>
                </UserCard>
              </Col>

              <Col xs={24} md={6}>
                <UserCard>
                  <div style={{ textAlign: 'center', padding: '20px' }}>
                    <TrophyOutlined style={{ fontSize: 48, color: '#faad14', marginBottom: 16 }} />
                    <h3>内容质量</h3>
                    <p style={{ color: '#8c8c8c', marginBottom: 12 }}>
                      平均点赞 {userInsights?.engagementMetrics.avgLikes.toLocaleString() || '2,850'}
                    </p>
                    <div style={{ fontSize: 12, color: '#666' }}>
                      平均评论: {userInsights?.engagementMetrics.avgComments || 185}
                    </div>
                  </div>
                </UserCard>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default InsightsPage;
