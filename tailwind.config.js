/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        surface: {
          50: '#ffffff',
          100: '#f8fafc',
          200: '#f1f5f9',
          300: '#e2e8f0',
          400: '#cbd5e1',
          500: '#94a3b8',
          600: '#64748b',
          700: '#475569',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617',
        },
        ink: {
          50: '#ffffff',
          100: '#f8fafc',
          200: '#f1f5f9',
          300: '#e2e8f0',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617',
        },
        brand: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#ff4d00',
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
          950: '#431407',
        },
        accent: {
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
        },
        pop: {
          red: '#ef4444',
          orange: '#f97316',
          blue: '#3b82f6',
          cyan: '#06b6d4',
        }
      },
      fontFamily: {
        sans: ['Inter', 'DM Sans', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['Plus Jakarta Sans', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      boxShadow: {
        soft: '0 2px 8px rgba(15,23,42,0.06)',
        card: '0 12px 32px -16px rgba(15,23,42,0.18)',
        'card-hover': '0 28px 60px -22px rgba(255,77,0,0.28)',
        glow: '0 22px 48px -16px rgba(255,77,0,0.45)',
        'glow-sm': '0 10px 24px -10px rgba(255,77,0,0.38)',
        glass: '0 8px 32px rgba(15,23,42,0.12)',
        'brand-soft': '0 4px 16px rgba(255,77,0,0.18)',
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(135deg, #ff4d00 0%, #ea580c 45%, #c2410c 100%)',
        'brand-gradient-soft': 'linear-gradient(135deg, #fff7ed 0%, #ffedd5 50%, #fef3c7 100%)',
        'brand-gradient-reverse': 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 45%, #1e40af 100%)',
        'mesh': 'radial-gradient(60% 60% at 18% 12%, rgba(255,77,0,0.08) 0%, rgba(255,77,0,0) 60%), radial-gradient(55% 55% at 88% 18%, rgba(59,130,246,0.08) 0%, rgba(59,130,246,0) 60%), radial-gradient(50% 50% at 70% 95%, rgba(249,115,22,0.06) 0%, rgba(249,115,22,0) 60%)',
        'mesh-pop': 'radial-gradient(60% 60% at 18% 12%, rgba(255,77,0,0.12) 0%, rgba(255,77,0,0) 60%), radial-gradient(55% 55% at 88% 18%, rgba(59,130,246,0.12) 0%, rgba(59,130,246,0) 60%), radial-gradient(50% 50% at 70% 95%, rgba(239,68,68,0.08) 0%, rgba(239,68,68,0) 60%)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(18px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'gradient-pan': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        'pulse-ring': {
          '0%': { transform: 'scale(0.95)', opacity: '0.7' },
          '70%, 100%': { transform: 'scale(1.3)', opacity: '0' },
        },
        'bounce-pop': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.6s ease-out both',
        float: 'float 6s ease-in-out infinite',
        'gradient-pan': 'gradient-pan 14s ease infinite',
        'pulse-ring': 'pulse-ring 2.4s cubic-bezier(0.4,0,0.6,1) infinite',
        'bounce-pop': 'bounce-pop 1.8s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
