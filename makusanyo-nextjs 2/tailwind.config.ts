import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['IBM Plex Sans', 'system-ui', 'sans-serif'],
        serif: ['IBM Plex Serif', 'Georgia', 'serif'],
        mono: ['IBM Plex Mono', 'monospace'],
      },
      colors: {
        navy: {
          950: '#0a1420',
          900: '#0d1c30',
          800: '#0f1d30',
          700: '#132842',
          600: '#16304f',
          500: '#1b3455',
        },
        gold: {
          400: '#e3c877',
          500: '#c8a24a',
          600: '#a8781f',
          700: '#8f6f22',
        },
      },
      keyframes: {
        fadein: { from: { opacity: '0', transform: 'translateY(8px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
      },
      animation: {
        fadein: 'fadein .3s ease',
      },
    },
  },
  plugins: [],
};
export default config;
