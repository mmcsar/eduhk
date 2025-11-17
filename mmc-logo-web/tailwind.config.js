/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        mmcBlue: '#1756a5',
        mmcBlueDark: '#143c81',
      },
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
      },
      dropShadow: {
        glow: '0 10px 18px rgba(23, 86, 165, 0.25)',
      },
      keyframes: {
        'ring-draw': {
          '0%': { strokeDasharray: '950', strokeDashoffset: '950', opacity: '0' },
          '20%': { opacity: '1' },
          '100%': { strokeDashoffset: '0', opacity: '1' },
        },
        'scale-in': {
          '0%': { transform: 'scale(0.92)', opacity: '0' },
          '60%': { transform: 'scale(1.02)', opacity: '1' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'fade-up': {
          '0%': { transform: 'translateY(18px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'glow-pulse': {
          '0%, 100%': { filter: 'drop-shadow(0 10px 18px rgba(23,86,165,0.25))' },
          '50%': { filter: 'drop-shadow(0 18px 26px rgba(23,86,165,0.45))' },
        },
      },
      animation: {
        'ring-draw': 'ring-draw 1.8s ease forwards',
        'scale-in': 'scale-in 900ms cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'fade-up': 'fade-up 850ms ease forwards',
        'glow-pulse': 'glow-pulse 4.2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}

