import type { Config } from "tailwindcss";

// Tailwind v4 primarily reads design tokens from the `@theme` block in
// globals.css (see app/globals.css). This config file is kept alongside it
// so the palette is also discoverable/importable from plain TS/JS (e.g.
// chart color arrays, email-template inline styles) and documents the
// exact DripMail design system in one place.
const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "dm-primary": "#1976F3", // Primary Blue
        "dm-header": "#90CAF9", // Light Blue / Header
        "dm-tint-light": "#EAF4FF", // Very Light Blue
        "dm-bg": "#F3F8FF", // Blue Background Tint
        "dm-navy": "#0B1F4B", // Dark Navy / Headings
        "dm-body": "#344B73", // Body Text
        "dm-border": "#D6E4F5", // Border / Stroke
        "dm-success": "#18B77A", // Success Green
        "dm-error": "#FF3B3B", // Error Red
        "dm-muted": "#718096", // Muted Gray
      },
      fontFamily: {
        sans: ["var(--font-inter)", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      borderRadius: {
        card: "16px",
        field: "10px",
      },
      boxShadow: {
        card: "0 1px 2px rgba(11, 31, 75, 0.04), 0 4px 16px rgba(11, 31, 75, 0.06)",
      },
    },
  },
};

export default config;
