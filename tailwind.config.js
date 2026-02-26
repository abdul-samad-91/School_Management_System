/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#506ee4',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
      },
      fontFamily: {
        h1: ['"Inter"', 'serif'],
        h2: ['Roboto', 'sans-serif'],
        h3: ['Inter', 'sans-serif'],
        h4: ['Roboto', 'serif'],
        h5: ['"Inter"', 'Roboto'],
        h6: ['Playfair Display', 'sans-serif'],
      },
    },
  },
  plugins: [],
}




