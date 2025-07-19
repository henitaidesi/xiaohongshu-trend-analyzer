import React from 'react';
import ReactECharts from 'echarts-for-react';
import { EChartsOption } from 'echarts';

interface BarChartProps {
  data: {
    name: string;
    data: { x: string; y: number }[];
  }[];
  title?: string;
  height?: number;
  loading?: boolean;
  xAxisLabel?: string;
  yAxisLabel?: string;
  horizontal?: boolean;
  showLabel?: boolean;
}

const BarChart: React.FC<BarChartProps> = ({
  data,
  title,
  height = 400,
  loading = false,
  xAxisLabel,
  yAxisLabel,
  horizontal = false,
  showLabel = false,
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
  ];

  const xAxisData = data[0]?.data.map(item => item.x) || [];

  const option: EChartsOption = {
    title: title ? {
      text: title,
      left: 'center',
      textStyle: {
        fontSize: 16,
        fontWeight: 600,
        color: '#262626',
      },
    } : undefined,
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: '#e8e8e8',
      borderWidth: 1,
      textStyle: {
        color: '#262626',
      },
      axisPointer: {
        type: 'shadow',
      },
    },
    legend: {
      data: data.map(item => item.name),
      bottom: 10,
      textStyle: {
        color: '#262626',
      },
    },
    grid: {
      left: horizontal ? '15%' : '3%',
      right: '4%',
      bottom: '15%',
      top: title ? '15%' : '10%',
      containLabel: true,
    },
    xAxis: horizontal ? {
      type: 'value',
      name: xAxisLabel,
      nameTextStyle: {
        color: '#8c8c8c',
      },
      axisLine: {
        lineStyle: {
          color: '#e8e8e8',
        },
      },
      axisLabel: {
        color: '#8c8c8c',
      },
      splitLine: {
        lineStyle: {
          color: '#f0f0f0',
        },
      },
    } : {
      type: 'category',
      data: xAxisData,
      name: xAxisLabel,
      nameTextStyle: {
        color: '#8c8c8c',
      },
      axisLine: {
        lineStyle: {
          color: '#e8e8e8',
        },
      },
      axisLabel: {
        color: '#8c8c8c',
        rotate: xAxisData.length > 10 ? 45 : 0,
      },
    },
    yAxis: horizontal ? {
      type: 'category',
      data: xAxisData,
      name: yAxisLabel,
      nameTextStyle: {
        color: '#8c8c8c',
      },
      axisLine: {
        lineStyle: {
          color: '#e8e8e8',
        },
      },
      axisLabel: {
        color: '#8c8c8c',
      },
    } : {
      type: 'value',
      name: yAxisLabel,
      nameTextStyle: {
        color: '#8c8c8c',
      },
      axisLine: {
        lineStyle: {
          color: '#e8e8e8',
        },
      },
      axisLabel: {
        color: '#8c8c8c',
      },
      splitLine: {
        lineStyle: {
          color: '#f0f0f0',
        },
      },
    },
    series: data.map((item, index) => ({
      name: item.name,
      type: 'bar',
      data: horizontal ? item.data.map(point => point.y) : item.data.map(point => point.y),
      label: {
        show: showLabel,
        position: horizontal ? 'right' : 'top',
        color: '#262626',
      },
      itemStyle: {
        color: colors[index % colors.length],
      },
      emphasis: {
        focus: 'series',
      },
    })),
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

export default BarChart;
