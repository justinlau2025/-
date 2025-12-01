import React from 'react';
import { OptimizationConfig, OptimizationGoal, TargetModel } from '../types';
import { AVAILABLE_MODELS, OPTIMIZATION_GOALS, LANGUAGES } from '../constants';
import { Icons } from './Icon';

interface ConfigurationPanelProps {
  config: OptimizationConfig;
  setConfig: React.Dispatch<React.SetStateAction<OptimizationConfig>>;
}

export const ConfigurationPanel: React.FC<ConfigurationPanelProps> = ({ config, setConfig }) => {
  
  const handleChange = <K extends keyof OptimizationConfig>(key: K, value: OptimizationConfig[K]) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700 space-y-4">
      <div className="flex items-center gap-2 text-slate-300 font-semibold mb-2">
        <Icons.Settings className="w-4 h-4 text-brand-400" />
        <span>优化设置</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Model Selection */}
        <div className="space-y-1">
          <label className="text-xs uppercase tracking-wider text-slate-500 font-semibold">目标模型</label>
          <div className="relative">
            <select
              value={config.targetModel}
              onChange={(e) => handleChange('targetModel', e.target.value as TargetModel)}
              className="w-full appearance-none bg-slate-900 text-slate-200 border border-slate-700 rounded-lg py-2.5 pl-3 pr-10 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all hover:border-slate-600"
            >
              {AVAILABLE_MODELS.map(model => (
                <option key={model.value} value={model.value}>
                  {model.label}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
            </div>
          </div>
        </div>

        {/* Goal Selection */}
        <div className="space-y-1">
          <label className="text-xs uppercase tracking-wider text-slate-500 font-semibold">优化目标</label>
          <div className="relative">
            <select
              value={config.goal}
              onChange={(e) => handleChange('goal', e.target.value as OptimizationGoal)}
              className="w-full appearance-none bg-slate-900 text-slate-200 border border-slate-700 rounded-lg py-2.5 pl-3 pr-10 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all hover:border-slate-600"
            >
              {OPTIMIZATION_GOALS.map(g => (
                <option key={g.value} value={g.value}>
                  {g.label}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
            </div>
          </div>
        </div>

        {/* Language Selection */}
        <div className="space-y-1">
          <label className="text-xs uppercase tracking-wider text-slate-500 font-semibold">输出语言</label>
          <div className="relative">
            <select
              value={config.language}
              onChange={(e) => handleChange('language', e.target.value)}
              className="w-full appearance-none bg-slate-900 text-slate-200 border border-slate-700 rounded-lg py-2.5 pl-3 pr-10 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all hover:border-slate-600"
            >
              {LANGUAGES.map(lang => (
                <option key={lang} value={lang}>
                  {lang}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};