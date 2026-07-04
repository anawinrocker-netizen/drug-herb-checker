/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Herbal luxury palette: deep emerald + forest green + champagne gold
        brand: {
          50: '#ECFDF5',
          100: '#D1FAE5',
          200: '#A7F3D0',
          300: '#6EE7B7',
          400: '#34D399',
          500: '#10B981',
          600: '#1B6B4C', // forest green (secondary)
          700: '#14532D', // deep emerald (primary)
          800: '#0F5132', // deep emerald (dark)
          900: '#0B3D26',
        },
        sage: {
          DEFAULT: '#6B8E7F',
          light: '#9DB4A8',
          dark: '#52705F',
        },
        gold: {
          50: '#FBF8EF',
          100: '#F5EEDC',
          200: '#E9DCB8',
          300: '#DCC993',
          400: '#C9A961', // champagne gold (main accent)
          500: '#D4AF37', // metallic gold (small highlights)
          600: '#A98634',
          700: '#8A6D2A',
        },
        // Surfaces and text
        canvas: '#FAFDF9', // warm cream-white page background
        ink: {
          DEFAULT: '#1A2E23', // deep green-tinted charcoal
          soft: '#56695E', // secondary text
        },
        // Risk levels (badges / accents only) — kept, slightly refined
        risk: {
          high: '#DC2626',
          highBg: '#FEF1F1',
          medium: '#D97706',
          mediumBg: '#FEF7E6',
          low: '#16A34A',
          lowBg: '#EBFAEF',
          unknown: '#6B7280',
          unknownBg: '#F4F5F6',
        },
      },
      fontFamily: {
        sans: ['"IBM Plex Sans Thai"', '"Noto Sans Thai"', 'system-ui', 'sans-serif'],
        display: ['Prompt', '"IBM Plex Sans Thai"', '"Noto Sans Thai"', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      boxShadow: {
        // Layered green-tinted shadows — never hard black
        soft: '0 1px 2px rgba(15, 81, 50, 0.05), 0 4px 14px rgba(15, 81, 50, 0.07)',
        lift: '0 10px 30px rgba(15, 81, 50, 0.14), 0 3px 10px rgba(15, 81, 50, 0.08)',
        glow: '0 0 0 1px rgba(201, 169, 97, 0.28), 0 6px 28px rgba(201, 169, 97, 0.25)',
        'glow-green': '0 0 32px rgba(16, 185, 129, 0.28)',
        'inner-gold': 'inset 0 0 0 1px rgba(201, 169, 97, 0.35)',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'gradient-pan': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        'blob-drift': {
          '0%, 100%': { transform: 'translate3d(0, 0, 0) scale(1)' },
          '33%': { transform: 'translate3d(28px, -22px, 0) scale(1.06)' },
          '66%': { transform: 'translate3d(-20px, 18px, 0) scale(0.96)' },
        },
        'leaf-fall': {
          '0%': { transform: 'translate3d(0, -12vh, 0) rotate(0deg)' },
          '100%': {
            transform: 'translate3d(var(--drift, 60px), 112vh, 0) rotate(var(--spin, 200deg))',
          },
        },
        'leaf-sway': {
          '0%, 100%': { transform: 'translateX(-8px) rotate(-8deg)' },
          '50%': { transform: 'translateX(10px) rotate(9deg)' },
        },
        rise: {
          '0%': { transform: 'translate3d(0, 0, 0) scale(1)', opacity: '0' },
          '12%': { opacity: 'var(--pop, 0.7)' },
          '100%': { transform: 'translate3d(var(--sway, 14px), -72vh, 0) scale(0.5)', opacity: '0' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 18px rgba(201, 169, 97, 0.18)' },
          '50%': { boxShadow: '0 0 34px rgba(201, 169, 97, 0.4)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.4s ease forwards',
        'gradient-pan': 'gradient-pan 14s ease infinite',
        'blob-drift': 'blob-drift 16s ease-in-out infinite',
        shimmer: 'shimmer 1.8s linear infinite',
        'pulse-glow': 'pulse-glow 3.2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
