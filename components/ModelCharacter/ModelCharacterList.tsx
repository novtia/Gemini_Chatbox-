import React from 'react';
import { ModelCharacterCard } from '../../types';
import { useI18n } from '../../utils/i18n';
import { Edit, Zap } from 'lucide-react';

// 列表页面的国际化翻译
const characterListTranslations = {
  noCharacters: { zh: '暂无模型人设，请添加', en: 'No characters, please add one' },
  select: { zh: '选择', en: 'Select' },
  edit: { zh: '编辑', en: 'Edit' },
};

interface ModelCharacterListProps {
  characters: ModelCharacterCard[];
  onSelectCharacter: (character: ModelCharacterCard) => void;
  onEditCharacter?: (character: ModelCharacterCard) => void;
}

const ModelCharacterList: React.FC<ModelCharacterListProps> = ({ characters, onSelectCharacter, onEditCharacter }) => {
  const { t } = useI18n();

  if (characters.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-400 text-lg font-mono">{t('noCharacters', characterListTranslations)}</p>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* 矩阵背景效果 */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="matrix-bg h-full w-full"></div>
      </div>
      
      <div className="flex flex-col space-y-4 relative z-10">
        {characters.map((character) => (
          <div 
            key={character.id} 
            className="border border-green-500 border-opacity-30 rounded-lg p-4 bg-black hover:bg-gray-900 transition-all duration-300 shadow-lg hover:shadow-green-500/20 group backdrop-blur-sm"
          >
            <div className="flex items-center justify-between">
              {/* 头像和信息区域 */}
              <div className="flex items-center flex-1 min-w-0">
                {/* 头像 */}
                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-green-400 mr-4 group-hover:scale-105 transition-transform duration-300 shadow-lg shadow-green-500/20 flex-shrink-0">
                  {character.avatar ? (
                    <img 
                      src={character.avatar} 
                      alt={character.name} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-green-900 flex items-center justify-center text-green-400 text-xl font-mono">
                      {character.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                
                {/* 信息区域 */}
                <div className="flex-1 min-w-0">
                  {/* 名称 */}
                  <h3 className="text-green-400 text-lg font-semibold mb-1 font-mono tracking-wider truncate">{character.name}</h3>
                  
                  {/* 简介 */}
                  <p className="text-gray-300 text-sm font-mono line-clamp-2 pr-4">
                    {character.introduction}
                  </p>
                  
                  {/* 更新时间 */}
                  {character.updatedAt && (
                    <p className="text-gray-500 text-xs mt-1 font-mono">
                      更新于: {new Date(character.updatedAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
              
              {/* 按钮区域 - 放在右侧 */}
              <div className="flex flex-col space-y-2 ml-4 flex-shrink-0">
                <button
                  onClick={() => onSelectCharacter(character)}
                  className="py-1.5 px-3 bg-green-600 hover:bg-green-500 text-white rounded-md transition-all duration-300 font-mono tracking-wider group-hover:shadow-md group-hover:shadow-green-500/30 flex items-center justify-center min-w-[90px]"
                >
                  <Zap size={16} className="mr-1" /> {t('select', characterListTranslations)}
                </button>
                
                {onEditCharacter && (
                  <button
                    onClick={() => onEditCharacter(character)}
                    className="py-1.5 px-3 bg-gray-700 hover:bg-gray-600 text-white rounded-md transition-all duration-300 font-mono tracking-wider group-hover:shadow-md group-hover:shadow-green-500/30 flex items-center justify-center min-w-[90px]"
                  >
                    <Edit size={16} className="mr-1" /> {t('edit', characterListTranslations)}
                  </button>
                )}
              </div>
            </div>
            
            {/* 微妙的边框光效 */}
            <div className="absolute inset-0 rounded-lg border border-green-400 border-opacity-0 group-hover:border-opacity-30 transition-all duration-500 pointer-events-none"></div>
          </div>
        ))}
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
      `}</style>
    </div>
  );
};

export default ModelCharacterList; 