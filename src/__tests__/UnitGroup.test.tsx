import { render } from '@testing-library/react'
import { vi } from 'vitest'
import { UnitGroup } from '../components/UnitGroup'

const props = {
  year: 2026, month: 1,
  scrollMode: 'digit' as const,
  theme: 'dark' as const,
  size: 'md' as const,
  onChange: vi.fn(),
}

beforeEach(() => props.onChange.mockClear())

describe('digit scroll mode', () => {
  test('scroll up on tens digit increments day by 10', () => {
    const { container } = render(<UnitGroup {...props} type="day" value={15} />)
    const tensCard = container.querySelectorAll('.fc-card')[0] as HTMLElement
    tensCard.dispatchEvent(new WheelEvent('wheel', { deltaY: -120, bubbles: true, cancelable: true }))
    expect(props.onChange).toHaveBeenCalledWith(25)
  })

  test('auto-corrects units when tens creates invalid day (25→35 clamps to 31)', () => {
    const { container } = render(<UnitGroup {...props} type="day" value={25} />)
    const tensCard = container.querySelectorAll('.fc-card')[0] as HTMLElement
    tensCard.dispatchEvent(new WheelEvent('wheel', { deltaY: -120, bubbles: true, cancelable: true }))
    expect(props.onChange).toHaveBeenCalledWith(31)
  })

  test('scroll up on units digit increments day by 1', () => {
    const { container } = render(<UnitGroup {...props} type="day" value={15} />)
    const unitsCard = container.querySelectorAll('.fc-card')[1] as HTMLElement
    unitsCard.dispatchEvent(new WheelEvent('wheel', { deltaY: -120, bubbles: true, cancelable: true }))
    expect(props.onChange).toHaveBeenCalledWith(16)
  })

  test('scroll down on units digit decrements day by 1', () => {
    const { container } = render(<UnitGroup {...props} type="day" value={15} />)
    const unitsCard = container.querySelectorAll('.fc-card')[1] as HTMLElement
    unitsCard.dispatchEvent(new WheelEvent('wheel', { deltaY: 120, bubbles: true, cancelable: true }))
    expect(props.onChange).toHaveBeenCalledWith(14)
  })

  test('scroll down does not go below minimum (day stays at 01)', () => {
    const { container } = render(<UnitGroup {...props} type="day" value={1} />)
    const unitsCard = container.querySelectorAll('.fc-card')[1] as HTMLElement
    unitsCard.dispatchEvent(new WheelEvent('wheel', { deltaY: 120, bubbles: true, cancelable: true }))
    expect(props.onChange).not.toHaveBeenCalled()
  })
})

describe('unit scroll mode', () => {
  test('any card scroll increments whole value by 1', () => {
    const { container } = render(
      <UnitGroup {...props} scrollMode="unit" type="day" value={15} />
    )
    const card = container.querySelector('.fc-card') as HTMLElement
    card.dispatchEvent(new WheelEvent('wheel', { deltaY: -120, bubbles: true, cancelable: true }))
    expect(props.onChange).toHaveBeenCalledWith(16)
  })
})

describe('carry-over', () => {
  test('unit mode: scroll up past max calls onCarry(1)', () => {
    const onChange = vi.fn()
    const onCarry = vi.fn()
    const { container } = render(
      <UnitGroup
        type="day" value={31} year={2026} month={1}
        scrollMode="unit" theme="dark" size="md"
        onChange={onChange} onCarry={onCarry}
      />
    )
    const card = container.querySelector('.fc-card') as HTMLElement
    card.dispatchEvent(new WheelEvent('wheel', { deltaY: -120, bubbles: true, cancelable: true }))
    expect(onChange).toHaveBeenCalledWith(1)
    expect(onCarry).toHaveBeenCalledWith(1)
  })

  test('unit mode: scroll down past min calls onCarry(-1)', () => {
    const onChange = vi.fn()
    const onCarry = vi.fn()
    const { container } = render(
      <UnitGroup
        type="day" value={1} year={2026} month={1}
        scrollMode="unit" theme="dark" size="md"
        onChange={onChange} onCarry={onCarry}
      />
    )
    const card = container.querySelector('.fc-card') as HTMLElement
    card.dispatchEvent(new WheelEvent('wheel', { deltaY: 120, bubbles: true, cancelable: true }))
    expect(onChange).toHaveBeenCalledWith(31)
    expect(onCarry).toHaveBeenCalledWith(-1)
  })
})
