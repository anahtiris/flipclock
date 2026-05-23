import { describe, test, expect, vi, beforeEach } from 'vitest'
import { makeScrollHandler } from '../utils/scroll'

describe('makeScrollHandler', () => {
  beforeEach(() => vi.useFakeTimers())

  test('fires immediately on first event', () => {
    const onFlip = vi.fn()
    makeScrollHandler(onFlip)(new WheelEvent('wheel', { deltaY: 100 }))
    expect(onFlip).toHaveBeenCalledTimes(1)
    expect(onFlip).toHaveBeenCalledWith(-1)
  })

  test('dir=1 when deltaY < 0 (scroll up = increment)', () => {
    const onFlip = vi.fn()
    makeScrollHandler(onFlip)(new WheelEvent('wheel', { deltaY: -100 }))
    expect(onFlip).toHaveBeenCalledWith(1)
  })

  test('no double-fire during lock', () => {
    const onFlip = vi.fn()
    const handler = makeScrollHandler(onFlip)
    handler(new WheelEvent('wheel', { deltaY: 100 }))
    handler(new WheelEvent('wheel', { deltaY: 100 }))
    handler(new WheelEvent('wheel', { deltaY: 100 }))
    expect(onFlip).toHaveBeenCalledTimes(1)
  })

  test('fires again after lock if pendingDelta >= 60', () => {
    const onFlip = vi.fn()
    const handler = makeScrollHandler(onFlip)
    handler(new WheelEvent('wheel', { deltaY: 100 }))
    handler(new WheelEvent('wheel', { deltaY: 80 }))
    vi.runAllTimers()
    expect(onFlip).toHaveBeenCalledTimes(2)
  })

  test('does not fire again if pendingDelta < 60', () => {
    const onFlip = vi.fn()
    const handler = makeScrollHandler(onFlip)
    handler(new WheelEvent('wheel', { deltaY: 100 }))
    handler(new WheelEvent('wheel', { deltaY: 30 }))
    vi.runAllTimers()
    expect(onFlip).toHaveBeenCalledTimes(1)
  })
})
