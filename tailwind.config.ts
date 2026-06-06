import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // === New redesign palette (Claude Design handoff) ===
        // Warm neutrals
        ink: "#20251F",
        "ink-2": "#2B3327", // dark surface
        paper: "#F3EFE6",
        mist: "#EFE9DF",
        card: "#FBF8F2",
        line: "#DDD6C8",
        "line-dk": "#3A4234",
        // Brand — green (SWM)
        green: {
          DEFAULT: "#3C7A4A",
          700: "#2F6B3D",
          300: "#8FBF9C",
        },
        // Brand — terracotta (C&D)
        terra: {
          DEFAULT: "#C56A45",
          700: "#AD5736",
          300: "#E0A183",
        },
        // Muted text
        "tx-soft": "#5F6356",
        "tx-faint": "#8F9183",
        "tx-dim": "#B4BBAA",
        "tx-on-dark": "#F1EFE6",
        // Status
        "st-ongoing": "#3C7A4A",
        "st-done": "#4A6E8A",

        // === Legacy tokens (kept so /projects page and old components don't break) ===
        "brand-green": "#5BAE3C",
        "deep-green": "#1F3D2A",
        charcoal: "#1A1F1A",
        offwhite: "#F8F8F4",
        steel: "#6B7280",
        highlight: "#F59E0B",
        "status-completed": "#3B82F6",
      },
      fontFamily: {
        sans: ["var(--font-archivo)", "Archivo", "system-ui", "sans-serif"],
        mono: ["var(--font-space-mono)", "Space Mono", "ui-monospace", "monospace"],
      },
      animation: {
        "ping-slow": "ping 2.5s cubic-bezier(0, 0, 0.2, 1) infinite",
        "ping-map": "ping-map 2.4s cubic-bezier(0,0,.2,1) infinite",
      },
      keyframes: {
        "ping-map": {
          "0%": { transform: "scale(.6)", opacity: ".8" },
          "80%,100%": { transform: "scale(1.5)", opacity: "0" },
        },
      },
      maxWidth: {
        container: "1200px",
      },
    },
  },
  plugins: [],
};
export default config;
