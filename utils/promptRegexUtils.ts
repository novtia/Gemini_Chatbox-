import { ChatMessage } from "../types";

/**
 * 从人设词条名称中提取人设名称
 * @param promptName 人设词条的名称，格式如"用户人设: 小明"或"模型人设: 智能助手"
 * @returns 提取的人设名称
 */
export const extractCharacterNameFromPromptName = (promptName: string): string => {
  if (!promptName) return '';
  
  // 用户人设: 后面的内容
  if (promptName.startsWith('用户人设: ')) {
    return promptName.substring('用户人设: '.length);
  }
  
  // 模型人设: 后面的内容
  if (promptName.startsWith('模型人设: ')) {
    return promptName.substring('模型人设: '.length);
  }
  
  return '';
};

/**
 * 查找并提取提示词集合中的模型人设和用户人设名称
 * @param prompts 提示词集合
 * @returns 包含模型和用户人设名称的对象
 */
export const findCharacterNames = (prompts: ChatMessage[]): { modelName: string, userName: string } => {
  let modelName = '';
  let userName = '';
  
  // 遍历所有提示词
  for (const prompt of prompts) {
    // 如果是模型人设提示词
    if (prompt.isModelRole && prompt.name) {
      modelName = extractCharacterNameFromPromptName(prompt.name);
    }
    
    // 如果是用户人设提示词
    if (prompt.isUserRole && prompt.name) {
      userName = extractCharacterNameFromPromptName(prompt.name);
    }
  }
  
  return { modelName, userName };
};

/**
 * 替换提示词中的{{char}}和{{user}}标记
 * @param prompt 需要处理的提示词
 * @param modelCharacterName 模型人设名称
 * @param userCharacterName 用户人设名称
 * @param prompts 完整的提示词集合(可选)，用于从中提取人设名称
 * @returns 处理后的提示词
 */
export const replaceCharacterTags = (
  prompt: ChatMessage,
  modelCharacterName: string = '',
  userCharacterName: string = '',
  prompts?: ChatMessage[]
): ChatMessage => {
  // 如果提供了完整提示词集合，尝试从中提取人设名称
  let charName = modelCharacterName;
  let userName = userCharacterName;
  
  if (prompts && (!modelCharacterName || !userCharacterName)) {
    const { modelName, userName: extractedUserName } = findCharacterNames(prompts);
    if (!modelCharacterName && modelName) charName = modelName;
    if (!userCharacterName && extractedUserName) userName = extractedUserName;
  }
  
  // 如果仍然没有人设名称，使用默认值
  charName = charName || 'AI';
  userName = userName || '用户';
  
  console.log(`替换标记：{{char}} -> ${charName}, {{user}} -> ${userName}`);
  
  // 创建一个新的提示词对象，避免修改原始对象
  const processedPrompt: ChatMessage = {
    ...prompt,
    parts: prompt.parts.map(part => {
      if (part.text) {
        // 使用正则表达式替换所有出现的{{char}}和{{user}}
        const processedText = part.text
          .replace(/\{\{char\}\}/g, charName)
          .replace(/\{\{user\}\}/g, userName);
        
        return { ...part, text: processedText };
      }
      return part;
    })
  };
  
  return processedPrompt;
};

/**
 * 处理提示词集合中的所有提示词
 * @param prompts 提示词集合
 * @param modelCharacterName 模型人设名称
 * @param userCharacterName 用户人设名称
 * @returns 处理后的提示词集合
 */
export const processPromptCollection = (
  prompts: ChatMessage[],
  modelCharacterName: string = '',
  userCharacterName: string = ''
): ChatMessage[] => {
  // 首先从提示词集合中提取人设名称
  const { modelName, userName } = findCharacterNames(prompts);
  
  // 使用提供的名称或从提示词中提取的名称
  const finalModelName = modelCharacterName || modelName;
  const finalUserName = userCharacterName || userName;
  
  console.log(`使用人设名称：模型=${finalModelName}, 用户=${finalUserName}`);
  
  return prompts.map(prompt => 
    replaceCharacterTags(prompt, finalModelName, finalUserName)
  );
};

/**
 * 从提示词中提取出所有的{{char}}和{{user}}标记
 * @param prompts 提示词集合
 * @returns 包含标记信息的对象
 */
export const extractCharacterTags = (
  prompts: ChatMessage[]
): { charTags: string[], userTags: string[] } => {
  const charTags: string[] = [];
  const userTags: string[] = [];
  
  // 遍历所有提示词
  prompts.forEach(prompt => {
    prompt.parts.forEach(part => {
      if (part.text) {
        // 查找所有{{char}}标记
        const charMatches = part.text.match(/\{\{char\}\}/g);
        if (charMatches) {
          charTags.push(...charMatches);
        }
        
        // 查找所有{{user}}标记
        const userMatches = part.text.match(/\{\{user\}\}/g);
        if (userMatches) {
          userTags.push(...userMatches);
        }
      }
    });
  });
  
  return { charTags, userTags };
};

/**
 * 检查提示词集合中是否包含{{char}}或{{user}}标记
 * @param prompts 提示词集合
 * @returns 布尔值，表示是否包含标记
 */
export const hasCharacterTags = (prompts: ChatMessage[]): boolean => {
  const { charTags, userTags } = extractCharacterTags(prompts);
  return charTags.length > 0 || userTags.length > 0;
};

/**
 * 处理历史消息中的{{char}}和{{user}}标记
 * @param messages 历史消息数组
 * @param modelCharacterName 模型人设名称
 * @param userCharacterName 用户人设名称
 * @returns 处理后的历史消息数组
 */
export const processHistoryMessages = (
  messages: any[],
  modelCharacterName: string = '',
  userCharacterName: string = ''
): any[] => {
  return messages.map(message => {
    if (message.parts) {
      return {
        ...message,
        parts: message.parts.map((part: any) => {
          if (part.text) {
            const processedText = part.text
              .replace(/\{\{char\}\}/g, modelCharacterName || 'AI')
              .replace(/\{\{user\}\}/g, userCharacterName || '用户');
            
            return { ...part, text: processedText };
          }
          return part;
        })
      };
    }
    return message;
  });
}; 