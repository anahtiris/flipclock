import { useState, useRef, useCallback } from 'react'
import type {
  FlipClockMode, FlipClockTheme, FlipClockSize, ScrollMode, FlipDirection,
  DateValue, TimeValue, DateTimeValue, CountdownValue, FlipClockValue
} from '../../types'
import { UnitGroup } from '../UnitGroup'
import { CenturyPair } from '../CenturyPair'
import { FlipCard } from '../FlipCard'
import { daysInMonth } from '../../utils/validation'
import './FlipClock.css'

interface FlipClockProps {
  mode: FlipClockMode
  value?: FlipClockValue
  defaultValue?: FlipClockValue
  onChange?: (value: FlipClockValue) => void
  theme?: FlipClockTheme
  size?: FlipClockSize
  scrollMode?: ScrollMode
  showSeconds?: boolean
  showLabels?: boolean
  hour12?: boolean
  readOnly?: boolean
  disabled?: boolean
}

const DEFAULT_DATE: DateValue = { year: 2026, month: 1, day: 1 }
const DEFAULT_TIME: TimeValue = { hour: 12, minute: 0, period: 'AM' }

function Sep() {
  return <div className="fc-sep">|</div>
}

function Gap() {
  return <div className="fc-gap" />
}

function clampDay(day: number, year: number, month: number) {
  return Math.min(day, daysInMonth(year, month))
}

function AmPmCard({ period, theme, size, onChange }: {
  period: 'AM' | 'PM'
  theme: FlipClockTheme
  size: FlipClockSize
  onChange: (p: 'AM' | 'PM') => void
}) {
  const flipDirRef = useRef<FlipDirection>(-1)
  const handleScroll = useCallback((dir: FlipDirection) => {
    flipDirRef.current = (-dir) as FlipDirection
    onChange(period === 'AM' ? 'PM' : 'AM')
  }, [period, onChange])
  return <FlipCard value={period} theme={theme} size={size} wide dir={flipDirRef.current} onScroll={handleScroll} />
}

export function FlipClock({
  mode, value, defaultValue, onChange,
  theme = 'dark', size = 'md', scrollMode = 'digit',
  showSeconds = false, showLabels = true, hour12 = true,
  readOnly = false, disabled = false,
}: FlipClockProps) {
  const [internal, setInternal] = useState<FlipClockValue>(
    defaultValue ?? (mode === 'time' ? DEFAULT_TIME : DEFAULT_DATE)
  )
  const current = value ?? internal

  function update(next: FlipClockValue) {
    if (readOnly || disabled) return
    if (value === undefined) setInternal(next)
    onChange?.(next)
  }

  const rootClass = `fc-root fc-${theme} fc-${size}`
  const labeled = showLabels ? 'true' : 'false'

  if (mode === 'date') {
    const v = current as DateValue
    const century = Math.floor(v.year / 100) as 19 | 20
    const yearLast = v.year % 100
    return (
      <div className={rootClass} data-disabled={disabled ? 'true' : undefined}>
        <div className="fc-row" data-labeled={labeled}>
          <div className="fc-unit" data-label={showLabels ? 'DAY' : undefined}>
            <div className="fc-cards">
              <UnitGroup type="day" value={v.day} year={v.year} month={v.month}
                scrollMode={scrollMode} theme={theme} size={size}
                onChange={(day) => update({ ...v, day })} />
            </div>
          </div>
          <Sep />
          <div className="fc-unit" data-label={showLabels ? 'MONTH' : undefined}>
            <div className="fc-cards">
              <UnitGroup type="month" value={v.month} year={v.year} month={v.month}
                scrollMode={scrollMode} theme={theme} size={size}
                onChange={(month) => update({ ...v, month, day: clampDay(v.day, v.year, month) })} />
            </div>
          </div>
          <Sep />
          <div className="fc-unit" data-label={showLabels ? 'YEAR' : undefined}>
            <div className="fc-cards">
              <CenturyPair century={century} theme={theme} size={size}
                onCenturyChange={(c) => {
                  const year = c * 100 + yearLast
                  update({ ...v, year, day: clampDay(v.day, year, v.month) })
                }} />
              <UnitGroup type="year-last" value={yearLast} year={v.year} month={v.month}
                scrollMode={scrollMode} theme={theme} size={size}
                onChange={(last) => {
                  const year = century * 100 + last
                  update({ ...v, year, day: clampDay(v.day, year, v.month) })
                }} />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (mode === 'time') {
    const v = current as TimeValue
    const period = v.period ?? 'AM'
    return (
      <div className={rootClass} data-disabled={disabled ? 'true' : undefined}>
        <div className="fc-row" data-labeled={labeled}>
          <div className="fc-unit" data-label={showLabels ? 'HOUR' : undefined}>
            <div className="fc-cards">
              <UnitGroup type="hour" value={v.hour} scrollMode={scrollMode}
                theme={theme} size={size} hour12={hour12}
                onChange={(hour) => update({ ...v, hour })} />
            </div>
          </div>
          <Sep />
          <div className="fc-unit" data-label={showLabels ? 'MIN' : undefined}>
            <div className="fc-cards">
              <UnitGroup type="minute" value={v.minute} scrollMode={scrollMode}
                theme={theme} size={size} onChange={(minute) => update({ ...v, minute })} />
            </div>
          </div>
          {showSeconds && (
            <>
              <Sep />
              <div className="fc-unit" data-label={showLabels ? 'SEC' : undefined}>
                <div className="fc-cards">
                  <UnitGroup type="second" value={v.second ?? 0} scrollMode={scrollMode}
                    theme={theme} size={size} onChange={(second) => update({ ...v, second })} />
                </div>
              </div>
            </>
          )}
          {hour12 && (
            <>
              <Sep />
              <div className="fc-unit" data-label={showLabels ? '' : undefined}>
                <AmPmCard period={period} theme={theme} size={size}
                  onChange={(p) => update({ ...v, period: p })} />
              </div>
            </>
          )}
        </div>
      </div>
    )
  }

  if (mode === 'datetime') {
    const v = current as DateTimeValue
    const century = Math.floor(v.year / 100) as 19 | 20
    const yearLast = v.year % 100
    const period = v.period ?? 'AM'
    return (
      <div className={rootClass} data-disabled={disabled ? 'true' : undefined}>
        <div className="fc-row" data-labeled={labeled}>
          <div className="fc-unit" data-label={showLabels ? 'DAY' : undefined}>
            <div className="fc-cards">
              <UnitGroup type="day" value={v.day} year={v.year} month={v.month}
                scrollMode={scrollMode} theme={theme} size={size}
                onChange={(day) => update({ ...v, day })} />
            </div>
          </div>
          <Sep />
          <div className="fc-unit" data-label={showLabels ? 'MONTH' : undefined}>
            <div className="fc-cards">
              <UnitGroup type="month" value={v.month} year={v.year} month={v.month}
                scrollMode={scrollMode} theme={theme} size={size}
                onChange={(month) => update({ ...v, month, day: clampDay(v.day, v.year, month) })} />
            </div>
          </div>
          <Sep />
          <div className="fc-unit" data-label={showLabels ? 'YEAR' : undefined}>
            <div className="fc-cards">
              <CenturyPair century={century} theme={theme} size={size}
                onCenturyChange={(c) => {
                  const year = c * 100 + yearLast
                  update({ ...v, year, day: clampDay(v.day, year, v.month) })
                }} />
              <UnitGroup type="year-last" value={yearLast} year={v.year} month={v.month}
                scrollMode={scrollMode} theme={theme} size={size}
                onChange={(last) => {
                  const year = century * 100 + last
                  update({ ...v, year, day: clampDay(v.day, year, v.month) })
                }} />
            </div>
          </div>
          <Gap />
          <div className="fc-unit" data-label={showLabels ? 'HOUR' : undefined}>
            <div className="fc-cards">
              <UnitGroup type="hour" value={v.hour} scrollMode={scrollMode}
                theme={theme} size={size} hour12={hour12}
                onChange={(hour) => update({ ...v, hour })} />
            </div>
          </div>
          <Sep />
          <div className="fc-unit" data-label={showLabels ? 'MIN' : undefined}>
            <div className="fc-cards">
              <UnitGroup type="minute" value={v.minute} scrollMode={scrollMode}
                theme={theme} size={size} onChange={(minute) => update({ ...v, minute })} />
            </div>
          </div>
          {hour12 && (
            <>
              <Sep />
              <div className="fc-unit" data-label={showLabels ? '' : undefined}>
                <AmPmCard period={period} theme={theme} size={size}
                  onChange={(p) => update({ ...v, period: p })} />
              </div>
            </>
          )}
        </div>
      </div>
    )
  }

  if (mode === 'countdown') {
    const v = current as CountdownValue
    const dayPad = Math.min(v.days, 99).toString().padStart(2, '0')
    const hourPad = v.hours.toString().padStart(2, '0')
    const minPad = v.minutes.toString().padStart(2, '0')
    const secPad = v.seconds.toString().padStart(2, '0')
    return (
      <div className={rootClass} data-disabled={disabled ? 'true' : undefined}>
        <div className="fc-row" data-labeled={labeled}>
          <div className="fc-unit" data-label={showLabels ? 'DAYS' : undefined}>
            <div className="fc-cards">
              <FlipCard value={dayPad[0]} theme={theme} size={size} dir={1} />
              <FlipCard value={dayPad[1]} theme={theme} size={size} dir={1} />
            </div>
          </div>
          <Sep />
          <div className="fc-unit" data-label={showLabels ? 'HRS' : undefined}>
            <div className="fc-cards">
              <FlipCard value={hourPad[0]} theme={theme} size={size} dir={1} />
              <FlipCard value={hourPad[1]} theme={theme} size={size} dir={1} />
            </div>
          </div>
          <Sep />
          <div className="fc-unit" data-label={showLabels ? 'MIN' : undefined}>
            <div className="fc-cards">
              <FlipCard value={minPad[0]} theme={theme} size={size} dir={1} />
              <FlipCard value={minPad[1]} theme={theme} size={size} dir={1} />
            </div>
          </div>
          <Sep />
          <div className="fc-unit" data-label={showLabels ? 'SEC' : undefined}>
            <div className="fc-cards">
              <FlipCard value={secPad[0]} theme={theme} size={size} dir={1} />
              <FlipCard value={secPad[1]} theme={theme} size={size} dir={1} />
            </div>
          </div>
        </div>
      </div>
    )
  }

  return null
}
