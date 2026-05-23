import { render, act } from '@testing-library/react'
import { vi } from 'vitest'
import { FlipCard } from '../components/FlipCard'

test('renders digit in all layers', () => {
  const { getAllByText } = render(<FlipCard value="7" theme="dark" size="md" />)
  expect(getAllByText('7').length).toBeGreaterThanOrEqual(1)
})

test('crease element present', () => {
  const { container } = render(<FlipCard value="3" theme="dark" size="md" />)
  expect(container.querySelector('.fc-crease')).not.toBeNull()
})

test('dark theme class applied', () => {
  const { container } = render(<FlipCard value="0" theme="dark" size="md" />)
  expect(container.firstChild).toHaveClass('fc-dark')
})

test('light theme class applied', () => {
  const { container } = render(<FlipCard value="0" theme="light" size="md" />)
  expect(container.firstChild).toHaveClass('fc-light')
})

test('animation applied on value change', async () => {
  const { container, rerender } = render(<FlipCard value="3" theme="dark" size="md" />)
  await act(async () => {
    rerender(<FlipCard value="4" theme="dark" size="md" dir={-1} />)
  })
  const flapTop = container.querySelector('.fc-flap-top') as HTMLElement
  expect(flapTop.style.animation).toContain('fc-exit-flap')
})
