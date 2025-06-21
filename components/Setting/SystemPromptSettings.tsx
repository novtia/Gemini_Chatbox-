import React from 'react';
import { Info, MessageSquare } from 'lucide-react';
import { useI18n } from '../../utils/i18n';
import { systemPromptTranslations } from '../../utils/translations';

interface SystemPromptSettingsProps {
  systemInstruction: string;
  setSystemInstruction: (value: string) => void;
  theme: string;
  modalStyles: any;
}

const SystemPromptSettings: React.FC<SystemPromptSettingsProps> = ({
  systemInstruction,
  setSystemInstruction,
  theme,
  modalStyles
}) => {
  const { t, language } = useI18n();
  const isSystemPromptSet = systemInstruction && systemInstruction.trim() !== "";

  return (
    <div className="space-y-6">
      <h3 className="text-green-400 font-medium font-mono tracking-wider mb-4 flex items-center">
        <span className="animate-pulse mr-1">&gt;</span> {t('systemPromptSettings', systemPromptTranslations)}
      </h3>
      
      <div>
        <div className="flex justify-between items-center mb-2">
          <label htmlFor="system-prompt-input" className="block text-green-400 font-medium font-mono tracking-wider flex items-center">
            {t('systemPrompt', systemPromptTranslations)}
            {isSystemPromptSet && (
              <span 
                className="ml-2 w-2.5 h-2.5 bg-green-400 rounded-full animate-pulse" 
                title={t('systemPromptSet', systemPromptTranslations)}
                aria-label={t('systemPromptSet', systemPromptTranslations)}
              ></span>
            )}
          </label>
          <span className="text-xs text-green-500 font-mono">
            {systemInstruction.length} {t('chars', systemPromptTranslations)}
          </span>
        </div>
        <textarea
          id="system-prompt-input"
          value={systemInstruction}
          onChange={(e) => setSystemInstruction(e.target.value)}
          rows={8}
          className="bg-black w-full p-3 border border-green-500 border-opacity-50 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 text-green-300 placeholder-green-700 resize-y text-sm font-mono"
          placeholder={t('systemPromptPlaceholder', systemPromptTranslations)}
          aria-label={t('systemPromptSettings', systemPromptTranslations)}
        />
        <p className="mt-2 text-sm text-green-400 flex items-start">
          <Info size={12} className="mr-1 mt-0.5 flex-shrink-0 text-green-500" />
          {t('systemPromptDescription', systemPromptTranslations)}
        </p>
      </div>
      
      <div className="bg-black p-3 rounded-lg border border-green-500 border-opacity-30 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div className="matrix-bg h-full w-full"></div>
        </div>
        <h4 className="text-green-400 font-medium font-mono tracking-wider mb-2 relative z-10 flex items-center">
          <span className="animate-pulse mr-1">&gt;</span> {t('promptExamples', systemPromptTranslations)}
        </h4>
        <div className="space-y-2 relative z-10">
          <button 
            onClick={() => setSystemInstruction("你是一个专业的AI助手，使用中文回答问题，并提供详细的解释。")}
            className="text-green-400 block w-full text-left p-2 rounded hover:bg-green-500 hover:bg-opacity-10 border border-green-500 border-opacity-30 font-mono text-sm transition-colors"
          >
            {t('professionalAssistant', systemPromptTranslations)}
          </button>
          <button 
            onClick={() => setSystemInstruction("你是一个简洁的AI助手。提供简短、直接的回答，不要有多余的解释。")}
            className="text-green-400 block w-full text-left p-2 rounded hover:bg-green-500 hover:bg-opacity-10 border border-green-500 border-opacity-30 font-mono text-sm transition-colors"
          >
            {t('conciseAssistant', systemPromptTranslations)}
          </button>
          <button 
            onClick={() => setSystemInstruction("你是一个友好的编程导师，帮助用户学习编程。提供简单易懂的代码示例和解释。")}
            className="text-green-400 block w-full text-left p-2 rounded hover:bg-green-500 hover:bg-opacity-10 border border-green-500 border-opacity-30 font-mono text-sm transition-colors"
          >
            {t('programmingTutor', systemPromptTranslations)}
          </button>
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

export default SystemPromptSettings; 