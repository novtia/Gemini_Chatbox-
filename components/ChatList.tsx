import React from 'react';
import { MessageSquare, Pin } from 'lucide-react';
import { ChatItem } from '../types';
import { useI18n } from '../utils/i18n';
import { chatListTranslations } from '../utils/translations';

interface ChatListProps {
  isCollapsed: boolean;
  chatHistory: ChatItem[];
  activeChat: ChatItem | null;
  setActiveChat: (chat: ChatItem) => void;
}

const ChatList: React.FC<ChatListProps> = ({
  isCollapsed,
  chatHistory,
  activeChat,
  setActiveChat
}) => {
  // 使用i18n
  const { t } = useI18n();
  
  // 获取最后一条消息的预览文本
  const getLastMessagePreview = (chat: ChatItem): string => {
    if (!chat.messages || chat.messages.length === 0) {
      return t('noMessages', chatListTranslations);
    }
    
    const lastMessage = chat.messages[chat.messages.length - 1];
    if (lastMessage.parts && lastMessage.parts.length > 0) {
      const text = lastMessage.parts[0].text;
      return text.length > 30 ? `${text.substring(0, 30)}...` : text;
    }
    
    return t('noTextContent', chatListTranslations);
  };
  
  // 格式化日期
  const formatDate = (date?: Date): string => {
    if (!date) return '';
    
    const now = new Date();
    const messageDate = new Date(date);
    
    // 如果是今天的消息，只显示时间
    if (messageDate.toDateString() === now.toDateString()) {
      return messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    
    // 如果是昨天的消息
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    if (messageDate.toDateString() === yesterday.toDateString()) {
      return t('yesterday', chatListTranslations);
    }
    
    // 如果是今年的消息
    if (messageDate.getFullYear() === now.getFullYear()) {
      const { language } = useI18n();
      if (language === 'zh') {
        return `${messageDate.getMonth() + 1}${t('month', chatListTranslations)}${messageDate.getDate()}${t('day', chatListTranslations)}`;
      } else {
        return `${messageDate.getMonth() + 1}/${messageDate.getDate()}`;
      }
    }
    
    // 其他情况显示完整日期
    return `${messageDate.getFullYear()}/${messageDate.getMonth() + 1}/${messageDate.getDate()}`;
  };
  
  return (
    <div className="flex-1 overflow-y-auto p-2 relative z-10">
      {chatHistory.map((chat, index) => (
        <div 
          key={chat.id}
          onClick={() => setActiveChat(chat)}
          className={`p-3 mb-2 rounded border cursor-pointer transition-all duration-300 relative overflow-hidden group ${
            activeChat && activeChat.id === chat.id 
              ? 'bg-green-500 bg-opacity-20 border-green-400 shadow-lg shadow-green-500/20 backdrop-blur-sm' 
              : 'bg-black bg-opacity-60 border-green-500 border-opacity-30 hover:bg-green-500 hover:bg-opacity-10 hover:border-green-400 hover:shadow-md hover:shadow-green-500/10 backdrop-blur-sm'
          } ${isCollapsed ? 'w-12 h-12 mx-auto justify-center items-center flex' : ''}`}
          style={{
            animationDelay: `${index * 50}ms`
          }}
        >
          {/* 矩阵效果背景 */}
          <div className="absolute inset-0 opacity-5 pointer-events-none">
            <div className="w-full h-full bg-gradient-to-r from-transparent via-green-400 to-transparent animate-pulse"></div>
          </div>
          
          {isCollapsed ? (
            // 折叠状态下只显示图标
            <div className="flex items-center justify-center relative z-10">
              <span className="text-green-400 group-hover:text-green-300 transition-colors">
                <MessageSquare size={16} />
              </span>
              {activeChat && activeChat.id === chat.id && (
                <div className="absolute inset-0 border border-green-400 rounded animate-pulse"></div>
              )}
            </div>
          ) : (
            // 展开状态下显示完整信息
            <div className="flex flex-col relative z-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="text-green-400 flex-shrink-0 group-hover:text-green-300 transition-colors">
                    <MessageSquare size={16} />
                  </span>
                  <span className={`ml-2 font-mono text-sm overflow-hidden text-ellipsis whitespace-nowrap max-w-[160px] tracking-wide ${
                    activeChat && activeChat.id === chat.id ? 'text-green-300 font-bold' : 'text-green-400 group-hover:text-green-300'
                  } transition-colors`}>
                    {chat.title}
                  </span>
                </div>
                <div className="flex items-center">
                  {chat.pinned && (
                    <Pin size={12} className="text-green-400 mr-1 animate-pulse" />
                  )}
                  <span className="text-xs text-green-500 opacity-70 font-mono tracking-wider">
                    {formatDate(chat.updatedAt)}
                  </span>
                </div>
              </div>
              
              {/* 最后一条消息预览 */}
              <div className="mt-2 text-xs text-green-500 opacity-60 overflow-hidden text-ellipsis whitespace-nowrap font-mono">
                <span className="text-green-400">&gt;</span> {getLastMessagePreview(chat)}
              </div>
              
              {/* 活跃聊天的额外效果 */}
              {activeChat && activeChat.id === chat.id && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-green-400 to-green-600 animate-pulse"></div>
              )}
            </div>
          )}
          
          {/* 悬停时的扫描线效果 */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-green-400 to-transparent opacity-0 group-hover:opacity-10 transition-opacity duration-300 transform -skew-x-12"></div>
        </div>
      ))}
      
      {/* 空状态显示 */}
      {chatHistory.length === 0 && (
        <div className="flex flex-col items-center justify-center h-32 text-green-500 opacity-50">
          <MessageSquare size={32} className="mb-2 animate-pulse" />
          <span className="font-mono text-sm tracking-wider">{t('noActiveSessions', chatListTranslations)}</span>
        </div>
      )}
      
      {/* CSS样式 */}
      <style jsx>{`
        @keyframes matrix-fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .group {
          animation: matrix-fade-in 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default ChatList;
