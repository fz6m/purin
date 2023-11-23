'use client'
import Select, { components } from 'react-select'
import cx from 'classnames'
import { IListItem } from '@/service/interface'
import { useQuery } from '@/hooks/useQuery'
import React, { Suspense, useEffect, useState } from 'react'
import styles from './index.module.scss'
import { fallbackCover } from './fallbackCover'

type ImageProps = React.ImgHTMLAttributes<HTMLImageElement>

function SafeImage(props: ImageProps) {
  const [error, setError] = useState(false)
  useEffect(() => {
    let img = new Image()
    img.src = props.src || ''
    img.onload = () => {
      setError(false)
      // @ts-ignore
      img = null
    }
    img.onerror = () => {
      setError(true)
      // @ts-ignore
      img = null
    }
  }, [])
  return <img {...props} src={error ? fallbackCover : props.src} />
}

function ListOption({ data }: { data: IListItem }) {
  return (
    <div
      className={cx(
        'flex align-center flex-nowrap py-1',
        'w-full',
        'j_option_inner',
      )}
    >
      <SafeImage
        src={data.cover}
        className={cx('w-[30%]', 'max-w-full object-cover', 'select-none')}
        alt="Cover"
      />
      <div
        className={cx(
          'flex flex-col justify-center overflow-hidden',
          'p-2 px-4',
        )}
      >
        <div className={cx('font-bold text-lg s:text-base truncate')}>
          {data.name}
        </div>
        <div
          className={cx(
            'text-slate-400 text-sm s:text-xs truncate',
            'j_option_selected',
          )}
        >
          {data.id}
        </div>
      </div>
    </div>
  )
}

export const ListSelect = ({
  list = [],
  active,
  oldUrl,
}: {
  list: IListItem[]
  active?: string
  oldUrl: string
}) => {
  const { changeQuery } = useQuery(oldUrl)

  const options = list.map((i) => {
    return {
      label: <ListOption data={i} />,
      value: i.id,
    }
  })

  const getValue = () => {
    const target = options.find((i) => i.value === active)
    return target
  }
  const [seletced, setSelected] = useState(getValue())

  return (
    <div className={cx('pt-5', 'z-20 relative')}>
      <Suspense>
        <Select
          autoFocus={false}
          isSearchable={false}
          value={seletced}
          placeholder="Please select a list"
          options={options}
          onChange={(nv) => {
            if (nv) {
              setSelected(nv)
              changeQuery({ list: nv.value })
            }
          }}
          components={{
            Option: (props) => {
              return (
                <components.Option
                  {...props}
                  className={cx(
                    props.className,
                    styles.option,
                    props.isSelected && styles.option_selected,
                  )}
                />
              )
            },
          }}
        />
      </Suspense>
    </div>
  )
}
