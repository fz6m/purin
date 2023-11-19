'use client'

import btIcon from '@/assets/icons/top.svg'
import Image from 'next/image'
import { useCallback, useEffect, useState } from 'react'
import cx from 'classnames'
import { motion } from 'framer-motion'

export const BackTop = () => {
  const [isShow, setIsShow] = useState(false)
  useEffect(() => {
    const onScroll = () => {
      if (window.scrollY > 200) {
        setIsShow(true)
      } else {
        setIsShow(false)
      }
    }
    document.addEventListener('scroll', onScroll)
    return () => {
      document.removeEventListener('scroll', onScroll)
    }
  }, [])

  const onTop = useCallback(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }, [])

  return (
    <div
      className={cx(
        'fixed bottom-10 right-10 s:right-3 s:bottom-5 s:scale-[0.8] s:origin-right',
      )}
    >
      <motion.button
        className={cx(
          'flex items-center justify-center shrink-0',
          'p-2',
          'border rounded-md',
          'hover:bg-gray-100 transition-all duration-300',
          'hover:border-slate-200',
          'bg-white',
          'shadow',
          'active:shadow-none active:scale-95',
          !isShow && 'cursor-default pointer-events-none select-none',
        )}
        onClick={onTop}
        initial={{ opacity: 0 }}
        animate={{ opacity: isShow ? 1 : 0 }}
      >
        <Image width={24} height={24} src={btIcon} alt="Back Top" />
      </motion.button>
    </div>
  )
}
