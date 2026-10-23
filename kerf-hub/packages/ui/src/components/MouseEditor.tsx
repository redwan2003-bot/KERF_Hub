import React from 'react';
import { PointerConfig, PollingRate, LiftOffDistance } from '@kerf/protocol';
import { Mouse, Crosshair, Cpu, Check, Activity, Sliders, Shield } from 'lucide-react';

export interface MouseEditorProps {
  config: PointerConfig;
  onChangeConfig: (cfg: Partial<PointerConfig>) => void;
  disabled?: boolean;
}

export const MouseEditor: React.FC<MouseEditorProps> = ({
  config,
  onChangeConfig,
  disabled = false,
}) => {
  const handleStageSelect = (stageId: number) => {
    onChangeConfig({ activeStage: stageId });
  };

  const handleDpiChange = (stageId: number, dpi: number) => {
    const clampedDpi = Math.max(50, Math.min(26000, Math.round(dpi / 50) * 50));
    const newStages = config.stages.map((s) =>
      s.stageId === stageId ? { ...s, dpiX: clampedDpi, dpiY: clampedDpi } : s
    );
    onChangeConfig({ stages: newStages });
  };

  const activeStage = config.stages[config.activeStage] || config.stages[0];

  return (
    <div className="w-full max-w-4xl flex flex-col gap-6 animate-in fade-in duration-200">
      {/* Header Card */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 shadow-xl flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg text-amber-400">
            <Mouse className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-zinc-100 flex items-center gap-2">
              Kerf Precision Mouse Sensor
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono">
                PAW3395 (26K DPI)
              </span>
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              Configure DPI stages, 1,000 Hz polling rate, Lift-Off Distance, and Motion Sync tracking.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-950 border border-zinc-800 font-mono text-xs text-zinc-300">
          <Activity className="w-4 h-4 text-emerald-400" />
          <span>Active: <strong className="text-amber-400">{activeStage.dpiX} DPI</strong></span>
        </div>
      </div>

      {/* DPI Stages Ladder */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 shadow-xl flex flex-col gap-4">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <h3 className="text-sm font-bold text-zinc-100 flex items-center gap-2">
            <Crosshair className="w-4 h-4 text-amber-400" />
            DPI Stages (Up to 8 Stages)
          </h3>
          <span className="text-xs text-zinc-400 font-mono">Range: 50 – 26,000 DPI (Step: 50)</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {config.stages.map((stage) => {
            const isActive = stage.stageId === config.activeStage;
            const stageColor = `#${stage.colorHex.toString(16).padStart(6, '0')}`;

            return (
              <div
                key={stage.stageId}
                onClick={() => !disabled && handleStageSelect(stage.stageId)}
                className={`p-4 rounded-xl border flex flex-col gap-3 cursor-pointer transition-all ${
                  isActive
                    ? 'bg-zinc-900 border-amber-500 shadow-lg shadow-amber-500/10'
                    : 'bg-zinc-950/60 border-zinc-800 hover:border-zinc-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-zinc-400 uppercase">
                    Stage {stage.stageId + 1}
                  </span>
                  <div
                    className="w-3.5 h-3.5 rounded-full border border-black/40 shadow-sm"
                    style={{ backgroundColor: stageColor }}
                    title="Stage Color"
                  />
                </div>

                <div className="flex items-baseline justify-between">
                  <span className="text-xl font-bold font-mono text-zinc-100">
                    {stage.dpiX}
                  </span>
                  <span className="text-[10px] text-zinc-500 font-mono">DPI</span>
                </div>

                <input
                  type="range"
                  min="50"
                  max="26000"
                  step="50"
                  value={stage.dpiX}
                  disabled={disabled}
                  onChange={(e) => handleDpiChange(stage.stageId, Number(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Sensor Performance & Tuning */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Polling Rate & LOD */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 shadow-xl flex flex-col gap-4">
          <h4 className="text-xs font-mono uppercase font-bold text-zinc-400 flex items-center gap-2">
            <Cpu className="w-4 h-4 text-cyan-400" />
            Polling Rate (Hz)
          </h4>
          <div className="grid grid-cols-4 gap-2">
            {[
              { label: '125 Hz', val: PollingRate.RATE_125HZ },
              { label: '250 Hz', val: PollingRate.RATE_250HZ },
              { label: '500 Hz', val: PollingRate.RATE_500HZ },
              { label: '1000 Hz', val: PollingRate.RATE_1000HZ },
            ].map((item) => (
              <button
                key={item.label}
                type="button"
                disabled={disabled}
                onClick={() => onChangeConfig({ pollingRate: item.val })}
                className={`py-2 rounded-lg text-xs font-mono font-bold border transition-colors ${
                  config.pollingRate === item.val
                    ? 'bg-amber-500 text-zinc-950 border-amber-400'
                    : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <h4 className="text-xs font-mono uppercase font-bold text-zinc-400 mt-2 flex items-center gap-2">
            <Sliders className="w-4 h-4 text-emerald-400" />
            Lift-Off Distance (LOD)
          </h4>
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: '1.0 mm (Low)', val: LiftOffDistance.LOD_1MM },
              { label: '2.0 mm (High)', val: LiftOffDistance.LOD_2MM },
            ].map((item) => (
              <button
                key={item.label}
                type="button"
                disabled={disabled}
                onClick={() => onChangeConfig({ lod: item.val })}
                className={`py-2 rounded-lg text-xs font-mono font-bold border transition-colors ${
                  config.lod === item.val
                    ? 'bg-cyan-500 text-zinc-950 border-cyan-400'
                    : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tracking Filters */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 shadow-xl flex flex-col gap-3">
          <h4 className="text-xs font-mono uppercase font-bold text-zinc-400 flex items-center gap-2">
            <Shield className="w-4 h-4 text-amber-400" />
            Sensor Enhancements
          </h4>

          {[
            {
              key: 'motionSync',
              label: 'Motion Sync',
              desc: 'Synchronizes sensor SPI readout with USB SOF polls for ultra-smooth tracking.',
            },
            {
              key: 'rippleControl',
              label: 'Ripple Control',
              desc: 'High-DPI jitter suppression filter for smoothing cursor trembling.',
            },
            {
              key: 'angleSnapping',
              label: 'Angle Snapping',
              desc: 'Predictive horizontal and vertical line straightening.',
            },
          ].map((item) => {
            const isChecked = (config as any)[item.key];
            return (
              <button
                key={item.key}
                type="button"
                disabled={disabled}
                onClick={() => onChangeConfig({ [item.key]: !isChecked })}
                className={`p-3 rounded-lg border flex items-start justify-between text-left transition-colors ${
                  isChecked
                    ? 'bg-amber-500/10 border-amber-500/30'
                    : 'bg-zinc-950/60 border-zinc-800 hover:border-zinc-700'
                }`}
              >
                <div>
                  <div className="text-xs font-bold text-zinc-200">{item.label}</div>
                  <div className="text-[11px] text-zinc-400 mt-0.5 leading-snug">{item.desc}</div>
                </div>
                {isChecked && <Check className="w-4 h-4 text-amber-400 shrink-0 ml-2" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
