import { useState } from 'react';
import { ChatItem, ChatMessage, ApiContentPart } from '../types';
import { getFormattedPromptQueue } from '../utils/promptUtils';
import { geminiServiceInstance } from '../services/geminiService';

export default function useMessageHandler(
  updateChat: (chatId: string, updatedData: Partial<ChatItem>) => void
) {
  // 处理消息发送
  const sendMessage = async (
    inputMessage: string,
    chat: ChatItem,
    promptCollection: ChatMessage[],
    config: any
  ) => {
    if (!chat) return;

    const messages = chat.messages || [];
    
    try {
      // 先添加用户消息
      const userMessage: ChatMessage = {
        id: Date.now().toString(),
        role: 'user',
        parts: [{ text: inputMessage }],
        timestamp: new Date()
      };
      
      // 创建模型消息占位符
      const modelMessageId = (Date.now() + 1).toString();
      const modelMessage: ChatMessage = {
        id: modelMessageId,
        role: 'model',
        parts: [{ text: '' }],
        timestamp: new Date(),
        isLoading: true // 使用 isLoading 标记正在加载
      };
      
      // 更新聊天记录，添加用户消息和模型消息占位符
      const updatedMessages = [...messages, userMessage, modelMessage];
      updateChat(chat.id, { 
        messages: updatedMessages,
        updatedAt: new Date()
      });
      
      // 使用 promptUtils 格式化队列提示词消息
      if (promptCollection) {
        // 创建包含当前消息历史的提示词集合
        const updatedPromptCollection = promptCollection.map(prompt => {
          // 如果是历史记录提示词，更新其内容
          if (prompt.isHistory) {
            return {
              ...prompt,
              parts: [{ text: JSON.stringify([...messages, userMessage]) }]
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

        // 初始化聊天
        const modelId = chat.config?.modelId || config.modelId;
        const systemInstr = chat.config?.systemInstruction || config.systemInstruction || '';
        const showThoughts = chat.config?.showThoughts !== undefined ? chat.config.showThoughts : config.showThoughts;
        const modelConfig = {
          temperature: chat.config?.temperature !== undefined ? chat.config.temperature : config.temperature,
          topP: chat.config?.topP !== undefined ? chat.config.topP : config.topP,
          topK: chat.config?.topK !== undefined ? chat.config.topK : config.topK,
          maxOutputTokens: chat.config?.maxOutputTokens !== undefined ? chat.config.maxOutputTokens : config.maxOutputTokens, // Added maxOutputTokens
          safetySettings: chat.config?.safetySettings !== undefined ? chat.config.safetySettings : config.safetySettings // Added safetySettings
        };
        
        // 初始化聊天会话
        const chatSession = await geminiServiceInstance.initializeChat(
          modelId,
          systemInstr,
          modelConfig,
          showThoughts,
          history
        );
        
        if (!chatSession) {
          throw new Error("无法初始化聊天会话");
        }
        
        // 准备消息部分 - 始终使用空的用户输入
        const messageParts: ApiContentPart[] = [];
        
        // 始终使用空的用户输入
        messageParts.push({ text: " " }); // 使用一个空格作为输入
        
        console.log("发送给模型的消息: 空值");
        console.log("聊天会话历史记录:", history.map(h => ({role: h.role, text: h.parts[0]?.text})));
        
        let responseText = '';
        let thoughtsText = '';
        
        // 发送消息流
        await geminiServiceInstance.sendMessageStream(
          chatSession,
          modelId,
          messageParts,
          // 处理响应文本块
          (chunk) => {
            responseText += chunk;
            
            // 更新模型回复
            const updatedModelMessage = {
              ...modelMessage,
              parts: [{ text: responseText }],
              isLoading: true
            };
            
            // 更新聊天记录
            const currentMessages = [...messages, userMessage, updatedModelMessage];
            updateChat(chat.id, { 
              messages: currentMessages,
              updatedAt: new Date()
            });
          },
          // 处理思考文本块
          (thoughtChunk) => {
            thoughtsText += thoughtChunk;
            
            // 更新模型回复，包含思考内容
            const updatedModelMessage = {
              ...modelMessage,
              parts: [{ text: responseText }],
              thoughts: thoughtsText,
              isLoading: true
            };
            
            // 更新聊天记录
            const currentMessages = [...messages, userMessage, updatedModelMessage];
            updateChat(chat.id, { 
              messages: currentMessages,
              updatedAt: new Date()
            });
          },
          // 处理错误
          (error) => {
            console.error("发送消息时出错:", error);
            
            // 创建错误消息
            const errorMessage: ChatMessage = {
              id: modelMessageId,
              role: 'error',
              parts: [{ text: `发送消息时出错: ${error.message}` }],
              timestamp: new Date()
            };
            
            // 更新聊天记录，替换占位消息为错误消息
            const currentMessages = [...messages, userMessage, errorMessage];
            updateChat(chat.id, { 
              messages: currentMessages,
              updatedAt: new Date()
            });
          },
          // 完成回调
          () => {
            // 更新模型回复，移除加载状态
            const finalModelMessage = {
              ...modelMessage,
              parts: [{ text: responseText }],
              thoughts: thoughtsText || undefined,
              isLoading: false
            };
            
            // 更新聊天记录
            const finalMessages = [...messages, userMessage, finalModelMessage];
            updateChat(chat.id, { 
              messages: finalMessages,
              updatedAt: new Date()
            });
          }
        );
      }
      
      return true;
    } catch (error) {
      console.error('发送消息失败:', error);
      
      // 创建错误消息
      const errorMessage: ChatMessage = {
        id: Date.now().toString(),
        role: 'error',
        parts: [{ text: `发送消息失败: ${error.message || '未知错误'}` }],
        timestamp: new Date()
      };
      
      // 更新聊天记录，添加用户消息和错误消息
      const updatedMessages = [...messages, {
        id: Date.now().toString(),
        role: 'user',
        parts: [{ text: inputMessage }],
        timestamp: new Date()
      }, errorMessage];
      
      updateChat(chat.id, { 
        messages: updatedMessages,
        updatedAt: new Date()
      });
      
      return false;
    }
  };

  // 处理消息编辑
  const editMessage = (
    chat: ChatItem,
    messageId: string,
    newText: string
  ) => {
    if (!chat) return;

    const messages = chat.messages || [];
    const messageIndex = messages.findIndex(msg => msg.id === messageId);
    
    if (messageIndex !== -1) {
      const updatedMessages = [...messages];
      const messageToEdit = { ...updatedMessages[messageIndex] };
      
      // 更新消息文本
      messageToEdit.parts = [{ text: newText }];
      messageToEdit.edited = true;
      messageToEdit.editedAt = new Date();
      
      updatedMessages[messageIndex] = messageToEdit;
      
      // 如果编辑的是用户消息，则删除之后的所有消息
      if (messageToEdit.role === 'user') {
        const newMessages = updatedMessages.slice(0, messageIndex + 1);
        updateChat(chat.id, { 
          messages: newMessages,
          updatedAt: new Date()
        });
      } else {
        updateChat(chat.id, { 
          messages: updatedMessages,
          updatedAt: new Date()
        });
      }
    }
  };

  // 处理消息删除
  const deleteMessage = (
    chat: ChatItem,
    messageId: string
  ) => {
    if (!chat) return;

    const messages = chat.messages || [];
    const messageIndex = messages.findIndex(msg => msg.id === messageId);
    
    if (messageIndex !== -1) {
      const messageToDelete = messages[messageIndex];
      let updatedMessages;
      
      // 如果删除的是用户消息，同时删除之后的回复
      if (messageToDelete.role === 'user') {
        // 检查下一条是否为模型回复
        const nextIndex = messageIndex + 1;
        if (nextIndex < messages.length && messages[nextIndex].role === 'model') {
          // 删除用户消息和对应的模型回复
          updatedMessages = [
            ...messages.slice(0, messageIndex),
            ...messages.slice(messageIndex + 2)
          ];
        } else {
          // 仅删除用户消息
          updatedMessages = [
            ...messages.slice(0, messageIndex),
            ...messages.slice(messageIndex + 1)
          ];
        }
      } else {
        // 删除单条消息
        updatedMessages = [
          ...messages.slice(0, messageIndex),
          ...messages.slice(messageIndex + 1)
        ];
      }
      
      updateChat(chat.id, { 
        messages: updatedMessages,
        updatedAt: new Date()
      });
    }
  };

  // 处理消息重发
  const resendMessage = async (
    chat: ChatItem,
    messageId: string,
    promptCollection: ChatMessage[],
    config: any
  ) => {
    if (!chat) return;

    const messages = chat.messages || [];
    const messageIndex = messages.findIndex(msg => msg.id === messageId);
    if (messageIndex === -1) return;
    
    const messageToResend = messages[messageIndex];
    
    // 只允许重发用户消息
    if (messageToResend.role !== 'user') return;
    
    // 获取消息文本
    const messageText = messageToResend.parts.map(part => part.text).join('\n');
    
    // 保留该消息之前的所有消息，删除该消息及之后的回复
    const updatedMessages = messages.slice(0, messageIndex);
    
    // 重用 sendMessage 函数发送消息
    const updatedChat = { ...chat, messages: updatedMessages };
    return await sendMessage(messageText, updatedChat, promptCollection, config);
  };

  return {
    sendMessage,
    editMessage,
    deleteMessage,
    resendMessage
  };
}
