'use client'

import { atom, useAtom } from 'jotai'
import { isNil } from 'lodash'
import { useRef } from 'react'

const progressAtom = atom(0)

// 😅
export const useProgress = () => {
  const [progress, setProgress] = useAtom(progressAtom)
  const doneRef = useRef(false)
  const timerRef = useRef<NodeJS.Timeout>()

  const changeProgress = (nv: number) => {
    setProgress((prev) => {
      if (prev > nv) {
        return prev
      }
      return nv
    })
  }

  const done = () => {
    if (!isNil(doneRef?.current)) {
      doneRef.current = true
    }
    setProgress(100)
    const timer = timerRef?.current
    if (timer) {
      clearTimeout(timer)
    }
  }

  const start = () => {
    if (!isNil(doneRef?.current)) {
      doneRef.current = false
    }
    const timer = timerRef?.current
    if (timer) {
      clearTimeout(timer)
    }
    changeProgress(10)
    timerRef.current = setTimeout(() => {
      if (!doneRef?.current) {
        changeProgress(75)
      } else {
        // clear
        if (timerRef?.current) {
          clearTimeout(timerRef.current)
        }
      }
    }, 800)
  }

  const onLoaderFinish = () => {
    setProgress(0)
    if (!isNil(doneRef?.current)) {
      doneRef.current = true
    }
    if (timerRef?.current) {
      clearTimeout(timerRef.current)
    }
  }

  return {
    done: () => {},
    start: () => {},
    progress,
    onLoaderFinish: () => {},
  }

  // return {
  //   done,
  //   start,
  //   progress,
  //   onLoaderFinish,
  // }
}
