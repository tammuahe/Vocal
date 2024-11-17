/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", 
    "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors:{
        skyblue: '#A7C8F2',
        lightgrey:'#EAE8E8',
        darkerblue: '#99BFF2',
        darkblue: '#428DF0',
        lightred: '#FBA7A7',
        darkerred: '#F98686',
        darkred: '#F86565',
      }
    },
  },
  plugins: [],
}