import React from 'react';
import { Card, Typography } from 'antd';

const { Title } = Typography;

const ProfilePage: React.FC = () => {
  return (
    <div>
      <Title level={2}>个人中心</Title>
      <Card>
        <p>个人中心页面正在开发中...</p>
        <p>这里将展示：</p>
        <ul>
          <li>个人设置和偏好</li>
          <li>收藏的分析报告</li>
          <li>使用历史记录</li>
          <li>数据导出工具</li>
          <li>账户管理</li>
        </ul>
      </Card>
    </div>
  );
};

export default ProfilePage;
