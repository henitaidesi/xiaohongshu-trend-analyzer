import React from 'react';
import ReactECharts from 'echarts-for-react';
import { EChartsOption } from 'echarts';

interface LineChartProps {
  data: {
    name: string;
    data: { x: string; y: number }[];
  }[];
  title?: string;
  height?: number;
  loading?: boolean;
  xAxisLabel?: string;
  yAxisLabel?: string;
  smooth?: boolean;
  showArea?: boolean;
}

const LineChart: React.FC<LineChartProps> = ({
  data,
  title,
  height = 400,
  loading = false,
  xAxisLabel,
  yAxisLabel,
  smooth = true,
  showArea = false,
}) => {
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
        type: 'cross',
        crossStyle: {
          color: '#999',
        },
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
      left: '3%',
      right: '4%',
      bottom: '15%',
      top: title ? '15%' : '10%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: data[0]?.data.map(item => item.x) || [],
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
    },
    yAxis: {
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
      type: 'line',
      smooth,
      data: item.data.map(point => point.y),
      lineStyle: {
        width: 2,
      },
      itemStyle: {
        color: [
          '#ff2442',
          '#1890ff',
          '#52c41a',
          '#faad14',
          '#722ed1',
          '#eb2f96',
          '#13c2c2',
          '#fa541c',
        ][index % 8],
      },
      areaStyle: showArea ? {
        opacity: 0.1,
      } : undefined,
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

export default LineChart;
