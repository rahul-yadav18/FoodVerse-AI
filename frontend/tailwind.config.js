/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0fdf4',
          100: '#dcfce7',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          dark: '#0a0f1d',
          card: '#111827',
          border: '#1f2937'
        }
      },
      animation: {
        'scan': 'scan 2.5s ease-in-out infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        scan: {
          '0%, 100%': { transform: 'translateY(0%)', opacity: '0.8' },
          '50%': { transform: 'translateY(90%)', opacity: '1' },
        },
        glow: {
          'from': { boxShadow: '0 0 10px rgba(34, 197, 94, 0.2)' },
          'to': { boxShadow: '0 0 25px rgba(34, 197, 94, 0.6)' },
        }
      }
    },
  },
  plugins: [],
}
