import { useState, useEffect } from 'react';

/**
 * 本地存储Hook
 * @param key 存储键名
 * @param initialValue 初始值
 * @returns [存储的值, 设置值的函数, 移除值的函数]
 */
function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void, () => void] {
  // 获取初始值
  const readValue = (): T => {
    if (typeof window === 'undefined') {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  };

  // 状态管理
  const [storedValue, setStoredValue] = useState<T>(readValue);

  // 设置值函数
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // 允许函数式更新
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      
      // 保存到状态
      setStoredValue(valueToStore);
      
      // 保存到localStorage
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
        
        // 触发自定义事件，用于跨组件同步
        window.dispatchEvent(new Event('local-storage'));
      }
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  };

  // 移除值函数
  const removeValue = () => {
    try {
      // 从localStorage移除
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(key);
        
        // 重置为初始值
        setStoredValue(initialValue);
        
        // 触发自定义事件
        window.dispatchEvent(new Event('local-storage'));
      }
    } catch (error) {
      console.warn(`Error removing localStorage key "${key}":`, error);
    }
  };

  // 监听存储变化
  useEffect(() => {
    const handleStorageChange = () => {
      setStoredValue(readValue());
    };
    
    // 监听自定义事件
    window.addEventListener('local-storage', handleStorageChange);
    
    // 监听storage事件（跨标签页同步）
    window.addEventListener('storage', handleStorageChange);
    
    // 清理
    return () => {
      window.removeEventListener('local-storage', handleStorageChange);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [key]);

  return [storedValue, setValue, removeValue];
}

export default useLocalStorage;
