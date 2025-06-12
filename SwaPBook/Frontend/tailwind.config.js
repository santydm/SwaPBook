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
        'slide-in': {
          'from': { transform: 'translateX(100%)' },
          'to': { transform: 'translateX(0)' },
        },
        'timer-line': {
          'from': { transform: 'scaleX(1)' },
          'to': { transform: 'scaleX(0)' },
        },
        'bounce-subtle': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' }
        },
      },
      animation: {
        'slide-in-right': 'slide-in-right 0.3s ease-out',
        'slide-in': 'slide-in 0.3s cubic-bezier(.4,0,.2,1)',
        'timer-line': 'timer-line linear forwards',
        'bounce-subtle': 'bounce-subtle 2s ease-in-out infinite'
      },
      colors: {
        'Swap-vinotinto': '#722F37',
        'Swap-beige': '#C9B084',
        'Swap-green': '#009000',
        'Swap-green-dark': '#06402B',
        'Swap-cream': '#e7d8ca',
        // Paleta extendida para mejor contraste
        'Swap-beige-light': '#f7ecdc',
        'Swap-vinotinto-dark': '#5A252B',
      }
    },
  },
  plugins: [],
}
