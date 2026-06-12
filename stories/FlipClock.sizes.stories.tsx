import type { StoryObj, Meta } from '@storybook/react'
import { FlipClock } from '../src/components/FlipClock'

const meta: Meta = { title: 'FlipClock/Sizes' }
export default meta

export const AllSizes: StoryObj = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 40, padding: 40, background: '#111', alignItems: 'flex-start' }}>
      <FlipClock mode="date" defaultValue={{ year: 2026, month: 5, day: 23 }} size="xs" />
      <FlipClock mode="date" defaultValue={{ year: 2026, month: 5, day: 23 }} size="sm" />
      <FlipClock mode="date" defaultValue={{ year: 2026, month: 5, day: 23 }} size="md" />
      <FlipClock mode="date" defaultValue={{ year: 2026, month: 5, day: 23 }} size="lg" />
      <FlipClock mode="datetime" defaultValue={{ year: 2026, month: 5, day: 23, hour: 12, minute: 30 }} size="xs" />
      <FlipClock mode="datetime" defaultValue={{ year: 2026, month: 5, day: 23, hour: 12, minute: 30 }} size="sm" />
      <FlipClock mode="datetime" defaultValue={{ year: 2026, month: 5, day: 23, hour: 12, minute: 30 }} size="md" />
      <FlipClock mode="datetime" defaultValue={{ year: 2026, month: 5, day: 23, hour: 12, minute: 30 }} size="lg" />
    </div>
  ),
}
