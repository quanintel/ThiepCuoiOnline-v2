import { act, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import { useReveal } from '@/hooks/useReveal'

let notify: IntersectionObserverCallback
const observe = vi.fn()
const disconnect = vi.fn()
const Observer = vi.fn(function (callback: IntersectionObserverCallback) {
  notify = callback
  return { observe, disconnect }
})

function Probe() {
  const { ref, visible } = useReveal()
  return <section ref={ref} data-testid="probe" data-visible={visible} />
}

beforeEach(() => {
  vi.clearAllMocks()
  vi.stubGlobal('IntersectionObserver', Observer)
  vi.stubGlobal('matchMedia', vi.fn(() => ({
    matches: false, addEventListener: vi.fn(), removeEventListener: vi.fn(),
  })))
})
afterEach(() => vi.unstubAllGlobals())

it('hiện một lần khi phần tử giao viewport', () => {
  render(<Probe />)
  expect(screen.getByTestId('probe')).toHaveAttribute('data-visible', 'false')
  expect(observe).toHaveBeenCalledWith(screen.getByTestId('probe'))
  act(() => notify([{ isIntersecting: false }] as IntersectionObserverEntry[], {} as IntersectionObserver))
  expect(screen.getByTestId('probe')).toHaveAttribute('data-visible', 'false')
  act(() => notify([{ isIntersecting: true }] as IntersectionObserverEntry[], {} as IntersectionObserver))
  expect(screen.getByTestId('probe')).toHaveAttribute('data-visible', 'true')
  expect(disconnect).toHaveBeenCalled()
  act(() => notify([{ isIntersecting: false }] as IntersectionObserverEntry[], {} as IntersectionObserver))
  expect(screen.getByTestId('probe')).toHaveAttribute('data-visible', 'true')
})

it('hiện ngay, không quan sát khi người dùng giảm chuyển động', () => {
  vi.stubGlobal('matchMedia', vi.fn(() => ({ matches: true })))
  render(<Probe />)
  expect(screen.getByTestId('probe')).toHaveAttribute('data-visible', 'true')
  expect(Observer).not.toHaveBeenCalled()
})

it('hiện nội dung nếu trình duyệt không có IntersectionObserver', () => {
  vi.stubGlobal('IntersectionObserver', undefined)
  render(<Probe />)
  expect(screen.getByTestId('probe')).toHaveAttribute('data-visible', 'true')
})

it('dọn observer khi unmount', () => {
  const { unmount } = render(<Probe />)
  unmount()
  expect(disconnect).toHaveBeenCalled()
})

it('hiện ngay khi chuyển sang giảm chuyển động trong lúc đang xem', () => {
  const addEventListener = vi.fn()
  const removeEventListener = vi.fn()
  vi.stubGlobal('matchMedia', vi.fn(() => ({ matches: false, addEventListener, removeEventListener })))
  const { unmount } = render(<Probe />)
  const change = addEventListener.mock.calls[0][1] as (event: { matches: boolean }) => void
  act(() => change({ matches: true }))
  expect(screen.getByTestId('probe')).toHaveAttribute('data-visible', 'true')
  expect(disconnect).toHaveBeenCalled()
  unmount()
  expect(removeEventListener).toHaveBeenCalledWith('change', change)
})
