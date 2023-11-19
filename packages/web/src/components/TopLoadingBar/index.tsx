'use client'

import { useProgress } from '@/store/progress'
import LoadingBar from 'react-top-loading-bar'

export const TopLoadingBar = () => {
  const { progress, onLoaderFinish } = useProgress()
  return (
    <LoadingBar
      color="#1DA1F2"
      progress={progress}
      onLoaderFinished={onLoaderFinish}
    />
  )
}
