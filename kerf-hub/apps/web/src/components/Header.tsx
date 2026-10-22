import React from 'react';
import { Lock, Unlock, Usb } from 'lucide-react';

export interface HeaderProps {
  connected: boolean;
  locked: boolean;
  deviceName: string;
  onConnect: () => void;
  onDisconnect: () => void;
  onUnlockClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  connected,
  locked,
  deviceName,
  onConnect,
  onDisconnect,
  onUnlockClick,
}) => {
  return (
    <header className="h-16 border-b border-zinc-800 bg-zinc-900/60 backdrop-blur-md px-6 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center font-mono font-bold text-amber-400">
          K
        </div>
        <div>
          <h1 className="text-sm font-bold tracking-wide text-zinc-100 flex items-center gap-2">
            KERF HUB <span className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400 font-mono">v1.0-alpha</span>
          </h1>
          <p className="text-[11px] font-mono text-zinc-400">{connected ? deviceName : 'No device connected'}</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {connected ? (
          <>
            <button
              type="button"
              onClick={onUnlockClick}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-colors border ${
                locked
                  ? 'bg-rose-500/10 border-rose-500/30 text-rose-300 hover:bg-rose-500/20'
                  : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
              }`}
            >
              {locked ? <Lock className="w-3.5 h-3.5 text-rose-400" /> : <Unlock className="w-3.5 h-3.5 text-emerald-400" />}
              {locked ? 'LOCKED' : 'UNLOCKED'}
            </button>

            <button
              type="button"
              onClick={onDisconnect}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 border border-zinc-700 hover:bg-zinc-700 text-zinc-300 text-xs font-mono font-medium transition-colors"
            >
              <Usb className="w-3.5 h-3.5" />
              Disconnect
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={onConnect}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-mono font-bold shadow-lg shadow-amber-500/20 transition-all active:scale-95"
          >
            <Usb className="w-4 h-4" />
            Connect Keyboard
          </button>
        )}
      </div>
    </header>
  );
};
