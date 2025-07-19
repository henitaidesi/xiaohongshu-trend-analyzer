import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Select, Button, Spin, message } from 'antd';
import { 
  LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  ScatterChart, Scatter, ComposedChart
} from 'recharts';
import { ReloadOutlined, DownloadOutlined, FullscreenOutlined } from '@ant-design/icons';

const { Option } = Select;

// 颜色主题
const COLORS = [
  '#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#00ff00',
  '#ff00ff', '#00ffff', '#ff0000', '#0000ff', '#ffff00'
];

interface EnhancedChartsProps {
  data?: any[];
  loading?: boolean;
  onRefresh?: () => void;
}

const EnhancedCharts: React.FC<EnhancedChartsProps> = ({ 
  data = [], 
  loading = false, 
  onRefresh 
}) => {
  const [chartType, setChartType] = useState<string>('line');
  const [timeRange, setTimeRange] = useState<string>('7d');
  const [selectedMetric, setSelectedMetric] = useState<string>('engagement');

  // 模拟数据生成
  const generateMockData = () => {
    const mockData = [];
    const categories = ['美妆', '穿搭', '美食', '旅行', '健身', '数码'];
    const days = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
    
    for (let i = 0; i < 7; i++) {
      const item: any = {
        date: days[i],
        day: days[i],
        engagement: Math.floor(Math.random() * 100) + 20,
        views: Math.floor(Math.random() * 10000) + 1000,
        likes: Math.floor(Math.random() * 1000) + 100,
        comments: Math.floor(Math.random() * 200) + 20,
        shares: Math.floor(Math.random() * 50) + 5,
      };
      
      // 为每个类别添加数据
      categories.forEach(category => {
        item[category] = Math.floor(Math.random() * 80) + 20;
      });
      
      mockData.push(item);
    }
    
    return mockData;
  };

  const [chartData, setChartData] = useState(generateMockData());

  useEffect(() => {
    if (data && data.length > 0) {
      setChartData(data);
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
    const categories = ['美妆', '穿搭', '美食', '旅行', '健身', '数码'];
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

  // 雷达图
  const renderRadarChart = () => {
    const radarData = [
      { subject: '内容质量', A: 120, B: 110, fullMark: 150 },
      { subject: '用户参与', A: 98, B: 130, fullMark: 150 },
      { subject: '传播效果', A: 86, B: 130, fullMark: 150 },
      { subject: '情感倾向', A: 99, B: 100, fullMark: 150 },
      { subject: '创新性', A: 85, B: 90, fullMark: 150 },
      { subject: '时效性', A: 65, B: 85, fullMark: 150 },
    ];

    return (
      <ResponsiveContainer width="100%" height={300}>
        <RadarChart data={radarData}>
          <PolarGrid />
          <PolarAngleAxis dataKey="subject" />
          <PolarRadiusAxis />
          <Radar
            name="当前数据"
            dataKey="A"
            stroke="#8884d8"
            fill="#8884d8"
            fillOpacity={0.6}
          />
          <Radar
            name="对比数据"
            dataKey="B"
            stroke="#82ca9d"
            fill="#82ca9d"
            fillOpacity={0.6}
          />
          <Legend />
          <Tooltip />
        </RadarChart>
      </ResponsiveContainer>
    );
  };

  // 散点图
  const renderScatterChart = () => {
    const scatterData = chartData.map(item => ({
      x: item.likes,
      y: item.comments,
      z: item.shares,
      name: item.date
    }));

    return (
      <ResponsiveContainer width="100%" height={300}>
        <ScatterChart data={scatterData}>
          <CartesianGrid />
          <XAxis type="number" dataKey="x" name="点赞数" />
          <YAxis type="number" dataKey="y" name="评论数" />
          <Tooltip cursor={{ strokeDasharray: '3 3' }} />
          <Scatter name="数据点" dataKey="z" fill="#8884d8" />
        </ScatterChart>
      </ResponsiveContainer>
    );
  };

  // 组合图表
  const renderComposedChart = () => (
    <ResponsiveContainer width="100%" height={300}>
      <ComposedChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis yAxisId="left" />
        <YAxis yAxisId="right" orientation="right" />
        <Tooltip />
        <Legend />
        <Area 
          yAxisId="left"
          type="monotone" 
          dataKey="views" 
          fill="#8884d8" 
          stroke="#8884d8"
          fillOpacity={0.3}
        />
        <Bar yAxisId="left" dataKey="likes" fill="#413ea0" />
        <Line 
          yAxisId="right"
          type="monotone" 
          dataKey="engagement" 
          stroke="#ff7300" 
          strokeWidth={2}
        />
      </ComposedChart>
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
      case 'radar':
        return renderRadarChart();
      case 'scatter':
        return renderScatterChart();
      case 'composed':
        return renderComposedChart();
      default:
        return renderLineChart();
    }
  };

  const handleRefresh = () => {
    if (onRefresh) {
      onRefresh();
    } else {
      setChartData(generateMockData());
      message.success('数据已刷新');
    }
  };

  const handleExport = () => {
    // 这里可以实现图表导出功能
    message.info('导出功能开发中...');
  };

  const handleFullscreen = () => {
    // 这里可以实现全屏功能
    message.info('全屏功能开发中...');
  };

  return (
    <div style={{ padding: '20px' }}>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card 
            title="📊 增强版数据可视化"
            extra={
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <Select
                  value={chartType}
                  onChange={setChartType}
                  style={{ width: 120 }}
                >
                  <Option value="line">趋势线图</Option>
                  <Option value="area">面积图</Option>
                  <Option value="bar">柱状图</Option>
                  <Option value="pie">饼图</Option>
                  <Option value="radar">雷达图</Option>
                  <Option value="scatter">散点图</Option>
                  <Option value="composed">组合图</Option>
                </Select>
                
                <Select
                  value={selectedMetric}
                  onChange={setSelectedMetric}
                  style={{ width: 100 }}
                >
                  <Option value="engagement">参与度</Option>
                  <Option value="views">浏览量</Option>
                  <Option value="likes">点赞数</Option>
                  <Option value="comments">评论数</Option>
                </Select>
                
                <Select
                  value={timeRange}
                  onChange={setTimeRange}
                  style={{ width: 80 }}
                >
                  <Option value="1d">1天</Option>
                  <Option value="7d">7天</Option>
                  <Option value="30d">30天</Option>
                </Select>
                
                <Button 
                  icon={<ReloadOutlined />} 
                  onClick={handleRefresh}
                  loading={loading}
                >
                  刷新
                </Button>
                
                <Button 
                  icon={<DownloadOutlined />} 
                  onClick={handleExport}
                >
                  导出
                </Button>
                
                <Button 
                  icon={<FullscreenOutlined />} 
                  onClick={handleFullscreen}
                >
                  全屏
                </Button>
              </div>
            }
          >
            <Spin spinning={loading}>
              {renderChart()}
            </Spin>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default EnhancedCharts;
