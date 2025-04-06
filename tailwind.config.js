/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#4AB8B1',
          light: '#62D2CB',
          dark: '#3A9690'
        },
        secondary: {
          DEFAULT: '#FF9671',
          light: '#FFAD93',
          dark: '#E87D5C'
        },
        background: '#F9F7F7',
        textDark: '#333333',
        textLight: '#FFFFFF',
        accent: '#B39DDB',
        error: '#EF5350',
        success: '#66BB6A'
      },
      fontFamily: {
        sans: ['Rubik', 'system-ui', '-apple-system', 'sans-serif'],
      },
      borderRadius: {
        'normal': '8px',
        'large': '12px',
      },
      boxShadow: {
        'card': '0 2px 8px rgba(0, 0, 0, 0.08)',
        'dropdown': '0 4px 12px rgba(0, 0, 0, 0.15)',
      },
      spacing: {
        '72': '18rem',
        '84': '21rem',
        '96': '24rem',
      }
    },
  },
  plugins: [],
}