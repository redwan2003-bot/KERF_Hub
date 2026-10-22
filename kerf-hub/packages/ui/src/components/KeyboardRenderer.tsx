import React from 'react';
import { KeyCap } from './KeyCap';
import { Encoder } from './Encoder';
import { DEFAULT_KEY_LABELS } from '../key-labels';
import { KeymapLayer } from '@kerf/core';

export interface KeyboardRendererProps {
  currentLayer: KeymapLayer;
  selectedKeyIndex: number | null;
  onSelectKey: (keyIndex: number) => void;
  isLocked?: boolean;
}

export const KeyboardRenderer: React.FC<KeyboardRendererProps> = ({
  currentLayer,
  selectedKeyIndex,
  onSelectKey,
  isLocked = false,
}) => {
  // 65 keys laid out in 5 rows of 13 keys
  const rows = [
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    [13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25],
    [26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38],
    [39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51],
    [52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64],
  ];

  const getKeyLabel = (index: number): string => {
    const custom = currentLayer?.bindings[index];
    if (custom?.behaviorId) {
      if (custom.behaviorId === 'trans') return '▽';
      return custom.behaviorId.toUpperCase();
    }
    return DEFAULT_KEY_LABELS[index] || `K${index}`;
  };

  return (
    <div className="relative p-6 rounded-2xl bg-zinc-900/90 border border-zinc-800 shadow-2xl backdrop-blur-md flex flex-col items-center">
      {/* Keyboard Case Simulation */}
      <div className="relative p-4 rounded-xl bg-zinc-950 border border-zinc-800/80 shadow-inner flex flex-col gap-2">
        {/* Nice!view Screen Display placeholder area */}
        <div className="flex justify-between items-center px-2 py-1 mb-2 border-b border-zinc-800/60">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-mono text-xs text-zinc-400 font-medium">kerf_keeb LP63</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="px-2 py-0.5 rounded bg-zinc-800/80 border border-zinc-700 text-[10px] font-mono text-zinc-400">
              nice!view (160×68)
            </div>
          </div>
        </div>

        {/* 5 Rows of Keycaps */}
        {rows.map((row, rowIndex) => (
          <div key={rowIndex} className="flex gap-1.5 items-center justify-center">
            {row.map((keyIndex) => {
              const isSpace = keyIndex === 55; // 2U space on bottom row
              return (
                <KeyCap
                  key={keyIndex}
                  label={getKeyLabel(keyIndex)}
                  width={isSpace ? 2 : 1}
                  selected={selectedKeyIndex === keyIndex}
                  disabled={isLocked}
                  onClick={() => onSelectKey(keyIndex)}
                />
              );
            })}
          </div>
        ))}
      </div>

      {/* Rotary Encoder Area */}
      <div className="mt-4 flex items-center justify-between w-full px-4">
        <span className="text-xs font-mono text-zinc-500">EC12 Rotary Encoder:</span>
        <Encoder
          label="Volume Dial"
          selected={selectedKeyIndex === 99}
          onClick={() => onSelectKey(99)}
        />
      </div>
    </div>
  );
};
