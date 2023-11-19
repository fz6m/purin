import type { Config } from 'tailwindcss'
const defaultTheme = require('tailwindcss/defaultTheme')

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {},
    screens: {
      s: { max: '640px' },
      m: { max: '768px' },
      l: { max: '1024px' },
    },
    fontFamily: {
      'work': ['var(--font-work)', 'var(--font-default)'],
      'play': ['var(--font-play)', 'var(--font-default)'],
      ...defaultTheme.fontFamily,
    }
  },
  plugins: [],
}
export default config
