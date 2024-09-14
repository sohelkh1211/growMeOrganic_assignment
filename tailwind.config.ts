/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{ts,tsx}"],
  mode: "jit",
  theme: {
    extend: {
      screens: {
        xs: "0px",
        sm: "640px",
        md: "768px",
        lg: "1024px"
      },
    },
  },
  plugins: [],
}