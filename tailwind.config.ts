import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'deep-blue': '#003D5C',
        'warm-teal': '#006B7D',
        'soft-blue': '#E8F4F8',
        'warm-orange': '#F39C12',
        'success-green': '#27AE60',
        'light-gray': '#F8F9FA',
        'border-gray': '#E5E7EB',
      },
    },
  },
  plugins: [],
};
export default config;
