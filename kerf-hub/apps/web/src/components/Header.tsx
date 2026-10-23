import React from 'react';
import { Lock, Unlock, Usb } from 'lucide-react';

export interface HeaderProps {
  connected: boolean;
  locked: boolean;
  deviceName: string;
  modelId: string;
  onSelectDevice: (modelId: 'kerf-lp63' | 'kerf-macropad' | 'kerf-mouse') => void;
  onConnect: () => void;
  onDisconnect: () => void;
  onUnlockClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  connected,
  locked,
  deviceName,
  modelId,
  onSelectDevice,
  onConnect,
  onDisconnect,
  onUnlockClick,
}) => {
  return (
    <header className="h-16 border-b border-zinc-800/90 bg-zinc-950/90 backdrop-blur-md px-6 flex items-center justify-between z-20">
      {/* Brand & Hardware Target Selector */}
      <div className="flex items-center gap-4">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-600/10 border border-amber-500/40 flex items-center justify-center font-mono font-black text-amber-400 text-base shadow-sm">
          K
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-sm font-bold tracking-wider text-zinc-100 font-mono">
              KERF HUB
            </h1>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-800/80 border border-zinc-700/80 text-zinc-300 font-mono font-medium">
              v1.0.0
            </span>
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <select
              value={modelId}
              onChange={(e) => onSelectDevice(e.target.value as any)}
              className="bg-zinc-900 border border-zinc-750 text-[11px] font-mono text-zinc-200 rounded-md px-2 py-0.5 focus:outline-none focus:border-amber-400 transition-colors cursor-pointer"
            >
              <option value="kerf-lp63">kerf_keeb LP63 (Low Profile 65%)</option>
              <option value="kerf-macropad">Kerf Pad 16 (Macro Pad)</option>
              <option value="kerf-mouse">Kerf Precision (Wireless Mouse)</option>
            </select>

            {/* Hardware Link Status Pill */}
            {connected ? (
              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>WebHID Live • {deviceName}</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[10px] font-mono font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                <span>Interactive Sandbox Simulator</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Action Controls: WebHID Connect, Unlock, Disconnect */}
      <div className="flex items-center gap-3">
        {connected ? (
          <>
            <button
              type="button"
              onClick={onUnlockClick}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all border shadow-sm ${
                locked
                  ? 'bg-rose-500/15 border-rose-500/40 text-rose-300 hover:bg-rose-500/25'
                  : 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
              }`}
            >
              {locked ? <Lock className="w-3.5 h-3.5 text-rose-400" /> : <Unlock className="w-3.5 h-3.5 text-emerald-400" />}
              {locked ? 'LOCKED (Fn+Bksp)' : 'AUTHORIZED'}
            </button>

            <button
              type="button"
              onClick={onDisconnect}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-750 hover:bg-zinc-800 text-zinc-300 text-xs font-mono font-semibold transition-colors shadow-sm"
            >
              <Usb className="w-3.5 h-3.5" />
              Disconnect
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={onConnect}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 text-xs font-mono font-bold shadow-[0_0_20px_rgba(245,158,11,0.25)] transition-all active:scale-95"
          >
            <Usb className="w-4 h-4 stroke-[2.5]" />
            Connect USB Keyboard
          </button>
        )}
      </div>
    </header>
  );
};
