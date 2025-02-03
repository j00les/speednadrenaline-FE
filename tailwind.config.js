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
      },

      screens: {
        'tv-portrait': { raw: '(min-width: 1080px) and (max-height: 1920px)' } // Custom portrait breakpoint
      },
      spacing: {
        'tv-width': '1080px',
        'tv-height': '1920px'
      },
      fontSize: {
        'tv-small': '1.5rem', // Slightly larger for readability on a big screen
        'tv-medium': '2rem',
        'tv-large': '2.5rem'
      },
      colors: {
        'rgb-red': 'rgb(255,0,0)'
      },
      backgrounds: {
        'rgb-red': 'rgb(255,0,0)'
      }
    }
  },
  plugins: []
};
