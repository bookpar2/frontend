/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#617EF1",
        darker: "#4B63C1",
        secondary: "#EDF3FF",
        error: "#ED7E7F"
      },
    },
  },
  plugins: [],
};
