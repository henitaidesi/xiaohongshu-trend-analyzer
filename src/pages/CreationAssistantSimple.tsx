// 创作助手页面 - 简化版
import React, { useState, useEffect } from 'react';
import { 
  Card, Row, Col, Button, Input, Select, Space, Typography, 
  message, Tabs, List, Tag, Avatar, Alert, Form
} from 'antd';
import { 
  RobotOutlined, BulbOutlined, EditOutlined, SearchOutlined,
  FireOutlined, CheckCircleOutlined, CopyOutlined, StarOutlined
} from '@ant-design/icons';
import { simpleDataService } from '../services/simpleDataService';

const { TextArea } = Input;
const { Option } = Select;
const { Title, Text, Paragraph } = Typography;

interface ContentIdea {
  id: number;
  title: string;
  category: string;
  description: string;
  tags: string[];
  difficulty: string;
  potential: string;
}

interface TitleSuggestion {
  id: number;
  title: string;
  reason: string;
  engagement: string;
  keywords: string[];
}

const CreationAssistantSimple: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('ideas');
  const [userInput, setUserInput] = useState<string>('');
  const [contentIdeas, setContentIdeas] = useState<ContentIdea[]>([]);
  const [titleSuggestions, setTitleSuggestions] = useState<TitleSuggestion[]>([]);
  const [hotTopics, setHotTopics] = useState<any[]>([]);

  // 加载数据
  const loadData = async () => {
    setLoading(true);
    try {
      const topics = await simpleDataService.getHotTopics(20);
      setHotTopics(topics.slice(0, 10));
      generateContentIdeas(topics);
    } catch (error) {
      message.error('数据加载失败');
      console.error('加载数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 生成内容创意
  const generateContentIdeas = (topics: any[]) => {
    const ideas: ContentIdea[] = topics.slice(0, 6).map((topic, index) => ({
      id: index + 1,
      title: `${topic.title}完整攻略`,
      category: topic.category,
      description: `基于热门话题"${topic.title}"的详细创作指南，包含实用技巧和注意事项`,
      tags: [topic.category, '攻略', '实用', '热门'],
      difficulty: index < 2 ? '简单' : index < 4 ? '中等' : '困难',
      potential: index < 3 ? '高' : '中等'
    }));
    
    setContentIdeas(ideas);
  };

  // 生成标题建议
  const generateTitleSuggestions = (input: string) => {
    if (!input.trim()) {
      message.warning('请先输入内容主题');
      return;
    }

    const suggestions: TitleSuggestion[] = [
      {
        id: 1,
        title: `${input}｜新手必看完整攻略`,
        reason: '新手向内容容易获得高互动',
        engagement: '高',
        keywords: ['新手', '攻略', '必看']
      },
      {
        id: 2,
        title: `我的${input}心得分享（附清单）`,
        reason: '个人经验分享更有说服力',
        engagement: '中高',
        keywords: ['心得', '分享', '清单']
      },
      {
        id: 3,
        title: `${input}避雷指南！这些坑千万别踩`,
        reason: '避雷类内容点击率高',
        engagement: '高',
        keywords: ['避雷', '指南', '避坑']
      },
      {
        id: 4,
        title: `超详细${input}教程｜手把手教学`,
        reason: '教程类内容收藏率高',
        engagement: '中高',
        keywords: ['教程', '详细', '手把手']
      },
      {
        id: 5,
        title: `${input}好物推荐｜平价替代清单`,
        reason: '好物推荐容易引发购买欲',
        engagement: '中',
        keywords: ['好物', '推荐', '平价']
      }
    ];

    setTitleSuggestions(suggestions);
  };

  // 复制文本到剪贴板
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      message.success('已复制到剪贴板');
    }).catch(() => {
      message.error('复制失败');
    });
  };

  // 渲染内容创意标签页
  const renderIdeasTab = () => (
    <Row gutter={16}>
      <Col span={16}>
        <Card title="💡 热门内容创意" extra={
          <Button icon={<BulbOutlined />} onClick={loadData} loading={loading}>
            获取新创意
          </Button>
        }>
          <List
            itemLayout="vertical"
            dataSource={contentIdeas}
            renderItem={(item: ContentIdea) => (
              <List.Item
                key={item.id}
                actions={[
                  <Tag color="blue">{item.difficulty}</Tag>,
                  <Tag color={item.potential === '高' ? 'red' : 'orange'}>{item.potential}潜力</Tag>,
                  <Button type="primary" size="small" icon={<EditOutlined />}>
                    开始创作
                  </Button>
                ]}
              >
                <List.Item.Meta
                  avatar={<Avatar style={{ backgroundColor: '#52c41a' }}>{item.category[0]}</Avatar>}
                  title={
                    <Space>
                      <Text strong>{item.title}</Text>
                      <Tag color="green">{item.category}</Tag>
                    </Space>
                  }
                  description={
                    <div>
                      <Paragraph>{item.description}</Paragraph>
                      <div>
                        <Text strong>推荐标签：</Text>
                        {item.tags.map(tag => (
                          <Tag key={tag} style={{ marginLeft: '4px' }}>#{tag}</Tag>
                        ))}
                      </div>
                    </div>
                  }
                />
                <div style={{ marginTop: '12px' }}>
                  <Alert
                    message="创作建议"
                    description={
                      <ul style={{ margin: 0, paddingLeft: '20px' }}>
                        <li>开头要有吸引人的钩子</li>
                        <li>内容要有实用价值</li>
                        <li>配图要清晰美观</li>
                        <li>结尾要有互动引导</li>
                      </ul>
                    }
                    type="info"
                    showIcon
                  />
                </div>
              </List.Item>
            )}
          />
        </Card>
      </Col>
      <Col span={8}>
        <Card title="🔥 当前热门话题" style={{ marginBottom: '16px' }}>
          <List
            size="small"
            dataSource={hotTopics}
            renderItem={(item: any, index: number) => (
              <List.Item>
                <List.Item.Meta
                  avatar={
                    <div style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      backgroundColor: index < 3 ? '#ff4d4f' : '#1890ff',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '12px',
                      fontWeight: 'bold'
                    }}>
                      {index + 1}
                    </div>
                  }
                  title={<Text style={{ fontSize: '14px' }}>{item.title}</Text>}
                  description={
                    <Space size={4}>
                      <Text type="secondary" style={{ fontSize: '12px' }}>
                        热度 {item.trendScore?.toFixed(1)}
                      </Text>
                      <Tag color="blue" style={{ fontSize: '10px', padding: '0 4px' }}>
                        {item.category}
                      </Tag>
                    </Space>
                  }
                />
              </List.Item>
            )}
          />
        </Card>
        
        <Card title="📊 创作技巧">
          <div style={{ padding: '12px' }}>
            <Title level={5}>🎯 高互动内容特征：</Title>
            <ul style={{ paddingLeft: '20px', marginBottom: '16px' }}>
              <li><Text>标题有数字和情感词汇</Text></li>
              <li><Text>内容有实用价值</Text></li>
              <li><Text>配图清晰美观</Text></li>
              <li><Text>有互动引导</Text></li>
            </ul>
            
            <Title level={5}>⚠️ 避免的内容类型：</Title>
            <ul style={{ paddingLeft: '20px' }}>
              <li><Text>过于平淡的日常</Text></li>
              <li><Text>没有价值的内容</Text></li>
              <li><Text>过度营销的推广</Text></li>
            </ul>
          </div>
        </Card>
      </Col>
    </Row>
  );

  // 渲染标题生成标签页
  const renderTitleTab = () => (
    <Row gutter={16}>
      <Col span={12}>
        <Card title="✨ 智能标题生成器">
          <Form layout="vertical">
            <Form.Item label="输入内容主题">
              <Input
                placeholder="如：护肤、穿搭、美食、旅行等"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onPressEnter={() => generateTitleSuggestions(userInput)}
              />
            </Form.Item>
            <Form.Item>
              <Button 
                type="primary" 
                icon={<SearchOutlined />}
                onClick={() => generateTitleSuggestions(userInput)}
                block
              >
                生成标题建议
              </Button>
            </Form.Item>
          </Form>
          
          <Alert
            message="标题优化建议"
            description="好的标题应该包含关键词、情感词汇和数字，长度控制在15-25字之间"
            type="info"
            showIcon
            style={{ marginBottom: '16px' }}
          />

          {titleSuggestions.length > 0 && (
            <List
              dataSource={titleSuggestions}
              renderItem={(item: TitleSuggestion) => (
                <List.Item
                  actions={[
                    <Tag color={item.engagement === '高' ? 'red' : item.engagement === '中高' ? 'orange' : 'blue'}>
                      {item.engagement}互动
                    </Tag>,
                    <Button 
                      size="small" 
                      icon={<CopyOutlined />}
                      onClick={() => copyToClipboard(item.title)}
                    >
                      复制
                    </Button>
                  ]}
                >
                  <List.Item.Meta
                    avatar={<Avatar icon={<EditOutlined />} />}
                    title={<Text strong>{item.title}</Text>}
                    description={
                      <div>
                        <Text type="secondary">{item.reason}</Text>
                        <div style={{ marginTop: '4px' }}>
                          {item.keywords.map(keyword => (
                            <Tag key={keyword} size="small" color="geekblue">
                              {keyword}
                            </Tag>
                          ))}
                        </div>
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          )}
        </Card>
      </Col>
      <Col span={12}>
        <Card title="📝 标题优化技巧">
          <div style={{ padding: '16px' }}>
            <Title level={5}>🎯 高点击率标题特征：</Title>
            <ul style={{ paddingLeft: '20px', marginBottom: '20px' }}>
              <li><Text>包含数字：如"5个技巧"、"30天挑战"</Text></li>
              <li><Text>情感词汇：如"必看"、"避雷"、"心得"</Text></li>
              <li><Text>疑问句式：如"你知道吗？"、"为什么？"</Text></li>
              <li><Text>对比词汇：如"前后对比"、"平价替代"</Text></li>
            </ul>

            <Title level={5}>⚠️ 避免的标题类型：</Title>
            <ul style={{ paddingLeft: '20px', marginBottom: '20px' }}>
              <li><Text>过于平淡：如"我的日常"</Text></li>
              <li><Text>标题党：夸大不实的描述</Text></li>
              <li><Text>过长标题：超过30字的标题</Text></li>
              <li><Text>无关键词：没有搜索价值的标题</Text></li>
            </ul>

            <Title level={5}>🔥 热门标题模板：</Title>
            <div style={{ backgroundColor: '#f6f6f6', padding: '12px', borderRadius: '6px' }}>
              <Text>• [主题] + 完整攻略/指南</Text><br/>
              <Text>• 我的[主题]心得分享</Text><br/>
              <Text>• [主题]避雷指南</Text><br/>
              <Text>• 超详细[主题]教程</Text><br/>
              <Text>• [主题]好物推荐清单</Text>
            </div>
          </div>
        </Card>
      </Col>
    </Row>
  );

  useEffect(() => {
    loadData();
  }, []);

  const tabItems = [
    {
      key: 'ideas',
      label: (
        <span>
          <BulbOutlined />
          内容创意
        </span>
      ),
      children: renderIdeasTab()
    },
    {
      key: 'titles',
      label: (
        <span>
          <EditOutlined />
          标题生成
        </span>
      ),
      children: renderTitleTab()
    }
  ];

  return (
    <div style={{ padding: '24px' }}>
      {/* 页面标题 */}
      <div style={{ marginBottom: '24px' }}>
        <Title level={2}>
          <RobotOutlined style={{ color: '#52c41a', marginRight: '8px' }} />
          AI创作助手
        </Title>
        <Text type="secondary">智能内容创意生成，助力高质量创作</Text>
      </div>

      {/* 标签页内容 */}
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={tabItems}
        size="large"
      />
    </div>
  );
};

export default CreationAssistantSimple;
