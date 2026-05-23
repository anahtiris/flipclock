import type { Meta, StoryObj } from '@storybook/react'
import { FlipClock } from '../src/components/FlipClock'

const meta: Meta<typeof FlipClock> = {
  title: 'FlipClock/Date',
  component: FlipClock,
  args: { mode: 'date', theme: 'dark', size: 'md', scrollMode: 'digit' },
}
export default meta
type Story = StoryObj<typeof FlipClock>

export const Default: Story    = { args: { defaultValue: { year: 2026, month: 5, day: 23 } } }
export const LightTheme: Story = { args: { defaultValue: { year: 2026, month: 5, day: 23 }, theme: 'light' } }
export const UnitMode: Story   = { args: { defaultValue: { year: 2026, month: 5, day: 23 }, scrollMode: 'unit' } }
export const NoLabels: Story   = { args: { defaultValue: { year: 2026, month: 5, day: 23 }, showLabels: false } }
