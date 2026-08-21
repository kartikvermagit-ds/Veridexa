import React, { createContext, useContext, useState, useEffect } from 'react';
import { sound } from '../utils/sound';

interface SoundContextType {
  isSoundEnabled: boolean;
  toggleSound: () => void;
  playClick: (pitch?: number) => void;
  playSoftClick: () => void;
  playSuccess: () => void;
  playResolved: () => void;
  playAlert: () => void;
}

const SoundContext = createContext<SoundContextType | undefined>(undefined);

export const SoundProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isSoundEnabled, setIsSoundEnabled] = useState<boolean>(() => sound.getSoundEnabled());

  const toggleSound = () => {
    const next = !isSoundEnabled;
    setIsSoundEnabled(next);
    sound.setSoundEnabled(next);
  };

  // Global click listener to automatically produce tactile auditory feedback on buttons, links, tabs, and interactive elements
  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      if (!isSoundEnabled) return;

      const target = e.target as HTMLElement | null;
      if (!target) return;

      // Defer DOM check and audio playback to non-blocking microtask so UI Paint / INP is never delayed
      setTimeout(() => {
        const interactiveEl = target.closest(
          'button, a, input[type="radio"], input[type="checkbox"], select, [role="button"], [role="tab"], .cursor-pointer'
        );

        if (interactiveEl) {
          if (interactiveEl.classList.contains('bg-indigo-600') || interactiveEl.classList.contains('bg-emerald-600')) {
            sound.playClick(1.15);
          } else if (interactiveEl.tagName === 'INPUT' || interactiveEl.tagName === 'SELECT') {
            sound.playSoftClick();
          } else {
            sound.playClick(1.0);
          }
        }
      }, 0);
    };

    window.addEventListener('click', handleGlobalClick, { capture: false, passive: true });
    return () => window.removeEventListener('click', handleGlobalClick);
  }, [isSoundEnabled]);

  return (
    <SoundContext.Provider
      value={{
        isSoundEnabled,
        toggleSound,
        playClick: (pitch) => sound.playClick(pitch),
        playSoftClick: () => sound.playSoftClick(),
        playSuccess: () => sound.playSuccess(),
        playResolved: () => sound.playResolved(),
        playAlert: () => sound.playAlert(),
      }}
    >
      {children}
    </SoundContext.Provider>
  );
};

export const useSound = (): SoundContextType => {
  const context = useContext(SoundContext);
  if (!context) {
    throw new Error('useSound must be used within a SoundProvider');
  }
  return context;
};
