import { ChatItem, ChatMessage } from '../types';
import { getFormattedPromptQueue } from './promptUtils';

// 处理发送消息
export const handleSendMessage = (
  messages: ChatMessage[],
  inputMessage: string,
  activeChat: ChatItem,
  onUpdateChat?: (chatId: string, updatedData: Partial<ChatItem>) => void,
  promptCollection?: ChatMessage[]
) => {
  // 添加用户消息
  const newUserMessage: ChatMessage = {
    id: Date.now().toString(),
    parts: [{ text: inputMessage }],
    role: 'user',
    timestamp: new Date()
  };
  
  const updatedMessages = [...messages, newUserMessage];
  
  // 更新聊天记录
  if (onUpdateChat) {
    onUpdateChat(activeChat.id, { 
      messages: updatedMessages,
      updatedAt: new Date()
    });
  }
  
  // 使用 promptUtils 格式化队列提示词消息
  if (promptCollection) {
    // 创建包含当前消息历史的提示词集合
    const updatedPromptCollection = promptCollection.map(prompt => {
      // 如果是历史记录提示词，更新其内容
      if (prompt.isHistory) {
        return {
          ...prompt,
          parts: [{ text: JSON.stringify(updatedMessages) }]
        };
      }
      // 如果是用户输入提示词，更新其内容
      if (prompt.isUserInput) {
        return {
          ...prompt,
          parts: [{ text: inputMessage }]
        };
      }
      return prompt;
    });
    
    // 获取格式化后的队列提示词消息
    const { history, userInput } = getFormattedPromptQueue(updatedPromptCollection);
    
    // 在控制台打印格式化后的队列提示词消息
    console.log("格式化后的队列提示词消息 - 历史记录:", history);
    console.log("格式化后的队列提示词消息 - 用户输入:", userInput);
  } else {
    console.log("没有可用的提示词集合");
  }
  
  return updatedMessages;
};

// 处理消息编辑
export const handleEditMessage = (
  messages: ChatMessage[],
  messageId: string,
  newText: string,
  activeChat: ChatItem,
  onUpdateChat?: (chatId: string, updatedData: Partial<ChatItem>) => void
) => {
  const updatedMessages = messages.map(msg => {
    if (msg.id === messageId) {
      return {
        ...msg,
        parts: [{ text: newText }]
      };
    }
    return msg;
  });
  
  // 更新聊天记录
  if (onUpdateChat) {
    onUpdateChat(activeChat.id, {
      messages: updatedMessages,
      updatedAt: new Date()
    });
  }
  
  return updatedMessages;
};

// 处理消息删除
export const handleDeleteMessage = (
  messages: ChatMessage[],
  messageId: string,
  activeChat: ChatItem,
  onUpdateChat?: (chatId: string, updatedData: Partial<ChatItem>) => void
) => {
  const updatedMessages = messages.filter(msg => msg.id !== messageId);
  
  // 更新聊天记录
  if (onUpdateChat) {
    onUpdateChat(activeChat.id, {
      messages: updatedMessages,
      updatedAt: new Date()
    });
  }
  
  return updatedMessages;
};

// 处理重发消息
export const handleResendMessage = (
  messages: ChatMessage[],
  messageId: string,
  activeChat: ChatItem,
  onUpdateChat?: (chatId: string, updatedData: Partial<ChatItem>) => void,
  promptCollection?: ChatMessage[]
) => {
  const messageIndex = messages.findIndex(msg => msg.id === messageId);
  if (messageIndex === -1) return messages;
  
  const messageToResend = messages[messageIndex];
  
  // 只允许重发用户消息
  if (messageToResend.role !== 'user') return messages;
  
  // 获取消息文本
  const messageText = messageToResend.parts.map(part => part.text).join('\n');
  
  // 保留该消息及之前的所有消息，删除该消息之后的回复
  const updatedMessages = messages.slice(0, messageIndex + 1);
  
  // 更新聊天记录
  if (onUpdateChat) {
    onUpdateChat(activeChat.id, {
      messages: updatedMessages,
      updatedAt: new Date()
    });
  }
  
  // 使用 promptUtils 格式化队列提示词消息
  if (promptCollection) {
    // 创建包含当前消息历史的提示词集合
    const updatedPromptCollection = promptCollection.map(prompt => {
      // 如果是历史记录提示词，更新其内容
      if (prompt.isHistory) {
        return {
          ...prompt,
          parts: [{ text: JSON.stringify(updatedMessages) }]
        };
      }
      // 如果是用户输入提示词，更新其内容
      if (prompt.isUserInput) {
        return {
          ...prompt,
          parts: [{ text: messageText }]
        };
      }
      return prompt;
    });
    
    // 获取格式化后的队列提示词消息
    const { history, userInput } = getFormattedPromptQueue(updatedPromptCollection);
    
    // 在控制台打印格式化后的队列提示词消息
    console.log("重发消息 - 格式化后的队列提示词消息 - 历史记录:", history);
    console.log("重发消息 - 格式化后的队列提示词消息 - 用户输入:", userInput);
  } else {
    console.log("没有可用的提示词集合");
  }
  
  return updatedMessages;
}; 