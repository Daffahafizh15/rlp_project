/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        forme: {
          primary: '#111111',
          secondary: '#FFFFFF',
          bg: '#F5F5F5',
          card: '#FFFFFF',
          border: '#E5E5E5',
          text: {
            primary: '#222222',
            secondary: '#777777',
            muted: '#999999',
          },
          status: {
            success: '#16A34A',
            warning: '#D97706',
            danger: '#DC2626',
            info: '#2563EB',
          },
        },
      },
      fontFamily: {
        heading: ['Poppins', 'sans-serif'],
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
