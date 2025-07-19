import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { ConfigProvider, Layout, Typography, Menu } from 'antd';
import { HomeOutlined, FireOutlined, RiseOutlined, UserOutlined, RobotOutlined } from '@ant-design/icons';
import zhCN from 'antd/locale/zh_CN';

// 导入组件
import RealDataDemo from './components/RealDataDemo';
import SimpleHotTopics from './pages/SimpleHotTopics';
import SimpleCreationTrends from './pages/SimpleCreationTrends';
import SimpleUserInsights from './pages/SimpleUserInsights';
import EnhancedCreatorAssistant from './components/EnhancedCreatorAssistant';

const { Content, Sider } = Layout;
const { Title } = Typography;

// 导航组件
const AppNavigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { key: '/', icon: <HomeOutlined />, label: '数据概览' },
    { key: '/topics', icon: <FireOutlined />, label: '热点话题' },
    { key: '/trends', icon: <RiseOutlined />, label: '创作趋势' },
    { key: '/insights', icon: <UserOutlined />, label: '用户洞察' },
    { key: '/assistant', icon: <RobotOutlined />, label: 'AI助手' },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider width={200} style={{ background: '#fff' }}>
        <div style={{ padding: '16px', textAlign: 'center' }}>
          <Title level={4} style={{ margin: 0 }}>小红书数据中心</Title>
        </div>
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={({ key }) => navigate(key)}
        />
      </Sider>

      <Layout>
        <Content style={{ padding: '24px', background: '#f0f2f5' }}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/topics" element={<TopicsPage />} />
            <Route path="/trends" element={<SimpleCreationTrends />} />
            <Route path="/insights" element={<SimpleUserInsights />} />
            <Route path="/assistant" element={<EnhancedCreatorAssistant />} />
          </Routes>
        </Content>
      </Layout>
    </Layout>
  );
};

// 页面组件
const HomePage: React.FC = () => (
  <div style={{ padding: '24px' }}>
    <RealDataDemo />
  </div>
);

const TopicsPage: React.FC = () => (
  <div style={{ padding: '24px' }}>
    <SimpleHotTopics />
  </div>
);

// 这些组件暂时未使用，但保留以备将来使用
// const TrendsPage: React.FC = () => (
//   <div style={{ padding: '24px' }}>
//     <Title level={2}>📈 创作趋势洞察</Title>
//     <p>创作趋势分析功能正在开发中...</p>
//   </div>
// );

// const InsightsPage: React.FC = () => (
//   <div style={{ padding: '24px' }}>
//     <Title level={2}>👥 用户洞察分析</Title>
//     <p>用户洞察分析功能正在开发中...</p>
//   </div>
// );

// const AssistantPage: React.FC = () => (
//   <div style={{ padding: '24px' }}>
//     <Title level={2}>🤖 AI创作助手</Title>
//     <p>AI创作助手功能正在开发中...</p>
//   </div>
// );

const App: React.FC = () => {
  return (
    <ConfigProvider locale={zhCN}>
      <Router>
        <AppNavigation />
      </Router>
    </ConfigProvider>
  );
};

export default App;
