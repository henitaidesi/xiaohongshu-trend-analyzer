import { useState, useEffect, useCallback } from 'react';
import { LoadingState } from '../types/common';

interface UseApiOptions<T> {
  immediate?: boolean; // 是否立即执行
  defaultData?: T; // 默认数据
  onSuccess?: (data: T) => void; // 成功回调
  onError?: (error: Error) => void; // 错误回调
}

interface UseApiReturn<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  execute: (...args: any[]) => Promise<T>;
  reset: () => void;
}

/**
 * API请求Hook
 * @param apiFunction API函数
 * @param options 选项
 * @returns API状态和控制函数
 */
function useApi<T>(
  apiFunction: (...args: any[]) => Promise<T>,
  options: UseApiOptions<T> = {}
): UseApiReturn<T> {
  const {
    immediate = false,
    defaultData = null,
    onSuccess,
    onError,
  } = options;

  const [data, setData] = useState<T | null>(defaultData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 执行API请求
  const execute = useCallback(
    async (...args: any[]): Promise<T> => {
      try {
        setLoading(true);
        setError(null);
        
        const result = await apiFunction(...args);
        
        setData(result);
        onSuccess?.(result);
        
        return result;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : '请求失败';
        setError(errorMessage);
        onError?.(err as Error);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [apiFunction, onSuccess, onError]
  );

  // 重置状态
  const reset = useCallback(() => {
    setData(defaultData);
    setLoading(false);
    setError(null);
  }, [defaultData]);

  // 立即执行
  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [immediate, execute]);

  return {
    data,
    loading,
    error,
    execute,
    reset,
  };
}

/**
 * 分页API Hook
 * @param apiFunction 分页API函数
 * @param options 选项
 * @returns 分页状态和控制函数
 */
export function usePaginatedApi<T>(
  apiFunction: (page: number, pageSize: number, ...args: any[]) => Promise<{
    data: T[];
    total: number;
    page: number;
    pageSize: number;
  }>,
  options: {
    initialPage?: number;
    initialPageSize?: number;
    immediate?: boolean;
  } = {}
) {
  const { initialPage = 1, initialPageSize = 20, immediate = false } = options;

  const [page, setPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [total, setTotal] = useState(0);

  const {
    data: items,
    loading,
    error,
    execute: executeApi,
    reset,
  } = useApi(apiFunction, {
    immediate: false,
    defaultData: [],
    onSuccess: (result) => {
      setTotal(result.total);
    },
  });

  // 执行分页请求
  const execute = useCallback(
    async (...args: any[]) => {
      const result = await executeApi(page, pageSize, ...args);
      return result.data;
    },
    [executeApi, page, pageSize]
  );

  // 改变页码
  const changePage = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  // 改变页面大小
  const changePageSize = useCallback((newPageSize: number) => {
    setPageSize(newPageSize);
    setPage(1); // 重置到第一页
  }, []);

  // 刷新当前页
  const refresh = useCallback(() => {
    execute();
  }, [execute]);

  // 监听页码和页面大小变化
  useEffect(() => {
    if (immediate || page > 1) {
      execute();
    }
  }, [page, pageSize, execute, immediate]);

  return {
    items: items || [],
    loading,
    error,
    page,
    pageSize,
    total,
    totalPages: Math.ceil(total / pageSize),
    execute,
    changePage,
    changePageSize,
    refresh,
    reset: () => {
      setPage(initialPage);
      setPageSize(initialPageSize);
      setTotal(0);
      reset();
    },
  };
}

/**
 * 轮询API Hook
 * @param apiFunction API函数
 * @param interval 轮询间隔（毫秒）
 * @param options 选项
 * @returns API状态和控制函数
 */
export function usePollingApi<T>(
  apiFunction: (...args: any[]) => Promise<T>,
  interval: number,
  options: UseApiOptions<T> & {
    enabled?: boolean; // 是否启用轮询
  } = {}
) {
  const { enabled = true, ...apiOptions } = options;
  const [isPolling, setIsPolling] = useState(false);

  const apiResult = useApi(apiFunction, apiOptions);

  // 开始轮询
  const startPolling = useCallback((...args: any[]) => {
    if (!enabled) return;
    
    setIsPolling(true);
    
    const poll = async () => {
      try {
        await apiResult.execute(...args);
      } catch (error) {
        // 轮询中的错误不中断轮询
        console.warn('Polling error:', error);
      }
    };

    // 立即执行一次
    poll();

    // 设置定时器
    const timer = setInterval(poll, interval);

    return () => {
      clearInterval(timer);
      setIsPolling(false);
    };
  }, [apiResult.execute, interval, enabled]);

  // 停止轮询
  const stopPolling = useCallback(() => {
    setIsPolling(false);
  }, []);

  return {
    ...apiResult,
    isPolling,
    startPolling,
    stopPolling,
  };
}

export default useApi;
