/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bc: {
          navy: {
            50: '#eef3fb',
            100: '#d7e4f6',
            200: '#b4cfef',
            300: '#83b2e5',
            400: '#4e8fd7',
            500: '#2b72c6',
            600: '#1d5aa9',
            700: '#19488a',
            800: '#00205B', // Core British Council Deep Navy
            900: '#001640',
            950: '#000d27',
          },
          teal: {
            50: '#edfcfa',
            100: '#cff8f3',
            200: '#a3f0e7',
            300: '#67e2d6',
            400: '#26c9bc',
            500: '#00A3B5', // Core British Council Cyan / Teal
            600: '#068b9d',
            700: '#0b707f',
            800: '#0f5b67',
            900: '#114a55',
          },
          winter: {
            50: '#f0f7ff',
            100: '#e0effe',
            500: '#0284c7',
            700: '#0369a1',
          },
          summer: {
            50: '#fffbeb',
            100: '#fef3c7',
            500: '#f59e0b',
            700: '#b45309',
          },
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
