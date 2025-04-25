/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}", // App Router
    "./src/pages/**/*.{js,ts,jsx,tsx}", // Pages Router
    "./src/components/**/*.{js,ts,jsx,tsx}", // If you use shared components
  ],
  theme: {
    extend: {
      fontFamily: {
        heading: ["var(--font-cinzel)", "serif"],
        libre: ["var(--font-libre)", "serif"],
        body: ["var(--font-cormorant)", "serif"],
      },
    },
  },
  plugins: [],
};
