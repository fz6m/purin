'use client'

import { cloneDeep, toSafeInteger, uniq } from 'lodash'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Tweet } from 'react-tweet'
import localforage from 'localforage'
import cx from 'classnames'
import styles from './index.module.scss'
import { useInView } from 'react-intersection-observer'
import { ErrorBoundary } from 'react-error-boundary'
import { IAdvancedConfigs } from '../Contents/interface'
import { useShortcut } from '@/hooks/useShortcut'
import { EClassHook, EHotkeys } from '@/constants'
import { toast } from 'sonner'
import { useSize } from 'ahooks'

interface ITabsProps {
  tweetIds?: string[]
  advancedConfigs?: IAdvancedConfigs
}

export const Tabs = ({ tweetIds = [], advancedConfigs }: ITabsProps) => {
  const ids = tweetIds

  const { isRead, markAsRead, getSnapshot } = useRead()

  const [errorIdxs, setErrorIdxs] = useState<number[]>([])
  const [errorIds, setErrorIds] = useState<string[]>([])

  const [snapshot, setSnapshot] = useState<string[]>([])
  useEffect(() => {
    const func = async () => {
      const _snapshot = await getSnapshot()
      setSnapshot(_snapshot)
    }
    func()
  }, [tweetIds])

  const idFilter = (originIds: string[]) => {
    if (!originIds?.length) {
      return []
    }
    const hideRead = advancedConfigs?.hideRead
    const hideReadFilter = (ids: string[]) => {
      if (!hideRead) {
        return ids
      }
      if (snapshot === undefined) {
        return []
      }
      return ids.filter((id) => !snapshot.includes(id))
    }
    const hideError = advancedConfigs?.hideError
    const hideErrorFilter = (ids: string[]) => {
      if (!hideError) {
        return ids
      }
      return ids.filter((id) => !errorIds.includes(id))
    }
    const result = hideErrorFilter(hideReadFilter(originIds))
    return result
  }

  const useSelfHostedApi = !!advancedConfigs?.useOwnApi

  const markAllAsRead = () => {
    toast.success('Mark all as read')
    markAsRead(ids)
  }

  useShortcut(EHotkeys.markAllAsRead, markAllAsRead)

  const finalIds = idFilter(ids)
  const hideTweetCounts = ids.length - finalIds.length

  if (!ids?.length) {
    return <div className={cx('pt-2')}>{`No tweets found`}</div>
  }

  return (
    <div>
      <div className={cx('flex flex-col w-full')}>
        <div>
          {!finalIds?.length && (
            <div
              className={cx(
                'my-2 px-1 text-lg text-slate-500 italic font-medium',
              )}
            >{`No tweets need to be displayed.`}</div>
          )}
          {finalIds.map((id, idx) => {
            const isNextError = errorIdxs.includes(idx + 1)
            const isFirst = idx === 0
            const isLast = idx === ids.length - 1
            const api = useSelfHostedApi && id && `/api/v2/get-tweets/${id}`
            return (
              <div className={cx('flex relative w-full')} key={id}>
                <ErrorBoundary
                  onError={() => {
                    setErrorIdxs((prev) => {
                      return uniq([...prev, idx])
                    })
                    setErrorIds((prev) => {
                      return uniq([...prev, id])
                    })
                  }}
                  fallback={
                    <TweetError
                      id={id}
                      className={cx(isFirst && 'mt-3', isLast && 'mb-3')}
                      isNextError={isNextError}
                    />
                  }
                >
                  <LazyTweet
                    id={id}
                    isRead={isRead(id)}
                    index={idx}
                    markAsRead={markAsRead}
                    api={api}
                  />
                </ErrorBoundary>
              </div>
            )
          })}
          <div
            onClick={markAllAsRead}
            className={cx(EClassHook.markAllAsRead, 'hidden')}
          />
        </div>
        <div
          className={cx(
            'text-lg text-slate-800 italic font-medium',
            'py-1 mt-[-0.25rem]',
            'cursor-default',
            'font-work',
          )}
        >
          {`Total`}
          <span className={cx('text-xl px-2')}>{`${ids.length}`}</span>
          {`tweets`}
          {hideTweetCounts > 0 && ` (Hide ${hideTweetCounts} tweets)`}
        </div>
      </div>
    </div>
  )
}

function TweetError({
  id,
  isNextError,
  className,
}: {
  id: string
  isNextError?: boolean
  className?: string
}) {
  return (
    <div
      className={cx(
        'flex justify-center items-center',
        'py-3 px-4',
        className,
        'border rounded-lg border-slate-300',
        isNextError && 'mb-3',
      )}
    >
      {`🟡 Oops, something went wrong, maybe tweet is deleted.`}
      <a
        className={cx('pl-3', 'text-blue-500 font-medium')}
        target="_blank"
        rel="noreferrer noopener"
        href={`https://twitter.com/name/status/${id}`}
      >
        Link
      </a>
    </div>
  )
}

function LazyTweet({
  id,
  isRead,
  index,
  markAsRead,
  api,
}: {
  id: string
  index: number
  isRead: boolean | undefined
  markAsRead: (id: string) => Promise<void>
  api?: string | false
}) {
  const [marked, setMarked] = useState(false)

  const { ref, inView } = useInView({
    rootMargin: '150px 0px 150px 0px',
  })

  const tweetBoxRef = useRef<HTMLDivElement>(null!)
  const size = useSize(tweetBoxRef)
  const isOver = size?.width ? size?.width > window.innerWidth * 0.9 : false
  const scale =
    isOver && size?.width ? (window.innerWidth * 0.9) / size?.width : 1
  const needEatBottomMargin = -1 * ((size?.height || 0) * (1 - scale))

  if (!inView) {
    return (
      <div ref={ref} className={cx('w-full')}>
        <Loading />
      </div>
    )
  }

  return (
    <>
      <div
        className={cx(
          'font-medium italic text-lg text-slate-500 s:text-base font-serif',
          'my-[0.6rem]',
          'absolute left-0 top-0 z-10',
          'flex justify-center items-center shrink-0',
          'cursor-default select-none pointer-events-none',
          'drop-shadow-md',
          index >= 9 ? 'mx-1' : 'mx-2',
        )}
      >{`${index + 1}`}</div>
      <div
        className={cx(
          'relative',
          typeof isRead === 'boolean' && (!isRead ? styles.mark : styles.gray),
          styles.mobile,
        )}
      >
        <div
          onClick={() => {
            if (marked) {
              return
            }
            setMarked(true)
            markAsRead(id)
          }}
          ref={tweetBoxRef}
          style={{
            marginBottom: isOver ? needEatBottomMargin : undefined,
            transform: isOver ? `scale(${scale})` : undefined,
          }}
          className={cx('max-w-[550px]', isOver && 's:origin-top-left')}
        >
          <Tweet
            id={id}
            {...(api
              ? {
                  apiUrl: api,
                }
              : {})}
          />
        </div>
      </div>
    </>
  )
}

const LS_KEY = 'purin-explorer-read-tweets_v1'
// 5 MB / (64bit max size length)
const LS_MAX = toSafeInteger(
  (5 * 1024 * 1024 - 4) /* quotes */ / (20 + 2 /* quotes */ + 1) /* comma */,
)
function useRead() {
  const getStore = useCallback(async () => {
    const lists = (await localforage.getItem(LS_KEY)) as string[] | undefined
    return lists || []
  }, [])
  const [store, setStore] = useState<string[] | undefined>()
  useEffect(() => {
    localforage.setDriver([localforage.INDEXEDDB, localforage.LOCALSTORAGE])
    const func = async () => {
      const s = await getStore()
      setStore(s)
    }
    func()
  }, [])
  const setId = async (id: string | string[]) => {
    const idAsArray = Array.isArray(id) ? id : [id]
    const newList = uniq([...idAsArray, ...(store || [])]).slice(0, LS_MAX)
    setStore(newList)
    await localforage.setItem(LS_KEY, newList)
  }
  return {
    isRead: (id: string) => {
      if (store === undefined) {
        return undefined
      }
      return store.includes(id)
    },
    markAsRead: async (id: string | string[]) => {
      await setId(id)
    },
    getSnapshot: async () => {
      const currentTimeStore = await getStore()
      return cloneDeep(currentTimeStore || [])
    },
  }
}

function Loading() {
  return (
    <div
      className={cx(
        'flex justify-center items-center',
        'w-[50%] h-40 s:w-full',
        'border rounded-lg',
        'my-[1.5rem] mx-0',
      )}
    >
      <div className={styles.loading_container}></div>
    </div>
  )
}
