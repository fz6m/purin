'use client'

import { DAY_LIMIT } from '@/constants'
import { Tabs } from '../Tabs'
import { DateSwitch, IOption } from './DateSwitch'
import { ListSelect } from './ListSelect'
import { IListItem } from '@/service/interface'
import { getCurrentDayStartIns } from '@/utils/dayjs'
// import { TopLoadingBar } from '../TopLoadingBar'
import { Provider } from 'jotai'

interface IClientProps {
  allList: IListItem[]
  allTweets: string[]
  finalList: string
  finalDate: string
  oldUrl: string
}

export const Client = ({
  allList,
  allTweets,
  finalList,
  finalDate,
  oldUrl,
}: IClientProps) => {
  const getDateOptions = () => {
    const current = getCurrentDayStartIns()
    const options: IOption[] = []
    for (let i = 0; i < DAY_LIMIT; i++) {
      const date = current.subtract(i, 'day')
      const label = date.format('MM-DD')
      const value = date.format('YYYY-MM-DD')
      options.push({
        label,
        value,
      })
    }
    return options
  }
  const dateOptions = getDateOptions()

  return (
    <Provider>
      <ListSelect list={allList} active={finalList} oldUrl={oldUrl} />
      <DateSwitch oldUrl={oldUrl} active={finalDate} options={dateOptions} />
      <Tabs tweetIds={allTweets} />
    </Provider>
  )
}
