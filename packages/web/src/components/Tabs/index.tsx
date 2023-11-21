'use client'

import { toSafeInteger, uniq } from 'lodash'
import { useCallback, useEffect, useState } from 'react'
import { Tweet } from 'react-tweet'
import localforage from 'localforage'
import cx from 'classnames'
import styles from './index.module.scss'
import { useInView } from 'react-intersection-observer'
import { useProgress } from '@/store/progress'
import { ErrorBoundary } from 'react-error-boundary'

interface ITabsProps {
  tweetIds?: string[]
}

export const Tabs = ({ tweetIds = [] }: ITabsProps) => {
  const ids = tweetIds

  const { isRead, markAsRead } = useRead()
  const { done } = useProgress()

  useEffect(() => {
    done()
  }, [tweetIds])

  const [errorIdxs, setErrorIdxs] = useState<number[]>([])

  if (!ids?.length) {
    return <div className={cx('pt-2')}>{`No tweets found`}</div>
  }

  return (
    <div>
      <div className={cx('flex flex-col w-full')}>
        <div>
          {ids.map((id, idx) => {
            const isNextError = errorIdxs.includes(idx + 1)
            return (
              <div className={cx('flex relative w-full')} key={id}>
                <ErrorBoundary
                  onError={() => {
                    setErrorIdxs((prev) => {
                      return uniq([...prev, idx])
                    })
                  }}
                  fallback={
                    <TweetError id={id} idx={idx} isNextError={isNextError} />
                  }
                >
                  <LazyTweet
                    id={id}
                    isRead={isRead(id)}
                    index={idx}
                    markAsRead={markAsRead}
                  />
                </ErrorBoundary>
              </div>
            )
          })}
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
        </div>
      </div>
    </div>
  )
}

function TweetError({
  id,
  idx,
  isNextError,
}: {
  id: string
  idx: number
  isNextError?: boolean
}) {
  const isFirst = idx === 0

  return (
    <div
      className={cx(
        'flex justify-center items-center',
        'py-3 px-4',
        isFirst && 'mt-3',
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
}: {
  id: string
  index: number
  isRead: boolean | undefined
  markAsRead: (id: string) => Promise<void>
}) {
  const [marked, setMarked] = useState(false)

  const { ref, inView } = useInView({
    rootMargin: '30px 0px 30px 0px',
  })

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
          className={cx('max-w-[550px]')}
        >
          <Tweet id={id} />
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
  const setId = async (id: string) => {
    const newList = uniq([id, ...(store || [])]).slice(0, LS_MAX)
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
    markAsRead: async (id: string) => {
      await setId(id)
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
