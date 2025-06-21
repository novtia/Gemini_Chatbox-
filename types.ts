import { Chat, Part as GenAiPart } from "@google/genai";

//调用模型参数
export interface Config {
    modelId: string;
    temperature: number;
    topP: number;
    topK: number;
    maxOutputTokens: number;
    safetySettings: SafetySetting[];
    showThoughts: boolean;
    systemInstruction: string;
    theme: string;
    fontSize: string;
    language: string;
}

// 模型人设卡片接口
export interface ModelCharacterCard {
    id: string;
    name: string;
    avatar: string; // base64编码的图片
    introduction: string; // 简介
    characterDescription: string; // 角色描述
    createdAt: Date;
    updatedAt?: Date;
    type: 'model';
}

// 用户人设卡片
export interface UserCharacterCard {
    id: string;
    name: string;
    characterDescription: string;
    createdAt: Date;
    updatedAt: Date;
    type: 'user';
}

export enum SafetyCategory {
    HARASSMENT = 'HARM_CATEGORY_HARASSMENT',
    HATE_SPEECH = 'HARM_CATEGORY_HATE_SPEECH',
    SEXUALLY_EXPLICIT = 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
    DANGEROUS_CONTENT = 'HARM_CATEGORY_DANGEROUS_CONTENT'
}

export enum SafetyThreshold {
    BLOCK_NONE = 'BLOCK_NONE',
    BLOCK_ONLY_HIGH = 'BLOCK_ONLY_HIGH',
    BLOCK_MEDIUM_AND_ABOVE = 'BLOCK_MEDIUM_AND_ABOVE',
    BLOCK_LOW_AND_ABOVE = 'BLOCK_LOW_AND_ABOVE',
    HARM_BLOCK_THRESHOLD_UNSPECIFIED = 'HARM_BLOCK_THRESHOLD_UNSPECIFIED'
}

export interface SafetySetting {
    category: SafetyCategory;
    threshold: SafetyThreshold;
}

export interface ModelOption {
    id: string;
    name: string;
}

//聊天列表()
export interface ChatItem {
    id: string;
    title: string;
    createdAt?: Date;
    updatedAt?: Date;
    config?: Config;
    messages?: ChatMessage[];
    pinned?: boolean;
    folderId?: string;
}

export interface inlineData {
    mimeType: string;
    data: string;
}

// 文件消息类型枚举
export enum FileMessageType {
    IMAGE = 'image',
    TEXT = 'text',
    PDF = 'pdf',
    OTHER = 'other'
}

//聊天记录格式/提示词格式(包含用户输入和AI输出)
export interface ChatMessage {
    id: string;
    name?: string;
    parts: {
        text: string;
    }[];
    role: 'user' | 'model' | 'error';
    timestamp: Date;
    thoughts?: string; // AI 思考过程
    isLoading?: boolean; // 标记消息是否正在加载/流式传输
    data?:inlineData[];
    fileContent?: string; // 添加文本文件内容字段
    fileName?: string; // 添加文件名字段
    fileType?: FileMessageType; // 添加文件类型字段
    fileMimeType?: string; // 添加文件MIME类型
    fileSize?: number; // 添加文件大小
    enabled?: boolean;
    isInQueue?: boolean;
    isSystem?: boolean;
    isUserInput?: boolean;
    isHistory?: boolean;
    isModelRole?: boolean; // 新增: 模型人设
    isUserRole?: boolean; // 新增: 用户人设
    isMainPrompt? :boolean;    //新增主提示词
    isFileMessage?: boolean; // 新增: 标记是否为文件消息
}


// 提示词预设接口
export interface PromptPreset {
    id: string;
    name: string;
    description?: string;
    author?: string;
    createdAt: Date;
    updatedAt?: Date;
    prompts: ChatMessage[]; // 预设中包含的所有提示词
    promptsList: string[]; // 记录提示词队列排序的ID列表
}

export type ApiContentPart = GenAiPart;

export interface ThoughtSupportingPart extends GenAiPart {
    thought?: any;
}

export interface GeminiService {
    initializeChat: (
      modelId: string,
      systemInstruction: string,
      config: { temperature?: number; topP?: number; topK?: number }, // Added topK to config
      showThoughts: boolean,
      history?: ChatMessage[]
    ) => Promise<Chat | null>;
    sendMessageStream: (
      chat: Chat,
      modelId: string,
      parts: ApiContentPart[], // Changed from message: string to parts: ApiContentPart[]
      onChunk: (chunk: string) => void,
      onThoughtChunk: (chunk: string) => void,
      onError: (error: Error) => void,
      onComplete: () => void
    ) => Promise<void>;
    getAvailableModels: () => Promise<ModelOption[]>;
}
