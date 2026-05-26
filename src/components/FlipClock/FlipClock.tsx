import { memo, useState, useRef, useCallback } from 'react'
import type {
  FlipClockTheme, FlipClockSize, ScrollMode, FlipDirection,
  DateValue, TimeValue, DateTimeValue, CountdownValue,
  FlipClockProps,
} from '../../types'
import { UnitGroup } from '../UnitGroup'
import { CenturyPair } from '../CenturyPair'
import { FlipCard } from '../FlipCard'
import { daysInMonth } from '../../utils/validation'
import { pad2 } from '../../utils/pad'
import './FlipClock.css'

const DEFAULT_DATE: DateValue = { year: 2026, month: 1, day: 1 }
const DEFAULT_TIME: TimeValue = { hour: 12, minute: 0, period: 'AM' }
const DEFAULT_DATETIME: DateTimeValue = { ...DEFAULT_DATE, ...DEFAULT_TIME }
const DEFAULT_COUNTDOWN: CountdownValue = { days: 0, hours: 0, minutes: 0, seconds: 0 }

function Sep() {
  return <div className="fc-sep">|</div>
}

function Gap() {
  return <div className="fc-gap" />
}

function clampDay(day: number, year: number, month: number) {
  return Math.min(day, daysInMonth(year, month))
}

function centuryOf(year: number): 19 | 20 {
  return year < 2000 ? 19 : 20
}

function flipDir(d: FlipDirection): FlipDirection {
  return d === 1 ? -1 : 1
}

const AmPmCard = memo(function AmPmCard({ period, theme, size, onChange }: {
  period: 'AM' | 'PM'
  theme: FlipClockTheme
  size: FlipClockSize
  onChange: (p: 'AM' | 'PM') => void
}) {
  const flipDirRef = useRef<FlipDirection>(-1)
  const onChangeRef = useRef(onChange)
  onChangeRef.current = onChange

  const handleScroll = useCallback((dir: FlipDirection) => {
    flipDirRef.current = flipDir(dir)
    onChangeRef.current(period === 'AM' ? 'PM' : 'AM')
  }, [period])

  return <FlipCard value={period} theme={theme} size={size} wide dir={flipDirRef.current} onScroll={handleScroll} />
})

type SharedShape = {
  theme: FlipClockTheme
  size: FlipClockSize
  scrollMode: ScrollMode
  showLabels: boolean
  hour12: boolean
  showSeconds: boolean
  readOnly: boolean
  disabled: boolean
}

function useControlled<T>(value: T | undefined, defaultValue: T | undefined, fallback: T) {
  const [internal, setInternal] = useState<T>(() => defaultValue ?? fallback)
  const current = value ?? internal
  const set = (next: T) => {
    if (value === undefined) setInternal(next)
  }
  return [current, set] as const
}

function rootClass(shared: SharedShape) {
  return `fc-root fc-${shared.theme} fc-${shared.size}`
}

function DateClock({
  value, defaultValue, onChange, shared,
}: {
  value: DateValue | undefined
  defaultValue: DateValue | undefined
  onChange: ((value: DateValue) => void) | undefined
  shared: SharedShape
}) {
  const [current, setCurrent] = useControlled(value, defaultValue, DEFAULT_DATE)
  const { theme, size, scrollMode, showLabels, readOnly, disabled } = shared

  const update = (next: DateValue) => {
    if (readOnly || disabled) return
    setCurrent(next)
    onChange?.(next)
  }

  const v = current
  const century = centuryOf(v.year)
  const yearLast = v.year % 100

  return (
    <div className={rootClass(shared)} data-disabled={disabled ? 'true' : undefined}>
      <div className="fc-row" data-labeled={showLabels ? 'true' : 'false'}>
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

function TimeClock({
  value, defaultValue, onChange, shared,
}: {
  value: TimeValue | undefined
  defaultValue: TimeValue | undefined
  onChange: ((value: TimeValue) => void) | undefined
  shared: SharedShape
}) {
  const [current, setCurrent] = useControlled(value, defaultValue, DEFAULT_TIME)
  const { theme, size, scrollMode, showLabels, hour12, showSeconds, readOnly, disabled } = shared

  const update = (next: TimeValue) => {
    if (readOnly || disabled) return
    setCurrent(next)
    onChange?.(next)
  }

  const v = current
  const period = v.period ?? 'AM'

  return (
    <div className={rootClass(shared)} data-disabled={disabled ? 'true' : undefined}>
      <div className="fc-row" data-labeled={showLabels ? 'true' : 'false'}>
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
        {showSeconds ? (
          <>
            <Sep />
            <div className="fc-unit" data-label={showLabels ? 'SEC' : undefined}>
              <div className="fc-cards">
                <UnitGroup type="second" value={v.second ?? 0} scrollMode={scrollMode}
                  theme={theme} size={size} onChange={(second) => update({ ...v, second })} />
              </div>
            </div>
          </>
        ) : null}
        {hour12 ? (
          <>
            <Sep />
            <div className="fc-unit" data-label={showLabels ? '' : undefined}>
              <AmPmCard period={period} theme={theme} size={size}
                onChange={(p) => update({ ...v, period: p })} />
            </div>
          </>
        ) : null}
      </div>
    </div>
  )
}

function DateTimeClock({
  value, defaultValue, onChange, shared,
}: {
  value: DateTimeValue | undefined
  defaultValue: DateTimeValue | undefined
  onChange: ((value: DateTimeValue) => void) | undefined
  shared: SharedShape
}) {
  const [current, setCurrent] = useControlled(value, defaultValue, DEFAULT_DATETIME)
  const { theme, size, scrollMode, showLabels, hour12, readOnly, disabled } = shared

  const update = (next: DateTimeValue) => {
    if (readOnly || disabled) return
    setCurrent(next)
    onChange?.(next)
  }

  const v = current
  const century = centuryOf(v.year)
  const yearLast = v.year % 100
  const period = v.period ?? 'AM'

  return (
    <div className={rootClass(shared)} data-disabled={disabled ? 'true' : undefined}>
      <div className="fc-row" data-labeled={showLabels ? 'true' : 'false'}>
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
        {hour12 ? (
          <>
            <Sep />
            <div className="fc-unit" data-label={showLabels ? '' : undefined}>
              <AmPmCard period={period} theme={theme} size={size}
                onChange={(p) => update({ ...v, period: p })} />
            </div>
          </>
        ) : null}
      </div>
    </div>
  )
}

function CountdownClock({
  value, defaultValue, shared,
}: {
  value: CountdownValue | undefined
  defaultValue: CountdownValue | undefined
  onChange: ((value: CountdownValue) => void) | undefined
  shared: SharedShape
}) {
  const [current] = useControlled(value, defaultValue, DEFAULT_COUNTDOWN)
  const { theme, size, showLabels, disabled } = shared
  const v = current
  const [dayTens, dayUnits] = pad2(Math.min(v.days, 99))
  const [hourTens, hourUnits] = pad2(v.hours)
  const [minTens, minUnits] = pad2(v.minutes)
  const [secTens, secUnits] = pad2(v.seconds)

  return (
    <div className={rootClass(shared)} data-disabled={disabled ? 'true' : undefined}>
      <div className="fc-row" data-labeled={showLabels ? 'true' : 'false'}>
        <div className="fc-unit" data-label={showLabels ? 'DAYS' : undefined}>
          <div className="fc-cards">
            <FlipCard value={dayTens} theme={theme} size={size} dir={1} />
            <FlipCard value={dayUnits} theme={theme} size={size} dir={1} />
          </div>
        </div>
        <Sep />
        <div className="fc-unit" data-label={showLabels ? 'HRS' : undefined}>
          <div className="fc-cards">
            <FlipCard value={hourTens} theme={theme} size={size} dir={1} />
            <FlipCard value={hourUnits} theme={theme} size={size} dir={1} />
          </div>
        </div>
        <Sep />
        <div className="fc-unit" data-label={showLabels ? 'MIN' : undefined}>
          <div className="fc-cards">
            <FlipCard value={minTens} theme={theme} size={size} dir={1} />
            <FlipCard value={minUnits} theme={theme} size={size} dir={1} />
          </div>
        </div>
        <Sep />
        <div className="fc-unit" data-label={showLabels ? 'SEC' : undefined}>
          <div className="fc-cards">
            <FlipCard value={secTens} theme={theme} size={size} dir={1} />
            <FlipCard value={secUnits} theme={theme} size={size} dir={1} />
          </div>
        </div>
      </div>
    </div>
  )
}

export function FlipClock(props: FlipClockProps) {
  const shared: SharedShape = {
    theme: props.theme ?? 'dark',
    size: props.size ?? 'md',
    scrollMode: props.scrollMode ?? 'digit',
    showLabels: props.showLabels ?? true,
    hour12: props.hour12 ?? true,
    showSeconds: props.showSeconds ?? false,
    readOnly: props.readOnly ?? false,
    disabled: props.disabled ?? false,
  }

  switch (props.mode) {
    case 'date':
      return <DateClock value={props.value} defaultValue={props.defaultValue} onChange={props.onChange} shared={shared} />
    case 'time':
      return <TimeClock value={props.value} defaultValue={props.defaultValue} onChange={props.onChange} shared={shared} />
    case 'datetime':
      return <DateTimeClock value={props.value} defaultValue={props.defaultValue} onChange={props.onChange} shared={shared} />
    case 'countdown':
      return <CountdownClock value={props.value} defaultValue={props.defaultValue} onChange={props.onChange} shared={shared} />
    default: {
      const _exhaustive: never = props
      throw new Error(`Unhandled FlipClock mode: ${String((_exhaustive as { mode?: string }).mode)}`)
    }
  }
}
