/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {},
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      'black': '#030712',
      'whites': '#FFFFFF',
      'soft-white': '#e4e4e7',
      'gray' : '#282828',
      'purple': '#6d28d9',
      'purple2': '#a855f7'

    },
  },
  plugins: [],
}

