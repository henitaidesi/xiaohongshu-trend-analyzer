import React from 'react';
import { Row, Col, Card, Statistic, List, Button } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined, FireOutlined, LikeOutlined, UserOutlined, EditOutlined, TrendingUpOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';



const StyledStatisticCard = styled(Card)`
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  transition: all 0.3s;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  }
`;

const SectionTitle = styled.h2`
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  
  .icon {
    margin-right: 8px;
    color: #ff2442;
  }
`;

const TopicItem = styled.div`
  display: flex;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
  
  &:last-child {
    border-bottom: none;
  }
  
  .rank {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background-color: ${props => props.rank <= 3 ? '#ff2442' : '#f5f5f5'};
    color: ${props => props.rank <= 3 ? '#ffffff' : '#262626'};
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    margin-right: 12px;
  }
  
  .topic-name {
    flex: 1;
    font-weight: 500;
  }
  
  .heat-score {
    color: #ff2442;
    font-weight: 600;
    margin-right: 8px;
  }
  
  .trend {
    display: flex;
    align-items: center;
    font-size: 12px;
  }
  
  .trend.up {
    color: #52c41a;
  }
  
  .trend.down {
    color: #ff4d4f;
  }
`;

// 模拟数据
const mockTopics = [
  { id: '1', name: '春季穿搭指南', heatScore: 9.8, trend: 'up', trendValue: 12 },
  { id: '2', name: '护肤品测评', heatScore: 9.5, trend: 'up', trendValue: 8 },
  { id: '3', name: '美食探店', heatScore: 9.2, trend: 'up', trendValue: 15 },
  { id: '4', name: '旅行攻略', heatScore: 8.9, trend: 'down', trendValue: 3 },
  { id: '5', name: '健身日常', heatScore: 8.7, trend: 'up', trendValue: 5 },
  { id: '6', name: '居家好物', heatScore: 8.5, trend: 'down', trendValue: 2 },
  { id: '7', name: '化妆教程', heatScore: 8.3, trend: 'up', trendValue: 7 },
  { id: '8', name: '读书分享', heatScore: 8.1, trend: 'stable', trendValue: 0 },
  { id: '9', name: '职场经验', heatScore: 7.9, trend: 'up', trendValue: 4 },
  { id: '10', name: '数码评测', heatScore: 7.7, trend: 'down', trendValue: 1 },
];

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  // 静态统计数据
  const statistics = {
    totalTopics: 1256,
    activeUsers: 8.9,
    dailyPosts: 45.2,
    totalInteractions: 892,
    trends: {
      topics: 12,
      users: 8,
      posts: 15,
      interactions: 23
    }
  };

  return (
    <div>
      <Row gutter={[24, 24]}>
        <Col xs={24} sm={12} md={6}>
          <StyledStatisticCard>
            <Statistic
              title="总话题数"
              value={statistics.totalTopics}
              precision={0}
              valueStyle={{ color: '#262626' }}
              prefix={<FireOutlined />}
              suffix={
                <div className="stat-trend up">
                  <ArrowUpOutlined /> {statistics.trends.topics}%
                </div>
              }
            />
          </StyledStatisticCard>
        </Col>
        
        <Col xs={24} sm={12} md={6}>
          <StyledStatisticCard>
            <Statistic
              title="活跃用户"
              value={statistics.activeUsers}
              precision={1}
              valueStyle={{ color: '#262626' }}
              prefix={<UserOutlined />}
              suffix={
                <div>
                  M
                  <div className="stat-trend up">
                    <ArrowUpOutlined /> {statistics.trends.users}%
                  </div>
                </div>
              }
            />
          </StyledStatisticCard>
        </Col>
        
        <Col xs={24} sm={12} md={6}>
          <StyledStatisticCard>
            <Statistic
              title="日均发布"
              value={statistics.dailyPosts}
              precision={1}
              valueStyle={{ color: '#262626' }}
              prefix={<EditOutlined />}
              suffix={
                <div>
                  K
                  <div className="stat-trend up">
                    <ArrowUpOutlined /> {statistics.trends.posts}%
                  </div>
                </div>
              }
            />
          </StyledStatisticCard>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <StyledStatisticCard>
            <Statistic
              title="互动总量"
              value={statistics.totalInteractions}
              precision={0}
              valueStyle={{ color: '#262626' }}
              prefix={<LikeOutlined />}
              suffix={
                <div>
                  K
                  <div className="stat-trend up">
                    <ArrowUpOutlined /> {statistics.trends.interactions}%
                  </div>
                </div>
              }
            />
          </StyledStatisticCard>
        </Col>
      </Row>
      
      <Row gutter={[24, 24]} style={{ marginTop: '24px' }}>
        <Col xs={24} md={12}>
          <Card
            title={
              <SectionTitle>
                <FireOutlined className="icon" /> 热门话题 TOP10
              </SectionTitle>
            }
            extra={<Button type="link" onClick={() => navigate('/topics')}>查看更多</Button>}
            bordered={false}
            className="card-shadow"
          >
            <List
              dataSource={mockTopics}
              renderItem={(topic, index) => (
                <TopicItem rank={index + 1}>
                  <div className="rank">{index + 1}</div>
                  <div className="topic-name">{topic.name}</div>
                  <div className="heat-score">{topic.heatScore}</div>
                  <div className={`trend ${topic.trend}`}>
                    {topic.trend === 'up' ? (
                      <ArrowUpOutlined style={{ marginRight: '4px' }} />
                    ) : topic.trend === 'down' ? (
                      <ArrowDownOutlined style={{ marginRight: '4px' }} />
                    ) : null}
                    {topic.trendValue}%
                  </div>
                </TopicItem>
              )}
            />
          </Card>
        </Col>
        
        <Col xs={24} md={12}>
          <Card
            title={
              <SectionTitle>
                <TrendingUpOutlined className="icon" /> 快速导航
              </SectionTitle>
            }
            bordered={false}
            className="card-shadow"
          >
            <Row gutter={[16, 16]}>
              <Col xs={12} sm={6}>
                <Button
                  type="primary"
                  size="large"
                  block
                  icon={<FireOutlined />}
                  onClick={() => navigate('/topics')}
                  style={{ height: '60px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
                >
                  热点话题
                </Button>
              </Col>
              <Col xs={12} sm={6}>
                <Button
                  type="primary"
                  size="large"
                  block
                  icon={<TrendingUpOutlined />}
                  onClick={() => navigate('/trends')}
                  style={{ height: '60px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
                >
                  创作趋势
                </Button>
              </Col>
              <Col xs={12} sm={6}>
                <Button
                  type="primary"
                  size="large"
                  block
                  icon={<UserOutlined />}
                  onClick={() => navigate('/insights')}
                  style={{ height: '60px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
                >
                  用户洞察
                </Button>
              </Col>
              <Col xs={12} sm={6}>
                <Button
                  type="primary"
                  size="large"
                  block
                  icon={<EditOutlined />}
                  onClick={() => navigate('/assistant')}
                  style={{ height: '60px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
                >
                  AI助手
                </Button>
              </Col>
            </Row>

            <div style={{ marginTop: '24px', padding: '16px', backgroundColor: '#f6ffed', borderRadius: '6px' }}>
              <h4 style={{ margin: '0 0 8px 0', color: '#52c41a' }}>💡 平台特色</h4>
              <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>
                基于53,000条真实小红书数据，提供专业的内容趋势分析和创作建议
              </p>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default HomePage;
