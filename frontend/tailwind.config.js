/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Põhivärvid
        primary: {
          DEFAULT: '#2b4c82',  // Logo sinine
          light: '#4a78b3',
          dark: '#1e3a6a',
        },
        // Seisundite värvid
        green: {
          100: '#dcfce7',  // Tavaline tunniplaan taust
          800: '#166534',  // Tavaline tunniplaan tekst
        },
        orange: {
          100: '#ffedd5',  // Eriline tunniplaan taust
          800: '#9a3412',  // Eriline tunniplaan tekst
        },
        // Hall värviskeem
        gray: {
          100: '#f3f4f6',  // Tühistatud/vaba päev taust
          500: '#6b7280',  // Tühistatud/vaba päev tekst
          600: '#4b5563',  // Sekundaarne tekst
        },
        // Navigatsiooni ja tausta värvid
        background: {
          DEFAULT: '#f8fafc',  // Lehe taust
          dark: '#f1f5f9',     // Tumedam taust
        },
        // Tekstivärvid
        content: {
          DEFAULT: '#1e293b',  // Põhitekst
          light: '#64748b',    // Sekundaarne tekst
        }
      },
      fontFamily: {
        sans: ['Arial', 'sans-serif'],  // Sama font mis logos
      },
      animation: {
        'slide-in': 'slide-in 0.2s ease-out',
        'slide-out': 'slide-out 0.2s ease-in',
        'fade-in': 'fade-in 0.2s ease-out',
        'fade-out': 'fade-out 0.2s ease-in',
        'scale-in': 'scale-in 0.2s ease-out',
        'scale-out': 'scale-out 0.2s ease-in',
        'spin-slow': 'spin 2s linear infinite',
      },
      keyframes: {
        'slide-in': {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' }
        },
        'slide-out': {
          '0%': { transform: 'translateX(0)', opacity: '1' },
          '100%': { transform: 'translateX(100%)', opacity: '0' }
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        'fade-out': {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' }
        },
        'scale-in': {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' }
        },
        'scale-out': {
          '0%': { transform: 'scale(1)', opacity: '1' },
          '100%': { transform: 'scale(0.95)', opacity: '0' }
        }
      },
      transitionProperty: {
        'max-height': 'max-height'
      },
      zIndex: {
        'toast': '100',
        'modal': '50',
        'dropdown': '40',
        'header': '30'
      }
    },
  },
  plugins: [],
}
