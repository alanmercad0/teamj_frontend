/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        main_bg: '#757575',
        header_bg: "#2E2E30",
        primary: "#007AFF",
        accent: '#ff6100',
        signin_bg: '#CECECE',
        app: {
          signin: '#CECECE',
          black: '#2E2E30'
        }
      },
      keyframes: {
        wiggle: {
          '0%, 100%': { transform: 'rotate(-10deg)' },
          '50%': { transform: 'rotate(10deg)' },
        },
        grow: {
          '0%': { transform: 'scale(1)'},
          '25%': { transform: 'scale(1.3) rotate(10deg)'},
          '50%': { transform: 'scale(1.3) rotate(-10deg)'},
          '75%': { transform: 'scale(1.3) rotate(0deg)'},
          '85%': { transform: 'scale(1.2)'},
          '95%': { transform: 'scale(1.1)'},
          '100%': { transform: 'scale(1)'},
        }
      },
      animation: {
        wiggle: 'wiggle 1s ease-in-out infinite',
        grow: 'grow 1s ease-in-out'
      }
    },
  },
  plugins: [],
};
