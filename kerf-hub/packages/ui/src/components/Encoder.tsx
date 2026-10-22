import React from 'react';

export interface EncoderProps {
  label?: string;
  clockwise?: string;
  counterClockwise?: string;
  onClick?: () => void;
  selected?: boolean;
}

export const Encoder: React.FC<EncoderProps> = ({
  label = 'ENC',
  clockwise = 'Vol +',
  counterClockwise = 'Vol -',
  onClick,
  selected = false,
}) => {
  return (
    <div
      onClick={onClick}
      className={`flex flex-col items-center justify-center p-2 rounded-xl border transition-all cursor-pointer select-none ${
        selected
          ? 'bg-amber-500/20 border-amber-400 text-amber-300'
          : 'bg-zinc-800/80 border-zinc-700/80 text-zinc-300 hover:border-zinc-500'
      }`}
    >
      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-zinc-700 to-zinc-900 border-2 border-zinc-600 shadow-inner flex items-center justify-center relative">
        {/* Knurled encoder ridges */}
        <div className="absolute inset-1 rounded-full border border-dashed border-zinc-500/40" />
        <div className="w-3 h-3 rounded-full bg-amber-400/80 shadow-glow" />
      </div>
      <div className="mt-1 text-[10px] font-mono text-zinc-400 text-center leading-tight">
        <div>{label}</div>
        <div className="text-[9px] text-zinc-500">↺ {counterClockwise} | ↻ {clockwise}</div>
      </div>
    </div>
  );
};
