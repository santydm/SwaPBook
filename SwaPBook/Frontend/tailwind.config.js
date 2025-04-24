/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'Swap-vinotinto': '#722F37',
        'Swap-beige': '#C9B084'
      }
    },
  },
  plugins: [],
}

