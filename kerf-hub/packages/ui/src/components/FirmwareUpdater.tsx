import React, { useState } from 'react';
import { Cpu, HardDrive, RefreshCw, AlertTriangle, CheckCircle, ArrowRight, ShieldCheck, Download } from 'lucide-react';

export interface FirmwareUpdaterProps {
  currentVersion: string;
  hardwareName: string;
  onRebootBootloader: () => Promise<void>;
  onFactoryReset: () => Promise<void>;
  disabled?: boolean;
}

export const FirmwareUpdater: React.FC<FirmwareUpdaterProps> = ({
  currentVersion,
  hardwareName,
  onRebootBootloader,
  onFactoryReset,
  disabled = false,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isFlashing, setIsFlashing] = useState<boolean>(false);
  const [flashProgress, setFlashProgress] = useState<number>(0);
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  const handleReboot = async () => {
    if (!confirm('Reboot keyboard into UF2 Bootloader mode? The keyboard will temporarily disconnect.')) {
      return;
    }
    try {
      setStatusMessage('Sending bootloader reboot command...');
      await onRebootBootloader();
      setStatusMessage('Device rebooted into bootloader mode. Look for the "NICENANO" USB drive.');
    } catch (err: any) {
      alert(`Failed to reboot to bootloader: ${err.message}`);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.name.endsWith('.uf2')) {
        alert('Please select a valid .uf2 firmware file.');
        return;
      }
      setSelectedFile(file);
      setIsSuccess(false);
      setStatusMessage(`Selected: ${file.name} (${(file.size / 1024).toFixed(1)} KB)`);
    }
  };

  const handleFlash = async () => {
    if (!selectedFile) {
      alert('Please select a .uf2 firmware file first.');
      return;
    }

    try {
      setIsFlashing(true);
      setFlashProgress(10);
      setStatusMessage('Please select the "NICENANO" or "NRF52BOOT" USB drive in the file picker...');

      // Use Web File System Access API
      if ('showDirectoryPicker' in window) {
        const dirHandle = await (window as any).showDirectoryPicker({
          mode: 'readwrite',
        });

        setFlashProgress(40);
        setStatusMessage(`Drive connected: ${dirHandle.name}. Writing ${selectedFile.name}...`);

        const fileHandle = await dirHandle.getFileHandle(selectedFile.name, { create: true });
        const writable = await fileHandle.createWritable();

        setFlashProgress(70);
        await writable.write(await selectedFile.arrayBuffer());
        await writable.close();

        setFlashProgress(100);
        setIsSuccess(true);
        setStatusMessage('UF2 firmware written successfully! The device will now reboot automatically.');
      } else {
        // Fallback for browsers without showDirectoryPicker
        alert('Directory picker not supported in this browser. Please manually copy the .uf2 file to the mounted NICENANO drive.');
      }
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        alert(`Flashing error: ${err.message}`);
        setStatusMessage(`Flashing failed: ${err.message}`);
      }
    } finally {
      setIsFlashing(false);
    }
  };

  const handleFactoryResetClick = async () => {
    if (!confirm('WARNING: This will wipe all stored keymaps, lighting presets, macros, and profiles from flash memory and reboot. Continue?')) {
      return;
    }
    try {
      await onFactoryReset();
      alert('Factory reset initiated. Device is restarting with default settings.');
    } catch (err: any) {
      alert(`Factory reset failed: ${err.message}`);
    }
  };

  return (
    <div className="w-full max-w-4xl flex flex-col gap-6 animate-in fade-in duration-200">
      {/* Device Info & Status Card */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 shadow-xl flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg text-amber-400">
            <Cpu className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-zinc-100 flex items-center gap-2">
              {hardwareName}
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono">
                v{currentVersion}
              </span>
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              Target: nice!nano v2 (nRF52840) • Protocol: Kerf v1 • Zephyr 4.1
            </p>
          </div>
        </div>

        <button
          type="button"
          disabled={disabled}
          onClick={handleReboot}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-100 text-xs font-mono font-bold border border-zinc-700 transition-all shadow-md disabled:opacity-50"
        >
          <RefreshCw className="w-4 h-4 text-amber-400" />
          Reboot to Bootloader
        </button>
      </div>

      {/* One-Click UF2 Flashing Workflow */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 shadow-xl flex flex-col gap-6">
        <div className="border-b border-zinc-800 pb-3">
          <h3 className="text-sm font-bold text-zinc-100 flex items-center gap-2">
            <HardDrive className="w-4 h-4 text-amber-400" />
            One-Click UF2 Firmware Flasher
          </h3>
          <p className="text-xs text-zinc-400 mt-1">
            Flash official UF2 firmware binaries directly using the Web File System Access API.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Step 1: Select File */}
          <div className="p-4 rounded-lg bg-zinc-950/60 border border-zinc-800 flex flex-col gap-3">
            <span className="text-xs font-mono text-zinc-400 uppercase font-bold flex items-center gap-1.5">
              <span className="w-4 h-4 rounded-full bg-zinc-800 flex items-center justify-center text-[10px] text-amber-400">1</span>
              Select Firmware File (.uf2)
            </span>
            <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-zinc-800 hover:border-zinc-700 rounded-lg cursor-pointer bg-zinc-900/40 transition-colors">
              <Download className="w-6 h-6 text-zinc-400 mb-2" />
              <span className="text-xs font-medium text-zinc-300">
                {selectedFile ? selectedFile.name : 'Choose a .uf2 file'}
              </span>
              <span className="text-[10px] text-zinc-500 font-mono mt-1">
                {selectedFile ? `${(selectedFile.size / 1024).toFixed(1)} KB` : 'Click to browse'}
              </span>
              <input
                type="file"
                accept=".uf2"
                onChange={handleFileSelect}
                className="hidden"
              />
            </label>
          </div>

          {/* Step 2: Flash */}
          <div className="p-4 rounded-lg bg-zinc-950/60 border border-zinc-800 flex flex-col justify-between gap-3">
            <div>
              <span className="text-xs font-mono text-zinc-400 uppercase font-bold flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full bg-zinc-800 flex items-center justify-center text-[10px] text-amber-400">2</span>
                Write to Device Drive
              </span>
              <p className="text-xs text-zinc-400 mt-2">
                Click below to select your mounted <code className="text-amber-400">NICENANO</code> drive. The firmware binary will be streamed directly.
              </p>
            </div>

            <button
              type="button"
              disabled={!selectedFile || isFlashing}
              onClick={handleFlash}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs font-mono disabled:opacity-50 transition-all shadow-md shadow-amber-500/10"
            >
              <ArrowRight className="w-4 h-4" />
              {isFlashing ? 'Writing UF2...' : 'Select NICENANO Drive & Flash'}
            </button>
          </div>
        </div>

        {/* Progress & Status */}
        {statusMessage && (
          <div className={`p-4 rounded-lg border flex flex-col gap-2 ${
            isSuccess
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
              : 'bg-zinc-950 border-zinc-800 text-zinc-300'
          }`}>
            <div className="flex items-center gap-2 text-xs font-mono">
              {isSuccess ? <CheckCircle className="w-4 h-4 text-emerald-400" /> : <RefreshCw className={`w-4 h-4 text-amber-400 ${isFlashing ? 'animate-spin' : ''}`} />}
              <span>{statusMessage}</span>
            </div>
            {isFlashing && (
              <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden mt-1">
                <div
                  className="bg-amber-400 h-full transition-all duration-300"
                  style={{ width: `${flashProgress}%` }}
                />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Safety Guarantee Callout */}
      <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-5 flex items-start gap-4">
        <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400 shrink-0">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <div className="text-xs text-zinc-300 flex flex-col gap-1">
          <span className="font-bold text-emerald-300 font-mono text-sm">
            Fail-Safe Hardware Recovery Guarantee
          </span>
          <p className="text-zinc-400 leading-relaxed">
            Even if a firmware update is disconnected or corrupted midway, your keyboard <strong className="text-zinc-200">cannot be bricked</strong>. Double-tap the physical reset button on your <strong>kerf_keeb LP63 / nice!nano</strong> (or short the RST pin to GND twice within 500 ms) to re-enter UF2 mass storage mode and write a known good binary.
          </p>
        </div>
      </div>

      {/* Danger Zone: Factory Reset */}
      <div className="bg-rose-500/5 border border-rose-500/20 rounded-xl p-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-rose-500/10 rounded-lg text-rose-400">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-rose-300">Factory Reset</h4>
            <p className="text-xs text-zinc-400">
              Clear all flash settings (<code className="text-zinc-300">kerf/*</code>) and restore factory configuration.
            </p>
          </div>
        </div>

        <button
          type="button"
          disabled={disabled}
          onClick={handleFactoryResetClick}
          className="px-3.5 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-mono font-bold transition-colors disabled:opacity-50"
        >
          Erase All Settings
        </button>
      </div>
    </div>
  );
};
