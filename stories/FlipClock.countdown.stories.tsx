import type { StoryObj, Meta } from '@storybook/react'
import { useState, useEffect } from 'react'
import { FlipClock } from '../src/components/FlipClock'
import type { CountdownValue, FlipClockTheme, FlipClockSize } from '../src/types'

const meta: Meta = { title: 'FlipClock/Countdown' }
export default meta

function secondsToCountdown(s: number): CountdownValue {
  const total = Math.max(0, s)
  return {
    days: Math.floor(total / 86400),
    hours: Math.floor((total % 86400) / 3600),
    minutes: Math.floor((total % 3600) / 60),
    seconds: total % 60,
  }
}

function LiveCountdown({ initialSeconds, theme, size }: {
  initialSeconds: number
  theme?: FlipClockTheme
  size?: FlipClockSize
}) {
  const [remaining, setRemaining] = useState(initialSeconds)

  useEffect(() => {
    if (remaining <= 0) return
    const timer = setInterval(() => setRemaining(s => Math.max(0, s - 1)), 1000)
    return () => clearInterval(timer)
  }, [remaining])

  return (
    <FlipClock
      mode="countdown"
      value={secondsToCountdown(remaining)}
      theme={theme ?? 'dark'}
      size={size ?? 'md'}
    />
  )
}

export const Default: StoryObj = {
  render: () => <LiveCountdown initialSeconds={3 * 3600 + 45 * 60 + 30} />,
}

export const LightTheme: StoryObj = {
  render: () => <LiveCountdown initialSeconds={3 * 3600 + 45 * 60 + 30} theme="light" />,
}

export const Large: StoryObj = {
  render: () => <LiveCountdown initialSeconds={3 * 3600 + 45 * 60 + 30} size="lg" />,
}

export const WithDays: StoryObj = {
  render: () => <LiveCountdown initialSeconds={5 * 86400 + 3 * 3600 + 45 * 60 + 30} />,
}
