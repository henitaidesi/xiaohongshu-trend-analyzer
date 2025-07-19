import React, { useState, useEffect } from 'react';
import { 
  Card, Row, Col, Statistic, Progress, Tag, Button, 
  Input, message, Spin, Alert, Timeline 
} from 'antd';
import { 
  BulbOutlined, SmileOutlined, FrownOutlined, 
  MehOutlined, ThunderboltOutlined, RobotOutlined 
} from '@ant-design/icons';

const { TextArea } = Input;

interface SimpleAIAnalysisProps {
  data?: any;
}

const SimpleAIAnalysis: React.FC<SimpleAIAnalysisProps> = ({ data }) => {
  const [sentimentText, setSentimentText] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [sentimentResult, setSentimentResult] = useState<any>(null);
  const [aiInsights, setAiInsights] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // 模拟AI洞察数据
  const mockInsights = {
    insights: [
      "📈 美妆类内容在过去7天内热度上升15%",
      "🎯 用户最活跃时间段为晚上8-10点",
      "💡 带有'种草'标签的内容平均参与度高30%",
      "🔥 短视频内容的分享率比图文内容高2.5倍",
      "⭐ 正面情感内容占比78%，用户反馈整体积极"
    ],
    sentiment_analysis: {
      positive: 78,
      neutral: 15,
      negative: 7
    },
    trends: [
      { category: '美妆', trend: 'up', score: 85 },
      { category: '穿搭', trend: 'up', score: 78 },
      { category: '美食', trend: 'stable', score: 65 },
      { category: '旅行', trend: 'down', score: 58 }
    ]
  };

  useEffect(() => {
    setAiInsights(mockInsights);
  }, []);

  // 简单的情感分析
  const analyzeSentiment = async () => {
    console.log('开始情感分析，输入文本:', sentimentText);

    if (!sentimentText.trim()) {
      return;
    }

    setAnalyzing(true);
    
    try {
      // 模拟API调用延迟
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 简单的情感分析逻辑
      const positiveWords = ['好', '棒', '赞', '喜欢', '爱', '美', '推荐', '满意', '完美', '优秀'];
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
        positiveWords: positiveWords.filter(word => text.includes(word)),
        negativeWords: negativeWords.filter(word => text.includes(word))
      });
      
    } catch (error) {
      console.error('分析失败:', error);
    } finally {
      setAnalyzing(false);
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

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up':
        return '#52c41a';
      case 'down':
        return '#ff4d4f';
      default:
        return '#faad14';
    }
  };

  return (
    <div style={{ padding: '24px' }}>
      <Row gutter={[16, 16]}>
        {/* 页面标题 */}
        <Col span={24}>
          <Card>
            <div style={{ textAlign: 'center' }}>
              <RobotOutlined style={{ fontSize: '48px', color: '#1890ff', marginBottom: '16px' }} />
              <h1 style={{ margin: 0, fontSize: '24px' }}>🤖 AI智能分析</h1>
              <p style={{ color: '#666', marginTop: '8px' }}>
                基于人工智能的内容分析和用户洞察
              </p>
            </div>
          </Card>
        </Col>

        {/* AI洞察 */}
        <Col span={24}>
          <Card title={
            <span>
              <BulbOutlined style={{ marginRight: 8, color: '#1890ff' }} />
              智能洞察
            </span>
          }>
            <Spin spinning={loading}>
              {aiInsights && (
                <Timeline>
                  {aiInsights.insights.map((insight: string, index: number) => (
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
              )}
            </Spin>
          </Card>
        </Col>

        {/* 情感分析统计 */}
        <Col span={12}>
          <Card title="😊 情感分析分布" size="small">
            {aiInsights && (
              <Row gutter={[16, 16]}>
                <Col span={8}>
                  <Statistic
                    title="正面"
                    value={aiInsights.sentiment_analysis.positive}
                    suffix="%"
                    valueStyle={{ color: '#52c41a' }}
                    prefix={<SmileOutlined />}
                  />
                </Col>
                <Col span={8}>
                  <Statistic
                    title="中性"
                    value={aiInsights.sentiment_analysis.neutral}
                    suffix="%"
                    valueStyle={{ color: '#faad14' }}
                    prefix={<MehOutlined />}
                  />
                </Col>
                <Col span={8}>
                  <Statistic
                    title="负面"
                    value={aiInsights.sentiment_analysis.negative}
                    suffix="%"
                    valueStyle={{ color: '#ff4d4f' }}
                    prefix={<FrownOutlined />}
                  />
                </Col>
              </Row>
            )}
            
            <div style={{ marginTop: '16px' }}>
              <Progress 
                percent={aiInsights?.sentiment_analysis.positive || 0}
                strokeColor="#52c41a"
                trailColor="#f0f0f0"
              />
              <div style={{ textAlign: 'center', marginTop: '8px', fontSize: '12px', color: '#666' }}>
                整体情感倾向：
                <Tag color="green" style={{ marginLeft: '4px' }}>积极</Tag>
              </div>
            </div>
          </Card>
        </Col>

        {/* 分类趋势 */}
        <Col span={12}>
          <Card title="📈 分类趋势分析" size="small">
            {aiInsights?.trends.map((trend: any, index: number) => (
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
                  <span style={{ color: getTrendColor(trend.trend) }}>
                    {trend.trend === 'up' ? '↗' : trend.trend === 'down' ? '↘' : '→'}
                  </span>
                  <Progress 
                    percent={trend.score} 
                    size="small" 
                    style={{ width: '60px' }}
                    strokeColor={getTrendColor(trend.trend)}
                    showInfo={false}
                  />
                  <span style={{ fontSize: '12px', color: '#666' }}>
                    {trend.score}
                  </span>
                </div>
              </div>
            ))}
          </Card>
        </Col>

        {/* 实时情感分析工具 */}
        <Col span={24}>
          <Card title="🎭 实时情感分析工具" size="small">
            <Row gutter={[16, 16]}>
              <Col span={16}>
                <TextArea
                  rows={4}
                  placeholder="输入要分析的文本内容，例如：这款产品真的很好用，我很喜欢！"
                  value={sentimentText}
                  onChange={(e) => setSentimentText(e.target.value)}
                />
              </Col>
              <Col span={8}>
                <Button 
                  type="primary" 
                  onClick={analyzeSentiment}
                  loading={analyzing}
                  block
                  size="large"
                  icon={<ThunderboltOutlined />}
                >
                  开始分析
                </Button>
                
                {sentimentResult && (
                  <div style={{ marginTop: '16px' }}>
                    <Alert
                      message={
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                            {getSentimentIcon(sentimentResult.sentiment)}
                            <span style={{ marginLeft: '8px', fontWeight: 500 }}>
                              {sentimentResult.sentiment === 'positive' ? '积极' : 
                               sentimentResult.sentiment === 'negative' ? '消极' : '中性'}
                            </span>
                          </div>
                          
                          <div style={{ marginBottom: '8px' }}>
                            <span style={{ fontSize: '12px', color: '#666' }}>情感强度：</span>
                            <Progress 
                              percent={Math.round(sentimentResult.score * 100)} 
                              size="small" 
                              style={{ width: '80px', marginLeft: '8px' }}
                            />
                          </div>
                          
                          <div style={{ fontSize: '12px', color: '#666' }}>
                            置信度：{Math.round(sentimentResult.confidence * 100)}%
                          </div>
                          
                          {sentimentResult.positiveWords.length > 0 && (
                            <div style={{ marginTop: '8px' }}>
                              <span style={{ fontSize: '12px', color: '#52c41a' }}>正面词汇：</span>
                              {sentimentResult.positiveWords.map((word: string, index: number) => (
                                <Tag key={index} color="green" size="small" style={{ margin: '2px' }}>
                                  {word}
                                </Tag>
                              ))}
                            </div>
                          )}
                          
                          {sentimentResult.negativeWords.length > 0 && (
                            <div style={{ marginTop: '8px' }}>
                              <span style={{ fontSize: '12px', color: '#ff4d4f' }}>负面词汇：</span>
                              {sentimentResult.negativeWords.map((word: string, index: number) => (
                                <Tag key={index} color="red" size="small" style={{ margin: '2px' }}>
                                  {word}
                                </Tag>
                              ))}
                            </div>
                          )}
                        </div>
                      }
                      type="info"
                      showIcon={false}
                    />
                  </div>
                )}
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default SimpleAIAnalysis;
