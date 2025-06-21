import { Config } from '../types';

// 本地存储键名
const STORAGE_KEYS = {
  CONFIG: 'gemini_app_config',
};

/**
 * 保存配置到本地存储
 * @param config 要保存的配置对象
 */
export const saveConfigToStorage = (config: Config): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(config));
  } catch (error) {
    console.error('保存配置到本地存储失败:', error);
  }
};

/**
 * 从本地存储中加载配置
 * @returns 加载的配置对象，如果没有则返回null
 */
export const loadConfigFromStorage = (): Config | null => {
  try {
    const storedConfig = localStorage.getItem(STORAGE_KEYS.CONFIG);
    if (storedConfig) {
      return JSON.parse(storedConfig);
    }
  } catch (error) {
    console.error('从本地存储加载配置失败:', error);
  }
  return null;
};

/**
 * 清除本地存储中的配置
 */
export const clearStoredConfig = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEYS.CONFIG);
  } catch (error) {
    console.error('清除本地存储配置失败:', error);
  }
}; 