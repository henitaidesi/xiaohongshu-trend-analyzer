import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Select, Button, Spin, message } from 'antd';
import { 
  LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { ReloadOutlined, BarChartOutlined } from '@ant-design/icons';

const { Option } = Select;

// 颜色主题
const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#00ff00'];

interface SimpleEnhancedChartsProps {
  data?: any[];
  loading?: boolean;
}

const SimpleEnhancedCharts: React.FC<SimpleEnhancedChartsProps> = ({ 
  data = [], 
  loading = false 
}) => {
  const [chartType, setChartType] = useState<string>('line');
  const [selectedMetric, setSelectedMetric] = useState<string>('engagement');
  const [chartData, setChartData] = useState<any[]>([]);

  // 调试函数
  const handleChartTypeChange = (value: string) => {
    console.log('图表类型切换:', value);
    setChartType(value);
    message.info(`图表类型已切换为: ${value}`);
  };

  const handleMetricChange = (value: string) => {
    console.log('指标切换:', value);
    setSelectedMetric(value);
    message.info(`指标已切换为: ${value}`);
  };

  // 生成模拟数据
  const generateMockData = () => {
    const mockData = [];
    const days = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
    
    for (let i = 0; i < 7; i++) {
      mockData.push({
        date: days[i],
        engagement: Math.floor(Math.random() * 100) + 20,
        views: Math.floor(Math.random() * 10000) + 1000,
        likes: Math.floor(Math.random() * 1000) + 100,
        comments: Math.floor(Math.random() * 200) + 20,
        shares: Math.floor(Math.random() * 50) + 5,
      });
    }
    
    return mockData;
  };

  useEffect(() => {
    if (data && data.length > 0) {
      // 转换传入的数据格式为图表需要的格式
      const convertedData = data.map((item: any, index: number) => ({
        date: item.category || `数据${index + 1}`,
        engagement: item.engagement || Math.floor(Math.random() * 100) + 20,
        views: item.count ? item.count * 100 : Math.floor(Math.random() * 10000) + 1000,
        likes: item.avgLikes || Math.floor(Math.random() * 1000) + 100,
        comments: item.avgComments || Math.floor(Math.random() * 200) + 20,
        shares: Math.floor(Math.random() * 50) + 5,
      }));
      setChartData(convertedData);
    } else {
      setChartData(generateMockData());
    }
  }, [data]);

  // 趋势线图表
  const renderLineChart = () => (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line 
          type="monotone" 
          dataKey={selectedMetric} 
          stroke="#8884d8" 
          strokeWidth={2}
          dot={{ fill: '#8884d8', strokeWidth: 2, r: 4 }}
          activeDot={{ r: 6 }}
        />
        <Line 
          type="monotone" 
          dataKey="views" 
          stroke="#82ca9d" 
          strokeWidth={2}
          dot={{ fill: '#82ca9d', strokeWidth: 2, r: 4 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );

  // 面积图
  const renderAreaChart = () => (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Area 
          type="monotone" 
          dataKey={selectedMetric} 
          stackId="1"
          stroke="#8884d8" 
          fill="#8884d8" 
          fillOpacity={0.6}
        />
        <Area 
          type="monotone" 
          dataKey="likes" 
          stackId="1"
          stroke="#82ca9d" 
          fill="#82ca9d" 
          fillOpacity={0.6}
        />
      </AreaChart>
    </ResponsiveContainer>
  );

  // 柱状图
  const renderBarChart = () => (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey={selectedMetric} fill="#8884d8" />
        <Bar dataKey="likes" fill="#82ca9d" />
        <Bar dataKey="comments" fill="#ffc658" />
      </BarChart>
    </ResponsiveContainer>
  );

  // 饼图数据
  const getPieData = () => {
    const categories = ['美妆', '穿搭', '美食', '旅行', '健身'];
    return categories.map((category, index) => ({
      name: category,
      value: Math.floor(Math.random() * 100) + 20,
      color: COLORS[index % COLORS.length]
    }));
  };

  // 饼图
  const renderPieChart = () => (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={getPieData()}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {getPieData().map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );

  const renderChart = () => {
    switch (chartType) {
      case 'line':
        return renderLineChart();
      case 'area':
        return renderAreaChart();
      case 'bar':
        return renderBarChart();
      case 'pie':
        return renderPieChart();
      default:
        return renderLineChart();
    }
  };

  const handleRefresh = () => {
    console.log('刷新按钮被点击'); // 调试日志
    const newData = generateMockData();
    setChartData(newData);
    message.success('数据已刷新');
  };

  return (
    <div style={{ padding: '24px' }}>
      <Row gutter={[16, 16]}>
        {/* 页面标题 */}
        <Col span={24}>
          <Card>
            <div style={{ textAlign: 'center' }}>
              <BarChartOutlined style={{ fontSize: '48px', color: '#1890ff', marginBottom: '16px' }} />
              <h1 style={{ margin: 0, fontSize: '24px' }}>📊 增强数据可视化</h1>
              <p style={{ color: '#666', marginTop: '8px' }}>
                多种图表类型，交互式数据分析
              </p>
            </div>
          </Card>
        </Col>

        {/* 主图表 */}
        <Col span={24}>
          <Card 
            title="📈 数据可视化分析"
            extra={
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <Select
                  value={chartType}
                  onChange={handleChartTypeChange}
                  style={{ width: 120 }}
                >
                  <Option value="line">趋势线图</Option>
                  <Option value="area">面积图</Option>
                  <Option value="bar">柱状图</Option>
                  <Option value="pie">饼图</Option>
                </Select>

                {chartType !== 'pie' && (
                  <Select
                    value={selectedMetric}
                    onChange={handleMetricChange}
                    style={{ width: 100 }}
                  >
                    <Option value="engagement">参与度</Option>
                    <Option value="views">浏览量</Option>
                    <Option value="likes">点赞数</Option>
                    <Option value="comments">评论数</Option>
                  </Select>
                )}
                
                <Button 
                  icon={<ReloadOutlined />} 
                  onClick={handleRefresh}
                  loading={loading}
                >
                  刷新
                </Button>
              </div>
            }
          >
            <Spin spinning={loading}>
              {renderChart()}
            </Spin>
          </Card>
        </Col>

        {/* 数据统计卡片 */}
        <Col span={6}>
          <Card size="small">
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1890ff' }}>
                {chartData.reduce((sum, item) => sum + (item.engagement || 0), 0)}
              </div>
              <div style={{ color: '#666', fontSize: '12px' }}>总参与度</div>
            </div>
          </Card>
        </Col>

        <Col span={6}>
          <Card size="small">
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#52c41a' }}>
                {chartData.reduce((sum, item) => sum + (item.views || 0), 0).toLocaleString()}
              </div>
              <div style={{ color: '#666', fontSize: '12px' }}>总浏览量</div>
            </div>
          </Card>
        </Col>

        <Col span={6}>
          <Card size="small">
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#faad14' }}>
                {chartData.reduce((sum, item) => sum + (item.likes || 0), 0).toLocaleString()}
              </div>
              <div style={{ color: '#666', fontSize: '12px' }}>总点赞数</div>
            </div>
          </Card>
        </Col>

        <Col span={6}>
          <Card size="small">
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#722ed1' }}>
                {chartData.reduce((sum, item) => sum + (item.comments || 0), 0)}
              </div>
              <div style={{ color: '#666', fontSize: '12px' }}>总评论数</div>
            </div>
          </Card>
        </Col>

        {/* 图表说明 */}
        <Col span={24}>
          <Card title="📋 图表说明" size="small">
            <Row gutter={[16, 8]}>
              <Col span={6}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '12px', height: '12px', backgroundColor: '#8884d8' }}></div>
                  <span style={{ fontSize: '12px' }}>趋势线图 - 显示数据随时间变化</span>
                </div>
              </Col>
              <Col span={6}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '12px', height: '12px', backgroundColor: '#82ca9d' }}></div>
                  <span style={{ fontSize: '12px' }}>面积图 - 显示数据累积效果</span>
                </div>
              </Col>
              <Col span={6}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '12px', height: '12px', backgroundColor: '#ffc658' }}></div>
                  <span style={{ fontSize: '12px' }}>柱状图 - 对比不同类别数据</span>
                </div>
              </Col>
              <Col span={6}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '12px', height: '12px', backgroundColor: '#ff7300' }}></div>
                  <span style={{ fontSize: '12px' }}>饼图 - 显示数据占比分布</span>
                </div>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default SimpleEnhancedCharts;
