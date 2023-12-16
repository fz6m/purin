import { NextRequest } from 'next/server'
import { uniq } from 'lodash'
import { getListHotTweets, type IXAuth } from 'purin'
import { prisma } from '@purin/db'
import { getCurrentDayStartIns } from '@/utils/dayjs'
import { apiSend } from '@/utils/api'
import { kv } from '@vercel/kv'
import { get as edgeGet } from '@vercel/edge-config'
import { IListItem } from '@/service/interface'

interface IUpdateJson extends IXAuth {
  list: string
}

async function inner(json: Record<string, any>) {
  const { list, cookie, authorization } = json as IUpdateJson
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

const KEY_CD = `tweets/update-cd`
const KEY_PREV_GETTED_LIST = `tweets/update-prev-list`
export async function GET(request: NextRequest) {
  const updateToken = process.env.NEXT_APP_TWEETS_UPDATE_TOKEN
  if (request.headers.get('Authorization') !== `Bearer ${updateToken}`) {
    return apiSend.unauthorized()
  }
  const cdValue = await kv.get(KEY_CD)
  const isCD = `${cdValue}` === 'true'
  if (isCD) {
    return apiSend.error('cd')
  }
  await kv.set(KEY_CD, 'true', {
    // 58 mins
    ex: 60 * 58,
  })
  const prevGettedList = await kv.get(KEY_PREV_GETTED_LIST)
  const prevListAsString = `${prevGettedList}`
  const hasPrevList = prevGettedList && prevListAsString?.length
  let willGetList: string
  const allList: IListItem[] = await prisma.list.findMany()
  const ids = allList.map((item) => item.id)
  if (!ids?.length) {
    return apiSend.error('list is empty')
  }
  const params = new URLSearchParams(request.nextUrl.search)
  const userList = params.get('list')
  if (userList?.length) {
    const isAvailableList = ids.includes(userList)
    if (!isAvailableList) {
      return apiSend.error('list is invalid')
    } else {
      willGetList = userList
    }
  } else {
    if (!hasPrevList) {
      willGetList = ids[0]
    } else {
      const prevListIndex = ids.indexOf(prevListAsString)
      const nextListIndex = prevListIndex + 1
      if (nextListIndex >= ids.length) {
        willGetList = ids[0]
      } else {
        willGetList = ids[nextListIndex]
      }
    }
  }
  const cookie = await edgeGet('cookie')
  const cookieAsString = cookie?.toString()
  if (!cookieAsString?.length) {
    return apiSend.error('cookie is empty')
  }
  const authorization = await edgeGet('authorization')
  const authorizationAsString = authorization?.toString()
  if (!authorizationAsString?.length) {
    return apiSend.error('authorization is empty')
  }
  const isCall = await isCalling()
  if (isCall) {
    return apiSend.error('calling')
  }
  try {
    await setCall()
    const res = await inner({
      list: willGetList,
      cookie: cookieAsString,
      authorization: authorizationAsString,
    })
    if (res?.status === 200) {
      await kv.set(KEY_PREV_GETTED_LIST, willGetList)
    }
    return res
  } catch (e) {
    console.error('auto update error', e)
    return apiSend.error('auto update error')
  } finally {
    await clearCall()
  }
}

async function isCalling() {
  const value = await kv.get(KEY)
  const isCalling = `${value}` === 'true'
  return isCalling
}
async function setCall() {
  await kv.set(KEY, 'true', {
    ex: 5,
  })
}
async function clearCall() {
  await kv.del(KEY)
}

const KEY = `tweets/update-calling`
// we cannot execute concurrently at the same time
// because twitter has request rate limit
export async function POST(request: NextRequest) {
  const updateToken = process.env.NEXT_APP_TWEETS_UPDATE_TOKEN
  if (request.headers.get('Authorization') !== `Bearer ${updateToken}`) {
    return apiSend.unauthorized()
  }
  const isCall = await isCalling()
  if (isCall) {
    return apiSend.error('calling')
  }
  try {
    await setCall()
    let json: Record<string, any> = {}
    try {
      json = await request.json()
    } catch {
      return apiSend.error('json is invalid')
    }
    const res = await inner(json)
    return res
  } catch (e) {
    console.error('update error', e)
    return apiSend.error('update error')
  } finally {
    await clearCall()
  }
}
