export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
     container: {
      center: true,
      padding: "1rem",
      screens: {
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
      },
    },
    extend: {
      screens: {
      xs: "475px", 
      sm: "640px", 
      md: "768px",
      lg: "1024px", 
      xl: "1280px",
      "2xl": "1536px",
    },
      colors: {
        /* Brand */
        primary: {
          50: "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          300: "#93c5fd",
          400: "#60a5fa",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8",
          800: "#1e40af",
          900: "#1e3a8a",
        },

        /* Backgrounds */
        background: {
          light: "#f9fafb",
          dark: "#0f172a", // slate-900
        },

        /* Surfaces (cards, panels) */
        surface: {
          light: "#ffffff",
          dark: "#020617", // slate-950
        },

        /* Text */
        text: {
          light: "#0f172a", // slate-900
          dark: "#e5e7eb",  // gray-200
          muted: "#64748b", // slate-500
        },

        /* Borders */
        border: {
          light: "#e5e7eb",
          dark: "#1e293b",
        },

        /* Accents */
        accent: {
          info: "#38bdf8",
          success: "#22c55e",
          warning: "#f59e0b",
          danger: "#ef4444",
        },
      },
      boxShadow: {
        soft: "0 8px 24px rgba(0,0,0,0.08)",
        softDark: "0 8px 24px rgba(0,0,0,0.4)",
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.25rem",
      },
    },
  },
  plugins: [],
};
