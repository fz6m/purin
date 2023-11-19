import { Playpen_Sans, Work_Sans } from 'next/font/google'

export const playFont = Playpen_Sans({
  subsets: ['latin'],
  weight: ['700'],
  variable: '--font-play'
})

export const workFont = Work_Sans({
  subsets: ['latin'],
  variable: '--font-work'
})