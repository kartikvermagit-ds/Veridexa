import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme, isDark } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      title={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      className={`relative inline-flex items-center justify-center p-2 rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
        isDark
          ? 'bg-surface-elevated border-surface-border text-amber-400 hover:text-amber-300 hover:bg-slate-700'
          : 'bg-white border-slate-200 text-indigo-600 hover:text-indigo-700 hover:bg-slate-50 shadow-sm'
      }`}
    >
      {isDark ? (
        <Sun className="w-4 h-4 transition-transform hover:rotate-45 duration-300" />
      ) : (
        <Moon className="w-4 h-4 transition-transform hover:-rotate-12 duration-300" />
      )}
    </button>
  );
};
