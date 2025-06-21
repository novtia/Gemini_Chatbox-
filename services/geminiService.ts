
import { GoogleGenAI, Chat, Part as GenAiPart, Model } from "@google/genai";
import { GeminiService, ChatMessage, ThoughtSupportingPart, ModelOption, ApiContentPart } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn(
    "Gemini API Key is not configured. Please set the API_KEY environment variable. App may not function correctly."
  );
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

// 预定义模型列表
const PreModelList = [
  "models/bard-style-001-abtest",
  "models/calmriver-ab-test",
  "models/claybrook-ab-test",
  "models/frostwind-ab-test",
  "models/goldmane-ab-test",
  "models/kingfall-ab-test",
  "models/gemini-1.0-pro-vision-latest",
  "models/gemini-1.5-flash",
  "models/gemini-1.5-flash-001",
  "models/gemini-1.5-flash-001-tuning",
  "models/gemini-1.5-flash-002",
  "models/gemini-1.5-flash-8b",
  "models/gemini-1.5-flash-8b-001",
  "models/gemini-1.5-flash-8b-exp-0827",
  "models/gemini-1.5-flash-8b-exp-0924",
  "models/gemini-1.5-flash-8b-latest",
  "models/gemini-1.5-flash-latest",
  "models/gemini-1.5-pro",
  "models/gemini-1.5-pro-001",
  "models/gemini-1.5-pro-002",
  "models/gemini-1.5-pro-latest",
  "models/gemini-2.0-flash",
  "models/gemini-2.0-flash-001",
  "models/gemini-2.0-flash-exp",
  "models/gemini-2.0-flash-exp-image-generation",
  "models/gemini-2.0-flash-lite",
  "models/gemini-2.0-flash-lite-001",
  "models/gemini-2.0-flash-lite-preview",
  "models/gemini-2.0-flash-lite-preview-02-05",
  "models/gemini-2.0-flash-preview-image-generation",
  "models/gemini-2.0-flash-thinking-exp",
  "models/gemini-2.0-flash-thinking-exp-01-21",
  "models/gemini-2.0-flash-thinking-exp-1219",
  "models/gemini-2.0-pro-exp",
  "models/gemini-2.0-pro-exp-02-05",
  "models/gemini-2.5-flash-preview-04-17",
  "models/gemini-2.5-flash-preview-04-17-thinking",
  "models/gemini-2.5-flash-preview-05-20",
  "models/gemini-2.5-flash-preview-tts",
  "models/gemini-2.5-pro-exp-03-25",
  "models/gemini-2.5-pro-preview-03-25",
  "models/gemini-2.5-pro-preview-03-25-ab-test",
  "models/gemini-2.5-pro-preview-05-06",
  "models/gemini-2.5-pro-preview-06-05",
  "models/gemini-2.5-pro-preview-tts",
  "models/gemini-exp-1206",
  "models/gemini-pro-vision",
  "models/gemma-3-12b-it",
  "models/gemma-3-1b-it",
  "models/gemma-3-27b-it",
  "models/gemma-3-4b-it",
  "models/gemma-3n-e4b-it",
  "models/learnlm-2.0-flash-experimental"
];

const geminiServiceImpl: GeminiService = {
  getAvailableModels: async (): Promise<ModelOption[]> => {
    if (!API_KEY) { 
        console.warn("Cannot fetch models: API_KEY is not set.");
        return [];
    }
    try {
      // 获取官方模型列表
      const modelPager = await ai.models.list(); 
      const apiModels: ModelOption[] = [];
      const apiModelIds = new Set<string>();
      
      for await (const model of modelPager) { 
        if (model.supportedActions && model.supportedActions.includes('generateContent')) {
          // 去除name中的"models/"前缀
          const displayName = model.name.replace('models/', '');
          apiModels.push({
            id: model.name, 
            name: displayName, 
          });
          apiModelIds.add(model.name);
        }
      }

      // 预定义模型转换为 ModelOption，检查是否存在于官方列表
      const preDefinedModels = PreModelList.map(modelId => ({
        id: modelId,
        name: !apiModelIds.has(modelId) 
          ? `隐藏模型: ${modelId.replace('models/', '')}`
          : modelId.replace('models/', ''),
      }));

      // 合并两个列表并去重
      const finalModels = [...new Map([...apiModels, ...preDefinedModels].map(model => 
        [model.id, model])).values()];

      return finalModels;
    } catch (error) {
      console.error("Failed to fetch available models from Gemini API:", error);
      // 发生错误时返回默认模型列表，同样处理name
      return PreModelList.map(modelId => ({
        id: modelId,
        name: modelId.replace('models/', ''),
      }));
    }
  },

  initializeChat: async (
    modelId: string,
    systemInstruction: string,
    config: { 
      temperature?: number; 
      topP?: number; 
      topK?: number; 
      maxOutputTokens?: number; // Added maxOutputTokens
      safetySettings?: any[]; // Added safetySettings
    },
    showThoughts: boolean,
    history?: ChatMessage[]
  ): Promise<Chat | null> => {
    if (!API_KEY) {
        console.error("Cannot initialize chat: API_KEY is not set.");
        throw new Error("API Key not configured. Cannot initialize chat.");
    }
    try {
      const validHistory = history?.map(item => ({
        ...item,
        parts: item.parts.filter(part => (part as any).text || (part as any).inlineData) as GenAiPart[]
      })).filter(item => item.parts.length > 0);

      const chatConfig: any = { 
        systemInstruction: systemInstruction || undefined,
      };

      if (config.temperature !== undefined) {
        chatConfig.temperature = config.temperature;
      }
      if (config.topP !== undefined) {
        chatConfig.topP = config.topP;
      }
      if (config.topK !== undefined) { 
        chatConfig.topK = config.topK;
      }
      if (config.maxOutputTokens !== undefined) {
        chatConfig.maxOutputTokens = config.maxOutputTokens;
      }
      if (config.safetySettings !== undefined) {
        chatConfig.safetySettings = config.safetySettings;
      }
      
      if (chatConfig.systemInstruction === undefined) {
        delete chatConfig.systemInstruction;
      }

      if (showThoughts) {
        chatConfig.thinkingConfig = { includeThoughts: true };
      }


      const chat: Chat = ai.chats.create({
        model: modelId,
        config: chatConfig,
        history: validHistory,
      });
      return chat;
    } catch (error) {
      console.error("Failed to initialize Gemini chat:", error);
      throw error;
    }
  },

  sendMessageStream: async (
    chat: Chat,
    modelId: string, 
    parts: ApiContentPart[],
    onChunk: (chunk: string) => void,
    onThoughtChunk: (chunk: string) => void,
    onError: (error: Error) => void,
    onComplete: () => void
  ): Promise<void> => {
    try {
      const streamResult = await chat.sendMessageStream({ message: parts });

      for await (const chunkResponse of streamResult) {
        if (chunkResponse.text) {
          onChunk(chunkResponse.text);
        }

        if (chunkResponse.candidates && chunkResponse.candidates[0]?.content?.parts) {
          for (const part of chunkResponse.candidates[0].content.parts) {
            const potentialThoughtPart = part as ThoughtSupportingPart; 
            
            if (potentialThoughtPart.thought && 
                'text' in potentialThoughtPart && 
                typeof potentialThoughtPart.text === 'string') {
              onThoughtChunk(potentialThoughtPart.text);
            }
          }
        }
      }
    } catch (error) {
      console.error("Error sending message to Gemini:", error);
      if (error instanceof Error) {
        onError(error);
      } else {
        onError(new Error(String(error) || "Unknown error during streaming."));
      }
    } finally {
      onComplete();
    }
  },
};

export const geminiServiceInstance: GeminiService = geminiServiceImpl;
