import React, { useState, useRef } from 'react';
import { ProfileData } from '@kerf/protocol';
import { Layers, Download, Upload, Check, Sparkles, Zap, Shield } from 'lucide-react';

export interface ProfileManagerProps {
  profiles: ProfileData[];
  activeProfileId: number;
  onActivateProfile: (profileId: number) => void;
  onSaveProfile: (profile: ProfileData) => void;
  onExportProfile: (profileId: number) => void;
  onImportProfile: (profileId: number, jsonString: string) => void;
  disabled?: boolean;
}

export const ProfileManager: React.FC<ProfileManagerProps> = ({
  profiles,
  activeProfileId,
  onActivateProfile,
  onSaveProfile,
  onExportProfile,
  onImportProfile,
  disabled = false,
}) => {
  const [selectedSlot, setSelectedSlot] = useState<number>(activeProfileId);
  const activeProfile = profiles[selectedSlot] || profiles[0];
  const [editingName, setEditingName] = useState<string>(activeProfile.name);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSlotSelect = (id: number) => {
    setSelectedSlot(id);
    if (profiles[id]) {
      setEditingName(profiles[id].name);
    }
  };

  const handleNameSave = () => {
    if (!activeProfile) return;
    onSaveProfile({
      ...activeProfile,
      name: editingName.trim() || `Profile ${selectedSlot + 1}`,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        try {
          onImportProfile(selectedSlot, content);
          alert(`Successfully imported profile into Slot ${selectedSlot + 1}!`);
        } catch (err: any) {
          alert(`Failed to import profile: ${err.message}`);
        }
      }
    };
    reader.readAsText(file);
    if (e.target) e.target.value = '';
  };

  return (
    <div className="w-full max-w-4xl flex flex-col gap-6 animate-in fade-in duration-200">
      {/* Hidden file input for .kerfprofile import */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".kerfprofile,.json"
        className="hidden"
      />

      {/* Header card */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 shadow-xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg text-amber-400">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-zinc-100 flex items-center gap-2">
              Onboard Profiles
              <span className="text-xs px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 font-mono">
                3 Slots
              </span>
            </h2>
            <p className="text-xs text-zinc-400">
              Switch entire keyboard configurations (lighting, debounce, sleep, macros) on the fly.
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => onExportProfile(selectedSlot)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-mono font-medium border border-zinc-700 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-amber-400" />
            Export .kerfprofile
          </button>
          <button
            type="button"
            disabled={disabled}
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-mono font-medium border border-zinc-700 disabled:opacity-50 transition-colors"
          >
            <Upload className="w-3.5 h-3.5 text-cyan-400" />
            Import File
          </button>
        </div>
      </div>

      {/* Profile Slot Selector */}
      <div className="grid grid-cols-3 gap-4">
        {profiles.map((p, idx) => {
          const isActive = idx === activeProfileId;
          const isSelected = idx === selectedSlot;

          return (
            <button
              key={p.profileId}
              type="button"
              onClick={() => handleSlotSelect(idx)}
              className={`p-4 rounded-xl border flex flex-col items-start gap-2 text-left transition-all relative ${
                isSelected
                  ? 'bg-zinc-900 border-amber-500 shadow-lg shadow-amber-500/5'
                  : 'bg-zinc-900/60 border-zinc-800 hover:border-zinc-700'
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <span className="text-xs font-mono text-zinc-500 font-bold uppercase">
                  Slot {idx + 1}
                </span>
                {isActive && (
                  <span className="flex items-center gap-1 text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full">
                    <Check className="w-3 h-3" /> ACTIVE
                  </span>
                )}
              </div>
              <div className="text-sm font-semibold text-zinc-100 truncate w-full">
                {p.name}
              </div>
              <div className="flex items-center gap-2 mt-1">
                <div
                  className="w-3 h-3 rounded-full border border-black/40"
                  style={{
                    backgroundColor: `hsl(${p.underglow?.hue || 0}, 100%, 50%)`,
                  }}
                  title={`Hue: ${p.underglow?.hue}°`}
                />
                <span className="text-[11px] font-mono text-zinc-400">
                  {p.power?.debouncePressMs ?? 5}ms debounce
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Profile Detail Card */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 shadow-xl flex flex-col gap-6">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-zinc-500 uppercase font-bold">
              Slot {selectedSlot + 1} Configuration
            </span>
            <input
              type="text"
              value={editingName}
              onChange={(e) => setEditingName(e.target.value)}
              onBlur={handleNameSave}
              disabled={disabled}
              className="bg-zinc-950 border border-zinc-800 rounded px-2.5 py-1 text-sm font-semibold text-zinc-100 focus:outline-none focus:border-amber-500"
              placeholder="Profile Name"
            />
          </div>

          <div className="flex items-center gap-3">
            {selectedSlot !== activeProfileId ? (
              <button
                type="button"
                disabled={disabled}
                onClick={() => onActivateProfile(selectedSlot)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs font-mono disabled:opacity-50 transition-all shadow-md shadow-amber-500/10"
              >
                <Check className="w-4 h-4" />
                Activate Profile {selectedSlot + 1}
              </button>
            ) : (
              <span className="text-xs font-mono text-emerald-400 flex items-center gap-1 font-semibold">
                <Check className="w-4 h-4" /> Currently Loaded in Memory
              </span>
            )}
          </div>
        </div>

        {/* Configuration Snapshot Grid */}
        <div className="grid grid-cols-3 gap-4">
          <div className="p-4 rounded-lg bg-zinc-950/60 border border-zinc-850 flex flex-col gap-2">
            <div className="flex items-center gap-2 text-xs font-mono text-amber-400">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Lighting Snapshot</span>
            </div>
            <div className="text-sm font-semibold text-zinc-200">
              {activeProfile.underglow?.on ? 'Underglow ON' : 'Underglow OFF'}
            </div>
            <div className="text-xs text-zinc-400 font-mono">
              Hue {activeProfile.underglow?.hue ?? 0}° • Brightness {activeProfile.underglow?.brightness ?? 50}%
            </div>
          </div>

          <div className="p-4 rounded-lg bg-zinc-950/60 border border-zinc-850 flex flex-col gap-2">
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
              <Zap className="w-3.5 h-3.5" />
              <span>Power & Debounce</span>
            </div>
            <div className="text-sm font-semibold text-zinc-200">
              {activeProfile.power?.debouncePressMs ?? 5}ms Press / {activeProfile.power?.debounceReleaseMs ?? 5}ms Release
            </div>
            <div className="text-xs text-zinc-400 font-mono">
              Idle: {Math.round((activeProfile.power?.idleTimeoutMs ?? 30000) / 1000)}s • Sleep: {Math.round((activeProfile.power?.deepSleepTimeoutMs ?? 900000) / 60000)}m
            </div>
          </div>

          <div className="p-4 rounded-lg bg-zinc-950/60 border border-zinc-850 flex flex-col gap-2">
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
              <Shield className="w-3.5 h-3.5" />
              <span>Onboard Macros</span>
            </div>
            <div className="text-sm font-semibold text-zinc-200">
              {activeProfile.macros?.filter((m) => m.steps.length > 0).length ?? 0} Active Macros
            </div>
            <div className="text-xs text-zinc-400 font-mono">
              16 Available Hardware Slots
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
