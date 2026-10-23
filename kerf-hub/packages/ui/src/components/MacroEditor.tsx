import React, { useState, useEffect, useRef } from 'react';
import { MacroSlot, MacroStep, MacroAction, textToMacroSteps, MAX_MACRO_STEPS } from '@kerf/protocol';
import { Play, Square, Plus, Trash2, Clock, Save, Terminal } from 'lucide-react';

export interface MacroEditorProps {
  slots: MacroSlot[];
  onSaveSlot: (slot: MacroSlot) => void;
  onClearSlot: (slotId: number) => void;
  disabled?: boolean;
}

export const MacroEditor: React.FC<MacroEditorProps> = ({
  slots,
  onSaveSlot,
  onClearSlot,
  disabled = false,
}) => {
  const [selectedSlotId, setSelectedSlotId] = useState<number>(0);
  const activeSlot = slots[selectedSlotId] || slots[0];

  const [currentSlot, setCurrentSlot] = useState<MacroSlot>({ ...activeSlot });
  const [textInput, setTextInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const lastKeyTimeRef = useRef<number>(0);

  useEffect(() => {
    if (slots[selectedSlotId]) {
      setCurrentSlot({ ...slots[selectedSlotId] });
    }
  }, [selectedSlotId, slots]);

  // Keystroke Recorder listener
  useEffect(() => {
    if (!isRecording) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      e.preventDefault();
      const now = performance.now();
      const delta = lastKeyTimeRef.current ? Math.min(Math.round(now - lastKeyTimeRef.current), 1000) : 0;
      lastKeyTimeRef.current = now;

      setCurrentSlot((prev) => {
        if (prev.steps.length >= MAX_MACRO_STEPS - 2) return prev;
        const newSteps: MacroStep[] = [...prev.steps];
        if (delta > 30) {
          newSteps.push({ action: MacroAction.DELAY, param: delta });
        }
        newSteps.push({ action: MacroAction.PRESS, param: e.keyCode });
        return { ...prev, steps: newSteps };
      });
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      e.preventDefault();
      const now = performance.now();
      lastKeyTimeRef.current = now;

      setCurrentSlot((prev) => {
        if (prev.steps.length >= MAX_MACRO_STEPS) return prev;
        return {
          ...prev,
          steps: [...prev.steps, { action: MacroAction.RELEASE, param: e.keyCode }],
        };
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isRecording]);

  const handleAddText = () => {
    if (!textInput.trim()) return;
    const steps = textToMacroSteps(textInput);
    setCurrentSlot((prev) => ({
      ...prev,
      steps: [...prev.steps, ...steps].slice(0, MAX_MACRO_STEPS),
    }));
    setTextInput('');
  };

  const handleAddDelay = (ms: number) => {
    if (currentSlot.steps.length >= MAX_MACRO_STEPS) return;
    setCurrentSlot((prev) => ({
      ...prev,
      steps: [...prev.steps, { action: MacroAction.DELAY, param: ms }],
    }));
  };

  const handleDeleteStep = (index: number) => {
    setCurrentSlot((prev) => ({
      ...prev,
      steps: prev.steps.filter((_, i) => i !== index),
    }));
  };

  const handleSave = () => {
    onSaveSlot(currentSlot);
  };

  const handleClear = () => {
    setCurrentSlot((prev) => ({ ...prev, steps: [] }));
    onClearSlot(selectedSlotId);
  };

  const getActionBadge = (action: MacroAction) => {
    switch (action) {
      case MacroAction.TAP:
        return <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30 font-bold">TAP</span>;
      case MacroAction.PRESS:
        return <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">DOWN</span>;
      case MacroAction.RELEASE:
        return <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold">UP</span>;
      case MacroAction.DELAY:
        return <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30 font-bold">DELAY</span>;
    }
  };

  return (
    <div className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-12 gap-6 animate-in fade-in duration-200">
      {/* 16 Slots Sidebar */}
      <div className="md:col-span-4 p-4 rounded-2xl bg-zinc-900 border border-zinc-800 shadow-xl flex flex-col gap-2">
        <div className="flex items-center gap-2 border-b border-zinc-800 pb-3 px-2">
          <Terminal className="w-4 h-4 text-amber-400" />
          <h2 className="text-xs font-mono font-bold text-zinc-100">ONBOARD MACRO SLOTS (16)</h2>
        </div>

        <div className="flex flex-col gap-1 max-h-[500px] overflow-y-auto pr-1">
          {slots.map((slot) => (
            <button
              key={slot.slotId}
              type="button"
              disabled={disabled}
              onClick={() => setSelectedSlotId(slot.slotId)}
              className={`flex items-center justify-between p-2.5 rounded-xl font-mono text-xs text-left transition-all ${
                selectedSlotId === slot.slotId
                  ? 'bg-amber-500 text-zinc-950 font-bold shadow-md shadow-amber-500/20'
                  : 'bg-zinc-800/80 text-zinc-300 hover:bg-zinc-750 border border-zinc-700/60'
              }`}
            >
              <span>{slot.name || `Slot ${slot.slotId}`}</span>
              <span className="text-[10px] opacity-70">
                {slot.steps.length}/{MAX_MACRO_STEPS} steps
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Editor Main Canvas */}
      <div className="md:col-span-8 p-6 rounded-2xl bg-zinc-900 border border-zinc-800 shadow-xl flex flex-col gap-6">
        {/* Slot Header */}
        <div className="flex justify-between items-center border-b border-zinc-800 pb-4">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs text-zinc-500">&kmacro {selectedSlotId}:</span>
            <input
              type="text"
              value={currentSlot.name}
              disabled={disabled}
              onChange={(e) => setCurrentSlot({ ...currentSlot, name: e.target.value })}
              className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-1 font-mono text-xs text-zinc-100 font-bold focus:outline-none focus:border-amber-400"
              placeholder="Macro Name"
            />
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              disabled={disabled}
              onClick={handleClear}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-rose-500/20 hover:text-rose-300 border border-zinc-700 text-zinc-400 text-xs font-mono transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Clear
            </button>
            <button
              type="button"
              disabled={disabled}
              onClick={handleSave}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-mono font-bold shadow-md shadow-amber-500/20 transition-all active:scale-95"
            >
              <Save className="w-3.5 h-3.5" />
              Save to Keyboard
            </button>
          </div>
        </div>

        {/* Action Toolbar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-zinc-950 border border-zinc-800/80">
          {/* Recorder */}
          <div className="flex flex-col gap-2">
            <span className="text-xs font-mono text-zinc-400 font-medium">Keystroke Recorder:</span>
            <button
              type="button"
              disabled={disabled}
              onClick={() => {
                lastKeyTimeRef.current = 0;
                setIsRecording(!isRecording);
              }}
              className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg font-mono text-xs font-bold transition-all ${
                isRecording
                  ? 'bg-rose-500 text-white animate-pulse'
                  : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700'
              }`}
            >
              {isRecording ? <Square className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
              {isRecording ? 'Stop Recording' : 'Record Keystrokes'}
            </button>
          </div>

          {/* Quick Text Generator */}
          <div className="flex flex-col gap-2">
            <span className="text-xs font-mono text-zinc-400 font-medium">Text to Keystrokes:</span>
            <div className="flex gap-2">
              <input
                type="text"
                value={textInput}
                disabled={disabled}
                onChange={(e) => setTextInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddText()}
                placeholder="Type text string..."
                className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg px-2.5 py-1 text-xs font-mono text-zinc-200 focus:outline-none focus:border-amber-400"
              />
              <button
                type="button"
                disabled={disabled || !textInput.trim()}
                onClick={handleAddText}
                className="px-3 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 text-xs font-mono font-medium"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Steps List */}
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center text-xs font-mono text-zinc-400 px-1">
            <span>Macro Sequence ({currentSlot.steps.length} / {MAX_MACRO_STEPS} steps):</span>
            <div className="flex gap-2">
              <button
                type="button"
                disabled={disabled || currentSlot.steps.length >= MAX_MACRO_STEPS}
                onClick={() => handleAddDelay(50)}
                className="flex items-center gap-1 text-[11px] text-zinc-400 hover:text-amber-400"
              >
                <Clock className="w-3 h-3" /> +50ms Delay
              </button>
              <button
                type="button"
                disabled={disabled || currentSlot.steps.length >= MAX_MACRO_STEPS}
                onClick={() => handleAddDelay(250)}
                className="flex items-center gap-1 text-[11px] text-zinc-400 hover:text-amber-400"
              >
                <Clock className="w-3 h-3" /> +250ms Delay
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-1.5 max-h-64 overflow-y-auto pr-1">
            {currentSlot.steps.length === 0 ? (
              <div className="p-8 text-center text-zinc-600 font-mono text-xs border border-dashed border-zinc-800 rounded-xl">
                Slot is empty. Record keystrokes or type text above.
              </div>
            ) : (
              currentSlot.steps.map((step, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs font-mono"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] text-zinc-600 w-5 text-right">{idx + 1}.</span>
                    {getActionBadge(step.action)}
                    <span className="text-zinc-200 font-semibold">
                      {step.action === MacroAction.DELAY ? `${step.param} ms` : `Key (0x${step.param.toString(16).toUpperCase()})`}
                    </span>
                  </div>
                  <button
                    type="button"
                    disabled={disabled}
                    onClick={() => handleDeleteStep(idx)}
                    className="text-zinc-600 hover:text-rose-400 p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
