import React from 'react';
import { Layout, Menu, Avatar, Dropdown, Breadcrumb } from 'antd';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  HomeOutlined,
  FireOutlined,
  TrendingUpOutlined,
  UserOutlined,
  RobotOutlined,
  SettingOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import { useUIStore } from '../../store';
import styled from 'styled-components';

const { Header, Sider, Content } = Layout;

const StyledLayout = styled(Layout)`
  min-height: 100vh;
`;

const StyledHeader = styled(Header)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  background: #ffffff;
  border-bottom: 1px solid #f0f0f0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  font-size: 18px;
  font-weight: 600;
  color: #ff2442;
  
  .logo-icon {
    margin-right: 12px;
    font-size: 24px;
  }
`;

const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const StyledContent = styled(Content)`
  margin: 24px;
  padding: 24px;
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  min-height: calc(100vh - 112px);
`;

const menuItems = [
  {
    key: '/',
    icon: <HomeOutlined />,
    label: '首页概览',
  },
  {
    key: '/topics',
    icon: <FireOutlined />,
    label: '热点话题',
  },
  {
    key: '/trends',
    icon: <TrendingUpOutlined />,
    label: '创作趋势',
  },
  {
    key: '/insights',
    icon: <UserOutlined />,
    label: '用户洞察',
  },
  {
    key: '/assistant',
    icon: <RobotOutlined />,
    label: '创作助手',
  },
  {
    key: '/profile',
    icon: <SettingOutlined />,
    label: '个人中心',
  },
];

const userMenuItems = [
  {
    key: 'profile',
    icon: <UserOutlined />,
    label: '个人设置',
  },
  {
    key: 'logout',
    icon: <LogoutOutlined />,
    label: '退出登录',
  },
];

const MainLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { sidebarCollapsed, setSidebarCollapsed, selectedMenuKey, setSelectedMenuKey } = useUIStore();

  // 根据当前路径设置选中的菜单项
  React.useEffect(() => {
    setSelectedMenuKey(location.pathname);
  }, [location.pathname, setSelectedMenuKey]);

  const handleMenuClick = ({ key }: { key: string }) => {
    navigate(key);
  };

  const handleUserMenuClick = ({ key }: { key: string }) => {
    if (key === 'logout') {
      // 处理退出登录逻辑
      console.log('退出登录');
    } else if (key === 'profile') {
      navigate('/profile');
    }
  };

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  // 生成面包屑
  const getBreadcrumbs = () => {
    const pathMap: Record<string, string> = {
      '/': '首页概览',
      '/topics': '热点话题',
      '/trends': '创作趋势',
      '/insights': '用户洞察',
      '/assistant': '创作助手',
      '/profile': '个人中心',
    };

    return [
      {
        title: '首页',
        href: '/',
      },
      {
        title: pathMap[location.pathname] || '未知页面',
      },
    ];
  };

  return (
    <StyledLayout>
      <Sider
        trigger={null}
        collapsible
        collapsed={sidebarCollapsed}
        width={240}
        style={{
          background: '#ffffff',
          borderRight: '1px solid #f0f0f0',
        }}
      >
        <div style={{ padding: '16px', borderBottom: '1px solid #f0f0f0' }}>
          <Logo>
            <FireOutlined className="logo-icon" />
            {!sidebarCollapsed && '小红书趋势分析'}
          </Logo>
        </div>
        <Menu
          mode="inline"
          selectedKeys={[selectedMenuKey]}
          items={menuItems}
          onClick={handleMenuClick}
          style={{ border: 'none' }}
        />
      </Sider>
      
      <Layout>
        <StyledHeader>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {React.createElement(
              sidebarCollapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
              {
                className: 'trigger',
                onClick: toggleSidebar,
                style: { fontSize: '18px', cursor: 'pointer' },
              }
            )}
            <Breadcrumb
              items={getBreadcrumbs()}
              style={{ marginLeft: '16px' }}
            />
          </div>
          
          <HeaderRight>
            <Dropdown
              menu={{
                items: userMenuItems,
                onClick: handleUserMenuClick,
              }}
              placement="bottomRight"
            >
              <Avatar
                style={{
                  backgroundColor: '#ff2442',
                  cursor: 'pointer',
                }}
                icon={<UserOutlined />}
              />
            </Dropdown>
          </HeaderRight>
        </StyledHeader>
        
        <StyledContent>
          <Outlet />
        </StyledContent>
      </Layout>
    </StyledLayout>
  );
};

export default MainLayout;
