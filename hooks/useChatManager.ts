import { useState, useEffect } from 'react';
import { ChatItem, Config } from '../types';
import useLocalStorage from './useLocalStorage';

// 本地存储键
const CHAT_STORAGE_KEY = 'gemini_chat_list';
const ACTIVE_CHAT_ID_KEY = 'gemini_active_chat_id';

// 创建默认聊天
const createDefaultChat = (configData?: Config): ChatItem => ({
  id: Date.now().toString(),
  title: '新的聊天',
  createdAt: new Date(),
  updatedAt: new Date(),
  messages: [],
  config: configData || undefined
});

export default function useChatManager(defaultConfig: Config) {
  // 使用本地存储 hook 管理聊天列表
  const [chatList, setChatList] = useLocalStorage<ChatItem[]>(CHAT_STORAGE_KEY, []);
  
  // 活动聊天状态
  const [activeChat, setActiveChat] = useState<ChatItem | null>(null);
  
  // 初始化聊天列表和活动聊天
  useEffect(() => {
    // 如果聊天列表为空，创建默认聊天
    if (chatList.length === 0) {
      const newChat = createDefaultChat(defaultConfig);
      setChatList([newChat]);
      setActiveChat(newChat);
      return;
    }
    
    // 从本地存储加载活动聊天ID
    try {
      const activeChatId = localStorage.getItem(ACTIVE_CHAT_ID_KEY);
      if (activeChatId) {
        const foundChat = chatList.find(chat => chat.id === activeChatId);
        if (foundChat) {
          setActiveChat(foundChat);
          return;
        }
      }
      
      // 如果没有找到活动聊天，使用列表中的第一个
      setActiveChat(chatList[0]);
    } catch (error) {
      console.error('加载活动聊天ID失败:', error);
      setActiveChat(chatList[0]);
    }
  }, []);
  
  // 当活动聊天变化时保存ID到本地存储
  useEffect(() => {
    if (activeChat?.id) {
      try {
        localStorage.setItem(ACTIVE_CHAT_ID_KEY, activeChat.id);
      } catch (error) {
        console.error('保存活动聊天ID失败:', error);
      }
    }
  }, [activeChat?.id]);
  
  // 选择聊天
  const selectChat = (chat: ChatItem) => {
    setActiveChat(chat);
  };

  // 更新聊天内容
  const updateChat = (chatId: string, updatedData: Partial<ChatItem>) => {
    setChatList(prevList => {
      const newList = prevList.map(chat => {
        if (chat.id === chatId) {
          const updatedChat = { ...chat, ...updatedData };
          // 如果当前是活动聊天，同时更新活动聊天
          if (activeChat?.id === chatId) {
            setActiveChat(updatedChat);
          }
          return updatedChat;
        }
        return chat;
      });
      return newList;
    });
  };

  // 删除聊天
  const deleteChat = (chatId: string) => {
    setChatList(prevList => {
      const newList = prevList.filter(chat => chat.id !== chatId);

      // 如果删除的是当前活动聊天，则选择列表中的第一个聊天作为新的活动聊天
      if (activeChat?.id === chatId) {
        if (newList.length > 0) {
          setActiveChat(newList[0]);
        } else {
          // 如果删除后没有聊天了，创建一个新的
          const newChat = createDefaultChat(defaultConfig);
          setChatList([newChat]);
          setActiveChat(newChat);
          return [newChat];
        }
      }

      return newList;
    });
  };

  // 创建新聊天
  const createNewChat = () => {
    const newChat: ChatItem = createDefaultChat(defaultConfig);
    setChatList(prevList => [newChat, ...prevList]);
    setActiveChat(newChat);
    return newChat;
  };

  // 导入聊天
  const importChat = (importedChat: ChatItem) => {
    // 确保导入的聊天有唯一ID
    const chatWithNewId = {
      ...importedChat,
      id: Date.now().toString(),
      importedAt: new Date()
    };

    setChatList(prevList => [chatWithNewId, ...prevList]);
    setActiveChat(chatWithNewId);
    return chatWithNewId;
  };

  return {
    chatList,
    activeChat,
    selectChat,
    updateChat,
    deleteChat,
    createNewChat,
    importChat,
    createDefaultChat
  };
} 