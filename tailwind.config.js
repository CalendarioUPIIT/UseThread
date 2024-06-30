/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        'poppins': ['Poppins'],
        'poppins-bold': ['Poppins-Bold'],
        'poppins-thin': ['Poppins-Thin'],
      },
    },
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      'black': '#030712',
      'whites': '#FFFFFF',
      'soft-white': '#f5f5f5',
      'gray' : '#282828',
      'gray2': '1E1E1E',
      'purple': '#6d28d9',
      'purple2': '#a855f7',
      'red' : '#f87171',
      'light-purple': '#f5f3ff',
      'light-gray': '#1f2937',
      'purple3': '#2B045E',
      'purple4': '#43009A',
    },
  },
  plugins: [],
}

