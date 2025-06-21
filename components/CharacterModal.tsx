import React, { useState, useEffect } from 'react';
import { X, Minus, ChevronRight, List, PlusCircle, Settings, User, UserPlus, Users } from 'lucide-react';
import ModelCharacterList from './ModelCharacter/ModelCharacterList';
import ModelCharacterAdd from './ModelCharacter/ModelCharacterAdd';
import UserCharacterList from './ModelCharacter/UserCharacterList';
import UserCharacterAdd from './ModelCharacter/UserCharacterAdd';
import { ModelCharacterCard, UserCharacterCard } from '../types';
import { useI18n } from '../utils/i18n';

// 通用人设弹窗的国际化翻译
const characterModalTranslations = {
  title: { zh: '人设管理', en: 'Character Management' },
  list: { zh: '模型人设', en: 'Model Characters' },
  userList: { zh: '用户人设', en: 'User Characters' },
  add: { zh: '添加', en: 'Add' },
  edit: { zh: '编辑', en: 'Edit' },
  settings: { zh: '设置', en: 'Settings' },
  favorites: { zh: '收藏', en: 'Favorites' },
  close: { zh: '关闭', en: 'Close' },
};

// 定义侧边栏选项类型
type TabType = 'list' | 'edit' | 'settings' | 'favorites' | 'userList' | 'userAdd' | 'userEdit' | 'modelAdd';

interface CharacterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCharacter: (character: ModelCharacterCard) => void;
  onSelectUserCharacter?: (character: UserCharacterCard) => void;
  characters: ModelCharacterCard[];
  userCharacters?: UserCharacterCard[];
  onAddCharacter: (character: ModelCharacterCard) => void;
  onAddUserCharacter?: (character: UserCharacterCard) => void;
  onUpdateCharacter?: (character: ModelCharacterCard) => void;
  onUpdateUserCharacter?: (character: UserCharacterCard) => void;
}

const CharacterModal: React.FC<CharacterModalProps> = ({
  isOpen,
  onClose,
  onSelectCharacter,
  onSelectUserCharacter,
  characters,
  userCharacters = [],
  onAddCharacter,
  onAddUserCharacter,
  onUpdateCharacter,
  onUpdateUserCharacter
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('list');
  const [characterToEdit, setCharacterToEdit] = useState<ModelCharacterCard | undefined>(undefined);
  const [userCharacterToEdit, setUserCharacterToEdit] = useState<UserCharacterCard | undefined>(undefined);
  const { t } = useI18n();

  // 定义侧边栏选项及其图标
  const tabOptions: { id: TabType; icon: React.ReactNode; label: string }[] = [
    { id: 'list', icon: <User size={18} />, label: t('list', characterModalTranslations) },
    { id: 'userList', icon: <Users size={18} />, label: t('userList', characterModalTranslations) },
    { id: 'favorites', icon: <User size={18} />, label: t('favorites', characterModalTranslations) },
    { id: 'settings', icon: <Settings size={18} />, label: t('settings', characterModalTranslations) },
  ];

  // 当切换回列表时，清除正在编辑的角色
  useEffect(() => {
    if (activeTab === 'list') {
      setCharacterToEdit(undefined);
    }
    if (activeTab === 'userList') {
      setUserCharacterToEdit(undefined);
    }
  }, [activeTab]);

  // 处理编辑模型人设
  const handleEditCharacter = (character: ModelCharacterCard) => {
    setCharacterToEdit(character);
    setActiveTab('edit');
  };

  // 处理编辑用户人设
  const handleEditUserCharacter = (character: UserCharacterCard) => {
    setUserCharacterToEdit(character);
    setActiveTab('userEdit');
  };

  // 处理更新模型人设
  const handleUpdateCharacter = (updatedCharacter: ModelCharacterCard) => {
    if (onUpdateCharacter) {
      onUpdateCharacter(updatedCharacter);
    } else {
      // 如果没有提供专门的更新函数，使用添加函数
      onAddCharacter(updatedCharacter);
    }
    // 更新完成后返回列表
    setActiveTab('list');
    setCharacterToEdit(undefined);
  };

  // 处理更新用户人设
  const handleUpdateUserCharacter = (updatedCharacter: UserCharacterCard) => {
    if (onUpdateUserCharacter) {
      onUpdateUserCharacter(updatedCharacter);
    } else if (onAddUserCharacter) {
      // 如果没有提供专门的更新函数，使用添加函数
      onAddUserCharacter(updatedCharacter);
    }
    // 更新完成后返回列表
    setActiveTab('userList');
    setUserCharacterToEdit(undefined);
  };

  // 处理添加用户人设
  const handleAddUserCharacter = (character: UserCharacterCard) => {
    if (onAddUserCharacter) {
      onAddUserCharacter(character);
      setActiveTab('userList');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm p-4">
      <div className="w-11/12 max-w-4xl max-h-[90vh] bg-black border border-green-500 rounded-lg shadow-xl overflow-hidden flex flex-col animate-fadeIn">
        {/* Mac风格窗口顶部 */}
        <div className="flex items-center justify-between p-3 border-b border-green-500 border-opacity-30 bg-black bg-opacity-90 backdrop-blur-sm relative">
          {/* 窗口控制按钮 */}
          <div className="flex items-center space-x-2 absolute left-3">
            <button 
              onClick={onClose}
              className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-600 transition-colors flex items-center justify-center group"
              aria-label={t('close', characterModalTranslations)}
            >
              <X size={8} className="text-red-800 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
            <div className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-600 transition-colors flex items-center justify-center group">
              <Minus size={8} className="text-yellow-800 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-600 transition-colors flex items-center justify-center group">
              <span className="text-green-800 opacity-0 group-hover:opacity-100 transition-opacity text-[8px] font-bold">+</span>
            </div>
          </div>
          
          {/* 窗口标题 */}
          <h2 className="text-lg font-mono text-green-400 mx-auto flex items-center">
            <span className="inline-block w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
            {t('title', characterModalTranslations)}
            <span className="inline-block w-2 h-2 bg-green-400 rounded-full ml-2 animate-pulse"></span>
          </h2>
          
          {/* 右侧关闭按钮 */}
          <button 
            onClick={onClose}
            className="text-green-400 hover:text-green-300 transition-colors absolute right-3"
            aria-label={t('close', characterModalTranslations)}
          >
            <X size={18} />
          </button>
        </div>

        {/* 侧边栏和内容区域 */}
        <div className="flex flex-col md:flex-row h-[calc(90vh-4rem)] overflow-hidden relative">
          {/* 矩阵背景效果 */}
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="matrix-bg h-full w-full"></div>
          </div>
          
          {/* 侧边栏标签 - 添加图标区分 */}
          <div className="md:w-1/5 border-b md:border-b-0 md:border-r border-green-500 border-opacity-30 p-2 backdrop-blur-sm relative z-10">
            <div className="flex md:flex-col">
              {tabOptions.map((tab) => (
                <button
                  key={tab.id}
                  className={`flex-1 md:w-full p-2 mb-0 md:mb-2 mr-2 md:mr-0 rounded-md text-left font-mono tracking-wider flex items-center transition-all duration-300 ${activeTab === tab.id ? 'bg-green-500 bg-opacity-20 text-green-400 shadow-md shadow-green-500/20' : 'text-gray-400 hover:bg-gray-800'}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <ChevronRight 
                    size={16} 
                    className={`mr-1 ${activeTab === tab.id ? 'opacity-100' : 'opacity-0'}`} 
                  />
                  <span className="mr-2 flex items-center justify-center">
                    {tab.icon}
                  </span>
                  <span className="hidden md:inline">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 内容区域 */}
          <div className="md:w-4/5 flex-1 overflow-hidden relative z-10">
            <div className="h-full overflow-auto custom-scrollbar">
              {/* 模型人设列表 */}
              {activeTab === 'list' && (
                <div className="p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-mono text-green-400">
                      {t('list', characterModalTranslations)}
                    </h3>
                    <button 
                      onClick={() => setActiveTab('modelAdd')}
                      className="text-green-400 hover:text-green-300 transition-colors p-1 rounded bg-green-900 bg-opacity-30 hover:bg-opacity-50 flex items-center"
                    >
                      <UserPlus size={16} className="mr-1" />
                      <span className="text-sm">{t('add', characterModalTranslations)}</span>
                    </button>
                  </div>
                  <ModelCharacterList 
                    characters={characters} 
                    onSelectCharacter={(character) => {
                      onSelectCharacter(character);
                      onClose();
                    }}
                    onEditCharacter={handleEditCharacter}
                  />
                </div>
              )}

              {/* 用户人设列表 */}
              {activeTab === 'userList' && (
                <div className="p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-mono text-green-400">
                      {t('userList', characterModalTranslations)}
                    </h3>
                    <button 
                      onClick={() => setActiveTab('userAdd')}
                      className="text-green-400 hover:text-green-300 transition-colors p-1 rounded bg-green-900 bg-opacity-30 hover:bg-opacity-50 flex items-center"
                    >
                      <UserPlus size={16} className="mr-1" />
                      <span className="text-sm">{t('add', characterModalTranslations)}</span>
                    </button>
                  </div>
                  <UserCharacterList 
                    characters={userCharacters} 
                    onSelectCharacter={(character) => {
                      if (onSelectUserCharacter) {
                        onSelectUserCharacter(character);
                        onClose();
                      }
                    }}
                    onEditCharacter={handleEditUserCharacter}
                  />
                </div>
              )}

              {/* 添加模型人设 */}
              {activeTab === 'modelAdd' && (
                <div className="p-4">
                  <ModelCharacterAdd 
                    onAddCharacter={(character) => {
                      onAddCharacter(character);
                      setActiveTab('list');
                    }} 
                    onCancel={() => setActiveTab('list')}
                  />
                </div>
              )}

              {/* 添加用户人设 */}
              {activeTab === 'userAdd' && (
                <div className="p-4">
                  <UserCharacterAdd 
                    onAddCharacter={handleAddUserCharacter} 
                    onCancel={() => setActiveTab('userList')}
                  />
                </div>
              )}

              {/* 编辑模型人设 */}
              {activeTab === 'edit' && characterToEdit && (
                <div className="p-4">
                  <ModelCharacterAdd 
                    onAddCharacter={handleUpdateCharacter}
                    characterToEdit={characterToEdit}
                    isEditMode={true}
                    onCancel={() => setActiveTab('list')}
                  />
                </div>
              )}

              {/* 编辑用户人设 */}
              {activeTab === 'userEdit' && userCharacterToEdit && (
                <div className="p-4">
                  <UserCharacterAdd 
                    onAddCharacter={handleUpdateUserCharacter}
                    characterToEdit={userCharacterToEdit}
                    isEditMode={true}
                    onCancel={() => setActiveTab('userList')}
                  />
                </div>
              )}

              {activeTab === 'favorites' && (
                <div className="p-4">
                  <div className="bg-black bg-opacity-40 border border-green-500 border-opacity-30 rounded-lg p-4 font-mono text-green-400">
                    <h3 className="text-xl mb-4 flex items-center">
                      <User size={18} className="mr-2" />
                      收藏的人设
                    </h3>
                    <p>收藏的人设功能正在开发中...</p>
                  </div>
                </div>
              )}
              {activeTab === 'settings' && (
                <div className="p-4">
                  <div className="bg-black bg-opacity-40 border border-green-500 border-opacity-30 rounded-lg p-4 font-mono text-green-400">
                    <h3 className="text-xl mb-4 flex items-center">
                      <Settings size={18} className="mr-2" />
                      人设管理设置
                    </h3>
                    <p>人设管理设置功能正在开发中...</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
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
        
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.98); }
          to { opacity: 1; transform: scale(1); }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
        
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.3);
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(74, 222, 128, 0.5);
          border-radius: 3px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(74, 222, 128, 0.8);
        }
      `}</style>
    </div>
  );
};

export default CharacterModal; 