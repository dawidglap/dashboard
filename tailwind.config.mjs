/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class", // ✅ Forces manual control over dark mode
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        montserrat: ["Montserrat", "sans-serif"], // ✅ Use directly or define in CSS
      },
      animation: {
        gradientMorph: "gradientMorph 10s ease-in-out infinite alternate",
      },
      keyframes: {
        gradientMorph: {
          "0%": { backgroundPosition: "0% 50%", filter: "rotate(0deg)" },
          "25%": { backgroundPosition: "50% 70%", filter: "rotate(30deg)" },
          "50%": {
            backgroundPosition: "100% 30%",
            filter: "rotate(60deg)",
          },
          "75%": { backgroundPosition: "50% 10%", filter: "rotate(90deg)" },
          "100%": {
            backgroundPosition: "0% 50%",
            filter: "rotate(120deg)",
          },
        },
      },
    },
  },
  daisyui: {
    themes: ["light"], // ✅ Only enable light mode
  },
  plugins: [require("daisyui")],
};
