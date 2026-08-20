import React from 'react';
import { useTheme } from '../../context/ThemeContext';

interface VeridexaLogoProps {
  variant?: 'full' | 'compact' | 'icon';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const VeridexaLogo: React.FC<VeridexaLogoProps> = ({
  variant = 'full',
  size = 'md',
  className = ''
}) => {
  const { isDark } = useTheme();

  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  }[size];

  const textSizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-xl',
    xl: 'text-2xl'
  }[size];

  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      {/* Stylized Ribbon 'V' with Digital Data Sparks */}
      <svg
        viewBox="0 0 100 100"
        className={`${iconSizes} shrink-0 drop-shadow-md transition-transform hover:scale-105 duration-300`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Left ribbon gradient */}
          <linearGradient id="v_left_grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00D2FF" />
            <stop offset="60%" stopColor="#0066FF" />
            <stop offset="100%" stopColor="#6C28D9" />
          </linearGradient>

          {/* Right ribbon gradient */}
          <linearGradient id="v_right_grad" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#7C3AED" />
            <stop offset="50%" stopColor="#3B82F6" />
            <stop offset="100%" stopColor="#00F0FF" />
          </linearGradient>

          {/* Inner glowing curve */}
          <linearGradient id="v_inner_glow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#C084FC" stopOpacity="0.9" />
          </linearGradient>

          {/* Pixel block gradients */}
          <linearGradient id="pixel_grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38BDF8" />
            <stop offset="100%" stopColor="#0099FF" />
          </linearGradient>
        </defs>

        {/* Glow backdrop in dark mode */}
        {isDark && (
          <circle cx="50" cy="55" r="35" fill="#3B82F6" opacity="0.18" filter="blur(12px)" />
        )}

        {/* Left main ribbon */}
        <path
          d="M12 28 C12 28, 26 22, 34 32 L50 82 C48 83, 38 78, 22 46 L12 28 Z"
          fill="url(#v_left_grad)"
        />

        {/* Vertex highlight curve */}
        <path
          d="M22 46 C34 68, 44 82, 50 84 C56 82, 66 68, 78 46 L68 40 C58 58, 52 70, 50 72 C48 70, 42 58, 32 40 L22 46 Z"
          fill="url(#v_inner_glow)"
          opacity="0.85"
        />

        {/* Right main ribbon */}
        <path
          d="M50 82 L70 32 C78 22, 92 28, 92 28 L82 46 C66 78, 56 83, 50 82 Z"
          fill="url(#v_right_grad)"
        />

        {/* Digital Intelligence Pixel Data Sparks (Top Right) */}
        <rect x="74" y="16" width="6" height="6" rx="1" fill="url(#pixel_grad)" />
        <rect x="83" y="14" width="7" height="7" rx="1.5" fill="#00D2FF" />
        <rect x="92" y="18" width="5" height="5" rx="1" fill="url(#pixel_grad)" />
        <rect x="79" y="24" width="6.5" height="6.5" rx="1" fill="#38BDF8" />
        <rect x="88" y="23" width="5.5" height="5.5" rx="1" fill="#0066FF" />
      </svg>

      {/* Typography Brand Block */}
      {variant !== 'icon' && (
        <div className="flex flex-col justify-center leading-none">
          {/* Main Title: VERIDEXA™ */}
          <div className="flex items-center gap-1.5">
            <span
              className={`font-extrabold tracking-tight font-sans ${textSizes} ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}
              style={{ letterSpacing: '0.04em' }}
            >
              VERID<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">EXA</span>
            </span>
            <span className={`text-[9px] font-bold ${isDark ? 'text-slate-400' : 'text-slate-500'} -mt-2`}>
              TM
            </span>
          </div>

          {/* Tagline */}
          {variant === 'full' && (
            <>
              <span
                className={`text-[9px] font-bold tracking-[0.22em] uppercase mt-1 ${
                  isDark ? 'text-cyan-400' : 'text-indigo-600'
                }`}
              >
                AI-Powered Product Intelligence
              </span>
              <div className="flex items-center gap-1.5 mt-1">
                <span className={`h-px w-4 ${isDark ? 'bg-indigo-500/40' : 'bg-slate-300'}`} />
                <span className={`text-[8px] font-bold uppercase tracking-widest font-mono ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  by Team KAVRIX
                </span>
                <span className={`h-px w-4 ${isDark ? 'bg-purple-500/40' : 'bg-slate-300'}`} />
              </div>
            </>
          )}

          {variant === 'compact' && (
            <span className={`text-[10px] font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              by Team KAVRIX
            </span>
          )}
        </div>
      )}
    </div>
  );
};
