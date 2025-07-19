import React from 'react';
import ReactECharts from 'echarts-for-react';
import { EChartsOption } from 'echarts';

interface PieChartProps {
  data: {
    name: string;
    value: number;
    color?: string;
  }[];
  title?: string;
  height?: number;
  loading?: boolean;
  showLegend?: boolean;
  radius?: [string, string];
  center?: [string, string];
}

const PieChart: React.FC<PieChartProps> = ({
  data,
  title,
  height = 400,
  loading = false,
  showLegend = true,
  radius = ['40%', '70%'],
  center = ['50%', '50%'],
}) => {
  const colors = [
    '#ff2442',
    '#1890ff',
    '#52c41a',
    '#faad14',
    '#722ed1',
    '#eb2f96',
    '#13c2c2',
    '#fa541c',
    '#f759ab',
    '#40a9ff',
  ];

  const option: EChartsOption = {
    title: title ? {
      text: title,
      left: 'center',
      top: 20,
      textStyle: {
        fontSize: 16,
        fontWeight: 600,
        color: '#262626',
      },
    } : undefined,
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: '#e8e8e8',
      borderWidth: 1,
      textStyle: {
        color: '#262626',
      },
      formatter: '{a} <br/>{b}: {c} ({d}%)',
    },
    legend: showLegend ? {
      orient: 'vertical',
      left: 'left',
      top: 'middle',
      textStyle: {
        color: '#262626',
      },
      formatter: (name: string) => {
        const item = data.find(d => d.name === name);
        const percentage = item ? ((item.value / data.reduce((sum, d) => sum + d.value, 0)) * 100).toFixed(1) : '0';
        return `${name} (${percentage}%)`;
      },
    } : undefined,
    series: [
      {
        name: '数据分布',
        type: 'pie',
        radius,
        center,
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 4,
          borderColor: '#fff',
          borderWidth: 2,
        },
        label: {
          show: false,
          position: 'center',
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 20,
            fontWeight: 'bold',
            color: '#262626',
          },
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
        },
        labelLine: {
          show: false,
        },
        data: data.map((item, index) => ({
          ...item,
          itemStyle: {
            color: item.color || colors[index % colors.length],
          },
        })),
      },
    ],
  };

  return (
    <ReactECharts
      option={option}
      style={{ height: `${height}px`, width: '100%' }}
      showLoading={loading}
      loadingOption={{
        text: '加载中...',
        color: '#ff2442',
        textColor: '#262626',
        maskColor: 'rgba(255, 255, 255, 0.8)',
      }}
    />
  );
};

export default PieChart;
