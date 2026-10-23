import React, { useState, useEffect, useMemo } from 'react';
import { SessionManager, ExtendedDeviceState } from '@kerf/core';
import { KeyboardRenderer, BehaviorPalette, LayerManager, UnlockModal, AvailableKey, LightingEditor, PowerEditor } from '@kerf/ui';
import { Header } from './components/Header';
import { StatusBar } from './components/StatusBar';
import { Keyboard, Palette, Zap } from 'lucide-react';

export const App: React.FC = () => {
  const session = useMemo(() => new SessionManager(), []);
  const [deviceState, setDeviceState] = useState<ExtendedDeviceState>(session.getState());
  const [activeTab, setActiveTab] = useState<'keymap' | 'lighting' | 'power'>('keymap');
  const [selectedKeyIndex, setSelectedKeyIndex] = useState<number | null>(null);
  const [isUnlockModalOpen, setIsUnlockModalOpen] = useState(false);

  useEffect(() => {
    return session.subscribe((state) => {
      setDeviceState({ ...state });
      if (!state.locked) {
        setIsUnlockModalOpen(false);
      }
    });
  }, [session]);

  const handleConnect = async () => {
    try {
      await session.connect();
      setIsUnlockModalOpen(true);
    } catch (err: any) {
      alert(`Connection failed: ${err.message}`);
    }
  };

  const handleDisconnect = async () => {
    await session.disconnect();
    setSelectedKeyIndex(null);
  };

  const handleKeySelect = (index: number) => {
    if (deviceState.locked) {
      setIsUnlockModalOpen(true);
      return;
    }
    setSelectedKeyIndex(index);
  };

  const handleAssignKey = async (item: AvailableKey) => {
    if (selectedKeyIndex === null) return;
    await session.remapKey(deviceState.activeLayer, selectedKeyIndex, item.code.toLowerCase());
    setSelectedKeyIndex(null);
  };

  const activeLayer = deviceState.layers[deviceState.activeLayer] || deviceState.layers[0];

  return (
    <div className="flex flex-col h-screen bg-zinc-950 text-zinc-100 overflow-hidden font-sans">
      <Header
        connected={deviceState.connected}
        locked={deviceState.locked}
        deviceName={deviceState.name}
        onConnect={handleConnect}
        onDisconnect={handleDisconnect}
        onUnlockClick={() => setIsUnlockModalOpen(true)}
      />

      {/* Primary Subsystem Navigation Tabs */}
      <nav className="h-12 border-b border-zinc-800 bg-zinc-900/40 px-8 flex items-center gap-6">
        <button
          type="button"
          onClick={() => setActiveTab('keymap')}
          className={`flex items-center gap-2 text-xs font-mono font-medium py-3 border-b-2 transition-all ${
            activeTab === 'keymap'
              ? 'border-amber-400 text-amber-300 font-bold'
              : 'border-transparent text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Keyboard className="w-4 h-4" />
          KEYMAP & LAYERS
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('lighting')}
          className={`flex items-center gap-2 text-xs font-mono font-medium py-3 border-b-2 transition-all ${
            activeTab === 'lighting'
              ? 'border-amber-400 text-amber-300 font-bold'
              : 'border-transparent text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Palette className="w-4 h-4" />
          LIGHTING & BATLED
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('power')}
          className={`flex items-center gap-2 text-xs font-mono font-medium py-3 border-b-2 transition-all ${
            activeTab === 'power'
              ? 'border-amber-400 text-amber-300 font-bold'
              : 'border-transparent text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Zap className="w-4 h-4" />
          POWER & PERFORMANCE
        </button>
      </nav>

      <main className="flex-1 overflow-auto flex flex-col items-center justify-start p-8 relative">
        {activeTab === 'keymap' && (
          <div className="max-w-6xl w-full flex flex-col items-center gap-6">
            {/* Layer Bar */}
            <div className="flex justify-between items-center w-full max-w-4xl px-2">
              <LayerManager
                layers={deviceState.layers}
                activeLayerId={deviceState.activeLayer}
                onSelectLayer={(id) => session.setActiveLayer(id)}
                disabled={deviceState.locked}
              />

              {deviceState.locked && deviceState.connected && (
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-mono">
                  <span>🔒 Editing locked</span>
                  <button
                    type="button"
                    onClick={() => setIsUnlockModalOpen(true)}
                    className="underline hover:text-white ml-1 font-bold"
                  >
                    Unlock
                  </button>
                </div>
              )}
            </div>

            {/* Interactive Keyboard Visualizer */}
            <KeyboardRenderer
              currentLayer={activeLayer}
              selectedKeyIndex={selectedKeyIndex}
              onSelectKey={handleKeySelect}
              isLocked={deviceState.locked && deviceState.connected}
            />
          </div>
        )}

        {activeTab === 'lighting' && (
          <LightingEditor
            underglow={deviceState.underglow}
            batled={deviceState.batled}
            onChangeUnderglow={(cfg) => session.updateUnderglow(cfg)}
            onChangeBatled={(cfg) => session.updateBatled(cfg)}
            disabled={deviceState.locked && deviceState.connected}
          />
        )}

        {activeTab === 'power' && (
          <PowerEditor
            power={deviceState.power}
            onChangePower={(cfg) => session.updatePower(cfg)}
            disabled={deviceState.locked && deviceState.connected}
          />
        )}

        {/* Remapping Palette Modal */}
        <BehaviorPalette
          selectedKeyIndex={selectedKeyIndex}
          onAssignKey={handleAssignKey}
          onClose={() => setSelectedKeyIndex(null)}
        />

        {/* Security Unlock Flow Modal */}
        <UnlockModal
          isOpen={isUnlockModalOpen}
          onRequestUnlock={() => session.requestUnlock()}
          onSimulateUnlock={() => session.unlock()}
          onClose={() => setIsUnlockModalOpen(false)}
        />
      </main>

      <StatusBar
        connected={deviceState.connected}
        activeLayer={deviceState.activeLayer}
      />
    </div>
  );
};
