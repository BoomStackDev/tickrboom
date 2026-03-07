'use client';

import { useEffect } from 'react';
import { useTheme } from 'next-themes';
import { useUIStore } from '@/stores/uiStore';
import { useGameStore } from '@/stores/gameStore';
import { MainMenu } from '@/components/MainMenu';
import { GameBoard } from '@/components/GameBoard';
import { SettingsModal } from '@/components/modals/SettingsModal';
import { TutorialModal } from '@/components/modals/TutorialModal';
import { WinModal } from '@/components/modals/WinModal';
import { EventModal } from '@/components/modals/EventModal';
import { SaveManagerModal } from '@/components/modals/SaveManagerModal';

export default function GameShell() {
  const view = useUIStore((s) => s.view);
  const showSettings = useUIStore((s) => s.showSettings);
  const showTutorial = useUIStore((s) => s.showTutorial);
  const showSaveManager = useUIStore((s) => s.showSaveManager);
  const activeEvent = useUIStore((s) => s.activeEvent);
  const gameWon = useGameStore((s) => s.gameState?.gameWon ?? false);
  const theme = useUIStore((s) => s.theme);
  const { setTheme: setNextTheme } = useTheme();

  useEffect(() => {
    useUIStore.getState().loadSettings();
    useGameStore.getState().loadSaves();
  }, []);

  // Sync zustand theme with next-themes
  useEffect(() => {
    setNextTheme(theme);
  }, [theme, setNextTheme]);

  return (
    <div className="min-h-screen tb-bg">
      {view === 'MENU' && <MainMenu />}
      {view === 'GAME' && <GameBoard />}

      {showSettings && <SettingsModal />}
      {showTutorial && <TutorialModal />}
      {showSaveManager.show && <SaveManagerModal />}
      {activeEvent && <EventModal />}
      {gameWon && <WinModal />}
    </div>
  );
}
