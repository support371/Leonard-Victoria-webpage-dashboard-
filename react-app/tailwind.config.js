/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          50:  '#f0f4ff',
          100: '#e0eaf8',
          200: '#c2d4f0',
          300: '#94b3e0',
          400: '#6b90cc',
          500: '#4d74b8',
          600: '#3b5da0',
          700: '#2e4a84',
          800: '#1e3a5f',
          900: '#132848',
        },
      },
    },
  },
  plugins: [
    require('tailwindcss-animate')
  ],
}
