/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}", // Note the addition of the `app` directory.
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#FDF2F4",
          100: "#F7D9E0",
          200: "#F0B5C3",
          300: "#E38FA6",
          400: "#D66A89",
          500: "#8B1E3F", // 기본 버건디
          600: "#701832",
          700: "#551226",
          800: "#3A0C19",
          900: "#1E060D",
        },
        accent: {
          50: "#FBF7E8",
          100: "#F7EFD1",
          200: "#ECD594",
          300: "#D4AF37", // 기본 골드
          400: "#BD9C31",
          500: "#A6892B",
          600: "#8F7625",
          700: "#78631F",
          800: "#615019",
          900: "#4A3D13",
        },
      },
      animation: {
        scroll: "scroll 40s linear infinite",
        "fade-in-up": "fadeInUp 0.8s ease-out forwards",
        pulse: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        bounce: "bounce 3s ease-in-out infinite",
      },
      keyframes: {
        scroll: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        fadeInUp: {
          "0%": {
            opacity: "0",
            transform: "translateY(30px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
      },
      animationDelay: {
        200: "200ms",
        300: "300ms",
        400: "400ms",
        500: "500ms",
        600: "600ms",
        700: "700ms",
        1000: "1000ms",
        2000: "2000ms",
      },
    },
  },
  plugins: [
    require("tailwind-scrollbar-hide"),
    function ({ addUtilities }) {
      const newUtilities = {
        ".mask-linear-gradient": {
          "mask-image":
            "linear-gradient(to bottom, black 60%, transparent 100%)",
          "-webkit-mask-image":
            "linear-gradient(to bottom, black 60%, transparent 100%)",
        },
        ".animation-delay-200": {
          "animation-delay": "200ms",
        },
        ".animation-delay-300": {
          "animation-delay": "300ms",
        },
        ".animation-delay-400": {
          "animation-delay": "400ms",
        },
        ".animation-delay-500": {
          "animation-delay": "500ms",
        },
        ".animation-delay-600": {
          "animation-delay": "600ms",
        },
        ".animation-delay-700": {
          "animation-delay": "700ms",
        },
        ".animation-delay-1000": {
          "animation-delay": "1000ms",
        },
        ".animation-delay-2000": {
          "animation-delay": "2000ms",
        },
      };
      addUtilities(newUtilities);
    },
  ],
};
