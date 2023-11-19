import 'server-only'
import { useUrl } from '@/hooks/useUrl'

export const useFetch = <T = any>(path: string) => {
  const parsed = useUrl()
  const fullUrl = `${parsed?.protocol}//${parsed?.host}${path}`

  return {
    fetch: async (params?: Partial<RequestInit>) => {
      if (!parsed?.host?.length || !parsed?.protocol?.length) {
        console.warn('host or protocol is empty', parsed)
        return
      }
      try {
        const data = await fetch(fullUrl, { next: { revalidate: 3600 }, ...params })
        if (data?.ok) {
          const json = await data?.json()
          if (json?.code === 0) {
            return json?.data as T
          }
        } else {
          console.error('fetch call error')
        }
      } catch {
        console.error('fetch catch error')
        return
      }
    },
  }
}
