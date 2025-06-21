import React, { useState, useEffect } from 'react';
import { User, Save, ArrowLeft } from 'lucide-react';
import { UserCharacterCard } from '../../types';
import { v4 as uuidv4 } from 'uuid';
import { useI18n } from '../../utils/i18n';

// 国际化翻译
const userCharacterAddTranslations = {
  title: { zh: '添加用户人设', en: 'Add User Character' },
  editTitle: { zh: '编辑用户人设', en: 'Edit User Character' },
  name: { zh: '名称', en: 'Name' },
  namePlaceholder: { zh: '输入人设名称', en: 'Enter character name' },
  description: { zh: '人设描述', en: 'Character Description' },
  descriptionPlaceholder: { zh: '详细描述这个用户人设的特点、背景、语言风格等...', en: 'Describe the characteristics, background, language style, etc. of this user character...' },
  save: { zh: '保存', en: 'Save' },
  nameRequired: { zh: '请输入人设名称', en: 'Please enter a character name' },
  descriptionRequired: { zh: '请输入人设描述', en: 'Please enter a character description' },
  back: { zh: '返回', en: 'Back' },
};

interface UserCharacterAddProps {
  onAddCharacter: (character: UserCharacterCard) => void;
  characterToEdit?: UserCharacterCard;
  isEditMode?: boolean;
  onCancel?: () => void;
}

const UserCharacterAdd: React.FC<UserCharacterAddProps> = ({
  onAddCharacter,
  characterToEdit,
  isEditMode = false,
  onCancel,
}) => {
  const { t } = useI18n();
  const [name, setName] = useState('');
  const [characterDescription, setCharacterDescription] = useState('');
  const [errors, setErrors] = useState<{ name?: string; characterDescription?: string }>({});

  // 如果是编辑模式，加载现有人设数据
  useEffect(() => {
    if (characterToEdit) {
      setName(characterToEdit.name);
      setCharacterDescription(characterToEdit.characterDescription);
    }
  }, [characterToEdit]);

  const validateForm = (): boolean => {
    const newErrors: { name?: string; characterDescription?: string } = {};
    
    if (!name.trim()) {
      newErrors.name = t('nameRequired', userCharacterAddTranslations);
    }
    
    if (!characterDescription.trim()) {
      newErrors.characterDescription = t('descriptionRequired', userCharacterAddTranslations);
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    const userCharacter: UserCharacterCard = {
      id: characterToEdit?.id || uuidv4(),
      name: name.trim(),
      characterDescription: characterDescription.trim(),
      createdAt: characterToEdit?.createdAt || new Date(),
      updatedAt: new Date(),
      type: 'user',
    };
    
    onAddCharacter(userCharacter);
    
    // 如果不是编辑模式，则重置表单
    if (!isEditMode) {
      setName('');
      setCharacterDescription('');
      setErrors({});
    }
  };

  return (
    <div className="bg-black bg-opacity-50 border border-green-500 border-opacity-30 rounded-lg p-4">
      {/* 标题和返回按钮 */}
      <div className="flex items-center justify-between mb-4">
        {onCancel && (
          <button 
            onClick={onCancel}
            className="flex items-center text-green-400 hover:text-green-300 transition-all duration-300 mr-2 bg-green-500 bg-opacity-10 hover:bg-opacity-20 rounded-md px-2 py-1"
          >
            <ArrowLeft size={16} className="mr-1" />
            <span className="text-sm font-mono">{t('back', userCharacterAddTranslations)}</span>
          </button>
        )}
        
        <h2 className="text-xl font-mono text-green-400 flex items-center">
          <User size={20} className="mr-2" />
          {isEditMode 
            ? t('editTitle', userCharacterAddTranslations) 
            : t('title', userCharacterAddTranslations)}
        </h2>
        
        <div className="w-20"></div>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="name" className="block text-green-400 font-mono mb-1">
            {t('name', userCharacterAddTranslations)}
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t('namePlaceholder', userCharacterAddTranslations)}
            className={`w-full p-2 bg-black bg-opacity-70 border ${
              errors.name ? 'border-red-500' : 'border-green-500 border-opacity-50'
            } rounded-md text-green-300 font-mono focus:outline-none focus:border-green-400 focus:ring-1 focus:ring-green-400`}
          />
          {errors.name && (
            <p className="text-red-400 text-sm mt-1 font-mono">{errors.name}</p>
          )}
        </div>
        
        <div className="mb-6">
          <label htmlFor="characterDescription" className="block text-green-400 font-mono mb-1">
            {t('description', userCharacterAddTranslations)}
          </label>
          <textarea
            id="characterDescription"
            value={characterDescription}
            onChange={(e) => setCharacterDescription(e.target.value)}
            placeholder={t('descriptionPlaceholder', userCharacterAddTranslations)}
            rows={10}
            className={`w-full p-2 bg-black bg-opacity-70 border ${
              errors.characterDescription ? 'border-red-500' : 'border-green-500 border-opacity-50'
            } rounded-md text-green-300 font-mono focus:outline-none focus:border-green-400 focus:ring-1 focus:ring-green-400 resize-none`}
          />
          {errors.characterDescription && (
            <p className="text-red-400 text-sm mt-1 font-mono">{errors.characterDescription}</p>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md transition-all duration-300 font-mono flex items-center justify-center"
            >
              <ArrowLeft size={16} className="mr-2" />
              {t('back', userCharacterAddTranslations)}
            </button>
          )}
          
          <button
            type="submit"
            className={`py-2 bg-green-500 bg-opacity-20 text-green-400 rounded-md hover:bg-opacity-30 transition-all duration-300 font-mono flex items-center justify-center hover:shadow-md hover:shadow-green-500/20 ${onCancel ? '' : 'w-full'}`}
          >
            <Save size={16} className="mr-2" />
            {t('save', userCharacterAddTranslations)}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserCharacterAdd; 