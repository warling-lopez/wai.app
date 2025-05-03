// tailwind.config.js
export default {
    darkMode: 'class', // Habilita el modo oscuro por clase
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    theme: {
      extend: {},
    },
    plugins: [
      require('tailwindcss-animate'), // tw-animate-css
    ],
  }
  