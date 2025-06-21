import { Config } from '../types';
import { DEFAULT_CONFIG } from '../constants';
import { loadConfigFromStorage, saveConfigToStorage } from './storage';

/**
 * 初始化应用配置
 * 从本地存储加载配置，如果不存在则创建默认配置并保存
 * @returns 初始化后的配置
 */
export const initializeConfig = (): Config => {
  try {
    // 尝试从本地存储加载配置
    const storedConfig = loadConfigFromStorage();
    
    if (storedConfig) {
      console.log('从本地存储加载配置成功');
      return storedConfig;
    }
    
    // 如果没有存储的配置，使用默认配置并保存到本地存储
    console.log('未找到存储的配置，使用默认配置');
    saveConfigToStorage(DEFAULT_CONFIG);
    return DEFAULT_CONFIG;
  } catch (error) {
    console.error('初始化配置失败:', error);
    return DEFAULT_CONFIG;
  }
};

/**
 * 检查配置版本并进行必要的迁移
 * 当配置结构发生变化时，可以在这里添加迁移逻辑
 * @param config 当前配置
 * @returns 迁移后的配置
 */
export const migrateConfigIfNeeded = (config: Config): Config => {
  // 这里可以添加配置迁移逻辑
  // 例如，如果将来添加了新的配置项，可以在这里设置默认值
  
  // 示例：检查并添加缺少的安全设置
  const updatedConfig = { ...config };
  
  // 确保所有必要的配置字段都存在
  if (updatedConfig.safetySettings === undefined) {
    updatedConfig.safetySettings = DEFAULT_CONFIG.safetySettings;
  }
  
  if (updatedConfig.maxOutputTokens === undefined) {
    updatedConfig.maxOutputTokens = DEFAULT_CONFIG.maxOutputTokens;
  }
  
  // 如果进行了更改，保存更新后的配置
  if (JSON.stringify(updatedConfig) !== JSON.stringify(config)) {
    saveConfigToStorage(updatedConfig);
  }
  
  return updatedConfig;
};

export default {
  initializeConfig,
  migrateConfigIfNeeded
}; 