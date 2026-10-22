import React from 'react';
import { Battery, Cpu, Layers } from 'lucide-react';

export interface StatusBarProps {
  connected: boolean;
  activeLayer: number;
}

export const StatusBar: React.FC<StatusBarProps> = ({ connected, activeLayer }) => {
  return (
    <footer className="h-9 border-t border-zinc-800/80 bg-zinc-950 px-6 flex items-center justify-between text-[11px] font-mono text-zinc-400 select-none">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5">
          <span className={`w-2 h-2 rounded-full ${connected ? 'bg-emerald-400 shadow-emerald-400/50' : 'bg-zinc-600'}`} />
          <span>{connected ? 'CDC-ACM Serial @ 115200' : 'Disconnected'}</span>
        </div>
        {connected && (
          <div className="flex items-center gap-1 text-zinc-400">
            <Layers className="w-3.5 h-3.5" />
            <span>Active Layer: {activeLayer}</span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-4 text-zinc-400">
        <div className="flex items-center gap-1">
          <Cpu className="w-3.5 h-3.5" />
          <span>ZMK Studio Protocol v1</span>
        </div>
        <div className="flex items-center gap-1">
          <Battery className="w-3.5 h-3.5" />
          <span>Battery: 85%</span>
        </div>
      </div>
    </footer>
  );
};
