import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import { useCountdown } from '@/hooks/useCountdown'

beforeEach(() => { vi.useFakeTimers(); vi.setSystemTime(new Date('2026-11-24T12:59:58+07:00')) })
afterEach(() => vi.useRealTimers())

it('giảm giây mỗi tick và dừng ở giờ lễ', () => {
  const { result } = renderHook(() => useCountdown('2026-11-24T13:00:00+07:00'))
  expect(result.current.seconds).toBe(2)
  act(() => vi.advanceTimersByTime(1000))
  expect(result.current.seconds).toBe(1)
  act(() => vi.advanceTimersByTime(1000))
  expect(result.current).toEqual({ days: 0, hours: 0, minutes: 0, seconds: 0, done: true })
  expect(vi.getTimerCount()).toBe(0)
})

it('dọn interval khi unmount', () => {
  const { unmount } = renderHook(() => useCountdown('2026-11-24T13:00:00+07:00'))
  expect(vi.getTimerCount()).toBe(1)
  unmount()
  expect(vi.getTimerCount()).toBe(0)
})

it('đổi mốc và thay interval khi startsAt thay đổi', () => {
  const { result, rerender } = renderHook(({ startsAt }) => useCountdown(startsAt), {
    initialProps: { startsAt: '2026-11-24T13:00:00+07:00' },
  })
  rerender({ startsAt: '2026-11-24T17:00:00+07:00' })
  expect(result.current.hours).toBe(4)
  expect(vi.getTimerCount()).toBe(1)
})

it('tính lại theo đồng hồ thật sau khi tab bị treo', () => {
  const { result } = renderHook(() => useCountdown('2026-11-24T13:00:00+07:00'))
  vi.setSystemTime(new Date('2026-11-24T14:00:00+07:00'))
  act(() => vi.advanceTimersByTime(1000))
  expect(result.current.done).toBe(true)
})
