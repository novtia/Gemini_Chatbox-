import { Config, SafetyCategory, SafetyThreshold } from './types';

export const DEFAULT_CONFIG: Config = {
    modelId: 'models/gemini-2.5-pro-exp-03-25',
    temperature: 0.7,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 32000,
    safetySettings: [
        {
            category: SafetyCategory.HARASSMENT,
            threshold: SafetyThreshold.BLOCK_NONE
        },
        {
            category: SafetyCategory.HATE_SPEECH,
            threshold: SafetyThreshold.BLOCK_NONE
        },
        {
            category: SafetyCategory.SEXUALLY_EXPLICIT,
            threshold: SafetyThreshold.BLOCK_NONE
        },
        {
            category: SafetyCategory.DANGEROUS_CONTENT,
            threshold: SafetyThreshold.BLOCK_NONE
        }
    ],
    showThoughts: true,
    systemInstruction: "",
    theme: 'dark',
    fontSize: 'medium',
    language: 'zh'
}
