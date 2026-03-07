'use client';

import { AlertTriangle, TrendingUp } from 'lucide-react';
import { useUIStore } from '@/stores/uiStore';
import { useHaptics } from '@/hooks/useHaptics';

export function EventModal() {
  const activeEvent = useUIStore((s) => s.activeEvent);
  const setActiveEvent = useUIStore((s) => s.setActiveEvent);
  const haptic = useHaptics();

  if (!activeEvent) return null;

  const handleDismiss = () => { haptic(); setActiveEvent(null); };

  const icon = activeEvent.type === 'danger'
    ? <AlertTriangle size={28} className="text-danger-red" />
    : <TrendingUp size={28} className="tb-green-text" />;

  const borderColor = activeEvent.type === 'danger' ? 'border-red-500' : activeEvent.type === 'profit' ? 'border-emerald-500' : 'border-blue-500';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center tb-overlay p-4">
      <div className={`tb-card card-elevated border-2 ${borderColor} rounded-2xl p-6 w-full max-w-sm text-center animate-pop-in`}>
        <div className="mb-3">{icon}</div>
        <h2 className="text-lg font-black tb-text mb-2">{activeEvent.title}</h2>
        <p className="tb-text-secondary text-xs mb-5 leading-relaxed">{activeEvent.message}</p>
        <button
          onClick={handleDismiss}
          className={`w-full py-2.5 rounded-lg font-bold text-sm min-h-[44px] ${
            activeEvent.type === 'danger'
              ? 'bg-red-500/10 border border-red-500/30 text-danger-red'
              : 'bg-accent-green text-black'
          }`}
        >
          OK
        </button>
      </div>
    </div>
  );
}
