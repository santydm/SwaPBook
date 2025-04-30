/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        'slide-in-right': {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        'bounce-subtle': {
          '0%, 100%': { transform: 'translateY(0) translateX(-50%)' },
          '50%': { transform: 'translateY(-5px) translateX(-50%)' }
        },
      },
      animation: {
        'slide-in-right': 'slide-in-right 0.3s ease-out',
        'bounce-subtle': 'bounce-subtle 2s ease-in-out infinite'
      },
      colors: {
        'Swap-vinotinto': '#722F37',
        'Swap-beige': '#C9B084',
        'Swap-green': '#009000',
        'Swap-green-dark': '#06402B',
      }
    },
  },
  plugins: [],
}

