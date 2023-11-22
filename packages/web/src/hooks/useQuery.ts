'use client'

import { isNil } from 'lodash'
import { useRouter } from 'next/navigation'

export const useQuery = (oldUrl: string) => {
  const router = useRouter()
  const changeQuery = (map: Record<string, string | null | undefined>) => {
    const urlParsed = new URL(oldUrl)
    const searchParams = new URLSearchParams(urlParsed.search)
    Object.entries(map).forEach(([key, value]) => {
      if (isNil(value)) {
        searchParams.delete(key)
        return
      }
      searchParams.set(key, value)
    })
    const newSearch = searchParams.toString()
    const pushPath = `${urlParsed.pathname}?${newSearch}`
    // https://github.com/vercel/next.js/issues/28778#issuecomment-1686854968
    router.push(pushPath, { scroll: false })
  }

  return {
    changeQuery,
  }
}
