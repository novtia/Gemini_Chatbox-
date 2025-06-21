import React from 'react';
import { Info, Sparkles } from 'lucide-react';
import { useI18n } from '../../utils/i18n';
import { generationTranslations } from '../../utils/translations';

interface GenerationSettingsProps {
  temperature: number;
  setTemperature: (value: number) => void;
  topP: number;
  setTopP: (value: number) => void;
  topK: number;
  setTopK: (value: number) => void;
  theme: string;
  modalStyles: any;
}

const GenerationSettings: React.FC<GenerationSettingsProps> = ({
  temperature,
  setTemperature,
  topP,
  setTopP,
  topK,
  setTopK,
  theme,
  modalStyles
}) => {
  const { t, language } = useI18n();

  return (
    <div className="space-y-6">
      <h3 className="text-green-400 font-medium font-mono tracking-wider mb-4 flex items-center">
        <span className="animate-pulse mr-1">&gt;</span> {t('generationSettings', generationTranslations)}
      </h3>
      
      <div>
        <label htmlFor="temperature-slider" className="block text-green-400 font-medium font-mono tracking-wider mb-2">
          {t('temperature', generationTranslations)}: <span className="font-mono text-green-300">{temperature.toFixed(2)}</span>
        </label>
        <input
          id="temperature-slider"
          type="range"
          min="0"
          max="2" 
          step="0.05"
          value={temperature}
          onChange={(e) => setTemperature(parseFloat(e.target.value))}
          className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-green-500"
          aria-label={`${t('temperature', generationTranslations)}: ${temperature.toFixed(2)}`}
        />
        <div className="flex justify-between text-xs text-green-500 mt-1 font-mono">
          <span>{t('moreDeterministic', generationTranslations)}</span>
          <span>{t('moreRandom', generationTranslations)}</span>
        </div>
        <p className="mt-1 text-sm text-green-400 flex items-start">
          <Info size={12} className="mr-1 mt-0.5 flex-shrink-0 text-green-500" />
          {t('temperatureDescription', generationTranslations)}
        </p>
      </div>

      <div>
        <label htmlFor="top-p-slider" className="block text-green-400 font-medium font-mono tracking-wider mb-2">
          {t('topP', generationTranslations)}: <span className="font-mono text-green-300">{topP.toFixed(2)}</span>
        </label>
        <input
          id="top-p-slider"
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={topP}
          onChange={(e) => setTopP(parseFloat(e.target.value))}
          className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-green-500"
          aria-label={`${t('topP', generationTranslations)}: ${topP.toFixed(2)}`}
        />
        <div className="flex justify-between text-xs text-green-500 mt-1 font-mono">
          <span>{t('moreFocused', generationTranslations)}</span>
          <span>{t('moreDiverse', generationTranslations)}</span>
        </div>
        <p className="mt-1 text-sm text-green-400 flex items-start">
          <Info size={12} className="mr-1 mt-0.5 flex-shrink-0 text-green-500" />
          {t('topPDescription', generationTranslations)}
        </p>
      </div>

      <div>
        <label htmlFor="top-k-slider" className="block text-green-400 font-medium font-mono tracking-wider mb-2">
          {t('topK', generationTranslations)}: <span className="font-mono text-green-300">{topK}</span>
        </label>
        <input
          id="top-k-slider"
          type="range"
          min="1"
          max="100"
          step="1"
          value={topK}
          onChange={(e) => setTopK(parseInt(e.target.value))}
          className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-green-500"
          aria-label={`${t('topK', generationTranslations)}: ${topK}`}
        />
        <div className="flex justify-between text-xs text-green-500 mt-1 font-mono">
          <span>{t('morePrecise', generationTranslations)}</span>
          <span>{t('moreVaried', generationTranslations)}</span>
        </div>
        <p className="mt-1 text-sm text-green-400 flex items-start">
          <Info size={12} className="mr-1 mt-0.5 flex-shrink-0 text-green-500" />
          {t('topKDescription', generationTranslations)}
        </p>
      </div>
      
      <div className="mt-6 p-4 border border-green-500 border-opacity-30 rounded-lg bg-black relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div className="matrix-bg h-full w-full"></div>
        </div>
        <h4 className="text-green-400 font-medium font-mono tracking-wider mb-2 relative z-10 flex items-center">
          <span className="animate-pulse mr-1">&gt;</span> {t('parameterExplanation', generationTranslations)}
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 relative z-10">
          <div className="p-2 border border-green-500 border-opacity-30 rounded bg-black">
            <div className="text-green-300 font-mono text-xs mb-1">{t('temperature', generationTranslations)} [TEMPERATURE]</div>
            <div className="text-green-400 text-xs">{t('temperatureExplanation', generationTranslations)}</div>
          </div>
          <div className="p-2 border border-green-500 border-opacity-30 rounded bg-black">
            <div className="text-green-300 font-mono text-xs mb-1">TOP_P</div>
            <div className="text-green-400 text-xs">{t('topPExplanation', generationTranslations)}</div>
          </div>
          <div className="p-2 border border-green-500 border-opacity-30 rounded bg-black">
            <div className="text-green-300 font-mono text-xs mb-1">TOP_K</div>
            <div className="text-green-400 text-xs">{t('topKExplanation', generationTranslations)}</div>
          </div>
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

export default GenerationSettings; 