import { useState, useEffect } from 'react';
import { Config } from '../types';
import { DEFAULT_CONFIG } from '../constants';
import { saveConfigToStorage, loadConfigFromStorage } from '../services/storage';
import { initializeConfig, migrateConfigIfNeeded } from '../services/configInitializer';

/**
 * 自定义钩子，用于管理应用配置
 * 包括从本地存储加载配置和保存配置到本地存储
 */
export const useConfig = () => {
  const [config, setConfig] = useState<Config>(DEFAULT_CONFIG);
  const [isLoading, setIsLoading] = useState(true);

  // 从本地存储加载配置
  useEffect(() => {
    const loadConfig = async () => {
      setIsLoading(true);
      try {
        // 使用初始化器加载配置
        const initialConfig = initializeConfig();
        
        // 检查并迁移配置（如果需要）
        const migratedConfig = migrateConfigIfNeeded(initialConfig);
        
        // 确保所有必要的配置字段都存在
        const completeConfig = {
          ...DEFAULT_CONFIG,
          ...migratedConfig
        };
        
        setConfig(completeConfig);
        
        // 保存完整配置到本地存储
        saveConfigToStorage(completeConfig);
      } catch (error) {
        console.error('加载配置失败:', error);
        // 加载失败时使用默认配置
        setConfig(DEFAULT_CONFIG);
        saveConfigToStorage(DEFAULT_CONFIG);
      } finally {
        setIsLoading(false);
      }
    };

    loadConfig();
  }, []);

  // 更新配置并保存到本地存储
  const updateConfig = (newConfig: Partial<Config>) => {
    const updatedConfig = { ...config, ...newConfig };
    setConfig(updatedConfig);
    saveConfigToStorage(updatedConfig);
  };

  // 重置为默认配置
  const resetConfig = () => {
    setConfig(DEFAULT_CONFIG);
    saveConfigToStorage(DEFAULT_CONFIG);
  };

  return {
    config,
    updateConfig,
    resetConfig,
    isLoading
  };
};

export default useConfig; 