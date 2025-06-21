import React, { useState } from 'react';
import { PromptPreset } from '../../types';

interface SavePresetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string, description: string, author: string) => void;
}

const SavePresetModal: React.FC<SavePresetModalProps> = ({ 
  isOpen, 
  onClose, 
  onSave 
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [author, setAuthor] = useState('');
  const [error, setError] = useState('');

  // 黑客帝国风格样式
  const bgColor = 'bg-black';
  const textColor = 'text-green-400';
  const overlayBgColor = 'bg-black bg-opacity-80 backdrop-blur-sm';
  const borderColor = 'border-green-500 border-opacity-60';
  const inputBgColor = 'bg-black bg-opacity-80';
  const inputBorderColor = 'border-green-500 border-opacity-50';
  const placeholderColor = 'placeholder-green-500 placeholder-opacity-50';
  const buttonHoverBg = 'hover:bg-green-500 hover:bg-opacity-20';

  // 处理提交
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 验证名称不能为空
    if (!name.trim()) {
      setError('预设名称不能为空');
      return;
    }
    
    // 清除错误
    setError('');
    
    // 调用保存回调
    onSave(name, description, author);
    
    // 重置表单
    setName('');
    setDescription('');
    setAuthor('');
    
    // 关闭模态框
    onClose();
  };

  // 如果模态框未打开，则不渲染任何内容
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* 背景遮罩 */}
      <div 
        className={`fixed inset-0 ${overlayBgColor}`}
        onClick={onClose}
      />
      
      {/* 模态框内容 */}
      <div className={`${bgColor} ${textColor} border ${borderColor} p-6 rounded-md w-full max-w-md relative z-10 overflow-hidden`}>
        {/* 电子矩阵背景效果 */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="matrix-bg h-full w-full"></div>
        </div>
        
        {/* 电子边框效果 */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="electronic-border"></div>
        </div>
        
        {/* 标题 */}
        <div className="text-xl font-mono mb-4 relative z-10 flex items-center">
          <span className="animate-pulse mr-2">&gt;</span>
          <span className="tracking-wider">保存提示词预设</span>
        </div>
        
        {/* 表单 */}
        <form onSubmit={handleSubmit} className="relative z-10">
          {/* 预设名称 */}
          <div className="mb-4">
            <label htmlFor="preset-name" className="block text-sm font-mono mb-2 tracking-wider">
              预设名称 <span className="text-red-400">*</span>
            </label>
            <input
              id="preset-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`w-full ${inputBgColor} ${textColor} ${placeholderColor} border ${inputBorderColor} p-2 rounded-md focus:ring-1 focus:ring-green-500 focus:outline-none font-mono tracking-wide`}
              placeholder="输入预设名称..."
            />
          </div>
          
          {/* 描述 */}
          <div className="mb-4">
            <label htmlFor="preset-description" className="block text-sm font-mono mb-2 tracking-wider">
              预设描述
            </label>
            <textarea
              id="preset-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={`w-full ${inputBgColor} ${textColor} ${placeholderColor} border ${inputBorderColor} p-2 rounded-md focus:ring-1 focus:ring-green-500 focus:outline-none font-mono tracking-wide h-24 resize-none`}
              placeholder="输入预设描述..."
            />
          </div>
          
          {/* 作者 */}
          <div className="mb-4">
            <label htmlFor="preset-author" className="block text-sm font-mono mb-2 tracking-wider">
              作者
            </label>
            <input
              id="preset-author"
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className={`w-full ${inputBgColor} ${textColor} ${placeholderColor} border ${inputBorderColor} p-2 rounded-md focus:ring-1 focus:ring-green-500 focus:outline-none font-mono tracking-wide`}
              placeholder="输入作者名称..."
            />
          </div>
          
          {/* 错误提示 */}
          {error && (
            <div className="mb-4 text-red-400 text-sm font-mono">
              {error}
            </div>
          )}
          
          {/* 按钮组 */}
          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className={`px-4 py-2 border ${borderColor} rounded-md ${buttonHoverBg} transition-all duration-300 font-mono tracking-wider`}
            >
              取消
            </button>
            <button
              type="submit"
              className={`px-4 py-2 bg-green-500 bg-opacity-20 border ${borderColor} rounded-md ${buttonHoverBg} transition-all duration-300 font-mono tracking-wider`}
            >
              保存
            </button>
          </div>
        </form>
      </div>
      
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
        
        .electronic-border {
          background: 
            linear-gradient(90deg, rgba(0, 255, 65, 0.3) 0%, transparent 50%, rgba(0, 255, 65, 0.3) 100%),
            linear-gradient(180deg, rgba(0, 255, 65, 0.3) 0%, transparent 50%, rgba(0, 255, 65, 0.3) 100%);
          background-size: 100% 1px, 1px 100%;
          background-repeat: no-repeat;
          background-position: 0 0, 0 0;
          animation: border-scan 3s linear infinite;
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
      `}</style>
    </div>
  );
};

export default SavePresetModal; 