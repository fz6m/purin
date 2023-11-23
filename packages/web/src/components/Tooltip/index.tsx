'use client'
import React, { ReactNode, useId } from 'react'
import { Tooltip as ReactTooltip } from 'react-tooltip'

type ToolTipProps = React.ComponentProps<typeof ReactTooltip>

export const Tooltip = ({
  children,
  content,
  ...props
}: React.PropsWithChildren<
  {
    content: ReactNode
  } & ToolTipProps
>) => {
  const id = useId()

  return (
    <>
      <div data-tooltip-id={id}>{children}</div>
      <ReactTooltip
        id={id}
        style={{
          zIndex: 100,
        }}
        {...props}
      >
        {content}
      </ReactTooltip>
    </>
  )
}
