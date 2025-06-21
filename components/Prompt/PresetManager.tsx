import React, { useState, useRef } from 'react';
import { PromptPreset, ChatMessage } from '../../types';
import { Download, Upload, Save, FileUp, MoreHorizontal } from 'lucide-react';

// 临时组件实现
interface ButtonProps {
  children: React.ReactNode;
  className?: string;
  variant?: string;
  size?: string;
  onClick?: () => void;
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

// 修复Select组件接口定义
interface SelectProps {
  children: React.ReactNode;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  className?: string;
  defaultValue?: string;
}

const Select: React.FC<SelectProps> = ({ children, value, onChange, className, defaultValue = "" }) => (
  <select value={value} onChange={onChange} className={className} defaultValue={defaultValue}>
    {children}
  </select>
);

interface PresetManagerProps {
  theme?: string;
  fontSize?: string;
  presets: PromptPreset[];
  activePresetId: string;
  promptCollection: ChatMessage[];
  queuedPromptsIds: string[];
  onChangePreset: (presetId: string) => void;
  onSaveClick: () => void;
  onImportPreset: (file: File) => Promise<void>;
  onExportPreset: (presetId: string) => void;
}

const PresetManager: React.FC<PresetManagerProps> = ({
  theme = 'dark',
  fontSize = 'medium',
  presets,
  activePresetId,
  promptCollection,
  queuedPromptsIds,
  onChangePreset,
  onSaveClick,
  onImportPreset,
  onExportPreset
}) => {
  // 状态
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 黑客帝国风格样式
  const bgColor = 'bg-black';
  const textColor = 'text-green-400';
  const headerTextColor = 'text-green-300';
  const toolbarBgColor = 'bg-black bg-opacity-80 backdrop-blur-sm';
  const selectBgColor = 'bg-black';
  const selectBorderColor = 'border-green-500 border-opacity-50';
  const buttonHoverBg = 'hover:bg-green-500 hover:bg-opacity-20';

  // 获取当前选中的预设
  const activePreset = presets.find(p => p.id === activePresetId);
  
  // 处理预设变更
  const handlePresetChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChangePreset(e.target.value);
  };
  
  // 处理导入按钮点击
  const handleImportClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  // 处理文件选择
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      
      // 检查文件类型
      if (file.type !== 'application/json' && !file.name.endsWith('.json')) {
        alert('请上传JSON格式的预设文件');
        return;
      }
      
      // 调用导入函数
      try {
        await onImportPreset(file);
      } catch (error) {
        alert(`导入失败: ${error.message}`);
      }
      
      // 重置文件输入
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };
  
  // 处理导出按钮点击
  const handleExportClick = () => {
    if (activePresetId) {
      onExportPreset(activePresetId);
    } else {
      alert('请先选择一个预设');
    }
  };

  return (
    <div className={`flex flex-col gap-2 p-2 ${toolbarBgColor} border-b border-green-500 border-opacity-30 relative z-10`}>
      {/* 电子矩阵背景效果 */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="matrix-bg h-full w-full"></div>
      </div>
      
      {/* 当前预设显示 */}
      <div className={`${headerTextColor} font-mono text-sm mb-1 flex items-center justify-between`}>
        <div className="flex items-center">
          <span className="animate-pulse mr-2">&gt;</span>
          <span className="tracking-wider">当前预设: </span>
          <span className={`ml-2 ${activePreset ? textColor : 'text-gray-500'}`}>
            {activePreset ? activePreset.name : '未选择预设'}
          </span>
        </div>
        
        {activePreset && (
          <div className="text-xs opacity-70">
            <span>作者: {activePreset.author || '匿名'}</span>
          </div>
        )}
      </div>
      
      {/* 预设选择和按钮行 */}
      <div className="flex items-center gap-2">
        {/* 预设下拉选择 */}
        <Select 
          value={activePresetId} 
          onChange={handlePresetChange}
          className={`${selectBgColor} border ${selectBorderColor} ${textColor} font-mono flex-1 p-1.5 rounded-md transition-all duration-300 hover:shadow-lg hover:shadow-green-500/20 focus:shadow-lg focus:shadow-green-500/20 text-sm`}
        >
          <option value="" className="bg-black text-green-400">选择提示词预设</option>
          {presets.map(preset => (
            <option key={preset.id} value={preset.id} className="bg-black text-green-400">
              {preset.name}
            </option>
          ))}
        </Select>
        
        {/* 操作按钮组 */}
        <div className="flex items-center gap-1">
          {/* 导入按钮 */}
          <Button
            variant="ghost"
            size="sm"
            className={`${headerTextColor} font-mono p-1.5 rounded border border-green-500 border-opacity-30 ${buttonHoverBg} transition-all duration-300 hover:shadow-lg hover:shadow-green-500/20`}
            title="导入预设"
            onClick={handleImportClick}
          >
            <FileUp className="w-4 h-4" />
          </Button>
          
          {/* 导出按钮 */}
          <Button
            variant="ghost"
            size="sm"
            className={`${headerTextColor} font-mono p-1.5 rounded border border-green-500 border-opacity-30 ${buttonHoverBg} transition-all duration-300 hover:shadow-lg hover:shadow-green-500/20 ${!activePresetId ? 'opacity-50 cursor-not-allowed' : ''}`}
            title="导出当前预设"
            onClick={handleExportClick}
            disabled={!activePresetId}
          >
            <Download className="w-4 h-4" />
          </Button>
          
          {/* 保存按钮 */}
          <Button
            variant="ghost"
            size="sm"
            className={`${headerTextColor} font-mono p-1.5 rounded border border-green-500 border-opacity-30 ${buttonHoverBg} transition-all duration-300 hover:shadow-lg hover:shadow-green-500/20`}
            title="保存当前队列为新预设"
            onClick={onSaveClick}
          >
            <Save className="w-4 h-4" />
          </Button>
        </div>
      </div>
      
      {/* 隐藏的文件输入 */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".json,application/json"
        className="hidden"
      />
      
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

export default PresetManager; 