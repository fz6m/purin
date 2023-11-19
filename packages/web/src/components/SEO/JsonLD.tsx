import 'server-only'
import { useUrl } from '@/hooks/useUrl'
import { safeJsonLdReplacer } from './safeJsonLdReplacer'
import { meta } from '@/constants/metadata'

interface IJsonLDProps
  extends Omit<
    JSX.IntrinsicElements['script'],
    'type' | 'dangerouslySetInnerHTML' | 'children' | 'title'
  > {
  isContent?: boolean
  title: string
  siteName?: string
  ogImage?: string
}

export const JsonLD = ({
  title,
  siteName,
  isContent,
  ogImage = meta.og_image,
  ...rest
}: IJsonLDProps) => {
  const parsedUrl = useUrl()
  const permalink = parsedUrl?.fullUrlWithoutSearch

  const sharedJsonLd = {
    '@context': 'http://schema.org',
    logo: `${parsedUrl?.siteUrl}/android-icon-192x192.png`,
  }

  const jsonMain = {
    ...sharedJsonLd,
    keywords: meta.keywords,
    description: meta.description,
    '@type': 'WebSite',
    url: parsedUrl?.siteUrl,
  }

  const finalTitle = title ? `${title} - ${siteName}` : siteName

  const getData = () => {
    if (!isContent) return jsonMain

    const jsonArticle = {
      '@context': 'https://schema.org',
      '@type': 'Article',
      url: permalink,
      headline: finalTitle,
      image: ogImage ? [ogImage] : [],
      author: {
        '@type': 'Person',
        name: meta.author,
      },
      // datePublished: '2015-02-05T08:00:00+08:00',
      // dateModified: '2015-02-05T09:20:00+08:00',
    }

    return [jsonMain, jsonArticle]
  }
  const data = getData()

  return (
    <script
      type="application/ld+json"
      {...rest}
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(
          Array.isArray(data) && data.length === 1 ? data[0] : data,
          safeJsonLdReplacer,
        ),
      }}
    />
  )
}
