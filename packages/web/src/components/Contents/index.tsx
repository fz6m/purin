import { APIS } from '@/constants'
import { useFetch } from '@/hooks/useFetch'
import { IListItem } from '@/service/interface'
import { useUrl } from '@/hooks/useUrl'
import { Client } from './Client'
import { Suspense } from 'react'
import { getCurrentDateLabel } from '@/utils/dayjs'

interface IContentsProps {
  list?: string
  date?: string
}

export const Contents = async ({ list, date }: IContentsProps) => {
  const { fetch: listFetch } = useFetch<IListItem[]>(APIS.lists)
  const allList = (await listFetch()) || []

  const getFinalList = () => {
    if (list?.length && allList?.length) {
      const isExist = allList.some((item) => item.id === list)
      if (isExist) {
        return list
      }
    }
    return allList?.[0]?.id!
  }
  const getFinalDate = () => {
    if (date?.length) {
      return date
    }
    return getCurrentDateLabel()
  }

  const searchParams = new URLSearchParams()
  const finalList = getFinalList()
  searchParams.set('list', finalList)
  const finalDate = getFinalDate()
  searchParams.set('date', finalDate)
  const { fetch: tweetsFetch } = useFetch<string[]>(
    `${APIS.tweets}?${searchParams.toString()}`,
  )
  const allTweets = (await tweetsFetch()) || []

  const parsedUrl = useUrl()

  if (!parsedUrl?.fullUrl) {
    return null
  }

  return (
    <Suspense>
      <Client
        allList={allList}
        allTweets={allTweets}
        finalDate={finalDate}
        finalList={finalList}
        oldUrl={parsedUrl.fullUrl}
      />
    </Suspense>
  )
}
