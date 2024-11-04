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
    },
  },
  plugins: [],
}
