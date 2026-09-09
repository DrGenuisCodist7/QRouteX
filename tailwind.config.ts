import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "#050d18",
        surface: {
          50: "#071424",
          100: "#0b1d31",
          200: "#102942",
          300: "#163859",
          400: "#1d476f",
        },
        border: {
          subtle: "#16344e",
          DEFAULT: "#1d4264",
          highlight: "#2d6494",
        },
        primary: {
          DEFAULT: "#27d9ff",
          hover: "#1fc4e8",
          glow: "rgba(39, 217, 255, 0.25)",
        },
        quantum: {
          cyan: "#27d9ff",
          blue: "#3b82f6",
          purple: "#a970ff",
          violet: "#7c3aed",
          emerald: "#37d67a",
          amber: "#ffd166",
          rose: "#ff5d6c",
        },
        text: {
          primary: "#f0f7ff",
          secondary: "#98b2c8",
          muted: "#66849c",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "Segoe UI", "sans-serif"],
        mono: ["var(--font-mono)", "JetBrains Mono", "monospace"],
      },
      boxShadow: {
        glow: "0 0 25px rgba(39, 217, 255, 0.2)",
        "glow-lg": "0 0 40px rgba(39, 217, 255, 0.35)",
        "glow-purple": "0 0 30px rgba(169, 112, 255, 0.25)",
        "glow-emerald": "0 0 25px rgba(55, 214, 122, 0.25)",
        glass: "0 12px 36px 0 rgba(0, 0, 0, 0.45)",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "quantum-gradient": "linear-gradient(135deg, #27d9ff 0%, #3b82f6 50%, #a970ff 100%)",
        "quantum-card": "linear-gradient(145deg, rgba(16, 41, 66, 0.85), rgba(7, 20, 36, 0.9))",
        "panel-gradient": "linear-gradient(180deg, rgba(11, 29, 49, 0.95), rgba(6, 17, 30, 0.95))",
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "spin-slow": "spin 20s linear infinite",
        "float": "float 4s ease-in-out infinite",
        "quantum-pulse": "quantumPulse 2s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        quantumPulse: {
          "0%, 100%": { opacity: "0.4", transform: "scale(1)" },
          "50%": { opacity: "0.9", transform: "scale(1.06)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
