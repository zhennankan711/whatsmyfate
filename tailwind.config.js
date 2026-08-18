/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'Noto Sans SC', 'system-ui', 'sans-serif'],
        serif: ['Noto Serif SC', 'Georgia', 'serif'],
        display: ['Orbitron', 'Noto Serif SC', 'serif'],
      },
      colors: {
        'cyber-black': '#0a0a0f',
        'cyber-cyan': '#00f0ff',
        'cyber-magenta': '#ff00aa',
        'bazi-bg': '#1a0505',
        'bazi-gold': '#c9a84c',
        'bazi-red': '#8b0000',
        'bazi-text': '#f0e6d2',
        'tarot-bg': '#0d001a',
        'tarot-violet': '#b24bff',
        'tarot-magenta': '#ff66cc',
        'tarot-text': '#e8d5f2',
        'book-bg': '#050a1a',
        'book-blue': '#7eb8ff',
        'book-silver': '#c0c0c0',
        'book-text': '#d5e0f0',
        'draw-bg': '#1a0a00',
        'draw-gold': '#daa520',
        'draw-red': '#cd5c5c',
        'draw-text': '#f5e6c8',
      },
    },
  },
  plugins: [],
};
