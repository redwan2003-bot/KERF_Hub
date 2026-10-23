import React, { useState } from 'react';
import { RotateCcw, RotateCw, Volume2 } from 'lucide-react';

export interface EncoderProps {
  label?: string;
  clockwise?: string;
  counterClockwise?: string;
  onClick?: () => void;
  selected?: boolean;
}

export const Encoder: React.FC<EncoderProps> = ({
  label = 'EC12 Rotary Dial',
  clockwise = 'Vol +',
  counterClockwise = 'Vol -',
  onClick,
  selected = false,
}) => {
  const [rotation, setRotation] = useState(0);

  const handleTurnCCW = (e: React.MouseEvent) => {
    e.stopPropagation();
    setRotation((r) => r - 15);
  };

  const handleTurnCW = (e: React.MouseEvent) => {
    e.stopPropagation();
    setRotation((r) => r + 15);
  };

  return (
    <div
      onClick={onClick}
      className={`group relative flex items-center gap-3 px-3 py-2 rounded-xl transition-all select-none border cursor-pointer ${
        selected
          ? 'bg-amber-500/10 border-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.25)]'
          : 'bg-zinc-900/90 border-zinc-800 hover:border-zinc-700 shadow-md'
      }`}
    >
      {/* Turn CCW Button */}
      <button
        type="button"
        title={`Turn Left: ${counterClockwise}`}
        onClick={handleTurnCCW}
        className="w-7 h-7 rounded-lg bg-zinc-800/90 hover:bg-zinc-700 active:scale-90 border border-zinc-700/80 text-zinc-300 flex items-center justify-center transition-all"
      >
        <RotateCcw className="w-3.5 h-3.5" />
      </button>

      {/* CNC Knurled Aluminum Knob */}
      <div className="relative flex items-center justify-center">
        {/* Outer Knurled Rim */}
        <div
          style={{ transform: `rotate(${rotation}deg)` }}
          className="w-12 h-12 rounded-full bg-zinc-950 p-1 border-2 border-zinc-700 shadow-[0_3px_6px_rgba(0,0,0,0.7),inset_0_1px_2px_rgba(255,255,255,0.15)] flex items-center justify-center transition-transform duration-150 ease-out"
        >
          {/* Radial Knurled Ridges */}
          <div className="w-full h-full rounded-full bg-gradient-to-tr from-zinc-800 via-zinc-700 to-zinc-900 border border-zinc-600 flex items-center justify-center relative shadow-inner">
            {/* Concentric brushed chamfer ring */}
            <div className="w-7 h-7 rounded-full bg-zinc-900 border border-zinc-600/70 shadow-inner flex items-center justify-center">
              <Volume2 className="w-3 h-3 text-amber-400" />
            </div>

            {/* Machined Indicator Notch */}
            <div className="absolute top-0.5 w-1 h-2 rounded-full bg-amber-400 shadow-[0_0_4px_#f59e0b]" />
          </div>
        </div>
      </div>

      {/* Turn CW Button */}
      <button
        type="button"
        title={`Turn Right: ${clockwise}`}
        onClick={handleTurnCW}
        className="w-7 h-7 rounded-lg bg-zinc-800/90 hover:bg-zinc-700 active:scale-90 border border-zinc-700/80 text-zinc-300 flex items-center justify-center transition-all"
      >
        <RotateCw className="w-3.5 h-3.5" />
      </button>

      {/* Description & Binding Details */}
      <div className="flex flex-col pr-1">
        <span className="font-mono text-xs font-bold text-zinc-200 leading-tight">
          {label}
        </span>
        <span className="font-mono text-[10px] text-zinc-400 leading-tight">
          ↺ {counterClockwise} | ↻ {clockwise}
        </span>
      </div>
    </div>
  );
};
