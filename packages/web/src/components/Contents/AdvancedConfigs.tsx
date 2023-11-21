'use client'

import { IAdvancedConfigs } from './interface'
import cx from 'classnames'
import { HeartSwitch } from '@anatoliygatt/heart-switch'
import { ReactNode } from 'react'

export const AdvancedConfigs = ({
  configs,
  onChange,
}: {
  configs?: IAdvancedConfigs
  onChange?: (nvs: Partial<IAdvancedConfigs>) => void
}) => {
  return (
    <div className={cx('w-full pt-4', 'flex align-center')}>
      <Item
        label={`Hide reads: `}
        value={
          <HeartSwitch
            checked={configs?.hideRead}
            onChange={(e) => {
              onChange?.({ hideRead: e.target.checked })
            }}
          />
        }
      />
      <Item
        label={`Hide error: `}
        value={
          <HeartSwitch
            checked={configs?.hideError}
            onChange={(e) => {
              onChange?.({ hideError: e.target.checked })
            }}
          />
        }
      />
    </div>
  )
}

function Item({ label, value }: { label: ReactNode; value: ReactNode }) {
  return (
    <div className={cx('flex align-center flex-nowrap pr-3')}>
      <div className={'pr-2'}>{label}</div>
      <div>{value}</div>
    </div>
  )
}
