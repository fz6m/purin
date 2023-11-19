import 'server-only'
import { headers } from 'next/headers'
import { trim } from 'lodash'

const parseUrl = (url?: string) => {
  if (!url?.length) {
    return
  }
  try {
    const urlIns = new URL(url)
    const host = urlIns?.host
    if (host?.length) {
      const cleanHost = trim(host, '/') as string
      const protocol = urlIns?.protocol || 'https:'
      const pathname = urlIns?.pathname || ''
      const search = urlIns?.search || ''
      const siteUrl = `${protocol}//${cleanHost}`
      const fullUrlWithoutSearch = `${siteUrl}${pathname}`
      const fullUrl = `${fullUrlWithoutSearch}${search}`
      const routePushUrl = `${pathname}${search}`
      return {
        host: cleanHost,
        protocol,
        pathname,
        search,
        siteUrl,
        fullUrl,
        fullUrlWithoutSearch,
        routePushUrl,
      }
    }
  } catch {
    return
  }
}

// 😅
export const useUrl = () => {
  const headersList = headers()
  const reqUrl = headersList.get('x-url') || ''
  const parsed = parseUrl(reqUrl)
  return parsed
}
