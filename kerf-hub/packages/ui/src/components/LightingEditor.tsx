import React from 'react';
import { UnderglowConfig, BatledConfig } from '@kerf/protocol';
import { BatteryCharging, Palette } from 'lucide-react';

export interface LightingEditorProps {
  underglow: UnderglowConfig;
  batled: BatledConfig;
  onChangeUnderglow: (cfg: Partial<UnderglowConfig>) => void;
  onChangeBatled: (cfg: Partial<BatledConfig>) => void;
  disabled?: boolean;
}

export const LightingEditor: React.FC<LightingEditorProps> = ({
  underglow,
  batled,
  onChangeUnderglow,
  onChangeBatled,
  disabled = false,
}) => {
  const effects = [
    { id: 0, label: 'Solid Color' },
    { id: 1, label: 'Breathe' },
    { id: 2, label: 'Spectrum Cycle' },
    { id: 3, label: 'Rainbow Wave' },
  ];

  return (
    <div className="max-w-4xl w-full flex flex-col gap-6 animate-in fade-in duration-200">
      {/* Underglow Section */}
      <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 shadow-xl flex flex-col gap-6">
        <div className="flex justify-between items-center border-b border-zinc-800/80 pb-4">
          <div className="flex items-center gap-2.5">
            <Palette className="w-5 h-5 text-amber-400" />
            <div>
              <h2 className="text-sm font-bold text-zinc-100">RGB Underglow (8 LEDs)</h2>
              <p className="text-xs text-zinc-400 font-mono">WS2812B chain on SPI1 MOSI (D19 / P0.02)</p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={underglow.on}
              disabled={disabled}
              onChange={(e) => onChangeUnderglow({ on: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
          </label>
        </div>

        {/* HSB Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex flex-col gap-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-zinc-400">Hue:</span>
              <span className="text-amber-400 font-bold">{underglow.hue}°</span>
            </div>
            <input
              type="range"
              min={0}
              max={360}
              value={underglow.hue}
              disabled={disabled || !underglow.on}
              onChange={(e) => onChangeUnderglow({ hue: Number(e.target.value) })}
              className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-gradient-to-r from-red-500 via-green-500 via-blue-500 to-red-500"
            />
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-zinc-400">Saturation:</span>
              <span className="text-amber-400 font-bold">{underglow.saturation}%</span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={underglow.saturation}
              disabled={disabled || !underglow.on}
              onChange={(e) => onChangeUnderglow({ saturation: Number(e.target.value) })}
              className="w-full h-2 rounded-lg bg-zinc-800 accent-amber-500 cursor-pointer"
            />
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-zinc-400">Brightness:</span>
              <span className="text-amber-400 font-bold">{underglow.brightness}%</span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={underglow.brightness}
              disabled={disabled || !underglow.on}
              onChange={(e) => onChangeUnderglow({ brightness: Number(e.target.value) })}
              className="w-full h-2 rounded-lg bg-zinc-800 accent-amber-500 cursor-pointer"
            />
          </div>
        </div>

        {/* Effects */}
        <div className="flex flex-col gap-2">
          <span className="text-xs font-mono text-zinc-400">Underglow Effect:</span>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {effects.map((fx) => (
              <button
                key={fx.id}
                type="button"
                disabled={disabled || !underglow.on}
                onClick={() => onChangeUnderglow({ effect: fx.id })}
                className={`py-2 px-3 rounded-xl border font-mono text-xs font-medium transition-all ${
                  underglow.effect === fx.id
                    ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                    : 'bg-zinc-800/80 border-zinc-700/80 text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {fx.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* BatLED Section */}
      <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 shadow-xl flex flex-col gap-6">
        <div className="flex items-center gap-2.5 border-b border-zinc-800/80 pb-4">
          <BatteryCharging className="w-5 h-5 text-emerald-400" />
          <div>
            <h2 className="text-sm font-bold text-zinc-100">Battery Status LED9 (&batled)</h2>
            <p className="text-xs text-zinc-400 font-mono">WS2812B-Mini on pixel 9 (Fn+Esc event-source)</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex flex-col gap-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-zinc-400">Tap Show Duration:</span>
              <span className="text-emerald-400 font-bold">{batled.tapMs} ms</span>
            </div>
            <input
              type="range"
              min={500}
              max={3000}
              step={100}
              value={batled.tapMs}
              disabled={disabled}
              onChange={(e) => onChangeBatled({ tapMs: Number(e.target.value) })}
              className="w-full h-2 rounded-lg bg-zinc-800 accent-emerald-500 cursor-pointer"
            />
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-zinc-400">Max Hold Cap:</span>
              <span className="text-emerald-400 font-bold">{batled.maxHoldMs / 1000} s</span>
            </div>
            <input
              type="range"
              min={3000}
              max={15000}
              step={1000}
              value={batled.maxHoldMs}
              disabled={disabled}
              onChange={(e) => onChangeBatled({ maxHoldMs: Number(e.target.value) })}
              className="w-full h-2 rounded-lg bg-zinc-800 accent-emerald-500 cursor-pointer"
            />
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-zinc-400">Low Battery Warn %:</span>
              <span className="text-emerald-400 font-bold">{batled.lowPercent}%</span>
            </div>
            <input
              type="range"
              min={5}
              max={25}
              value={batled.lowPercent}
              disabled={disabled}
              onChange={(e) => onChangeBatled({ lowPercent: Number(e.target.value) })}
              className="w-full h-2 rounded-lg bg-zinc-800 accent-emerald-500 cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
