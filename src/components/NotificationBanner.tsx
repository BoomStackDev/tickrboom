'use client';

import { useUIStore } from '@/stores/uiStore';

export function NotificationBanner() {
  const notification = useUIStore((s) => s.notification);

  if (!notification) return null;

  const bgColor =
    notification.type === 'profit' ? 'bg-emerald-900/80 border-emerald-700' :
    notification.type === 'danger' ? 'bg-red-900/80 border-red-700' :
    'bg-slate-800/80 border-slate-600';

  const textColor =
    notification.type === 'profit' ? 'text-accent-green' :
    notification.type === 'danger' ? 'text-danger-red' :
    'text-slate-300';

  return (
    <div className={`mx-4 mt-2 px-4 py-2 rounded-lg border ${bgColor} ${textColor} text-center font-bold text-sm font-[family-name:var(--font-mono)] animate-pop-in`}>
      {notification.msg}
    </div>
  );
}
