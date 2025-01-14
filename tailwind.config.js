/** @type {import('tailwindcss').Config} */
import { nextui } from "@nextui-org/react";
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: "#1C1C1E",
        card: "rgba(40, 41, 43, 0.9)",
        "card-hover": "rgba(40, 41, 43, 0.95)",
        gold: {
          DEFAULT: "#FFD700",
          light: "#FFE55C",
          dark: "#B8860B",
          muted: "rgba(255, 215, 0, 0.1)",
        },
        secondary: "#7C7C80",
      },
      transitionProperty: {
        transform: "transform",
      },
      backdropBlur: {
        xs: "2px",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-4px)" },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slide: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(calc(-100% - var(--gap)))" },
        },
        "slide-reverse": {
          from: { transform: "translateX(calc(-100% - var(--gap)))" },
          to: { transform: "translateX(0)" },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' }
        },
      },
      boxShadow: {
        card: "0 4px 6px -1px rgba(0, 0, 0, 0.2), 0 2px 4px -1px rgba(0, 0, 0, 0.1)",
      },
      animation: {
        float: "float 2s ease-in-out infinite",
        fadeIn: 'fadeIn 0.3s ease-out',
        'marquee': 'marquee 25s linear infinite',
      },
      translate: {
        "z-4": "translateZ(4px)",
      },
      gridTemplateColumns: {
        '16': 'repeat(16, minmax(0, 1fr))',
      },
    },
  },
  darkMode: "class",
  plugins: [
    nextui({
      defaultExtendTheme: "dark",
      defaultRadius: "sm",
      themes: {
        dark: {
          layout: {
            radius: {
              small: "0.225rem", // 4px
              medium: "0.375rem", // 6px
              large: "0.5rem", // 8px
            }
          }
        }
      }
    }),
  ],
};
