import { act, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, expect, it, vi } from 'vitest'
import { DeferredContent } from '@/components/DeferredContent'

afterEach(() => vi.unstubAllGlobals())

it('giữ chỗ, chỉ mount nội dung gần viewport rồi ngừng quan sát', () => {
  let notify!: IntersectionObserverCallback
  const disconnect = vi.fn()
  vi.stubGlobal('IntersectionObserver', vi.fn(function (callback) {
    notify = callback
    return { observe: vi.fn(), disconnect }
  }))
  render(<DeferredContent minHeight={600}><p>Nội dung nặng</p></DeferredContent>)
  expect(screen.queryByText('Nội dung nặng')).not.toBeInTheDocument()
  expect(screen.getByRole('status')).toHaveStyle({ minHeight: '600px' })
  act(() => notify([{ isIntersecting: true }] as IntersectionObserverEntry[], {} as IntersectionObserver))
  expect(screen.getByText('Nội dung nặng')).toBeInTheDocument()
  expect(disconnect).toHaveBeenCalled()
})

it('không có IntersectionObserver vẫn hiển thị nội dung', () => {
  vi.stubGlobal('IntersectionObserver', undefined)
  render(<DeferredContent minHeight={600}><p>Nội dung nặng</p></DeferredContent>)
  expect(screen.getByText('Nội dung nặng')).toBeInTheDocument()
})

it('bàn phím có thể focus khung giữ chỗ để tải nội dung ngoài viewport', () => {
  render(<DeferredContent minHeight={600}><button>Trường bên dưới</button></DeferredContent>)
  const container = screen.getByRole('status').parentElement!
  expect(container).toHaveAttribute('tabindex', '0')
  fireEvent.focus(container)
  expect(screen.getByRole('button', { name: 'Trường bên dưới' })).toBeInTheDocument()
})
