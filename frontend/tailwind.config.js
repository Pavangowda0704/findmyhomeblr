/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#8ED600',
        'primary-dark': '#7ABD00',
        dark: '#1A2229',
        secondary: '#24303A',
        background: '#F8FAFC',
        'text-main': '#111827',
        'text-sub': '#64748B',
        border: '#E2E8F0'
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif']
      }
    }
  },
  plugins: []
}
