import { createTranslations } from '../../i18n';

// ChatInput 组件的翻译
export const chatInputTranslations = createTranslations({
  inputPlaceholder: {
    zh: '输入指令...',
    en: 'Enter command...',
  },
  removeFile: {
    zh: '移除文件',
    en: 'Remove File',
  },
  uploadFile: {
    zh: '上传文件',
    en: 'Upload File',
  },
  sendMessage: {
    zh: '发送消息',
    en: 'Send Message',
  },
  enterToSend: {
    zh: '按 ENTER 发送 | SHIFT + ENTER 换行',
    en: 'Press ENTER to send | SHIFT + ENTER for new line',
  },
  clickToUpload: {
    zh: '点击上传文件',
    en: 'Click to upload file',
  },
}); 