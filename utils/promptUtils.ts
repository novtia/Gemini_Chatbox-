import { ChatMessage } from "../types";
import { processPromptCollection, processHistoryMessages } from "./promptRegexUtils";

/**
 * 修复版本的格式化队列提示词函数，将所有消息合并为完整的消息序列
 * @param prompts 所有提示词列表
 * @param modelCharacterName 模型人设名称
 * @param userCharacterName 用户人设名称
 * @returns 包含完整消息序列的对象
 */
export const formatQueuedPromptsFixed = (
  prompts: ChatMessage[], 
  modelCharacterName: string = '', 
  userCharacterName: string = ''
): { history: any[], userInput: any } => {
  if (!prompts || prompts.length === 0) {
    return { history: [], userInput: { parts: [{ text: '' }], role: 'user' } };
  }

  // 首先处理所有提示词中的{{char}}和{{user}}标记
  const processedPrompts = processPromptCollection(prompts, modelCharacterName, userCharacterName);

  // 筛选出在队列中且已启用的提示词
  const queuedPrompts = processedPrompts.filter(p => p.isInQueue && p.enabled);
  
  // 按照提示词在数组中的顺序进行排序（保持队列顺序）
  const sortedQueuedPrompts = [...queuedPrompts].sort((a, b) => {
    const indexA = processedPrompts.findIndex(p => p.id === a.id);
    const indexB = processedPrompts.findIndex(p => p.id === b.id);
    return indexA - indexB;
  });
  
  console.log("按队列顺序排序后的提示词:", sortedQueuedPrompts.map(p => ({id: p.id, name: p.name})));
  
  // 创建完整的消息序列
  let allMessages: any[] = [];
  let userInput: any = { parts: [{ text: '' }], role: 'user' };
  
  // 按照队列顺序处理每个提示词
  for (const prompt of sortedQueuedPrompts) {
    console.log("处理提示词:", prompt.id, prompt.name);
    
    // 如果是历史记录提示词，解析其中的消息并添加到消息序列
    if (prompt.isHistory && prompt.parts && prompt.parts[0] && prompt.parts[0].text) {
      console.log("处理历史记录提示词");
      try {
        // 尝试解析历史记录中的JSON字符串
        const historyMessages = JSON.parse(prompt.parts[0].text);
        
        // 如果解析成功且是数组，则添加历史消息到消息序列，但删除最后一条
        if (Array.isArray(historyMessages) && historyMessages.length > 0) {
          // 删除最后一条消息
          const messagesToAdd = historyMessages.length > 1 
            ? historyMessages.slice(0, -1) 
            : [];
            
          console.log("添加历史消息数量:", messagesToAdd.length);
          
          // 处理历史消息中的{{char}}和{{user}}标记
          const processedHistoryMessages = processHistoryMessages(
            messagesToAdd,
            modelCharacterName,
            userCharacterName
          );
          
          allMessages = [
            ...allMessages,
            ...processedHistoryMessages.map(msg => ({
              parts: msg.parts,
              role: msg.role
            }))
          ];
        }
      } catch (error) {
        console.error("解析历史记录失败:", error);
      }
    } 
    // 如果是用户输入提示词，添加到消息序列末尾，并用<command_input>标签包裹文本
    else if (prompt.isUserInput) {
      console.log("处理用户输入提示词");
      
      // 复制提示词对象，避免修改原始对象
      const wrappedPrompt = {
        parts: prompt.parts.map(part => {
          if (part.text) {
            return { ...part, text: `<command_input>${part.text}</command_input>` };
          }
          return part;
        }),
        role: prompt.role
      };
      
      allMessages.push(wrappedPrompt);
      
      // 同时设置为userInput（保持兼容性）
      userInput = wrappedPrompt;
    }
    // 如果是系统提示词，跳过（通常不添加到消息序列中）
    else if (prompt.isSystem) {
      console.log("跳过系统提示词:", prompt.name);
      // 系统提示词通常不添加到消息序列中
    }
    // 如果是模型人设提示词，添加到消息序列
    else if (prompt.isModelRole) {
      console.log("处理模型人设提示词:", prompt.parts[0]?.text);
      allMessages.push({
        parts: prompt.parts,
        role: prompt.role
      });
    }
    // 如果是用户人设提示词，添加到消息序列
    else if (prompt.isUserRole) {
      console.log("处理用户人设提示词:", prompt.parts[0]?.text);
      allMessages.push({
        parts: prompt.parts,
        role: prompt.role
      });
    }
    // 对于其他提示词，按队列顺序添加到消息序列
    else {
      console.log("处理普通提示词:", prompt.parts[0]?.text);
      allMessages.push({
        parts: prompt.parts,
        role: prompt.role
      });
    }
  }
  
  console.log("最终消息序列数量:", allMessages.length);
  console.log("消息序列内容:", allMessages.map(msg => ({role: msg.role, text: msg.parts[0]?.text})));
  
  // 修改：将所有消息作为历史记录返回，userInput保持为空
  return { 
    history: allMessages.map(msg => ({
      parts: msg.parts,
      role: msg.role
    })), 
    userInput: { parts: [{ text: '' }], role: 'user' } // 返回空的userInput
  };
};

/**
 * 获取格式化后的完整提示词队列，可直接用于发送给模型
 * @param prompts 所有提示词列表
 * @param modelCharacterName 模型人设名称
 * @param userCharacterName 用户人设名称
 * @returns 包含历史记录和用户输入的对象
 */
export const getFormattedPromptQueue = (
  prompts: ChatMessage[],
  modelCharacterName: string = '',
  userCharacterName: string = ''
): { history: any[], userInput: any } => {
  // 使用修复版本的函数
  return formatQueuedPromptsFixed(prompts, modelCharacterName, userCharacterName);
};
