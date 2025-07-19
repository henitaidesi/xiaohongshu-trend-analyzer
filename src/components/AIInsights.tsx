import React, { useState } from 'react';
import {
  Card, Row, Col, Statistic, Progress, Tag, Timeline,
  Button, Spin, message, Input, Rate, Badge
} from 'antd';
import {
  BulbOutlined, ArrowUpOutlined, ArrowDownOutlined,
  SmileOutlined, FrownOutlined, MehOutlined, RobotOutlined,
  ThunderboltOutlined, EyeOutlined, HeartOutlined
} from '@ant-design/icons';

const { TextArea } = Input;

interface AIInsightsProps {
  data?: any;
  loading?: boolean;
  onAnalyze?: (text: string) => void;
}

const AIInsights: React.FC<AIInsightsProps> = ({
  data,
  loading = false
}) => {
  const [sentimentText, setSentimentText] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [sentimentResult, setSentimentResult] = useState<any>(null);

  // 模拟AI洞察数据
  const mockInsights = {
    insights: [
      "📈 美妆类内容在过去7天内热度上升15%，建议增加相关内容投放",
      "🎯 用户最活跃时间段为晚上8-10点，建议在此时间发布内容",
      "💡 带有'种草'标签的内容平均参与度比普通内容高30%",
      "🔥 短视频内容的分享率比图文内容高2.5倍",
      "⭐ 正面情感内容占比78%，用户反馈整体积极"
    ],
    confidence: 0.85,
    analysis_time: new Date().toISOString(),
    trends: [
      { category: '美妆', trend: 'up', change: '+15%', score: 85 },
      { category: '穿搭', trend: 'up', change: '+8%', score: 78 },
      { category: '美食', trend: 'stable', change: '+2%', score: 65 },
      { category: '旅行', trend: 'down', change: '-5%', score: 58 },
      { category: '健身', trend: 'up', change: '+12%', score: 72 }
    ],
    sentiment_analysis: {
      positive: 78,
      neutral: 15,
      negative: 7,
      overall: 'positive'
    },
    user_behavior: {
      peak_hours: [
        { hour: 20, activity: 95 },
        { hour: 21, activity: 88 },
        { hour: 19, activity: 82 }
      ],
      engagement_rate: 6.8,
      avg_session_time: '3.2分钟'
    }
  };

  const insights = data || mockInsights;

  // 情感分析
  const handleSentimentAnalysis = async () => {
    if (!sentimentText.trim()) {
      message.warning('请输入要分析的文本');
      return;
    }

    setAnalyzing(true);
    
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // 简单的情感分析逻辑
      const positiveWords = ['好', '棒', '赞', '喜欢', '爱', '美', '推荐', '满意', '完美'];
      const negativeWords = ['差', '坏', '烂', '难用', '不好', '失望', '不推荐', '糟糕'];
      
      const text = sentimentText.toLowerCase();
      const positiveCount = positiveWords.filter(word => text.includes(word)).length;
      const negativeCount = negativeWords.filter(word => text.includes(word)).length;
      
      let sentiment, score, emotion;
      if (positiveCount > negativeCount) {
        sentiment = 'positive';
        score = 0.7 + (positiveCount * 0.1);
        emotion = 'smile';
      } else if (negativeCount > positiveCount) {
        sentiment = 'negative';
        score = 0.3 - (negativeCount * 0.1);
        emotion = 'frown';
      } else {
        sentiment = 'neutral';
        score = 0.5;
        emotion = 'meh';
      }
      
      setSentimentResult({
        sentiment,
        score: Math.max(0, Math.min(1, score)),
        confidence: Math.min(1, (positiveCount + negativeCount) * 0.3),
        emotion,
        keywords: {
          positive: positiveWords.filter(word => text.includes(word)),
          negative: negativeWords.filter(word => text.includes(word))
        }
      });
      
    } catch (error) {
      console.error('分析失败:', error);
    } finally {
      setAnalyzing(false);
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUpOutlined style={{ color: '#52c41a' }} />;
      case 'down':
        return <TrendingDownOutlined style={{ color: '#ff4d4f' }} />;
      default:
        return <span style={{ color: '#faad14' }}>━</span>;
    }
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return <SmileOutlined style={{ color: '#52c41a' }} />;
      case 'negative':
        return <FrownOutlined style={{ color: '#ff4d4f' }} />;
      default:
        return <MehOutlined style={{ color: '#faad14' }} />;
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <Row gutter={[16, 16]}>
        {/* AI洞察卡片 */}
        <Col span={24}>
          <Card 
            title={
              <span>
                <RobotOutlined style={{ marginRight: 8, color: '#1890ff' }} />
                🤖 AI智能洞察
              </span>
            }
            extra={
              <Badge 
                count={`置信度 ${Math.round((insights.confidence || 0.85) * 100)}%`} 
                style={{ backgroundColor: '#52c41a' }} 
              />
            }
          >
            <Spin spinning={loading}>
              <Timeline>
                {insights.insights?.map((insight: string, index: number) => (
                  <Timeline.Item 
                    key={index}
                    dot={<BulbOutlined style={{ color: '#1890ff' }} />}
                  >
                    <div style={{ fontSize: '14px', lineHeight: '1.6' }}>
                      {insight}
                    </div>
                  </Timeline.Item>
                ))}
              </Timeline>
            </Spin>
          </Card>
        </Col>

        {/* 趋势分析 */}
        <Col span={12}>
          <Card title="📈 分类趋势分析" size="small">
            {insights.trends?.map((trend: any, index: number) => (
              <div key={index} style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginBottom: '12px',
                padding: '8px',
                backgroundColor: '#fafafa',
                borderRadius: '6px'
              }}>
                <span style={{ fontWeight: 500 }}>{trend.category}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {getTrendIcon(trend.trend)}
                  <Tag color={trend.trend === 'up' ? 'green' : trend.trend === 'down' ? 'red' : 'orange'}>
                    {trend.change}
                  </Tag>
                  <Progress 
                    percent={trend.score} 
                    size="small" 
                    style={{ width: '60px' }}
                    showInfo={false}
                  />
                </div>
              </div>
            ))}
          </Card>
        </Col>

        {/* 情感分布 */}
        <Col span={12}>
          <Card title="😊 情感分析分布" size="small">
            <Row gutter={[8, 8]}>
              <Col span={8}>
                <Statistic
                  title="正面"
                  value={insights.sentiment_analysis?.positive || 0}
                  suffix="%"
                  valueStyle={{ color: '#52c41a', fontSize: '18px' }}
                  prefix={<SmileOutlined />}
                />
              </Col>
              <Col span={8}>
                <Statistic
                  title="中性"
                  value={insights.sentiment_analysis?.neutral || 0}
                  suffix="%"
                  valueStyle={{ color: '#faad14', fontSize: '18px' }}
                  prefix={<MehOutlined />}
                />
              </Col>
              <Col span={8}>
                <Statistic
                  title="负面"
                  value={insights.sentiment_analysis?.negative || 0}
                  suffix="%"
                  valueStyle={{ color: '#ff4d4f', fontSize: '18px' }}
                  prefix={<FrownOutlined />}
                />
              </Col>
            </Row>
            
            <div style={{ marginTop: '16px' }}>
              <Progress 
                percent={insights.sentiment_analysis?.positive || 0}
                strokeColor={{
                  '0%': '#52c41a',
                  '100%': '#73d13d',
                }}
                trailColor="#f0f0f0"
              />
              <div style={{ textAlign: 'center', marginTop: '8px', fontSize: '12px', color: '#666' }}>
                整体情感倾向：
                <Tag color="green" style={{ marginLeft: '4px' }}>
                  {insights.sentiment_analysis?.overall === 'positive' ? '积极' : '消极'}
                </Tag>
              </div>
            </div>
          </Card>
        </Col>

        {/* 用户行为洞察 */}
        <Col span={12}>
          <Card title="👥 用户行为洞察" size="small">
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Statistic
                  title="参与率"
                  value={insights.user_behavior?.engagement_rate || 0}
                  suffix="%"
                  precision={1}
                  valueStyle={{ color: '#1890ff' }}
                  prefix={<HeartOutlined />}
                />
              </Col>
              <Col span={12}>
                <Statistic
                  title="平均停留"
                  value={insights.user_behavior?.avg_session_time || '0分钟'}
                  valueStyle={{ color: '#722ed1' }}
                  prefix={<EyeOutlined />}
                />
              </Col>
            </Row>
            
            <div style={{ marginTop: '16px' }}>
              <div style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>
                活跃时间段：
              </div>
              {insights.user_behavior?.peak_hours?.map((hour: any, index: number) => (
                <div key={index} style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  marginBottom: '4px'
                }}>
                  <span>{hour.hour}:00</span>
                  <Progress 
                    percent={hour.activity} 
                    size="small" 
                    style={{ width: '100px' }}
                    format={() => `${hour.activity}%`}
                  />
                </div>
              ))}
            </div>
          </Card>
        </Col>

        {/* 实时情感分析工具 */}
        <Col span={12}>
          <Card title="🎭 实时情感分析" size="small">
            <TextArea
              rows={3}
              placeholder="输入要分析的文本内容..."
              value={sentimentText}
              onChange={(e) => setSentimentText(e.target.value)}
              style={{ marginBottom: '12px' }}
            />
            
            <Button 
              type="primary" 
              onClick={handleSentimentAnalysis}
              loading={analyzing}
              block
              icon={<ThunderboltOutlined />}
            >
              开始分析
            </Button>
            
            {sentimentResult && (
              <div style={{ marginTop: '16px', padding: '12px', backgroundColor: '#f6ffed', borderRadius: '6px' }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                  {getSentimentIcon(sentimentResult.sentiment)}
                  <span style={{ marginLeft: '8px', fontWeight: 500 }}>
                    情感倾向：{sentimentResult.sentiment === 'positive' ? '积极' : 
                              sentimentResult.sentiment === 'negative' ? '消极' : '中性'}
                  </span>
                </div>
                
                <div style={{ marginBottom: '8px' }}>
                  <span style={{ fontSize: '12px', color: '#666' }}>情感强度：</span>
                  <Rate 
                    disabled 
                    value={Math.round(sentimentResult.score * 5)} 
                    style={{ fontSize: '14px', marginLeft: '8px' }}
                  />
                </div>
                
                <div style={{ fontSize: '12px', color: '#666' }}>
                  置信度：{Math.round(sentimentResult.confidence * 100)}%
                </div>
                
                {sentimentResult.keywords.positive.length > 0 && (
                  <div style={{ marginTop: '8px' }}>
                    <span style={{ fontSize: '12px', color: '#52c41a' }}>正面词汇：</span>
                    {sentimentResult.keywords.positive.map((word: string, index: number) => (
                      <Tag key={index} color="green" style={{ margin: '2px', fontSize: '12px' }}>
                        {word}
                      </Tag>
                    ))}
                  </div>
                )}
                
                {sentimentResult.keywords.negative.length > 0 && (
                  <div style={{ marginTop: '8px' }}>
                    <span style={{ fontSize: '12px', color: '#ff4d4f' }}>负面词汇：</span>
                    {sentimentResult.keywords.negative.map((word: string, index: number) => (
                      <Tag key={index} color="red" style={{ margin: '2px', fontSize: '12px' }}>
                        {word}
                      </Tag>
                    ))}
                  </div>
                )}
              </div>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AIInsights;
