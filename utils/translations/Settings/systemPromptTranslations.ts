import { createTranslations } from '../i18n';

// 系统提示词设置页面的翻译
export const systemPromptTranslations = createTranslations({
  systemPromptSettings: {
    zh: '系统提示词',
    en: 'System Prompt',
  },
  systemPrompt: {
    zh: 'SYSTEM_PROMPT',
    en: 'SYSTEM_PROMPT',
  },
  systemPromptSet: {
    zh: '系统提示词已设置',
    en: 'System prompt is set',
  },
  chars: {
    zh: 'CHARS',
    en: 'CHARS',
  },
  systemPromptPlaceholder: {
    zh: '例如：你是一个专业的AI助手，使用中文回答问题，并提供详细的解释。',
    en: 'Example: You are a professional AI assistant who answers questions in Chinese and provides detailed explanations.',
  },
  systemPromptDescription: {
    zh: '系统提示词指导AI的行为、个性和回应方式。更改系统提示词将启动新的聊天上下文。',
    en: 'System prompts guide AI behavior, personality, and response style. Changing the system prompt will start a new chat context.',
  },
  promptExamples: {
    zh: '提示词示例',
    en: 'Prompt Examples',
  },
  professionalAssistant: {
    zh: '专业助手：使用中文回答问题，提供详细解释',
    en: 'Professional Assistant: Answer questions in Chinese with detailed explanations',
  },
  conciseAssistant: {
    zh: '简洁助手：提供简短直接的回答',
    en: 'Concise Assistant: Provide brief, direct answers',
  },
  programmingTutor: {
    zh: '编程导师：提供代码示例和解释',
    en: 'Programming Tutor: Provide code examples and explanations',
  },
}); 