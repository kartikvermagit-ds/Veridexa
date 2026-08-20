import React from 'react';
import { useTheme } from '../../context/ThemeContext';

interface VeridexaLogoProps {
  variant?: 'full' | 'compact' | 'icon';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const VeridexaLogo: React.FC<VeridexaLogoProps> = ({
  variant = 'full',
  size = 'md',
  className = ''
}) => {
  const { isDark } = useTheme();

  const iconSizes = {
    xs: 'w-6 h-6',
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
    xl: 'w-20 h-20'
  }[size];

  const textSizes = {
    xs: 'text-xs',
    sm: 'text-sm',
    md: 'text-[16px]',
    lg: 'text-2xl',
    xl: 'text-3xl'
  }[size];

  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      {/* 3D Chiseled Metallic Dual-Energy Blue + Orange Emblem */}
      <svg
        viewBox="0 0 200 200"
        className={`${iconSizes} shrink-0 transition-transform duration-200 hover:scale-105`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Blue Energy Gradient */}
          <linearGradient id="v_blue_glow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38BDF8" />
            <stop offset="50%" stopColor="#0080FF" />
            <stop offset="100%" stopColor="#024499" />
          </linearGradient>

          {/* Orange Energy Gradient */}
          <linearGradient id="v_orange_glow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF9933" />
            <stop offset="50%" stopColor="#FF5500" />
            <stop offset="100%" stopColor="#992200" />
          </linearGradient>

          {/* Metallic Titanium Gray Gradient */}
          <linearGradient id="v_metal_core" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#E2E8F0" />
            <stop offset="40%" stopColor="#94A3B8" />
            <stop offset="70%" stopColor="#475569" />
            <stop offset="100%" stopColor="#1E293B" />
          </linearGradient>

          {/* Light Metallic Highlight */}
          <linearGradient id="v_metal_light" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#94A3B8" stopOpacity="0.2" />
          </linearGradient>

          {/* Compass Ring Bevel */}
          <radialGradient id="v_ring_bevel" cx="50%" cy="50%" r="50%">
            <stop offset="60%" stopColor="#334155" stopOpacity="0.2" />
            <stop offset="85%" stopColor="#64748B" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#0F172A" />
          </radialGradient>
        </defs>

        {/* Outer Glow in Dark Theme */}
        {isDark && (
          <>
            <circle cx="100" cy="100" r="70" fill="#0080FF" opacity="0.12" filter="blur(16px)" />
            <circle cx="120" cy="100" r="60" fill="#FF5500" opacity="0.12" filter="blur(16px)" />
          </>
        )}

        {/* Industrial Compass Outer Ring & Gear Teeth */}
        <circle cx="100" cy="100" r="76" stroke="#475569" strokeWidth="3" opacity="0.6" />
        <circle cx="100" cy="100" r="70" stroke="url(#v_metal_core)" strokeWidth="6" opacity="0.8" />
        <circle cx="100" cy="100" r="64" stroke="#1E293B" strokeWidth="2" />

        {/* 12 Radial Compass / Star Spikes */}
        {/* North Primary Spire */}
        <polygon points="100,10 106,64 100,60 94,64" fill="url(#v_metal_core)" stroke="#64748B" strokeWidth="0.8" />
        {/* South Spire */}
        <polygon points="100,190 106,136 100,140 94,136" fill="url(#v_metal_core)" stroke="#64748B" strokeWidth="0.8" />
        {/* West Spire (Blue Glowing) */}
        <polygon points="10,100 64,106 60,100 64,94" fill="url(#v_blue_glow)" />
        {/* East Spire (Orange Glowing) */}
        <polygon points="190,100 136,106 140,100 136,94" fill="url(#v_orange_glow)" />

        {/* Diagonal Secondary Spikes */}
        {/* NW Spike (Blue) */}
        <polygon points="36,36 78,68 72,72 68,78" fill="url(#v_blue_glow)" opacity="0.85" />
        {/* NE Spike (Titanium) */}
        <polygon points="164,36 122,68 128,72 132,78" fill="url(#v_metal_core)" opacity="0.85" />
        {/* SW Spike (Blue) */}
        <polygon points="36,164 78,132 72,128 68,122" fill="url(#v_blue_glow)" opacity="0.85" />
        {/* SE Spike (Orange) */}
        <polygon points="164,164 122,132 128,128 132,122" fill="url(#v_orange_glow)" opacity="0.85" />

        {/* Mini Star Rays */}
        <polygon points="65,22 80,55 76,57" fill="#64748B" opacity="0.7" />
        <polygon points="135,22 120,55 124,57" fill="#64748B" opacity="0.7" />
        <polygon points="22,65 55,80 57,76" fill="url(#v_blue_glow)" opacity="0.7" />
        <polygon points="178,65 145,80 143,76" fill="url(#v_orange_glow)" opacity="0.7" />
        <polygon points="22,135 55,120 57,124" fill="url(#v_blue_glow)" opacity="0.7" />
        <polygon points="178,135 145,120 143,124" fill="url(#v_orange_glow)" opacity="0.7" />

        {/* Central Geometric Chiseled "V" Emblem */}
        {/* Central Titanium Chevron Core */}
        <polygon points="100,50 120,85 100,120 80,85" fill="url(#v_metal_core)" stroke="#94A3B8" strokeWidth="1" />
        <polygon points="100,50 100,120 80,85" fill="url(#v_metal_light)" opacity="0.4" />

        {/* Left Wing (Electric Cyan/Blue Luminous Bevels) */}
        {/* Upper Outer Facet */}
        <polygon points="40,55 100,145 84,145 30,68" fill="url(#v_blue_glow)" stroke="#38BDF8" strokeWidth="1" />
        {/* Inner Highlight Channel */}
        <polygon points="40,55 84,145 74,135 48,75" fill="#38BDF8" opacity="0.8" />
        {/* Top Bevel Cap */}
        <polygon points="30,68 40,55 70,68 55,78" fill="url(#v_metal_core)" />

        {/* Right Wing (Molten Amber/Orange Luminous Bevels) */}
        {/* Upper Outer Facet */}
        <polygon points="160,55 100,145 116,145 170,68" fill="url(#v_orange_glow)" stroke="#FB923C" strokeWidth="1" />
        {/* Inner Highlight Channel */}
        <polygon points="160,55 116,145 126,135 152,75" fill="#FDBA74" opacity="0.8" />
        {/* Top Bevel Cap */}
        <polygon points="170,68 160,55 130,68 145,78" fill="url(#v_metal_core)" />

        {/* Center Apex Diamond Highlight */}
        <polygon points="100,132 107,144 100,154 93,144" fill="#FFFFFF" opacity="0.9" />
      </svg>

      {/* Typography Brand Block */}
      {variant !== 'icon' && (
        <div className="flex flex-col justify-center leading-none">
          {/* Main Title: VERIDEXA */}
          <div className="flex items-center">
            <span
              className={`font-black tracking-wider uppercase font-sans ${textSizes} ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}
              style={{ letterSpacing: '0.06em' }}
            >
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-500">V</span>
              <span className={isDark ? 'text-slate-100' : 'text-slate-800'}>ERIDE</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-500">XA</span>
            </span>
          </div>

          {/* Dual-Tone Subtitle: AI-POWERED PRODUCT INTELLIGENCE */}
          {variant === 'full' && (
            <>
              <div className="flex items-center gap-1 mt-1 text-[8px] font-bold tracking-[0.20em] uppercase font-mono">
                <span className="text-sky-500 dark:text-sky-400">AI-POWERED</span>
                <span className="text-orange-500 dark:text-orange-400">PRODUCT INTELLIGENCE</span>
              </div>

              {/* Byline: BY TEAM KAVRIX flanked by dual-color rules */}
              <div className="flex items-center gap-1.5 mt-1">
                <span className="h-[1.5px] w-3 bg-gradient-to-r from-transparent to-sky-500" />
                <span className={`text-[7.5px] font-bold uppercase tracking-widest font-mono ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  BY TEAM KAVRIX
                </span>
                <span className="h-[1.5px] w-3 bg-gradient-to-l from-transparent to-orange-500" />
              </div>
            </>
          )}

          {variant === 'compact' && (
            <span className={`text-[9px] font-medium mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              by Team KAVRIX
            </span>
          )}
        </div>
      )}
    </div>
  );
};
