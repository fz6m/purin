import 'server-only'
import { NextRequest } from 'next/server'
import { isDateValid, isListValid } from '@/service/schema'
import type { ITweetsReq } from '@/service/interface'
import { DAY_LIMIT } from '@/constants'
import { prisma } from '@purin/db'
import { dayIns, getCurrentDayStartIns } from '@/utils/dayjs'
import { apiSend } from '@/utils/api'

const getTweets = async (opts: ITweetsReq) => {
  const { list, date } = opts
  const time = dayIns(`${date} 00:00:00`).toDate()
  try {
    const items = await prisma.tweet.findFirst({
      where: {
        listId: list,
        date: time,
      },
    })
    const ids = items?.tweets || []
    return ids
  } catch (e) {
    console.error('getTweets db error', e)
    return []
  }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const date = searchParams.get('date') as string | undefined
  const list = searchParams.get('list') as string | undefined

  if (!date?.length || !list?.length) {
    return apiSend.error('date and list are required')
  }

  if (!isDateValid(date)) {
    return apiSend.error('date is invalid')
  }
  if (!isListValid(list)) {
    return apiSend.error('list is invalid')
  }

  // only can search 10 days ago
  // 31 1 2 3 4 5 6 7 8 9 10
  // ^ invalid             ^ today
  const currentDay = getCurrentDayStartIns()
  const startDay = currentDay.subtract(DAY_LIMIT, 'day')
  const userDay = dayIns(date)
  const isFuture = userDay.isAfter(currentDay)
  if (isFuture) {
    return apiSend.error('date is invalid')
  }
  const isOld = !userDay.isSame(startDay) && userDay.isBefore(startDay)
  if (isOld) {
    return apiSend.error('date is invalid')
  }

  // call db
  const ids = await getTweets({
    date,
    list,
  })

  return apiSend.success(ids)
}
