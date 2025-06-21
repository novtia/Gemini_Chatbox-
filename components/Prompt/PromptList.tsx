import React, { useMemo } from "react";
import { ChatMessage } from "../../types";
import PromptItem from "./PromptItem";

interface PromptListProps {
  theme?: string;
  fontSize?: string;
  queuedPrompts: ChatMessage[];
  expandedPromptId: string | null;
  onToggleExpand: (promptId: string) => void;
  onRemoveFromQueue: (promptId: string) => void;
  onToggleEnabled: (promptId: string) => void;
  onEditClick: (prompt: ChatMessage) => void;
  draggedItemId: string | null;
  dragOverItemId: string | null;
  onDragStart: (e: React.DragEvent<HTMLDivElement>, promptId: string) => void;
  onDragEnd: () => void;
  onDragOver: (e: React.DragEvent<HTMLDivElement>, promptId: string) => void;
  onDragLeave: () => void;
  onDrop: (e: React.DragEvent<HTMLDivElement>, promptId: string) => void;
}

// 简单的token估算函数 - 使用空格和标点符号分割，每个中文字符算一个token
const estimateTokenCount = (text: string): number => {
  if (!text) return 0;
  
  // 中文字符计数
  const chineseChars = text.match(/[\u4e00-\u9fa5]/g) || [];
  
  // 英文单词和标点符号计数
  const nonChineseText = text.replace(/[\u4e00-\u9fa5]/g, '');
  const nonChineseTokens = nonChineseText
    .split(/\s+|[.,!?;:'"()\[\]{}]/g)
    .filter(token => token.length > 0);
  
  return chineseChars.length + nonChineseTokens.length;
};

// 从ChatMessage获取文本内容的辅助函数
const getPromptText = (prompt: ChatMessage): string => {
  return prompt.parts[0]?.text || '';
};

const PromptList: React.FC<PromptListProps> = ({
  theme = "dark",
  fontSize = "medium",
  queuedPrompts,
  expandedPromptId,
  onToggleExpand,
  onRemoveFromQueue,
  onToggleEnabled,
  onEditClick,
  draggedItemId,
  dragOverItemId,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDragLeave,
  onDrop
}) => {
  // 黑客帝国风格样式
  const headerTextColor = 'text-green-300';
  const counterTextColor = 'text-green-400';
  const inputBgColor = 'bg-black bg-opacity-80 backdrop-blur-sm';
  const inputBorderColor = 'border-green-500 border-opacity-50';
  
  // 根据字体大小设置样式
  const fontSizeClass = fontSize === 'small' ? 'text-xs' : fontSize === 'medium' ? 'text-sm' : 'text-base';

  // 计算所有提示词的总token数
  const totalTokenCount = useMemo(() => {
    return queuedPrompts
      .filter(prompt => prompt.enabled !== false) // 只计算启用的提示词
      .reduce((total, prompt) => total + estimateTokenCount(getPromptText(prompt)), 0);
  }, [queuedPrompts]);
  
  // 提示词排序列表
  const promptsList = useMemo(() => {
    return queuedPrompts.map(p => p.id);
  }, [queuedPrompts]);

  return (
    <div className="flex-1 overflow-y-auto p-3 custom-scrollbar relative z-10">
      {/* Content Header */}
      <div className="flex items-center justify-between mb-3 border-b border-green-500 border-opacity-30 pb-2">
        <span className={`${headerTextColor} ${fontSizeClass} font-mono font-medium tracking-wider`}>
          <span className="animate-pulse">&gt;</span> PROMPT_QUEUE
        </span>
        <div className="flex items-center gap-2">
          <span className={`${counterTextColor} ${fontSize === 'small' ? 'text-xs' : 'text-xs'} font-mono px-2 py-1 rounded border border-green-500 border-opacity-30 bg-black bg-opacity-50`}>
            TOKEN: {totalTokenCount}
          </span>
        </div>
      </div>

      {/* 提示词列表 */}
      {queuedPrompts.map(prompt => (
        <PromptItem
          key={prompt.id}
          prompt={prompt}
          theme={theme}
          fontSize={fontSize}
          expandedPromptId={expandedPromptId}
          onToggleExpand={onToggleExpand}
          onRemoveFromQueue={onRemoveFromQueue}
          onToggleEnabled={onToggleEnabled}
          onEditClick={onEditClick}
          draggedItemId={draggedItemId}
          dragOverItemId={dragOverItemId}
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
        />
      ))}

      {/* 空状态提示 */}
      {queuedPrompts.length === 0 && (
        <div className={`${inputBgColor} rounded-md border ${inputBorderColor} p-4 text-center relative overflow-hidden`}>
          <div className="absolute inset-0 opacity-20">
            <div className="matrix-bg h-full w-full"></div>
          </div>
          <p className={`${counterTextColor} font-mono tracking-wider relative z-10`}>
            <span className="animate-pulse">&gt;</span> QUEUE_EMPTY
          </p>
          <p className={`${counterTextColor} text-xs mt-1 font-mono opacity-70 relative z-10`}>
            SELECT_PROMPT &amp;&amp; INSERT_TO_QUEUE
          </p>
        </div>
      )}
      
      {/* CSS样式 */}
      <style jsx>{`
        .matrix-bg {
          background-image: 
            linear-gradient(90deg, transparent 98%, rgba(0, 255, 65, 0.03) 100%),
            linear-gradient(180deg, transparent 98%, rgba(0, 255, 65, 0.03) 100%);
          background-size: 10px 10px;
          animation: matrix-scroll 15s linear infinite;
        }
        
        @keyframes matrix-scroll {
          0% { background-position: 0 0; }
          100% { background-position: 10px 10px; }
        }
      `}</style>
    </div>
  );
};

export default PromptList;
