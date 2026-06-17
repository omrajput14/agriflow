/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#1F5E3B",   // Forest Green
        secondary: "#7A5C3E", // Earth Brown
        accent: "#1E5EFF",    // Export Blue
        card: "#FFFFFF",
        base: "#F8FAFC",
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
