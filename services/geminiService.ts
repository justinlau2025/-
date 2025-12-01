import { GoogleGenAI } from "@google/genai";
import { OptimizationConfig, StreamCallbacks } from "../types";

// Initialize the API client
// Note: process.env.API_KEY is injected by the environment
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION = `
你是一位世界级的提示词工程师（Prompt Engineer）和 AI 逻辑专家。
你的目标是将用户输入的原始、模糊的需求，转化为针对特定大语言模型（LLM）优化的高质量、结构化提示词。

请遵循以下规则：
1. **深度分析**: 理解用户原始草稿的核心意图和潜在需求。
2. **应用最佳实践**: 适当使用思维链（Chain-of-Thought）、分隔符、角色设定（Persona）和少样本（Few-Shot）示例。
3. **模型适配性**: 根据目标模型调整语法和语气：
   - **DeepSeek/Gemini 3**: 强调逻辑推理步骤和深度思考。
   - **Claude**: 偏好 XML 标签结构（如 <task>, <context>）。
   - **Midjourney**: 使用特定参数（--ar, --v 等）和视觉描述词。
   - **ChatGPT/豆包/Copilot**: 清晰、直接、分步骤的指令。
4. **纯净输出**: 除非用户特别询问，否则只输出优化后的提示词内容，不要包含“这是您的提示词”等闲聊废话。
5. **结构化格式**: 使用 Markdown 标题、项目符号和清晰的板块（背景、任务、约束、输出格式）使提示词易读且鲁棒。
`;

export const optimizePromptStream = async (
  rawPrompt: string,
  config: OptimizationConfig,
  callbacks: StreamCallbacks
) => {
  try {
    const model = "gemini-2.5-flash"; // Using flash for fast text generation
    
    // Construct a meta-prompt for Gemini to perform the optimization task
    const metaPrompt = `
    目标模型: ${config.targetModel}
    优化目标: ${config.goal}
    输出语言: ${config.language}
    
    用户的原始草稿:
    """
    ${rawPrompt}
    """
    
    请将用户的原始草稿重写为一个完美、生产就绪的提示词（Prompt）。
    如果用户输入的是中文，请默认保持中文输出，除非"输出语言"另有指定。
    `;

    const chat = ai.chats.create({
      model: model,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7, // Slightly creative to allow for good restructuring
      },
    });

    const result = await chat.sendMessageStream({ message: metaPrompt });
    
    let fullText = "";

    for await (const chunk of result) {
      const text = chunk.text;
      if (text) {
        fullText += text;
        callbacks.onChunk(text);
      }
    }

    callbacks.onComplete(fullText);

  } catch (error) {
    console.error("Gemini API Error:", error);
    callbacks.onError(error instanceof Error ? error : new Error("未知错误发生，请重试"));
  }
};