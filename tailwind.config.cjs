/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  safelist: ["text-primary", "bg-primary", "text-secondary", "bg-secondary"],
  theme: {
    extend: {
      colors: {
        primary: "#617EF1",
        darker: "#4B63C1",
        secondary: "#EDF3FF",
        error: "#ED7E7F",
      },
    },
  },
  plugins: [],
};