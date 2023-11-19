import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import { TZ } from '@/constants'

dayjs.extend(utc)
dayjs.extend(timezone)

export const dayIns = (date?: string | number) => {
  return dayjs.tz(date, TZ)
}

export const getCurrentDateLabel = () => {
  return dayIns().format('YYYY-MM-DD')
}

export const getCurrentDayStartIns = () => {
  const startTime = `${getCurrentDateLabel()} 00:00:00`
  return dayIns(startTime)
}
