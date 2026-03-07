'use client';

import { useUIStore } from '@/stores/uiStore';

export function NotificationBanner() {
  const notification = useUIStore((s) => s.notification);

  if (!notification) return null;

  const style =
    notification.type === 'profit' ? 'bg-emerald-500/10 border-emerald-500/30 tb-green-text' :
    notification.type === 'danger' ? 'bg-red-500/10 border-red-500/30 text-danger-red' :
    'bg-[var(--tb-input-bg)] border-[var(--tb-border)] tb-text-secondary';

  return (
    <div className={`mx-3 lg:mx-4 mt-1.5 px-3 py-1.5 rounded-lg border ${style} text-center font-bold text-xs font-[family-name:var(--font-mono)] animate-pop-in`}>
      {notification.msg}
    </div>
  );
}
