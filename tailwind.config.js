/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        guild: {
          bg: '#141821',
          primary: '#C49A55',
          secondary: '#263447',
          accent: '#67C7D4',
          text: '#F1E7D0',
        },
        brand: {
          50: '#ecfeff',
          100: '#cffafe',
          200: '#a5f3fc',
          300: '#67e8f9',
          400: '#22d3ee',
          500: '#06b6d4',
          600: '#0891b2',
          700: '#0e7490',
          800: '#155e75',
          900: '#164e63',
          950: '#083344',
        },
        navy: {
          850: '#0d1527',
          900: '#0a0f1d',
          950: '#060a14',
        },
      },
      fontFamily: {
        serif: ['Cinzel', 'Playfair Display', 'Cormorant Garamond', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'forge': '0 0 25px -3px rgba(196, 154, 85, 0.35)',
        'blueprint': '0 0 25px -3px rgba(103, 199, 212, 0.3)',
      },
    },
  },
  plugins: [],
};
