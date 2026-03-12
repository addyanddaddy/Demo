/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        surface: {
          950: '#0c0c10',
          900: '#131318',
          800: '#1f1f2a',
          700: '#2a2a38',
          600: '#353544',
          500: '#474756',
          400: '#5c5c6a',
          300: '#757582',
          200: '#9e9eab',
          100: '#cdc9bc',
        },
        // Backward-compatible alias
        navy: {
          950: '#0c0c10',
          900: '#131318',
          800: '#1f1f2a',
          700: '#2a2a38',
          600: '#353544',
          500: '#474756',
          400: '#5c5c6a',
          300: '#757582',
          200: '#9e9eab',
          100: '#cdc9bc',
        },
        marble: {
          DEFAULT: '#f0efe6',
          50: '#faf9f6',
          100: '#f5f4ef',
          200: '#f0efe6',
          300: '#dddace',
          400: '#cdc9bc',
          500: '#9e9eab',
        },
        bronze: {
          DEFAULT: '#9d7663',
          50: '#faf5f0',
          100: '#f0e4d8',
          200: '#dcc5ad',
          300: '#c4a47a',
          400: '#b08a6a',
          500: '#9d7663',
          600: '#7a5c48',
          700: '#5c4536',
          800: '#3d2e24',
          900: '#1f1712',
        },
        accent: {
          DEFAULT: '#9d7663',
          light: '#c4a47a',
          dark: '#7a5c48',
          glow: 'rgba(157, 118, 99, 0.18)',
        },
        teal: {
          DEFAULT: '#aadbdf',
          light: '#c5e8eb',
          dark: '#7ab8be',
        },
        brand: {
          gold: '#c4a47a',
          silver: '#cdc9bc',
        },
      },
      animation: {
        "fade-in": "fadeIn 0.6s ease-out",
        "slide-up": "slideUp 0.6s ease-out",
        "slide-down": "slideDown 0.6s ease-out",
        shimmer: "shimmer 2s infinite linear",
        float: "float 3s ease-in-out infinite",
        reveal: "reveal 0.6s ease-out",
      },
      keyframes: {
        fadeIn: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        slideUp: {
          from: { opacity: "0", transform: "translateY(12px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        slideDown: {
          from: { opacity: "0", transform: "translateY(-12px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        reveal: {
          from: { opacity: "0", transform: "scale(0.97)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
      },
    },
  },
  plugins: [],
};
