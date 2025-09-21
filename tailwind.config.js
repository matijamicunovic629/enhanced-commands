/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        dark: {
          50: '#f7f7f8',
          100: '#eeeef1',
          200: '#d9d9df',
          300: '#b6b7c2',
          400: '#8e8fa1',
          500: '#6f7085',
          600: '#585a6c',
          700: '#484957',
          800: '#3d3e49',
          900: '#363740',
          950: '#0a0a0c',
        },
      },
    },
  },
  plugins: [],
};