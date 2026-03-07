import type { PlatformAdapter } from './types';

export class LocalPlatformAdapter implements PlatformAdapter {
  async init(): Promise<void> {
    // No-op for local
  }

  onGameplayStart(): void {
    // No-op
  }

  onGameplayStop(): void {
    // No-op
  }

  async showRewardedAd(): Promise<boolean> {
    return false;
  }

  async showInterstitialAd(): Promise<void> {
    // No-op
  }

  async saveGame(key: string, data: string): Promise<void> {
    if (typeof window !== 'undefined') {
      localStorage.setItem(key, data);
    }
  }

  async loadGame(key: string): Promise<string | null> {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(key);
    }
    return null;
  }

  async deleteGame(key: string): Promise<void> {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(key);
    }
  }

  trackEvent(event: string, data?: Record<string, unknown>): void {
    if (process.env.NODE_ENV === 'development') {
      console.log('[TickrBoom]', event, data);
    }
  }

  triggerHaptic(pattern: number | number[] = 10): void {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(pattern);
    }
  }
}

export const platform = new LocalPlatformAdapter();
