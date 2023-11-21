import type { Metadata, Viewport } from 'next'
import '@/styles/tailwind.css'
import '@/styles/globals.scss'
import { playFont, workFont } from '@/utils/fonts'
import cx from 'classnames'
import { SEO, getFinalDescription, getFinalTitle } from '@/components/SEO'
import { meta } from '@/constants/metadata'
import { JsonLD } from '@/components/SEO/JsonLD'
import { GlobalToaster } from '@/components/Toaster'

export const metadata: Metadata = {
  title: getFinalTitle(meta.title),
  description: getFinalDescription(meta.title, meta.description),
  icons: {
    apple: {
      url: '/apple-touch-icon-180x180.png',
      sizes: '180x180',
      type: 'image/png',
    },
    shortcut: {
      url: '/favicon.ico',
      sizes: '16x16',
      type: 'image/png',
    },
    other: [
      {
        rel: 'icon',
        url: '/android-icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        rel: 'icon',
        url: '/favicon-32x32.png',
        sizes: '32x32',
        type: 'image/png',
      },
      {
        rel: 'icon',
        url: '/favicon-96x96.png',
        sizes: '96x96',
        type: 'image/png',
      },
      {
        rel: 'icon',
        url: '/favicon-16x16.png',
        sizes: '16x16',
        type: 'image/png',
      },
    ],
  },
  authors: {
    name: meta.author,
  },
  keywords: meta.keywords,
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  minimumScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
}

// const author

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <SEO title={meta.title} />
      <JsonLD title={meta.title} />
      <body className={cx(playFont.variable, workFont.variable)}>
        {children}
        <GlobalToaster />
      </body>
    </html>
  )
}
