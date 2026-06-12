export type DateValue = { year: number; month: number; day: number }
export type TimeValue = { hour: number; minute: number; second?: number; period?: 'AM' | 'PM' }
export type DateTimeValue = DateValue & TimeValue
export type CountdownValue = { days: number; hours: number; minutes: number; seconds: number }
export type FlipClockValue = DateValue | TimeValue | DateTimeValue | CountdownValue
export type FlipClockMode = 'date' | 'time' | 'datetime' | 'countdown'
export type ScrollMode = 'digit' | 'unit'
export type FlipClockSize = 'xs' | 'sm' | 'md' | 'lg'
export type FlipClockTheme = 'dark' | 'light'
export type FlipDirection = 1 | -1

type FlipClockSharedProps = {
  theme?: FlipClockTheme
  size?: FlipClockSize
  scrollMode?: ScrollMode
  showSeconds?: boolean
  showLabels?: boolean
  hour12?: boolean
  readOnly?: boolean
  disabled?: boolean
}

export type FlipClockProps =
  | (FlipClockSharedProps & {
      mode: 'date'
      value?: DateValue
      defaultValue?: DateValue
      onChange?: (value: DateValue) => void
    })
  | (FlipClockSharedProps & {
      mode: 'time'
      value?: TimeValue
      defaultValue?: TimeValue
      onChange?: (value: TimeValue) => void
    })
  | (FlipClockSharedProps & {
      mode: 'datetime'
      value?: DateTimeValue
      defaultValue?: DateTimeValue
      onChange?: (value: DateTimeValue) => void
    })
  | (FlipClockSharedProps & {
      mode: 'countdown'
      value?: CountdownValue
      defaultValue?: CountdownValue
      onChange?: (value: CountdownValue) => void
    })
