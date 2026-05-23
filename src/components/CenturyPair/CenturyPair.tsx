import { useRef, useCallback } from 'react'
import type { FlipClockTheme, FlipClockSize, FlipDirection } from '../../types'
import { FlipCard } from '../FlipCard'

interface CenturyPairProps {
  century: 19 | 20
  theme: FlipClockTheme
  size: FlipClockSize
  onCenturyChange: (century: 19 | 20) => void
}

export function CenturyPair({ century, theme, size, onCenturyChange }: CenturyPairProps) {
  const flipDirRef = useRef<FlipDirection>(-1)
  const s = String(century)

  const handleScroll = useCallback((dir: FlipDirection) => {
    flipDirRef.current = (-dir) as FlipDirection
    onCenturyChange(century === 20 ? 19 : 20)
  }, [century, onCenturyChange])

  return (
    <>
      <FlipCard value={s[0]} theme={theme} size={size} dir={flipDirRef.current} onScroll={handleScroll} />
      <FlipCard value={s[1]} theme={theme} size={size} dir={flipDirRef.current} onScroll={handleScroll} />
    </>
  )
}
