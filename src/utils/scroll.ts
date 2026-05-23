import type { FlipDirection } from '../types'

const DUR = 160
const OVLP = 60
const ANIM_LOCK = (DUR - OVLP) + DUR + 60
const DELTA_PER_FLIP = 60

export function makeScrollHandler(onFlip: (dir: FlipDirection) => void) {
  let animating = false
  let pendingDelta = 0

  function tryFlip(dir: FlipDirection) {
    if (animating) return
    animating = true
    pendingDelta = 0
    onFlip(dir)
    setTimeout(() => {
      animating = false
      if (Math.abs(pendingDelta) >= DELTA_PER_FLIP) {
        tryFlip(pendingDelta < 0 ? 1 : -1)
      }
    }, ANIM_LOCK)
  }

  return function handleWheel(e: WheelEvent) {
    e.preventDefault()
    e.stopPropagation()
    pendingDelta += e.deltaY
    tryFlip(e.deltaY < 0 ? 1 : -1)
  }
}
