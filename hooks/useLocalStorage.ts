import { useState, useEffect } from 'react';

// 用于处理Date对象的JSON序列化和反序列化
const dateReviver = (key: string, value: any): any => {
  // 检查是否是日期字符串格式
  if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/.test(value)) {
    return new Date(value);
  }
  return value;
};

// 通用的本地存储 hook
function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void] {
  // 获取初始值
  const getInitialValue = (): T => {
    try {
      const item = localStorage.getItem(key);
      // 检查item是否为null、"undefined"字符串或"null"字符串
      if (item === null || item === "undefined" || item === "null") {
        return initialValue;
      }
      // 使用自定义的dateReviver解析JSON，正确处理Date对象
      return JSON.parse(item, dateReviver);
    } catch (error) {
      console.error(`从本地存储加载 ${key} 失败:`, error);
      return initialValue;
    }
  };

  // 状态
  const [storedValue, setStoredValue] = useState<T>(getInitialValue);

  // 更新函数
  const setValue = (value: T | ((val: T) => T)): void => {
    try {
      // 支持函数式更新
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      
      // 确保不存储undefined值
      if (valueToStore === undefined) {
        console.warn(`尝试存储undefined值到${key}，使用初始值代替`);
        setStoredValue(initialValue);
        localStorage.setItem(key, JSON.stringify(initialValue));
      } else {
        setStoredValue(valueToStore);
        localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(`保存 ${key} 到本地存储失败:`, error);
    }
  };

  return [storedValue, setValue];
}

export default useLocalStorage; 