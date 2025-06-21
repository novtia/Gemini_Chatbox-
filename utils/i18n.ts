import { useState, useEffect } from 'react';

// 支持的语言
export type Language = 'zh' | 'en';

// 翻译键值类型
export interface Translations {
  [key: string]: {
    [key in Language]: string;
  };
}

// 默认语言
export const DEFAULT_LANGUAGE: Language = 'zh';

// 创建翻译对象
export const createTranslations = <T extends Record<string, any>>(translations: T): T => translations;

// 创建一个上下文来存储和管理当前语言
export const useI18n = (initialLanguage: Language = DEFAULT_LANGUAGE) => {
  const [language, setLanguage] = useState<Language>(initialLanguage);

  // 从本地存储加载语言设置
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage && (savedLanguage === 'zh' || savedLanguage === 'en')) {
      setLanguage(savedLanguage);
    }
  }, []);

  // 更改语言并保存到本地存储
  const changeLanguage = (newLanguage: Language) => {
    setLanguage(newLanguage);
    localStorage.setItem('language', newLanguage);
  };

  // 翻译函数
  const t = (key: string, translations: Translations): string => {
    if (translations[key] && translations[key][language]) {
      return translations[key][language];
    }
    // 如果找不到翻译，返回键名
    return key;
  };

  return {
    language,
    changeLanguage,
    t,
  };
}; 