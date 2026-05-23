import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { FlipCard } from '../src/components/FlipCard'
import type { FlipDirection } from '../src/types'

const meta: Meta<typeof FlipCard> = {
  title: 'FlipCard',
  component: FlipCard,
  args: { theme: 'dark', size: 'md' },
}
export default meta
type Story = StoryObj<typeof FlipCard>

export const Static: Story = { args: { value: '5' } }

export const Animated: Story = {
  render: (args) => {
    const [val, setVal] = useState('0')
    const [dir, setDir] = useState<FlipDirection>(-1)
    return (
      <div style={{ display: 'flex', gap: 16, alignItems: 'center', padding: 40, background: '#111' }}>
        <FlipCard {...args} value={val} dir={dir} />
        <button onClick={() => { setDir(-1); setVal(v => String((parseInt(v) + 1) % 10)) }}>+</button>
        <button onClick={() => { setDir(1); setVal(v => String((parseInt(v) + 9) % 10)) }}>−</button>
      </div>
    )
  },
}
