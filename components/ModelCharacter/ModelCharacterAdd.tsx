import React, { useState, useRef, useEffect } from 'react';
import { Upload, AlertCircle, ArrowLeft } from 'lucide-react';
import { ModelCharacterCard } from '../../types';
import { useI18n } from '../../utils/i18n';
import { v4 as uuidv4 } from 'uuid';

// 添加页面的国际化翻译
const characterAddTranslations = {
  name: { zh: '名称', en: 'Name' },
  nameRequired: { zh: '请输入名称', en: 'Name is required' },
  avatar: { zh: '头像', en: 'Avatar' },
  avatarTip: { zh: '请选择不超过100KB的图片', en: 'Please select an image less than 100KB' },
  introduction: { zh: '简介', en: 'Introduction' },
  introRequired: { zh: '请输入简介', en: 'Introduction is required' },
  description: { zh: '角色描述', en: 'Character Description' },
  descRequired: { zh: '请输入角色描述', en: 'Character description is required' },
  submit: { zh: '保存', en: 'Save' },
  update: { zh: '更新', en: 'Update' },
  imageTooLarge: { zh: '图片大小超过100KB，请重新选择', en: 'Image is larger than 100KB, please select another one' },
  uploadImage: { zh: '上传图片', en: 'Upload Image' },
  change: { zh: '更改', en: 'Change' },
  addTitle: { zh: '添加人设', en: 'Add Character' },
  editTitle: { zh: '编辑人设', en: 'Edit Character' },
  back: { zh: '返回', en: 'Back' },
};

interface ModelCharacterAddProps {
  onAddCharacter: (character: ModelCharacterCard) => void;
  characterToEdit?: ModelCharacterCard;
  isEditMode?: boolean;
  onCancel?: () => void;
}

const ModelCharacterAdd: React.FC<ModelCharacterAddProps> = ({ onAddCharacter, characterToEdit, isEditMode = false, onCancel }) => {
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState<string>('');
  const [introduction, setIntroduction] = useState('');
  const [characterDescription, setCharacterDescription] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { t } = useI18n();

  // 当编辑模式开启并且有角色数据时，填充表单
  useEffect(() => {
    if (isEditMode && characterToEdit) {
      setName(characterToEdit.name);
      setAvatar(characterToEdit.avatar || '');
      setIntroduction(characterToEdit.introduction);
      setCharacterDescription(characterToEdit.characterDescription);
    }
  }, [isEditMode, characterToEdit]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 检查文件大小（100KB = 102400 bytes）
    if (file.size > 102400) {
      setErrors(prev => ({ ...prev, avatar: t('imageTooLarge', characterAddTranslations) }));
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setAvatar(event.target.result as string);
        setErrors(prev => ({ ...prev, avatar: '' }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 验证
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = t('nameRequired', characterAddTranslations);
    if (!introduction.trim()) newErrors.introduction = t('introRequired', characterAddTranslations);
    if (!characterDescription.trim()) newErrors.characterDescription = t('descRequired', characterAddTranslations);
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    if (isEditMode && characterToEdit) {
      // 更新现有角色
      const updatedCharacter: ModelCharacterCard = {
        ...characterToEdit,
        name,
        avatar,
        introduction,
        characterDescription,
        updatedAt: new Date(),
      };
      
      onAddCharacter(updatedCharacter);
    } else {
      // 创建新的角色卡
      const newCharacter: ModelCharacterCard = {
        id: uuidv4(),
        name,
        avatar,
        introduction,
        characterDescription,
        createdAt: new Date(),
        type: 'model'
      };
      
      onAddCharacter(newCharacter);
    }
    
    // 如果不是编辑模式，重置表单
    if (!isEditMode) {
      setName('');
      setAvatar('');
      setIntroduction('');
      setCharacterDescription('');
    }
    
    setErrors({});
  };

  return (
    <div className="h-full overflow-y-auto pb-4 pr-1 relative">
      {/* 矩阵背景效果 */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="matrix-bg h-full w-full"></div>
      </div>
      
      {/* 标题和返回按钮 */}
      <div className="flex items-center justify-between mb-4">
        {onCancel && (
          <button 
            onClick={onCancel}
            className="flex items-center text-green-400 hover:text-green-300 transition-all duration-300 mr-2 bg-green-500 bg-opacity-10 hover:bg-opacity-20 rounded-md px-2 py-1"
          >
            <ArrowLeft size={16} className="mr-1" />
            <span className="text-sm font-mono">{t('back', characterAddTranslations)}</span>
          </button>
        )}
        
        <h2 className="text-xl font-mono text-green-400 flex items-center">
          <span className="inline-block w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
          {isEditMode 
            ? t('editTitle', characterAddTranslations) 
            : t('addTitle', characterAddTranslations)
          }
        </h2>
        
        <div className="w-24"></div>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 左侧：名称、头像和简介 */}
          <div className="space-y-5 backdrop-blur-sm p-4 rounded-lg border border-green-500 border-opacity-30 shadow-lg">
            {/* 名称 */}
            <div className="group">
              <label className="block text-green-400 mb-1.5 text-sm font-medium font-mono tracking-wide flex items-center">
                <span className="inline-block w-1.5 h-1.5 bg-green-400 rounded-full mr-2 animate-pulse"></span>
                {t('name', characterAddTranslations)}
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`w-full p-2.5 bg-black border rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 font-mono transition-all duration-300 ${
                  errors.name ? 'border-red-500' : 'border-green-500 border-opacity-50 group-hover:border-opacity-80'
                }`}
              />
              {errors.name && (
                <p className="text-red-500 text-xs mt-1 flex items-center font-mono">
                  <AlertCircle size={12} className="mr-1" /> {errors.name}
                </p>
              )}
            </div>
            
            {/* 头像 */}
            <div className="group">
              <label className="block text-green-400 mb-1.5 text-sm font-medium font-mono tracking-wide flex items-center">
                <span className="inline-block w-1.5 h-1.5 bg-green-400 rounded-full mr-2 animate-pulse"></span>
                {t('avatar', characterAddTranslations)}
              </label>
              <div className="flex items-center space-x-4">
                <div 
                  className={`w-24 h-24 rounded-full overflow-hidden border-2 flex-shrink-0 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-green-500/30 ${
                    errors.avatar ? 'border-red-500' : 'border-green-400'
                  }`}
                >
                  {avatar ? (
                    <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-black flex items-center justify-center text-green-400">
                      <Upload size={20} className="opacity-70 group-hover:opacity-100 transition-opacity" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3 py-1.5 bg-green-600 hover:bg-green-500 text-white text-sm rounded-md transition-all duration-300 font-mono tracking-wide shadow-md hover:shadow-green-500/30"
                  >
                    {avatar ? t('change', characterAddTranslations) : t('uploadImage', characterAddTranslations)}
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <p className="text-xs text-gray-400 mt-1.5 font-mono">{t('avatarTip', characterAddTranslations)}</p>
                  {errors.avatar && (
                    <p className="text-red-500 text-xs mt-1 flex items-center font-mono">
                      <AlertCircle size={12} className="mr-1" /> {errors.avatar}
                    </p>
                  )}
                </div>
              </div>
            </div>
            
            {/* 简介 */}
            <div className="group">
              <label className="block text-green-400 mb-1.5 text-sm font-medium font-mono tracking-wide flex items-center">
                <span className="inline-block w-1.5 h-1.5 bg-green-400 rounded-full mr-2 animate-pulse"></span>
                {t('introduction', characterAddTranslations)}
              </label>
              <input
                type="text"
                value={introduction}
                onChange={(e) => setIntroduction(e.target.value)}
                className={`w-full p-2.5 bg-black border rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 font-mono transition-all duration-300 ${
                  errors.introduction ? 'border-red-500' : 'border-green-500 border-opacity-50 group-hover:border-opacity-80'
                }`}
              />
              {errors.introduction && (
                <p className="text-red-500 text-xs mt-1 flex items-center font-mono">
                  <AlertCircle size={12} className="mr-1" /> {errors.introduction}
                </p>
              )}
            </div>
          </div>
          
          {/* 右侧：角色描述 */}
          <div className="group backdrop-blur-sm p-4 rounded-lg border border-green-500 border-opacity-30 shadow-lg">
            <label className="block text-green-400 mb-1.5 text-sm font-medium font-mono tracking-wide flex items-center">
              <span className="inline-block w-1.5 h-1.5 bg-green-400 rounded-full mr-2 animate-pulse"></span>
              {t('description', characterAddTranslations)}
            </label>
            <textarea
              value={characterDescription}
              onChange={(e) => setCharacterDescription(e.target.value)}
              rows={11}
              className={`w-full p-2.5 bg-black border rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 font-mono transition-all duration-300 resize-none ${
                errors.characterDescription ? 'border-red-500' : 'border-green-500 border-opacity-50 group-hover:border-opacity-80'
              }`}
            />
            {errors.characterDescription && (
              <p className="text-red-500 text-xs mt-1 flex items-center font-mono">
                <AlertCircle size={12} className="mr-1" /> {errors.characterDescription}
              </p>
            )}
          </div>
        </div>
        
        {/* 提交按钮 */}
        <div className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="py-2.5 bg-gray-700 hover:bg-gray-600 text-white rounded-md transition-all duration-300 font-mono tracking-wider shadow-lg hover:shadow-gray-700/30 flex items-center justify-center"
              >
                <ArrowLeft size={16} className="mr-2" />
                {t('back', characterAddTranslations)}
              </button>
            )}
            
            <button
              type="submit"
              className={`py-2.5 bg-green-600 hover:bg-green-500 text-white rounded-md transition-all duration-300 font-mono tracking-wider shadow-lg hover:shadow-green-500/30 flex items-center justify-center ${onCancel ? '' : 'w-full'}`}
            >
              <span className="inline-block mr-2 text-lg">⟢</span>
              {isEditMode 
                ? t('update', characterAddTranslations) 
                : t('submit', characterAddTranslations)
              }
            </button>
          </div>
        </div>
      </form>
      
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

export default ModelCharacterAdd; 