import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "var(--primary)",
          hover: "var(--primary-hover)",
        },
        background: "var(--background)",
        surface: "var(--surface)",
        foreground: "var(--foreground)",
        textSecondary: "var(--text-secondary)",
        border: "var(--border)",
        success: "var(--success)",
        warning: "var(--warning)",
        error: "var(--error)",
        carrot: "var(--accent-carrot)",
        bow: "var(--accent-bow)",
        stamp: "var(--accent-stamp)",
      },
      fontFamily: {
        serif: ["var(--font-merriweather)", "Georgia", "serif"],
      },
      borderRadius: {
        xl: "14px",
        "2xl": "16px",
        "3xl": "20px",
        "4xl": "24px",
      },
      boxShadow: {
        warm: "0 4px 20px -2px rgba(198, 139, 89, 0.15)",
        "warm-lg": "0 8px 30px -4px rgba(198, 139, 89, 0.2)",
      },
    },
  },
  plugins: [],
};

export default config;
