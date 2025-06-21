import React from 'react';
import { ModelOption } from '../../types';
import { Loader2, Info, ChevronDown, Cpu } from 'lucide-react';
import { useI18n } from '../../utils/i18n';
import { modelTranslations } from '../../utils/translations';

interface ModelSettingsProps {
  modelId: string;
  setModelId: (value: string) => void;
  maxOutputTokens: number;
  setMaxOutputTokens: (value: number) => void;
  showThoughts: boolean;
  setShowThoughts: (value: boolean) => void;
  availableModels: ModelOption[];
  isModelsLoading: boolean;
  modelsLoadingError: string | null;
  theme: string;
  modalStyles: any;
}

const ModelSettings: React.FC<ModelSettingsProps> = ({
  modelId,
  setModelId,
  maxOutputTokens,
  setMaxOutputTokens,
  showThoughts,
  setShowThoughts,
  availableModels,
  isModelsLoading,
  modelsLoadingError,
  theme,
  modalStyles
}) => {
  const { t, language } = useI18n();

  return (
    <div className="space-y-6">
      <h3 className="text-green-400 font-medium font-mono tracking-wider mb-4 flex items-center">
        <span className="animate-pulse mr-1">&gt;</span> {t('modelSettings', modelTranslations)}
      </h3>
      
      <div>
        <label htmlFor="model-select" className="block text-green-400 font-medium font-mono tracking-wider mb-2">{t('aiModel', modelTranslations)}</label>
        {isModelsLoading ? (
          <div className="flex items-center justify-start bg-black border border-green-500 border-opacity-50 text-green-400 text-sm rounded-lg p-3 w-full font-mono">
            <Loader2 size={16} className="animate-spin mr-2 text-green-500" />
            <span>{t('loadingModels', modelTranslations)}</span>
          </div>
        ) : modelsLoadingError ? (
          <div className="text-sm text-red-400 p-3 bg-red-900/20 border-red-700 border rounded-md font-mono">
            <span className="animate-pulse mr-1">&gt;</span> {t('error', modelTranslations)}: {modelsLoadingError}
          </div>
        ) : (
          <div className="relative">
            <select
              id="model-select"
              value={modelId}
              onChange={(e) => setModelId(e.target.value)}
              className="bg-black border border-green-500 border-opacity-50 text-green-400 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-3 appearance-none pr-8 font-mono"
              disabled={availableModels.length === 0}
              aria-label={t('aiModel', modelTranslations)}
            >
              {availableModels.map((model) => (
                <option key={model.id} value={model.id}>
                  {model.name}
                </option>
              ))}
              {availableModels.length === 0 && <option value="" disabled>{t('noModelsAvailable', modelTranslations)}</option>}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-green-400">
              <ChevronDown size={18} />
            </div>
          </div>
        )}
        <p className="mt-2 text-sm text-green-400 flex items-start">
          <Info size={12} className="mr-1 mt-0.5 flex-shrink-0 text-green-500" />
          {t('modelDescription', modelTranslations)}
        </p>
      </div>
      
      <div>
        <label htmlFor="max-tokens" className="block text-green-400 font-medium font-mono tracking-wider mb-2">
          {t('maxTokens', modelTranslations)}: <span className="font-mono text-green-300">{maxOutputTokens}</span>
        </label>
        <input
          id="max-tokens"
          type="range"
          min="0"
          max="65536"
          step="1024"
          value={maxOutputTokens}
          onChange={(e) => setMaxOutputTokens(parseInt(e.target.value))}
          className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-green-500"
        />
        <div className="flex justify-between text-xs text-green-500 mt-1 font-mono">
          <span>0</span>
          <span>65536</span>
        </div>
        <p className="mt-1 text-sm text-green-400 flex items-start">
          <Info size={12} className="mr-1 mt-0.5 flex-shrink-0 text-green-500" />
          {t('maxTokensDescription', modelTranslations)}
        </p>
      </div>
      
      <div className="flex items-center p-3 border border-green-500 border-opacity-30 rounded-lg bg-black hover:bg-green-900/10 transition-colors">
        <input
          id="show-thoughts"
          type="checkbox"
          checked={showThoughts}
          onChange={(e) => setShowThoughts(e.target.checked)}
          className="h-4 w-4 text-green-600 bg-black border-green-500 rounded focus:ring-green-500 focus:ring-2"
        />
        <label htmlFor="show-thoughts" className="text-sm text-green-400 ml-2 font-mono">
          {t('showThoughts', modelTranslations)} <span className="text-xs text-green-500">{t('enableThoughts', modelTranslations)}</span>
        </label>
      </div>
      <p className="mt-1 text-sm text-green-400 flex items-start pl-6">
        <Info size={12} className="mr-1 mt-0.5 flex-shrink-0 text-green-500" />
        {t('thoughtsDescription', modelTranslations)}
      </p>
      
      <div className="mt-6 p-4 border border-green-500 border-opacity-30 rounded-lg bg-black relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div className="matrix-bg h-full w-full"></div>
        </div>
        <h4 className="text-green-400 font-medium font-mono tracking-wider mb-2 relative z-10 flex items-center">
          <span className="animate-pulse mr-1">&gt;</span> {t('modelInfo', modelTranslations)}
        </h4>
        <div className="relative z-10">
          <div className="text-green-300 font-mono text-xs mb-1">{t('currentSelection', modelTranslations)}: <span className="text-green-400">{modelId || t('notSelected', modelTranslations)}</span></div>
          <div className="text-green-300 font-mono text-xs mb-1">{t('maxTokensInfo', modelTranslations)}: <span className="text-green-400">{maxOutputTokens}</span></div>
          <div className="text-green-300 font-mono text-xs">{t('thoughtProcess', modelTranslations)}: <span className="text-green-400">{showThoughts ? t('enabled', modelTranslations) : t('disabled', modelTranslations)}</span></div>
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

export default ModelSettings; 