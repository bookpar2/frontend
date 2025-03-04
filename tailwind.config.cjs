export default {
  content: ["./index.html",
    "./src/**/*.{js, ts, tsx, jsx, html}"
  ],
  safelist: [
    "text-primary", "bg-primary",
    "text-secondary", "bg-secondary",
    "text-darker", "bg-darker",
    "text-error", "bg-error"
  ],
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