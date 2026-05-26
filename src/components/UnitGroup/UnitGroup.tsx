import { useRef, useCallback } from 'react'
import type { FlipClockTheme, FlipClockSize, FlipDirection, ScrollMode } from '../../types'
import { FlipCard } from '../FlipCard'
import { clampDay, clampMonth, daysInMonth } from '../../utils/validation'
import { pad2 } from '../../utils/pad'

type UnitType = 'day' | 'month' | 'year-last' | 'hour' | 'minute' | 'second'

interface UnitGroupProps {
  type: UnitType
  value: number
  year?: number
  month?: number
  scrollMode: ScrollMode
  theme: FlipClockTheme
  size: FlipClockSize
  hour12?: boolean
  onChange: (value: number) => void
  onCarry?: (dir: FlipDirection) => void
}

function getRange(type: UnitType, year: number, month: number, hour12: boolean) {
  switch (type) {
    case 'day':       return { min: 1, max: daysInMonth(year, month) }
    case 'month':     return { min: 1, max: 12 }
    case 'year-last': return { min: 0, max: 99 }
    case 'hour':      return hour12 ? { min: 1, max: 12 } : { min: 0, max: 23 }
    case 'minute':
    case 'second':    return { min: 0, max: 59 }
    default: {
      const _exhaustive: never = type
      throw new Error(`Unhandled UnitType: ${String(_exhaustive)}`)
    }
  }
}

function flipDir(d: FlipDirection): FlipDirection {
  return d === 1 ? -1 : 1
}

export function UnitGroup({
  type, value, year = 2026, month = 1, scrollMode, theme, size,
  hour12 = false, onChange, onCarry,
}: UnitGroupProps) {
  // Scroll dir (1=up/increment, -1=down/decrement) is inverted for FlipCard's animation convention
  const flipDirRef = useRef<FlipDirection>(-1)
  const onChangeRef = useRef(onChange)
  const onCarryRef = useRef(onCarry)
  onChangeRef.current = onChange
  onCarryRef.current = onCarry

  const [tensCh, unitsCh] = pad2(value)
  const tens = Number(tensCh)
  const units = Number(unitsCh)

  const handleDigitScroll = useCallback((digitIndex: 0 | 1, dir: FlipDirection) => {
    flipDirRef.current = flipDir(dir)
    const { min, max } = getRange(type, year, month, hour12)

    if (scrollMode === 'unit') {
      let next = value + dir
      if (next > max) { next = min; onCarryRef.current?.(1) }
      else if (next < min) { next = max; onCarryRef.current?.(-1) }
      onChangeRef.current(next)
      return
    }

    if (digitIndex === 0) {
      const newTens = tens + dir
      let ct = newTens, cu = units
      if (type === 'day') [ct, cu] = clampDay(newTens, units, year, month)
      else if (type === 'month') [ct, cu] = clampMonth(newTens, units)
      const next = ct * 10 + cu
      if (next > max || next < min || next === value) return
      onChangeRef.current(next)
    } else {
      const newUnits = units + dir
      let ct = tens, cu = newUnits
      if (type === 'day') [ct, cu] = clampDay(tens, newUnits, year, month)
      else if (type === 'month') [ct, cu] = clampMonth(tens, newUnits)
      const next = ct * 10 + cu
      if (next > max || next < min || next === value) return
      onChangeRef.current(next)
    }
  }, [value, tens, units, type, year, month, hour12, scrollMode])

  const handleTensScroll  = useCallback((d: FlipDirection) => handleDigitScroll(0, d), [handleDigitScroll])
  const handleUnitsScroll = useCallback((d: FlipDirection) => handleDigitScroll(1, d), [handleDigitScroll])

  return (
    <>
      <FlipCard value={tensCh} theme={theme} size={size} dir={flipDirRef.current}
        onScroll={handleTensScroll} />
      <FlipCard value={unitsCh} theme={theme} size={size} dir={flipDirRef.current}
        onScroll={scrollMode === 'unit' ? handleTensScroll : handleUnitsScroll} />
    </>
  )
}
