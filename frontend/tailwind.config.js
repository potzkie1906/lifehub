/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          900: "#1C2430",
          700: "#2A3444",
        },
        paper: "#F7F5EF",
        accent: "#C08A3E",
        danger: "#B5533C",
      },
    fontFamily: {
      serif: ["Fraunces", "Georgia", "serif"],
      },
    },
  },
  plugins: [],
}

