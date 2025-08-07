export default {
  theme: {
    extend: {
      fontFamily: {
        heading: ["Inter", "var(--font-inter)", "Geist", "sans-serif"],
        sans: ["Inter", "var(--font-inter)", "Geist", "sans-serif"],
      },
      colors: {
        electric: {
          blue: "#3A7CFF", // Electric Blue
        },
        hot: {
          pink: "#FF3AFD", // Hot Pink
        },
        neon: {
          green: "#39FF14", // Neon Green
        },
        background: {
          light: "#F8FAFC",
          dark: "#18181B",
        },
        // Add more expressive colors as needed
      },
      boxShadow: {
        genz: "0 4px 24px 0 rgba(58, 124, 255, 0.15), 0 1.5px 6px 0 rgba(255, 58, 253, 0.10)",
      },
      borderRadius: {
        xl: "1.25rem",
        "2xl": "2rem",
      },
      backgroundImage: {
        "genz-gradient": "linear-gradient(90deg, #3A7CFF 0%, #FF3AFD 100%)",
        "genz-radial":
          "radial-gradient(circle at 50% 50%, #3A7CFF 0%, #FF3AFD 100%)",
      },
      keyframes: {
        bounceIn: {
          "0%": { transform: "scale(0.8)", opacity: "0" },
          "60%": { transform: "scale(1.05)", opacity: "1" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        gradient: {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
      },
      animation: {
        "bounce-in": "bounceIn 0.7s cubic-bezier(0.4, 0, 0.2, 1) both",
        gradient: "gradient 3s ease infinite",
      },
    },
  },
  plugins: [],
};
