import React from 'react';

export interface UnlockModalProps {
  isOpen: boolean;
  onRequestUnlock: () => void;
  onSimulateUnlock?: () => void;
  onClose?: () => void;
}

export const UnlockModal: React.FC<UnlockModalProps> = ({
  isOpen,
  onRequestUnlock,
  onSimulateUnlock,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-150">
      <div className="max-w-md w-full p-6 rounded-2xl bg-zinc-900 border border-zinc-700 shadow-2xl flex flex-col items-center text-center">
        <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mb-4">
          <span className="text-2xl">🔒</span>
        </div>

        <h3 className="text-lg font-bold text-zinc-100 mb-2">Device is Locked</h3>
        <p className="text-sm text-zinc-400 mb-6 leading-relaxed">
          To protect your keyboard against accidental or unauthorized modifications, press the physical unlock key combo on your keyboard:
        </p>

        <div className="px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 font-mono text-sm text-amber-400 font-bold mb-6 flex items-center gap-2">
          <span>Fn</span> + <span>Backspace</span>
          <span className="text-xs font-normal text-zinc-500 ml-2">(&studio_unlock)</span>
        </div>

        <div className="flex gap-3 w-full">
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-mono text-xs font-semibold transition-colors"
            >
              Cancel
            </button>
          )}
          <button
            type="button"
            onClick={onRequestUnlock}
            className="flex-1 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-mono text-xs font-bold transition-all shadow-lg shadow-amber-500/20"
          >
            Authorize Unlock
          </button>
        </div>

        {onSimulateUnlock && (
          <button
            type="button"
            onClick={onSimulateUnlock}
            className="mt-4 text-[11px] font-mono text-zinc-500 hover:text-zinc-400 underline underline-offset-4"
          >
            [Dev: Bypass Lock]
          </button>
        )}
      </div>
    </div>
  );
};
