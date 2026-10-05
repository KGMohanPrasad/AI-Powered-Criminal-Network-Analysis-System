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
        intel: {
          base: '#070B12',
          bg: '#0A0F1D',
          card: '#0E1626',
          'card-hover': '#141E34',
          panel: '#152038',
          'panel-elevated': '#1A2744',
          border: '#1E2D4A',
          'border-subtle': 'rgba(30, 45, 74, 0.5)',
          'border-bright': 'rgba(34, 211, 238, 0.4)',
          hover: '#243555',
          accent: '#06B6D4', // cyan-500
          cyan: '#22D3EE',
          'cyan-bright': '#67E8F9',
          glow: 'rgba(6, 182, 212, 0.15)',
          muted: '#94A3B8',
          text: '#F1F5F9',
          amber: '#F59E0B',
          red: '#EF4444',
          green: '#10B981',
          radar: '#0284C7'
        }
      },
      fontFamily: {
        display: ['Outfit', 'Inter', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace']
      },
      boxShadow: {
        'subtle': '0 4px 20px -2px rgba(0, 0, 0, 0.5)',
        'cyan-glow': '0 0 20px -2px rgba(6, 182, 212, 0.3)',
        'cyan-glow-sm': '0 0 10px -2px rgba(6, 182, 212, 0.25)',
        'glass-edge': 'inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 12px 36px rgba(0, 0, 0, 0.6)',
        'glass-panel': 'inset 0 1px 0 rgba(255, 255, 255, 0.08), 0 8px 24px rgba(0, 0, 0, 0.45)',
        'tactical-hover': '0 10px 30px -5px rgba(6, 182, 212, 0.18), inset 0 1px 0 rgba(255, 255, 255, 0.15)'
      },
      letterSpacing: {
        'tactical': '0.12em',
        'display': '-0.025em',
        'code': '0.05em'
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'radar-sweep': 'radarSweep 4s linear infinite',
        'glow-breathe': 'glowBreathe 3s ease-in-out infinite alternate',
      },
      keyframes: {
        radarSweep: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' }
        },
        glowBreathe: {
          '0%': { opacity: '0.4' },
          '100%': { opacity: '0.85' }
        }
      }
    },
  },
  plugins: [],
}
