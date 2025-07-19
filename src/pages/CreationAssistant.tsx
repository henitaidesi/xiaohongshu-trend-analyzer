// 创作助手页面
import React, { useState, useEffect } from 'react';
import { 
  Card, Row, Col, Button, Input, Select, Space, Typography, 
  message, Tabs, List, Tag, Avatar, Divider, Steps, Alert
} from 'antd';
import {
  RobotOutlined, BulbOutlined, EditOutlined, SearchOutlined,
  FireOutlined, RiseOutlined, ClockCircleOutlined,
  TagOutlined, UserOutlined, HeartOutlined, SendOutlined,
  CheckCircleOutlined, ExclamationCircleOutlined
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
  targetAudience: string;
  contentStructure: string[];
  tips: string[];
}

interface TitleSuggestion {
  id: number;
  title: string;
  reason: string;
  engagement: string;
  keywords: string[];
}

const CreationAssistant: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('ideas');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [userInput, setUserInput] = useState<string>('');
  const [contentIdeas, setContentIdeas] = useState<ContentIdea[]>([]);
  const [titleSuggestions, setTitleSuggestions] = useState<TitleSuggestion[]>([]);
  const [hotTopics, setHotTopics] = useState<any[]>([]);

  // 加载数据
  const loadData = async () => {
    setLoading(true);
    try {
      const topics = await simpleDataService.getHotTopics(50);
      setHotTopics(topics.slice(0, 15));
      generateContentIdeas(topics);
    } catch (error) {
      console.error('加载数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 生成内容创意
  const generateContentIdeas = (topics: any[]) => {
    const ideas: ContentIdea[] = [
      {
        id: 1,
        title: '秋冬穿搭完整指南',
        category: '时尚',
        description: '从基础单品到高级搭配，教你打造时髦秋冬造型',
        tags: ['穿搭', '秋冬', '时尚', '搭配技巧'],
        difficulty: '简单',
        potential: '高',
        targetAudience: '18-35岁女性，关注时尚穿搭',
        contentStructure: [
          '开场：展示最终搭配效果',
          '基础单品推荐（3-5件）',
          '搭配技巧详解',
          '不同场合的变化',
          '总结和购买建议'
        ],
        tips: [
          '使用对比展示搭配前后效果',
          '标注单品价格和购买渠道',
          '分享个人穿搭心得',
          '回应评论中的搭配问题'
        ]
      },
      {
        id: 2,
        title: '护肤品成分解析',
        category: '美妆',
        description: '科普护肤品成分，帮助选择适合自己的产品',
        tags: ['护肤', '成分', '科普', '美妆'],
        difficulty: '中等',
        potential: '高',
        targetAudience: '20-40岁女性，注重护肤品质',
        contentStructure: [
          '引入：常见护肤困扰',
          '核心成分介绍（3-4种）',
          '成分功效对比',
          '产品推荐',
          '使用注意事项'
        ],
        tips: [
          '用简单易懂的语言解释专业概念',
          '配合图表展示成分对比',
          '分享真实使用体验',
          '提供不同价位的选择'
        ]
      },
      {
        id: 3,
        title: '居家收纳改造',
        category: '生活',
        description: '小空间大智慧，打造整洁舒适的居家环境',
        tags: ['收纳', '居家', '整理', '生活技巧'],
        difficulty: '简单',
        potential: '中等',
        targetAudience: '25-45岁，有居家整理需求',
        contentStructure: [
          '现状展示：改造前的混乱',
          '收纳工具介绍',
          '分区整理过程',
          '改造后效果展示',
          '维持整洁的小贴士'
        ],
        tips: [
          '展示改造前后的强烈对比',
          '推荐性价比高的收纳用品',
          '分享长期维持的经验',
          '回答常见收纳问题'
        ]
      }
    ];
    
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
        title: `我的${input}心得分享（附产品清单）`,
        reason: '个人经验分享更有说服力',
        engagement: '中高',
        keywords: ['心得', '分享', '产品清单']
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
    message.success('标题建议生成完成');
  };

  // 渲染内容创意标签页
  const renderIdeasTab = () => (
    <Row gutter={16}>
      <Col span={16}>
        <Card title="💡 热门内容创意" extra={
          <Space>
            <Select
              value={selectedCategory}
              onChange={setSelectedCategory}
              style={{ width: 120 }}
              placeholder="选择分类"
            >
              <Option value="all">全部分类</Option>
              <Option value="时尚">时尚</Option>
              <Option value="美妆">美妆</Option>
              <Option value="生活">生活</Option>
              <Option value="美食">美食</Option>
              <Option value="旅行">旅行</Option>
            </Select>
            <Button icon={<BulbOutlined />} onClick={loadData} loading={loading}>
              获取新创意
            </Button>
          </Space>
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
                      <div style={{ marginBottom: '12px' }}>
                        <Text strong>目标受众：</Text>
                        <Text type="secondary">{item.targetAudience}</Text>
                      </div>
                      <div style={{ marginBottom: '12px' }}>
                        <Text strong>标签：</Text>
                        {item.tags.map(tag => (
                          <Tag key={tag} style={{ marginLeft: '4px' }}>#{tag}</Tag>
                        ))}
                      </div>
                    </div>
                  }
                />
                <div>
                  <Title level={5}>📝 内容结构建议：</Title>
                  <Steps
                    direction="vertical"
                    size="small"
                    current={-1}
                    items={item.contentStructure.map((step, index) => ({
                      title: `步骤 ${index + 1}`,
                      description: step
                    }))}
                  />
                  
                  <Title level={5} style={{ marginTop: '16px' }}>💡 创作技巧：</Title>
                  <ul style={{ paddingLeft: '20px' }}>
                    {item.tips.map((tip, index) => (
                      <li key={index} style={{ marginBottom: '4px' }}>
                        <Text>{tip}</Text>
                      </li>
                    ))}
                  </ul>
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
      </Col>
    </Row>
  );

  // 渲染标题生成标签页
  const renderTitleTab = () => (
    <Row gutter={16}>
      <Col span={12}>
        <Card title="✨ 智能标题生成器">
          <Space.Compact style={{ width: '100%', marginBottom: '16px' }}>
            <Input
              placeholder="输入你的内容主题，如：护肤、穿搭、美食等"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onPressEnter={() => generateTitleSuggestions(userInput)}
            />
            <Button 
              type="primary" 
              icon={<SearchOutlined />}
              onClick={() => generateTitleSuggestions(userInput)}
            >
              生成标题
            </Button>
          </Space.Compact>
          
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
                    <Button size="small" type="link">复制</Button>
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
        <Card title="📊 标题优化技巧">
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

export default CreationAssistant;
