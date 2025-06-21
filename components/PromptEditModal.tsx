import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { ChatMessage } from '../types';

interface PromptEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (prompt: ChatMessage) => void;
  prompt: ChatMessage | null; // 如果为null则表示创建新提示词
  theme?: string;
  fontSize?: string;
}

// 生成唯一ID
const generateId = () => `prompt-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

const PromptEditModal: React.FC<PromptEditModalProps> = ({
  isOpen,
  onClose,
  onSave,
  prompt,
  theme = 'dark',
  fontSize = 'medium'
}) => {
  const [name, setName] = useState('');
  const [role, setRole] = useState<'user' | 'model'>('user');
  const [content, setContent] = useState('');
  const [isInQueue, setIsInQueue] = useState(false); // 默认不添加到队列

  // 当prompt变化时更新表单
  useEffect(() => {
    if (prompt) {
      setName(prompt.name || '');
      setRole(prompt.role === 'error' ? 'user' : prompt.role);
      setContent(prompt.parts[0]?.text || '');
      setIsInQueue(prompt.isInQueue || false);
    } else {
      // 创建新提示词时的默认值
      setName('');
      setRole('user');
      setContent('');
      setIsInQueue(false); // 确保新提示词默认不添加到队列
    }
  }, [prompt, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const updatedPrompt: ChatMessage = {
      id: prompt?.id || generateId(),
      name,
      role,
      parts: [{ text: content }],
      timestamp: prompt?.timestamp || new Date(),
      enabled: true,
      isInQueue,
      isMainPrompt: prompt?.isMainPrompt || false
    };
    
    onSave(updatedPrompt);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* 矩阵风格背景遮罩 */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-80 backdrop-blur-sm" 
        onClick={onClose}
        style={{
          background: 'radial-gradient(circle at center, rgba(0, 255, 0, 0.1) 0%, rgba(0, 0, 0, 0.9) 100%)'
        }}
      >
        {/* 矩阵雨效果背景 */}
        <div className="absolute inset-0 opacity-10">
          <div className="w-full h-full bg-gradient-to-b from-transparent via-green-400 to-transparent animate-pulse"></div>
        </div>
      </div>
      
      {/* 弹窗内容 - 矩阵风格 */}
      <div className="bg-black bg-opacity-90 border border-green-500 border-opacity-50 rounded-lg shadow-2xl shadow-green-500/20 w-full max-w-md mx-4 z-10 backdrop-blur-sm relative overflow-hidden group">
        {/* 矩阵效果背景 */}
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div className="w-full h-full bg-gradient-to-r from-transparent via-green-400 to-transparent animate-pulse"></div>
        </div>
        
        {/* 活跃边框效果 */}
        <div className="absolute inset-0 border border-green-400 rounded-lg animate-pulse opacity-30"></div>
        
        {/* 标题栏 */}
        <div className="flex justify-between items-center p-4 border-b border-green-500 border-opacity-30 relative z-10">
          <h3 className="text-xl font-mono font-bold text-green-300 tracking-wider">
            <span className="text-green-400">&gt;</span> {prompt ? 'EDIT_PROMPT' : 'CREATE_PROMPT'}
          </h3>
          <button 
            onClick={onClose}
            className="text-green-500 hover:text-green-300 transition-colors duration-300 hover:rotate-90 transform"
          >
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4 space-y-4 relative z-10">
          {/* 名称输入 */}
          <div className="space-y-2">
            <label htmlFor="prompt-name" className="block text-sm font-mono font-medium text-green-400 tracking-wider">
              <span className="text-green-500">&gt;</span> NAME_FIELD
            </label>
            <input
              id="prompt-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 rounded-md bg-black bg-opacity-60 border border-green-500 border-opacity-30 text-green-300 font-mono focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 placeholder-green-600 backdrop-blur-sm transition-all duration-300 hover:border-green-400"
              placeholder="输入提示词名称..."
              required
            />
          </div>
          
          {/* 角色选择 */}
          <div className="space-y-2">
            <label htmlFor="prompt-role" className="block text-sm font-mono font-medium text-green-400 tracking-wider">
              <span className="text-green-500">&gt;</span> ROLE_SELECT
            </label>
            <select
              id="prompt-role"
              value={role}
              onChange={(e) => setRole(e.target.value as 'user' | 'model')}
              className="w-full px-3 py-2 rounded-md bg-black bg-opacity-60 border border-green-500 border-opacity-30 text-green-300 font-mono focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 backdrop-blur-sm transition-all duration-300 hover:border-green-400"
            >
              <option value="user" className="bg-black text-green-300">USER_ROLE</option>
              <option value="model" className="bg-black text-green-300">MODEL_ROLE</option>
            </select>
          </div>
          
          {/* 内容输入 */}
          <div className="space-y-2">
            <label htmlFor="prompt-content" className="block text-sm font-mono font-medium text-green-400 tracking-wider">
              <span className="text-green-500">&gt;</span> CONTENT_DATA
            </label>
            <textarea
              id="prompt-content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full px-3 py-2 rounded-md bg-black bg-opacity-60 border border-green-500 border-opacity-30 text-green-300 font-mono focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 placeholder-green-600 backdrop-blur-sm transition-all duration-300 hover:border-green-400 min-h-[120px] resize-none"
              placeholder="输入提示词内容..."
              required
            />
          </div>
          
          {/* 是否加入队列 */}
          <div className="flex items-center space-x-3 p-2 rounded border border-green-500 border-opacity-20 bg-green-500 bg-opacity-5">
            <input
              id="prompt-in-queue"
              type="checkbox"
              checked={isInQueue}
              onChange={(e) => setIsInQueue(e.target.checked)}
              className="w-4 h-4 text-green-400 bg-black border-green-500 rounded focus:ring-green-400 focus:ring-2"
            />
            <label htmlFor="prompt-in-queue" className="text-sm font-mono text-green-400 tracking-wider">
              <span className="text-green-500">&gt;</span> ADD_TO_QUEUE
            </label>
          </div>
          
          {/* 按钮组 */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-md bg-black bg-opacity-60 border border-green-500 border-opacity-30 text-green-400 font-mono hover:bg-green-500 hover:bg-opacity-10 hover:border-green-400 hover:text-green-300 transition-all duration-300 backdrop-blur-sm"
            >
              CANCEL
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-md bg-green-500 bg-opacity-20 border border-green-400 text-green-300 font-mono hover:bg-green-500 hover:bg-opacity-30 hover:text-green-200 transition-all duration-300 backdrop-blur-sm shadow-lg shadow-green-500/20"
            >
              SAVE_DATA
            </button>
          </div>
        </form>
        
        {/* 扫描线效果 */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-green-400 to-transparent opacity-0 group-hover:opacity-10 transition-opacity duration-300 transform -skew-x-12 pointer-events-none"></div>
      </div>
      
      {/* CSS样式 */}
      <style jsx>{`
        @keyframes matrix-fade-in {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        
        .group {
          animation: matrix-fade-in 0.3s ease-out forwards;
        }
        
        input:focus, textarea:focus, select:focus {
          box-shadow: 0 0 0 2px rgba(34, 197, 94, 0.3), 0 0 20px rgba(34, 197, 94, 0.1);
        }
        
        button:hover {
          box-shadow: 0 0 15px rgba(34, 197, 94, 0.2);
        }
      `}</style>
    </div>
  );
};

export default PromptEditModal;
