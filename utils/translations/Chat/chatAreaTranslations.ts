import { createTranslations } from '../../i18n';

// ChatArea 组件的翻译
export const chatAreaTranslations = createTranslations({
  welcomeMessage: {
    zh: '您好！我是Gemini AI助手，很高兴能帮助您。请问您想了解关于Gemini API的哪些内容？',
    en: 'Hello! I am Gemini AI Assistant, happy to help you. What would you like to know about the Gemini API?',
  },
  dragSortTip: {
    zh: '提示：您可以通过拖拽调整消息顺序',
    en: 'Tip: You can rearrange messages by dragging them',
  },
  dragSortingActive: {
    zh: '拖拽排序中...',
    en: 'Drag sorting in progress...',
  },
  confirmDelete: {
    zh: '确认删除',
    en: 'Confirm Delete',
  },
  deleteMessageConfirm: {
    zh: '您确定要删除这条消息吗？此操作无法撤销。',
    en: 'Are you sure you want to delete this message? This action cannot be undone.',
  },
  deleteChatConfirm: {
    zh: '您确定要删除此聊天吗？此操作无法撤销。',
    en: 'Are you sure you want to delete this chat? This action cannot be undone.',
  },
  cancel: {
    zh: '取消',
    en: 'Cancel',
  },
  delete: {
    zh: '删除',
    en: 'Delete',
  },
  uploadedFile: {
    zh: '上传文件',
    en: 'Uploaded File',
  },
  uploadedImage: {
    zh: '上传图片',
    en: 'Uploaded Image',
  },
  uploadedTextFile: {
    zh: '上传文本文件',
    en: 'Uploaded Text File',
  },
  fileSize: {
    zh: '大小',
    en: 'Size',
  },
}); 