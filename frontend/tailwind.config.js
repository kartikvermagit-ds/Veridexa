/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        industrial: {
          50: '#F8FAFC',
          100: '#F1F5F9',
          200: '#E2E8F0',
          300: '#CBD5E1',
          400: '#94A3B8',
          500: '#64748B',
          600: '#475569',
          700: '#334155',
          800: '#1E293B',
          900: '#0F172A',
          950: '#0B0F19',
        },
        surface: {
          DEFAULT: 'var(--bg-surface)',
          elevated: 'var(--bg-surface-elevated)',
          border: 'var(--border-surface)',
          subtle: 'var(--border-subtle)',
        },
        brand: {
          50: '#EEF2FF',
          100: '#E0E7FF',
          500: '#6366F1',
          600: '#4F46E5',
          700: '#4338CA',
        },
        verified: {
          DEFAULT: '#10B981',
          bg: '#064E3B',
          text: '#6EE7B7',
          border: '#047857'
        },
        enriched: {
          DEFAULT: '#8B5CF6',
          bg: '#4C1D95',
          text: '#C4B5FD',
          border: '#6D28D9'
        },
        inferred: {
          DEFAULT: '#F59E0B',
          bg: '#78350F',
          text: '#FDE68A',
          border: '#B45309'
        },
        conflict: {
          DEFAULT: '#F43F5E',
          bg: '#881337',
          text: '#FECDD3',
          border: '#BE123C'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Courier New', 'monospace']
      }
    },
  },
  plugins: [],
}
