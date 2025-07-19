import React, { useEffect, useState } from 'react';
import { Row, Col, Card, List, Tag, Button, Input, Select, Progress, Alert, Space, Divider } from 'antd';
import { BulbOutlined, ClockCircleOutlined, TagsOutlined, TrophyOutlined, RocketOutlined, CheckCircleOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { mockApi, mockCreationSuggestions } from '../../services/mockData';

const { TextArea } = Input;
const { Option } = Select;

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

const SuggestionCard = styled(Card)`
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  transition: all 0.3s;
  margin-bottom: 16px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  }
`;

const ConfidenceBar = styled.div<{ confidence: number }>`
  width: 100%;
  height: 4px;
  background: #f0f0f0;
  border-radius: 2px;
  overflow: hidden;
  margin-top: 8px;

  &::after {
    content: '';
    display: block;
    width: ${props => props.confidence}%;
    height: 100%;
    background: ${props =>
      props.confidence >= 80 ? '#52c41a' :
      props.confidence >= 60 ? '#faad14' : '#ff4d4f'
    };
    transition: width 0.3s ease;
  }
`;

const AssistantPage: React.FC = () => {
  const [suggestions, setSuggestions] = useState(mockCreationSuggestions);
  const [loading, setLoading] = useState(false);
  const [contentInput, setContentInput] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const getSuggestionIcon = (type: string) => {
    switch (type) {
      case 'topic':
        return <BulbOutlined style={{ color: '#ff2442' }} />;
      case 'time':
        return <ClockCircleOutlined style={{ color: '#1890ff' }} />;
      case 'format':
        return <RocketOutlined style={{ color: '#52c41a' }} />;
      case 'tag':
        return <TagsOutlined style={{ color: '#faad14' }} />;
      default:
        return <TrophyOutlined style={{ color: '#722ed1' }} />;
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return '#52c41a';
    if (confidence >= 60) return '#faad14';
    return '#ff4d4f';
  };

  const getConfidenceText = (confidence: number) => {
    if (confidence >= 80) return '高置信度';
    if (confidence >= 60) return '中等置信度';
    return '低置信度';
  };

  // 热门标签数据
  const hotTags = [
    { name: '#春日穿搭', heat: 95, trend: 'up' },
    { name: '#护肤心得', heat: 88, trend: 'up' },
    { name: '#美食探店', heat: 82, trend: 'stable' },
    { name: '#旅行攻略', heat: 76, trend: 'down' },
    { name: '#健身日常', heat: 71, trend: 'up' },
    { name: '#居家好物', heat: 68, trend: 'stable' },
    { name: '#化妆教程', heat: 65, trend: 'up' },
    { name: '#读书分享', heat: 58, trend: 'stable' },
  ];

  return (
    <div>
      <PageHeader>
        <h1>
          <BulbOutlined style={{ marginRight: 8, color: '#ff2442' }} />
          智能创作助手
        </h1>
        <p>基于AI分析的个性化创作建议，助力内容创作者提升创作效果</p>
      </PageHeader>

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={16}>
          <Card title="智能创作建议" bordered={false}>
            <List
              dataSource={suggestions}
              renderItem={(item) => (
                <SuggestionCard size="small">
                  <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                    <div style={{ marginRight: 16, fontSize: 24 }}>
                      {getSuggestionIcon(item.type)}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                        <h4 style={{ margin: 0, fontWeight: 600 }}>{item.title}</h4>
                        <Tag color={getConfidenceColor(item.confidence)}>
                          {getConfidenceText(item.confidence)}
                        </Tag>
                      </div>
                      <p style={{ margin: 0, marginBottom: 8, fontSize: 16, fontWeight: 500, color: '#ff2442' }}>
                        {item.content}
                      </p>
                      <p style={{ margin: 0, color: '#8c8c8c', fontSize: 14 }}>
                        {item.reason}
                      </p>
                      <ConfidenceBar confidence={item.confidence} />
                    </div>
                  </div>
                </SuggestionCard>
              )}
            />
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Row gutter={[0, 24]}>
            <Col span={24}>
              <Card title="热门标签" bordered={false}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {hotTags.map((tag, index) => (
                    <Tag
                      key={index}
                      color={tag.trend === 'up' ? 'red' : tag.trend === 'down' ? 'blue' : 'default'}
                      style={{ marginBottom: 8, cursor: 'pointer' }}
                    >
                      {tag.name} ({tag.heat})
                    </Tag>
                  ))}
                </div>
              </Card>
            </Col>

            <Col span={24}>
              <Card title="最佳发布时间" bordered={false}>
                <div style={{ textAlign: 'center', padding: '20px 0' }}>
                  <ClockCircleOutlined style={{ fontSize: 48, color: '#1890ff', marginBottom: 16 }} />
                  <h3 style={{ fontSize: 20, fontWeight: 600, marginBottom: 8 }}>20:00 - 22:00</h3>
                  <p style={{ color: '#8c8c8c', marginBottom: 16 }}>工作日最佳发布时间</p>

                  <Divider />

                  <h3 style={{ fontSize: 20, fontWeight: 600, marginBottom: 8 }}>14:00 - 16:00</h3>
                  <p style={{ color: '#8c8c8c' }}>周末最佳发布时间</p>
                </div>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
};

export default AssistantPage;
