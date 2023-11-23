'use client'

import { IAdvancedConfigs } from './interface'
import cx from 'classnames'
import { HeartSwitch } from '@anatoliygatt/heart-switch'
import { ReactNode } from 'react'
import { Tooltip } from '@/components/Tooltip'
import { useShortcut } from '@/hooks/useShortcut'
import { EHotkeys } from '@/constants'
import { toUpper } from 'lodash'

export const AdvancedConfigs = ({
  configs,
  onChange,
}: {
  configs?: IAdvancedConfigs
  onChange?: (nvs: Partial<IAdvancedConfigs>) => void
}) => {
  useShortcut(EHotkeys.hideAllReads, () => {
    onChange?.({
      hideRead: !configs?.hideRead,
    })
  })

  useShortcut(EHotkeys.hideAllErrors, () => {
    onChange?.({
      hideError: !configs?.hideError,
    })
  })

  return (
    <div className={cx('w-full pt-4', 'flex align-center')}>
      <Item
        label={
          <Tooltip
            content={`Hide all read tweets (${toUpper(EHotkeys.hideAllReads)})`}
          >{`Hide reads: `}</Tooltip>
        }
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
        label={
          <Tooltip
            content={`Hide all load fail tweets (maybe deleted, ${toUpper(
              EHotkeys.hideAllErrors,
            )})`}
          >{`Hide errors: `}</Tooltip>
        }
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
    <div className={cx('flex align-center flex-nowrap pr-4')}>
      <div className={'pr-2'}>{label}</div>
      <div>{value}</div>
    </div>
  )
}
