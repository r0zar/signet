/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          legacy: "#c1121f",
          dark: "#a8101b",
          light: "#ff4d6d",
        },
        secondary: {
          legacy: "#8d99ae",
        },
        accent: {
          legacy: "#F76808",
          light: "#FF8A3D",
        },
        background: {
          dark: "#000000",
          light: "#FFFFFF",
        }
      },
      container: {
        center: true,
        padding: {
          DEFAULT: '1rem',
          sm: '2rem',
          lg: '3rem'
        },
        screens: {
          DEFAULT: '100%',
          sm: '640px',
          md: '768px',
          lg: '1024px',
          xl: '1200px',
        },
      },
      animation: {
        'shimmer': 'shimmer 2s infinite',
        'pulse-glow': 'pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-in-up': 'slideInUp 0.5s ease-out',
        'border-pulse': 'borderPulse 2s infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { transform: 'translateX(var(--shimmer-from))' },
          '100%': { transform: 'translateX(var(--shimmer-to))' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.5 },
        },
        fadeIn: {
          'from': { opacity: 0 },
          'to': { opacity: 1 },
        },
        slideInUp: {
          'from': { transform: 'translateY(20px)', opacity: 0 },
          'to': { transform: 'translateY(0)', opacity: 1 },
        },
        borderPulse: {
          '0%': { borderColor: 'rgba(193, 18, 31, 0.3)' },
          '50%': { borderColor: 'rgba(193, 18, 31, 0.8)' },
          '100%': { borderColor: 'rgba(193, 18, 31, 0.3)' },
        }
      },
      boxShadow: {
        'glow': '0 0 15px rgba(193, 18, 31, 0.4)',
        'glow-sm': '0 0 10px rgba(193, 18, 31, 0.3)',
      },
    },
  },
  plugins: [],
}

