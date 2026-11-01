import { expect, it } from 'vitest'
import { buildMonth } from '@/lib/month'

it('tháng 11/2026 bắt đầu Chủ nhật, có 30 ngày, 24 là Thứ Ba', () => {
  const weeks = buildMonth(2026, 11)
  expect(weeks[0][0]).toBe(1)
  expect(weeks.flat().filter((day) => day !== null)).toEqual(Array.from({ length: 30 }, (_, i) => i + 1))
  expect(weeks.find((week) => week.includes(24))?.[2]).toBe(24)
  expect(weeks.every((week) => week.length === 7)).toBe(true)
  expect(weeks.at(-1)).toEqual([29, 30, null, null, null, null, null])
})

it('đệm đầu tháng và tính đúng năm nhuận', () => {
  const weeks = buildMonth(2024, 2)
  expect(weeks[0]).toEqual([null, null, null, null, 1, 2, 3])
  expect(weeks.flat().filter(Boolean)).toHaveLength(29)
})

it.each([0, 13, 1.5])('từ chối tháng không hợp lệ %s', (month) => {
  expect(() => buildMonth(2026, month)).toThrow(RangeError)
})
