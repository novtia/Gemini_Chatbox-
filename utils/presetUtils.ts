import { PromptPreset, ChatMessage } from '../types';
import { v4 as uuidv4 } from 'uuid';

/**
 * 将当前队列中的提示词保存为预设
 * @param name 预设名称
 * @param description 预设描述
 * @param author 预设作者
 * @param promptCollection 所有提示词集合
 * @param queuedPromptsIds 队列中提示词ID列表（按顺序）
 * @returns 新创建的预设对象
 */
export const createPresetFromCurrentQueue = (
  name: string,
  description: string,
  author: string,
  promptCollection: ChatMessage[],
  queuedPromptsIds: string[]
): PromptPreset => {
  // 筛选出下拉选择提示词器中的内容（不是系统提示词、历史记录或用户输入的提示词）
  const customPrompts = promptCollection.filter(p => 
    !p.isSystem && !p.isHistory && !p.isUserInput
  );
  
  // 创建系统提示词、历史记录和用户输入的空白版本，保留原始ID和基本结构
  const emptySystemPrompt = promptCollection.find(p => p.isSystem);
  const emptyHistoryPrompt = promptCollection.find(p => p.isHistory);
  const emptyUserInputPrompt = promptCollection.find(p => p.isUserInput);
  
  // 清空内容的函数
  const createEmptyPrompt = (prompt: ChatMessage | undefined): ChatMessage | null => {
    if (!prompt) return null;
    
    return {
      ...prompt,
      parts: [{ text: "" }]  // 清空内容
    };
  };
  
  // 处理系统提示词、历史记录和用户输入，确保它们存在并被清空
  const cleanedSystemPrompt = createEmptyPrompt(emptySystemPrompt);
  const cleanedHistoryPrompt = createEmptyPrompt(emptyHistoryPrompt);
  const cleanedUserInputPrompt = createEmptyPrompt(emptyUserInputPrompt);
  
  // 更新prompts数组，包含所有自定义提示词和清空后的系统提示词、历史记录、用户输入
  let allPrompts: ChatMessage[] = [...customPrompts];
  
  // 添加清空后的特殊提示词
  if (cleanedSystemPrompt) allPrompts.push(cleanedSystemPrompt);
  if (cleanedHistoryPrompt) allPrompts.push(cleanedHistoryPrompt);
  if (cleanedUserInputPrompt) allPrompts.push(cleanedUserInputPrompt);
  
  // 创建新预设，保持promptsList为ID数组
  const newPreset: PromptPreset = {
    id: uuidv4(),
    name,
    description,
    author,
    createdAt: new Date(),
    updatedAt: new Date(),
    prompts: allPrompts,  // 包含自定义提示词和清空后的特殊提示词
    promptsList: queuedPromptsIds  // 保持为ID数组
  };
  
  return newPreset;
};

/**
 * 将预设导出为JSON文件
 * @param preset 要导出的预设
 * @returns 是否成功导出
 */
export const exportPresetToFile = (preset: PromptPreset): boolean => {
  try {
    const dataStr = JSON.stringify(preset, null, 2);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
    
    const exportFileName = `${preset.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileName);
    linkElement.click();
    
    return true;
  } catch (error) {
    console.error('导出预设失败:', error);
    return false;
  }
};

/**
 * 从JSON字符串导入预设
 * @param jsonStr JSON字符串
 * @returns 导入的预设对象
 */
export const importPresetFromJson = (jsonStr: string): PromptPreset => {
  try {
    const parsedData = JSON.parse(jsonStr) as PromptPreset;
    
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
    
    // 为导入的预设分配新ID
    const importedPreset: PromptPreset = {
      ...parsedData,
      id: uuidv4(), // 生成新ID
      createdAt: new Date(),
      updatedAt: new Date(),
      prompts: updatedPrompts // 使用更新后的prompts
    };
    
    return importedPreset;
  } catch (error) {
    throw new Error(`导入预设失败: ${error.message}`);
  }
};

/**
 * 从文件导入预设
 * @param file 文件对象
 * @returns Promise，成功返回导入的预设对象
 */
export const importPresetFromFile = (file: File): Promise<PromptPreset> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const preset = importPresetFromJson(content);
        resolve(preset);
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = () => {
      reject(new Error('读取文件失败'));
    };
    
    reader.readAsText(file);
  });
};

/**
 * 应用预设到当前提示词集合
 * @param preset 要应用的预设
 * @param currentPromptCollection 当前提示词集合
 * @returns 应用预设后的提示词集合
 */
export const applyPresetToCollection = (preset: PromptPreset, currentPromptCollection: ChatMessage[]): ChatMessage[] => {
  // 1. 创建预设中的提示词的副本
  const presetPrompts = preset.prompts.map(p => ({...p}));
  
  // 2. 保留所有非队列中的提示词（非预设内容）
  const nonQueuePrompts = currentPromptCollection.filter(p => !p.isInQueue);
  
  // 3. 合并预设提示词和非队列提示词
  const updatedPrompts = [...presetPrompts, ...nonQueuePrompts];
  
  // 4. 标记提示词队列状态，只有在promptsList中的提示词才设置为队列中
  let finalPrompts = updatedPrompts.map(p => {
    // 检查提示词ID是否在promptsList中
    const isInPromptsList = preset.promptsList.includes(p.id);
    
    // 如果在promptsList中，则标记为队列中；否则标记为非队列中
    return {
      ...p,
      isInQueue: isInPromptsList
    };
  });
  
  // 5. 对提示词按照promptsList中的顺序进行排序
  finalPrompts.sort((a, b) => {
    // 如果两个提示词都在队列中，根据promptsList中的顺序排序
    if (a.isInQueue && b.isInQueue) {
      const aIndex = preset.promptsList.indexOf(a.id);
      const bIndex = preset.promptsList.indexOf(b.id);
      return aIndex - bIndex;
    }
    // 如果只有一个在队列中，队列中的排在前面
    else if (a.isInQueue) return -1;
    else if (b.isInQueue) return 1;
    // 如果都不在队列中，保持原有顺序
    return 0;
  });
  
  return finalPrompts;
}; 