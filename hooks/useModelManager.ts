import { useState, useEffect } from 'react';
import { ModelOption } from '../types';
import { geminiServiceInstance } from '../services/geminiService';

export default function useModelManager() {
  // 模型相关状态
  const [availableModels, setAvailableModels] = useState<ModelOption[]>([]);
  const [isModelsLoading, setIsModelsLoading] = useState(false);
  const [modelsLoadingError, setModelsLoadingError] = useState<string | null>(null);

  // 获取可用模型列表
  useEffect(() => {
    const fetchModels = async () => {
      setIsModelsLoading(true);
      setModelsLoadingError(null);
      
      try {
        const models = await geminiServiceInstance.getAvailableModels();
        if (models && models.length > 0) {
          setAvailableModels(models);
        }
      } catch (error) {
        console.error("获取模型列表失败:", error);
        setModelsLoadingError(error.message || "获取模型列表失败");
      } finally {
        setIsModelsLoading(false);
      }
    };
    
    fetchModels();
  }, []);

  return {
    availableModels,
    isModelsLoading,
    modelsLoadingError
  };
} 