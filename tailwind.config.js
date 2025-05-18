/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'pokemon': ['Arial', 'sans-serif'],
      },
      colors: {
        'pokemon-blue': '#3B82F6',
        'pokemon-red': '#EF4444',
        'pokemon-yellow': '#FCD34D',
        'pokemon-green': '#10B981',
      },
      animation: {
        'bounce-slow': 'bounce 2s infinite',
        'pulse-slow': 'pulse 3s infinite',
      }
    },
  },
  plugins: [],
}
