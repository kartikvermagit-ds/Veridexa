import React from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { useSound } from '../../context/SoundContext';
import { useTheme } from '../../context/ThemeContext';

export const SoundToggle: React.FC = () => {
  const { isSoundEnabled, toggleSound } = useSound();
  const { isDark } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleSound}
      aria-label={isSoundEnabled ? 'Disable clicking sounds' : 'Enable clicking sounds'}
      title={isSoundEnabled ? 'Sound Effects: ON (Click to mute)' : 'Sound Effects: MUTED (Click to enable)'}
      className={`relative inline-flex items-center justify-center p-2 rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
        isDark
          ? isSoundEnabled
            ? 'bg-surface-elevated border-surface-border text-indigo-400 hover:text-indigo-300 hover:bg-slate-700'
            : 'bg-surface-elevated border-surface-border text-slate-500 hover:text-slate-400 hover:bg-slate-700'
          : isSoundEnabled
          ? 'bg-white border-slate-200 text-indigo-600 hover:text-indigo-700 hover:bg-slate-50 shadow-xs'
          : 'bg-white border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-slate-50 shadow-xs'
      }`}
    >
      {isSoundEnabled ? (
        <Volume2 className="w-4 h-4 transition-transform active:scale-90 duration-150" />
      ) : (
        <VolumeX className="w-4 h-4 transition-transform active:scale-90 duration-150 text-slate-400" />
      )}
    </button>
  );
};
