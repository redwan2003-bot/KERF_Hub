import React from 'react';
import { KeymapLayer } from '@kerf/core';

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
    <div className="flex items-center gap-2 p-1.5 rounded-xl bg-zinc-900 border border-zinc-800">
      <span className="text-xs font-mono text-zinc-500 px-2 font-medium">LAYERS:</span>
      <div className="flex gap-1.5">
        {layers.map((layer) => (
          <button
            key={layer.id}
            type="button"
            disabled={disabled}
            onClick={() => onSelectLayer(layer.id)}
            className={`px-3 py-1.5 rounded-lg font-mono text-xs font-semibold transition-all ${
              activeLayerId === layer.id
                ? 'bg-amber-500 text-zinc-950 shadow-md shadow-amber-500/20'
                : 'bg-zinc-800 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-750'
            }`}
          >
            {layer.id}: {layer.name}
          </button>
        ))}
      </div>
    </div>
  );
};
