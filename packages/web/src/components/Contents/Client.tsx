'use client'

import { DAY_LIMIT } from '@/constants'
import { Tabs } from '../Tabs'
import { DateSwitch, IOption } from './DateSwitch'
import { ListSelect } from './ListSelect'
import { IListItem } from '@/service/interface'
import { getCurrentDayStartIns } from '@/utils/dayjs'
import { IAdvancedConfigs } from './interface'
import { useLocalStorageState } from 'ahooks'
import { cloneDeep } from 'lodash'
import { AdvancedConfigs } from './AdvancedConfigs'
import { CardioLoading } from './CardioLoading'

interface IClientProps {
  allList: IListItem[]
  allTweets: string[]
  finalList: string
  finalDate: string
  oldUrl: string
}

const ADAVANCED_CONFIGS_KEY = `purin_advanced_configs_v1`
const defaultAdvancedConfigs: IAdvancedConfigs = {
  hideRead: false,
  hideError: false,
  useOwnApi: false
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

  const [advancedConfigs, setAdvancedConfigs] =
    useLocalStorageState<IAdvancedConfigs>(ADAVANCED_CONFIGS_KEY, {
      defaultValue: cloneDeep(defaultAdvancedConfigs),
    })

  const onAdvancedConfigsChange = (nvs: Partial<IAdvancedConfigs>) => {
    setAdvancedConfigs((prev) => {
      if (!prev) {
        return {
          ...cloneDeep(defaultAdvancedConfigs),
          ...nvs,
        }
      }
      return {
        ...prev,
        ...nvs,
      }
    })
  }

  const isServer = typeof window === 'undefined'

  if (isServer) {
    return <CardioLoading />
  }

  return (
    <>
      <ListSelect list={allList} active={finalList} oldUrl={oldUrl} />
      <AdvancedConfigs
        configs={advancedConfigs}
        onChange={onAdvancedConfigsChange}
      />
      <DateSwitch oldUrl={oldUrl} active={finalDate} options={dateOptions} />
      <Tabs advancedConfigs={advancedConfigs} tweetIds={allTweets} />
    </>
  )
}
