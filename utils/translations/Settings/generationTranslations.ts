import { createTranslations } from '../../i18n';

// 生成参数设置页面的翻译
export const generationTranslations = createTranslations({
  generationSettings: {
    zh: '生成参数',
    en: 'Generation Parameters',
  },
  temperature: {
    zh: '温度',
    en: 'Temperature',
  },
  moreDeterministic: {
    zh: '更确定性',
    en: 'More Deterministic',
  },
  moreRandom: {
    zh: '更随机性',
    en: 'More Random',
  },
  temperatureDescription: {
    zh: '控制生成文本的随机性。较低的值使输出更确定，较高的值使输出更多样化和创造性。',
    en: 'Controls the randomness of generated text. Lower values make output more deterministic, higher values make it more diverse and creative.',
  },
  topP: {
    zh: 'Top P',
    en: 'Top P',
  },
  moreFocused: {
    zh: '更聚焦',
    en: 'More Focused',
  },
  moreDiverse: {
    zh: '更发散',
    en: 'More Diverse',
  },
  topPDescription: {
    zh: '控制词汇选择的多样性。较低的值使输出更聚焦于高概率词汇，较高的值允许更多词汇变化。',
    en: 'Controls vocabulary diversity. Lower values focus on high-probability words, higher values allow more vocabulary variation.',
  },
  topK: {
    zh: 'Top K',
    en: 'Top K',
  },
  morePrecise: {
    zh: '更精确',
    en: 'More Precise',
  },
  moreVaried: {
    zh: '更多样',
    en: 'More Varied',
  },
  topKDescription: {
    zh: '限制模型在每一步可选择的最可能的词汇数量。较低的值使输出更精确，较高的值使输出更多样化。',
    en: 'Limits the number of most likely vocabulary choices at each step. Lower values make output more precise, higher values make it more varied.',
  },
  parameterExplanation: {
    zh: '参数说明',
    en: 'Parameter Explanation',
  },
  temperatureExplanation: {
    zh: '控制输出的随机性和创造性',
    en: 'Controls output randomness and creativity',
  },
  topPExplanation: {
    zh: '控制词汇选择的概率阈值',
    en: 'Controls probability threshold for word selection',
  },
  topKExplanation: {
    zh: '限制每步可选词汇的数量',
    en: 'Limits number of word choices per step',
  },
}); 