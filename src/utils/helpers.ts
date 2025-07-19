// 通用工具函数

import dayjs from 'dayjs';
import type { TrendDirection } from '../types/common';

/**
 * 格式化数字显示
 * @param num 数字
 * @param precision 精度
 * @returns 格式化后的字符串
 */
export const formatNumber = (num: number, precision = 0): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(precision) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(precision) + 'K';
  }
  return num.toFixed(precision);
};

/**
 * 格式化百分比
 * @param value 数值
 * @param total 总数
 * @param precision 精度
 * @returns 百分比字符串
 */
export const formatPercentage = (value: number, total: number, precision = 1): string => {
  if (total === 0) return '0%';
  return ((value / total) * 100).toFixed(precision) + '%';
};

/**
 * 格式化时间
 * @param timestamp 时间戳
 * @param format 格式
 * @returns 格式化后的时间字符串
 */
export const formatTime = (timestamp: number, format = 'YYYY-MM-DD HH:mm:ss'): string => {
  return dayjs(timestamp).format(format);
};

/**
 * 获取相对时间
 * @param timestamp 时间戳
 * @returns 相对时间字符串
 */
export const getRelativeTime = (timestamp: number): string => {
  const now = dayjs();
  const target = dayjs(timestamp);
  const diff = now.diff(target, 'minute');

  if (diff < 1) return '刚刚';
  if (diff < 60) return `${diff}分钟前`;
  if (diff < 1440) return `${Math.floor(diff / 60)}小时前`;
  if (diff < 10080) return `${Math.floor(diff / 1440)}天前`;
  return target.format('YYYY-MM-DD');
};

/**
 * 生成随机ID
 * @param length 长度
 * @returns 随机ID字符串
 */
export const generateId = (length = 8): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

/**
 * 防抖函数
 * @param func 要防抖的函数
 * @param wait 等待时间
 * @returns 防抖后的函数
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

/**
 * 节流函数
 * @param func 要节流的函数
 * @param limit 限制时间
 * @returns 节流后的函数
 */
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

/**
 * 深拷贝对象
 * @param obj 要拷贝的对象
 * @returns 拷贝后的对象
 */
export const deepClone = <T>(obj: T): T => {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime()) as unknown as T;
  if (obj instanceof Array) return obj.map(item => deepClone(item)) as unknown as T;
  if (typeof obj === 'object') {
    const clonedObj = {} as T;
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = deepClone(obj[key]);
      }
    }
    return clonedObj;
  }
  return obj;
};

/**
 * 获取趋势方向
 * @param current 当前值
 * @param previous 之前值
 * @returns 趋势方向
 */
export const getTrendDirection = (current: number, previous: number): TrendDirection => {
  if (current > previous) return 'up';
  if (current < previous) return 'down';
  return 'stable';
};

/**
 * 计算变化百分比
 * @param current 当前值
 * @param previous 之前值
 * @returns 变化百分比
 */
export const calculateChangePercentage = (current: number, previous: number): number => {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
};

/**
 * 获取颜色值
 * @param value 数值
 * @param min 最小值
 * @param max 最大值
 * @param colors 颜色数组
 * @returns 颜色值
 */
export const getColorByValue = (
  value: number,
  min: number,
  max: number,
  colors: string[]
): string => {
  if (value <= min) return colors[0];
  if (value >= max) return colors[colors.length - 1];
  
  const ratio = (value - min) / (max - min);
  const index = Math.floor(ratio * (colors.length - 1));
  return colors[index];
};

/**
 * 验证邮箱格式
 * @param email 邮箱地址
 * @returns 是否有效
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * 验证手机号格式
 * @param phone 手机号
 * @returns 是否有效
 */
export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^1[3-9]\d{9}$/;
  return phoneRegex.test(phone);
};

/**
 * 获取文件扩展名
 * @param filename 文件名
 * @returns 扩展名
 */
export const getFileExtension = (filename: string): string => {
  return filename.slice(((filename.lastIndexOf('.') - 1) >>> 0) + 2);
};

/**
 * 格式化文件大小
 * @param bytes 字节数
 * @returns 格式化后的大小
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * 生成随机颜色
 * @returns 十六进制颜色值
 */
export const generateRandomColor = (): string => {
  return '#' + Math.floor(Math.random() * 16777215).toString(16);
};

/**
 * 检查是否为移动设备
 * @returns 是否为移动设备
 */
export const isMobile = (): boolean => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
};

/**
 * 获取浏览器信息
 * @returns 浏览器信息
 */
export const getBrowserInfo = () => {
  const ua = navigator.userAgent;
  let browser = 'Unknown';
  
  if (ua.includes('Chrome')) browser = 'Chrome';
  else if (ua.includes('Firefox')) browser = 'Firefox';
  else if (ua.includes('Safari')) browser = 'Safari';
  else if (ua.includes('Edge')) browser = 'Edge';
  else if (ua.includes('Opera')) browser = 'Opera';
  
  return {
    browser,
    userAgent: ua,
    isMobile: isMobile(),
  };
};

/**
 * 下载文件
 * @param data 数据
 * @param filename 文件名
 * @param type MIME类型
 */
export const downloadFile = (data: any, filename: string, type = 'text/plain'): void => {
  const blob = new Blob([data], { type });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

/**
 * 复制文本到剪贴板
 * @param text 要复制的文本
 * @returns Promise
 */
export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    // 降级方案
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    const success = document.execCommand('copy');
    document.body.removeChild(textArea);
    return success;
  }
};
