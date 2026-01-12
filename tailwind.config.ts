import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'deep-blue': '#003D5C',
        'warm-teal': '#006B7D',
        'warm-orange': '#F39C12',
        'soft-blue': '#E8F4F8',
        'dark-blue-grey': '#2C3E50',
        'success-green': '#27AE60',
      },
    },
  },
  plugins: [],
}
export default config
