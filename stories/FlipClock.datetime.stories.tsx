import type { Meta, StoryObj } from '@storybook/react'
import { FlipClock } from '../src/components/FlipClock'

const meta: Meta<typeof FlipClock> = {
  title: 'FlipClock/DateTime',
  component: FlipClock,
  args: { mode: 'datetime', theme: 'dark', size: 'md', scrollMode: 'digit' },
}
export default meta
type Story = StoryObj<typeof FlipClock>

export const TwelveHour: Story = {
  args: { defaultValue: { year: 2026, month: 5, day: 23, hour: 9, minute: 30, period: 'AM' }, hour12: true },
}

export const TwentyFourHour: Story = {
  args: { defaultValue: { year: 2026, month: 5, day: 23, hour: 14, minute: 30 }, hour12: false },
}

export const LightTheme: Story = {
  args: { defaultValue: { year: 2026, month: 5, day: 23, hour: 9, minute: 30, period: 'AM' }, theme: 'light', hour12: true },
}

export const UnitMode: Story = {
  args: { defaultValue: { year: 2026, month: 5, day: 23, hour: 9, minute: 30, period: 'AM' }, scrollMode: 'unit', hour12: true },
}
