import 'server-only'
import { meta } from '@/constants/metadata'
import { useUrl } from '@/hooks/useUrl'

export const getFinalTitle = (title: string, siteName?: string) => {
  return siteName ? `${title} - ${siteName}` : title
}
export const getFinalDescription = (title: string, description?: string) => {
  return [title, description].filter(Boolean).join(' - ')
}

export const SEO = ({
  title,
  siteName,
  nofollow = false,
  noindex = false,
  ogType = 'website',
  ogImage = {
    url: meta.og_image,
    width: 1200,
    height: 630,
  },
  twitterCardType = 'summary_large_image',
}: {
  title: string
  siteName?: string
  noindex?: boolean
  nofollow?: boolean
  ogType?: string
  ogImage?: {
    url: string
    width?: number
    height?: number
  }
  twitterCardType?: 'summary_large_image' | 'summary'
}) => {
  const finalTitle = getFinalTitle(title, siteName)
  const finalDescription = getFinalDescription(title, meta.description)

  const robotDirectives = [
    noindex ? 'noindex' : 'index',
    nofollow ? 'nofollow' : 'follow',
  ].join(',')

  const permalink = useUrl()?.fullUrlWithoutSearch

  return (
    <head>
      <meta httpEquiv="X-UA-Compatible" content="IE=edge,chrome=1" />
      <meta httpEquiv="x-dns-prefetch-control" content="on" />
      {/* not need dns-prefetch */}
      {/* not need preconnect */}

      <meta key="meta-title" name="title" content={finalTitle} />
      <meta key="author" name="author" content={meta.author} />
      {/* <meta key="description" name="description" content={finalDescription} /> */}
      {/* <meta key="keyword" name="keyword" content={DATA.meta.keyword} /> */}
      {!!permalink && <link key="canonical" rel="canonical" href={permalink} />}
      <meta key="robots" name="robots" content={robotDirectives} />

      <link key="canonical" rel="canonical" href={permalink} />
      <meta key="robots" name="robots" content={robotDirectives} />

      <meta key="og:type" property="og:type" content={ogType} />
      <meta key="og:url" property="og:url" content={permalink} />
      <meta key="og:title" property="og:title" content={finalTitle} />
      {!!siteName?.length && (
        <meta key="og:site_name" property="og:site_name" content={siteName} />
      )}
      <meta
        key="og:description"
        property="og:description"
        content={finalDescription}
      />
      <meta key="og:locale" property="og:locale" content="en" />
      {!!ogImage?.url && (
        <meta key="og:image" property="og:image" content={ogImage.url} />
      )}
      {!!ogImage?.width && (
        <meta
          key="og:image:width"
          property="og:image:width"
          content={ogImage.width.toString()}
        />
      )}
      {!!ogImage?.height && (
        <meta
          key="og:image:height"
          property="og:image:height"
          content={ogImage.height.toString()}
        />
      )}

      {/* Twitter */}
      {!!ogImage?.url && (
        <meta key="twitter:image" name="twitter:image" content={ogImage.url} />
      )}
      <meta key="twitter:card" name="twitter:card" content={twitterCardType} />

      {/* --- Mobile --- */}
      {/* disable iphone numebr auto link */}
      <meta name="format-detection" content="telephone=no" />
    </head>
  )
}
