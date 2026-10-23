import React from 'react';
import { KeyCap } from './KeyCap';
import { Encoder } from './Encoder';
import { getKeyDisplayInfo } from '../key-labels';
import { KeymapLayer } from '@kerf/core';
import { Battery, Bluetooth } from 'lucide-react';

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
  // 65 keys laid out in 5 rows of 13 columns (ByranTK LP63 ortholinear matrix)
  const rows = [
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    [13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25],
    [26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38],
    [39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51],
    [52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64],
  ];

  const layerName = currentLayer?.name || (currentLayer?.id === 1 ? 'Function' : 'Default');

  return (
    <div className="relative p-6 rounded-3xl bg-gradient-to-b from-zinc-900 via-zinc-900 to-zinc-950 border-2 border-zinc-800/90 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9),inset_0_1px_1px_rgba(255,255,255,0.08)] flex flex-col items-center max-w-5xl w-full">
      {/* CNC Case Top Bar: Chassis Branding, nice!view Memory LCD, and Rotary Encoder */}
      <div className="w-full flex items-center justify-between pb-4 mb-4 border-b border-zinc-800/80 px-2">
        {/* Chassis Badge */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-600/5 border border-amber-500/30 flex items-center justify-center font-mono font-black text-amber-400 text-sm shadow-inner">
            K
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm font-bold text-zinc-100 tracking-wide">
                kerf_keeb LP63
              </span>
              <span className="px-1.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono text-[10px] font-bold">
                Low Profile 65%
              </span>
            </div>
            <div className="flex items-center gap-3 text-[10px] font-mono text-zinc-400 mt-0.5">
              <span>nice!nano v2</span>
              <span>•</span>
              <span>13×5 Matrix</span>
              <span>•</span>
              <span className="text-zinc-500">EC12 Encoder</span>
            </div>
          </div>
        </div>

        {/* Authentic nice!view (160×68 Sharp Memory LCD) Inset Display */}
        <div className="relative px-3.5 py-1.5 rounded-lg bg-zinc-950 border-2 border-zinc-800 shadow-[inset_0_2px_5px_rgba(0,0,0,0.9)] flex items-center gap-4">
          <div className="flex flex-col border-r border-zinc-800/80 pr-3">
            <div className="flex items-center gap-1.5 text-emerald-400 font-mono text-[10px] font-bold tracking-wider">
              <Bluetooth className="w-3 h-3" />
              <span>BT:0 PAIRED</span>
            </div>
            <span className="font-mono text-[9px] text-zinc-400">KERF-LP63</span>
          </div>

          <div className="flex flex-col items-center px-1">
            <span className="font-mono text-[9px] text-zinc-400 uppercase font-semibold">
              ACTIVE LAYER
            </span>
            <span className="font-mono text-xs font-black text-amber-400 tracking-wide">
              {currentLayer?.id === 1 ? 'L1: FUNCTION' : 'L0: DEFAULT'}
            </span>
          </div>

          <div className="flex flex-col items-end border-l border-zinc-800/80 pl-3">
            <div className="flex items-center gap-1 text-emerald-400 font-mono text-[10px] font-bold">
              <Battery className="w-3.5 h-3.5" />
              <span>88%</span>
            </div>
            <span className="font-mono text-[9px] text-zinc-400 font-mono">3.92V • OK</span>
          </div>

          {/* Glare reflection overlay for realistic glass screen */}
          <div className="absolute inset-0 rounded-lg pointer-events-none bg-gradient-to-tr from-transparent via-white/[0.03] to-white/[0.07]" />
        </div>

        {/* Integrated EC12 Rotary Dial */}
        <Encoder
          label="Volume & Media Dial"
          clockwise="Vol +"
          counterClockwise="Vol -"
          selected={selectedKeyIndex === 99}
          onClick={() => onSelectKey(99)}
        />
      </div>

      {/* Recessed Switch Plate with 65 Sculpted Keycaps */}
      <div className="relative p-3 rounded-2xl bg-zinc-950 border border-zinc-800/90 shadow-[inset_0_4px_16px_rgba(0,0,0,0.95)] flex flex-col gap-2">
        {/* CNC Plate Mounting Corner Screws */}
        <div className="absolute top-2 left-2 w-2 h-2 rounded-full bg-zinc-800 border border-zinc-700 shadow-inner" />
        <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-zinc-800 border border-zinc-700 shadow-inner" />
        <div className="absolute bottom-2 left-2 w-2 h-2 rounded-full bg-zinc-800 border border-zinc-700 shadow-inner" />
        <div className="absolute bottom-2 right-2 w-2 h-2 rounded-full bg-zinc-800 border border-zinc-700 shadow-inner" />

        {/* 5 Rows of Sculpted 3D PBT Keycaps */}
        {rows.map((row, rowIndex) => (
          <div key={rowIndex} className="flex gap-1.5 items-center justify-center">
            {row.map((keyIndex) => {
              const isSpace = keyIndex === 55; // 2U space on bottom row
              const binding = currentLayer?.bindings[keyIndex];
              const info = getKeyDisplayInfo(keyIndex, binding);

              return (
                <KeyCap
                  key={keyIndex}
                  label={info.label}
                  sublabel={info.sublabel}
                  category={info.category}
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

      {/* Chassis Bottom Plate Standoff and Layer Legend */}
      <div className="w-full flex items-center justify-between mt-4 px-3 text-[11px] font-mono text-zinc-400">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          <span>Active Layer: <strong className="text-zinc-200">{layerName}</strong></span>
          <span className="text-zinc-500">({currentLayer?.bindings?.length || 65} physical keys mapped)</span>
        </div>

        <div className="flex items-center gap-4 text-zinc-400">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-amber-600 border border-amber-400/60" />
            <span>Accent</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-zinc-800 border border-zinc-700" />
            <span>Alpha</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-zinc-900 border border-zinc-750" />
            <span>Modifier</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-amber-950/60 border border-amber-600/50" />
            <span>Kerf / Fn</span>
          </div>
        </div>
      </div>
    </div>
  );
};
