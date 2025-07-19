import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Tabs, Radio, DatePicker, Space, Statistic, Divider } from 'antd';
import { TrendingUpOutlined, ClockCircleOutlined, PictureOutlined, VideoCameraOutlined, FileTextOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { mockApi, mockContentTypeData, mockPublishTimeData, mockInteractionData } from '../../services/mockData';
import PieChart from '../../components/charts/PieChart';
import LineChart from '../../components/charts/LineChart';
import BarChart from '../../components/charts/BarChart';

const { TabPane } = Tabs;
const { RangePicker } = DatePicker;

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

const StatCard = styled(Card)`
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  transition: all 0.3s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  }
`;

const TrendsPage: React.FC = () => {
  const [contentTypeData, setContentTypeData] = useState(mockContentTypeData);
  const [publishTimeData, setPublishTimeData] = useState<any[]>([]);
  const [interactionData, setInteractionData] = useState(mockInteractionData);
  const [timeRange, setTimeRange] = useState('7d');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // 将发布时间热力图数据转换为折线图数据
    const hourlyData = {
      name: '发布量',
      data: mockPublishTimeData.map(item => ({
        x: `${item.hour}:00`,
        y: item.value,
      })),
    };
    setPublishTimeData([hourlyData]);
  }, []);

  const handleTimeRangeChange = (e: any) => {
    setTimeRange(e.target.value);
  };

  return (
    <div>
      <PageHeader>
        <h1>
          <TrendingUpOutlined style={{ marginRight: 8, color: '#ff2442' }} />
          创作趋势分析
        </h1>
        <p>分析内容创作趋势，了解最佳发布时机和内容形式</p>
      </PageHeader>

      <Row gutter={[24, 24]}>
        <Col span={24}>
          <Card bordered={false}>
            <Space style={{ marginBottom: 16 }}>
              <Radio.Group value={timeRange} onChange={handleTimeRangeChange}>
                <Radio.Button value="7d">近7天</Radio.Button>
                <Radio.Button value="30d">近30天</Radio.Button>
                <Radio.Button value="90d">近90天</Radio.Button>
                <Radio.Button value="365d">近一年</Radio.Button>
              </Radio.Group>
              <RangePicker />
            </Space>
          </Card>
        </Col>

        <Col xs={24} sm={8}>
          <StatCard>
            <Statistic
              title="图文内容占比"
              value={contentTypeData[0].value}
              suffix="%"
              valueStyle={{ color: '#ff2442' }}
              prefix={<PictureOutlined />}
            />
          </StatCard>
        </Col>

        <Col xs={24} sm={8}>
          <StatCard>
            <Statistic
              title="视频内容占比"
              value={contentTypeData[1].value}
              suffix="%"
              valueStyle={{ color: '#1890ff' }}
              prefix={<VideoCameraOutlined />}
            />
          </StatCard>
        </Col>

        <Col xs={24} sm={8}>
          <StatCard>
            <Statistic
              title="其他内容占比"
              value={contentTypeData[2].value + contentTypeData[3].value}
              suffix="%"
              valueStyle={{ color: '#52c41a' }}
              prefix={<FileTextOutlined />}
            />
          </StatCard>
        </Col>

        <Col xs={24} md={12}>
          <Card title="内容类型分布" bordered={false}>
            <PieChart
              data={contentTypeData}
              height={300}
              loading={loading}
              showLegend={true}
            />
          </Card>
        </Col>

        <Col xs={24} md={12}>
          <Card title="发布时间分布" bordered={false}>
            <LineChart
              data={publishTimeData}
              height={300}
              loading={loading}
              xAxisLabel="小时"
              yAxisLabel="发布量"
            />
          </Card>
        </Col>

        <Col span={24}>
          <Card title="互动类型分析" bordered={false}>
            <BarChart
              data={interactionData}
              height={400}
              loading={loading}
              xAxisLabel="星期"
              yAxisLabel="互动量"
              showLabel={true}
            />
          </Card>
        </Col>

        <Col span={24}>
          <Card title="创作建议" bordered={false}>
            <Row gutter={[16, 16]}>
              <Col xs={24} md={8}>
                <Card title="最佳发布时间" bordered={false} className="card-shadow">
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <ClockCircleOutlined style={{ fontSize: 48, color: '#ff2442', marginBottom: 16 }} />
                    <h3 style={{ fontSize: 24, fontWeight: 600 }}>20:00 - 22:00</h3>
                    <p style={{ color: '#8c8c8c' }}>该时段用户活跃度最高，互动率提升30%</p>
                  </div>
                </Card>
              </Col>

              <Col xs={24} md={8}>
                <Card title="推荐内容形式" bordered={false} className="card-shadow">
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <VideoCameraOutlined style={{ fontSize: 48, color: '#1890ff', marginBottom: 16 }} />
                    <h3 style={{ fontSize: 24, fontWeight: 600 }}>短视频 + 图文</h3>
                    <p style={{ color: '#8c8c8c' }}>混合内容形式获得更高的完播率和互动率</p>
                  </div>
                </Card>
              </Col>

              <Col xs={24} md={8}>
                <Card title="内容长度建议" bordered={false} className="card-shadow">
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <FileTextOutlined style={{ fontSize: 48, color: '#52c41a', marginBottom: 16 }} />
                    <h3 style={{ fontSize: 24, fontWeight: 600 }}>3-5分钟</h3>
                    <p style={{ color: '#8c8c8c' }}>中等长度内容完播率最高，转化效果最好</p>
                  </div>
                </Card>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default TrendsPage;
