'use client'

import { useQuery } from '@/hooks/useQuery'
import { useProgress } from '@/store/progress'
import cx from 'classnames'
import { ReactNode } from 'react'

export interface IOption {
  label: ReactNode
  value: string
}

export const DateSwitch = ({
  options = [],
  active,
  oldUrl,
}: {
  options: IOption[]
  active: string
  oldUrl: string
}) => {
  const { changeQuery } = useQuery(oldUrl)
  const { start } = useProgress()

  return (
    <div className={cx('flex align-center flex-wrap', 'pt-4 mb-1', 'gap-2')}>
      {options.map((item) => {
        const isActive = item.value === active
        return (
          <button
            key={item.value}
            onClick={() => {
              start()
              changeQuery({ date: item.value })
            }}
            className={cx(
              'bg-white',
              'border border-slate-200 rounded-lg',
              'py-1.5 px-4 s:px-3',
              !isActive && 'hover:bg-gray-100 active:bg-gray-200',
              'transition-all transition-colors duration-300 ease-in-out',
              !isActive && 'active:scale-95',
              isActive && 'bg-gray-100 border-0',
              isActive && 'cursor-default',
              's:text-sm',
            )}
          >
            {item.label}
          </button>
        )
      })}
    </div>
  )
}
