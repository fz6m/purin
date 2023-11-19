import { NextRequest, NextResponse } from 'next/server'
import { uniq } from 'lodash'
import { getListHotTweets, type IXAuth } from 'purin'
import { prisma } from '@purin/db'
import { getCurrentDayStartIns } from '@/utils/dayjs'

interface IUpdateJson extends IXAuth {
  token: string
  list: string
}

export async function POST(request: NextRequest) {
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
  let json: Record<string, any> = {}
  try {
    json = await request.json()
  } catch {
    return sendError('json is invalid')
  }
  // TODO: use vercel edge config
  const { token, list, cookie, authorization } = json as IUpdateJson
  const updateToken = process.env.NEXT_APP_TWEETS_UPDATE_TOKEN
  if (token !== updateToken) {
    return sendError('token is invalid')
  }
  if (!cookie) {
    return sendError('cookie is required')
  }
  if (!authorization) {
    return sendError('authorization is required')
  }
  if (!list) {
    return sendError('list is required')
  }
  const allList = await prisma.list.findFirst({
    where: {
      id: list,
    },
  })
  if (!allList?.id) {
    return sendError('list is invalid')
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
