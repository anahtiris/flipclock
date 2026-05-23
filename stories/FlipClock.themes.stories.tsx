import type { StoryObj, Meta } from '@storybook/react'
import { FlipClock } from '../src/components/FlipClock'

const meta: Meta = { title: 'FlipClock/Themes' }
export default meta

export const DarkAndLight: StoryObj = {
  render: () => (
    <div style={{ display: 'flex', gap: 40, padding: 40, background: '#888' }}>
      <FlipClock mode="date" defaultValue={{ year: 2026, month: 5, day: 23 }} theme="dark" size="md" />
      <FlipClock mode="date" defaultValue={{ year: 2026, month: 5, day: 23 }} theme="light" size="md" />
    </div>
  ),
}
