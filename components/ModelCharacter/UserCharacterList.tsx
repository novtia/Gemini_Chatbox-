import React from 'react';
import { Edit, User } from 'lucide-react';
import { UserCharacterCard } from '../../types';
import { useI18n } from '../../utils/i18n';

// 国际化翻译
const userCharacterTranslations = {
  noCharacters: { zh: '暂无用户人设，请先添加', en: 'No user characters yet, please add one' },
  select: { zh: '选择', en: 'Select' },
  edit: { zh: '编辑', en: 'Edit' },
};

interface UserCharacterListProps {
  characters: UserCharacterCard[];
  onSelectCharacter: (character: UserCharacterCard) => void;
  onEditCharacter?: (character: UserCharacterCard) => void;
}

const UserCharacterList: React.FC<UserCharacterListProps> = ({
  characters,
  onSelectCharacter,
  onEditCharacter,
}) => {
  const { t } = useI18n();

  if (!characters || characters.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-40 border border-green-500 border-opacity-30 rounded-lg p-4 bg-black bg-opacity-50">
        <User size={32} className="text-green-400 mb-2 opacity-50" />
        <p className="text-green-400 font-mono text-center">
          {t('noCharacters', userCharacterTranslations)}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {characters.map((character) => (
        <div
          key={character.id}
          className="border border-green-500 border-opacity-30 rounded-lg overflow-hidden hover:border-opacity-70 transition-all duration-300 bg-black bg-opacity-50 group hover:shadow-lg hover:shadow-green-500/20"
        >
          <div className="p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-bold text-green-400 font-mono truncate">
                {character.name}
              </h3>
              <div className="flex space-x-1">
                {onEditCharacter && (
                  <button
                    onClick={() => onEditCharacter(character)}
                    className="text-gray-400 hover:text-green-400 transition-colors p-1 rounded-full hover:bg-green-900 hover:bg-opacity-30"
                    title={t('edit', userCharacterTranslations)}
                  >
                    <Edit size={16} />
                  </button>
                )}
              </div>
            </div>
            
            <div className="bg-black bg-opacity-60 p-2 rounded-lg mb-4 max-h-24 overflow-auto text-sm text-gray-300 font-mono custom-scrollbar">
              <pre className="whitespace-pre-wrap break-words">
                {character.characterDescription.length > 200
                  ? `${character.characterDescription.substring(0, 200)}...`
                  : character.characterDescription}
              </pre>
            </div>
            
            <div className="mt-auto">
              <button
                onClick={() => onSelectCharacter(character)}
                className="w-full py-1.5 bg-green-500 bg-opacity-20 text-green-400 rounded-md hover:bg-opacity-30 transition-all duration-300 font-mono flex items-center justify-center group-hover:shadow-md"
              >
                <User size={14} className="mr-1" />
                {t('select', userCharacterTranslations)}
              </button>
            </div>
          </div>
          
          <style jsx>{`
            .custom-scrollbar::-webkit-scrollbar {
              width: 4px;
            }
            
            .custom-scrollbar::-webkit-scrollbar-track {
              background: rgba(0, 0, 0, 0.3);
            }
            
            .custom-scrollbar::-webkit-scrollbar-thumb {
              background: rgba(74, 222, 128, 0.5);
              border-radius: 2px;
            }
            
            .custom-scrollbar::-webkit-scrollbar-thumb:hover {
              background: rgba(74, 222, 128, 0.8);
            }
          `}</style>
        </div>
      ))}
    </div>
  );
};

export default UserCharacterList; 