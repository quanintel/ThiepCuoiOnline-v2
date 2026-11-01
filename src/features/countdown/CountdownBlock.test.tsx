import { act, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import { ceremonies } from '@/config/content'
import { CountdownBlock } from '@/features/countdown/CountdownBlock'

beforeEach(() => { vi.useFakeTimers(); vi.setSystemTime(new Date('2026-11-23T10:56:56+07:00')) })
afterEach(() => vi.useRealTimers())

it('hiện tên lễ, bốn ô số và không đọc từng giây', () => {
  render(<CountdownBlock ceremony={ceremonies[0]} />)
  expect(screen.getByRole('heading', { name: 'Lễ Vu Quy' })).toBeInTheDocument()
  expect(screen.getByRole('timer', { name: 'Còn 1 ngày' })).toHaveAttribute('aria-live', 'off')
  expect(screen.getAllByRole('definition').map((cell) => cell.textContent)).toEqual(['01', '02', '03', '04'])
  expect(screen.getAllByRole('term').map((cell) => cell.textContent)).toEqual(['Ngày', 'Giờ', 'Phút', 'Giây'])
})

it('chuyển sang thông báo đã diễn ra tại giờ lễ', () => {
  vi.setSystemTime(new Date('2026-11-24T12:59:59+07:00'))
  render(<CountdownBlock ceremony={ceremonies[0]} />)
  act(() => vi.advanceTimersByTime(1000))
  expect(screen.getByText('Lễ đã diễn ra')).toBeInTheDocument()
  expect(screen.queryByRole('definition')).not.toBeInTheDocument()
})
