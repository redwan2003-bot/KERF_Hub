import React from 'react';
import { Battery, Cpu, Layers, Terminal } from 'lucide-react';

export interface StatusBarProps {
  connected: boolean;
  activeLayer: number;
}

export const StatusBar: React.FC<StatusBarProps> = ({ connected, activeLayer }) => {
  return (
    <footer className="h-9 border-t border-zinc-800/80 bg-zinc-950 px-6 flex items-center justify-between text-[11px] font-mono text-zinc-400 select-none z-10">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5">
          <span
            className={`w-2 h-2 rounded-full ${
              connected ? 'bg-emerald-400 shadow-[0_0_8px_#34d399]' : 'bg-amber-400/80'
            }`}
          />
          <span className="font-medium text-zinc-300">
            {connected ? 'WebHID Live • ZMK Studio RPC' : 'Simulator Mode (In-Memory)'}
          </span>
        </div>
        <div className="flex items-center gap-1 text-zinc-400">
          <Layers className="w-3.5 h-3.5" />
          <span>Layer: {activeLayer === 1 ? '1 (Function)' : '0 (Default)'}</span>
        </div>
      </div>

      <div className="flex items-center gap-5 text-zinc-400">
        <div className="flex items-center gap-1.5">
          <Cpu className="w-3.5 h-3.5 text-zinc-500" />
          <span>Nordic nRF52840</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Terminal className="w-3.5 h-3.5 text-zinc-500" />
          <span>Kerf Protocol v1.0</span>
        </div>
        <div className="flex items-center gap-1.5 text-emerald-400">
          <Battery className="w-3.5 h-3.5" />
          <span>88% (3.92V)</span>
        </div>
      </div>
    </footer>
  );
};
