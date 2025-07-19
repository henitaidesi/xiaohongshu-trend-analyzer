import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Table, Tag, Input, Select, Button, Space } from 'antd';
import { SearchOutlined, FilterOutlined, TrendingUpOutlined, TrendingDownOutlined, MinusOutlined, FireOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { mockApi, mockTopics } from '../../services/mockData';
import LineChart from '../../components/charts/LineChart';

const { Search } = Input;
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

const FilterSection = styled.div`
  background: #ffffff;
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
`;

const TopicsPage: React.FC = () => {
  const [topics, setTopics] = useState(mockTopics);
  const [loading, setLoading] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [trendData, setTrendData] = useState<any[]>([]);

  useEffect(() => {
    loadTrendData();
  }, []);

  const loadTrendData = async () => {
    try {
      const data = await mockApi.getTrendData();
      setTrendData(data);
    } catch (error) {
      console.error('Failed to load trend data:', error);
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUpOutlined style={{ color: '#52c41a' }} />;
      case 'down':
        return <TrendingDownOutlined style={{ color: '#ff4d4f' }} />;
      default:
        return <MinusOutlined style={{ color: '#8c8c8c' }} />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up':
        return '#52c41a';
      case 'down':
        return '#ff4d4f';
      default:
        return '#8c8c8c';
    }
  };

  const columns = [
    {
      title: '排名',
      dataIndex: 'rank',
      key: 'rank',
      width: 80,
      render: (_: any, __: any, index: number) => (
        <div style={{
          width: 32,
          height: 32,
          borderRadius: '50%',
          background: index < 3 ? '#ff2442' : '#f5f5f5',
          color: index < 3 ? '#ffffff' : '#262626',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 600,
        }}>
          {index + 1}
        </div>
      ),
    },
    {
      title: '话题名称',
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => (
        <span style={{ fontWeight: 500, color: '#262626' }}>{text}</span>
      ),
    },
    {
      title: '分类',
      dataIndex: 'category',
      key: 'category',
      render: (category: string) => (
        <Tag color="blue">{category}</Tag>
      ),
    },
    {
      title: '热度指数',
      dataIndex: 'heatScore',
      key: 'heatScore',
      render: (score: number) => (
        <span style={{ color: '#ff2442', fontWeight: 600 }}>{score}</span>
      ),
    },
    {
      title: '趋势',
      dataIndex: 'trend',
      key: 'trend',
      render: (trend: string, record: any) => (
        <Space>
          {getTrendIcon(trend)}
          <span style={{ color: getTrendColor(trend) }}>
            {record.trendValue}%
          </span>
        </Space>
      ),
    },
  ];

  const filteredTopics = topics.filter(topic => {
    const matchesKeyword = !searchKeyword || topic.name.toLowerCase().includes(searchKeyword.toLowerCase());
    const matchesCategory = !selectedCategory || topic.category === selectedCategory;
    return matchesKeyword && matchesCategory;
  });

  const categories = Array.from(new Set(topics.map(topic => topic.category)));

  return (
    <div>
      <PageHeader>
        <h1>
          <FireOutlined style={{ marginRight: 8, color: '#ff2442' }} />
          热点话题分析
        </h1>
        <p>实时监测小红书平台热门话题，洞察内容创作趋势</p>
      </PageHeader>

      <Row gutter={[24, 24]}>
        <Col span={24}>
          <FilterSection>
            <Space size="middle">
              <Search
                placeholder="搜索话题名称"
                allowClear
                style={{ width: 300 }}
                onSearch={setSearchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
              />
              <Select
                placeholder="选择分类"
                allowClear
                style={{ width: 200 }}
                value={selectedCategory}
                onChange={setSelectedCategory}
              >
                {categories.map(category => (
                  <Option key={category} value={category}>{category}</Option>
                ))}
              </Select>
              <Button icon={<FilterOutlined />}>
                高级筛选
              </Button>
            </Space>
          </FilterSection>
        </Col>

        <Col xs={24} lg={16}>
          <Card title="热门话题排行榜" bordered={false}>
            <Table
              columns={columns}
              dataSource={filteredTopics}
              rowKey="id"
              loading={loading}
              pagination={{
                pageSize: 20,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total) => `共 ${total} 个话题`,
              }}
            />
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Row gutter={[0, 24]}>
            <Col span={24}>
              <Card title="话题趋势" bordered={false}>
                <LineChart
                  data={trendData}
                  height={300}
                  smooth={true}
                  showArea={true}
                />
              </Card>
            </Col>

            <Col span={24}>
              <Card title="分类统计" bordered={false}>
                <Space direction="vertical" style={{ width: '100%' }}>
                  {categories.slice(0, 5).map(category => {
                    const count = topics.filter(t => t.category === category).length;
                    const percentage = ((count / topics.length) * 100).toFixed(1);
                    return (
                      <div key={category} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span>{category}</span>
                        <span style={{ color: '#ff2442', fontWeight: 600 }}>
                          {count} ({percentage}%)
                        </span>
                      </div>
                    );
                  })}
                </Space>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
};

export default TopicsPage;
