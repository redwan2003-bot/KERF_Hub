import React, { useState } from 'react';
import { PALETTE_KEYS, AvailableKey } from '../key-labels';
import { X, Search } from 'lucide-react';

export interface BehaviorPaletteProps {
  selectedKeyIndex: number | null;
  onAssignKey: (key: AvailableKey) => void;
  onClose: () => void;
}

export const BehaviorPalette: React.FC<BehaviorPaletteProps> = ({
  selectedKeyIndex,
  onAssignKey,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'alpha' | 'numeric' | 'mod' | 'nav' | 'macro' | 'kerf'>('alpha');
  const [searchQuery, setSearchQuery] = useState('');

  if (selectedKeyIndex === null) return null;

  const filteredKeys = PALETTE_KEYS.filter((k) => {
    const matchesTab = searchQuery ? true : k.category === activeTab;
    const matchesSearch = searchQuery
      ? k.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        k.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (k.sublabel && k.sublabel.toLowerCase().includes(searchQuery.toLowerCase()))
      : true;
    return matchesTab && matchesSearch;
  });

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 p-6 bg-zinc-950/95 border-t-2 border-zinc-800 shadow-[0_-20px_40px_rgba(0,0,0,0.85)] backdrop-blur-2xl animate-in slide-in-from-bottom duration-200">
      <div className="max-w-6xl mx-auto flex flex-col gap-4">
        {/* Drawer Header */}
        <div className="flex justify-between items-center border-b border-zinc-800 pb-3">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
              <span className="text-sm font-mono font-bold text-zinc-100">
                Remap Key Position #{selectedKeyIndex}
              </span>
            </div>

            {/* Category Filter Pills */}
            <div className="flex gap-1.5 ml-4">
              {(['alpha', 'numeric', 'mod', 'nav', 'macro', 'kerf'] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => {
                    setActiveTab(tab);
                    setSearchQuery('');
                  }}
                  className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all border ${
                    activeTab === tab && !searchQuery
                      ? 'bg-amber-500 border-amber-400 text-zinc-950 shadow-[0_0_10px_rgba(245,158,11,0.3)]'
                      : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
                  }`}
                >
                  {tab.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Quick Search */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-2.5 top-2.5 pointer-events-none" />
              <input
                type="text"
                placeholder="Search behaviors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-zinc-900 border border-zinc-800 rounded-lg pl-8 pr-3 py-1 text-xs font-mono text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-amber-400 w-48"
              />
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-100 hover:border-zinc-700 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Key Palette Grid */}
        <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-12 lg:grid-cols-14 gap-2 max-h-52 overflow-y-auto pr-2">
          {filteredKeys.map((item) => (
            <button
              key={item.code}
              type="button"
              onClick={() => onAssignKey(item)}
              className="group relative flex flex-col items-center justify-between p-2 rounded-lg bg-gradient-to-b from-zinc-850 to-zinc-900 border border-zinc-750/80 hover:border-amber-400 hover:from-zinc-800 hover:to-zinc-850 hover:shadow-[0_0_12px_rgba(245,158,11,0.2)] transition-all text-zinc-200 active:scale-95 shadow-[0_2px_0_0_#09090b]"
            >
              <span className="font-mono text-xs font-bold leading-tight group-hover:text-amber-300">
                {item.label}
              </span>
              {item.sublabel && (
                <span className="text-[9px] text-zinc-400 truncate max-w-full font-mono mt-0.5 leading-none">
                  {item.sublabel}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
