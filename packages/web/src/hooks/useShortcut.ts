'use client'
import hotkeys from 'hotkeys-js'
import { useEffect } from 'react'

export const useShortcut = (key: string, callback: () => void) => {
  useEffect(() => {
    hotkeys(key, (e) => {
      e.preventDefault()
      callback()
    })
    return () => {
      hotkeys.unbind(key)
    }
  }, [])
}
