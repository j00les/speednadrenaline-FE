import defaultTheme from 'tailwindcss/defaultTheme';
// ** @type {import('tailwindcss').Config} */

export default {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
    './node_modules/primereact/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      fontFamily: {
        titillium: ['"Titillium Web"', ...defaultTheme.fontFamily.sans],
        sugo: ["'Sugo Pro Display Trial'", ...defaultTheme.fontFamily.sans],
        mount: ["'high-mount'", ...defaultTheme.fontFamily.sans],
        bernard: ["'bernard-con'", ...defaultTheme.fontFamily.sans]
      }
    }
  },
  plugins: []
};
