import React from 'react';
import { Copy, Edit, Trash, Send } from 'lucide-react';
import { useI18n } from '../../utils/i18n';
import { messageActionsTranslations } from '../../utils/translations';

interface MessageActionsProps {
  isAI: boolean;
  isEditing: boolean;
  onCopy: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onResend?: () => void;
}

const MessageActions: React.FC<MessageActionsProps> = ({
  isAI,
  isEditing,
  onCopy,
  onEdit,
  onDelete,
  onResend
}) => {
  // 使用i18n
  const { t } = useI18n();
  
  // 创建按钮数组，可以根据消息类型决定顺序
  const buttons = [
    // 复制按钮
    <button 
      key="copy"
      className="relative p-1.5 hover:bg-green-900 hover:bg-opacity-20 transition-colors border border-green-500 border-opacity-30 transform skew-x-12 overflow-hidden"
      onClick={onCopy}
      title={t('copy', messageActionsTranslations)}
      style={{ clipPath: 'polygon(10% 0%, 100% 0%, 90% 100%, 0% 100%)' }}
    >
      <span className="flex items-center justify-center transform -skew-x-12">
        <Copy size={14} className="text-green-500" />
      </span>
    </button>,
    
    // 编辑按钮
    <button 
      key="edit"
      className="relative p-1.5 hover:bg-green-900 hover:bg-opacity-20 transition-colors border border-green-500 border-opacity-30 transform skew-x-12 overflow-hidden"
      onClick={onEdit}
      title={t('edit', messageActionsTranslations)}
      disabled={isEditing}
      style={{ clipPath: 'polygon(10% 0%, 100% 0%, 90% 100%, 0% 100%)' }}
    >
      <span className="flex items-center justify-center transform -skew-x-12">
        <Edit size={14} className={`${isEditing ? 'text-green-800' : 'text-green-500'}`} />
      </span>
    </button>,
    
    // 删除按钮
    <button 
      key="delete"
      className="relative p-1.5 hover:bg-red-900 hover:bg-opacity-20 transition-colors border border-red-500 border-opacity-30 transform skew-x-12 overflow-hidden"
      onClick={onDelete}
      title={t('delete', messageActionsTranslations)}
      style={{ clipPath: 'polygon(10% 0%, 100% 0%, 90% 100%, 0% 100%)' }}
    >
      <span className="flex items-center justify-center transform -skew-x-12">
        <Trash size={14} className="text-green-500 hover:text-red-400" />
      </span>
    </button>
  ];
  
  // 用户消息添加重新提交按钮
  if (!isAI && onResend) {
    buttons.push(
      <button 
        key="resend"
        className="relative p-1.5 hover:bg-green-900 hover:bg-opacity-20 transition-colors border border-green-500 border-opacity-30 transform skew-x-12 overflow-hidden"
        onClick={onResend}
        title={t('resend', messageActionsTranslations)}
        style={{ clipPath: 'polygon(10% 0%, 100% 0%, 90% 100%, 0% 100%)' }}
      >
        <span className="flex items-center justify-center transform -skew-x-12">
          <Send size={14} className="text-green-500" />
        </span>
      </button>
    );
  }
  
  return (
    <div className="flex items-center gap-3">
      {buttons}
    </div>
  );
};

export default MessageActions; 