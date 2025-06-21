import React, { useState, useRef, useEffect } from 'react';
import { Pencil, Trash, Download, Settings, Cpu, GripVertical,ListTodo  } from 'lucide-react';
import { ModelOption } from '../../types';
import { useI18n } from '../../utils/i18n';
import { chatHeaderTranslations } from '../../utils/translations';

interface ChatHeaderProps {
  title?: string;
  onEditTitle: (newTitle: string) => void;
  onDeleteChat: () => void;
  onExportChat: () => void;
  onOpenSettings: () => void;
  currentModel?: ModelOption;
  isDragSortEnabled?: boolean;
  onToggleDragSort?: () => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({
  title = '新的聊天',
  onEditTitle,
  onDeleteChat,
  onExportChat,
  onOpenSettings,
  currentModel,
  isDragSortEnabled = false,
  onToggleDragSort
}) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState(title);
  const titleInputRef = useRef<HTMLInputElement>(null);
  
  // 使用i18n
  const { t } = useI18n();
  
  // 当传入的标题改变时，更新编辑状态
  useEffect(() => {
    setEditedTitle(title);
    setIsEditingTitle(false);
  }, [title]);
  
  // 当进入编辑模式时，聚焦输入框
  useEffect(() => {
    if (isEditingTitle && titleInputRef.current) {
      titleInputRef.current.focus();
    }
  }, [isEditingTitle]);
  
  // 处理标题编辑
  const handleEditTitle = () => {
    setIsEditingTitle(true);
  };
  
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedTitle(e.target.value);
  };
  
  const handleTitleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSaveTitle();
    } else if (e.key === 'Escape') {
      setIsEditingTitle(false);
      setEditedTitle(title);
    }
  };
  
  const handleSaveTitle = () => {
    if (editedTitle.trim()) {
      onEditTitle(editedTitle.trim());
    } else {
      // 如果标题为空，恢复为原标题或默认标题
      setEditedTitle(title);
    }
    setIsEditingTitle(false);
  };
  
  return (
    <div className="p-4 bg-black bg-opacity-80 border-b border-green-500 border-opacity-30 flex items-center justify-between relative overflow-hidden">
      {/* 矩阵效果背景 */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="w-full h-full bg-gradient-to-r from-transparent via-green-400 to-transparent animate-pulse"></div>
      </div>
      
      {/* 左侧标题区域 */}
      <div className="flex-1">
        {isEditingTitle ? (
          <input
            ref={titleInputRef}
            type="text"
            className="text-lg font-mono font-semibold bg-black bg-opacity-70 border border-green-500 rounded px-2 py-1 outline-none focus:border-green-400 text-green-300"
            value={editedTitle}
            onChange={handleTitleChange}
            onKeyDown={handleTitleKeyDown}
            onBlur={handleSaveTitle}
          />
        ) : (
          <div className="text-lg font-mono font-semibold text-green-400 tracking-wide flex items-center">
            <span className="text-green-500">&gt;</span> {title || t('newChat', chatHeaderTranslations)}
            {/* 光标闪烁效果 */}
            <span className="w-2 h-5 ml-1 bg-green-400 opacity-70 animate-pulse"></span>
          </div>
        )}
      </div>
      
      {/* 中间区域显示当前选择的模型 */}
      <div className="flex items-center justify-center space-x-2 mx-4 bg-black bg-opacity-50 px-3 py-1.5 rounded border border-green-500 border-opacity-30">
        <Cpu size={16} className="text-green-500" />
        <span className="text-sm font-mono text-green-400">
          {currentModel ? currentModel.name : t('modelNotSelected', chatHeaderTranslations)}
        </span>
      </div>
      
      {/* 右侧按钮区域 */}
      <div className="flex gap-3 relative z-10">
        {/* 拖拽排序开关按钮 */}
        <button 
          className={`p-1.5 ${isDragSortEnabled ? 'bg-green-500 bg-opacity-20 text-green-400' : 'text-green-500'} hover:bg-green-500 hover:bg-opacity-20 rounded group relative overflow-hidden`}
          onClick={onToggleDragSort}
          aria-label={isDragSortEnabled ? t('disableDragSort', chatHeaderTranslations) : t('enableDragSort', chatHeaderTranslations)}
          title={isDragSortEnabled ? t('disableDragSort', chatHeaderTranslations) : t('enableDragSort', chatHeaderTranslations)}
        >
          <ListTodo  size={18} className="group-hover:text-green-400 transition-colors" />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-green-400 to-transparent opacity-0 group-hover:opacity-20 transition-opacity duration-300 transform -skew-x-12"></div>
        </button>
        <button 
          className="p-1.5 text-green-500 hover:bg-green-500 hover:bg-opacity-20 rounded group relative overflow-hidden"
          onClick={onOpenSettings}
          aria-label={t('openSettings', chatHeaderTranslations)}
        >
          <Settings size={18} className="group-hover:text-green-400 transition-colors" />
          {/* 按钮悬停扫描线效果 */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-green-400 to-transparent opacity-0 group-hover:opacity-20 transition-opacity duration-300 transform -skew-x-12"></div>
        </button>
        <button 
          className="p-1.5 text-green-500 hover:bg-green-500 hover:bg-opacity-20 rounded group relative overflow-hidden"
          onClick={handleEditTitle}
          aria-label={t('editTitle', chatHeaderTranslations)}
        >
          <Pencil size={18} className="group-hover:text-green-400 transition-colors" />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-green-400 to-transparent opacity-0 group-hover:opacity-20 transition-opacity duration-300 transform -skew-x-12"></div>
        </button>
        <button 
          className="p-1.5 text-green-500 hover:bg-green-500 hover:bg-opacity-20 rounded group relative overflow-hidden"
          onClick={onDeleteChat}
          aria-label={t('deleteChat', chatHeaderTranslations)}
        >
          <Trash size={18} className="group-hover:text-green-400 transition-colors" />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-green-400 to-transparent opacity-0 group-hover:opacity-20 transition-opacity duration-300 transform -skew-x-12"></div>
        </button>
        <button 
          className="p-1.5 text-green-500 hover:bg-green-500 hover:bg-opacity-20 rounded group relative overflow-hidden"
          onClick={onExportChat}
          aria-label={t('exportChat', chatHeaderTranslations)}
        >
          <Download size={18} className="group-hover:text-green-400 transition-colors" />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-green-400 to-transparent opacity-0 group-hover:opacity-20 transition-opacity duration-300 transform -skew-x-12"></div>
        </button>
      </div>
      
      {/* 顶部扫描线效果 */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-green-500 to-transparent"></div>
    </div>
  );
};

export default ChatHeader; 