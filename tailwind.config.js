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
      },
      keyframes: {
        scroll: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
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
      };
      addUtilities(newUtilities);
    },
  ],
};
