import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        gauth: {
          red: "#FF3B30",
          crimson: "#E62E2D",
          coral: "#FF5A4E",
          dark: "#121316",
          ink: "#1D1E22",
          muted: "#6B7280",
          surface: "#F7F8FA",
          border: "#E5E7EB",
          gold: "#F59E0B",
        }
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      }
    },
  },
  plugins: [],
};
export default config;
