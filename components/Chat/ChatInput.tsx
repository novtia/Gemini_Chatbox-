import React, { useState, useRef, useEffect } from 'react';
import { Send, Upload, X, File, Image, FileText, UserCircle } from 'lucide-react';
import { useI18n } from '../../utils/i18n';
import { chatInputTranslations } from '../../utils/translations';
import { FileMessageType } from '../../types';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  onInputChange?: (input: string) => void;
  onFileUpload?: (file: File) => void;
  onOpenModelCharacter?: () => void;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, onInputChange, onFileUpload, onOpenModelCharacter }) => {
  const [inputMessage, setInputMessage] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // 使用i18n
  const { t } = useI18n();
  
  // 自动调整文本区域高度
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [inputMessage]);
  
  // 清理文件预览URL
  useEffect(() => {
    return () => {
      if (filePreview && filePreview.startsWith('blob:')) {
        URL.revokeObjectURL(filePreview);
      }
    };
  }, [filePreview]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setInputMessage(newValue);
    
    // 调用输入变化回调
    if (onInputChange) {
      onInputChange(newValue);
    }
  };
  
  const handleSendMessage = () => {
    if ((!inputMessage.trim() && !selectedFile) || (inputMessage.trim() === '' && !selectedFile)) return;
    
    // 如果有文本消息，发送文本
    if (inputMessage.trim()) {
      onSendMessage(inputMessage);
    }
    
    // 如果有选择的文件，上传文件
    if (selectedFile && onFileUpload) {
      onFileUpload(selectedFile);
      clearFileSelection();
    }
    
    // 清空输入
    setInputMessage('');
    
    // 发送后清空输入，也要通知输入变化
    if (onInputChange) {
      onInputChange('');
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleFileButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setSelectedFile(file);
      
      // 为图片文件创建预览
      if (file.type.startsWith('image/')) {
        const previewUrl = URL.createObjectURL(file);
        setFilePreview(previewUrl);
      } else {
        setFilePreview(null);
      }
    }
  };
  
  const clearFileSelection = () => {
    if (filePreview && filePreview.startsWith('blob:')) {
      URL.revokeObjectURL(filePreview);
    }
    setSelectedFile(null);
    setFilePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  // 格式化文件大小
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
    return (bytes / (1024 * 1024 * 1024)).toFixed(2) + ' GB';
  };
  
  // 获取文件图标
  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) return <Image size={16} className="text-green-400" />;
    if (fileType.startsWith('text/')) return <FileText size={16} className="text-green-400" />;
    return <File size={16} className="text-green-400" />;
  };
  
  // 添加模型人设按钮点击处理
  const handleModelCharacterClick = () => {
    if (onOpenModelCharacter) {
      onOpenModelCharacter();
    }
  };
  
  // 获取文件类型
  const getFileMessageType = (file: File): FileMessageType => {
    if (file.type.startsWith('image/')) return FileMessageType.IMAGE;
    if (file.type.startsWith('text/')) return FileMessageType.TEXT;
    if (file.type === 'application/pdf') return FileMessageType.PDF;
    return FileMessageType.OTHER;
  };
  
  return (
    <div className="p-4 border-t border-green-500 border-opacity-30 bg-black bg-opacity-80 relative overflow-hidden">
      {/* 矩阵效果背景 */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="w-full h-full bg-gradient-to-r from-transparent via-green-400 to-transparent animate-pulse"></div>
      </div>
      
      {/* 底部扫描线效果 */}
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-green-500 to-transparent"></div>
      
      {/* 文件预览区域 */}
      {selectedFile && (
        <div className="mb-3 border border-green-500 border-opacity-50 rounded-lg p-3 bg-black bg-opacity-70 backdrop-blur-sm relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {getFileIcon(selectedFile.type)}
              <div className="font-mono text-sm text-green-400 truncate max-w-[200px]">{selectedFile.name}</div>
              <span className="text-xs text-green-600 font-mono">{formatFileSize(selectedFile.size)}</span>
            </div>
            <button 
              onClick={clearFileSelection}
              className="text-green-500 hover:text-green-300 transition-colors"
              title={t('removeFile', chatInputTranslations)}
            >
              <X size={16} />
            </button>
          </div>
          
          {/* 图片预览 */}
          {filePreview && (
            <div className="mt-2 max-h-[100px] overflow-hidden rounded border border-green-500 border-opacity-30">
              <img src={filePreview} alt="预览" className="max-h-[100px] object-contain" />
            </div>
          )}
        </div>
      )}
      
      <div className="flex border border-green-500 border-opacity-50 rounded-lg p-2 bg-black bg-opacity-70 backdrop-blur-sm relative">
        <textarea
          ref={textareaRef}
          className="flex-1 border-none outline-none bg-transparent p-2 pr-24 resize-none text-sm min-h-[24px] max-h-[120px] font-mono text-green-400 placeholder-green-700 z-10 relative"
          placeholder={t('inputPlaceholder', chatInputTranslations)}
          value={inputMessage}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
        />
        
        {/* 模型人设按钮 - 绝对定位在上传按钮左边 */}
        <button
          className="absolute bottom-2 right-24 bg-black border border-green-500 text-green-400 rounded-md w-8 h-8 flex items-center justify-center cursor-pointer hover:bg-green-500 hover:bg-opacity-20 transition-colors overflow-hidden group z-10"
          onClick={handleModelCharacterClick}
          title="模型人设"
        >
          <UserCircle size={16} className="group-hover:text-green-300 transition-colors" />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-green-400 to-transparent opacity-0 group-hover:opacity-20 transition-opacity duration-300 transform -skew-x-12"></div>
        </button>
        
        {/* 上传文件按钮 - 绝对定位在右下角 */}
        <button
          className="absolute bottom-2 right-14 bg-black border border-green-500 text-green-400 rounded-md w-8 h-8 flex items-center justify-center cursor-pointer hover:bg-green-500 hover:bg-opacity-20 transition-colors overflow-hidden group z-10"
          onClick={handleFileButtonClick}
          title={t('uploadFile', chatInputTranslations)}
        >
          <Upload size={16} className="group-hover:text-green-300 transition-colors" />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-green-400 to-transparent opacity-0 group-hover:opacity-20 transition-opacity duration-300 transform -skew-x-12"></div>
        </button>
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          className="hidden" 
        />
        
        {/* 发送按钮 */}
        <button 
          className="absolute bottom-2 right-2 bg-black border border-green-500 text-green-400 rounded-md w-8 h-8 flex items-center justify-center cursor-pointer hover:bg-green-500 hover:bg-opacity-20 transition-colors overflow-hidden group z-10"
          onClick={handleSendMessage}
          title={t('sendMessage', chatInputTranslations)}
          disabled={!inputMessage.trim() && !selectedFile}
        >
          <Send size={16} className={`group-hover:text-green-300 transition-colors ${(!inputMessage.trim() && !selectedFile) ? 'opacity-50' : ''}`} />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-green-400 to-transparent opacity-0 group-hover:opacity-20 transition-opacity duration-300 transform -skew-x-12"></div>
        </button>
      </div>
      
      {/* 添加打字机风格的小提示 */}
      <div className="mt-2 text-xs text-green-600 font-mono opacity-70 tracking-wide flex justify-between items-center">
        <div className="flex items-center">
          <span className="inline-block w-2 h-2 bg-green-500 animate-pulse mr-2"></span>
          <span>{t('enterToSend', chatInputTranslations)}</span>
        </div>
        <div className="text-green-600">
          <span className="cursor-pointer hover:text-green-400 transition-colors">{t('clickToUpload', chatInputTranslations)} <Upload size={12} className="inline" /></span>
        </div>
      </div>
    </div>
  );
};

export default ChatInput;
