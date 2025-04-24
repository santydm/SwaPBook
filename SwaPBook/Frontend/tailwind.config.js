/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'blue': {
          600: '#2563eb', // Puedes ajustar este color
        },
      },
    },
  },
  plugins: [],
}