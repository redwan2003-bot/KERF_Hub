import React from 'react';

export interface KeyCapProps {
  label: string;
  sublabel?: string;
  category?: 'alpha' | 'numeric' | 'mod' | 'nav' | 'media' | 'layer' | 'kerf' | 'macro' | 'accent' | 'transparent';
  selected?: boolean;
  disabled?: boolean;
  width?: number; // in units (e.g. 1 = 1U, 2 = 2U)
  height?: number;
  onClick?: () => void;
}

export const KeyCap: React.FC<KeyCapProps> = ({
  label,
  sublabel,
  category = 'alpha',
  selected = false,
  disabled = false,
  width = 1,
  height = 1,
  onClick,
}) => {
  const baseSize = 54;
  const pixelWidth = Math.round(width * baseSize + (width - 1) * 6);
  const pixelHeight = Math.round(height * baseSize);

  // High-craft mechanical keycap color styles based on authentic custom keyboard sets
  const getCategoryStyles = () => {
    if (selected) {
      return {
        dish: 'bg-gradient-to-b from-amber-500/30 via-zinc-900 to-zinc-950 text-amber-300 border-amber-400 shadow-[inset_0_1px_0_rgba(251,191,36,0.4)] ring-2 ring-amber-400/80',
        skirt: 'border-b-[#78350f] shadow-[0_4px_0_0_#78350f,0_8px_14px_rgba(245,158,11,0.25)]',
      };
    }

    if (category === 'accent') {
      return {
        dish: 'bg-gradient-to-b from-amber-600 via-amber-600 to-amber-700 text-amber-50 border-amber-400/50 shadow-[inset_0_1px_0_rgba(255,255,255,0.3)]',
        skirt: 'border-b-[#451a03] shadow-[0_4px_0_0_#451a03,0_6px_10px_rgba(0,0,0,0.5)]',
      };
    }

    if (category === 'transparent') {
      return {
        dish: 'bg-zinc-950/60 text-zinc-600 border-zinc-800/40 shadow-inner',
        skirt: 'border-b-zinc-950/80 shadow-[0_2px_0_0_#09090b]',
      };
    }

    if (category === 'kerf') {
      return {
        dish: 'bg-gradient-to-b from-amber-950/40 via-zinc-900 to-zinc-950 text-amber-400 border-amber-600/40 shadow-[inset_0_1px_0_rgba(245,158,11,0.2)]',
        skirt: 'border-b-zinc-950 shadow-[0_4px_0_0_#09090b,0_6px_8px_rgba(0,0,0,0.6)]',
      };
    }

    if (category === 'layer') {
      return {
        dish: 'bg-gradient-to-b from-amber-950/50 via-zinc-900 to-zinc-950 text-amber-300 border-amber-500/40 shadow-[inset_0_1px_0_rgba(245,158,11,0.2)]',
        skirt: 'border-b-zinc-950 shadow-[0_4px_0_0_#09090b,0_6px_8px_rgba(0,0,0,0.6)]',
      };
    }

    if (category === 'media') {
      return {
        dish: 'bg-gradient-to-b from-sky-950/40 via-zinc-900 to-zinc-950 text-sky-300 border-sky-600/40 shadow-[inset_0_1px_0_rgba(56,189,248,0.2)]',
        skirt: 'border-b-zinc-950 shadow-[0_4px_0_0_#09090b,0_6px_8px_rgba(0,0,0,0.6)]',
      };
    }

    if (category === 'mod') {
      return {
        dish: 'bg-gradient-to-b from-zinc-850 via-zinc-900 to-zinc-950 text-zinc-300 border-zinc-750/70 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]',
        skirt: 'border-b-black shadow-[0_4px_0_0_#09090b,0_6px_8px_rgba(0,0,0,0.7)]',
      };
    }

    // Default alphas and numerics: Matte PBT Graphite
    return {
      dish: 'bg-gradient-to-b from-zinc-800 via-zinc-800 to-zinc-850 text-zinc-100 border-zinc-700/80 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]',
      skirt: 'border-b-[#09090b] shadow-[0_4px_0_0_#09090b,0_6px_8px_rgba(0,0,0,0.6)]',
    };
  };

  const style = getCategoryStyles();
  const hasSublegend = Boolean(sublabel);

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      style={{ width: `${pixelWidth}px`, height: `${pixelHeight}px` }}
      className={`relative group rounded-lg select-none transition-all duration-75 ease-out outline-none border-t border-l border-r ${
        style.dish
      } ${style.skirt} ${
        disabled
          ? 'opacity-40 cursor-not-allowed'
          : 'cursor-pointer hover:-translate-y-[1px] active:translate-y-[2px] active:shadow-[0_1px_0_0_#09090b,0_2px_4px_rgba(0,0,0,0.5)]'
      }`}
    >
      {/* Sculpted dish surface with subtle PBT tactile texture */}
      <div className="absolute inset-[3px] rounded-[5px] flex flex-col justify-between p-1.5 overflow-hidden pointer-events-none">
        {hasSublegend ? (
          <>
            <div className="flex justify-between items-start w-full">
              <span className="font-mono text-xs font-bold leading-none tracking-tight">
                {label}
              </span>
              <span className="font-mono text-[9px] font-semibold text-zinc-400 leading-none">
                {sublabel}
              </span>
            </div>
            <div />
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full w-full">
            <span
              className={`font-mono font-bold leading-tight truncate max-w-full ${
                label.length > 5 ? 'text-[10px]' : label.length > 3 ? 'text-[11px]' : 'text-xs'
              }`}
            >
              {label}
            </span>
          </div>
        )}
      </div>

      {/* Subtle chamfer highlight edge */}
      <div className="absolute inset-0 rounded-lg pointer-events-none ring-1 ring-inset ring-white/5" />
    </button>
  );
};
