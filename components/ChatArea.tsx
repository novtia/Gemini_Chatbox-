import React, { useState, useRef, useEffect } from 'react';
import { Pencil, Trash, Download, Settings, GripVertical } from 'lucide-react';
import MessageDisplay from './Chat/MessageDisplay';
import { SettingsModal } from './Setting';
import { ChatItem, ChatMessage, Config, ModelOption, ModelCharacterCard, FileMessageType } from '../types';
import { useConfigContext } from '../contexts/ConfigContext';
import ChatInput from './Chat/ChatInput';
import ChatHeader from './Chat/ChatHeader';
import { getFormattedPromptQueue } from '../utils/promptUtils';
import { useI18n } from '../utils/i18n';
import { chatAreaTranslations } from '../utils/translations';

interface ChatAreaProps {
  activeChat?: ChatItem | null;
  onUpdateChat?: (chatId: string, updatedData: Partial<ChatItem>) => void;
  onDeleteChat?: (chatId: string) => void;
  availableModels: ModelOption[];
  isModelsLoading: boolean;
  modelsLoadingError: string | null;
  promptCollection?: ChatMessage[];
  onEditPrompt?: (prompt: ChatMessage | null) => void;
  onTogglePromptInQueue?: (promptId: string) => void;
  onReorderPrompts?: (reorderedPrompts: ChatMessage[]) => void;
  onUserInputChange?: (input: string) => void;
  onSendMessage?: (message: string) => void;
  onEditMessage?: (messageId: string, text: string) => void;
  onDeleteMessage?: (messageId: string) => void;
  onResendMessage?: (messageId: string) => void;
  systemInstruction?: string;
  currentSessionId?: string;
  onOpenModelCharacter?: () => void;
  selectedCharacter?: ModelCharacterCard | null;
}

const ChatArea: React.FC<ChatAreaProps> = ({ 
  activeChat, 
  onUpdateChat, 
  onDeleteChat,
  availableModels,
  isModelsLoading,
  modelsLoadingError,
  promptCollection,
  onEditPrompt,
  onTogglePromptInQueue,
  onReorderPrompts,
  onUserInputChange,
  onSendMessage,
  onEditMessage,
  onDeleteMessage,
  onResendMessage,
  systemInstruction,
  currentSessionId,
  onOpenModelCharacter,
  selectedCharacter
}) => {
  // 使用配置上下文
  const { config, updateConfig } = useConfigContext();
  
  // 使用i18n
  const { t } = useI18n();
  
  // 默认欢迎消息
  const defaultWelcomeMessage: ChatMessage = {
    id: '1',
    parts: [{ text: t('welcomeMessage', chatAreaTranslations) }],
    role: 'model',
    timestamp: new Date(),
  };
  
  // 使用 activeChat 中的消息，如果存在的话，否则使用默认消息
  const [messages, setMessages] = useState<ChatMessage[]>(
    activeChat?.messages || [defaultWelcomeMessage]
  );
  
  // 删除确认弹窗状态
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [messageToDelete, setMessageToDelete] = useState<string | null>(null);
  
  // 设置相关状态
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  // 拖拽相关状态
  const [draggedMessageId, setDraggedMessageId] = useState<string | null>(null);
  const [dragOverMessageId, setDragOverMessageId] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  
  // 拖拽排序开关状态
  const [isDragSortEnabled, setIsDragSortEnabled] = useState(false);
  
  // 当 activeChat 改变或其消息更新时，更新消息列表和设置
  useEffect(() => {
    if (activeChat?.messages) {
      setMessages(activeChat.messages);
    } else {
      setMessages([defaultWelcomeMessage]);
    }
    
    setShowDeleteModal(false);
    setMessageToDelete(null);
  }, [activeChat?.id, activeChat?.messages]);
  
  // 使用导入的消息处理函数
  const handleSendMessageWrapper = (inputMessage: string) => {
    if (onSendMessage && activeChat) {
      onSendMessage(inputMessage);
    }
  };
  
  // 使用导入的消息编辑函数
  const handleEditMessageWrapper = (messageId: string, newText: string) => {
    if (onEditMessage && activeChat) {
      onEditMessage(messageId, newText);
    }
  };
  
  // 处理消息删除
  const handleDeleteMessageWrapper = (messageId: string) => {
    if (activeChat) {
      setMessageToDelete(messageId);
      setShowDeleteModal(true);
    }
  };
  
  // 确认删除消息
  const confirmDeleteMessage = () => {
    if (!messageToDelete || !activeChat) return;
    if (onDeleteMessage) {
      onDeleteMessage(messageToDelete);
    }
    setShowDeleteModal(false);
    setMessageToDelete(null);
  };
  
  // 使用导入的重发消息函数
  const handleResendMessageWrapper = (messageId: string) => {
    if (onResendMessage && activeChat) {
      onResendMessage(messageId);
    }
  };
  
  // 处理标题编辑
  const handleEditTitle = (newTitle: string) => {
    if (onUpdateChat && activeChat) {
      onUpdateChat(activeChat.id, { title: newTitle });
    }
  };
  
  // 处理删除整个聊天
  const handleDeleteChat = () => {
    if (activeChat) {
      setMessageToDelete(null);
      setShowDeleteModal(true);
    }
  };
  
  // 确认删除聊天
  const confirmDeleteChat = () => {
    if (onDeleteChat && activeChat) {
      onDeleteChat(activeChat.id);
    }
    setShowDeleteModal(false);
  };
  
  // 取消删除操作
  const cancelDelete = () => {
    setShowDeleteModal(false);
    setMessageToDelete(null);
  };
  
  // 处理导出聊天
  const handleExportChat = () => {
    if (!activeChat) return;
    
    try {
      // 准备导出数据
      const exportData = {
        ...activeChat,
        exportedAt: new Date()
      };
      
      // 转换为JSON字符串
      const jsonString = JSON.stringify(exportData, null, 2);
      
      // 创建Blob
      const blob = new Blob([jsonString], { type: 'application/json' });
      
      // 创建下载链接
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${activeChat.title || 'chat'}-${new Date().toISOString().slice(0, 10)}.json`;
      
      // 触发下载
      document.body.appendChild(a);
      a.click();
      
      // 清理
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('导出聊天失败:', error);
      // 这里可以添加错误提示
    }
  };
  
  // 处理保存设置
  const handleSaveSettings = (newSettings: Config) => {
    // 使用上下文的更新函数保存设置
    updateConfig(newSettings);
    
    // 关闭设置模态框
    setIsSettingsOpen(false);
    
    // 如果需要，可以更新当前聊天的配置
    if (onUpdateChat && activeChat) {
      onUpdateChat(activeChat.id, { config: newSettings });
    }
  };
  
  // 切换拖拽排序功能
  const handleToggleDragSort = () => {
    setIsDragSortEnabled(!isDragSortEnabled);
    // 如果关闭拖拽排序，清除所有拖拽状态
    if (isDragSortEnabled) {
      setDraggedMessageId(null);
      setDragOverMessageId(null);
      setIsDragging(false);
    }
  };
  
  // 处理拖拽开始
  const handleDragStart = (messageId: string) => {
    if (!isDragSortEnabled) return;
    setDraggedMessageId(messageId);
    setIsDragging(true);
  };
  
  // 处理拖拽结束
  const handleDragEnd = () => {
    if (!isDragSortEnabled) return;
    setDraggedMessageId(null);
    setDragOverMessageId(null);
    setIsDragging(false);
  };
  
  // 处理拖拽进入
  const handleDragOver = (e: React.DragEvent, messageId: string) => {
    if (!isDragSortEnabled) return;
    e.preventDefault();
    if (draggedMessageId !== messageId) {
      setDragOverMessageId(messageId);
    }
  };
  
  // 处理拖拽离开
  const handleDragLeave = () => {
    if (!isDragSortEnabled) return;
    setDragOverMessageId(null);
  };
  
  // 处理放置
  const handleDrop = (e: React.DragEvent, targetMessageId: string) => {
    if (!isDragSortEnabled) return;
    e.preventDefault();
    
    if (!draggedMessageId || draggedMessageId === targetMessageId) {
      return;
    }
    
    // 找到源消息和目标消息的索引
    const draggedIndex = messages.findIndex(msg => msg.id === draggedMessageId);
    const targetIndex = messages.findIndex(msg => msg.id === targetMessageId);
    
    if (draggedIndex === -1 || targetIndex === -1) {
      return;
    }
    
    // 创建新的消息数组
    const newMessages = [...messages];
    // 移除拖拽的消息
    const [draggedMessage] = newMessages.splice(draggedIndex, 1);
    // 将拖拽的消息插入到目标位置
    newMessages.splice(targetIndex, 0, draggedMessage);
    
    // 更新消息列表
    setMessages(newMessages);
    
    // 更新聊天记录
    if (onUpdateChat && activeChat) {
      onUpdateChat(activeChat.id, {
        messages: newMessages,
        updatedAt: new Date()
      });
    }
    
    // 清除拖拽状态
    setDraggedMessageId(null);
    setDragOverMessageId(null);
  };
  
  // 处理文件上传
  const handleFileUpload = async (file: File) => {
    if (!activeChat || !onUpdateChat) return;
    
    // 确定文件类型
    let fileType = FileMessageType.OTHER;
    if (file.type.startsWith('image/')) {
      fileType = FileMessageType.IMAGE;
    } else if (file.type.startsWith('text/')) {
      fileType = FileMessageType.TEXT;
    } else if (file.type === 'application/pdf') {
      fileType = FileMessageType.PDF;
    }
    
    // 读取文件内容（仅对文本文件）
    let fileContent = '';
    if (fileType === FileMessageType.TEXT) {
      try {
        fileContent = await file.text();
      } catch (error) {
        console.error('读取文件内容失败:', error);
      }
    }
    
    // 创建文件消息
    const fileMessage: ChatMessage = {
      id: `file-${Date.now()}`,
      parts: [{ text: file.name }],
      role: 'user',
      timestamp: new Date(),
      fileName: file.name,
      fileType: fileType,
      fileMimeType: file.type,
      fileSize: file.size,
      fileContent: fileContent,
      isFileMessage: true
    };
    
    // 如果是图片，创建预览URL
    if (fileType === FileMessageType.IMAGE) {
      const imageUrl = URL.createObjectURL(file);
      fileMessage.data = [{
        mimeType: file.type,
        data: imageUrl
      }];
      
      // 在组件卸载时清理URL
      useEffect(() => {
        return () => {
          if (fileMessage.data && fileMessage.data[0] && fileMessage.data[0].data) {
            URL.revokeObjectURL(fileMessage.data[0].data);
          }
        };
      }, []);
    }
    
    // 添加文件消息到聊天记录
    const updatedMessages = [...messages, fileMessage];
    setMessages(updatedMessages);
    
    // 更新聊天记录
    onUpdateChat(activeChat.id, {
      messages: updatedMessages,
      updatedAt: new Date()
    });
  };
  
  return (
    <div className="flex-1 flex flex-col bg-black bg-opacity-90 relative overflow-hidden">
      {/* 背景矩阵动画效果 */}
      <div className="absolute inset-0 opacity-5 pointer-events-none overflow-hidden">
        <div className="animate-matrix-rain w-full h-full">
          {/* 这里可以添加一些随机的矩阵数字或者符号装饰 */}
          <div className="absolute top-0 left-1/4 text-green-500 opacity-30 text-xs tracking-wide font-mono">01001010</div>
          <div className="absolute top-1/3 left-3/4 text-green-400 opacity-20 text-xs tracking-wide font-mono">10110101</div>
          <div className="absolute top-2/3 left-1/2 text-green-600 opacity-40 text-xs tracking-wide font-mono">01101001</div>
        </div>
      </div>
      
      {/* 拖拽状态指示器 */}
      {isDragging && isDragSortEnabled && (
        <div className="fixed inset-0 bg-green-500 bg-opacity-5 pointer-events-none z-10">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-green-500 to-transparent animate-pulse"></div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-green-500 to-transparent animate-pulse"></div>
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-transparent via-green-500 to-transparent animate-pulse"></div>
          <div className="absolute right-0 top-0 bottom-0 w-1 bg-gradient-to-b from-transparent via-green-500 to-transparent animate-pulse"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-green-500 font-mono text-sm">
            {t('dragSortingActive', chatAreaTranslations)}
          </div>
        </div>
      )}
      
      {/* 头部 - 使用新的ChatHeader组件 */}
      <ChatHeader 
        title={activeChat?.title || ''}
        onEditTitle={handleEditTitle}
        onDeleteChat={handleDeleteChat}
        onExportChat={handleExportChat}
        onOpenSettings={() => setIsSettingsOpen(true)}
        currentModel={availableModels.find(model => model.id === config.modelId) || availableModels[0]}
        isDragSortEnabled={isDragSortEnabled}
        onToggleDragSort={handleToggleDragSort}
        onOpenModelCharacter={onOpenModelCharacter}
        selectedCharacter={selectedCharacter}
      />
      
      {/* 拖拽排序提示 */}
      {isDragSortEnabled && (
        <div className="px-5 pt-2 text-xs text-green-600 font-mono flex items-center overflow-x-hidden">
          <GripVertical size={12} className="mr-1 text-green-500" />
          <span>{t('dragSortTip', chatAreaTranslations)}</span>
        </div>
      )}
      
      {/* 聊天内容区域 */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden p-5 space-y-5 backdrop-blur-sm">
        {messages.map((message) => (
          <div 
            key={message.id}
            draggable={isDragSortEnabled}
            onDragStart={() => handleDragStart(message.id)}
            onDragEnd={handleDragEnd}
            onDragOver={(e) => handleDragOver(e, message.id)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, message.id)}
            className={`
              ${draggedMessageId === message.id && isDragSortEnabled ? 'opacity-50 scale-95' : 'opacity-100'}
              ${dragOverMessageId === message.id && isDragSortEnabled ? 'border-2 border-green-500 border-dashed rounded-lg' : ''}
              transition-all duration-200 ${isDragSortEnabled ? 'cursor-move' : ''}
              ${dragOverMessageId === message.id && isDragSortEnabled ? 'transform translate-y-1' : ''}
              max-w-full overflow-x-hidden
            `}
          >
            <MessageDisplay 
              message={message} 
              onEdit={handleEditMessageWrapper}
              onDelete={handleDeleteMessageWrapper}
              onResend={handleResendMessageWrapper}
            />
          </div>
        ))}
      </div>
      
      {/* 输入区域 - 使用新的ChatInput组件 */}
      <ChatInput 
        onSendMessage={handleSendMessageWrapper} 
        onInputChange={onUserInputChange}
        onFileUpload={handleFileUpload}
        onOpenModelCharacter={onOpenModelCharacter}
      />
      
      {/* 删除确认弹窗 */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-80 backdrop-blur-sm flex items-center justify-center z-50 overflow-hidden">
          <div className="bg-black border border-green-500 border-opacity-50 rounded-lg p-6 max-w-md w-full mx-4 shadow-xl relative overflow-hidden">
            {/* 弹窗扫描线效果 */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-green-500 to-transparent opacity-5 animate-pulse"></div>
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-green-500 to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-green-500 to-transparent"></div>
            
            <h3 className="text-xl font-mono font-semibold mb-4 text-green-400 flex items-center overflow-hidden text-ellipsis whitespace-nowrap">
              <span className="text-green-500 mr-2">&gt;</span> {t('confirmDelete', chatAreaTranslations)}
            </h3>
            <p className="mb-6 text-green-300 font-mono overflow-hidden">
              {messageToDelete 
                ? t('deleteMessageConfirm', chatAreaTranslations)
                : t('deleteChatConfirm', chatAreaTranslations).replace('${title}', activeChat?.title || '')}
            </p>
            <div className="flex justify-end gap-3">
              <button 
                className="px-4 py-2 bg-black border border-green-600 text-green-400 rounded hover:bg-green-600 hover:bg-opacity-20 transition-all font-mono relative overflow-hidden group"
                onClick={cancelDelete}
              >
                {t('cancel', chatAreaTranslations)}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-green-400 to-transparent opacity-0 group-hover:opacity-20 transition-opacity duration-300 transform -skew-x-12"></div>
              </button>
              <button 
                className="px-4 py-2 bg-red-900 bg-opacity-30 border border-red-600 text-red-400 rounded hover:bg-red-600 hover:bg-opacity-20 transition-all font-mono relative overflow-hidden group"
                onClick={messageToDelete ? confirmDeleteMessage : confirmDeleteChat}
              >
                {t('delete', chatAreaTranslations)}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-red-400 to-transparent opacity-0 group-hover:opacity-20 transition-opacity duration-300 transform -skew-x-12"></div>
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* 设置模态框 */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        currentSettings={config}
        availableModels={availableModels}
        onSave={handleSaveSettings}
        isModelsLoading={isModelsLoading}
        modelsLoadingError={modelsLoadingError}
      />
      
      {/* 添加 CSS 样式 */}
      <style jsx>{`
        @keyframes matrix-rain {
          0% {
            opacity: 0.3;
            transform: translateY(-100%);
          }
          100% {
            opacity: 0.05;
            transform: translateY(100%);
          }
        }
        
        .animate-matrix-rain {
          animation: matrix-rain 20s linear infinite;
          background-image: linear-gradient(to bottom, transparent, rgba(0, 255, 0, 0.2), transparent);
        }
        
        /* 禁止x轴滚动的全局样式 */
        :global(.overflow-x-hidden) {
          overflow-x: hidden !important;
          max-width: 100% !important;
          word-wrap: break-word !important;
        }
      `}</style>
    </div>
  );
};

export default ChatArea;
