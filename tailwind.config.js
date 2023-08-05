/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gradient-cd': 'linear-gradient(to top, #b224ef 0%, #7579ff 100%)',
      },
      width: {
        vw: 'calc(100vw - (100vw - 100%))',
      },
      gridTemplateColumns: {
        playlist: '15px 1fr 85px',
      },
    },
  },
  plugins: [],
}
