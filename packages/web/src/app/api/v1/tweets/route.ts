import 'server-only'
import { NextRequest, NextResponse } from 'next/server'
import { isDateValid, isListValid } from '@/service/schema'
import type { ITweetsReq } from '@/service/interface'
import { DAY_LIMIT } from '@/constants'
import { prisma } from '@purin/db'
import { getListHotTweets, type IXAuth } from 'purin'
import { dayIns, getCurrentDayStartIns } from '@/utils/dayjs'
import { uniq } from 'lodash'

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

  const sendError = (msg: string) => {
    return NextResponse.json(
      {
        code: -1,
        message: msg,
      },
      {
        status: 400,
      },
    )
  }

  if (!date?.length || !list?.length) {
    return sendError('date and list are required')
  }

  if (!isDateValid(date)) {
    return sendError('date is invalid')
  }
  if (!isListValid(list)) {
    return sendError('list is invalid')
  }

  // only can search 10 days ago
  // 31 1 2 3 4 5 6 7 8 9 10
  // ^ invalid             ^ today
  const currentDay = getCurrentDayStartIns()
  const startDay = currentDay.subtract(DAY_LIMIT, 'day')
  const userDay = dayIns(date)
  const isFuture = userDay.isAfter(currentDay)
  if (isFuture) {
    return sendError('date is invalid')
  }
  const isOld = !userDay.isSame(startDay) && userDay.isBefore(startDay)
  if (isOld) {
    return sendError('date is invalid')
  }

  // call db
  const ids = await getTweets({
    date,
    list,
  })

  return NextResponse.json({
    code: 0,
    data: ids,
  })
}

interface IUpdateJson extends IXAuth {
  token: string
  list: string
}

export async function POST(request: NextRequest) {
  const updateToken = process.env.NEXT_APP_TWEETS_UPDATE_TOKEN
  const json = await request.json()
  // TODO: use vercel edge config
  const { token, list, cookie, authorization } = json as IUpdateJson
  const sendError = (msg: string) => {
    return NextResponse.json(
      {
        code: -1,
        message: msg,
      },
      {
        status: 400,
      },
    )
  }
  const sendSuccessful = () => {
    return NextResponse.json({
      code: 0,
      message: 'successful',
    })
  }
  if (token !== updateToken) {
    return sendError('token is invalid')
  }
  const allList = await prisma.list.findFirst({
    where: {
      id: list,
    },
  })
  if (!allList?.id) {
    return sendError('list is invalid')
  }
  if (!cookie) {
    return sendError('cookie is required')
  }
  if (!authorization) {
    return sendError('authorization is required')
  }
  const auth: IXAuth = {
    cookie,
    authorization,
  }
  const sleep = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms))
  const getLatestTweets = async () => {
    const task = () => getListHotTweets({ list, auth })
    try {
      const res = await task()
      return res
    } catch (e) {
      // try again
      console.warn('getLatestTweets error', e)
      await sleep(1000)
      try {
        const res = task()
        return res
      } catch {
        console.warn('getLatestTweets try again error', e)
        return
      }
    }
  }
  const newTweets = await getLatestTweets()
  if (!newTweets?.length) {
    return sendError('getLatestTweets error')
  }
  const currentDate = getCurrentDayStartIns()
  const data = await prisma.tweet.findFirst({
    where: {
      listId: list,
      date: currentDate.toDate(),
    },
  })
  if (!data) {
    // insert
    try {
      await prisma.tweet.create({
        data: {
          date: currentDate.toDate(),
          listId: list,
          tweets: newTweets,
        },
      })
    } catch (e) {
      console.error('insert error', e)
      return sendError('insert error')
    }
  } else {
    try {
      await prisma.tweet.update({
        where: {
          id: data.id,
        },
        data: {
          tweets: uniq([...newTweets, ...data.tweets]),
        },
      })
    } catch (e) {
      console.error('update error', e)
      return sendError('update error')
    }
  }
  console.log(`update ${list} (${currentDate.format('YYYY-MM-DD')}) successful`)
  return sendSuccessful()
}
