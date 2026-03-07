export interface PlatformAdapter {
  init(): Promise<void>;
  onGameplayStart(): void;
  onGameplayStop(): void;
  showRewardedAd(): Promise<boolean>;
  showInterstitialAd(): Promise<void>;
  saveGame(key: string, data: string): Promise<void>;
  loadGame(key: string): Promise<string | null>;
  deleteGame(key: string): Promise<void>;
  trackEvent(event: string, data?: Record<string, unknown>): void;
  triggerHaptic(pattern?: number | number[]): void;
}
