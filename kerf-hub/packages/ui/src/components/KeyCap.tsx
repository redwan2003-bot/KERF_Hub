import React from 'react';

export interface KeyCapProps {
  label: string;
  sublabel?: string;
  selected?: boolean;
  disabled?: boolean;
  width?: number; // in units (e.g. 1 = 1U, 2 = 2U)
  height?: number;
  onClick?: () => void;
}

export const KeyCap: React.FC<KeyCapProps> = ({
  label,
  sublabel,
  selected = false,
  disabled = false,
  width = 1,
  height = 1,
  onClick,
}) => {
  const baseWidth = 56;
  const baseHeight = 56;
  const pixelWidth = width * baseWidth + (width - 1) * 6;
  const pixelHeight = height * baseHeight;

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      style={{ width: `${pixelWidth}px`, height: `${pixelHeight}px` }}
      className={`relative group flex flex-col items-center justify-center rounded-lg font-mono text-xs font-semibold transition-all duration-150 shadow-md select-none border ${
        selected
          ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-amber-500/20 scale-[0.98]'
          : 'bg-zinc-800/90 border-zinc-700/80 text-zinc-200 hover:border-zinc-500 hover:bg-zinc-750 active:scale-95'
      } ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}
    >
      {sublabel && (
        <span className="text-[10px] text-zinc-400 font-normal leading-none mb-0.5">
          {sublabel}
        </span>
      )}
      <span className="leading-tight truncate max-w-[90%]">{label}</span>
      <div className="absolute inset-0 rounded-lg pointer-events-none border border-white/5" />
    </button>
  );
};
