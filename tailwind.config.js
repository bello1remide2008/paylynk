/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
      extend: {
      
      keyframes: {
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
         fadeIn: "fadeIn 1s ease-in-out forwards",
        fadeInSlow: "fadeIn 1.5s ease-in-out forwards",
      },
  
      
      },
  },
  plugins: [],
};


