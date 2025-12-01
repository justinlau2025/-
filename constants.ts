import { OptimizationGoal, TargetModel } from "./types";

export const AVAILABLE_MODELS = [
  { value: TargetModel.GEMINI_3, label: "Google Gemini 3 / Pro", icon: "✨" },
  { value: TargetModel.DEEPSEEK, label: "DeepSeek (深度求索)", icon: "🐋" },
  { value: TargetModel.DOUBAO, label: "豆包 (Doubao)", icon: "🥟" },
  { value: TargetModel.GPT5, label: "ChatGPT 5 / 4o", icon: "🧠" },
  { value: TargetModel.CLAUDE, label: "Claude 3.5", icon: "🎭" },
  { value: TargetModel.COPILOT, label: "Microsoft Copilot", icon: "✈️" },
  { value: TargetModel.MIDJOURNEY, label: "Midjourney (绘画)", icon: "🎨" },
  { value: TargetModel.GENERAL, label: "通用大模型", icon: "🤖" },
];

export const OPTIMIZATION_GOALS = [
  { value: OptimizationGoal.CLARITY, label: "清晰精准", description: "消除歧义，指令明确" },
  { value: OptimizationGoal.CREATIVITY, label: "创意写作", description: "发散思维，文笔优美" },
  { value: OptimizationGoal.CODING, label: "代码编程", description: "生成高质量、无Bug的代码" },
  { value: OptimizationGoal.STRUCTURE, label: "结构化输出", description: "严格的 JSON, Markdown 格式" },
  { value: OptimizationGoal.ROLEPLAY, label: "角色扮演", description: "设定特定专家人设" },
  { value: OptimizationGoal.COT, label: "链式思考 (CoT)", description: "一步步推理，逻辑严密" },
];

export const LANGUAGES = [
  "中文 (Chinese)",
  "English (英文)",
  "Japanese (日语)",
  "Korean (韩语)",
  "Spanish (西班牙语)",
  "French (法语)",
  "German (德语)",
  "Russian (俄语)",
];