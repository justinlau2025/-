export enum OptimizationGoal {
  CLARITY = 'Clarity & Precision',
  CREATIVITY = 'Creativity & Storytelling',
  CODING = 'Coding & Technical',
  STRUCTURE = 'Structured Output (JSON/Markdown)',
  ROLEPLAY = 'Persona & Roleplay',
  COT = 'Chain of Thought (Reasoning)'
}

export enum TargetModel {
  GEMINI_3 = 'Google Gemini 3',
  DEEPSEEK = 'DeepSeek R1/V3',
  DOUBAO = 'Doubao (豆包)',
  GPT5 = 'ChatGPT 5 (Preview)',
  COPILOT = 'Microsoft Copilot',
  CLAUDE = 'Claude 3.5 Sonnet/Opus',
  MIDJOURNEY = 'Midjourney (Image)',
  GENERAL = 'General / Agnostic'
}

export interface OptimizationConfig {
  targetModel: TargetModel;
  goal: OptimizationGoal;
  language: string;
}

export interface HistoryItem {
  id: string;
  original: string;
  optimized: string;
  timestamp: number;
  config: OptimizationConfig;
}

export interface StreamCallbacks {
  onChunk: (text: string) => void;
  onComplete: (fullText: string) => void;
  onError: (error: Error) => void;
}