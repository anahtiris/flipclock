import { memo, useRef, useEffect } from 'react'
import type { FlipClockTheme, FlipClockSize, FlipDirection } from '../../types'
import { FLIP_DURATION_MS, FLIP_OVERLAP_MS, makeScrollHandler } from '../../utils/scroll'
import './FlipCard.css'

function setText(layer: HTMLDivElement, val: string) {
  const d = layer.querySelector<HTMLDivElement>('.fc-d')
  if (d) d.textContent = val
}

function animateFlip(
  flapTop: HTMLDivElement, flapBot: HTMLDivElement,
  backTop: HTMLDivElement, backBot: HTMLDivElement,
  from: string, to: string, dir: FlipDirection,
): ReturnType<typeof setTimeout> {
  const exit = `${FLIP_DURATION_MS}ms ease-in-out forwards`
  const enter = `${FLIP_DURATION_MS}ms ease-in-out ${FLIP_DURATION_MS - FLIP_OVERLAP_MS}ms forwards`

  if (dir === -1) {
    setText(backTop, to)
    setText(backBot, from)
    setText(flapTop, from)
    setText(flapBot, to)
    flapTop.style.animation = `fc-exit-flap ${exit}`
    flapBot.style.transform = 'rotateX(90deg)'
    flapBot.style.animation = `fc-enter-flap ${enter}`
  } else {
    setText(backBot, to)
    setText(backTop, from)
    setText(flapBot, from)
    setText(flapTop, to)
    flapBot.style.animation = `fc-exit-flap ${exit}`
    flapTop.style.transform = 'rotateX(90deg)'
    flapTop.style.animation = `fc-enter-flap ${enter}`
  }

  return setTimeout(() => {
    for (const el of [flapTop, flapBot, backTop, backBot]) {
      setText(el, to)
      el.style.animation = ''
      el.style.transform = ''
    }
  }, FLIP_DURATION_MS + FLIP_DURATION_MS - FLIP_OVERLAP_MS + 40)
}

export interface FlipCardProps {
  value: string
  theme: FlipClockTheme
  size: FlipClockSize
  wide?: boolean
  dir?: FlipDirection
  onScroll?: (dir: FlipDirection) => void
}

export const FlipCard = memo(function FlipCard({
  value, theme, size, wide = false, dir = -1, onScroll,
}: FlipCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const backTopRef = useRef<HTMLDivElement>(null)
  const backBotRef = useRef<HTMLDivElement>(null)
  const flapTopRef = useRef<HTMLDivElement>(null)
  const flapBotRef = useRef<HTMLDivElement>(null)
  const prevValue = useRef(value)
  const onScrollRef = useRef(onScroll)
  onScrollRef.current = onScroll

  useEffect(() => {
    let timerId: ReturnType<typeof setTimeout> | undefined
    if (
      prevValue.current !== value &&
      backTopRef.current && backBotRef.current &&
      flapTopRef.current && flapBotRef.current
    ) {
      timerId = animateFlip(
        flapTopRef.current, flapBotRef.current,
        backTopRef.current, backBotRef.current,
        prevValue.current, value, dir,
      )
    }
    prevValue.current = value
    return () => clearTimeout(timerId)
  }, [value, dir])

  useEffect(() => {
    const el = cardRef.current
    if (!el) return
    const handler = makeScrollHandler((d) => onScrollRef.current?.(d))
    el.addEventListener('wheel', handler, { passive: false })
    return () => el.removeEventListener('wheel', handler)
  }, [])

  return (
    <div ref={cardRef} className={`fc-card fc-${theme} fc-${size}${wide ? ' fc-card--wide' : ''}`}>
      <div ref={backTopRef} className="fc-back-top"><div className="fc-d">{value}</div></div>
      <div ref={backBotRef} className="fc-back-bottom"><div className="fc-d">{value}</div></div>
      <div ref={flapTopRef} className="fc-flap-top"><div className="fc-d">{value}</div></div>
      <div ref={flapBotRef} className="fc-flap-bottom"><div className="fc-d">{value}</div></div>
      <div className="fc-crease" />
    </div>
  )
})
