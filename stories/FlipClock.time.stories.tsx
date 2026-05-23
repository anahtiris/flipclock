import type { Meta, StoryObj } from '@storybook/react'
import { FlipClock } from '../src/components/FlipClock'

const meta: Meta<typeof FlipClock> = {
  title: 'FlipClock/Time',
  component: FlipClock,
  args: { mode: 'time', theme: 'dark', size: 'md' },
}
export default meta
type Story = StoryObj<typeof FlipClock>

export const TwelveHour: Story     = { args: { defaultValue: { hour: 9, minute: 30 }, hour12: true } }
export const TwentyFourHour: Story = { args: { defaultValue: { hour: 14, minute: 30 }, hour12: false } }
export const WithSeconds: Story    = { args: { defaultValue: { hour: 9, minute: 30, second: 0 }, showSeconds: true } }
