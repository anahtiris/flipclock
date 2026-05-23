import { render } from '@testing-library/react'
import { vi } from 'vitest'
import { FlipClock } from '../components/FlipClock'

test('date mode renders 8 cards (2 day + 2 month + 2 century + 2 year-last)', () => {
  const { container } = render(
    <FlipClock mode="date" value={{ year: 2026, month: 5, day: 23 }} onChange={vi.fn()} />
  )
  expect(container.querySelectorAll('.fc-card').length).toBe(8)
})

test('time mode renders 4 cards (2 hour + 2 min)', () => {
  const { container } = render(
    <FlipClock mode="time" value={{ hour: 9, minute: 30 }} onChange={vi.fn()} hour12={false} />
  )
  expect(container.querySelectorAll('.fc-card').length).toBe(4)
})

test('onChange called with updated DateValue on scroll', () => {
  const onChange = vi.fn()
  const { container } = render(
    <FlipClock mode="date" value={{ year: 2026, month: 5, day: 23 }} onChange={onChange} />
  )
  const firstCard = container.querySelector('.fc-card') as HTMLElement
  firstCard.dispatchEvent(new WheelEvent('wheel', { deltaY: -120, bubbles: true, cancelable: true }))
  expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ day: expect.any(Number) }))
})

test('changing month clamps day to valid range (Jan 29 → Feb = 28 in non-leap year)', () => {
  const onChange = vi.fn()
  const { container } = render(
    <FlipClock mode="date" value={{ year: 2025, month: 1, day: 29 }} onChange={onChange} />
  )
  // The month unit is the second group of cards (indices 2-3)
  const monthCards = container.querySelectorAll('.fc-unit')[1].querySelectorAll('.fc-card')
  monthCards[1].dispatchEvent(new WheelEvent('wheel', { deltaY: -120, bubbles: true, cancelable: true }))
  expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ month: 2, day: 28 }))
})

test('changing year clamps day when Feb 29 becomes invalid (2024→2025)', () => {
  const onChange = vi.fn()
  const { container } = render(
    <FlipClock mode="date" value={{ year: 2024, month: 2, day: 29 }} onChange={onChange} />
  )
  // year-last unit is the third group (index 2), second card is units digit (4→5)
  const yearCards = container.querySelectorAll('.fc-unit')[2].querySelectorAll('.fc-card')
  yearCards[3].dispatchEvent(new WheelEvent('wheel', { deltaY: -120, bubbles: true, cancelable: true }))
  expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ year: 2025, month: 2, day: 28 }))
})

test('disabled renders data-disabled attribute', () => {
  const { container } = render(
    <FlipClock mode="date" value={{ year: 2026, month: 5, day: 23 }} onChange={vi.fn()} disabled />
  )
  expect(container.querySelector('[data-disabled="true"]')).not.toBeNull()
})

test('time mode with hour12 renders 5 cards (2 hour + 2 min + 1 AM/PM)', () => {
  const { container } = render(
    <FlipClock mode="time" value={{ hour: 9, minute: 30, period: 'AM' }} onChange={vi.fn()} hour12 />
  )
  expect(container.querySelectorAll('.fc-card').length).toBe(5)
})

test('time mode with showSeconds renders 6 cards (2+2+2) in 24h', () => {
  const { container } = render(
    <FlipClock mode="time" value={{ hour: 9, minute: 30, second: 0 }} onChange={vi.fn()} hour12={false} showSeconds />
  )
  expect(container.querySelectorAll('.fc-card').length).toBe(6)
})

test('datetime mode (24h) renders 12 cards', () => {
  const { container } = render(
    <FlipClock mode="datetime" value={{ year: 2026, month: 5, day: 23, hour: 14, minute: 30 }} onChange={vi.fn()} hour12={false} />
  )
  expect(container.querySelectorAll('.fc-card').length).toBe(12)
})

test('datetime mode (12h) renders 13 cards (12 + AM/PM)', () => {
  const { container } = render(
    <FlipClock mode="datetime" value={{ year: 2026, month: 5, day: 23, hour: 9, minute: 30, period: 'AM' }} onChange={vi.fn()} hour12 />
  )
  expect(container.querySelectorAll('.fc-card').length).toBe(13)
})

test('countdown mode renders 8 cards (2 days + 2 hrs + 2 min + 2 sec)', () => {
  const { container } = render(
    <FlipClock mode="countdown" value={{ days: 5, hours: 3, minutes: 45, seconds: 30 }} onChange={vi.fn()} />
  )
  expect(container.querySelectorAll('.fc-card').length).toBe(8)
})

test('readOnly blocks onChange', () => {
  const onChange = vi.fn()
  const { container } = render(
    <FlipClock mode="date" value={{ year: 2026, month: 5, day: 23 }} onChange={onChange} readOnly />
  )
  const firstCard = container.querySelector('.fc-card') as HTMLElement
  firstCard.dispatchEvent(new WheelEvent('wheel', { deltaY: -120, bubbles: true, cancelable: true }))
  expect(onChange).not.toHaveBeenCalled()
})

test('AM/PM toggle calls onChange with switched period', () => {
  const onChange = vi.fn()
  const { container } = render(
    <FlipClock mode="time" value={{ hour: 9, minute: 30, period: 'AM' }} onChange={onChange} hour12 />
  )
  const ampmCard = container.querySelectorAll('.fc-card')[4] as HTMLElement
  ampmCard.dispatchEvent(new WheelEvent('wheel', { deltaY: -120, bubbles: true, cancelable: true }))
  expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ period: 'PM' }))
})
