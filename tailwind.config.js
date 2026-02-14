/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['DM Sans', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
        display: ['Sora', 'sans-serif'],
      },
      colors: {
        bg: {
          900: '#0a0e1a',
          800: '#0f1424',
          700: '#151b30',
          600: '#1c2340',
        },
        border: '#1e2642',
        'border-hover': '#2a3458',
        primary: '#10b981',
        'primary-dim': '#059669',
        'primary-glow': 'rgba(16, 185, 129, 0.15)',
        accent: {
          orange: '#f59e0b',
          red: '#ef4444',
          blue: '#3b82f6',
          purple: '#8b5cf6',
        },
        text: {
          primary: '#f1f5f9',
          secondary: '#94a3b8',
          muted: '#64748b',
        },
      },
      boxShadow: {
        'card': '0 4px 24px rgba(0,0,0,0.3)',
        'card-hover': '0 8px 32px rgba(0,0,0,0.4)',
        'glow-green': '0 0 24px rgba(16,185,129,0.2)',
        'glow-red': '0 0 24px rgba(239,68,68,0.2)',
        'glow-orange': '0 0 24px rgba(245,158,11,0.2)',
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'slide-right': 'slideRight 0.3s ease-out',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
        slideUp: {
          from: { opacity: 0, transform: 'translateY(16px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
        slideRight: {
          from: { opacity: 0, transform: 'translateX(-16px)' },
          to: { opacity: 1, transform: 'translateX(0)' },
        },
      },
    },
  },
  plugins: [],
}
