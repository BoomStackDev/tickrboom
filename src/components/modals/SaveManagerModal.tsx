'use client';

import { useState } from 'react';
import { X, Save, Trash2, Check } from 'lucide-react';
import { useUIStore } from '@/stores/uiStore';
import { useGameStore } from '@/stores/gameStore';
import { useHaptics } from '@/hooks/useHaptics';
import { formatMoney } from '@/lib/utils/formatMoney';

export function SaveManagerModal() {
  const { mode } = useUIStore((s) => s.showSaveManager);
  const closeSaveManager = useUIStore((s) => s.closeSaveManager);
  const setView = useUIStore((s) => s.setView);
  const setNotification = useUIStore((s) => s.setNotification);
  const manualSaves = useGameStore((s) => s.manualSaves);
  const manualSave = useGameStore((s) => s.manualSave);
  const manualLoad = useGameStore((s) => s.manualLoad);
  const deleteSave = useGameStore((s) => s.deleteSave);
  const haptic = useHaptics();

  const [saveName, setSaveName] = useState('');
  const [overwriteId, setOverwriteId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const handleSave = () => {
    if (!saveName.trim()) return;
    haptic();
    manualSave(saveName.trim(), overwriteId);
    setNotification({ type: 'profit', msg: 'GAME SAVED!' });
    setTimeout(() => setNotification(null), 2000);
    setSaveName('');
    setOverwriteId(null);
    closeSaveManager();
  };

  const handleLoad = (save: typeof manualSaves[0]) => {
    haptic(); manualLoad(save); setView('GAME'); closeSaveManager();
  };

  const handleDelete = (id: string) => {
    haptic();
    setConfirmDeleteId(id);
  };

  const confirmDelete = () => {
    if (confirmDeleteId) {
      deleteSave(confirmDeleteId);
      setConfirmDeleteId(null);
    }
  };

  const formatDate = (ts: number) => {
    return new Date(ts).toLocaleDateString(undefined, {
      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center tb-overlay p-4" onClick={closeSaveManager}>
      <div
        className="tb-card card-elevated border tb-border rounded-2xl p-6 w-full max-w-md max-h-[80vh] overflow-y-auto animate-pop-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-black tb-text">{mode === 'SAVE' ? 'SAVE GAME' : 'LOAD GAME'}</h2>
          <button onClick={closeSaveManager} className="p-2 hover:bg-[var(--tb-hover)] rounded-lg min-w-[44px] min-h-[44px] flex items-center justify-center tb-text-secondary">
            <X size={18} />
          </button>
        </div>

        {mode === 'SAVE' && (
          <div className="mb-4">
            <div className="flex gap-2">
              <input
                value={saveName}
                onChange={(e) => setSaveName(e.target.value)}
                placeholder="Save name..."
                className="flex-1 tb-input border tb-border rounded-lg px-3 py-2 text-xs min-h-[40px] focus:outline-none focus:border-accent-green/50"
              />
              <button
                onClick={handleSave}
                disabled={!saveName.trim()}
                className="px-3 py-2 rounded-lg bg-accent-green text-black font-bold text-xs min-h-[40px] disabled:opacity-30"
              >
                <Save size={14} />
              </button>
            </div>
            {overwriteId && (
              <p className="text-[10px] text-yellow-400 mt-1">Overwriting existing save</p>
            )}
          </div>
        )}

        {manualSaves.length === 0 ? (
          <p className="tb-text-muted text-xs text-center py-8">No saved games</p>
        ) : (
          <div className="space-y-1.5">
            {manualSaves.map((save) => (
              <div
                key={save.id}
                className="bg-[var(--tb-input-bg)] border tb-border rounded-lg p-2.5 flex items-center justify-between"
              >
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-xs tb-text truncate">{save.name}</div>
                  <div className="text-[10px] tb-text-muted font-[family-name:var(--font-mono)]">
                    {formatMoney(save.netWorth)} &middot; {formatDate(save.timestamp)}
                  </div>
                  {save.mode && (
                    <div className="text-[9px] tb-text-muted">{save.mode.difficulty}</div>
                  )}
                </div>
                <div className="flex gap-1 ml-2">
                  {mode === 'SAVE' && (
                    <button
                      onClick={() => { setOverwriteId(save.id); setSaveName(save.name); }}
                      className="p-1.5 hover:bg-[var(--tb-hover)] rounded min-w-[36px] min-h-[36px] flex items-center justify-center text-yellow-400"
                      title="Overwrite"
                    >
                      <Check size={14} />
                    </button>
                  )}
                  {mode === 'LOAD' && (
                    <button
                      onClick={() => handleLoad(save)}
                      className="px-2.5 py-1 bg-accent-green/10 border border-emerald-500/30 rounded tb-green-text text-[10px] font-bold min-h-[36px]"
                    >
                      LOAD
                    </button>
                  )}
                  {confirmDeleteId === save.id ? (
                    <>
                      <button
                        onClick={() => setConfirmDeleteId(null)}
                        className="px-2 py-1 rounded tb-text-muted text-[10px] font-bold min-h-[36px] hover:bg-[var(--tb-hover)]"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={confirmDelete}
                        className="px-2 py-1 rounded bg-red-500/20 border border-red-500/30 text-danger-red text-[10px] font-bold min-h-[36px]"
                      >
                        Delete
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => handleDelete(save.id)}
                      className="p-1.5 hover:bg-red-500/10 rounded min-w-[36px] min-h-[36px] flex items-center justify-center text-danger-red"
                    >
                      <Trash2 size={13} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
