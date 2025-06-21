import React, { useState, useEffect, useMemo } from 'react';
import { ModelOption, Config, SafetySetting, SafetyCategory, SafetyThreshold } from '../types';
import { X, SlidersHorizontal, Cpu, Sparkles, Shield, MessageSquare, Palette } from 'lucide-react'; 
import { DEFAULT_CONFIG } from '../constants';
import { saveConfigToStorage } from '../services/storage';
import { useI18n, Language  } from '../utils/i18n';
import { settingTranslations } from '../utils/translations/Settings/settingTranslations';

// 导入子组件
import ModelSettings from './Setting/ModelSettings';
import GenerationSettings from './Setting/GenerationSettings';
import SafetySettingsComponent from './Setting/SafetySettings';
import SystemPromptSettings from './Setting/SystemPromptSettings';
import AppearanceSettings from './Setting/AppearanceSettings';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentSettings: Config;
  availableModels: ModelOption[];
  onSave: (newSettings: Config) => void;
  isModelsLoading: boolean;
  modelsLoadingError: string | null;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  currentSettings,
  availableModels,
  onSave,
  isModelsLoading,
  modelsLoadingError
}) => {
  const [modelId, setModelId] = useState(currentSettings.modelId);
  const [temperature, setTemperature] = useState(currentSettings.temperature);
  const [topP, setTopP] = useState(currentSettings.topP);
  const [topK, setTopK] = useState(currentSettings.topK);
  const [showThoughts, setShowThoughts] = useState(currentSettings.showThoughts);
  const [systemInstruction, setSystemInstruction] = useState(currentSettings.systemInstruction);
  const [theme, setTheme] = useState(currentSettings.theme);
  const [fontSize, setFontSize] = useState(currentSettings.fontSize);
  const [language, setLanguage] = useState(currentSettings.language);
  const [maxOutputTokens, setMaxOutputTokens] = useState(currentSettings.maxOutputTokens);
  const [safetySettings, setSafetySettings] = useState<SafetySetting[]>(
    currentSettings.safetySettings
  );
  const [activeTab, setActiveTab] = useState('model');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  
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
    const translate = (key: string) => t(key, settingTranslations);
  
  // 动态计算模态框的样式
  const modalStyles = useMemo(() => {
    // 黑客帝国风格样式，不再基于主题切换
    const matrixStyles = {
      modalBg: 'bg-black',
      headerBg: 'bg-black',
      sidebarBg: 'bg-black',
      contentBg: 'bg-black',
      textColor: 'text-green-400',
      borderColor: 'border-green-500 border-opacity-30',
      inputBg: 'bg-black',
      inputBorder: 'border-green-500 border-opacity-50',
      buttonHover: 'hover:bg-green-500 hover:bg-opacity-20',
      cardBg: 'bg-black bg-opacity-80',
      tabActive: 'bg-green-600 text-black',
      tabHover: 'hover:bg-green-500 hover:bg-opacity-10',
      headerText: 'text-green-400',
      iconColor: 'text-green-400'
    };
    
    // 基于字体大小设置文本大小
    const fontStyles = {
      small: {
        heading: 'text-lg',
        subheading: 'text-base',
        text: 'text-xs',
        input: 'text-xs'
      },
      medium: {
        heading: 'text-xl',
        subheading: 'text-lg',
        text: 'text-sm',
        input: 'text-sm'
      },
      large: {
        heading: 'text-2xl',
        subheading: 'text-xl',
        text: 'text-base',
        input: 'text-base'
      }
    };
    
    return {
      ...matrixStyles,
      ...fontStyles[fontSize as keyof typeof fontStyles]
    };
  }, [fontSize]);

  // 当设置改变时，重置保存状态
  useEffect(() => {
    setSaveStatus('idle');
  }, [modelId, temperature, topP, topK, showThoughts, systemInstruction, theme, fontSize, language, maxOutputTokens, safetySettings]);

  // 当模态框打开时，加载当前设置
  useEffect(() => {
    if (isOpen) {
      setModelId(currentSettings.modelId);
      setTemperature(currentSettings.temperature);
      setTopP(currentSettings.topP);
      setTopK(currentSettings.topK);
      setShowThoughts(currentSettings.showThoughts);
      setSystemInstruction(currentSettings.systemInstruction);
      setTheme(currentSettings.theme);
      setFontSize(currentSettings.fontSize);
      setLanguage(currentSettings.language);
      setMaxOutputTokens(currentSettings.maxOutputTokens);
      setSafetySettings(currentSettings.safetySettings);
      setSaveStatus('idle');
    }
  }, [currentSettings, isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    setSaveStatus('saving');
    
    try {
      const newSettings: Config = { 
        modelId, 
        temperature, 
        topP,
        topK,
        maxOutputTokens,
        safetySettings,
        showThoughts, 
        systemInstruction,
        theme,
        fontSize,
        language
      };
      
      // 保存设置到本地存储
      saveConfigToStorage(newSettings);
      
      // 调用父组件的onSave回调
      onSave(newSettings);
      
      // 更新保存状态
      setSaveStatus('saved');
      
      // 3秒后重置状态
      setTimeout(() => {
        setSaveStatus('idle');
      }, 3000);
    } catch (error) {
      console.error('保存设置失败:', error);
      setSaveStatus('error');
      
      // 3秒后重置状态
      setTimeout(() => {
        setSaveStatus('idle');
      }, 3000);
    }
  };
  
  const handleResetToDefaults = () => {
    setModelId(DEFAULT_CONFIG.modelId);
    setTemperature(DEFAULT_CONFIG.temperature);
    setTopP(DEFAULT_CONFIG.topP);
    setTopK(DEFAULT_CONFIG.topK);
    setShowThoughts(DEFAULT_CONFIG.showThoughts);
    setSystemInstruction(DEFAULT_CONFIG.systemInstruction);
    setTheme(DEFAULT_CONFIG.theme);
    setFontSize(DEFAULT_CONFIG.fontSize);
    setLanguage(DEFAULT_CONFIG.language);
    setMaxOutputTokens(DEFAULT_CONFIG.maxOutputTokens);
    setSafetySettings(DEFAULT_CONFIG.safetySettings);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="settings-title">
      <div className="bg-black border border-green-500 border-opacity-50 p-0 rounded-xl shadow-xl w-full max-w-3xl transform transition-all scale-100 opacity-100 overflow-hidden text-green-400 relative">
        {/* 矩阵背景效果 */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="matrix-bg h-full w-full"></div>
        </div>
        
        <div className="flex justify-between items-center p-5 border-b border-green-500 border-opacity-30 relative z-10 bg-black bg-opacity-80 backdrop-blur-sm">
          <h2 id="settings-title" className={`${modalStyles.heading} font-semibold ${modalStyles.headerText} flex items-center font-mono tracking-wider`}>
            <SlidersHorizontal size={20} className="mr-2" />
            <span className="animate-pulse">&gt;</span> {translate('settingTranslations')}
          </h2>
          <button
            onClick={onClose}
            className="text-green-400 hover:text-green-300 transition-colors rounded-full p-1 hover:bg-green-500 hover:bg-opacity-20 border border-green-500 border-opacity-30"
            aria-label={t('close', settingTranslations)}
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex flex-col md:flex-row">
          {/* 设置导航栏 */}
          <div className="md:w-1/4 bg-black border-r border-green-500 border-opacity-30 p-4 relative z-10">
            <nav className="space-y-1">
              <button 
                onClick={() => setActiveTab('model')} 
                className={`w-full text-left px-3 py-2 rounded-lg flex items-center font-mono tracking-wider ${activeTab === 'model' ? 'bg-green-600 text-black shadow-lg shadow-green-400/30' : 'text-green-400 hover:bg-green-500 hover:bg-opacity-10'} transition-all duration-300 relative overflow-hidden`}
              >
                {activeTab === 'model' && (
                  <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-green-300 animate-pulse"></div>
                )}
                <Cpu size={18} className="mr-2 relative z-10" />
                <span className="relative z-10">{t('modelSettings', settingTranslations)}</span>
              </button>
              <button 
                onClick={() => setActiveTab('generation')} 
                className={`w-full text-left px-3 py-2 rounded-lg flex items-center font-mono tracking-wider ${activeTab === 'generation' ? 'bg-green-600 text-black shadow-lg shadow-green-400/30' : 'text-green-400 hover:bg-green-500 hover:bg-opacity-10'} transition-all duration-300 relative overflow-hidden`}
              >
                {activeTab === 'generation' && (
                  <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-green-300 animate-pulse"></div>
                )}
                <Sparkles size={18} className="mr-2 relative z-10" />
                <span className="relative z-10">{t('generationParams', settingTranslations)}</span>
              </button>
              <button 
                onClick={() => setActiveTab('safety')} 
                className={`w-full text-left px-3 py-2 rounded-lg flex items-center font-mono tracking-wider ${activeTab === 'safety' ? 'bg-green-600 text-black shadow-lg shadow-green-400/30' : 'text-green-400 hover:bg-green-500 hover:bg-opacity-10'} transition-all duration-300 relative overflow-hidden`}
              >
                {activeTab === 'safety' && (
                  <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-green-300 animate-pulse"></div>
                )}
                <Shield size={18} className="mr-2 relative z-10" />
                <span className="relative z-10">{t('safetySettings', settingTranslations)}</span>
              </button>
              <button 
                onClick={() => setActiveTab('system')} 
                className={`w-full text-left px-3 py-2 rounded-lg flex items-center font-mono tracking-wider ${activeTab === 'system' ? 'bg-green-600 text-black shadow-lg shadow-green-400/30' : 'text-green-400 hover:bg-green-500 hover:bg-opacity-10'} transition-all duration-300 relative overflow-hidden`}
              >
                {activeTab === 'system' && (
                  <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-green-300 animate-pulse"></div>
                )}
                <MessageSquare size={18} className="mr-2 relative z-10" />
                <span className="relative z-10">{t('systemPrompt', settingTranslations)}</span>
              </button>
              <button 
                onClick={() => setActiveTab('appearance')} 
                className={`w-full text-left px-3 py-2 rounded-lg flex items-center font-mono tracking-wider ${activeTab === 'appearance' ? 'bg-green-600 text-black shadow-lg shadow-green-400/30' : 'text-green-400 hover:bg-green-500 hover:bg-opacity-10'} transition-all duration-300 relative overflow-hidden`}
              >
                {activeTab === 'appearance' && (
                  <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-green-300 animate-pulse"></div>
                )}
                <Palette size={18} className="mr-2 relative z-10" />
                <span className="relative z-10">{t('appearance', settingTranslations)}</span>
              </button>
            </nav>
          </div>

          {/* 设置内容区 */}
          <div className="md:w-3/4 p-6 max-h-[70vh] overflow-y-auto bg-black relative z-10">
            {/* 模型设置 */}
            {activeTab === 'model' && (
              <ModelSettings
                modelId={modelId}
                setModelId={setModelId}
                maxOutputTokens={maxOutputTokens}
                setMaxOutputTokens={setMaxOutputTokens}
                showThoughts={showThoughts}
                setShowThoughts={setShowThoughts}
                availableModels={availableModels}
                isModelsLoading={isModelsLoading}
                modelsLoadingError={modelsLoadingError}
                theme={theme}
                modalStyles={modalStyles}
                currentLanguage={currentLanguage}
              />
            )}

            {/* 生成参数 */}
            {activeTab === 'generation' && (
              <GenerationSettings
                temperature={temperature}
                setTemperature={setTemperature}
                topP={topP}
                setTopP={setTopP}
                topK={topK}
                setTopK={setTopK}
                theme={theme}
                modalStyles={modalStyles}
                currentLanguage={currentLanguage}
              />
            )}

            {/* 安全设置 */}
            {activeTab === 'safety' && (
              <SafetySettingsComponent
                safetySettings={safetySettings}
                setSafetySettings={setSafetySettings}
                theme={theme}
                modalStyles={modalStyles}
                currentLanguage={currentLanguage}
              />
            )}

            {/* 系统提示词 */}
            {activeTab === 'system' && (
              <SystemPromptSettings
                systemInstruction={systemInstruction}
                setSystemInstruction={setSystemInstruction}
                theme={theme}
                modalStyles={modalStyles}
                currentLanguage={currentLanguage}
              />
            )}

            {/* 外观设置 */}
            {activeTab === 'appearance' && (
              <AppearanceSettings
                theme={theme}
                setTheme={setTheme}
                fontSize={fontSize}
                setFontSize={setFontSize}
                language={language}
                setLanguage={setLanguage}
                modalStyles={modalStyles}
                currentLanguage={currentLanguage}
              />
            )}
          </div>
        </div>

        <div className="p-5 flex flex-col sm:flex-row justify-between items-center gap-3 border-t border-green-500 border-opacity-30 relative z-10 bg-black bg-opacity-80 backdrop-blur-sm">
          <button
            onClick={handleResetToDefaults}
            type="button"
            className="px-4 py-2 text-sm border border-green-500 border-opacity-50 text-green-400 hover:border-green-400 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-75 w-full sm:w-auto font-mono tracking-wider"
            aria-label={t('resetDefault', settingTranslations)}
          >
            {t('resetDefault', settingTranslations)}
          </button>
          <div className="flex gap-3 w-full sm:w-auto items-center">
            {saveStatus === 'saved' && (
              <span className="text-green-400 text-sm flex items-center font-mono animate-pulse">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {t('savedSuccess', settingTranslations)}
              </span>
            )}
            {saveStatus === 'error' && (
              <span className="text-red-400 text-sm flex items-center font-mono animate-pulse">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                {t('errorDetected', settingTranslations)}
              </span>
            )}
            <button
              onClick={onClose}
              type="button"
              className="flex-1 sm:flex-initial px-4 py-2 bg-black border border-green-500 border-opacity-50 text-green-400 hover:bg-green-500 hover:bg-opacity-10 hover:border-green-400 rounded-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75 text-sm font-mono tracking-wider"
              aria-label={t('cancel', settingTranslations)}
            >
              {t('cancel', settingTranslations)}
            </button>
            <button
              onClick={handleSave}
              disabled={saveStatus === 'saving'}
              type="button"
              className="flex-1 sm:flex-initial px-4 py-2 bg-green-600 hover:bg-green-500 text-black rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-75 text-sm flex items-center justify-center font-mono tracking-wider group relative overflow-hidden"
              aria-label={t('saveConfig', settingTranslations)}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-green-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              {saveStatus === 'saving' ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-black relative z-10" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span className="relative z-10">{t('saving', settingTranslations)}</span>
                </>
              ) : (
                <span className="relative z-10">{t('saveConfig', settingTranslations)}</span>
              )}
            </button>
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
        `}</style>
      </div>
    </div>
  );
};
