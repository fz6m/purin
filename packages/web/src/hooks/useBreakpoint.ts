'use client'

import { useMedia } from 'react-use'

export const useBreakpoint = () => {
  const isMobile = useMedia(`(max-width: 640px)`, false)
  const isTablet = useMedia(`(max-width: 768px)`, false)
  const isPc = useMedia(`(max-width: 1024px)`, true)
  return { isMobile, isTablet, isPc }
}
