import { useRef, useCallback } from 'react'
import type { FlipClockTheme, FlipClockSize, FlipDirection } from '../../types'
import { FlipCard } from '../FlipCard'
import { pad2 } from '../../utils/pad'

interface CenturyPairProps {
  century: 19 | 20
  theme: FlipClockTheme
  size: FlipClockSize
  onCenturyChange: (century: 19 | 20) => void
}

function flipDir(d: FlipDirection): FlipDirection {
  return d === 1 ? -1 : 1
}

export function CenturyPair({ century, theme, size, onCenturyChange }: CenturyPairProps) {
  const flipDirRef = useRef<FlipDirection>(-1)
  const onCenturyChangeRef = useRef(onCenturyChange)
  onCenturyChangeRef.current = onCenturyChange

  const [tens, units] = pad2(century)

  const handleScroll = useCallback((dir: FlipDirection) => {
    flipDirRef.current = flipDir(dir)
    onCenturyChangeRef.current(century === 20 ? 19 : 20)
  }, [century])

  return (
    <>
      <FlipCard value={tens} theme={theme} size={size} dir={flipDirRef.current} onScroll={handleScroll} />
      <FlipCard value={units} theme={theme} size={size} dir={flipDirRef.current} onScroll={handleScroll} />
    </>
  )
}
