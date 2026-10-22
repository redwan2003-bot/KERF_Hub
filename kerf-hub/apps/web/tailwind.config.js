/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "../../packages/ui/src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        zinc: {
          750: '#202023',
          850: '#1c1c1f',
          950: '#0c0c0e',
        }
      }
    },
  },
  plugins: [],
}
