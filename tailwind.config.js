/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./features/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // Solo Leveling inspired dark theme
        primary: {
          DEFAULT: "#6C5CE7",
          light: "#A29BFE",
          dark: "#4834D4",
        },
        accent: {
          DEFAULT: "#00D2FF",
          light: "#74E5FF",
          dark: "#0097B2",
        },
        xp: {
          DEFAULT: "#FFD700",
          light: "#FFE44D",
          dark: "#B8960F",
        },
        surface: {
          DEFAULT: "#1A1A2E",
          light: "#25253E",
          dark: "#0F0F23",
        },
        danger: "#FF6B6B",
        success: "#51CF66",
        warning: "#FFC107",
      },
    },
  },
  plugins: [],
};
