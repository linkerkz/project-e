/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter_400Regular"],
        "sans-semibold": ["Inter_600SemiBold"],
        display: ["SpaceGrotesk_700Bold"],
        "display-semibold": ["SpaceGrotesk_600SemiBold"],
        mono: ["JetBrainsMono_500Medium"],
      },
      colors: {
        ink: { DEFAULT: "#0E0F0B", soft: "#1A1B16" },
        cream: { DEFAULT: "#F1ECDE", deep: "#E6DFCB" },
        paper: "#FAF7EE",
        lime: { DEFAULT: "#CEFF3D", deep: "#B6E62B" },
        coral: "#FF5A36",
        muted: "#6D6960",
        line: "rgba(14,15,11,0.12)",
      },
    },
  },
  plugins: [],
};
