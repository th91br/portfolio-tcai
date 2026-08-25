/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          cyan: "#00D2F6",
          lightBlue: "#0096F5",
          blue: "#015EEF",
          deepBlue: "#1D47EF",
        },
        background: {
          primary: "#050914",
          secondary: "#080D18",
          DEFAULT: "#050914",
        },
        dark: {
          950: "#050914",
          900: "#080D18",
          800: "#0E1526",
          700: "#151F38",
          600: "#1E2B4C",
          500: "#2A3B66",
        },
        text: {
          primary: "#F3F5F7",
          secondary: "#AEB7C4",
          muted: "#7E8998",
        },
        slate: {
          light: "#F3F5F7",
          muted: "#AEB7C4",
          dark: "#7E8998",
        },
      },
      fontFamily: {
        kanit: ['Kanit', 'sans-serif'],
        sans: ['Kanit', 'sans-serif'],
      },
      letterSpacing: {
        tighter: '-0.05em',
        tight: '-0.025em',
        normal: '0em',
        wide: '0.025em',
        wider: '0.05em',
        widest: '0.1em',
        ultra: '0.2em',
      },
    },
  },
  plugins: [],
}
