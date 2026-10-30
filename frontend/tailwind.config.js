/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      // LifeHub's colors come from a student's pencil case:
      //   ballpen blue  -> buttons, links, anything you can click
      //   highlighter   -> marks the page you're on
      //   margin red    -> the red line on pad paper: overdue, over budget, delete
      // Change a value here and it changes everywhere in the app.
      colors: {
        ink: "#141B2D", // sidebar background and main text
        canvas: "#F3F5F9", // page background
        line: "#E3E7EF", // borders and dividers
        brand: {
          DEFAULT: "#2D54D8", // ballpen blue  (class: bg-brand, text-brand)
          dark: "#2344B5", // button hover    (class: bg-brand-dark)
          soft: "#EBF0FE", // light blue tint (class: bg-brand-soft)
        },
        highlight: "#FFE45C", // highlighter yellow
        danger: "#D6383E", // pad-paper margin red
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', "ui-sans-serif", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 2px 0 rgb(20 27 45 / 0.05)",
      },
    },
  },
  plugins: [],
};
