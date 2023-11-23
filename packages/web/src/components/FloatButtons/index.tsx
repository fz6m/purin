'use client'

import btIcon from '@/assets/icons/top.svg'
import markIcon from '@/assets/icons/mark.svg'
import Image from 'next/image'
import { ReactNode, useCallback, useEffect, useState } from 'react'
import cx from 'classnames'
import { motion } from 'framer-motion'
import { useShortcut } from '@/hooks/useShortcut'
import { EClassHook, EHotkeys } from '@/constants'
import { Tooltip } from '@/components/Tooltip'
import { toUpper } from 'lodash'

export const FloatButtons = () => {
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

  useShortcut(EHotkeys.backTop, onTop)

  const onMarkAllRead = useCallback(() => {
    // @ts-ignore
    document.querySelector(`.${EClassHook.markAllAsRead}`)?.click?.()
  }, [])

  const basePosition = 'fixed right-10 s:right-3 '

  return (
    <>
      <div className={cx(basePosition, 'bottom-10 s:bottom-3')}>
        <Tooltip
          place="left"
          content={`Back to top (${toUpper(EHotkeys.backTop)})`}
        >
          <Btn
            isShow={isShow}
            onClick={onTop}
            image={
              <Image
                className={'opacity-[.75]'}
                width={26}
                height={26}
                src={btIcon}
                alt="Back Top"
              />
            }
          />
        </Tooltip>
      </div>
      <div className={cx(basePosition, 'bottom-[6.4rem] s:bottom-[4.3rem]')}>
        <Tooltip
          place="left"
          content={`Mark all as read (${toUpper(EHotkeys.markAllAsRead)})`}
        >
          <Btn
            isShow={isShow}
            onClick={onMarkAllRead}
            image={
              <Image
                className={'opacity-[.75]'}
                width={24}
                height={24}
                src={markIcon}
                alt="Mark All Read"
              />
            }
          />
        </Tooltip>
      </div>
    </>
  )
}

function Btn({
  isShow,
  onClick,
  image,
}: {
  isShow: boolean
  onClick: () => void
  image: ReactNode
}) {
  return (
    <motion.button
      className={cx(
        'flex items-center justify-center shrink-0',
        'border rounded-md',
        'hover:bg-gray-100 transition-all duration-300',
        'hover:border-slate-200',
        'bg-white',
        'shadow',
        'active:shadow-none active:scale-95',
        !isShow && 'cursor-default pointer-events-none select-none',
        'w-12 h-12',
      )}
      onClick={onClick}
      initial={{ opacity: 0 }}
      animate={{ opacity: isShow ? 1 : 0 }}
    >
      {image}
    </motion.button>
  )
}
