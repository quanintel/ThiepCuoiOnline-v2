import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import { canSubmit, markSubmitted } from '@/lib/throttle'

beforeEach(() => localStorage.clear())
afterEach(() => { vi.restoreAllMocks(); vi.unstubAllGlobals(); vi.useRealTimers() })

it('cho gửi lần đầu và chặn đến đúng mốc 30 giây', () => {
  expect(canSubmit('rsvp', 0)).toBe(true)
  markSubmitted('rsvp', 0)
  expect(canSubmit('rsvp', 0)).toBe(false)
  expect(canSubmit('rsvp', 29_999)).toBe(false)
  expect(canSubmit('rsvp', 30_000)).toBe(true)
})
it('giữ riêng thời điểm theo key', () => {
  markSubmitted('rsvp', 1000)
  expect(canSubmit('wish', 1000)).toBe(true)
})
it('dùng đồng hồ hiện tại khi không truyền now', () => {
  vi.useFakeTimers(); vi.setSystemTime(new Date('2026-11-01T00:00:00Z'))
  markSubmitted('wish')
  expect(canSubmit('wish')).toBe(false)
  vi.advanceTimersByTime(30_000)
  expect(canSubmit('wish')).toBe(true)
})
it.each(['broken', 'NaN', 'Infinity', '', '  '])('bỏ qua thời điểm hỏng %j', (value) => {
  markSubmitted('wish', 1000)
  localStorage.setItem(localStorage.key(0)!, value)
  expect(canSubmit('wish', 1000)).toBe(true)
})
it('không khóa người dùng khi đồng hồ bị lùi', () => {
  markSubmitted('wish', 60_000)
  expect(canSubmit('wish', 1000)).toBe(true)
})
it('getItem và setItem ném lỗi vẫn cho phép gửi, không làm trang lỗi', () => {
  vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => { throw new Error('blocked') })
  vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('quota') })
  expect(canSubmit('wish')).toBe(true)
  expect(() => markSubmitted('wish')).not.toThrow()
})
it('kể cả truy cập thuộc tính localStorage bị SecurityError cũng không ném', () => {
  vi.spyOn(window, 'localStorage', 'get').mockImplementation(() => { throw new DOMException('blocked', 'SecurityError') })
  expect(canSubmit('wish')).toBe(true)
  expect(() => markSubmitted('wish')).not.toThrow()
})
