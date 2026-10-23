import React from 'react';
import { PowerConfig } from '@kerf/protocol';
import { Zap, Clock, BatteryMedium, Cpu } from 'lucide-react';

export interface PowerEditorProps {
  power: PowerConfig;
  batteryPercent?: number;
  isCharging?: boolean;
  onChangePower: (cfg: Partial<PowerConfig>) => void;
  disabled?: boolean;
}

export const PowerEditor: React.FC<PowerEditorProps> = ({
  power,
  batteryPercent = 88,
  isCharging = false,
  onChangePower,
  disabled = false,
}) => {
  return (
    <div className="max-w-4xl w-full flex flex-col gap-6 animate-in fade-in duration-200">
      {/* Battery State Widget */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <BatteryMedium className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-mono text-zinc-400">State of Charge</div>
            <div className="text-xl font-bold font-mono text-zinc-100">{batteryPercent}%</div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <Zap className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-mono text-zinc-400">Power Status</div>
            <div className="text-sm font-bold font-mono text-zinc-100">
              {isCharging ? 'Charging (VBUS)' : 'Battery (LiPo)'}
            </div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <Cpu className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-mono text-zinc-400">Estimated Run Time</div>
            <div className="text-sm font-bold font-mono text-zinc-100">~ 240 Hours</div>
          </div>
        </div>
      </div>

      {/* Performance & Debounce */}
      <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 shadow-xl flex flex-col gap-6">
        <div className="flex items-center gap-2.5 border-b border-zinc-800/80 pb-4">
          <Zap className="w-5 h-5 text-amber-400" />
          <div>
            <h2 className="text-sm font-bold text-zinc-100">Switch Debounce & Matrix Scan</h2>
            <p className="text-xs text-zinc-400 font-mono">Row2col 74HC595 matrix debounce algorithm</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-zinc-400">Press Debounce:</span>
              <span className="text-amber-400 font-bold">{power.debouncePressMs} ms</span>
            </div>
            <input
              type="range"
              min={1}
              max={20}
              value={power.debouncePressMs}
              disabled={disabled}
              onChange={(e) => onChangePower({ debouncePressMs: Number(e.target.value) })}
              className="w-full h-2 rounded-lg bg-zinc-800 accent-amber-500 cursor-pointer"
            />
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-zinc-400">Release Debounce:</span>
              <span className="text-amber-400 font-bold">{power.debounceReleaseMs} ms</span>
            </div>
            <input
              type="range"
              min={1}
              max={20}
              value={power.debounceReleaseMs}
              disabled={disabled}
              onChange={(e) => onChangePower({ debounceReleaseMs: Number(e.target.value) })}
              className="w-full h-2 rounded-lg bg-zinc-800 accent-amber-500 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Sleep Timeouts */}
      <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 shadow-xl flex flex-col gap-6">
        <div className="flex items-center gap-2.5 border-b border-zinc-800/80 pb-4">
          <Clock className="w-5 h-5 text-indigo-400" />
          <div>
            <h2 className="text-sm font-bold text-zinc-100">Inactivity Sleep Timers</h2>
            <p className="text-xs text-zinc-400 font-mono">Automatic power-saving when inactive</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-zinc-400">Idle Sleep Timeout:</span>
              <span className="text-indigo-400 font-bold">{power.idleTimeoutMs / 1000} s</span>
            </div>
            <input
              type="range"
              min={10000}
              max={120000}
              step={5000}
              value={power.idleTimeoutMs}
              disabled={disabled}
              onChange={(e) => onChangePower({ idleTimeoutMs: Number(e.target.value) })}
              className="w-full h-2 rounded-lg bg-zinc-800 accent-indigo-500 cursor-pointer"
            />
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-zinc-400">Deep Sleep Timeout:</span>
              <span className="text-indigo-400 font-bold">{power.deepSleepTimeoutMs / 60000} min</span>
            </div>
            <input
              type="range"
              min={300000}
              max={3600000}
              step={300000}
              value={power.deepSleepTimeoutMs}
              disabled={disabled}
              onChange={(e) => onChangePower({ deepSleepTimeoutMs: Number(e.target.value) })}
              className="w-full h-2 rounded-lg bg-zinc-800 accent-indigo-500 cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
