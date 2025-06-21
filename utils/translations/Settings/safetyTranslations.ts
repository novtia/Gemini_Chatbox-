import { createTranslations } from '../i18n';

// 安全设置页面的翻译
export const safetyTranslations = createTranslations({
  safetySettings: {
    zh: '安全设置',
    en: 'Safety Settings',
  },
  safetyDescription: {
    zh: '设置不同类型内容的安全过滤级别。较高的安全级别可能会过滤掉更多内容，但也可能限制某些合法讨论。',
    en: 'Set safety filtering levels for different types of content. Higher safety levels may filter more content but may also limit some legitimate discussions.',
  },
  harassmentFilter: {
    zh: '骚扰内容过滤',
    en: 'Harassment Content Filter',
  },
  harassmentDescription: {
    zh: '控制可能被视为骚扰、威胁或欺凌的内容。',
    en: 'Controls content that may be considered harassment, threats, or bullying.',
  },
  hateSpeechFilter: {
    zh: '仇恨言论过滤',
    en: 'Hate Speech Filter',
  },
  hateSpeechDescription: {
    zh: '控制可能针对特定身份特征表达仇恨或偏见的内容。',
    en: 'Controls content that may express hatred or bias against specific identity characteristics.',
  },
  sexualContentFilter: {
    zh: '色情内容过滤',
    en: 'Sexual Content Filter',
  },
  sexualContentDescription: {
    zh: '控制涉及性内容的限制级别。',
    en: 'Controls the restriction level for content involving sexual material.',
  },
  dangerousContentFilter: {
    zh: '危险内容过滤',
    en: 'Dangerous Content Filter',
  },
  dangerousContentDescription: {
    zh: '控制可能鼓励危险或非法活动的内容。',
    en: 'Controls content that may encourage dangerous or illegal activities.',
  },
  blockNone: {
    zh: '全部不屏蔽',
    en: 'Block None',
  },
  blockOnlyHigh: {
    zh: '屏蔽少部分',
    en: 'Block Few',
  },
  blockMediumAndAbove: {
    zh: '屏蔽一部分',
    en: 'Block Some',
  },
  blockLowAndAbove: {
    zh: '屏蔽大部分',
    en: 'Block Most',
  },
  useDefault: {
    zh: '使用默认值',
    en: 'Use Default',
  },
  safetyNote: {
    zh: '较高的安全级别可能会限制模型的某些功能。如果您需要讨论敏感话题，请适当调整安全设置。',
    en: 'Higher safety levels may restrict certain model capabilities. If you need to discuss sensitive topics, please adjust safety settings accordingly.',
  },
}); 