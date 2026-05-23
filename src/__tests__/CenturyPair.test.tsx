import { render } from '@testing-library/react'
import { vi } from 'vitest'
import { describe, beforeEach, afterEach } from 'vitest'
import { CenturyPair } from '../components/CenturyPair'

test('renders "2" and "0" for century 20', () => {
  const { getAllByText } = render(
    <CenturyPair century={20} theme="dark" size="md" onCenturyChange={vi.fn()} />
  )
  expect(getAllByText('2').length).toBeGreaterThan(0)
  expect(getAllByText('0').length).toBeGreaterThan(0)
})

test('any scroll from century 20 calls onCenturyChange with 19', () => {
  const onChange = vi.fn()
  const { container } = render(
    <CenturyPair century={20} theme="dark" size="md" onCenturyChange={onChange} />
  )
  const card = container.querySelector('.fc-card') as HTMLElement
  card.dispatchEvent(new WheelEvent('wheel', { deltaY: 120, bubbles: true, cancelable: true }))
  expect(onChange).toHaveBeenCalledWith(19)
})

test('any scroll from century 19 calls onCenturyChange with 20', () => {
  const onChange = vi.fn()
  const { container } = render(
    <CenturyPair century={19} theme="dark" size="md" onCenturyChange={onChange} />
  )
  const card = container.querySelector('.fc-card') as HTMLElement
  card.dispatchEvent(new WheelEvent('wheel', { deltaY: 120, bubbles: true, cancelable: true }))
  expect(onChange).toHaveBeenCalledWith(20)
})

test('toggling twice returns to the original century', async () => {
  vi.useFakeTimers()
  const onChange = vi.fn()
  const { container, rerender } = render(
    <CenturyPair century={20} theme="dark" size="md" onCenturyChange={onChange} />
  )

  let cards = container.querySelectorAll('.fc-card')
  cards[0].dispatchEvent(new WheelEvent('wheel', { deltaY: 120, bubbles: true, cancelable: true }))
  expect(onChange).toHaveBeenCalledTimes(1)
  expect(onChange).toHaveBeenLastCalledWith(19)

  // Wait for animation lock to complete (320ms)
  vi.advanceTimersByTime(320)

  rerender(<CenturyPair century={19} theme="dark" size="md" onCenturyChange={onChange} />)
  cards = container.querySelectorAll('.fc-card')
  cards[0].dispatchEvent(new WheelEvent('wheel', { deltaY: 120, bubbles: true, cancelable: true }))
  expect(onChange).toHaveBeenCalledTimes(2)
  expect(onChange).toHaveBeenNthCalledWith(2, 20)

  vi.useRealTimers()
})
