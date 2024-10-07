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
        signin_bg: '#CECECE'
      },
    },
  },
  plugins: [],
};
