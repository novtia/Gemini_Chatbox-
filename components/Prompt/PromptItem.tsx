import React, { useState } from "react";
import { Edit3, Trash2, GripVertical, Lock, MessageSquare, User, History, ChevronUp, ChevronDown } from "lucide-react";
import { ChatMessage } from "../../types";

// 临时组件实现
interface ButtonProps {
  children: React.ReactNode;
  className?: string;
  variant?: string;
  size?: string;
  onClick?: (e: React.MouseEvent) => void;
  title?: string;
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({ children, className, variant, size, onClick, title, disabled = false }) => (
  <button 
    className={className}
    onClick={onClick}
    title={title}
    disabled={disabled}
  >
    {children}
  </button>
);

interface InputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  className?: string;
}

const Input: React.FC<InputProps> = ({ value, onChange, placeholder, className }) => (
  <input
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    className={className}
  />
);

interface PromptItemProps {
  prompt: ChatMessage;
  theme?: string;
  fontSize?: string;
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

const PromptItem: React.FC<PromptItemProps> = ({
  prompt,
  theme = "dark",
  fontSize = "medium",
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
  // 添加悬停状态
  const [showDragHandle, setShowDragHandle] = useState(false);

  // 黑客帝国风格样式
  const bgColor = 'bg-black';
  const textColor = 'text-green-400';
  const inputBgColor = 'bg-black bg-opacity-80 backdrop-blur-sm';
  const inputBorderColor = 'border-green-500 border-opacity-50';
  const placeholderColor = 'placeholder-green-500 placeholder-opacity-50';
  const dragOverBg = 'bg-green-500 bg-opacity-20';
  const systemPromptBg = 'bg-blue-900/20 border-blue-500/30';
  const userInputBg = 'bg-green-900/20 border-green-500/30';
  const historyPromptBg = 'bg-purple-900/20 border-purple-500/30';
  const modelRoleBg = 'bg-amber-900/20 border-amber-500/30';
  const userRoleBg = 'bg-cyan-900/20 border-cyan-500/30';
  
  // 根据字体大小设置样式
  const fontSizeClass = fontSize === 'small' ? 'text-xs' : fontSize === 'medium' ? 'text-sm' : 'text-base';

  // 获取提示词的图标和背景色
  const getPromptIconAndStyle = (prompt: ChatMessage) => {
    if (prompt.isSystem) {
      return {
        icon: <MessageSquare className="w-4 h-4" />,
        bgClass: systemPromptBg,
        label: '系统'
      };
    } else if (prompt.isUserInput) {
      return {
        icon: <User className="w-4 h-4" />,
        bgClass: userInputBg,
        label: '用户输入'
      };
    } else if (prompt.isHistory) {
      return {
        icon: <History className="w-4 h-4" />,
        bgClass: historyPromptBg,
        label: '历史记录'
      };
    } else if (prompt.isModelRole) {
      return {
        icon: <MessageSquare className="w-4 h-4 text-amber-400" />,
        bgClass: modelRoleBg,
        label: '模型人设'
      };
    } else if (prompt.isUserRole) {
      return {
        icon: <User className="w-4 h-4 text-cyan-400" />,
        bgClass: userRoleBg,
        label: '用户人设'
      };
    } else if (prompt.isMainPrompt) {
      return {
        icon: <User className="w-4 h-4 text-red-400" />,
        bgClass: 'bg-red-900/20 border-red-500/30',
        label: '主提示词'
      };
    } else {
      return {
        icon: prompt.role === 'user' ? <User className="w-4 h-4" /> : <MessageSquare className="w-4 h-4" />,
        bgClass: '',
        label: prompt.role === 'user' ? '用户' : '模型'
      };
    }
  };

  // 处理历史记录内容的特殊显示
  const renderHistoryContent = () => {
    if (!prompt.isHistory || !prompt.parts[0]?.text) return null;
    
    // 定义消息接口，匹配 ChatMessage 接口
    interface HistoryMessage {
      role: 'user' | 'model' | 'error';
      parts: { text: string }[];
    }
    
    let messages: HistoryMessage[] = [];
    try {
      // 尝试解析JSON格式的历史记录
      messages = JSON.parse(prompt.parts[0].text);
    } catch (error) {
      console.error("解析历史记录JSON失败:", error);
      return (
        <div className="mt-2 pt-2 border-t border-gray-700">
          <div className={`${fontSizeClass} text-red-500`}>
            解析历史记录失败，格式可能不正确
          </div>
        </div>
      );
    }
    
    return (
      <div className="mt-2 pt-2 border-t border-gray-700">
        <div className={`${fontSizeClass} text-gray-400 mb-2 text-xs flex items-center justify-between`}>
          <span>历史对话记录</span>
          <span className="px-1.5 py-0.5 rounded bg-gray-800/70 text-gray-300">{messages.length} 条消息</span>
        </div>
        <div className="max-h-80 overflow-y-auto pr-1 custom-scrollbar">
          {messages.length > 0 ? (
            messages.map((msg, index) => {
              // 提取角色信息
              const isUser = msg.role === 'user';
              // 从 parts 数组中获取文本内容
              const messageContent = msg.parts && msg.parts[0] ? msg.parts[0].text : '';
              
              return (
                <div 
                  key={index} 
                  className={`p-2 rounded-md mb-2 transition-opacity group
                    ${isUser 
                      ? (theme === 'light' ? 'bg-green-100/30 border border-green-200/50' : 'bg-green-900/20 border border-green-800/30') 
                      : (theme === 'light' ? 'bg-blue-100/30 border border-blue-200/50' : 'bg-blue-900/20 border border-blue-800/30')
                    }`}
                >
                  <div className="flex items-start gap-2">
                    <span className="text-lg flex-shrink-0 mt-0.5">
                      {isUser ? <User className="w-4 h-4" /> : <MessageSquare className="w-4 h-4" />}
                    </span>
                    <div className={`${fontSizeClass} whitespace-pre-wrap break-words ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'} flex-1`}>
                      {messageContent}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-4 text-center">
              <div className={`${theme === 'light' ? 'text-gray-500' : 'text-gray-400'} ${fontSizeClass}`}>
                暂无历史对话记录
              </div>
              <div className={`${theme === 'light' ? 'text-gray-400' : 'text-gray-500'} text-xs mt-2`}>
                开始新的对话后，历史记录将会显示在这里
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  // 添加开关样式类
  const toggleBgColor = theme === 'light' 
    ? (prompt.enabled ? 'bg-green-500' : 'bg-gray-300') 
    : (prompt.enabled ? 'bg-green-600' : 'bg-gray-600');

  // 获取提示词样式
  const { icon, bgClass } = getPromptIconAndStyle(prompt);

  return (
    <div 
      className={`${inputBgColor} ${bgClass} border ${inputBorderColor} p-2.5 mb-2.5 relative overflow-hidden
        ${!prompt.enabled ? 'opacity-60' : ''} 
        ${draggedItemId === prompt.id ? 'opacity-50' : ''} 
        ${dragOverItemId === prompt.id ? dragOverBg : ''} 
        transition-all duration-300 hover:shadow-lg hover:shadow-green-500/20
        clip-path-polygon`}
      draggable={true}
      onDragStart={(e) => onDragStart(e, prompt.id)}
      onDragEnd={onDragEnd}
      onDragOver={(e) => onDragOver(e, prompt.id)}
      onDragLeave={onDragLeave}
      onDrop={(e) => onDrop(e, prompt.id)}
      onClick={() => onToggleExpand(prompt.id)}
      onMouseEnter={() => setShowDragHandle(true)}
      onMouseLeave={() => setShowDragHandle(false)}
    >
      {/* 电子矩阵背景效果 */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="matrix-bg h-full w-full"></div>
      </div>
      
      {/* 电子边框效果 */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="electronic-border"></div>
      </div>
      
      <div className="flex items-center gap-2 relative z-10">
        {/* 拖拽手柄 - 悬停时显示 */}
        <div 
          className={`cursor-move flex-shrink-0 text-green-500 hover:text-green-400 transition-all duration-300 ${showDragHandle ? 'opacity-100' : 'opacity-0'}`}
          title="拖拽排序"
        >
          <GripVertical className="w-4 h-4" />
        </div>
        
        <div className="flex-shrink-0 text-green-400">
          {icon}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center">
            {prompt.isHistory ? (
              <span className={`${fontSizeClass} font-mono font-medium truncate tracking-wider`}>
                {prompt.name}
              </span>
            ) : (
              <Input
                value={prompt.name}
                onChange={() => {}} // 只读
                placeholder="提示词名称"
                className={`w-full bg-transparent border-none ${textColor} ${placeholderColor} focus:ring-0 focus:outline-none p-0 ${fontSizeClass} font-mono truncate cursor-pointer tracking-wider`}
              />
            )}
          </div>
        </div>
        
        {/* 普通提示词控制按钮 - 不为系统提示词、用户输入、历史记录、模型人设和用户人设显示 */}
        {!prompt.isSystem && !prompt.isUserInput && !prompt.isHistory && !prompt.isModelRole && !prompt.isUserRole && (
          <>
            {/* 移除按钮 */}
            <Button
              variant="ghost"
              size="sm"
              className="electronic-button text-green-400 hover:text-green-300 p-1 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/30"
              title="从队列中移除"
              onClick={(e) => {
                e.stopPropagation();
                onRemoveFromQueue(prompt.id);
              }}
            >
              <Trash2 className="w-4 h-4 relative z-10" />
            </Button>
            
            {/* 编辑按钮 */}
            <Button
              variant="ghost"
              size="sm"
              className="electronic-button text-green-400 hover:text-green-300 p-1 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/30"
              title="编辑提示词"
              onClick={(e) => {
                e.stopPropagation();
                onEditClick(prompt);
              }}
            >
              <Edit3 className="w-4 h-4 relative z-10" />
            </Button>
            
            {/* 启用/禁用开关 - 电子化设计 */}
            <div 
              className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer transition-all duration-300 ease-in-out overflow-hidden
                ${prompt.enabled ? 'bg-green-600 shadow-lg shadow-green-500/30' : 'bg-gray-600'}
                clip-path-polygon`}
              onClick={(e) => {
                e.stopPropagation();
                onToggleEnabled(prompt.id);
              }}
              title={prompt.enabled ? "禁用此提示词" : "启用此提示词"}
              style={{
                clipPath: 'polygon(0 0, calc(100% - 3px) 0, 100% 3px, 100% 100%, 3px 100%, 0 calc(100% - 3px))'
              }}
            >
              {/* 电子开关背景 - 无动画 */}
              <div className="absolute inset-0 opacity-30">
                <div className="switch-bg-static h-full w-full"></div>
              </div>
              
              {/* 开关滑块 */}
              <span 
                className={`pointer-events-none inline-block h-4 w-4 transform bg-white shadow-lg ring-0 transition duration-300 ease-in-out relative z-10
                  ${prompt.enabled ? 'translate-x-4' : 'translate-x-0.5'}`}
                style={{ 
                  margin: '2px 0',
                  clipPath: 'polygon(0 0, calc(100% - 2px) 0, 100% 2px, 100% 100%, 2px 100%, 0 calc(100% - 2px))'
                }}
              />
              
              {/* 激活状态的静态效果 */}
              {prompt.enabled && (
                <div className="absolute inset-0 opacity-50">
                  <div className="switch-static h-full w-full"></div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
      
      {/* 展开的内容 */}
      {expandedPromptId === prompt.id && (
        <div className="relative z-10">
          {prompt.isHistory ? renderHistoryContent() : (
            <div className="mt-2 pt-2 border-t border-green-500 border-opacity-30">
              <div className={`${fontSizeClass} whitespace-pre-wrap break-words text-green-300 font-mono`}>
                {prompt.parts[0]?.text || '(无内容)'}
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* CSS样式 */}
      <style jsx>{`
        .clip-path-polygon {
          clip-path: polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px);
        }
        
        .matrix-bg {
          background-image: 
            linear-gradient(90deg, transparent 90%, rgba(0, 255, 65, 0.1) 95%, transparent 100%),
            linear-gradient(180deg, transparent 90%, rgba(0, 255, 65, 0.1) 95%, transparent 100%),
            linear-gradient(45deg, transparent 95%, rgba(0, 255, 65, 0.05) 100%),
            linear-gradient(-45deg, transparent 95%, rgba(0, 255, 65, 0.05) 100%);
          background-size: 6px 6px, 6px 6px, 12px 12px, 12px 12px;
          animation: matrix-scroll 8s linear infinite, matrix-pulse 4s ease-in-out infinite;
        }
        
        .electronic-border {
          background: 
            linear-gradient(90deg, rgba(0, 255, 65, 0.3) 0%, transparent 50%, rgba(0, 255, 65, 0.3) 100%),
            linear-gradient(180deg, rgba(0, 255, 65, 0.3) 0%, transparent 50%, rgba(0, 255, 65, 0.3) 100%);
          background-size: 100% 1px, 1px 100%;
          background-repeat: no-repeat;
          background-position: 0 0, 0 0;
          animation: border-scan 3s linear infinite;
        }
        
        @keyframes matrix-scroll {
          0% { background-position: 0 0, 0 0, 0 0, 0 0; }
          100% { background-position: 6px 6px, 6px 6px, 12px 12px, -12px 12px; }
        }
        
        @keyframes matrix-pulse {
          0%, 100% { opacity: 0.8; }
          50% { opacity: 1; }
        }
        
        @keyframes border-scan {
          0% { 
            background-position: -100% 0, 0 -100%;
            opacity: 0.3;
          }
          25% { 
            background-position: 0% 0, 0 0%;
            opacity: 0.8;
          }
          50% { 
            background-position: 100% 0, 0 100%;
            opacity: 1;
          }
          75% { 
            background-position: 200% 0, 0 200%;
            opacity: 0.8;
          }
          100% { 
            background-position: 300% 0, 0 300%;
            opacity: 0.3;
          }
        }
        
        /* 电子化按钮效果 */
        .electronic-button {
          position: relative;
          background: linear-gradient(135deg, rgba(0, 255, 65, 0.1) 0%, rgba(0, 255, 65, 0.05) 100%);
          border: 1px solid rgba(0, 255, 65, 0.3);
          clip-path: polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 4px 100%, 0 calc(100% - 4px));
        }
        
        .electronic-button::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(45deg, transparent 30%, rgba(0, 255, 65, 0.1) 50%, transparent 70%);
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        
        .electronic-button:hover::before {
          opacity: 1;
          animation: scan-line 0.6s ease-in-out;
        }
        
        @keyframes scan-line {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        /* 电子开关背景效果 - 静态版本 */
        .switch-bg-static {
          background-image: 
            linear-gradient(90deg, transparent 80%, rgba(0, 255, 65, 0.2) 90%, transparent 100%),
            linear-gradient(45deg, transparent 90%, rgba(0, 255, 65, 0.1) 100%);
          background-size: 4px 4px, 8px 8px;
        }
        
        /* 静态激活效果 */
        .switch-static {
          background: linear-gradient(90deg, 
            transparent 0%, 
            rgba(0, 255, 65, 0.3) 20%, 
            rgba(0, 255, 65, 0.6) 50%, 
            rgba(0, 255, 65, 0.3) 80%, 
            transparent 100%);
          background-size: 200% 100%;
          background-position: 0% 0;
        }
      `}</style>
    </div>
  );
};

export default PromptItem;
