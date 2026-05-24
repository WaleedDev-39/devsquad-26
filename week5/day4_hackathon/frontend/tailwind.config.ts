import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#5357A6',
          DEFAULT: '#3B3F8C',
          dark: '#2A2D65',
        },
        secondary: {
          light: '#FFE44D',
          DEFAULT: '#FFD700', // OR #F5A623 from the design
          dark: '#CCAC00',
        },
        accent: '#E8463A', // Trending badges
        background: {
          light: '#F8F9FA',
          DEFAULT: '#FFFFFF',
          dark: '#F5F6FA',
        },
      },
      fontFamily: {
        sans: ['var(--font-poppins)', 'Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
export default config;
