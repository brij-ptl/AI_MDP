import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "rgb(var(--color-bg) / <alpha-value>)",
        surface: "rgb(var(--color-surface) / <alpha-value>)",
        surface2: "rgb(var(--color-surface-2) / <alpha-value>)",
        border: "rgb(var(--color-border) / <alpha-value>)",
        primary: {
          DEFAULT: "rgb(var(--color-primary) / <alpha-value>)",
          dark: "rgb(var(--color-primary-dark) / <alpha-value>)",
          light: "rgb(var(--color-primary-light) / <alpha-value>)",
        },
        secondary: "rgb(var(--color-secondary) / <alpha-value>)",
        accent: "rgb(var(--color-accent) / <alpha-value>)",
        muted: "rgb(var(--color-muted) / <alpha-value>)",
        text: "rgb(var(--color-text) / <alpha-value>)",
      },
      fontFamily: {
        sans: ["IBM Plex Sans", "Plus Jakarta Sans", "Inter", "system-ui", "sans-serif"],
        display: ["Fraunces", "Sora", "system-ui", "sans-serif"],
        mono: ["IBM Plex Mono", "monospace"],
      },
      boxShadow: {
        glow: "0 0 25px rgb(var(--color-primary) / 0.35)",
        card: "0 8px 30px rgb(0 0 0 / 0.12)",
      },
      backgroundImage: {
        "brand-gradient":
          "linear-gradient(135deg, rgb(var(--color-bg)) 0%, rgb(var(--color-primary-dark)) 100%)",
        "brand-radial":
          "radial-gradient(circle at top right, rgb(var(--color-primary) / 0.25), transparent 60%)",
      },
      keyframes: {
        float: {
          "0%,100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
        pulseGlow: {
          "0%,100%": { opacity: "0.6" },
          "50%": { opacity: "1" },
        },
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        pulseGlow: "pulseGlow 2.5s ease-in-out infinite",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
    },
  },
  plugins: [],
};
export default config;
