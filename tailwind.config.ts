import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/sections/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    screens: {
      sm: "375px",
      md: "768px",
      lg: "1200px",
    },
    container: {
      center: true,
      padding: {
        DEFAULT: "1rem",
        md: "2rem",
      },
    },
    extend: {
      colors: {
        foreground: "hsl(var(--foreground))",
      },
      fontFamily: {
        sans: ["var(--font-sans)"],
        serif: ["var(--font-serif)"],
        league: ["'League Spartan'", "sans-serif"],
      },
      animation: {
        // 'ping-large': "ping-large 1s ease-in-out infinite",
        'slide-in-left': "slide-in-left 1s ease-out forwards",
        'slide-in-right': "slide-in-right 1s ease-out forwards",
        "flip-words": "flip-words 8s infinite",
        "tilt": "tilt 10s infinite linear",
      },
      keyframes: {
        // 'ping-large': {
        //   '75%, 100%': {
        //     transform: 'scale(3)',
        //     opacity: '0',
        //   },
        // },
        'slide-in-left': {
          '0%': {
            transform: 'translateX(-100%)',
            opacity: '0',
          },
          '100%': {
            transform: 'translateX(0%)',
            opacity: '1',
          },
        },
        'slide-in-right': {
          '0%': {
            transform: 'translateX(100%)',
            opacity: '0',
          },
          '100%': {
            transform: 'translateX(0%)',
            opacity: '1',
          },
        },
        "flip-words": {
          "6%" : { transform: "translateY(-112%)" },
          "14%" : { transform: "translateY(-100%)" },
          "20%" : { transform: "translateY(-122%)" },
          "28%" : { transform: "translateY(-200%)" },
          "34%" : { transform: "translateY(-312%)" },
          "42%" : { transform: "translateY(-300%)" },
          "48%" : { transform: "translateY(-412%)" },
          "56%" : { transform: "translateY(-400%)" },
          "63%" : { transform: "translateY(-512%)" },
          "71%" : { transform: "translateY(-500%)" },
          "77%" : { transform: "translateY(-612%)" },
          "85%" : { transform: "translateY(-600%)" },
          "92%" : { transform: "translateY(-712%)" },
          "100%" : { transform: "translateY(-700%)" },
        },
        "tilt": {
          "0%, 50%, 100%": {
            transform: "rotate(0deg)",
          },
          "25%": {
            transform: "rotate(0.5deg)",
          },
          "75%": {
            transform: "rotate(-0.5deg)",
          },
        },
      },
      spacing: {
        '90': '22.5rem', // 360px equivalent
        '100': '25rem',  // 400px equivalent
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
export default config;