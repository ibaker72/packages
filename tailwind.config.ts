import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    container: {
      center: true,
      padding: { DEFAULT: "1rem", lg: "2rem" },
      screens: { "2xl": "1280px" },
    },
    extend: {
      colors: {
        ink: {
          50: "#F7F7F6",
          100: "#EDEDEB",
          200: "#D9D9D5",
          300: "#B8B8B1",
          400: "#86857D",
          500: "#5C5B53",
          600: "#3F3E37",
          700: "#272620",
          800: "#17160F",
          900: "#0A0A07",
        },
        amber: {
          50: "#FEF7EC",
          100: "#FDECCD",
          200: "#FAD899",
          300: "#F6BD5F",
          400: "#F09F30",
          500: "#D9821A",
          600: "#B45309",
          700: "#8A3F08",
          800: "#6B3208",
          900: "#4B2306",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 1px 2px rgba(15,15,10,0.04), 0 8px 24px rgba(15,15,10,0.06)",
        ring: "0 0 0 1px rgba(15,15,10,0.06)",
      },
      borderRadius: { xl: "0.9rem", "2xl": "1.25rem" },
      backgroundImage: {
        "grain":
          "radial-gradient(rgba(255,255,255,0.04) 1px, transparent 1px)",
      },
    },
  },
  plugins: [],
};

export default config;
