import { describe, test, expect } from 'vitest'
import { daysInMonth, clampDay, clampMonth, clampHour12, clampHour24, clampMinSec } from '../utils/validation'

describe('daysInMonth', () => {
  test('Jan → 31', () => expect(daysInMonth(2026, 1)).toBe(31))
  test('Feb non-leap → 28', () => expect(daysInMonth(2025, 2)).toBe(28))
  test('Feb leap → 29', () => expect(daysInMonth(2024, 2)).toBe(29))
  test('Apr → 30', () => expect(daysInMonth(2026, 4)).toBe(30))
})

describe('clampDay', () => {
  test('[3,1] valid (31)', () => expect(clampDay(3, 1, 2026, 1)).toEqual([3, 1]))
  test('[3,2] → [3,1] (max 31)', () => expect(clampDay(3, 2, 2026, 1)).toEqual([3, 1]))
  test('[3,2] Apr → [3,0] (max 30)', () => expect(clampDay(3, 2, 2026, 4)).toEqual([3, 0]))
  test('[0,0] → [0,1] (min 01)', () => expect(clampDay(0, 0, 2026, 1)).toEqual([0, 1]))
  test('[2,9] Feb non-leap → [2,8]', () => expect(clampDay(2, 9, 2025, 2)).toEqual([2, 8]))
})

describe('clampMonth', () => {
  test('[0,0] → [0,1]', () => expect(clampMonth(0, 0)).toEqual([0, 1]))
  test('[1,2] valid (12)', () => expect(clampMonth(1, 2)).toEqual([1, 2]))
  test('[1,5] → [1,2]', () => expect(clampMonth(1, 5)).toEqual([1, 2]))
  test('[2,0] → [1,2] (tens > 1)', () => expect(clampMonth(2, 0)).toEqual([1, 2]))
  test('[9,9] → [1,2] (tens way out of range)', () => expect(clampMonth(9, 9)).toEqual([1, 2]))
})

describe('clampHour12', () => {
  test('0 → 12', () => expect(clampHour12(0)).toBe(12))
  test('12 valid', () => expect(clampHour12(12)).toBe(12))
  test('13 → 1', () => expect(clampHour12(13)).toBe(1))
})

describe('clampHour24', () => {
  test('0 valid', () => expect(clampHour24(0)).toBe(0))
  test('23 valid', () => expect(clampHour24(23)).toBe(23))
  test('24 → 0', () => expect(clampHour24(24)).toBe(0))
  test('-1 → 23', () => expect(clampHour24(-1)).toBe(23))
})

describe('clampMinSec', () => {
  test('0 valid', () => expect(clampMinSec(0)).toBe(0))
  test('59 valid', () => expect(clampMinSec(59)).toBe(59))
  test('60 → 0', () => expect(clampMinSec(60)).toBe(0))
  test('-1 → 59', () => expect(clampMinSec(-1)).toBe(59))
})
