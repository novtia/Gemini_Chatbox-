import { createTranslations } from '../../i18n';

// ChatList 组件的翻译
export const chatListTranslations = createTranslations({
  noMessages: {
    zh: '无消息',
    en: 'No messages',
  },
  noTextContent: {
    zh: '无文本内容',
    en: 'No text content',
  },
  yesterday: {
    zh: '昨天',
    en: 'Yesterday',
  },
  month: {
    zh: '月',
    en: '',  // 在英文中直接使用数字格式化
  },
  day: {
    zh: '日',
    en: '',  // 在英文中直接使用数字格式化
  },
  noActiveSessions: {
    zh: 'NO ACTIVE SESSIONS',
    en: 'NO ACTIVE SESSIONS',
  },
}); 