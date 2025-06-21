import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../../types';
import { User, GripVertical, ChevronDown, ChevronUp } from 'lucide-react';
import MessageActions from './MessageActions';
import { useI18n } from '../../utils/i18n';
import { messageDisplayTranslations } from '../../utils/translations';

interface MessageDisplayProps {
  message: ChatMessage;
  onEdit?: (messageId: string, newContent: string) => void;
  onDelete?: (messageId: string) => void;
  onResend?: (messageId: string) => void;
}

const MessageDisplay: React.FC<MessageDisplayProps> = ({ 
  message,
  onEdit,
  onDelete,
  onResend
}) => {
  const isAI = message.role === 'model';
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(message.parts[0]?.text || '');
  const editRef = useRef<HTMLTextAreaElement>(null);
  const [showDragHandle, setShowDragHandle] = useState(false);
  const [showThoughts, setShowThoughts] = useState(false); // 控制思考内容的显示状态，默认为折叠
  
  // 使用i18n
  const { t } = useI18n();

  // 在编辑模式下聚焦输入框
  useEffect(() => {
    if (isEditing && editRef.current) {
      editRef.current.focus();
      editRef.current.setSelectionRange(editedText.length, editedText.length);
    }
  }, [isEditing]);

  const handleCopy = () => {
    // 复制消息内容到剪贴板
    const textToCopy = message.parts.map(part => part.text).join('\n');
    navigator.clipboard.writeText(textToCopy)
      .then(() => {
        console.log('文本已复制到剪贴板');
      })
      .catch(err => {
        console.error('复制失败：', err);
      });
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    if (onEdit) {
      onEdit(message.id, editedText);
    }
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditedText(message.parts[0]?.text || '');
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(message.id);
    }
  };

  const handleResend = () => {
    if (onResend) {
      onResend(message.id);
    }
  };
  
  // 切换思考内容的显示状态
  const toggleThoughts = () => {
    setShowThoughts(!showThoughts);
  };
  
  return (
    <div 
      className="mb-5 relative"
      onMouseEnter={() => setShowDragHandle(true)}
      onMouseLeave={() => setShowDragHandle(false)}
    >
      {/* 拖拽指示器 */}
      <div 
        className={`absolute ${isAI ? 'left-0' : 'right-0'} top-1/2 transform -translate-y-1/2 ${isAI ? '-ml-6' : '-mr-6'} opacity-0 ${showDragHandle ? 'opacity-70 hover:opacity-100' : ''} transition-opacity duration-200 cursor-move`}
        title={t('dragToReorder', messageDisplayTranslations)}
      >
        <GripVertical size={16} className="text-green-500" />
      </div>
      
      {/* 消息主体部分 */}
      <div className={`flex ${isAI ? 'justify-start' : 'justify-end'} items-start gap-3`}>
        {isAI && (
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-black border border-green-500 border-opacity-70 flex items-center justify-center relative overflow-hidden">
            <svg fill="currentColor" fillRule="evenodd" height="1em" className="text-green-400 relative z-10" style={{flex: 'none', lineHeight: 1}} viewBox="0 0 24 24" width="1em" xmlns="http://www.w3.org/2000/svg">
              <title>Gemini</title>
              <path d="M12 24A14.304 14.304 0 000 12 14.304 14.304 0 0012 0a14.305 14.305 0 0012 12 14.305 14.305 0 00-12 12"></path>
            </svg>
          </div>
        )}
        
        <div className={`max-w-[60%] rounded-lg p-4 relative overflow-hidden ${
          isAI 
            ? 'bg-black bg-opacity-70 border border-green-500 border-opacity-30 backdrop-blur-sm' 
            : 'bg-black bg-opacity-70 border border-green-600 border-opacity-50 backdrop-blur-sm'
        }`}>
          {/* AI思考内容区域 - 仅当消息是AI消息且有思考内容时才显示 */}
          {isAI && message.thoughts && (
            <div className="mb-3">
              {/* 思考内容折叠/展开按钮 */}
              <button 
                onClick={toggleThoughts} 
                className="flex items-center text-xs text-green-500 hover:text-green-400 font-mono mb-1 focus:outline-none group"
              >
                {showThoughts ? (
                  <>
                    <ChevronUp size={14} className="mr-1 text-green-500" />
                    <span>{t('hideThoughts', messageDisplayTranslations)}</span>
                  </>
                ) : (
                  <>
                    <ChevronDown size={14} className="mr-1 text-green-500" />
                    <span>{t('showThoughts', messageDisplayTranslations)}</span>
                  </>
                )}
                <div className="h-[1px] flex-grow ml-2 bg-gradient-to-r from-green-500 via-green-500 to-transparent opacity-30 group-hover:opacity-50"></div>
              </button>
              
              {/* 思考内容展示区域 - 根据showThoughts状态控制显示/隐藏 */}
              {showThoughts && (
                <div className="p-2 bg-black bg-opacity-70 border border-green-600 border-opacity-30 rounded-md relative overflow-hidden mt-1 mb-2">
                  <pre className="text-xs overflow-x-auto whitespace-pre-wrap text-green-400 font-mono">
                    {message.thoughts}
                  </pre>
                </div>
              )}
            </div>
          )}
          
          {isEditing ? (
            <div className="flex flex-col">
              <textarea
                ref={editRef}
                value={editedText}
                onChange={(e) => setEditedText(e.target.value)}
                className={`text-sm font-mono p-2 min-h-[100px] bg-black bg-opacity-90 border border-green-500 rounded-md text-green-300 focus:outline-none focus:border-green-400`}
              />
              <div className="flex justify-end mt-2 space-x-2">
                <button 
                  onClick={handleCancelEdit}
                  className="text-sm text-red-400 hover:text-red-300 px-2 py-1 rounded-md hover:bg-red-900 hover:bg-opacity-20"
                >
                  {t('cancel', messageDisplayTranslations)}
                </button>
                <button 
                  onClick={handleSaveEdit}
                  className="text-sm text-green-400 hover:text-green-300 px-2 py-1 rounded-md hover:bg-green-900 hover:bg-opacity-20"
                >
                  {t('save', messageDisplayTranslations)}
                </button>
              </div>
            </div>
          ) : (
            <>
              {message.parts.map((part, index) => (
                <div key={index} className={`text-sm whitespace-pre-wrap font-mono ${isAI ? 'text-green-400' : 'text-green-300'}`}>
                  {part.text}
                </div>
              ))}
            </>
          )}
          
          
          {/* 支持新的Data数组渲染图片 */}
          {message.data && message.data.length > 0 && message.data.map((item, index) => (
            item.mimeType && item.mimeType.startsWith('image/') && (
              <div key={`data-${index}`} className="mt-2 border border-green-500 border-opacity-30 rounded-md p-1 overflow-hidden relative">
                <img 
                  src={`data:${item.mimeType};base64,${item.data}`} 
                  alt="Uploaded content" 
                  className="rounded-md max-w-full" 
                />
              </div>
            )
          ))}
          
          {message.fileContent && (
            <div className="mt-2 p-2 bg-black bg-opacity-70 border border-green-600 border-opacity-30 rounded-md relative overflow-hidden">
              <div className="text-xs text-green-500 mb-1 font-mono">{message.fileName || t('file', messageDisplayTranslations)}</div>
              <pre className="text-xs overflow-x-auto whitespace-pre-wrap text-green-400 font-mono">
                {message.fileContent}
              </pre>
            </div>
          )}
          
          {message.isLoading && (
            <div className="mt-2 flex items-center">
              <div className="w-4 h-4 border-2 border-green-500 border-t-transparent rounded-full animate-spin"></div>
              <span className="ml-2 text-xs text-green-500 font-mono">{t('loading', messageDisplayTranslations)}</span>
            </div>
          )}
          
          <div className="mt-1 text-xs text-green-700 font-mono tracking-wide">
            {message.timestamp && new Date(message.timestamp).toLocaleTimeString()}
          </div>
        </div>
        
        {!isAI && (
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-black border border-green-600 flex items-center justify-center relative overflow-hidden">
            <User size={16} className="text-green-400 relative z-10" />
          </div>
        )}
      </div>
      
      {/* 消息操作按钮 - 根据消息类型对齐 */}
      {!isEditing && (
        <div className={`flex ${isAI ? 'justify-start' : 'justify-end'} mt-2`}>
          <div className={`${isAI ? 'ml-11' : 'mr-11'}`}>
            <MessageActions 
              isAI={isAI}
              isEditing={isEditing}
              onCopy={handleCopy}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onResend={!isAI ? handleResend : undefined}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageDisplay; 