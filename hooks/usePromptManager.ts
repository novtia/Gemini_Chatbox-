import { useState, useMemo, useEffect } from 'react';
import { ChatMessage, ModelCharacterCard, UserCharacterCard } from '../types';
import { processPromptCollection } from '../utils/promptRegexUtils';

export default function usePromptManager(
  systemInstruction: string,
  currentUserInput: string,
  activeChat: any,
  selectedModelCharacter?: ModelCharacterCard | null,
  selectedUserCharacter?: UserCharacterCard | null
) {
  // 提示词集合状态
  const [promptCollection, setPromptCollection] = useState<ChatMessage[]>([]);

  // 创建系统提示词
  const systemPrompt = useMemo<ChatMessage>(() => ({
    id: 'system-prompt',
    name: '系统提示词',
    role: 'model',
    isInQueue: true,
    enabled: true,
    isSystem: true,
    parts: [{ text: systemInstruction || '' }],
    timestamp: new Date()
  }), [systemInstruction]);

  // 创建用户输入提示词
  const userInputPrompt = useMemo<ChatMessage>(() => ({
    id: 'user-input-prompt',
    name: '用户输入',
    role: 'user',
    isInQueue: true,
    enabled: true,
    isUserInput: true,
    parts: [{ text: currentUserInput || '' }],
    Data: [], // 添加空的 Data 数组，用于后续存储图片数据
    timestamp: new Date()
  }), [currentUserInput]);

  // 创建模型人设提示词
  const modelRolePrompt = useMemo<ChatMessage>(() => {
    // 如果有选中的模型人设，使用其描述
    const characterDescription = selectedModelCharacter ? 
      `${selectedModelCharacter.name}:{${selectedModelCharacter.characterDescription}}` : '';
    
    return {
      id: 'model-role-prompt',
      name: selectedModelCharacter ? `模型人设: ${selectedModelCharacter.name}` : '模型人设',
      role: 'model',
      isInQueue: true,
      enabled: true,
      isModelRole: true,
      parts: [{ text: characterDescription }],
      timestamp: new Date()
    };
  }, [selectedModelCharacter]);

  // 当选中的模型人设变化时，更新模型人设提示词
  useEffect(() => {
    if (selectedModelCharacter) {
      const characterDescription = `${selectedModelCharacter.name}:{${selectedModelCharacter.characterDescription}}`;
      
      setPromptCollection(prevCollection => {
        // 确保集合中存在模型人设提示词
        const hasModelRolePrompt = prevCollection.some(p => p.id === 'model-role-prompt');
        
        if (hasModelRolePrompt) {
          // 更新现有的模型人设提示词
          return prevCollection.map(prompt => {
            if (prompt.id === 'model-role-prompt') {
              return {
                ...prompt,
                name: `模型人设: ${selectedModelCharacter.name}`,
                parts: [{ text: characterDescription }]
              };
            }
            return prompt;
          });
        } else {
          // 如果不存在模型人设提示词，创建一个新的并添加到集合中
          const newModelRolePrompt: ChatMessage = {
            id: 'model-role-prompt',
            name: `模型人设: ${selectedModelCharacter.name}`,
            role: 'model',
            isInQueue: true,
            enabled: true,
            isModelRole: true,
            parts: [{ text: characterDescription }],
            timestamp: new Date()
          };
          
          // 添加到系统提示词之后
          const systemPromptIndex = prevCollection.findIndex(p => p.id === 'system-prompt');
          if (systemPromptIndex !== -1) {
            const newCollection = [...prevCollection];
            newCollection.splice(systemPromptIndex + 1, 0, newModelRolePrompt);
            return newCollection;
          } else {
            // 如果没有系统提示词，添加到开头
            return [newModelRolePrompt, ...prevCollection];
          }
        }
      });
    }
  }, [selectedModelCharacter]);

  // 创建用户人设提示词
  const userRolePrompt = useMemo<ChatMessage>(() => {
    // 如果有选中的用户人设，使用其描述
    const characterDescription = selectedUserCharacter ? 
      `[${selectedUserCharacter.characterDescription}]` : '';
    
    return {
      id: 'user-role-prompt',
      name: selectedUserCharacter ? `用户人设: ${selectedUserCharacter.name}` : '用户人设',
      role: 'user',
      isInQueue: true,
      enabled: true,
      isUserRole: true,
      parts: [{ text: characterDescription }],
      timestamp: new Date()
    };
  }, [selectedUserCharacter]);

  // 创建主提示词
  const mainPrompt = useMemo<ChatMessage>(() => {
    return {
      id: 'main-prompt',
      name: '主提示词',
      role: 'user',
      isInQueue: true,
      enabled: true,
      isMainPrompt: true,
      parts: [{ text: '' }],
      timestamp: new Date()
    };
  }, []);

  // 当选中的用户人设变化时，更新用户人设提示词
  useEffect(() => {
    if (selectedUserCharacter || selectedUserCharacter === null) {
      const characterDescription = selectedUserCharacter ? 
        `[${selectedUserCharacter.characterDescription}]` : '';
      
      setPromptCollection(prevCollection => {
        // 确保集合中存在用户人设提示词
        const hasUserRolePrompt = prevCollection.some(p => p.id === 'user-role-prompt');
        
        if (hasUserRolePrompt) {
          // 更新现有的用户人设提示词
          return prevCollection.map(prompt => {
            if (prompt.id === 'user-role-prompt') {
              return {
                ...prompt,
                name: selectedUserCharacter ? `用户人设: ${selectedUserCharacter.name}` : '用户人设',
                parts: [{ text: characterDescription }]
              };
            }
            return prompt;
          });
        } else {
          // 如果不存在用户人设提示词，创建一个新的并添加到集合中
          const newUserRolePrompt: ChatMessage = {
            id: 'user-role-prompt',
            name: selectedUserCharacter ? `用户人设: ${selectedUserCharacter.name}` : '用户人设',
            role: 'user',
            isInQueue: true,
            enabled: true,
            isUserRole: true,
            parts: [{ text: characterDescription }],
            timestamp: new Date()
          };
          
          // 添加到模型人设提示词之后
          const modelRoleIndex = prevCollection.findIndex(p => p.id === 'model-role-prompt');
          if (modelRoleIndex !== -1) {
            const newCollection = [...prevCollection];
            newCollection.splice(modelRoleIndex + 1, 0, newUserRolePrompt);
            return newCollection;
          } else {
            // 如果没有模型人设提示词，添加到系统提示词之后
            const systemIndex = prevCollection.findIndex(p => p.id === 'system-prompt');
            if (systemIndex !== -1) {
              const newCollection = [...prevCollection];
              newCollection.splice(systemIndex + 1, 0, newUserRolePrompt);
              return newCollection;
            } else {
              // 如果没有系统提示词，添加到开头
              return [newUserRolePrompt, ...prevCollection];
            }
          }
        }
      });
    }
  }, [selectedUserCharacter]);

  // 创建历史记录提示词
  const historyPrompts = useMemo<ChatMessage[]>(() => {
    // 创建历史记录提示词，使用固定ID
    const historyPrompt: ChatMessage = {
      id: 'history',
      name: `历史对话记录 (${activeChat?.messages?.length || 0}条)`,
      role: 'user',
      isInQueue: true,
      enabled: true,
      isHistory: true,
      parts: [{ text: activeChat?.messages && activeChat.messages.length > 0 ? JSON.stringify(activeChat.messages) : '' }],
      timestamp: new Date()
    };

    return [historyPrompt];
  }, [activeChat?.id, activeChat?.messages]);

  // 合并所有提示词并更新到promptCollection
  useMemo(() => {
    setPromptCollection(prevCollection => {
      // 创建副本，避免直接修改状态
      let updatedCollection = [...prevCollection];
      
      // 找出特殊提示词
      const existingSystemPrompt = updatedCollection.find(p => p.id === 'system-prompt');
      const existingHistoryPrompt = updatedCollection.find(p => p.id === 'history');
      const existingUserInputPrompt = updatedCollection.find(p => p.id === 'user-input-prompt');
      const existingModelRolePrompt = updatedCollection.find(p => p.id === 'model-role-prompt');
      const existingUserRolePrompt = updatedCollection.find(p => p.id === 'user-role-prompt');
      const existingMainPrompt = updatedCollection.find(p => p.id === 'main-prompt');
      
      // 更新或添加系统提示词
      if (existingSystemPrompt) {
        // 保留原始位置
        const index = updatedCollection.findIndex(p => p.id === 'system-prompt');
        // 保留isInQueue状态
        const isInQueue = existingSystemPrompt.isInQueue;
        updatedCollection[index] = {...systemPrompt, isInQueue};
      } else {
        updatedCollection.unshift(systemPrompt); // 添加到开头
      }
      
      // 更新或添加模型人设提示词
      if (existingModelRolePrompt) {
        // 保留原始位置
        const index = updatedCollection.findIndex(p => p.id === 'model-role-prompt');
        // 保留isInQueue状态
        const isInQueue = existingModelRolePrompt.isInQueue;
        // 如果有选中的角色，使用新的内容，否则保留原有内容
        const parts = selectedModelCharacter ? modelRolePrompt.parts : existingModelRolePrompt.parts;
        const name = selectedModelCharacter ? modelRolePrompt.name : existingModelRolePrompt.name;
        updatedCollection[index] = {...modelRolePrompt, isInQueue, parts, name};
      } else {
        // 添加到系统提示词之后
        const systemIndex = updatedCollection.findIndex(p => p.id === 'system-prompt');
        if (systemIndex !== -1) {
          updatedCollection.splice(systemIndex + 1, 0, modelRolePrompt);
        } else {
          updatedCollection.unshift(modelRolePrompt);
        }
      }
      
      // 更新或添加用户人设提示词
      if (existingUserRolePrompt) {
        // 保留原始位置
        const index = updatedCollection.findIndex(p => p.id === 'user-role-prompt');
        // 保留isInQueue状态
        const isInQueue = existingUserRolePrompt.isInQueue;
        // 更新用户人设内容，无论是否有选中的角色，都使用新的内容
        updatedCollection[index] = {...userRolePrompt, isInQueue};
      } else {
        // 添加到模型人设之后
        const modelRoleIndex = updatedCollection.findIndex(p => p.id === 'model-role-prompt');
        if (modelRoleIndex !== -1) {
          updatedCollection.splice(modelRoleIndex + 1, 0, userRolePrompt);
        } else {
          const systemIndex = updatedCollection.findIndex(p => p.id === 'system-prompt');
          if (systemIndex !== -1) {
            updatedCollection.splice(systemIndex + 1, 0, userRolePrompt);
          } else {
            updatedCollection.unshift(userRolePrompt);
          }
        }
      }
      
      // 更新或添加主提示词
      if (existingMainPrompt) {
        // 保留原始位置
        const index = updatedCollection.findIndex(p => p.id === 'main-prompt');
        // 保留isInQueue状态
        const isInQueue = existingMainPrompt.isInQueue;
        updatedCollection[index] = {...mainPrompt, isInQueue, parts: existingMainPrompt.parts};
      } else {
        // 添加到用户人设之后
        const userRoleIndex = updatedCollection.findIndex(p => p.id === 'user-role-prompt');
        if (userRoleIndex !== -1) {
          updatedCollection.splice(userRoleIndex + 1, 0, mainPrompt);
        } else {
          const modelRoleIndex = updatedCollection.findIndex(p => p.id === 'model-role-prompt');
          if (modelRoleIndex !== -1) {
            updatedCollection.splice(modelRoleIndex + 1, 0, mainPrompt);
          } else {
            const systemIndex = updatedCollection.findIndex(p => p.id === 'system-prompt');
            if (systemIndex !== -1) {
              updatedCollection.splice(systemIndex + 1, 0, mainPrompt);
            } else {
              updatedCollection.unshift(mainPrompt);
            }
          }
        }
      }
      
      // 更新或添加历史记录提示词
      if (existingHistoryPrompt) {
        // 保留原始位置和顺序属性
        const index = updatedCollection.findIndex(p => p.id === 'history');
        // 保留isInQueue状态
        const isInQueue = existingHistoryPrompt.isInQueue;
        updatedCollection[index] = {...historyPrompts[0], isInQueue};
      } else {
        updatedCollection.push(historyPrompts[0]); // 添加到末尾
      }
      
      // 更新或添加用户输入提示词
      if (existingUserInputPrompt) {
        // 保留原始位置
        const index = updatedCollection.findIndex(p => p.id === 'user-input-prompt');
        // 保留isInQueue状态
        const isInQueue = existingUserInputPrompt.isInQueue;
        updatedCollection[index] = {...userInputPrompt, isInQueue};
      } else {
        updatedCollection.push(userInputPrompt); // 添加到末尾
      }
      
      // 删除重复项（如果有的话）
      const uniqueIds = new Set<string>();
      updatedCollection = updatedCollection.filter(prompt => {
        if (uniqueIds.has(prompt.id)) {
          return false; // 删除重复项
        }
        uniqueIds.add(prompt.id);
        return true;
      });

      return updatedCollection;
    });
  }, [systemPrompt, userInputPrompt, historyPrompts, modelRolePrompt, userRolePrompt, selectedModelCharacter, selectedUserCharacter]);

  // 编辑提示词
  const editPrompt = (prompt: ChatMessage) => {
    setPromptCollection(prevCollection =>
      prevCollection.map(p => p.id === prompt.id ? prompt : p)
    );
  };

  // 添加提示词
  const addPrompt = (prompt: ChatMessage) => {
    setPromptCollection(prevCollection => [...prevCollection, prompt]);
  };

  // 切换提示词是否在队列中
  const togglePromptInQueue = (promptId: string) => {
    setPromptCollection(prevCollection =>
      prevCollection.map(prompt =>
        prompt.id === promptId
          ? { ...prompt, isInQueue: !prompt.isInQueue }
          : prompt
      )
    );
  };

  // 重新排序提示词
  const reorderPrompts = (reorderedPrompts: ChatMessage[]) => {
    console.log("重新排序提示词:", reorderedPrompts.map(p => p.id));
    setPromptCollection(reorderedPrompts);
  };

  // 获取当前模型人设名称
  const getModelCharacterName = () => {
    return selectedModelCharacter ? selectedModelCharacter.name : '';
  };

  // 获取当前用户人设名称
  const getUserCharacterName = () => {
    return selectedUserCharacter ? selectedUserCharacter.name : '';
  };

  // 预处理提示词集合，替换{{char}}和{{user}}标记
  const getProcessedPromptCollection = () => {
    const modelCharName = getModelCharacterName();
    const userCharName = getUserCharacterName();
    return processPromptCollection(promptCollection, modelCharName, userCharName);
  };

  return {
    promptCollection,
    editPrompt,
    addPrompt,
    togglePromptInQueue,
    reorderPrompts,
    getModelCharacterName,
    getUserCharacterName,
    getProcessedPromptCollection
  };
}
