/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],

  theme: {
    extend: {
      // 프로젝트 디자인 시스템 컬러 팔레트
      colors: {
        primary: "#9BC6FB",
        secondary: "#EEF5FD",
        point: "#7C9EC9",
        alert: "#ED7E7F",

        // 그레이 스케일 (디자인 시안 기준)
        gray: {
          900: "#000000",
          800: "#6D6D6D",
          700: "#9C9C9C",
          600: "#D9D9D9",
          500: "#EAEAEA",
          400: "#EFEFEF",
        },

        // 화면/오버레이 용도 컬러
        screen: {
          default: "#FFFFFF",
          // 모달 딤(overlay): black 30%
          modal: "rgba(0, 0, 0, 0.3)",
        },
      },
    },
  },

  // 플러그인 확장 포인트
  plugins: [],
};
