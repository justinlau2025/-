import React from 'react';
import { HistoryItem } from '../types';
import { Icons } from './Icon';

interface HistorySidebarProps {
  history: HistoryItem[];
  isOpen: boolean;
  onClose: () => void;
  onSelect: (item: HistoryItem) => void;
  onClear: () => void;
}

export const HistorySidebar: React.FC<HistorySidebarProps> = ({ 
  history, 
  isOpen, 
  onClose, 
  onSelect,
  onClear
}) => {
  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      {/* Sidebar Panel */}
      <div className={`
        fixed top-0 left-0 h-full w-80 bg-slate-900 border-r border-slate-700 z-50 transform transition-transform duration-300 ease-in-out shadow-2xl
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          <div className="p-4 border-b border-slate-700 flex justify-between items-center bg-slate-900/50">
            <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
              <Icons.History className="w-5 h-5 text-brand-400" />
              历史记录
            </h2>
            <button 
              onClick={onClose}
              className="p-1 hover:bg-slate-800 rounded-full transition-colors text-slate-400 hover:text-white"
            >
              <Icons.Close className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {history.length === 0 ? (
              <div className="text-center text-slate-500 mt-10">
                <p>暂无记录</p>
                <p className="text-sm">优化后的提示词将显示在这里</p>
              </div>
            ) : (
              history.map((item) => (
                <div 
                  key={item.id}
                  onClick={() => {
                    onSelect(item);
                    if (window.innerWidth < 1024) onClose();
                  }}
                  className="bg-slate-800 border border-slate-700 rounded-lg p-3 cursor-pointer hover:border-brand-500 hover:bg-slate-750 transition-all group"
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-xs font-semibold text-brand-300 px-1.5 py-0.5 rounded bg-brand-950 border border-brand-900 truncate max-w-[120px]">
                      {item.config.targetModel.split(' ')[0]}
                    </span>
                    <span className="text-xs text-slate-500">
                      {new Date(item.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </span>
                  </div>
                  <p className="text-sm text-slate-300 line-clamp-2 mb-2 font-medium">
                    {item.original}
                  </p>
                  <div className="flex items-center text-xs text-slate-500 gap-1">
                     <Icons.Check className="w-3 h-3 text-green-500" />
                     已优化
                  </div>
                </div>
              ))
            )}
          </div>

          {history.length > 0 && (
            <div className="p-4 border-t border-slate-700 bg-slate-900/50">
              <button 
                onClick={onClear}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-950/30 rounded-lg transition-colors border border-transparent hover:border-red-900"
              >
                <Icons.Delete className="w-4 h-4" />
                清空历史
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};