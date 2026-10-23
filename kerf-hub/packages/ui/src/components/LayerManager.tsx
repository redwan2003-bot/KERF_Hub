import React from 'react';
import { KeymapLayer } from '@kerf/core';
import { Layers } from 'lucide-react';

export interface LayerManagerProps {
  layers: KeymapLayer[];
  activeLayerId: number;
  onSelectLayer: (id: number) => void;
  disabled?: boolean;
}

export const LayerManager: React.FC<LayerManagerProps> = ({
  layers,
  activeLayerId,
  onSelectLayer,
  disabled = false,
}) => {
  return (
    <div className="flex items-center gap-3 p-1.5 rounded-2xl bg-zinc-950/80 border border-zinc-800/90 shadow-md">
      <div className="flex items-center gap-1.5 px-3 py-1 text-xs font-mono font-bold text-zinc-400">
        <Layers className="w-3.5 h-3.5 text-amber-400" />
        <span>LAYERS:</span>
      </div>
      <div className="flex gap-1.5">
        {layers.map((layer) => {
          const isActive = activeLayerId === layer.id;
          return (
            <button
              key={layer.id}
              type="button"
              disabled={disabled}
              onClick={() => onSelectLayer(layer.id)}
              className={`px-4 py-1.5 rounded-xl font-mono text-xs font-bold transition-all select-none border ${
                isActive
                  ? 'bg-amber-500 border-amber-400 text-zinc-950 shadow-[0_0_15px_rgba(245,158,11,0.3)]'
                  : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
              } ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <span className="opacity-60 mr-1.5">L{layer.id}</span>
              <span>{layer.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
