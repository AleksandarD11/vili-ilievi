/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: ["class"],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1.25rem",
        lg: "2rem",
        xl: "3rem",
      },
      screens: {
        "2xl": "1280px",
      },
    },
    extend: {
      colors: {
        forest: {
          950: "#07110d",
          900: "#0b1712",
          800: "#12251d",
          700: "#1d3b2f",
          600: "#2b5a46",
          500: "#3d7b61",
        },
        stone: {
          50: "#f8f5ef",
          100: "#eee8dd",
          200: "#ddd2c0",
          300: "#c5b59c",
        },
        bronze: {
          300: "#d7b06e",
          400: "#b98b44",
          500: "#91672d",
        },
        accent: {
          DEFAULT: "#8ac7b5",
          soft: "#cce7dd",
        },
      },
      fontFamily: {
        display: ["var(--font-playfair)", "serif"],
        sans: ["var(--font-inter)", "sans-serif"],
      },
      backgroundImage: {
        "hero-grid":
          "radial-gradient(circle at top, rgba(138, 199, 181, 0.28), transparent 30%), linear-gradient(180deg, rgba(5, 13, 10, 0.2) 0%, rgba(5, 13, 10, 0.82) 60%, rgba(5, 13, 10, 1) 100%)",
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(215, 176, 110, 0.3), 0 20px 70px rgba(9, 25, 18, 0.45)",
        soft: "0 20px 40px rgba(4, 10, 8, 0.18)",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        shimmer: "shimmer 3.6s linear infinite",
      },
    },
  },
  plugins: [],
};
