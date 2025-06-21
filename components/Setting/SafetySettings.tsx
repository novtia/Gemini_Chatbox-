import React from 'react';
import { Info, Shield } from 'lucide-react';
import { SafetySetting, SafetyCategory, SafetyThreshold } from '../../types';
import { useI18n } from '../../utils/i18n';
import { safetyTranslations } from '../../utils/translations';

interface SafetySettingsProps {
  safetySettings: SafetySetting[];
  setSafetySettings: (settings: SafetySetting[]) => void;
  theme: string;
  modalStyles: any;
}

const SafetySettingsComponent: React.FC<SafetySettingsProps> = ({
  safetySettings,
  setSafetySettings,
  theme,
  modalStyles
}) => {
  const { t, language } = useI18n();
  
  const updateSafetySetting = (category: SafetyCategory, threshold: SafetyThreshold) => {
    const updatedSettings = safetySettings.map(setting => 
      setting.category === category 
        ? { ...setting, threshold } 
        : setting
    );
    setSafetySettings(updatedSettings);
  };

  const getThresholdLabel = (threshold: SafetyThreshold) => {
    switch (threshold) {
      case SafetyThreshold.BLOCK_NONE:
        return t('blockNone', safetyTranslations);
      case SafetyThreshold.BLOCK_ONLY_HIGH:
        return t('blockOnlyHigh', safetyTranslations);
      case SafetyThreshold.BLOCK_MEDIUM_AND_ABOVE:
        return t('blockMediumAndAbove', safetyTranslations);
      case SafetyThreshold.BLOCK_LOW_AND_ABOVE:
        return t('blockLowAndAbove', safetyTranslations);
      case SafetyThreshold.HARM_BLOCK_THRESHOLD_UNSPECIFIED:
      default:
        return t('useDefault', safetyTranslations);
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-green-400 font-medium font-mono tracking-wider mb-4 flex items-center">
        <span className="animate-pulse mr-1">&gt;</span> {t('safetySettings', safetyTranslations)}
      </h3>
      <p className="text-sm text-green-400 mb-4 font-mono">
        {t('safetyDescription', safetyTranslations)}
      </p>
      
      {/* 骚扰内容 */}
      <div className="bg-black border border-green-500 border-opacity-30 rounded-lg p-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div className="matrix-bg h-full w-full"></div>
        </div>
        <h4 className="text-green-400 font-medium font-mono tracking-wider mb-2 relative z-10 flex items-center">
          <Shield size={14} className="mr-1" />
          {t('harassmentFilter', safetyTranslations)}
        </h4>
        <p className="text-xs text-green-500 mb-3 relative z-10 font-mono">
          {t('harassmentDescription', safetyTranslations)}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 relative z-10">
          {Object.values(SafetyThreshold).map(threshold => {
            const harassmentSetting = safetySettings.find(s => s.category === SafetyCategory.HARASSMENT);
            const isSelected = harassmentSetting?.threshold === threshold;
            
            return (
              <button
                key={`harassment-${threshold}`}
                onClick={() => updateSafetySetting(SafetyCategory.HARASSMENT, threshold)}
                className={`p-2 text-sm rounded-lg border font-mono relative overflow-hidden ${
                  isSelected 
                    ? 'border-green-500 text-black' 
                    : 'border-green-500 border-opacity-30 hover:border-green-400 text-green-400 hover:bg-green-500 hover:bg-opacity-10'
                }`}
              >
                {isSelected && (
                  <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-green-300 animate-pulse"></div>
                )}
                <span className="relative z-10">
                  {getThresholdLabel(threshold)}
                </span>
              </button>
            );
          })}
        </div>
      </div>
      
      {/* 仇恨言论 */}
      <div className="bg-black border border-green-500 border-opacity-30 rounded-lg p-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div className="matrix-bg h-full w-full"></div>
        </div>
        <h4 className="text-green-400 font-medium font-mono tracking-wider mb-2 relative z-10 flex items-center">
          <Shield size={14} className="mr-1" />
          {t('hateSpeechFilter', safetyTranslations)}
        </h4>
        <p className="text-xs text-green-500 mb-3 relative z-10 font-mono">
          {t('hateSpeechDescription', safetyTranslations)}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 relative z-10">
          {Object.values(SafetyThreshold).map(threshold => {
            const hateSpeechSetting = safetySettings.find(s => s.category === SafetyCategory.HATE_SPEECH);
            const isSelected = hateSpeechSetting?.threshold === threshold;
            
            return (
              <button
                key={`hate-speech-${threshold}`}
                onClick={() => updateSafetySetting(SafetyCategory.HATE_SPEECH, threshold)}
                className={`p-2 text-sm rounded-lg border font-mono relative overflow-hidden ${
                  isSelected 
                    ? 'border-green-500 text-black' 
                    : 'border-green-500 border-opacity-30 hover:border-green-400 text-green-400 hover:bg-green-500 hover:bg-opacity-10'
                }`}
              >
                {isSelected && (
                  <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-green-300 animate-pulse"></div>
                )}
                <span className="relative z-10">
                  {getThresholdLabel(threshold)}
                </span>
              </button>
            );
          })}
        </div>
      </div>
      
      {/* 色情内容 */}
      <div className="bg-black border border-green-500 border-opacity-30 rounded-lg p-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div className="matrix-bg h-full w-full"></div>
        </div>
        <h4 className="text-green-400 font-medium font-mono tracking-wider mb-2 relative z-10 flex items-center">
          <Shield size={14} className="mr-1" />
          {t('sexualContentFilter', safetyTranslations)}
        </h4>
        <p className="text-xs text-green-500 mb-3 relative z-10 font-mono">
          {t('sexualContentDescription', safetyTranslations)}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 relative z-10">
          {Object.values(SafetyThreshold).map(threshold => {
            const sexuallySetting = safetySettings.find(s => s.category === SafetyCategory.SEXUALLY_EXPLICIT);
            const isSelected = sexuallySetting?.threshold === threshold;
            
            return (
              <button
                key={`sexually-${threshold}`}
                onClick={() => updateSafetySetting(SafetyCategory.SEXUALLY_EXPLICIT, threshold)}
                className={`p-2 text-sm rounded-lg border font-mono relative overflow-hidden ${
                  isSelected 
                    ? 'border-green-500 text-black' 
                    : 'border-green-500 border-opacity-30 hover:border-green-400 text-green-400 hover:bg-green-500 hover:bg-opacity-10'
                }`}
              >
                {isSelected && (
                  <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-green-300 animate-pulse"></div>
                )}
                <span className="relative z-10">
                  {getThresholdLabel(threshold)}
                </span>
              </button>
            );
          })}
        </div>
      </div>
      
      {/* 危险内容 */}
      <div className="bg-black border border-green-500 border-opacity-30 rounded-lg p-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div className="matrix-bg h-full w-full"></div>
        </div>
        <h4 className="text-green-400 font-medium font-mono tracking-wider mb-2 relative z-10 flex items-center">
          <Shield size={14} className="mr-1" />
          {t('dangerousContentFilter', safetyTranslations)}
        </h4>
        <p className="text-xs text-green-500 mb-3 relative z-10 font-mono">
          {t('dangerousContentDescription', safetyTranslations)}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 relative z-10">
          {Object.values(SafetyThreshold).map(threshold => {
            const dangerousSetting = safetySettings.find(s => s.category === SafetyCategory.DANGEROUS_CONTENT);
            const isSelected = dangerousSetting?.threshold === threshold;
            
            return (
              <button
                key={`dangerous-${threshold}`}
                onClick={() => updateSafetySetting(SafetyCategory.DANGEROUS_CONTENT, threshold)}
                className={`p-2 text-sm rounded-lg border font-mono relative overflow-hidden ${
                  isSelected 
                    ? 'border-green-500 text-black' 
                    : 'border-green-500 border-opacity-30 hover:border-green-400 text-green-400 hover:bg-green-500 hover:bg-opacity-10'
                }`}
              >
                {isSelected && (
                  <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-green-300 animate-pulse"></div>
                )}
                <span className="relative z-10">
                  {getThresholdLabel(threshold)}
                </span>
              </button>
            );
          })}
        </div>
      </div>
      
      <p className="text-xs text-green-400 flex items-start mt-4">
        <Info size={12} className="mr-1 mt-0.5 flex-shrink-0 text-green-500" />
        {t('safetyNote', safetyTranslations)}
      </p>
      
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

export default SafetySettingsComponent; 