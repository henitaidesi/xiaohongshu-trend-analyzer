import { useState, useEffect } from 'react';

// 断点定义
const breakpoints = {
  xs: 0,
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
  xxl: 1600,
};

type Breakpoint = keyof typeof breakpoints;

interface ResponsiveInfo {
  width: number;
  height: number;
  breakpoint: Breakpoint;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
}

/**
 * 响应式Hook
 * @returns 响应式信息
 */
function useResponsive(): ResponsiveInfo {
  const [windowSize, setWindowSize] = useState<{
    width: number;
    height: number;
  }>({
    width: typeof window !== 'undefined' ? window.innerWidth : 1200,
    height: typeof window !== 'undefined' ? window.innerHeight : 800,
  });

  // 获取当前断点
  const getCurrentBreakpoint = (width: number): Breakpoint => {
    if (width >= breakpoints.xxl) return 'xxl';
    if (width >= breakpoints.xl) return 'xl';
    if (width >= breakpoints.lg) return 'lg';
    if (width >= breakpoints.md) return 'md';
    if (width >= breakpoints.sm) return 'sm';
    return 'xs';
  };

  // 监听窗口大小变化
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    // 添加事件监听器
    window.addEventListener('resize', handleResize);

    // 初始化
    handleResize();

    // 清理
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const breakpoint = getCurrentBreakpoint(windowSize.width);

  return {
    width: windowSize.width,
    height: windowSize.height,
    breakpoint,
    isMobile: breakpoint === 'xs' || breakpoint === 'sm',
    isTablet: breakpoint === 'md',
    isDesktop: breakpoint === 'lg' || breakpoint === 'xl' || breakpoint === 'xxl',
  };
}

/**
 * 断点匹配Hook
 * @param breakpoint 目标断点
 * @returns 是否匹配
 */
export function useBreakpoint(breakpoint: Breakpoint): boolean {
  const { width } = useResponsive();
  return width >= breakpoints[breakpoint];
}

/**
 * 媒体查询Hook
 * @param query 媒体查询字符串
 * @returns 是否匹配
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const media = window.matchMedia(query);
    
    // 设置初始值
    setMatches(media.matches);

    // 监听变化
    const listener = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    // 添加监听器
    if (media.addEventListener) {
      media.addEventListener('change', listener);
    } else {
      // 兼容旧版本浏览器
      media.addListener(listener);
    }

    // 清理
    return () => {
      if (media.removeEventListener) {
        media.removeEventListener('change', listener);
      } else {
        media.removeListener(listener);
      }
    };
  }, [query]);

  return matches;
}

export default useResponsive;
