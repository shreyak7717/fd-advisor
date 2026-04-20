/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Playfair Display'", "serif"],
        body: ["'DM Sans'", "sans-serif"],
        mono: ["'DM Mono'", "monospace"]
      },
      colors: {
        saffron: {
          50: "#fff8ed",
          100: "#ffefd4",
          400: "#fb923c",
          500: "#f97316",
          600: "#ea580c"
        },
        turmeric: {
          400: "#fbbf24",
          500: "#f59e0b"
        },
        ink: {
          900: "#0f0a00",
          800: "#1c1408",
          700: "#2d2010",
          600: "#4a3520",
          400: "#8a6a3d",
          200: "#d4b896",
          100: "#ede0ce",
          50: "#faf6f0"
        }
      },
      animation: {
        "slide-up": "slideUp 0.4s ease-out",
        "fade-in": "fadeIn 0.3s ease-out",
        "pulse-dot": "pulseDot 1.4s ease-in-out infinite"
      },
      keyframes: {
        slideUp: {
          "0%": { transform: "translateY(12px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" }
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" }
        },
        pulseDot: {
          "0%, 80%, 100%": { transform: "scale(0.6)", opacity: "0.4" },
          "40%": { transform: "scale(1)", opacity: "1" }
        }
      }
    }
  },
  plugins: []
};
