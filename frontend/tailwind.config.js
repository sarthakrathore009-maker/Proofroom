/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{html,js,ts,jsx,tsx}"],
  corePlugins: {
    preflight: true,
  },
  theme: {
    extend: {},
  },
  plugins: [],
};