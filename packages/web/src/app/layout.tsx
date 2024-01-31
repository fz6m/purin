// global styles
import '@/styles/tailwind.css'
import '@/styles/globals.scss'
import 'nprogress/nprogress.css'

import type { Metadata, Viewport } from 'next'
import { playFont, workFont } from '@/utils/fonts'
import cx from 'classnames'
import { SEO, getFinalDescription, getFinalTitle } from '@/components/SEO'
import { meta } from '@/constants/metadata'
import { JsonLD } from '@/components/SEO/JsonLD'
import { GlobalToaster } from '@/components/Toaster'

const finalTitle = getFinalTitle(meta.title)
const finalDescription = getFinalDescription(meta.title, meta.description)

export const metadata: Metadata = {
  title: finalTitle,
  description: finalDescription,
  metadataBase: process.env.VERCEL_URL ? new URL(`https://${process.env.VERCEL_URL}`) : new URL(`http://localhost:3000`),
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
  openGraph: {
    title: finalTitle,
    type: 'website',
    description: finalDescription,
    locale: 'en',
    images: {
      width: 1200,
      height: 630,
      url: meta.og_image,
    },
  },
  twitter: {
    card: 'summary_large_image',
    images: {
      width: 1200,
      height: 630,
      url: meta.og_image,
    }
  }
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
