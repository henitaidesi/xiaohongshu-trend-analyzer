// 测试页面 - 用于诊断白屏问题
import React from 'react';
import { Card, Typography } from 'antd';
import { CheckCircleOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const TestPage: React.FC = () => {
  return (
    <div style={{ padding: '24px' }}>
      <Card>
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <CheckCircleOutlined style={{ fontSize: '48px', color: '#52c41a', marginBottom: '16px' }} />
          <Title level={2}>测试页面</Title>
          <Text>如果你能看到这个页面，说明React渲染正常</Text>
        </div>
      </Card>
    </div>
  );
};

export default TestPage;
