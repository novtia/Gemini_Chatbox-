import { useState, useCallback, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { PromptPreset, ChatMessage } from '../types';
import useLocalStorage from './useLocalStorage';

// 预设管理Hook
export default function usePresetManager() {
  // 从本地存储加载预设
  const [presets, setPresets] = useLocalStorage<PromptPreset[]>('prompt-presets', []);
  
  // 当前选中的预设ID
  const [activePresetId, setActivePresetId] = useLocalStorage<string>('active-preset-id', '');
  
  // 根据ID获取当前选中的预设
  const activePreset = presets.find(preset => preset.id === activePresetId) || null;

  // 创建默认空预设
  const createDefaultPreset = useCallback(() => {
    // 创建系统提示词
    const systemPrompt: ChatMessage = {
      id: 'system-prompt',
      name: '系统提示词',
      role: 'model',
      isInQueue: true,
      enabled: true,
      isSystem: true,
      parts: [{ text: '' }],
      timestamp: new Date()
    };

    // 创建模型人设提示词
    const modelRolePrompt: ChatMessage = {
      id: 'model-role-prompt',
      name: '模型人设',
      role: 'model',
      isInQueue: true,
      enabled: true,
      isModelRole: true,
      parts: [{ text: '' }],
      timestamp: new Date()
    };

    // 创建用户人设提示词
    const userRolePrompt: ChatMessage = {
      id: 'user-role-prompt',
      name: '用户人设',
      role: 'user',
      isInQueue: true,
      enabled: true,
      isUserRole: true,
      parts: [{ text: '' }],
      timestamp: new Date()
    };

    // 创建主提示词
    const mainPrompt: ChatMessage = {
      id: 'main-prompt',
      name: '主提示词',
      role: 'user',
      isInQueue: true,
      enabled: true,
      isMainPrompt: true,
      parts: [{ text: '' }],
      timestamp: new Date()
    };

    // 创建用户输入提示词
    const userInputPrompt: ChatMessage = {
      id: 'user-input-prompt',
      name: '用户输入',
      role: 'user',
      isInQueue: true,
      enabled: true,
      isUserInput: true,
      parts: [{ text: '' }],
      timestamp: new Date()
    };

    // 创建历史记录提示词
    const historyPrompt: ChatMessage = {
      id: 'history',
      name: '历史对话记录 (0条)',
      role: 'user',
      isInQueue: true,
      enabled: true,
      isHistory: true,
      parts: [{ text: '' }],
      timestamp: new Date()
    };

    const defaultPreset: PromptPreset = {
      id: uuidv4(),
      name: "默认预设",
      description: "系统自动创建的默认空预设",
      author: "系统",
      createdAt: new Date(),
      updatedAt: new Date(),
      prompts: [systemPrompt, modelRolePrompt, userRolePrompt, mainPrompt, historyPrompt, userInputPrompt],
      promptsList: [systemPrompt.id, modelRolePrompt.id, userRolePrompt.id, mainPrompt.id, historyPrompt.id, userInputPrompt.id]
    };
    
    // 使用函数式更新，适配新的useLocalStorage接口
    setPresets(prev => [...prev, defaultPreset]);
    return defaultPreset.id;
  }, [setPresets]);

  // 初始化时检查是否有预设，如果没有则创建默认预设
  useEffect(() => {
    if (presets.length === 0) {
      const defaultPresetId = createDefaultPreset();
      setActivePresetId(defaultPresetId);
    }
  }, [presets.length, createDefaultPreset, setActivePresetId]);

  // 创建新预设
  const createPreset = useCallback((name: string, description: string = '', author: string = '', prompts: ChatMessage[] = [], promptsList: string[] = []) => {
    const newPreset: PromptPreset = {
      id: uuidv4(),
      name,
      description,
      author,
      createdAt: new Date(),
      updatedAt: new Date(),
      prompts: prompts,
      promptsList: promptsList
    };
    
    // 使用函数式更新，适配新的useLocalStorage接口
    setPresets(prev => [...prev, newPreset]);
    return newPreset.id;
  }, [setPresets]);

  // 更新预设
  const updatePreset = useCallback((presetId: string, updates: Partial<PromptPreset>) => {
    // 使用函数式更新，适配新的useLocalStorage接口
    setPresets(prev => 
      prev.map(preset => 
        preset.id === presetId 
          ? { ...preset, ...updates, updatedAt: new Date() } 
          : preset
      )
    );
  }, [setPresets]);

  // 删除预设
  const deletePreset = useCallback((presetId: string) => {
    // 使用函数式更新，适配新的useLocalStorage接口
    setPresets(prev => prev.filter(preset => preset.id !== presetId));
    
    // 如果删除的是当前活动预设，清空活动预设ID
    if (presetId === activePresetId) {
      setActivePresetId('');
    }
  }, [setPresets, activePresetId, setActivePresetId]);

  // 将当前提示词保存为预设
  const saveCurrentAsPreset = useCallback((name: string, description: string, author: string, promptCollection: ChatMessage[], queuedPromptsIds: string[]) => {
    // 筛选出下拉选择提示词器中的内容（不是系统提示词、历史记录或用户输入的提示词）
    const customPrompts = promptCollection.filter(p => 
      !p.isSystem && !p.isHistory && !p.isUserInput
    );
    
    // 创建系统提示词、历史记录和用户输入的空白版本，保留原始ID和基本结构
    const emptySystemPrompt = promptCollection.find(p => p.isSystem);
    const emptyHistoryPrompt = promptCollection.find(p => p.isHistory);
    const emptyUserInputPrompt = promptCollection.find(p => p.isUserInput);
    const emptyModelRolePrompt = promptCollection.find(p => p.isModelRole);
    const emptyUserRolePrompt = promptCollection.find(p => p.isUserRole);
    
    // 清空内容的函数
    const createEmptyPrompt = (prompt: ChatMessage | undefined): ChatMessage | null => {
      if (!prompt) return null;
      
      return {
        ...prompt,
        parts: [{ text: "" }]  // 清空内容
      };
    };
    
    // 处理系统提示词、历史记录、用户输入、模型人设和用户人设，确保它们存在并被清空
    const cleanedSystemPrompt = createEmptyPrompt(emptySystemPrompt);
    const cleanedHistoryPrompt = createEmptyPrompt(emptyHistoryPrompt);
    const cleanedUserInputPrompt = createEmptyPrompt(emptyUserInputPrompt);
    const cleanedModelRolePrompt = createEmptyPrompt(emptyModelRolePrompt);
    const cleanedUserRolePrompt = createEmptyPrompt(emptyUserRolePrompt);
    
    // 更新prompts数组，包含所有自定义提示词和清空后的系统提示词、历史记录、用户输入等
    let allPrompts: ChatMessage[] = [...customPrompts];
    
    // 添加清空后的特殊提示词
    if (cleanedSystemPrompt) allPrompts.push(cleanedSystemPrompt);
    if (cleanedHistoryPrompt) allPrompts.push(cleanedHistoryPrompt);
    if (cleanedUserInputPrompt) allPrompts.push(cleanedUserInputPrompt);
    if (cleanedModelRolePrompt) allPrompts.push(cleanedModelRolePrompt);
    if (cleanedUserRolePrompt) allPrompts.push(cleanedUserRolePrompt);
    
    // 创建新预设
    const newPresetId = createPreset(
      name,
      description,
      author,
      allPrompts,
      queuedPromptsIds
    );
    
    // 设置为当前活动预设
    setActivePresetId(newPresetId);
    
    return newPresetId;
  }, [createPreset, setActivePresetId]);

  // 导出预设为JSON文件
  const exportPreset = useCallback((presetId: string) => {
    const presetToExport = presets.find(p => p.id === presetId);
    
    if (!presetToExport) {
      throw new Error('预设不存在');
    }
    
    const dataStr = JSON.stringify(presetToExport, null, 2);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
    
    const exportFileName = `${presetToExport.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileName);
    linkElement.click();
    
    return true;
  }, [presets]);

  // 从JSON文件导入预设
  const importPreset = useCallback((presetData: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      try {
        const parsedData = JSON.parse(presetData) as PromptPreset;
        
        // 验证数据格式
        if (!parsedData.name || !Array.isArray(parsedData.prompts) || !Array.isArray(parsedData.promptsList)) {
          throw new Error('无效的预设数据格式');
        }
        
        // 确保所有提示词的isInQueue属性与promptsList一致
        const updatedPrompts = parsedData.prompts.map(prompt => ({
          ...prompt,
          // 仅当ID在promptsList中时，才将isInQueue设为true
          isInQueue: parsedData.promptsList.includes(prompt.id)
        }));
        
        // 按照promptsList的顺序重新排列提示词
        const orderedPrompts: ChatMessage[] = [];
        
        // 首先按照promptsList的顺序添加提示词
        for (const promptId of parsedData.promptsList) {
          const prompt = updatedPrompts.find(p => p.id === promptId);
          if (prompt) {
            orderedPrompts.push(prompt);
          }
        }
        
        // 然后添加不在promptsList中的提示词
        for (const prompt of updatedPrompts) {
          if (!parsedData.promptsList.includes(prompt.id)) {
            orderedPrompts.push(prompt);
          }
        }
        
        // 为导入的预设分配新ID
        const importedPreset: PromptPreset = {
          ...parsedData,
          id: uuidv4(), // 生成新ID
          createdAt: new Date(),
          updatedAt: new Date(),
          prompts: orderedPrompts // 使用排序后的prompts
        };
        
        // 使用函数式更新，适配新的useLocalStorage接口
        setPresets(prev => [...prev, importedPreset]);
        
        // 返回新导入预设的ID
        resolve(importedPreset.id);
      } catch (error) {
        reject(new Error(`导入预设失败: ${error.message}`));
      }
    });
  }, [setPresets]);

  // 从文件导入预设的辅助函数
  const importPresetFromFile = useCallback((file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = async (e) => {
        try {
          const content = e.target?.result as string;
          const presetId = await importPreset(content);
          resolve(presetId);
        } catch (error) {
          reject(error);
        }
      };
      
      reader.onerror = () => {
        reject(new Error('读取文件失败'));
      };
      
      reader.readAsText(file);
    });
  }, [importPreset]);

  // 切换活动预设
  const setActivePreset = useCallback((presetId: string) => {
    setActivePresetId(presetId);
  }, [setActivePresetId]);

  return {
    presets,
    activePreset,
    activePresetId,
    createPreset,
    createDefaultPreset,
    updatePreset,
    deletePreset,
    saveCurrentAsPreset,
    exportPreset,
    importPreset,
    importPresetFromFile,
    setActivePreset
  };
}
