import React, { useState, useEffect, useCallback, useRef } from 'react';
import { optimizePromptStream } from './services/geminiService';
import { HistorySidebar } from './components/HistorySidebar';
import { ConfigurationPanel } from './components/ConfigurationPanel';
import { Icons } from './components/Icon';
import { HistoryItem, OptimizationConfig, OptimizationGoal, TargetModel } from './types';

const App: React.FC = () => {
  // --- State ---
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [copied, setCopied] = useState(false);

  // Configuration State
  const [config, setConfig] = useState<OptimizationConfig>({
    targetModel: TargetModel.GEMINI_3,
    goal: OptimizationGoal.CLARITY,
    language: '中文 (Chinese)'
  });

  // Load history from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('prompt_master_history');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    }
  }, []);

  // Save history to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('prompt_master_history', JSON.stringify(history));
  }, [history]);

  // --- Handlers ---

  const handleOptimize = async () => {
    if (!input.trim() || isOptimizing) return;

    setIsOptimizing(true);
    setOutput(''); // Clear previous output
    let accumulatedText = "";

    await optimizePromptStream(
      input,
      config,
      {
        onChunk: (text) => {
          accumulatedText += text;
          setOutput(prev => prev + text);
        },
        onComplete: (fullText) => {
          setIsOptimizing(false);
          addToHistory(input, fullText, config);
        },
        onError: (err) => {
          console.error(err);
          setIsOptimizing(false);
          setOutput(`错误: ${err.message}。请重试。`);
        }
      }
    );
  };

  const addToHistory = (original: string, optimized: string, usedConfig: OptimizationConfig) => {
    const newItem: HistoryItem = {
      id: Date.now().toString(),
      original,
      optimized,
      timestamp: Date.now(),
      config: { ...usedConfig }
    };
    setHistory(prev => [newItem, ...prev].slice(0, 50)); // Keep last 50
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const loadHistoryItem = (item: HistoryItem) => {
    setInput(item.original);
    setOutput(item.optimized);
    setConfig(item.config);
  };

  const clearHistory = () => {
    if(confirm("确定要清空所有历史记录吗？")) {
        setHistory([]);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-brand-500/30 selection:text-brand-100 flex flex-col">
      
      {/* --- Header --- */}
      <header className="sticky top-0 z-30 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-tr from-brand-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg shadow-brand-500/20">
              <Icons.Sparkles className="text-white w-5 h-5" />
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
              PromptMaster AI
            </h1>
          </div>
          
          <button 
            onClick={() => setIsHistoryOpen(true)}
            className="p-2 hover:bg-slate-800 rounded-lg transition-colors text-slate-400 hover:text-white flex items-center gap-2"
          >
            <Icons.History className="w-5 h-5" />
            <span className="hidden sm:inline text-sm font-medium">历史记录</span>
          </button>
        </div>
      </header>

      {/* --- Main Content --- */}
      <main className="flex-1 max-w-7xl mx-auto px-4 py-8 w-full flex flex-col gap-6">
        
        {/* Configuration Section */}
        <ConfigurationPanel config={config} setConfig={setConfig} />

        {/* Input/Output Grid */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-[500px]">
          
          {/* Input Column */}
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center px-1">
              <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">原始需求</h2>
              <span className="text-xs text-slate-500">{input.length} 字</span>
            </div>
            
            <div className="flex-1 relative group">
              <textarea 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="在此输入您的原始想法... 例如：'帮我写一篇关于人工智能未来的公众号文章'..."
                className="w-full h-full min-h-[300px] p-6 bg-slate-900 border border-slate-700 rounded-2xl resize-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all outline-none text-slate-200 placeholder:text-slate-600 shadow-inner leading-relaxed"
                spellCheck={false}
              />
              {input && (
                <button
                  onClick={() => setInput('')}
                  className="absolute top-4 right-4 p-1 text-slate-600 hover:text-slate-300 transition-colors opacity-0 group-hover:opacity-100"
                  title="清空输入"
                >
                  <Icons.Close className="w-4 h-4" />
                </button>
              )}
            </div>

            <button
              onClick={handleOptimize}
              disabled={!input.trim() || isOptimizing}
              className={`
                w-full py-4 rounded-xl font-bold text-lg shadow-xl flex items-center justify-center gap-3 transition-all transform active:scale-[0.98]
                ${!input.trim() || isOptimizing 
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700' 
                  : 'bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white shadow-brand-500/25 ring-1 ring-white/10'
                }
              `}
            >
              {isOptimizing ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/30 border-t-white"></div>
                  优化中...
                </>
              ) : (
                <>
                  <Icons.Wand className="w-5 h-5" />
                  一键生成优化提示词
                </>
              )}
            </button>
          </div>

          {/* Output Column */}
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center px-1">
              <h2 className="text-sm font-semibold text-brand-400 uppercase tracking-wider flex items-center gap-2">
                <Icons.Sparkles className="w-3 h-3" />
                优化结果
              </h2>
              {output && (
                <span className="text-xs text-brand-500/80 bg-brand-500/10 px-2 py-0.5 rounded border border-brand-500/20 truncate max-w-[150px]">
                  {config.targetModel}
                </span>
              )}
            </div>

            <div className="flex-1 relative bg-slate-900/50 border border-slate-700 rounded-2xl overflow-hidden shadow-lg flex flex-col">
              {output ? (
                <>
                  <div className="flex-1 p-6 overflow-y-auto custom-scrollbar">
                    <pre className="whitespace-pre-wrap font-sans text-slate-200 leading-relaxed text-sm md:text-base">
                      {output}
                    </pre>
                  </div>
                  
                  {/* Action Bar */}
                  <div className="p-4 bg-slate-900 border-t border-slate-800 flex justify-end gap-3">
                     <button
                      onClick={() => setOutput('')}
                      className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-white transition-colors"
                    >
                      清空
                    </button>
                    <button
                      onClick={handleCopy}
                      className={`
                        flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-semibold transition-all
                        ${copied 
                          ? 'bg-green-500/20 text-green-400 border border-green-500/50' 
                          : 'bg-white/10 hover:bg-white/20 text-white border border-white/10'
                        }
                      `}
                    >
                      {copied ? (
                        <>
                          <Icons.Check className="w-4 h-4" />
                          已复制！
                        </>
                      ) : (
                        <>
                          <Icons.Copy className="w-4 h-4" />
                          复制内容
                        </>
                      )}
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-slate-600 p-8 text-center">
                  <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mb-4">
                    <Icons.Wand className="w-8 h-8 opacity-20" />
                  </div>
                  <h3 className="text-lg font-medium text-slate-500 mb-2">准备就绪</h3>
                  <p className="text-sm max-w-xs mx-auto">
                    在左侧输入您的需求并选择目标模型（如 Gemini 3, 豆包, DeepSeek），AI 将为您生成专业的结构化提示词。
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

      </main>

      {/* --- Footer --- */}
      <footer className="py-6 text-center text-slate-600 text-sm border-t border-slate-800/50">
        <p>© {new Date().getFullYear()} PromptMaster AI. Powered by Google Gemini.</p>
      </footer>

      {/* --- Sidebar --- */}
      <HistorySidebar 
        history={history}
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        onSelect={loadHistoryItem}
        onClear={clearHistory}
      />
    </div>
  );
};

export default App;