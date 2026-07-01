/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Medical green brand palette (see spec section 4.1)
        brand: {
          50: '#ECFDF5',
          100: '#D1FAE5',
          200: '#A7F3D0',
          300: '#6EE7B7', // mint accent / hover
          400: '#34D399',
          500: '#10B981',
          600: '#059669',
          700: '#1B6B4C', // primary brand green
          800: '#155C41',
          900: '#114A35',
        },
        // Surfaces and text
        canvas: '#F8FBF9', // soft off-white page background
        ink: {
          DEFAULT: '#1F2A24', // primary text (near-black)
          soft: '#5B6B63', // secondary text
        },
        // Risk levels (badges / accents only)
        risk: {
          high: '#DC2626',
          highBg: '#FEE2E2',
          medium: '#D97706',
          mediumBg: '#FEF3C7',
          low: '#16A34A',
          lowBg: '#DCFCE7',
          unknown: '#6B7280',
          unknownBg: '#F3F4F6',
        },
      },
      fontFamily: {
        sans: ['"IBM Plex Sans Thai"', '"Noto Sans Thai"', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '1rem',
      },
      boxShadow: {
        // Soft green-tinted layered shadows (no heavy black)
        soft: '0 1px 2px rgba(27, 107, 76, 0.05), 0 4px 12px rgba(27, 107, 76, 0.06)',
        lift: '0 8px 24px rgba(27, 107, 76, 0.12), 0 2px 8px rgba(27, 107, 76, 0.08)',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.4s ease forwards',
      },
    },
  },
  plugins: [],
}
