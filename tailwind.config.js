/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: "class",
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {

    extend: {colors: {
        'teal': {
          400: '#9ACBD0',
          800: '#006A71',
        },
        'gray': {
          200: '#F2EFE7',
        },
      },},
  },
  plugins: [
      require('tailwind-scrollbar'),
  ],
}

