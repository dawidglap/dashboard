/** @type {import('tailwindcss').Config} */
const tailwindConfig = {
  darkMode: "class", // ✅ Manual dark mode control
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        montserrat: ["Montserrat", "sans-serif"], // ✅ Font family
      },
      animation: {
        gradientMorph: "gradientMorph 10s ease-in-out infinite alternate", // ✅ Your existing morph
        gradientMove: "gradientMove 8s ease infinite", // ✅ Smooth horizontal gradient movement
      },
      keyframes: {
        gradientMorph: {
          "0%": { backgroundPosition: "0% 50%", filter: "rotate(0deg)" },
          "25%": { backgroundPosition: "50% 70%", filter: "rotate(30deg)" },
          "50%": { backgroundPosition: "100% 30%", filter: "rotate(60deg)" },
          "75%": { backgroundPosition: "50% 10%", filter: "rotate(90deg)" },
          "100%": { backgroundPosition: "0% 50%", filter: "rotate(120deg)" },
        },
        gradientMove: {
          "0%": { backgroundPosition: "0% 50%" }, // Smooth wave motion
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
      },
    },
  },
  daisyui: {
    themes: ["light"], // ✅ Only light mode
  },
  plugins: [require("daisyui")],
};

export default tailwindConfig;
