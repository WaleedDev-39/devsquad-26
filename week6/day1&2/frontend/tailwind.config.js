/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-satoshi)', 'system-ui', 'sans-serif'],
        heading: ['var(--font-integral)', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          black: '#000000',
          white: '#FFFFFF',
          gray: '#F0F0F0',
          'gray-2': '#F2F0F1',
          'gray-3': '#737373',
          'gray-4': '#999999',
          red: '#FF3333',
          'red-light': '#FF33331A',
        },
      },
      borderRadius: {
        '4xl': '2rem',
      },
      screens: {
        xs: '390px',
      },
    },
  },
  plugins: [],
};
