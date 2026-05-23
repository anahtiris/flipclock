export function daysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate()
}

export function clampDay(tens: number, units: number, year: number, month: number): [number, number] {
  if (tens === 0 && units === 0) return [0, 1]
  const max = daysInMonth(year, month)
  const value = tens * 10 + units
  if (value > max) return [Math.floor(max / 10), max % 10]
  return [tens, units]
}

export function clampMonth(tens: number, units: number): [number, number] {
  if (tens === 0 && units === 0) return [0, 1]
  if (tens > 1 || (tens === 1 && units > 2)) return [1, 2]
  return [tens, units]
}

export function clampHour12(hour: number): number {
  if (hour < 1) return 12
  if (hour > 12) return 1
  return hour
}

export function clampHour24(hour: number): number {
  return ((hour % 24) + 24) % 24
}

export function clampMinSec(value: number): number {
  return ((value % 60) + 60) % 60
}
