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
    },
  },
  daisyui: {
    themes: ["light"], // ✅ Only enable light mode
  },
  plugins: [require("daisyui")],
};
