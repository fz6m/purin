import { Playpen_Sans, Work_Sans } from 'next/font/google'

export const playFont = Playpen_Sans({
  subsets: ['latin'],
  weight: ['700'],
  variable: '--font-play'
  // https://github.com/vercel/next.js/issues/47115#issuecomment-1807197912
  // display: 'swap',
  // adjustFontFallback: false
})

export const workFont = Work_Sans({
  subsets: ['latin'],
  variable: '--font-work'
})