import { createTranslations } from '../../i18n';

// 模型设置页面的翻译
export const modelTranslations = createTranslations({
  modelSettings: {
    zh: '模型设置',
    en: 'Model Settings',
  },
  aiModel: {
    zh: 'AI_MODEL',
    en: 'AI_MODEL',
  },
  loadingModels: {
    zh: 'LOADING_MODELS...',
    en: 'LOADING_MODELS...',
  },
  error: {
    zh: '错误',
    en: 'ERROR',
  },
  noModelsAvailable: {
    zh: 'NO_MODELS_AVAILABLE',
    en: 'NO_MODELS_AVAILABLE',
  },
  modelDescription: {
    zh: '选择最适合您需求的AI模型。不同模型可能有不同的能力和专长。',
    en: 'Choose the AI model that best suits your needs. Different models may have different capabilities and specialties.',
  },
  maxTokens: {
    zh: '最大生成令牌数',
    en: 'Maximum Generated Tokens',
  },
  maxTokensDescription: {
    zh: '设置模型生成的最大令牌数量。较高的值允许更长的回复，但可能增加响应时间。',
    en: 'Set the maximum number of tokens the model can generate. Higher values allow longer responses but may increase response time.',
  },
  showThoughts: {
    zh: '显示AI思考过程',
    en: 'Show AI Thought Process',
  },
  enableThoughts: {
    zh: '[ENABLE_THOUGHTS]',
    en: '[ENABLE_THOUGHTS]',
  },
  thoughtsDescription: {
    zh: '启用此选项可以查看AI生成回复时的内部思考过程。',
    en: 'Enable this option to view the AI\'s internal thought process when generating responses.',
  },
  modelInfo: {
    zh: '模型信息',
    en: 'Model Information',
  },
  currentSelection: {
    zh: '当前选择',
    en: 'Current Selection',
  },
  notSelected: {
    zh: '未选择',
    en: 'Not Selected',
  },
  maxTokensInfo: {
    zh: '最大令牌数',
    en: 'Maximum Tokens',
  },
  thoughtProcess: {
    zh: '思考过程',
    en: 'Thought Process',
  },
  enabled: {
    zh: '已启用',
    en: 'Enabled',
  },
  disabled: {
    zh: '已禁用',
    en: 'Disabled',
  },
}); 