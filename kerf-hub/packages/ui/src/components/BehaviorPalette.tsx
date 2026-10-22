import React, { useState } from 'react';
import { PALETTE_KEYS, AvailableKey } from '../key-labels';

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
  const [activeTab, setActiveTab] = useState<'alpha' | 'numeric' | 'mod' | 'nav' | 'kerf'>('alpha');

  if (selectedKeyIndex === null) return null;

  const filteredKeys = PALETTE_KEYS.filter((k) => k.category === activeTab);

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 p-6 bg-zinc-900/95 border-t border-zinc-700 shadow-2xl backdrop-blur-xl animate-in slide-in-from-bottom duration-200">
      <div className="max-w-5xl mx-auto flex flex-col gap-4">
        <div className="flex justify-between items-center border-b border-zinc-800 pb-3">
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-zinc-100">
              Remap Key Position #{selectedKeyIndex}
            </span>
            <div className="flex gap-1.5 ml-4">
              {(['alpha', 'numeric', 'mod', 'nav', 'kerf'] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-1 rounded-md text-xs font-mono font-medium transition-colors ${
                    activeTab === tab
                      ? 'bg-amber-500 text-zinc-950 font-bold'
                      : 'bg-zinc-800 text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  {tab.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-100 text-sm font-mono px-2 py-1"
          >
            ✕ Close
          </button>
        </div>

        {/* Palette grid */}
        <div className="grid grid-cols-8 md:grid-cols-12 gap-2 max-h-48 overflow-y-auto pr-2">
          {filteredKeys.map((item) => (
            <button
              key={item.code}
              type="button"
              onClick={() => onAssignKey(item)}
              className="flex flex-col items-center justify-center p-2 rounded-lg bg-zinc-800/90 border border-zinc-700 hover:border-amber-400 hover:bg-zinc-750 transition-all text-zinc-200 active:scale-95"
            >
              <span className="font-mono text-sm font-bold">{item.label}</span>
              {item.sublabel && (
                <span className="text-[10px] text-zinc-400 truncate max-w-full font-sans">
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
