'use client'
import { EHotkeys } from '@/constants'
import hotkeys from 'hotkeys-js'
import { useEffect } from 'react'

export const useShortcut = (key: EHotkeys, callback: () => void) => {
  useEffect(() => {
    hotkeys(key, (e) => {
      e.preventDefault()
      callback()
    })
    return () => {
      hotkeys.unbind(key)
    }
  }, [key, callback])
}
