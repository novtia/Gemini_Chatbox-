import React, { useEffect } from 'react';
import { Moon, Sun, Type, ChevronDown } from 'lucide-react';
import { useI18n,  Language } from '../../utils/i18n';
import { appearanceTranslations } from '../../utils/translations/Settings/appearanceTranslations';

interface AppearanceSettingsProps {
  theme: string;
  setTheme: (value: string) => void;
  fontSize: string;
  setFontSize: (value: string) => void;
  language: string;
  setLanguage: (value: string) => void;
  modalStyles: any;
}

const AppearanceSettings: React.FC<AppearanceSettingsProps> = ({
  theme,
  setTheme,
  fontSize,
  setFontSize,
  language,
  setLanguage,
  modalStyles
}) => {
  // 使用我们的 i18n hook
  const { language: currentLanguage, changeLanguage, t } = useI18n(language as Language);
  
  // 当组件内部语言变化时，更新父组件的语言状态
  useEffect(() => {
    if (language !== currentLanguage) {
      setLanguage(currentLanguage);
    }
  }, [currentLanguage, language, setLanguage]);

  // 处理语言变化
  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLanguage = e.target.value as Language;
    changeLanguage(newLanguage);
    setLanguage(newLanguage);
  };

  // 使用翻译函数获取文本
  const translate = (key: string) => t(key, appearanceTranslations);

  return (
    <div className="space-y-6">
      <h3 className={`${modalStyles.subheading} font-medium text-green-400 mb-4 font-mono tracking-wider flex items-center`}>
        <span className="animate-pulse mr-1">&gt;</span> {translate('appearanceSettings')}
      </h3>
      
      <div>
        <label className="block text-green-400 font-medium mb-2 font-mono tracking-wider">{translate('themeMode')}</label>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setTheme('dark')}
            className={`p-3 rounded-lg border ${theme === 'dark' ? 'border-green-500 ring-2 ring-green-500' : 'border-green-500 border-opacity-50'} ${theme === 'dark' ? 'bg-green-600 text-black' : 'bg-black'} flex items-center justify-center transition-all duration-200 relative overflow-hidden group`}
          >
            {theme === 'dark' && (
              <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-green-300 animate-pulse"></div>
            )}
            <Moon size={16} className="mr-2 relative z-10" />
            <span className="font-mono tracking-wider relative z-10">{translate('darkMode')}</span>
          </button>
          <button
            onClick={() => setTheme('light')}
            className={`p-3 rounded-lg border ${theme === 'light' ? 'border-green-500 ring-2 ring-green-500' : 'border-green-500 border-opacity-50'} ${theme === 'light' ? 'bg-green-600 text-black' : 'bg-black'} flex items-center justify-center transition-all duration-200 relative overflow-hidden group`}
          >
            {theme === 'light' && (
              <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-green-300 animate-pulse"></div>
            )}
            <Sun size={16} className="mr-2 relative z-10" />
            <span className="font-mono tracking-wider relative z-10">{translate('lightMode')}</span>
          </button>
        </div>
      </div>
      
      <div>
        <label className="block text-green-400 font-medium mb-2 font-mono tracking-wider">{translate('fontSize')}</label>
        <div className="grid grid-cols-3 gap-3">
          <button
            onClick={() => setFontSize('small')}
            className={`p-3 rounded-lg border ${fontSize === 'small' ? 'border-green-500 ring-2 ring-green-500' : 'border-green-500 border-opacity-50'} ${fontSize === 'small' ? 'bg-green-600 text-black' : 'bg-black'} flex items-center justify-center transition-all duration-200 relative overflow-hidden group`}
          >
            {fontSize === 'small' && (
              <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-green-300 animate-pulse"></div>
            )}
            <Type size={14} className="mr-1 relative z-10" />
            <span className="text-xs font-mono tracking-wider relative z-10">{translate('small')}</span>
          </button>
          <button
            onClick={() => setFontSize('medium')}
            className={`p-3 rounded-lg border ${fontSize === 'medium' ? 'border-green-500 ring-2 ring-green-500' : 'border-green-500 border-opacity-50'} ${fontSize === 'medium' ? 'bg-green-600 text-black' : 'bg-black'} flex items-center justify-center transition-all duration-200 relative overflow-hidden group`}
          >
            {fontSize === 'medium' && (
              <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-green-300 animate-pulse"></div>
            )}
            <Type size={16} className="mr-1 relative z-10" />
            <span className="text-sm font-mono tracking-wider relative z-10">{translate('medium')}</span>
          </button>
          <button
            onClick={() => setFontSize('large')}
            className={`p-3 rounded-lg border ${fontSize === 'large' ? 'border-green-500 ring-2 ring-green-500' : 'border-green-500 border-opacity-50'} ${fontSize === 'large' ? 'bg-green-600 text-black' : 'bg-black'} flex items-center justify-center transition-all duration-200 relative overflow-hidden group`}
          >
            {fontSize === 'large' && (
              <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-green-300 animate-pulse"></div>
            )}
            <Type size={18} className="mr-1 relative z-10" />
            <span className="text-base font-mono tracking-wider relative z-10">{translate('large')}</span>
          </button>
        </div>
      </div>
      
      <div>
        <label className="block text-green-400 font-medium mb-2 font-mono tracking-wider">{translate('interfaceLanguage')}</label>
        <div className="relative">
          <select
            value={currentLanguage}
            onChange={handleLanguageChange}
            className="bg-black border border-green-500 border-opacity-50 text-green-400 font-mono tracking-wider rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-3 appearance-none pr-8"
          >
            <option value="zh">中文</option>
            <option value="en">English</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-green-400">
            <ChevronDown size={18} />
          </div>
        </div>
      </div>
      
      {/* 实时预览 */}
      <div className="mt-6 p-4 border border-green-500 border-opacity-30 rounded-lg bg-black relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div className="matrix-bg h-full w-full"></div>
        </div>
        <h4 className="text-green-400 font-medium font-mono tracking-wider mb-2 relative z-10 flex items-center">
          <span className="animate-pulse mr-1">&gt;</span> {translate('livePreview')}
        </h4>
        <p className={`${fontSize === 'small' ? 'text-xs' : fontSize === 'medium' ? 'text-sm' : 'text-base'} text-green-400 relative z-10 font-mono`}>
          {translate('previewText')}
        </p>
        <div className="flex items-center mt-3 space-x-2 relative z-10">
          <span className={`inline-block px-2 py-1 rounded bg-green-600/50 text-green-300 ${fontSize === 'small' ? 'text-xs' : fontSize === 'medium' ? 'text-sm' : 'text-base'} font-mono tracking-wider`}>
            {translate('tagExample')}
          </span>
          <span className={`inline-block px-2 py-1 rounded bg-green-600/50 text-green-300 ${fontSize === 'small' ? 'text-xs' : fontSize === 'medium' ? 'text-sm' : 'text-base'} font-mono tracking-wider`}>
            {translate('buttonExample')}
          </span>
        </div>
      </div>
      
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
      `}</style>
    </div>
  );
};

export default AppearanceSettings; 