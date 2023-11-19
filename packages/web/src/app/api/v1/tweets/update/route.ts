import { NextRequest } from 'next/server'
import { uniq } from 'lodash'
import { getListHotTweets, type IXAuth } from 'purin'
import { prisma } from '@purin/db'
import { getCurrentDayStartIns } from '@/utils/dayjs'
import { apiSend } from '@/utils/api'
import { kv } from '@vercel/kv'

interface IUpdateJson extends IXAuth {
  token: string
  list: string
}

async function inner(request: NextRequest) {
  let json: Record<string, any> = {}
  try {
    json = await request.json()
  } catch {
    return apiSend.error('json is invalid')
  }
  // TODO: use vercel edge config
  const { token, list, cookie, authorization } = json as IUpdateJson
  const updateToken = process.env.NEXT_APP_TWEETS_UPDATE_TOKEN
  if (token !== updateToken) {
    return apiSend.error('token is invalid')
  }
  if (!cookie) {
    return apiSend.error('cookie is required')
  }
  if (!authorization) {
    return apiSend.error('authorization is required')
  }
  if (!list) {
    return apiSend.error('list is required')
  }
  const allList = await prisma.list.findFirst({
    where: {
      id: list,
    },
  })
  if (!allList?.id) {
    return apiSend.error('list is invalid')
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
    return apiSend.error('getLatestTweets error')
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
      return apiSend.error('insert error')
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
      return apiSend.error('update error')
    }
  }
  console.log(`update ${list} (${currentDate.format('YYYY-MM-DD')}) successful`)
  return apiSend.success()
}

const KEY = `tweets/update-calling`
// we cannot execute concurrently at the same time
// because twitter has request rate limit
export async function POST(request: NextRequest) {
  const value = await kv.get(KEY)
  const isCalling = `${value}` === 'true'
  if (isCalling) {
    return apiSend.error('calling')
  }
  try {
    await kv.set(KEY, 'true', {
      ex: 5,
    })
    const res = await inner(request)
    return res
  } catch (e) {
    console.error('update error', e)
    return apiSend.error('update error')
  } finally {
    await kv.del(KEY)
  }
}
