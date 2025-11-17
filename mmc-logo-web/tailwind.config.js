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
    },
  },
  plugins: [],
}

