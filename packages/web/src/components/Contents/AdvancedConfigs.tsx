'use client'

import { IAdvancedConfigs } from './interface'
import cx from 'classnames'
import { HeartSwitch } from '@anatoliygatt/heart-switch'
import { ReactNode } from 'react'
import { Tooltip } from '@/components/Tooltip'
import { useShortcut } from '@/hooks/useShortcut'
import { EHotkeys } from '@/constants'
import { toUpper } from 'lodash'
import { useBreakpoint } from '@/hooks/useBreakpoint'

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

  const { isMobile } = useBreakpoint()

  return (
    <div className={cx('w-full pt-4', 'flex align-center flex-wrap gap-3')}>
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
      {!isMobile && (
        <Item
          label={
            <Tooltip
              content={`Use self-hosted api to get tweets`}
            >{`Own API: `}</Tooltip>
          }
          value={
            <HeartSwitch
              checked={configs?.useOwnApi}
              onChange={(e) => {
                onChange?.({ useOwnApi: e.target.checked })
                // reload page
                window.location.reload()
              }}
            />
          }
        />
      )}
    </div>
  )
}

function Item({ label, value }: { label: ReactNode; value: ReactNode }) {
  return (
    <div className={cx('flex align-center flex-nowrap')}>
      <div className={'pr-2 whitespace-nowrap'}>{label}</div>
      <div>{value}</div>
    </div>
  )
}
