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
          primary: "#07111F",
          secondary: "#08131F",
          surface: "#0A1624",
          deep: "#050B14",
          DEFAULT: "#07111F",
        },
        dark: {
          950: "#050B14",
          900: "#07111F",
          800: "#08131F",
          700: "#0A1624",
          600: "#132238",
          500: "#1C304E",
        },
        text: {
          primary: "#F3F5F7",
          secondary: "#AEB7C4",
          muted: "#64748B",
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
