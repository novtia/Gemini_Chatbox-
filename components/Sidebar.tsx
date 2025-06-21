import React, { useRef, useState } from 'react';
import { Plus, ChevronLeft, ChevronRight, Upload, MessageSquare, Sparkles } from 'lucide-react';
import { ChatItem } from '../types';
import ChatList from './ChatList';
import PromptManager from './PromptManager';
import SavePresetModal from './Prompt/SavePresetModal';
import { useConfigContext } from '../contexts/ConfigContext';
import usePresetManager from '../hooks/usePresetManager';

interface SidebarProps {
  isCollapsed: boolean;
  toggleSidebar: () => void;
  activeChat: ChatItem | null;
  setActiveChat: (chat: ChatItem) => void;
  chatHistory: ChatItem[];
  onCreateNewChat?: () => void;
  onImportChat?: (chat: ChatItem) => void;
  availableModels?: any[];
  isModelsLoading?: boolean;
  modelsLoadingError?: string | null;
  inputText?: string;
  messages?: any[];
  promptCollection?: any[];
  onEditPrompt?: (prompt: any) => void;
  onTogglePromptInQueue?: (promptId: string) => void;
  onReorderPrompts?: (reorderedPrompts: any[]) => void;
  systemInstruction?: string;
  currentSessionId?: string;
  onSavePreset?: (name: string, description: string, author: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  isCollapsed, 
  toggleSidebar,
  activeChat,
  setActiveChat,
  chatHistory,
  onCreateNewChat,
  onImportChat,
  availableModels,
  isModelsLoading,
  modelsLoadingError,
  inputText,
  messages,
  promptCollection,
  onEditPrompt,
  onTogglePromptInQueue,
  onReorderPrompts,
  systemInstruction,
  currentSessionId,
  onSavePreset
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  // 添加标签状态，默认显示聊天列表
  const [activeTab, setActiveTab] = useState<'chats' | 'prompts'>('chats');
  // 添加保存预设模态框状态
  const [isSavePresetModalOpen, setIsSavePresetModalOpen] = useState(false);
  
  // 使用预设管理器hook - 在Sidebar顶层使用，确保切换标签时保留状态
  const presetManager = usePresetManager();
  const { 
    presets, 
    activePresetId, 
  } = presetManager;
  
  // 使用配置上下文
  const { config } = useConfigContext();
  const { theme, fontSize } = config;
  
  // 处理导入按钮点击
  const handleImportClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  // 处理文件选择
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !onImportChat) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const importedChat = JSON.parse(content) as ChatItem;
        
        // 验证导入的数据是否有效
        if (!importedChat || !importedChat.title) {
          console.error('导入的聊天数据无效');
          return;
        }
        
        onImportChat(importedChat);
        
        // 重置文件输入，以便可以再次导入相同的文件
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } catch (error) {
        console.error('导入聊天失败:', error);
        // 这里可以添加错误提示
      }
    };
    reader.readAsText(file);
  };

  // 处理保存预设
  const handleSavePreset = (name: string, description: string, author: string) => {
    if (onSavePreset) {
      onSavePreset(name, description, author);
    }
    setIsSavePresetModalOpen(false);
  };

  // 根据主题设置样式
  const tabBgActive = theme === 'light' ? 'bg-gray-300' : 'bg-gray-700';
  const tabTextActive = theme === 'light' ? 'text-gray-800' : 'text-white';
  const tabTextInactive = theme === 'light' ? 'text-gray-500' : 'text-gray-400';
  const tabHover = theme === 'light' ? 'hover:bg-gray-200' : 'hover:bg-gray-600';
  
  return (
    <div className={`bg-black border-r border-green-500 border-opacity-50 flex flex-col transition-all duration-300 relative overflow-hidden ${isCollapsed ? 'w-16' : 'w-96'}`}>
      {/* 矩阵背景效果 */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="matrix-bg h-full w-full"></div>
      </div>
      
      {/* 侧边栏头部 */}
      <div className="p-4 flex items-center border-b border-green-500 border-opacity-30 relative z-10 bg-black bg-opacity-80 backdrop-blur-sm">
        <div className={`flex items-center justify-center ${isCollapsed ? 'w-8 h-8 mx-auto' : ''}`}>
          <div className="relative">
            <svg width="24" height="24" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0 filter drop-shadow-lg">
              <path d="M2 11.9556C2 8.47078 2 6.7284 2.67818 5.39739C3.27473 4.22661 4.22661 3.27473 5.39739 2.67818C6.7284 2 8.47078 2 11.9556 2H20.0444C23.5292 2 25.2716 2 26.6026 2.67818C27.7734 3.27473 28.7253 4.22661 29.3218 5.39739C30 6.7284 30 8.47078 30 11.9556V20.0444C30 23.5292 30 25.2716 29.3218 26.6026C28.7253 27.7734 27.7734 28.7253 26.6026 29.3218C25.2716 30 23.5292 30 20.0444 30H11.9556C8.47078 30 6.7284 30 5.39739 29.3218C4.22661 28.7253 3.27473 27.7734 2.67818 26.6026C2 25.2716 2 23.5292 2 20.0444V11.9556Z" fill="#00ff41"/>
              <path d="M16.0019 12.4507L12.541 6.34297C12.6559 6.22598 12.7881 6.14924 12.9203 6.09766C11.8998 6.43355 11.4315 7.57961 11.4315 7.57961L5.10895 18.7345C5.01999 19.0843 4.99528 19.4 5.0064 19.6781H11.9072L16.0019 12.4507Z" fill="#003d0f"/>
              <path d="M16.002 12.4507L20.0967 19.6781H26.9975C27.0086 19.4 26.9839 19.0843 26.8949 18.7345L20.5724 7.57961C20.5724 7.57961 20.1029 6.43355 19.0835 6.09766C19.2145 6.14924 19.3479 6.22598 19.4628 6.34297L16.002 12.4507Z" fill="#00cc33"/>
              <path d="M16.0019 12.4514L19.4628 6.34371C19.3479 6.22671 19.2144 6.14997 19.0835 6.09839C18.9327 6.04933 18.7709 6.01662 18.5954 6.00781H18.4125H13.5913H13.4084C13.2342 6.01536 13.0711 6.04807 12.9203 6.09839C12.7894 6.14997 12.6559 6.22671 12.541 6.34371L16.0019 12.4514Z" fill="#00aa2b"/>
              <path d="M11.9082 19.6782L8.48687 25.7168C8.48687 25.7168 8.3732 25.6614 8.21875 25.5469C8.70434 25.9206 9.17633 25.9998 9.17633 25.9998H22.6134C23.3547 25.9998 23.5092 25.7168 23.5092 25.7168C23.5116 25.7155 23.5129 25.7142 23.5153 25.713L20.0965 19.6782H11.9082Z" fill="#008822"/>
              <path d="M11.9086 19.6782H5.00781C5.04241 20.4985 5.39826 20.9778 5.39826 20.9778L5.65773 21.4281C5.67627 21.4546 5.68739 21.4697 5.68739 21.4697L6.25205 22.461L7.51976 24.6676C7.55683 24.7569 7.60008 24.8386 7.6458 24.9166C7.66309 24.9431 7.67915 24.972 7.69769 24.9972C7.70263 25.0047 7.70757 25.0123 7.71252 25.0198C7.86944 25.2412 8.04489 25.4123 8.22034 25.5469C8.37479 25.6627 8.48847 25.7168 8.48847 25.7168L11.9086 19.6782Z" fill="#006619"/>
              <path d="M20.0967 19.6782H26.9974C26.9628 20.4985 26.607 20.9778 26.607 20.9778L26.3475 21.4281C26.329 21.4546 26.3179 21.4697 26.3179 21.4697L25.7532 22.461L24.4855 24.6676C24.4484 24.7569 24.4052 24.8386 24.3595 24.9166C24.3422 24.9431 24.3261 24.972 24.3076 24.9972C24.3026 25.0047 24.2977 25.0123 24.2927 25.0198C24.1358 25.2412 23.9604 25.4123 23.7849 25.5469C23.6305 25.6627 23.5168 25.7168 23.5168 25.7168L20.0967 19.6782Z" fill="#004d11"/>
            </svg>
            <div className="absolute inset-0 bg-green-400 opacity-20 blur-sm rounded-full animate-pulse"></div>
          </div>
        </div>
        {!isCollapsed && (
          <h2 className="ml-3 text-lg font-medium text-green-400 font-mono tracking-wider">
            <span className="animate-pulse">&gt;</span> MATRIX CHAT
          </h2>
        )}
        
        {!isCollapsed && (
          <button 
            onClick={toggleSidebar}
            className="absolute right-2 p-1 text-green-400 hover:bg-green-500 hover:bg-opacity-20 rounded border border-green-500 border-opacity-30 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/20"
          >
            <ChevronLeft size={18} />
          </button>
        )}
      </div>
      
      {/* 标签切换区域 - 仅在非折叠状态显示 */}
      {!isCollapsed && (
        <div className="flex border-b border-green-500 border-opacity-30 relative z-10 bg-black bg-opacity-80 backdrop-blur-sm">
          <button
            onClick={() => setActiveTab('chats')}
            className={`flex items-center justify-center py-3 flex-1 font-mono text-sm transition-all duration-300 relative overflow-hidden ${
              activeTab === 'chats' 
                ? 'text-black bg-green-400 shadow-lg shadow-green-400/30' 
                : 'text-green-400 hover:bg-green-500 hover:bg-opacity-10 border-r border-green-500 border-opacity-20'
            }`}
          >
            {activeTab === 'chats' && (
              <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-green-300 animate-pulse"></div>
            )}
            <MessageSquare size={16} className="mr-2 relative z-10" />
            <span className="relative z-10 tracking-wider">CHATS</span>
          </button>
          <button
            onClick={() => setActiveTab('prompts')}
            className={`flex items-center justify-center py-3 flex-1 font-mono text-sm transition-all duration-300 relative overflow-hidden ${
              activeTab === 'prompts' 
                ? 'text-black bg-green-400 shadow-lg shadow-green-400/30' 
                : 'text-green-400 hover:bg-green-500 hover:bg-opacity-10'
            }`}
          >
            {activeTab === 'prompts' && (
              <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-green-300 animate-pulse"></div>
            )}
            <Sparkles size={16} className="mr-2 relative z-10" />
            <span className="relative z-10 tracking-wider">PROMPTS</span>
          </button>
        </div>
      )}
      
      {/* 操作按钮区域 - 仅在聊天标签页显示 */}
      {(isCollapsed || activeTab === 'chats') && (
        <div className={`flex ${isCollapsed ? 'flex-col items-center' : 'items-center justify-between'} p-4 gap-2 relative z-10`}>
          {/* 新建聊天按钮 */}
          <button 
            onClick={onCreateNewChat}
            className={`bg-green-600 text-black font-mono font-bold rounded border border-green-400 flex items-center justify-center hover:bg-green-400 transition-all duration-300 hover:shadow-lg hover:shadow-green-400/30 relative overflow-hidden group ${
              isCollapsed ? 'w-10 h-10' : 'h-10 flex-1'
            }`}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-green-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <Plus size={18} className="relative z-10" />
            {!isCollapsed && <span className="ml-2 tracking-wider relative z-10 text-sm">NEW_CHAT</span>}
          </button>
          
          {/* 导入聊天按钮 */}
          <button 
            onClick={handleImportClick}
            className={`bg-black border border-green-500 text-green-400 font-mono font-bold rounded flex items-center justify-center hover:bg-green-500 hover:bg-opacity-10 hover:border-green-400 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/20 ${
              isCollapsed ? 'w-10 h-10 mt-2' : 'h-10 flex-1'
            }`}
          >
            <Upload size={18} className="relative z-10" />
            {!isCollapsed && <span className="ml-2 tracking-wider relative z-10 text-sm">IMPORT</span>}
          </button>
          
          {/* 隐藏的文件输入 */}
          <input 
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            accept=".json"
            className="hidden"
          />
        </div>
      )}
      
      {/* 折叠时的展开按钮 */}
      {isCollapsed && (
        <div className="flex justify-center mt-2 relative z-10">
          <button 
            onClick={toggleSidebar}
            className="w-10 h-10 flex items-center justify-center text-green-400 hover:bg-green-500 hover:bg-opacity-20 rounded border border-green-500 border-opacity-30 backdrop-blur-sm bg-black bg-opacity-50 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/20 animate-pulse"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      )}
      
      {/* 内容区域 - 根据标签显示不同内容 */}
      {isCollapsed || activeTab === 'chats' ? (
        /* 聊天历史列表组件 */
        <ChatList 
          isCollapsed={isCollapsed}
          chatHistory={chatHistory}
          activeChat={activeChat}
          setActiveChat={setActiveChat}
        />
      ) : (
        /* 提示词管理组件 */
        <div className="flex-1 overflow-hidden relative z-10">
          <PromptManager 
            theme={theme}
            fontSize={fontSize}
            systemInstruction={systemInstruction}
            inputText={inputText}
            messages={messages}
            promptCollection={promptCollection}
            onEditPrompt={onEditPrompt}
            onTogglePromptInQueue={onTogglePromptInQueue}
            onReorderPrompts={onReorderPrompts}
            currentSessionId={currentSessionId}
            onSavePresetClick={() => setIsSavePresetModalOpen(true)}
            presetManagerState={presetManager}
          />
        </div>
      )}
      
      {/* 保存预设模态框 */}
      <SavePresetModal
        isOpen={isSavePresetModalOpen}
        onClose={() => setIsSavePresetModalOpen(false)}
        onSave={handleSavePreset}
      />
      
      {/* CSS样式 */}
      <style jsx>{`
        .matrix-bg {
          background-image: 
            linear-gradient(90deg, transparent 98%, rgba(0, 255, 65, 0.03) 100%),
            linear-gradient(180deg, transparent 98%, rgba(0, 255, 65, 0.03) 100%);
          background-size: 20px 20px;
          animation: matrix-scroll 20s linear infinite;
        }
        
        @keyframes matrix-scroll {
          0% { background-position: 0 0; }
          100% { background-position: 20px 20px; }
        }
        
        .matrix-bg::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: radial-gradient(circle at 50% 50%, rgba(0, 255, 65, 0.05) 0%, transparent 70%);
          animation: pulse 4s ease-in-out infinite;
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.7; }
        }
      `}</style>
    </div>
  );
};

export default Sidebar;
