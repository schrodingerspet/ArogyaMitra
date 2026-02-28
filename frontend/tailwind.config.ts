import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: {
          base: "#071226",
          surface: "#0d1420",
        },
        text: {
          primary: "#E6EEF8",
          secondary: "#AAB7C3",
          muted: "#6B7785",
        },
        accent: {
          cyan: "#00D1FF",
          cyanDeep: "#00A9D6",
          violet: "#9B5CFF",
        },
        success: "#28C76F",
        warning: "#F6C84C",
        error: "#FF6B6B",
      },
      spacing: {
        1: "4px",
        2: "8px",
        3: "12px",
        4: "16px",
        6: "24px",
        8: "32px",
        12: "48px",
      },
      borderRadius: {
        sm: "8px",
        md: "12px",
        lg: "16px",
      },
      boxShadow: {
        subtle: "0 8px 24px rgba(4, 6, 12, 0.5)",
        hover: "0 14px 28px rgba(4, 6, 12, 0.62)",
        panel: "0 0 0 1px rgba(255, 255, 255, 0.02), 0 16px 40px rgba(4, 6, 12, 0.58)",
      },
      maxWidth: {
        content: "1280px",
      },
      transitionDuration: {
        fast: "150ms",
        base: "200ms",
        slow: "250ms",
      },
    },
  },
};

export default config;
