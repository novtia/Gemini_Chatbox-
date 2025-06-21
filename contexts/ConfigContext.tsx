import React, { createContext, useContext, ReactNode } from 'react';
import { Config } from '../types';
import useConfig from '../hooks/useConfig';

// 创建配置上下文类型
interface ConfigContextType {
  config: Config;
  updateConfig: (newConfig: Config) => void;
  resetConfig: () => void;
  isLoading: boolean;
}

// 创建配置上下文
const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

// 配置提供者组件属性
interface ConfigProviderProps {
  children: ReactNode;
}

// 配置提供者组件
export const ConfigProvider: React.FC<ConfigProviderProps> = ({ children }) => {
  const configHook = useConfig();
  
  return (
    <ConfigContext.Provider value={configHook}>
      {children}
    </ConfigContext.Provider>
  );
};

// 使用配置的自定义钩子
export const useConfigContext = (): ConfigContextType => {
  const context = useContext(ConfigContext);
  if (context === undefined) {
    throw new Error('useConfigContext must be used within a ConfigProvider');
  }
  return context;
};

export default ConfigContext; 