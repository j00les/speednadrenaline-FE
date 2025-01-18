import defaultTheme from 'tailwindcss/defaultTheme';
// ** @type {import('tailwindcss').Config} */

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        titillium: ['"Titillium Web"', ...defaultTheme.fontFamily.sans],
        sugo: ["'Sugo Pro Display Trial'", ...defaultTheme.fontFamily.sans]
      }
    }
  },
  plugins: []
};
